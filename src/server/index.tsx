import { Middleware } from 'koa'
import compose from 'koa-compose'
import mount from 'koa-mount'

import codegen from 'codegen.macro'

import html from './html'

export function middleware () {
  const responseTime: Middleware = async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
  }

  const app = mount('/', ctx => {
    ctx.body = html(ctx)
  })

  return compose([
    responseTime,
    app
  ])
}

codegen`
  const code = \`
    const functions = require('firebase-functions')
    const Koa = require('koa')

    const app = new Koa()
    app.use(middleware())

    exports.app = functions
      .https.onRequest(app.callback())
  \`

  module.exports = process.env.MODE === 'production' ? code : ''
`
