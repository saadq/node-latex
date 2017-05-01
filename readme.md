# node-latex
A small wrapper for generating PDFs with LaTeX in Node.

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

latex(input).pipe(output)
```

## API

### latex(doc[, options])

**doc** \[ReadableStream|String\] *Required* - The (La)TeX document you want to use.

**options.inputs** \[String|Array<String>\] - The absolute path (or an array of absolute paths) to the directory which contains the assets necessary for the doc.

**options.cmd** \[String\] - The command to run for your document (`pdflatex`, `xetex`, etc). `pdflatex` is the default.

**options.passes** \[Number\] - The number of times to run `options.cmd`. Some documents require multiple passes. Only works when `doc` is a String. Defaults to `1`.

**options.errorLogs** \[String] - The path to the file where you want to save the contents of the error log to.

## License
MIT
