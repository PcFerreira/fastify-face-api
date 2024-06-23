# Face API Test

This project demonstrates facial recognition and similarity search using face-api.js. It extracts face embeddings from images, stores them in a PostgreSQL database, and performs similarity searches using L2 distance. The application includes both a backend API and a frontend demo.

The system uses face-api.js to extract 128-dimensional face embeddings from images. These embeddings are stored in a PostgreSQL database with the pgvector extension, allowing for efficient similarity searches. The L2 distance between face embeddings is used to determine similarity between faces.




https://github.com/PcFerreira/fastify-face-api/assets/26153165/ad70f1a2-663c-4b9a-b7af-d33c9251adf0



## Prerequisites

- Node.js (version 21 or higher recommended)
- PostgreSQL database
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```shell
git clone https://github.com/yourusername/face-api-test.git
cd face-api-test
````

2. Install dependencies:
```shell
npm install
````

3. Set up environment variables:
Create a `.env` file in the root directory and add the following variables:
```shell
DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
PORT=3000
````

4. Start the PostgreSQL database using Docker Compose:
```shell
docker-compose up -d
```
This will start a PostgreSQL container with the pgvector extension installed.

5. Generate Prisma client:
```shell
npx prisma generate
```

6. Set up the database:
Connect to the PostgreSQL database and create the following tables:
```sql
CREATE EXTENSION vector;

CREATE TABLE users (id uuid PRIMARY KEY, embedding vector(128));

CREATE TABLE user_images (id uuid PRIMARY KEY, image text);
```

## Usage
To start the server, run:
```shell
npm start
```

The server will start on the port specified in your .env file (default is 3000).
### Frontend Demo
The project includes a frontend that provides a user interface to interact with the facial recognition and similarity search features.
Access the frontend demo by navigating to http://localhost:3000 in your web browser.

## API Usage

The application provides several API endpoints for face recognition and similarity search. Here's how to use them:

### Add Face
Add a new face to the database.
#### POST http://localhost:3000/user/create
Request body:
```json
{
  "base64Image": "base64_encoded_image_data"
}
```
Response:
```json
{
  "user_id": "generated_uuid",
  "message": "User created!"
}
```

### Compare Faces
Compare two faces for similarity.
#### POST http://localhost:3000/compare
```json
{
  "base64referenceImage": "base64_encoded_reference_image",
  "base64queryImage": "base64_encoded_query_image"
}
```
Response:
```json
{
  "similarity": 85.5
}
```
### Search Faces
Search for similar faces in the database.
#### POST http://localhost:3000/search
Request body:
```json
{
  "threshold": 0.5,
  "limit": 10,
  "base64queryImage": "base64_encoded_query_image"
}
```
Response:
```json
{
  "similars": [
    {
      "id": "user_uuid",
      "distance": 0.3
    },
    // ... more similar faces
  ]
}
```
### Get Image
Retrieve a specific image by ID.

Note: Replace :id in the URL with the actual image ID (usually the similar.id from the search results).
For all endpoints that require base64 image data, ensure that you're sending the full base64 string, including the data URI prefix (e.g., "data:image/jpeg;base64,").


### Scripts
```shell
npm start: Start the application
npm run fixTensorFlow: Fix TensorFlow dependencies (if needed)
```

## Importing Test Data

The project includes an import-images.js script that allows you to import a dataset of celebrity face images for testing purposes. To use this script:

1. Download the "Celebrity Face Image Dataset" from Kaggle: https://www.kaggle.com/datasets/vishesh1412/celebrity-face-image-dataset
2. Extract the downloaded dataset to a directory named celebrity_faces in the project root.
3. Run the import script:
```shell
node import-images.js
#or
npm run import
```
This will process the images and add them to your database for testing.




## Dependencies

```
@fastify/helmet: Security headers for Fastify
@fastify/static: Static file serving for Fastify
@prisma/client: Prisma ORM client
@tensorflow/tfjs-node: TensorFlow.js for Node.js
canvas: Canvas implementation for Node.js
dotenv: Environment variable management
face-api.js: Face detection and recognition library
fastify: Web framework
uuid: UUID generation
```

## Docker Compose
The project includes a docker-compose.yml file to easily set up the PostgreSQL database with the pgvector extension. To start the database, run:

```shell
docker-compose up -d
```

This will create a PostgreSQL container with the following configuration:

```
Username: face-api-test
Password: 614D05
Database: face-api
Port: 5432 (mapped to host)
```

## Acknowledgements

This project makes use of the face-api.js library, which provides the core functionality for face detection and recognition.

### face-api.js

- Repository: https://github.com/justadudewhohacks/face-api.js
- Description: JavaScript face recognition API for the browser and nodejs implemented on top of tensorflow.js core (tensorflow/tfjs-core)
- Author: Vincent Mühler (justadudewhohacks)
- License: MIT

### License
This project is licensed under the MIT License. See the LICENSE file for details.
