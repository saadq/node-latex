'use strict'

const strToStream = require('string-to-stream')
const spawn = require('child_process').spawn
const through = require('through2')
const fse = require('fs-extra')
const temp = require('temp')
const path = require('path')
const fs = require('fs')

function latex (src, options) {
  const outputStream = through()

  const handleErrors = (err) => {
    outputStream.emit('error', err)
    outputStream.destroy()
  }

  temp.mkdir('node-latex', (err, tempPath) => {
    if (err) {
      handleErrors(err)
    }

    let inputStream

    if (!src) {
      handleErrors(new Error('Error: No TeX document provided.'))
    }

    if (typeof src === 'string') {
      inputStream = strToStream(src)
    } else if (src.pipe) {
      inputStream = src
    } else {
      handleErrors(new Error('Error: Invalid TeX document.'))
    }

    options = options || {}
    let inputs = options.inputs || tempPath
    let cmd = options.cmd || 'pdflatex'

    const isTexCmd = (cmd) => ['pdflatex', 'xetex', 'latex'].indexOf(cmd) !== -1

    const joinInputs = (inputs) =>
      Array.isArray(inputs)
        ? inputs.join(':') + ':'
        : inputs + ':'

    cmd = isTexCmd(cmd) ? cmd : 'pdflatex'
    inputs = joinInputs(inputs)

    const args = [
      '-halt-on-error',
      `-output-directory=${tempPath}`
    ]

    const opts = {
      cwd: tempPath,
      env: Object.assign({}, process.env, { TEXINPUTS: inputs })
    }

    const tex = spawn(cmd, args, opts)

    inputStream.pipe(tex.stdin)

    // If LaTeX exits with a compilation error, it will close stdin and
    // stream.pipe() will emit EPIPE. Catch it here; otherwise EPIPE is thrown
    // and Node will crash.
    tex.stdin.on('error', handleErrors);

    tex.on('error', () => {
      handleErrors(new Error(`Error: Unable to run ${cmd} command.`))
    })

    tex.on('exit', (code) => {
      if (code !== 0) {
        handleErrors(new Error('Error during LaTeX compilation.'))
        // Don't try to read the PDF if compilation failed; it may not exist.
        return;
      }

      const pdfPath = path.join(tempPath, 'texput.pdf')
      const pdfStream = fs.createReadStream(pdfPath)

      pdfStream.pipe(outputStream)
      pdfStream.on('close', () => fse.removeSync(tempPath))
    })
  })

  return outputStream
}

module.exports = latex
