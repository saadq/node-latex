# node-latex
A small wrapper for generating PDFs with LaTeX in Node.

## Requirements

LaTeX must be installed on your machine.  You can download it [here](https://www.latex-project.org/get/).

## Install

```
npm install node-latex
```

## Usage

```js
const latex = require('node-latex')
const fs = require('fs')

const input = fs.createReadStream('input.tex')
const output = fs.createWriteStream('output.pdf')
const pdf = latex(input)

pdf.pipe(output)
pdf.on('error', err => console.error(err))
pdf.on('finish', () => console.log('PDF generated!'))
```

View more examples [here](https://github.com/saadq/node-latex/tree/master/examples).

## API

### latex(doc[, options])

**doc** \[ReadableStream|String\] *Required* - The (La)TeX document you want to use.

**options.inputs** \[String|Array<String>\] - The path (or an array of paths) to the directory which contains the assets necessary for the doc.

**options.precompiled** \[String|Array<String>\] - The path  (or an array of paths) to the directory which contains the precompiled files necessary for the doc.

**options.fonts** \[String|Array<String>\] - The path (or an array of paths) to the directory which contains the fonts necessary for the doc (you will most likely want to use this option if you're working with `fontspec`).

**options.cmd** \[String\] - The command to run for your document (`pdflatex`, `xetex`, etc). `pdflatex` is the default.

**options.args** \[Array<String>\] - Arguments passed to `cmd`. Defaults to `['-halt-on-error']`.

**options.passes** \[Number\] - The number of times to run `options.cmd`. Some documents require multiple passes. Only works when `doc` is a String. Defaults to `1`.

**options.errorLogs** \[String] - The path to the file where you want to save the contents of the error log to.

## License
MIT
