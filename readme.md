# node-latex
A small wrapper for generating PDFs with LaTeX in Node.

## Install

```
npm install node-latex
```

## Usage

```js
const latex = require('node-latex')

const doc = `
  \\documentclass[line,margin]{doc}
  \\begin{document}
  Hello World
  \\end{document}
`

latex(doc).then(pdfStream => {
  // Use PDF stream here...
})
```

## API

### latex(options)

**options.doc** [String] (Required) - A string of the (La)TeX document you want to use.

**options.dir** [String] (Optional) - The absolute path to the directory which contains the assets necessary for the doc.

**options.cmd** [String] (Optional) - The command to run for your document (`pdflatex`, `xetex`, etc). `pdflatex` is the default.

## License
MIT
