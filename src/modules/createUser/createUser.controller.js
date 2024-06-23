import { insertUserImage, insertUser } from './createUser.service.js'
import { generateTemplate } from '../../shared/faceApiClient.js'
import { v4 as uuidv4 } from 'uuid'
import { image } from '@tensorflow/tfjs-node'

export const createNewUserController = async (request, reply) => {
  try {
    const { base64Image } = request.body

    // Generate the image template
    const imageTemplate = await generateTemplate(base64Image)

    // If imageTemplate is null or undefined, return an error
    if (!imageTemplate) {
      return reply
        .status(400)
        .send({
          error: 'No face detected. Failed to generate image template.'
        })
    }

    // Create a new user ID
    const user_id = uuidv4()

    // Insert the user with the generated image template
    const createUser = await insertUser(user_id, imageTemplate)

    // If user creation fails, return an error
    if (!createUser) {
      return reply
        .status(500)
        .send({ error: 'Failed to create user with embedding' })
    }

    // Insert the user image
    await insertUserImage(user_id, base64Image)

    // Return success response
    return reply
      .status(200)
      .send({ user_id, message: 'User created!' })
  } catch (error) {
    console.log(error)
    // Return error response in case of exception
    return reply.status(500).send({ error: error.message })
  }
}
