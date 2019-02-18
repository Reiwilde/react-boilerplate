import { stringifyRequest } from 'loader-utils'
import { loader as wLoader } from 'webpack'

const loader: wLoader.Loader = function (source) {
  return source
}

export default loader

interface IPitch extends Function {
  (this: wLoader.LoaderContext, remainingRequest: string): string
}

export const pitch: IPitch = function (remainingRequest) {
  return `
    var content = require(${stringifyRequest(this, '!' + remainingRequest)})

    module.exports = content.locals
    module.exports.css = content[0][1]
  `
}
