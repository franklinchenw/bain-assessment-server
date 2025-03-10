import { Model } from "objection";
import { User } from "./user.modal";

/**
 * Data model for distance_query table
 */
export class DistanceQuery extends Model {
  id!: number;
  address1!: string;
  address2!: string;
  unit!: string;
  metadata!: DistanceQuery.DistanceMetadata;
  request_user_id!: string;
  created_at!: Date;
  updated_at!: Date;

  static get tableName() {
    return "distance_query";
  }

  static get idColumn() {
    return "id";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "distance_query.request_user_id",
          to: "user.id",
        },
      },
    };
  }
}

// Define model specific data type
export namespace DistanceQuery {
  export enum Unit {
    KM = "KM",
    MI = "MI",
    BOTH = "BOTH",
  }

  export interface DistanceMetadata {
    distance: {
      [Unit.KM]: number;
      [Unit.MI]: number;
    };
    coordinates: Coordinates;
  }

  export interface Coordinates {
    lat: number;
    lon: number;
  }
}
