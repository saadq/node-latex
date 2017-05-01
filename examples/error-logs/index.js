const { createReadStream, createWriteStream } = require('fs')
const { join } = require('path')
const latex = require('../..')

const input = createReadStream(join(__dirname, 'input.tex'))
const output = createWriteStream(join(__dirname, 'output.pdf'))

const options = {
  errorLogs: join(__dirname, 'latexerrors.log') // This will write the errors to `latexerrors.log`
}

latex(input, options).pipe(output)
