import compose from 'koa-compose'

export default (...routers) => {
  const middleware = []

  routers.forEach( route => {
    middleware.push(route.routes())
    middleware.push(route.allowedMethods())
  })

  return compose(middleware)
}
