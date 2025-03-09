import { Request, Response } from "express";
import { GeocodingService } from "../services/geocoding.service";
import { HttpClient } from "../services/http.service";
import response from "../utilities/response";
import { HTTP_STATUS_CODE } from "../constants/httpStatusCode";
import { createPagination, PaginationParams } from "../utilities/pagination";
import * as yup from "yup";

export class GeocodingController {
  private geocodingService: GeocodingService;

  constructor() {
    const httpClient = new HttpClient({});
    this.geocodingService = new GeocodingService(httpClient);
  }

  calculateDistance = async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.userId;

      // Validate input
      const distanceSchema = yup.object({
        address1: yup.string().required().trim().max(255),
        address2: yup.string().required().trim().max(255),
      });
      const validatedData = await distanceSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const result = await this.geocodingService.calculateAddressDistance(userId, validatedData);
      return response(res, HTTP_STATUS_CODE.OK, null, result);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return response(res, HTTP_STATUS_CODE.BAD_REQUEST, "Validation error", error.errors);
      }
      return response(
        res,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Failed to calculate distance",
        (error as Error).message
      );
    }
  };

  getDistanceHistory = async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.userId;

      const pagination = createPagination(req.query as unknown as PaginationParams);
      const history = await this.geocodingService.getQueryHistory(userId, { pagination });

      return response(res, HTTP_STATUS_CODE.OK, null, history);
    } catch (error) {
      return response(res, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, "Failed to get history", (error as Error).message);
    }
  };
}
