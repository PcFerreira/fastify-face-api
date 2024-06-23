import prisma from '../../shared/prismaClient.js'

export const insertUserImage = async (id, base64Image) => {
  try {
    // Insert the new record into the user_images table
    const newUserImage = await prisma.user_images.create({
      data: {
        id,
        image: base64Image
      }
    })
    return newUserImage
  } catch (error) {
    throw new Error('Failed to insert image: ' + error.message)
  } finally {
    // Close the Prisma Client at the end
    await prisma.$disconnect()
  }
}

export const insertUser = async (id, embedding) => {
  // Validate embedding
  if (!(embedding instanceof Float32Array)) {
    throw new Error(
      'Invalid embedding format. The embedding should be a Float32Array.'
    )
  }

  // Convert Float32Array to PostgreSQL array format
  const formattedEmbedding = `'[${Array.from(embedding).join(',')}]'`

  const query = `INSERT INTO users (id, embedding) VALUES ('${id}', ${formattedEmbedding});`
  let _return = null
  try {
    // Execute the raw SQL query
    _return = await prisma.$executeRawUnsafe(query)
    console.log('User with embedding inserted successfully.')
  } catch (error) {
    throw new Error('Failed to insert user with embedding: ' + error.message)
  } finally {
    // Close the Prisma Client at the end
    await prisma.$disconnect()
    return _return
  }
}
