import swaggerAutogen from "swagger-autogen";

const doc = {
  host: "localhost:8080", // by default: 'localhost:3000'
};

const outputFile = "./swagger_output.json";

const endpointsFiles = ["./routes/*.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
