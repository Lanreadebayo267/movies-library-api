const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Movie Library API",
    description: "CRUD API for managing movies"
  },
  host: "localhost:8080",
  schemes: ["http"]
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc);