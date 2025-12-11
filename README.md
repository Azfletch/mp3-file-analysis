# MP3 File Analysis API

## Overview

This is a simple NodeJS application that utilises ExpressJS to create an API endpoint for uploading MP3 files.The MP3 files are then stored locally using Multer before being analysed!

File analysis is performed in an asynchronous streaming method, that doesn't require the entire file loaded into memory. Making this API ideal for handling large files (hundreds of MB or more).

We process chunks from fs.createReadStream and maintain a rolling buffer to detect and count MP3 frames. The API then returns the count of MP3 frames!

## Advantages of the Streaming Method

- Processes chunk-by-chunk (Handles large files safely)
- No full file load in memory	(Ultra low RAM footprint)
- Works for CBR & VBR

## Getting Started

To run the app locally:

```bash
npm run dev
```

The app can be then tested using Postman:

- Send POST request to http://localhost:3000/file-upload
- Set the request body to `form-data` with a key of 'mp3' and a value of your chosen file.

Unit tests are written using Jest and Supertest. To run the unit tests:

```bash
npm run test
```

To lint the project:

```bash
npm run lint
npm run lint-fix
```

To generate/update swagger documentation for endpoints:

```bash
npm run swagger
```