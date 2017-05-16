import Router from 'koa-router'

import combiner from './routes-combiner'
import upload from './upload'

const router = new Router()

router.prefix('/')

router.get('/', ctx => {
  ctx.render('index')
})

const routes = combiner(
  router,
  upload
)

export default routes
