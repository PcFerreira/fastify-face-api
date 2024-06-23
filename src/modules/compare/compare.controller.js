import {
  generateTemplate,
  calculateL2Distance
} from '../../shared/faceApiClient.js'

export const compareImagesController = async (request, reply) => {
  try {
    const { base64referenceImage, base64queryImage } = request.body
    const referenceImageTemplate = await generateTemplate(base64referenceImage)

    if (!referenceImageTemplate) {
      return reply.status(400).send({
        error: 'Failed to generate template for base64referenceImage'
      })
    }

    const queryImageTemplate = await generateTemplate(base64queryImage)

    if (!queryImageTemplate) {
      return reply.status(400).send({
        error: 'Failed to generate template for base64queryImage'
      })
    }

    const similarity = await calculateL2Distance(
      referenceImageTemplate,
      queryImageTemplate
    )

    return reply.status(200).send({ similarity })
  } catch (error) {
    return reply.status(500).send({ error: error.message })
  }
}
