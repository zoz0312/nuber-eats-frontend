/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteRestaurant
// ====================================================

export interface deleteRestaurant_deleteRestaurant {
  __typename: "DeleteRestaurantOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteRestaurant {
  deleteRestaurant: deleteRestaurant_deleteRestaurant;
}

export interface deleteRestaurantVariables {
  input: DeleteRestaurantInput;
}
