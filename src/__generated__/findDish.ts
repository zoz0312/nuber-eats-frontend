/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DishInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: findDish
// ====================================================

export interface findDish_findDish_dish_options_choices {
  __typename: "DishChice";
  name: string;
  extra: number | null;
}

export interface findDish_findDish_dish_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choices: findDish_findDish_dish_options_choices[] | null;
}

export interface findDish_findDish_dish {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: findDish_findDish_dish_options[] | null;
}

export interface findDish_findDish {
  __typename: "DishOutput";
  ok: boolean;
  error: string | null;
  dish: findDish_findDish_dish | null;
}

export interface findDish {
  findDish: findDish_findDish;
}

export interface findDishVariables {
  input: DishInput;
}
