import Koa from 'koa'
import logger from 'koa-logger'
import Pug from 'koa-pug'

import routes from './routes'

const app = new Koa()

// Setting up the views engine
const pug = new Pug({
  viewPath: './views',
  basedir: './views',
  debug: false,
  pretty: false,
  compileDebug: false,
  app,
})

const server = () => {
  try {
    const DEFAULTPORT = 8000

    // Setting up the app
    app

      // Debugging
      .use(logger())

      // Extra modules
      .use(routes)

      // Starting the server
      .listen(DEFAULTPORT, err => {
        if (err) throw new Error(`\n|>  Something happened with the server: ${ err }`)
        console.log(`\n|>   Server started at port ${ DEFAULTPORT }`)
      })
      .on('error', err => {
        throw new Error(err)
      })
  } catch (e) {
    console.log(`\n|>    Something happened -> : ${ e }`)
  }

  return app
}

// Start the server
export default server()
