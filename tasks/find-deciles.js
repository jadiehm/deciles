// Dependencies
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

// Input / Output paths
const inputFolder = './INPUT/'; 
const outputDir = './OUTPUT/';

// Outpur csv files
const outputFile = path.join(outputDir, 'combined_dataset.csv');
const decileFile = path.join(outputDir, 'decile_cutoffs.csv');

// Flag to include negative values in decile calculations
const includeNegatives = false;

// List of year and variable pairs (this array gets looped, so adding in more years here will process them too as long as there is corressponding INPUT data and and OUTPUT folder)
const yearVars = [
    { year: 2000, var: 'FINCATAX' }, 
    { year: 2023, var: 'FINATXEM' }
];

// Runs the full pipeline for each year-variable pair
async function runPipeline() {
    for (const item of yearVars) {
        console.log(`Starting Process for Year: ${item.year} (Variable: ${item.var})`);
           
        // Year specific input/output paths
        const inputFolder = `./INPUT/${item.year}/`;
        const outputDir = `./OUTPUT/${item.year}/`;

        // Outputs a combined csv with NEWID and target variable, and a decile cutoff csv
        const outputFile = path.join(outputDir, `combined_dataset_${item.year}.csv`);
        const decileFile = path.join(outputDir, `decile_cutoffs_${item.year}.csv`);

        try {
            // 1. Setup directories and csv writer with columns
            await fs.mkdir(outputDir, { recursive: true });
            const csvWriter = createObjectCsvWriter({
                path: outputFile,
                header: [
                    { id: 'NEWID', title: 'NEWID' },
                    { id: item.var, title: item.var }
                ]
            });

            // 2. Read all csv files in input folder
            const dirContents = await fs.readdir(inputFolder);
            const files = dirContents.filter(file => file.endsWith('.csv'));
            let combinedData = [];

            // For each of those csv files, read and extract NEWID and target variable
            for (const file of files) {
                const filePath = path.join(inputFolder, file);
                //Saves data from csv
                const data = await new Promise((resolve, reject) => {
                    const results = [];
                    createReadStream(filePath)
                        .pipe(csv())
                        .on('data', (row) => {
                            const rawValue = row[item.var];
                            const val = parseFloat(rawValue);

                            results.push({
                                NEWID: row['NEWID'],
                                [item.var]: rawValue // Dynamic key assignment
                            });
                        })
                        .on('end', () => resolve(results))
                        .on('error', reject);
                });
                // Merges into a combined array
                combinedData = combinedData.concat(data);
            }

            // 3. Save combined CSV
            await csvWriter.writeRecords(combinedData);
            console.log(`Combined file saved: ${outputFile}`);

            // 4. Generate deciles (executes the below funciton)
            await generateDecileReport(combinedData, item.var, decileFile);

        } catch (error) {
            console.error(`Error in year ${item.year}:`, error.message);
        }
    }
}

// Generates decile report for a given variable and saves to csv
async function generateDecileReport(data, targetVar, filePath, includeNegatives) {
    // 1. Map to numbers and filter out NaNs (values that don't exist or aren't numbers)
    let values = data
        .map(d => parseFloat(d[targetVar]))
        .filter(v => !isNaN(v));

    // 2. Logic to exclude negatives if the flag is false
    if (!includeNegatives) {
        const countBefore = values.length;
        values = values.filter(v => v >= 0);
        const excluded = countBefore - values.length;
        if (excluded > 0) {
            console.log(`Excluded ${excluded} negative values from decile calculations.`);
        }
    }

    // 3. Sort for decile calculation
    values.sort((a, b) => a - b);

    if (values.length === 0) {
        console.log(`No valid data to calculate deciles for this year.`);
        return;
    }

    // Sets up csv writer for deciles
    const decileWriter = createObjectCsvWriter({
        path: filePath,
        header: [
            { id: 'decile', title: 'decile' },
            { id: 'min', title: 'min' },
            { id: 'max', title: 'max' }
        ]
    });

    // Organizes decile data by splitting the sorted values into 10 equal groups
    const deciles = [];
    for (let i = 1; i <= 10; i++) {
        const startIdx = Math.floor((i - 1) * (values.length / 10));
        const endIdx = Math.min(Math.floor(i * (values.length / 10)) - 1, values.length - 1);

        deciles.push({
            decile: i,
            min: Math.round(values[startIdx] / 1000) * 1000,
            max: Math.round(values[endIdx] / 1000) * 1000
        });
    }

    await decileWriter.writeRecords(deciles);
    console.log(`Deciles saved to: ${filePath}`);
}

runPipeline();