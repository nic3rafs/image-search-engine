# Image Search Engine with Weaviate, Express, and Next.js
This project is a simple TypeScript web application that allows users to upload, display, delete, and find similar images using Next.js for the frontend, Weaviate as the backend for storing image metadata, and Express as an API backend.

## Table of Contents
- [Image Search Engine with Weaviate, Express, and Next.js](#image-search-engine-with-weaviate-express-and-nextjs)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Server setup](#server-setup)
    - [Client setup](#client-setup)
  - [Demo](#demo)
  - [Usage](#usage)
  - [Features and Technologies](#features-and-technologies)
  - [Notes](#notes)
  - [Contributing](#contributing)
  - [License](#license)


## Installation
To set up the project locally, follow these steps:

### Server setup
1. Go to the server folder: `cd server`
2. Install all dependencies: `npm i`
  
>I suggest you to run Weaviate locally in Docker:
>- Go to the Weaviate folder: `cd weaviate`
>- Download Docker images and run a container: `docker-compose up -d`

1. Set up your Weaviate client in the `utils/utils.ts` (if you are running locally in Docker, you don't need to change anything)
2. Add a schema to your database: `node weaviate/schema.js`
3. Run the server: `npm run dev`

### Client setup
1. Go to the client folder: `cd client`
2. Install all dependencies: `npm i`
3. Run the frontend locally: `npm run dev`


## Demo
[Link to demo video on YouTube](https://youtu.be/fsMwXCDvFIY)
<a href="https://ibb.co/QYKHJLr"><img src="https://i.ibb.co/QYKHJLr/Screenshot-2023-05-02-at-11-23-48-AM.png" alt="Screenshot-2023-05-02-at-11-23-48-AM" border="0"></a>

## Usage
- Click the "Upload images ↓" button to open the file input
- Click the "Choose File" button to select images from your local machine
- The image will be uploaded, and its metadata will be stored in Weaviate
- The uploaded image will be displayed in the gallery
- To delete an image, click the button with a bucket icon below the image thumbnail
- To find similar images, click the "Similar" button (displays 5 similar images by default; you can change this in server/.env)
- To edit an image name, click the button with an edit icon on the right side below the image thumbnail, enter a new name, and then click "Save" to save changes

## Features and Technologies
- Styled using Tailwind
- Frontend built with Next.js
- Image search using the Weaviate vector database and the img2vec-neural vectorizer model
- Backend powered by Express.js
- Implemented an optimistic design approach
- Responsive design with a mobile-first approach
- Find similar images
- Edit image names
- Upload images from your local machine
- Display uploaded images in a gallery
- Delete images from the gallery

## Notes
This is just a simple app that I want to use as a base for my next project. Feel free to use it, and I'm very open to feedback and communication.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
MIT