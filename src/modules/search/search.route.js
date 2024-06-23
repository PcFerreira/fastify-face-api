import {
  searchSimilarsController,
  getUserImageController
} from './search.controller.js'

export default async (fastify) => {
  fastify.post('/search', {}, searchSimilarsController)
  fastify.get('/image/:user_id', {}, getUserImageController)
}
