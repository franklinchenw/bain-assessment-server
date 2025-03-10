import { HttpClient } from "./http.service";
import { DistanceQuery } from "../databases/modals/distanceQuery.modal";
import logger from "../utilities/logger";
import { DEFAULT_PAGINATION, PaginationParams } from "../utilities/pagination";
import { CacheService } from "./cache.service";

export class GeocodingService {
  constructor(
    private readonly httpClient: HttpClient = new HttpClient({}),
    private readonly cacheService: CacheService = new CacheService()
  ) {}

  private async getGeocodingCoordinates(address: string): Promise<DistanceQuery.Coordinates> {
    try {
      // Check cache first
      const cacheKey = `geocoding:${address}`;
      const cachedCoordinates = await this.cacheService.get<DistanceQuery.Coordinates>(cacheKey);

      if (cachedCoordinates) {
        return cachedCoordinates;
      }

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;
      const response = await this.httpClient.get(url);

      if (!response.data || response.data.length === 0) {
        throw new Error(`Address not found: ${address}`);
      }

      const coordinates = {
        lat: parseFloat(response.data[0].lat),
        lon: parseFloat(response.data[0].lon),
      };

      // Store in cache
      await this.cacheService.set(cacheKey, coordinates);

      return coordinates;
    } catch (error) {
      logger.error(`Geocoding failed: ${(error as Error).message}`);
      throw new Error(`Geocoding failed: ${(error as Error).message}`);
    }
  }

  // formula https://en.wikipedia.org/wiki/Haversine_formula
  private calculateDistance(coords1: DistanceQuery.Coordinates, coords2: DistanceQuery.Coordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(coords2.lat - coords1.lat);
    const dLon = this.toRad(coords2.lon - coords1.lon);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(coords1.lat)) * Math.cos(this.toRad(coords2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  calculateAddressDistance = async (
    userId: string,
    {
      address1,
      address2,
      unit,
    }: {
      address1: string;
      address2: string;
      unit: DistanceQuery.Unit;
    }
  ): Promise<DistanceQuery> => {
    const coords1 = await this.getGeocodingCoordinates(address1);
    const coords2 = await this.getGeocodingCoordinates(address2);

    // return unit in km
    const distance = this.calculateDistance(coords1, coords2);

    return DistanceQuery.query().insert({
      address1,
      address2,
      unit,
      metadata: {
        distance: {
          [DistanceQuery.Unit.KM]: distance,
          [DistanceQuery.Unit.MI]: distance * 0.621371, // 1 km = 0.621371 mi
        },
        coordinates: {
          lat: coords1.lat,
          lon: coords1.lon,
        },
      },
      request_user_id: userId,
    });
  };

  getQueryHistory = async (userId: string, { pagination = DEFAULT_PAGINATION }: { pagination?: PaginationParams }) => {
    const query = DistanceQuery.query().where("request_user_id", userId);

    const [totalCount, results] = await Promise.all([
      query.resultSize(),
      query
        .offset(pagination.offset)
        .limit(pagination.limit)
        .orderBy(pagination.orderBy, pagination.order)
        .orderBy(pagination.orderBy2, pagination.order2),
    ]);

    return {
      pagination,
      totalCount,
      results,
    };
  };
}
