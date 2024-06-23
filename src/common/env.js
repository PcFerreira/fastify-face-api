// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
import '@tensorflow/tfjs-node'

import * as faceapi from 'face-api.js'

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import canvas from 'canvas'
const { Canvas, Image, ImageData } = canvas

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

export { canvas }
