import { createNewUserController } from './createUser.controller.js'

export default async (fastify) => {
  fastify.post('/user/create', {}, createNewUserController)
}
