import createUser from './modules/createUser/createUser.route.js'
import compare from './modules/compare/controller.route.js'
import searchRoute from './modules/search/search.route.js'

export default async function router (server) {
  server.register(createUser, { prefix: '/' })
  server.register(compare, { prefix: '/' })
  server.register(searchRoute, { prefix: '/' })
}
