import { Router } from "express";
import { GeocodingController } from "../controllers/geocoding.controller";

const router = Router();
const geocodingController = new GeocodingController();

/**
 * @openapi
 * components:
 *   schemas:
 *     DistanceRequest:
 *       type: object
 *       required:
 *         - address1
 *         - address2
 *         - unit
 *       properties:
 *         address1:
 *           type: string
 *           description: First address
 *           example: '1600 Amphitheatre Parkway, Mountain View, CA'
 *         address2:
 *           type: string
 *           description: Second address
 *           example: '1 Infinite Loop, Cupertino, CA'
 *         unit:
 *           type: string
 *           enum: [KM, MI]
 *           description: Distance unit (kilometers or miles)
 *           example: KM
 *   securitySchemes:
 *     RequestId:
 *       type: apiKey
 *       in: header
 *       name: X-Request-Id
 *       description: Unique identifier for the request
 */

/**
 * @openapi
 * /distance:
 *   post:
 *     summary: Calculate distance between two addresses
 *     tags: [Distance]
 *     security:
 *       - RequestId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DistanceRequest'
 *     responses:
 *       200:
 *         description: Distance calculation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   nullable: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     address1:
 *                       type: string
 *                     address2:
 *                       type: string
 *                     unit:
 *                       type: string
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         distance:
 *                           type: object
 *                           properties:
 *                             KM:
 *                               type: number
 *                             MI:
 *                               type: number
 *                         coordinates:
 *                           type: object
 *                           properties:
 *                             lat:
 *                               type: number
 *                             lon:
 *                               type: number
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Server error
 */
router.post("/distance", geocodingController.calculateDistance);

/**
 * @openapi
 * /distance/history:
 *   get:
 *     summary: Get distance calculation history
 *     tags: [Distance]
 *     security:
 *       - RequestId: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 100
 *         description: Number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: History retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 message:
 *                   type: string
 *                   nullable: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         offset:
 *                           type: number
 *                         limit:
 *                           type: number
 *                     totalCount:
 *                       type: number
 *                     results:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DistanceRequest'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/distance/history", geocodingController.getDistanceHistory);

export default router;
