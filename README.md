# Svelte Starter

## Deciles
Source data comes from raw interviews from the Consumer Expenditure Survey's [PUMB Data Files](https://www.bls.gov/cex/pumd_data.htm#csv), which includes complete data for 1980–2023. Data for 2024 does not yet include the variable we need.

### Steps

#### Download data
Download a csv of `Interview (zip)` for your selected year from the [PUMB Data Files](https://www.bls.gov/cex/pumd_data.htm#csv).

Also download the [Dictionary for Interview and Diary Surveys (XLSX)](https://www.bls.gov/cex/pumd_data.htm#csv:~:text=Dictionary%20for%20Interview%20and%20Diary%20Surveys%20(XLSX)). This will serve as your guide to selecting the correct varibles.

#### Check the data dictionary for the variables you need
We are looking for some variation on "Total amount of family income after taxes in the last 12 months." The exact wording may change from year to year, but it is important that the phrase includes "after taxes." To find this quickly, filter the `Variable description` column and reference the `First year` and `Last year` columns. Here's a sample of those differences:

| Year | File | Variable Name | Variable description |
| :--- | :--- | :--- | :--- |
| 2000 | FMLI | FINCATAX | Total amount of family income after taxes in the last 12 months (Collected data) |
| 2023 | FMLI | FINATXEM | Total amount of family income after estimated taxes in the last 12 months (Imputed or collected data) |

#### Move the files to the INPUT folder
Looking through `Interview (zip)` files that you downloaded, find all the files whose names start with the `File` variable from the data dictionary sheet. For both 2000 and 2023 it is `FMLI`. Copy all the `FMLI` csv files in the `INPUT` folder in this project. Make a seperate subfolder for each year.

#### Download dependencies to run script
In the console run these commands to download dependencies.
* `npm i fs`
* `npm i path`
* `npm i csv-parser`
* `npm i csv-writer`

#### Run the `find-deciles.js` script
In the console run `npm run deciles`. This script:
* Pulls in raw interview data from Consumer Expenditure Survey, and calculates deciles for each of the `yearVars` pairs, which contain the target year + the target `Variable Name` from the table above.
* First, the script loads in all the relevant data from each csv file in the `INPUT/[year]` folder.
* Then it creates a combined dataset with a row for each interview ID (`NEWID`) that has it's corresponding value for family after-tax income. This dataset gets saved as `combined_dataset_[year].csv` in the `OUPUT/[year]` directory.
* Next, the script finds the decile thresholds using the combined data. If the `includeNegatives` variable is `false` negative income values are not included. If the `includeZeros` variable is `false` income values of zero are not included.Decile thresholds are also currently rounded to the nearest thousand. This dataset gets saved as `decile_cutoffs_[year]` in the `OUTPUT/[year]` directory.



**NOTE**: This uses Svelte 5 and is under active migration (not all features will work). For the less adventurous, use the [previous version](https://github.com/the-pudding/svelte-starter) (with Svelte 4).

This [starter template](https://github.com/the-pudding/svelte-starter) aims to quickly scaffold a [SvelteKit](https://kit.svelte.dev/) project, designed around data-driven, visual stories at [The Pudding](https://pudding.cool).

### Notes
* _Do not use or reproduce The Pudding logos or fonts without written permission._
* _Prettier Formatting: Disable any text editor Prettier extensions to take advantage of the built-in rules._

### Features

- [ArchieML](http://archieml.org/) for micro-CMS powered by Google Docs and Sheets
- [Lucide Icons](https://lucide.dev/) for simple/easy svg icons
- [Style Dictionary](https://amzn.github.io/style-dictionary/) for CSS/JS style parity
- [Runed](https://runed.dev/docs) for svelte5 rune utilities
- CSV, JSON, and SVG imports
- SSR static-hosted builds by default

## Quickstart
#### From Scratch
* Click the green `Use this template` button above.
* Alternatively: `npx degit the-pudding/svelte-starter my-project`

#### Pre-existing Project
* clone the repo

#### Installation
* In your local repo run `pnpm install` or `npm install`

## Development

```bash
npm run dev
```

Change the script in `package.json` to `"dev": "svelte-kit dev --host"` to test on your local network on a different device.

## Deploy
Check out the `Makefile` for specific tasks.

### Staging (on Github)
```bash
npm run staging
```

### Production (on AWS for pudding.cool)
```bash
npm run prodution
```

### Manual
```bash
npm run build
```
This generates a directory called `build` with the statically rendered app.

### Password-Protected
To create a password-protected build:

Make sure you have a `.env` file in your root with a value of `PASSWORD=yourpassword` 
```bash
make protect
```

Then run either `make github` or `make pudding`.

## Style

There are a few stylesheets included by default in `src/styles`. Refer to them in `app.css`, the place for applying global styles.

For variable parity in both CSS and JS, modify files in the `properties` folder using the [Style Dictionary](https://amzn.github.io/style-dictionary/) API.

Run `npm run style` to regenerate the style dictionary.

#### Some css utility classes in reset.css
* `.sr-only`: makes content invisible available for screen reader
* `.text-outline`: adds a psuedo stroke to text element

### Custom Fonts
For locally hosted fonts, simply add the font to the `static/assets` folder and include a reference in `src/styles/font.css`, making sure the url starts with `"assets/..."`.

## Google Docs and Sheets

* Create a Google Doc or Sheet
* Click `Share` -> `Advanced` -> `Change...` -> `Anyone with this link`
* In the address bar, grab the ID - eg. "...com/document/d/**1IiA5a5iCjbjOYvZVgPcjGzMy5PyfCzpPF-LnQdCdFI0**/edit"
* paste in the ID above into `google.config.js`, and set the filepath to where you want the file saved
* If you want to do a Google Sheet, be sure to include the `gid` value in the url as well

Running `npm run gdoc` at any point (even in new tab while server is running) will fetch the latest from all Docs and Sheets.

## Structural Overview

### Pages
The `src/routes` directory contains pages for your app. For a single-page app (most cases) you don't have to modify anything in here. `+page.svelte` represents the root page, think of it as the `index.html` file. It is prepopulated with a few things like metadata and font preloading. It also includes a reference to a blank slate component `src/components/Index.svelte`. This is the file you want to really start in for your app.

### Embedding Data
For smaller datasets, it is often great to embed the data into the HTML file. If you want to use data as-is, you can use normal import syntax (e.g., `import data from "$data/file.csv"`). If you are working with data but you want to preserve the original or clean/parse just what you need to use in the browser to optimize the front-end payload, you can load it via `+page.server.js`, do some work on it, and return just what you need. This is passed automatically to `+page.svelte` and accessible in any component with `getContext("data")`.


## Pre-loaded helpers

### Components

Located in `src/components`.

```js
// Usage
import Example from "$components/Example.svelte";
```

* `Footer.svelte`: Pudding recirculation and social links.
* `Header.svelte`: Pudding masthead.

### Helper Components

Located in `src/components/helpers`.

```js
// Usage
import Example from "$components/helpers/Example.svelte";
```

*Available*
* `Scrolly.svelte`: Scrollytelling.

*Need to migrate*
* `ButtonSet.svelte`: Accessible button group inputs.
* `Chunk.svelte`: Split text into smaller dom element chunks.
* `Countdown.svelte`: Countdown timer text.
* `DarkModeToggle.svelte`: A toggle button for dark mode.
* `Figure.svelte`: A barebones chart figure component to handle slots.
* `MotionToggle.svelte`: A toggle button to enable/disable front-end user motion preference.
* `Range.svelte`: Customizable range slider.
* `ShareLink.svelte`: Button to share link natively/copy to clipboard.
* `SortTable.svelte`: Sortable semantic table with customizable props.
* `Slider.svelte (and Slider.Slide.svelte)`: A slider widget, especially useful for swipe/slide stories.
* `Tap.svelte`: Edge-of-screen tapping library, designed to integrate with slider.
* `Tip.svelte`: Button that links to Strip payment link.
* `Toggle.svelte`: Accessible toggle inputs.

### Headless Components

[bits UI](https://www.bits-ui.com/docs/introduction) comes pre-installed. It is recommended to use these for any UI components.

### Layercake Chart Components

Starter templates for various chart types to be used with [LayerCake](https://layercake.graphics/). Located in `src/components/layercake`.

*Note:* You must install the module `layercake` first.

```js
// Usage
import Example from "$components/layercake/Example.svelte";
```

### Actions

Located in `src/actions`.

```js
// Usage
import example from "$actions/action.js";
```

* `canTab.js`: enable/disable tabbing on child elements.
* `checkOverlap.js`: Label overlapping detection. Loops through selection of nodes and adds a class to the ones that are overlapping. Once one is hidden it ignores it.
* `focusTrap.js`: Enable a keyboard focus trap for modals and menus.
* `keepWithinBox.js`: Offsets and element left/right to stay within parent.
* `inView.js`: detect when an element enters or exits the viewport.
* `resize.js`: detect when an element is resized.

### Runes

These are located in `src/runes`. You can put custom ones in `src/runes/misc.js` or create unique files for more complex ones.

```js
import { example } from "$runes/misc/misc.js";
```

* `useWindowDimensions`: returns an object `{ width, height }` of the viewport dimensions. It is debounced for performance.
* `useClipboard`: copy content to clipboard.
* `useFetcher`: load async data from endpoints (local or external).
* `useWindowFocus`: determine if the window is in focus or not.

For more preset runes, use [runed](https://runed.dev/docs) which is preloaded. 

### Utils

Located in `src/utils/`.

```js
// Usage
import example from "$utils/example.js";
```
* `checkScrollDir.js`: Gets the user's scroll direction ("up" or "down")
* `csvDownload.js`: Converts a flat array of data to CSV content ready to be used as an `href` value for download.
* `generateId.js`: Generate an alphanumeric id.
* `loadCsv.js`: Loads and parses a CSV file.
* `loadImage.js`: Loads an image.
* `loadJson.js`: Loads and parses a JSON file.
* `loadPixels.js`: Loads the pixel data of an image via an offscreen canvas.
* `localStorage.js`: Read and write to local storage.
* `mapToArray.js`: Convenience function to convert a map to an array.
* `move.js`: transform translate function shorthand.
* `transformSvg.js`: Custom transition lets you apply an svg transform property with the in/out svelte transition. Parameters (with defaults):
* `translate.js`: Convenience function for transform translate css.
* `urlParams.js`: Get and set url parameters.

## Tips

### Image asset paths
For `img` tags, use relative paths:

```html
<img src="assets/demo/test.jpg" />
```

or use `base` if on a sub route:

```html
<script>
	import { base } from "$app/paths";
</script>

<img src="{base}/assets/demo/test.jpg"  />
```

For CSS background images, use absolute paths:

```css
background: url("/assets/demo/test.jpg");
```

View example code in the preloaded demo.
