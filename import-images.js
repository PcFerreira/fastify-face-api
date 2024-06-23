import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directoryPath = path.join(__dirname, "celebrity_faces");

const imageToBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err);
      if (data) resolve(data.toString("base64"));
    });
  });
};

const sendPostRequest = async (base64Image) => {
  try {
    const response = await axios.post("http://localhost:3000/user/create", {
      base64Image,
    });
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const processFile = async (filePath) => {
  try {
    const base64Image = await imageToBase64(filePath);
    await sendPostRequest(base64Image);
  } catch (error) {
    console.error("Error processing file:", filePath, error.message);
  }
};

const processQueue = async (queue, concurrency = 5) => {
  const running = [];
  while (queue.length > 0 || running.length > 0) {
    while (running.length < concurrency && queue.length > 0) {
      const filePath = queue.shift();
      const promise = processFile(filePath).then(() => {
        running.splice(running.indexOf(promise), 1);
      });
      running.push(promise);
    }
    await Promise.race(running);
  }
};

const processFolder = async (folderPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      const queue = files
        .filter((file) => file !== ".DS_Store")
        .map((file) => path.join(folderPath, file));
      processQueue(queue).then(resolve).catch(reject);
    });
  });
};

fs.readdir(directoryPath, async (err, folders) => {
  if (err) {
    console.error("Unable to scan directory:", err.message);
    return;
  }

  for (const folder of folders) {
    const folderPath = path.join(directoryPath, folder);
    try {
      await processFolder(folderPath);
    } catch (error) {
      console.error("Error processing folder:", folder, error.message);
    }
  }
});
