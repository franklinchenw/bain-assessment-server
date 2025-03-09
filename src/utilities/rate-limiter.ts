import rateLimit from "express-rate-limit";
import { HTTP_STATUS_CODE } from "../constants/httpStatusCode";

export const createRateLimiter = ({
  windowMs = 1 * 60 * 1000, // 1 minute
  max = 100, // limit each IP to 100 requests
  message = "Too many requests from this IP, please try again later",
} = {}) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      statusCode: HTTP_STATUS_CODE.TOO_MANY_REQUESTS,
      message,
      data: null,
    },
  });
};

export const defaultRateLimiter = createRateLimiter();
