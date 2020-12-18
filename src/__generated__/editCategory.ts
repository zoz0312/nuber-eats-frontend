/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditCategoryInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editCategory
// ====================================================

export interface editCategory_editCategory {
  __typename: "EditCategoryOutput";
  ok: boolean;
  error: string | null;
}

export interface editCategory {
  editCategory: editCategory_editCategory;
}

export interface editCategoryVariables {
  input: EditCategoryInput;
}
