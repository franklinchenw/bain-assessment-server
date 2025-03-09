import { Response } from "express";
import logger from "./logger";

const response = (res: Response<any>, statusCode: number, message: string | null = null, data: any = null) => {
  logger.info(`Response: ${statusCode} ${message} ${data}`);
  return res.status(statusCode).json({
    statusCode: statusCode,
    message: message,
    data: data,
  });
};

export default response;
