import { generateTemplate } from '../../shared/faceApiClient.js'
import { searchSimilars, getImage } from './search.service.js'
import { Readable } from 'stream'
export const searchSimilarsController = async (request, reply) => {
  try {
    const { base64queryImage, threshold, limit } = request.body

    const queryImageTemplate = await generateTemplate(base64queryImage)

    if (!queryImageTemplate) {
      return reply.status(400).send({
        error: 'Failed to generate template for base64queryImage'
      })
    }

    const similars = await searchSimilars(queryImageTemplate, threshold, limit)
    if (similars) {
      const similarResults = similars.map((similar) => {
        const similarity = (1 - similar.distance) * 100
        return {
          id: similar.id,
          similarity: similarity.toFixed(2)
        }
      })

      return reply.status(200).send({ similars: similarResults })
    }
    return reply.status(500).send({ error: 'not found' })
  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}

export const getUserImageController = async (request, reply) => {
  const { user_id } = request.params
  try {
    const image = await getImage(user_id)
    if (image) {
      const response = Buffer.from(image.image, 'base64')
      reply.send(response)

      // return reply.status(200).send({ imagebase64: image });
    } else {
      reply.code(404).send({ error: `No image found for user ID: ${user_id}` })
    }
  } catch (error) {
    console.log(error)
    reply.code(500).send({ error: 'Failed to retrieve image data' })
  }
}
