import { useCallback } from "react";
import { EmptyGood, type CompleteGood, type GoodRowDTO, type GoodRowPayload } from "../types/goodsTypes";
import buildPath from "./helper/buildPath";
import { useFetch } from "./helper/useFetch";
import { useMutation } from "./helper/useMutation";
import type { ChangeItemRequest } from "../types/Requests/ChangeItem";



function useGood(goodId: string | null){
  const path = goodId ? buildPath("/singleGood", { goodId }) : null;
  const { data, loading, error } = useFetch<CompleteGood | null>(path, null);
  
  return { good: data || EmptyGood(), loading, error };
}

function useGoodList() {
  const { data, loading, error, refetch } = useFetch<CompleteGood[]>(
    "/good",
    []
  );
  return { goodList: data, loading, error, refetchGoodList: refetch };
};

function useGoodCategories(){
  const { data, loading, error, refetch } = useFetch<string[]>("/goodCategories",[], (j) => j.success);
  return { goodCategories: data, goodCategoriesLoading: loading, goodCategoriesError: error, goodCategoriesRefetch: refetch };
}

function useUnits(){
  const { data, loading, error } = useFetch<string[]>("/expectedUnits",[], (j) => j.success);
  return { units: data, unitsLoading: loading, unitsError: error};
}

const useModifyGood = () => useMutation<ChangeItemRequest, unknown>("/modifyGood");
const useCreateGood = () => useMutation<ChangeItemRequest, unknown>("/createGood");
const useRemoveGood = () => useMutation<ChangeItemRequest, unknown>("/removeGood", "DELETE");

function useSavedGoodList(committeeId: string){
  const path = committeeId ? buildPath("/goodItem", { committeeId }) : null;
  const { data, loading, error } = useFetch<GoodRowDTO[]>(path, [], (j) => j.success);
  return { savedGoodList: data, savedGoodLoading: loading, savedGoodError: error };
}  

function rowToItemDTO(row: GoodRowDTO, committeeId: string, authorId: string){
  return {
      id: row.id,
      objectId: row.goodId,
      authorId: authorId,
      committeeId: committeeId,
      quantity: row.quantity as number
    }
}

function toPayload(rows: GoodRowDTO[], committeeId: string, authorId: string): GoodRowPayload[] {
  return rows
    .filter((row) => row.goodId !== "" && row.quantity !== "" && row.co2Value !== null) // the good and the quantity has been set to something
    .map((row) => rowToItemDTO(row,committeeId,authorId));
}

function useSaveGoodRows(committeeId: string, authorId: string) {
  const { mutate, loading, error } = useMutation<{ items: GoodRowPayload[] }, unknown>("/addGoodItems");

  const save = useCallback(async (rows: GoodRowDTO[]) => {
    const payload = toPayload(rows, committeeId, authorId);
    if (payload.length === 0) throw new Error("No valid good rows to save.");
    return mutate({ items: payload });
  }, [mutate, committeeId, authorId]);

  return { save, loading, error };
}

function useRemoveGoodRow(committeeId: string, authorId: string) {
  const { mutate, loading, error } = useMutation<{ item: GoodRowPayload }, unknown>("/removeGoodItems", "DELETE");

  const remove = useCallback(async (row: GoodRowDTO) => {
    if (row.goodId === "" || row.quantity === "" || row.co2Value === null) return;
    return mutate({ item: rowToItemDTO(row, committeeId, authorId) });
  }, [mutate, committeeId, authorId]);

  return { remove, loading, error };
}

export { useGoodList, useSavedGoodList, useSaveGoodRows, useGood, useRemoveGoodRow }
export { useGoodCategories, useUnits }
export { useModifyGood, useCreateGood, useRemoveGood }