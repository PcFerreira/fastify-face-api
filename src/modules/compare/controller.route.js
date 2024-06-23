import { compareImagesController } from './compare.controller.js'

export default async (fastify) => {
  fastify.post('/compare', {}, compareImagesController)
}
