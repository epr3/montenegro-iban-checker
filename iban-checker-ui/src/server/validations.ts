import { instance } from "../lib/axios";

export const getValidations = (page: number, pageSize: number) =>
  instance.get(`/validations?page=${page}&page_size=${pageSize}`);
