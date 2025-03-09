import { Model } from "objection";
import { DistanceQuery } from "./distanceQuery.modal";

/**
 * Data model for user table
 */
export class User extends Model {
  id!: string;

  created_at!: Date;
  updated_at!: Date;

  static get tableName() {
    return "user";
  }

  static get idColumn() {
    return "id";
  }

  static get relationMappings() {
    return {
      geocodingQueries: {
        relation: Model.HasManyRelation,
        modelClass: DistanceQuery,
        join: {
          from: "user.id",
          to: "distance_query.request_user_id",
        },
      },
    };
  }
}
