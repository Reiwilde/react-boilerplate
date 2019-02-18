import { readFileSync } from 'fs'
import { createSecureServer } from 'http2'
import Koa from 'koa'
import compress from 'koa-compress'
import mount from 'koa-mount'
import serve from 'koa-static'
import webpack from 'webpack'

import config from './webpack.config'

const compiler = webpack(config)

compiler.watch({}, async () => {
  // clean cache to force reaload the module
  delete require.cache[require.resolve('./dist/server/server')]

  const { middleware } = await import('./dist/server/server' as any)

  app.context.middleware = middleware()
})

const app = new Koa()

app
  .use(compress())
  .use(mount('/public', serve('./dist/client/public')))
  .use(mount('/', (ctx, next) => {
    if (typeof ctx.middleware === 'function') ctx.middleware(ctx, next)
  }))

const server = createSecureServer({
  cert: readFileSync('cert/certificate.crt'),
  key: readFileSync('cert/private.key')
}, app.callback())

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

server.listen(port, () => console.log(`App is running on port ${port}`))
