import { SheetsRegistry } from 'jss'
import { ParameterizedContext } from 'koa'
import React from 'react'
import { JssProvider } from 'react-jss'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

import { createGenerateClassName } from '@material-ui/core/styles'

import codegen from 'codegen.macro'
import preval from 'preval.macro'

import styles from '@libs/webpack-utils/style-loader'

import App from '@components/app'

export default function html (context: ParameterizedContext) {
  const generateClassName = createGenerateClassName()
  const sheetsRegistry = new SheetsRegistry()

  const app = renderToString(
    <JssProvider generateClassName={generateClassName} registry={sheetsRegistry}>
      <StaticRouter context={context} location={context.req.url}>
        <App />
      </StaticRouter>
    </JssProvider>
  )

  const jss = sheetsRegistry.toString()
  const css = styles.join('')

  const onload = preval`
    const onload = \`
      this.onload = null
      this.rel = 'stylesheet'
      var css = document.getElementById('css-ssr')
      if (css && css.parentNode) css.parentNode.removeChild(css)
    \`

    module.exports = onload
      .replace(/^\\s+|\\s+$/g, '')
      .replace(/(?<!var) /g, '')
      .replace(/\\n/g, ';')
  `

  const polyfill = {
    preload: preval`
      const fs = require('fs')
      module.exports = fs.readFileSync('node_modules/fg-loadcss/dist/cssrelpreload.min.js', 'utf8')
    `
  }

  return codegen`
    const html = \`
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="preload" href="/public/client.css" as="style" onload="\\\${onload}"/>
          <script>\\\${polyfill.preload}</script>
        </head>
        <body>
          <div id="app">\\\${app}</div>
          <style id="jss-ssr">\\\${jss}</style>
          <style id="css-ssr">\\\${css}</style>
          <script src="/public/client.js"></script>
        </body>
      </html>
    \`

    const final = html
      .split('\\n')
      .map((line => line.replace(/^\\s+|\\s+$/, '')))
      .join('')

    module.exports = '\`' + final + '\`'
  `
}
