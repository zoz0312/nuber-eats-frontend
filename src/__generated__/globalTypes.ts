/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum OrderStatus {
  Cooked = "Cooked",
  Cooking = "Cooking",
  Delivered = "Delivered",
  Pending = "Pending",
  PickedUp = "PickedUp",
}

export enum UserRole {
  Client = "Client",
  Delivery = "Delivery",
  Owner = "Owner",
}

export interface CategoryInput {
  page?: number | null;
  slug: string;
}

export interface CreateAccountInput {
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateDishInput {
  name: string;
  price: number;
  photo?: string | null;
  description: string;
  options?: DishOptionInputType[] | null;
  restaurantId: number;
}

export interface CreateOrderInput {
  restaurantId: number;
  items: CreateOrderItemInput[];
}

export interface CreateOrderItemInput {
  dishId: number;
  options?: OrderItemOptionInputType[] | null;
}

export interface CreatePaymentInput {
  transactionId: number;
  restaurantId: number;
}

export interface CreateRestaurantInput {
  name: string;
  coverImage: string;
  address?: string | null;
  categoryName: string;
}

export interface DeleteDishInput {
  dishId: number;
}

export interface DeleteRestaurantInput {
  restaurantId: number;
}

export interface DishChoiceInputType {
  name: string;
  extra?: number | null;
}

export interface DishInput {
  id: number;
}

export interface DishOptionInputType {
  name: string;
  choices?: DishChoiceInputType[] | null;
  extra?: number | null;
}

export interface EditCategoryInput {
  name?: string | null;
  coverImage?: string | null;
  categoryId: number;
}

export interface EditDishInput {
  name?: string | null;
  price?: number | null;
  photo?: string | null;
  description?: string | null;
  options?: DishOptionInputType[] | null;
  dishId: number;
}

export interface EditOrderInput {
  id: number;
  status: OrderStatus;
}

export interface EditProfileInput {
  email?: string | null;
  password?: string | null;
}

export interface EditRestaurantInput {
  name?: string | null;
  coverImage?: string | null;
  address?: string | null;
  categoryName?: string | null;
  restaurantId: number;
}

export interface GetOrderInput {
  id: number;
}

export interface MyRestaurantInput {
  id: number;
}

export interface MyRestaurantsInput {
  page?: number | null;
}

export interface OrderItemOptionInputType {
  name: string;
  choice?: string | null;
  extra?: number | null;
}

export interface OrderUpdatesInput {
  id: number;
}

export interface RestaurantInput {
  restaurantId: number;
}

export interface RestaurantsInput {
  page?: number | null;
}

export interface SearchRestaurantInput {
  page?: number | null;
  query: string;
}

export interface TakeOrderInput {
  id: number;
}

export interface VerifyEmailInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
