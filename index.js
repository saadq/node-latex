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
    // The number of times to run LaTeX.
    let passes = options.passes || 1
    let completedPasses = 0

    if (passes > 1 && typeof src !== 'string') {
      handleErrors(new Error('Error: You can\'t process a stream twice. Pass '
          + 'a string to use multiple passes'));
      return;
    }

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

    // Run LaTeX once on the document stream, then decide whether it needs to
    // happen again.
    let runLatex = (inputStream) => {
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

        // Schedule another run if necessary.
        completedPasses++;
        if (completedPasses >= passes) returnDocument();
        else runLatex(strToStream(src));
      })
    }

    // After the final run, return the PDF stream.
    let returnDocument = () => {
      const pdfPath = path.join(tempPath, 'texput.pdf')
      const pdfStream = fs.createReadStream(pdfPath)

      pdfStream.pipe(outputStream)
      pdfStream.on('close', () => fse.removeSync(tempPath))
    }

    // Start the first run.
    runLatex(inputStream);
  })

  return outputStream
}

module.exports = latex
