import * as fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the current module URL and convert it to a directory path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Use __dirname to resolve the base directory
const baseDir = path.resolve(__dirname, '../out')

export function saveFile (fileName, buf) {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir)
  }

  fs.writeFileSync(path.resolve(baseDir, fileName), buf)
}
