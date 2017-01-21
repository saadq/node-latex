const { resolve } = require('path')
const latex = require('..')

// (Required) Our LaTeX document.
const doc = `
  \\documentclass[line,margin]{doc}
  \\begin{document}
  Hello World
  \\end{document}
`

// (Optional) The absolute path to the directory with any assets for your document.
const dir = resolve(`${__dirname}/assets`)

// Pass your options to the `latex` function
latex({ doc, dir }).then(pdfStream => {
  // Do something with the PDF
})
