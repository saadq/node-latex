'use strict'

const { createReadStream, writeFile } = require('fs-promise')
const { spawn } = require('child-process-promise')
const { copy } = require('fs-extra-promise-es6')
const { join } = require('path')
const temp = require('temp')
const co = require('co')

// Automatically track and cleanup temp files at exit
temp.track()

/**
 * Generate a PDF stream from a TeX String.
 *
 * @param {string} opts.doc - The TeX source document.
 * @param {string} opts.dir - The absolute path to the directory with the assets needed for the doc.
 * @param {string} opts.cmd - The specific LaTeX command to run (pdflatex, xetex, etc).
 *
 * @return {Promise<ReadableStream>} - The generated PDF.
 */
function latex ({ doc, dir, cmd = 'pdflatex' }) {
  if (!doc) {
    throw new Error('Error: You must provide a LaTeX document.')
  }

  return co(function * () {
    try {
      const tempPath = yield mkdirTemp('latex')
      const texFilePath = join(tempPath, 'doc.tex')
      yield writeFile(texFilePath, doc)

      if (dir) {
        yield copy(dir, tempPath)
      }

      process.chdir(tempPath)
      yield spawn(cmd, ['doc.tex', '-halt-on-error'])
      const pdf = createReadStream(join(tempPath, 'doc.pdf'))

      temp.cleanup()

      return pdf
    } catch (err) {
      throw err
    }
  })
}

/**
 * Creates a temp directory to hold the LaTeX output files.
 *
 * @param {string} path - Path of the directory to be created.
 *
 * @return {Promise<string>}
 */
function mkdirTemp (path) {
  return new Promise(function (resolve, reject) {
    temp.mkdir(path, function (err, tmpPath) {
      if (err) reject(err)
      resolve(tmpPath)
    })
  })
}

module.exports = latex
