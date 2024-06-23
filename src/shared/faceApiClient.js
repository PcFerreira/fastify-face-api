import * as faceapi from 'face-api.js'
import { faceDetectionNet, faceDetectionOptions } from '../common/index.js'

import { createCanvas, loadImage } from 'canvas';

(async function () {
  await faceDetectionNet.loadFromDisk('./weights')
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./weights')
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./weights')
})()

export const loadImageBase64 = async (imageBase64) => {
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
  const imageBuffer = Buffer.from(base64Data, 'base64')
  const image = await loadImage(imageBuffer)
  const canvas = createCanvas(image.width, image.height)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0)
  return canvas
}

export const generateTemplate = async (imageBase64) => {
  try {
    const image = await loadImageBase64(imageBase64)
    const resultsRef = await faceapi
      .detectAllFaces(image, faceDetectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptors()

    // Check if resultsRef is empty or undefined
    if (!resultsRef || resultsRef.length === 0) {
      return null
    }

    return resultsRef[0].descriptor
  } catch (error) {
    console.error('Error generating template:', error)
    return null
  }
}

export const calculateL2Distance = async (embedding1, embedding2) => {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embedding arrays must have the same length.')
  }

  let distance = 0
  for (let i = 0; i < embedding1.length; i++) {
    distance += Math.pow(embedding1[i] - embedding2[i], 2)
  }

  const similarity = 1 / (1 + Math.sqrt(distance))
  const similarityPercentage = similarity * 100

  return similarityPercentage
}
