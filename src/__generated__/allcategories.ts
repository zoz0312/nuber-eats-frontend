/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: allcategories
// ====================================================

export interface allcategories_allcategories_categories {
  __typename: "Category";
  id: number;
  name: string;
  coverImage: string | null;
  slug: string;
  restaurantCount: number;
}

export interface allcategories_allcategories {
  __typename: "AllCategoriesOutput";
  ok: boolean;
  error: string | null;
  categories: allcategories_allcategories_categories[] | null;
}

export interface allcategories {
  allcategories: allcategories_allcategories;
}
