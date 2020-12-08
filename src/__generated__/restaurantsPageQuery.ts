/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: restaurantsPageQuery
// ====================================================

export interface restaurantsPageQuery_allcategories_categories {
  __typename: "Category";
  id: number;
  name: string;
  coverImage: string | null;
  slug: string;
  restaurantCount: number;
}

export interface restaurantsPageQuery_allcategories {
  __typename: "AllCategoriesOutput";
  ok: boolean;
  error: string | null;
  categories: restaurantsPageQuery_allcategories_categories[] | null;
}

export interface restaurantsPageQuery_restaurants_results_category {
  __typename: "Category";
  name: string;
}

export interface restaurantsPageQuery_restaurants_results {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: restaurantsPageQuery_restaurants_results_category | null;
  address: string;
  isPromoted: boolean;
}

export interface restaurantsPageQuery_restaurants {
  __typename: "RestaurantsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  results: restaurantsPageQuery_restaurants_results[] | null;
}

export interface restaurantsPageQuery {
  allcategories: restaurantsPageQuery_allcategories;
  restaurants: restaurantsPageQuery_restaurants;
}

export interface restaurantsPageQueryVariables {
  input: RestaurantsInput;
}
