const { createReadStream, createWriteStream } = require('fs')
const { join, resolve } = require('path')
const latex = require('../..')

const input = createReadStream(join(__dirname, 'input.tex'))
const output = createWriteStream(join(__dirname, 'output.pdf'))

const options = {
  inputs: resolve(join(__dirname, 'tex-inputs')) // This can be an array of paths if desired
}

latex(input, options).pipe(output)
