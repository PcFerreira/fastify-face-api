import prisma from '../../shared/prismaClient.js'

export const searchSimilars = async (
  embedding,
  threshold = 0.5,
  limit = 10
) => {
  // Validate embedding
  if (!(embedding instanceof Float32Array)) {
    throw new Error(
      'Invalid embedding format. The embedding should be a Float32Array.'
    )
  }
  // Convert Float32Array to PostgreSQL array format
  const formattedEmbedding = `'[${Array.from(embedding).join(',')}]'`

  const query = `
  SELECT id, distance from (
  SELECT 
    id, embedding <-> ${formattedEmbedding} AS distance FROM users
  ORDER BY distance LIMIT ${limit}) similars
  WHERE distance <= ${threshold}
  ORDER BY distance`
  let _return = null
  try {
    // Execute the raw SQL query
    _return = await prisma.$queryRawUnsafe(query)
  } catch (error) {
    throw new Error('Failed to search user embeddings: ' + error.message)
  } finally {
    // Close the Prisma Client at the end
    await prisma.$disconnect()
    return _return
  }
}

export const getImage = async (user_id) => {
  try {
    const image = await prisma.user_images.findUnique({
      where: {
        id: user_id
      }
    })

    if (!image) {
      throw new Error(`No image found for user ID: ${user_id}`)
    }

    return image
  } catch (error) {
    console.error('Failed to retrieve image data:', error)
    throw error
  }
}
