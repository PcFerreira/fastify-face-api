import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'

// Directory containing the folders with images
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const directoryPath = path.join(__dirname, 'celebrity_faces')

// Function to convert image to base64
const imageToBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err)
      resolve(data.toString('base64'))
    })
  })
}

// Function to send HTTP POST request
const sendPostRequest = async (base64Image) => {
  try {
    const response = await axios.post('http://localhost:3000/user/create', {
      base64Image
    })
    console.log('Response:', response.data)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

// Loop through all folders and files
fs.readdir(directoryPath, (err, folders) => {
  if (err) {
    return console.error('Unable to scan directory:', err.message)
  }

  folders.forEach((folder) => {
    const folderPath = path.join(directoryPath, folder)

    fs.readdir(folderPath, (err, files) => {
      if (err) {
        return console.error('Unable to scan folder:', err.message)
      }

      files.forEach(async (file) => {
        if (file === '.DS_Store') return // Ignore .DS_Store files

        const filePath = path.join(folderPath, file)
        try {
          const base64Image = await imageToBase64(filePath)
          await sendPostRequest(base64Image)
        } catch (error) {
          console.error('Error processing file:', file, error.message)
        }
      })
    })
  })
})
