import { useCallback } from "react";
import { useFetch } from "./helper/useFetch";
import { useMutation } from "./helper/useMutation";
import type { CompleteFood, FoodCategory, FoodRowDTO, FoodRowPayload } from "../types/foodTypes";
import { EmptyFood } from "../types/foodTypes";
import buildPath from "./helper/buildPath";
import type { ChangeItemRequest } from "../types/Requests/ChangeItem";

function useFood(foodId: string | null){
  const path = foodId ? buildPath("/singleFood", { foodId }) : null;
  const { data, loading, error } = useFetch<CompleteFood | null>(path, null);
  
  return { food: data || EmptyFood(), loading, error };
}

function useFoodList() {
  const { data, loading, error, refetch } = useFetch<CompleteFood[]>(
    "/food",
    []
  );
  return { foodList: data, loadingFoodList: loading, errorFoodList: error, refetchFoodList: refetch };
};

function useSavedFoodList(committeeId: string, categoryId: string){
  const path = categoryId ? buildPath("/foodItem", { committeeId, categoryId }) : null;
  const { data, loading, error } = useFetch<FoodRowDTO[]>(path, [], (j) => j.success);
  
  return { savedFoodList: data, savedFoodLoading: loading, savedFoodError: error };
}

function rowToItemDTO(row: FoodRowDTO, committeeId: string, authorId: string){
  return {
      id: row.id,
      objectId: row.foodId,
      authorId: authorId,
      committeeId: committeeId,
      quantity: row.quantity as number,
      categoryId: row.categoryId
    }
}

function toPayload(rows: FoodRowDTO[], committeeId: string, authorId: string): FoodRowPayload[] {
  return rows
    .filter((row) => row.foodId !== "" && row.quantity !== "" && row.co2Value !== null) // the food and the quantity has been set to something
    .map((row) => rowToItemDTO(row,committeeId,authorId));
}

function useSaveFoodRows(committeeId: string, authorId: string) {
  const { mutate, loading, error } = useMutation<{ items: FoodRowPayload[] }, unknown>("/addFoodItems");

  const save = useCallback(async (rows: FoodRowDTO[]) => {
    const payload = toPayload(rows, committeeId, authorId);
    if (payload.length === 0) throw new Error("No valid food rows to save.");
    return mutate({ items: payload });
  }, [mutate, committeeId, authorId]);

  return { save, loading, error };
}

// function saveFoodRows(rows: FoodRowDTO[],committeeId: string, authorId: string){
//     const { save, loading, error } = useSaveFoodRows(committeeId, authorId);
//     return { savedFoodRows: save(rows), loading, error };
// }

function useRemoveFoodRow(committeeId: string, authorId: string) {
  const { mutate, loading, error } = useMutation<{ item: FoodRowPayload }, unknown>("/removeFoodItems", "DELETE");

  const remove = useCallback(async (row: FoodRowDTO) => {
    if (row.foodId === "" || row.quantity === "" || row.co2Value === null) return;
    return mutate({ item: rowToItemDTO(row, committeeId, authorId) });
  }, [mutate, committeeId, authorId]);

  return { remove, loading, error };
}

function useFoodGroup(){
  const path: string | null = "/foodGroup";
  const { data, loading, error } = useFetch<string[]>(path, [], (j) => j.success);
  
  return { foodGroup: data, foodGroupLoading: loading, foodGroupError: error };
}

function useSubFoodGroup(){
  const path: string | null = "/subFoodGroup";
  const { data, loading, error } = useFetch<string[]>(path, [], (j) => j.success);
  
  return { subFoodGroup: data, subFoodGroupLoading: loading, subFoodGroupError: error};
}

function useUnits(){
  const path: string | null = "/units";
  const { data, loading, error } = useFetch<string[]>(path, [], (j) => j.success);
      
  return { units: data, unitsLoading: loading, unitsError: error };
}

const useModifyFood = () => useMutation<ChangeItemRequest, unknown>("/modifyFood");
const useCreateFood = () => useMutation<ChangeItemRequest, unknown>("/createFood");
const useRemoveFood = () => useMutation<ChangeItemRequest, unknown>("/removeFood", "DELETE");

// function modifyFood(food: CompleteFood){
//     const { mutate } = useModifyFood();
//     return mutate(createChangeFoodRequest(food));
// }

// function createFood(food: CompleteFood){
//     const { mutate } = useCreateFood();
//     return mutate(createChangeFoodRequest(food));
// }

// function removeFood(food: CompleteFood){
//     const { mutate } = useRemoveFood();
//     return mutate(createChangeFoodRequest(food));
// }

function useFoodCategories(committeeId: string | null){
  const path: string | null = committeeId ? buildPath("/foodCategoriesByCommitteeId", { committeeId }) : null;;
  const { data, loading, error } = useFetch<FoodCategory[]>(path, []);
  
  return { categoryList: data, categoryLoading: loading, categoryError: error };
}

function useFoodCategory(id: string | null){
  const path = id ? buildPath("/foodCategory", { id }) : null;
  const { data, loading, error } = useFetch<FoodCategory | null>(path, null);
  
  return { fetchedFoodCategory: data, uniqueCategoryLoading: loading, uniqueCategoryError: error };
}

export { useFoodList, useSavedFoodList, useSaveFoodRows, useFood, useRemoveFoodRow, useFoodCategories, useFoodCategory }
export { useFoodGroup, useSubFoodGroup, useUnits }
export { useCreateFood, useModifyFood, useRemoveFood }