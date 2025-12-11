import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'MP3 File Analysis API',
    description: 'A simple Express app to analyse an MP3 file and return the frame count'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./src/app.ts'];

swaggerAutogen()(outputFile, routes, doc);