import { Readable, Transform } from 'stream'

/**
 * node-latex options
 */
export interface LatexOptions {
  /**
   * The absolute path (or an array of absolute paths) to the directory which
   * contains the assets necessary for the doc.
   */
  inputs?: string | string[]

  /**
   * The absolute path (or an array of absolute paths) to the directory which
   * contains the fonts necessary for the doc (you will most likely want to use
   * this option if you're working with fontspec).
   */
  fonts?: string | string[]

  /**
   * The command to run for your document (pdflatex, xetex, etc). pdflatex is the
   * default.
   */
  cmd?: string

  /**
   * Arguments passed to cmd. Defaults to ['-halt-on-error'].
   */
  args?: string[]

  /**
   * The number of times to run options.cmd. Some documents require multiple
   * passes. Only works when doc is a String. Defaults to 1.
   */
  passes?: number

  /**
   * The path to the file where you want to save the contents of the error log
   * to.
   */
  errorLogs?: string
}

/**
 * Compiles latex to pdf document
 *
 * @param doc
 * The (La)TeX document you want to use.
 *
 * @param options
 * The compiler options
 */
declare function latex(
  doc: Readable | string,
  options?: LatexOptions
): Transform

export default latex
