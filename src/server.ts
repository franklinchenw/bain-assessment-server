import express from "express";
import cors from "cors";
import routes from "./routes";
import logger from "./utilities/logger";
import response from "./utilities/response";
import { HTTP_STATUS_CODE } from "./constants/httpStatusCode";
import { envStore } from "./utilities/env-store";
import { Model } from "objection";
import { db } from "./utilities/db";
import authenticateUser from "./middlewares/authentication";
import { defaultRateLimiter } from "./utilities/rate-limiter";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// init db connection
Model.knex(db);
const app = express();
app.use(cors({ origin: envStore.corsOrigins }));
app.use(express.json());

// Swagger documentation
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Distance Calculation API",
      version: "1.0.0",
      description: "API for calculating distances between two addresses",
    },
    servers: [
      {
        url: "/api",
        description: "API server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));

// API routes
app.use("/api", authenticateUser, routes);

// apply rate limiting to all routes
app.use(defaultRateLimiter);

// health check
app.get("/health", (req, res) => {
  response(res, HTTP_STATUS_CODE.OK, "Healthy");
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack);
  response(res, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, err.message);
});

app.listen(envStore.port, () => {
  logger.info(`Server is running on port ${envStore.port}`);
});
