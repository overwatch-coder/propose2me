const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    title: "PTM REST API",
    description: "This is the documentation for the <b>PTM REST API</b>",
    version: "1.0.0",
  },
  host:
    process.env.NODE_ENV !== "production"
      ? "http://localhost:8000"
      : "https://api-ptm.vercel.app",
  basePath: "/",
  schemes: ["http", "https"],
  servers: [
    {
      url: "http://localhost:8000/",
      description: "local server",
    },
    {
      url: "https://api-ptm.vercel.app/",
      description: "production server",
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
};


const outputFile = "./docs.json";
const routes = ["index.js"];

swaggerAutogen(outputFile, routes, doc);
