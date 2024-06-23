import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import ProgressBar from "progress";

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
    //console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const processFile = async (filePath, progressBar) => {
  try {
    const base64Image = await imageToBase64(filePath);
    await sendPostRequest(base64Image);
    progressBar.tick();
  } catch (error) {
    console.error("Error processing file:", filePath, error.message);
    progressBar.tick();
  }
};

const processQueue = async (queue, progressBar, concurrency = 5) => {
  const running = [];
  while (queue.length > 0 || running.length > 0) {
    while (running.length < concurrency && queue.length > 0) {
      const filePath = queue.shift();
      const promise = processFile(filePath, progressBar).then(() => {
        running.splice(running.indexOf(promise), 1);
      });
      running.push(promise);
    }
    await Promise.race(running);
  }
};

const isImageFile = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".gif", ".bmp"].includes(ext);
};

const getTotalFileCount = (directoryPath) => {
  let totalFiles = 0;
  const items = fs.readdirSync(directoryPath);

  items.forEach((item) => {
    const itemPath = path.join(directoryPath, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      totalFiles += getTotalFileCount(itemPath);
    } else if (stats.isFile() && isImageFile(itemPath)) {
      totalFiles++;
    }
  });

  return totalFiles;
};

const processDirectory = async (directoryPath, progressBar) => {
  const items = fs.readdirSync(directoryPath);
  const queue = [];

  for (const item of items) {
    const itemPath = path.join(directoryPath, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      await processDirectory(itemPath, progressBar);
    } else if (stats.isFile() && isImageFile(itemPath)) {
      queue.push(itemPath);
    }
  }

  await processQueue(queue, progressBar);
};

const main = async () => {
  const totalFiles = getTotalFileCount(directoryPath);
  const progressBar = new ProgressBar(
    "Processing [:bar] :current/:total :percent :etas",
    {
      complete: "=",
      incomplete: " ",
      width: 20,
      total: totalFiles,
    }
  );

  try {
    await processDirectory(directoryPath, progressBar);
    console.log("\nAll files processed successfully!");
  } catch (error) {
    console.error("Error processing directory:", error.message);
  }
};

main();
