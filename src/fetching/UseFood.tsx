import { useEffect, useState, useCallback } from "react";
import type { Food, CompleteFood, FoodRowDTO, FoodRowPayload, FoodCategory } from "../types/foodTypes";
import { API_URL } from "../constants/url";
import { useApi } from "./useApi";
import { useAuth } from "../auth/AuthContext";

function useFood(foodId: string | null){
  const { token } = useAuth();
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Guard INSIDE the effect, not around the hook call
    if (!foodId) {
      setFood(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function fetchFood() {
      try {        
        const response = await fetch(`${API_URL}/singleFood?foodId=${foodId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
        });

        if(!response.ok) throw new Error(`Failed to fetch food with id=${foodId}`);
        const food: Food = await response.json();
        if (!cancelled) setFood(food);
      } catch (err: any) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    
    fetchFood();
  return () => {
      cancelled = true; // cleanup: ignore this result if foodId changes again mid-flight
    };
  }, [foodId]);
  
  return { food, loading, error };
}

function useFoodList() {
  const apiFetch = useApi();
  const [foodList, setFoodList] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchFood = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/food`);
      const foods = await response.json();
      const simplifiedFood: Food[] = foods.map((item: CompleteFood) => ({
        id: item.id,
        name: item.name,
        category: item.food_group
      }));
      setFoodList(simplifiedFood);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching food:", err);
      setError(err);
      setLoading(false);
      }
  }, [apiFetch]);

  useEffect(() => {
    fetchFood();
  }, [fetchFood]);
  
  return { foodList, loading, error };
};

function useSavedFoodList(committeeId: string, categoryId: string){
  const apiFetch = useApi();
  const [savedFoodList, setSavedFoodList] = useState<FoodRowDTO[]>([]);
  const [savedFoodLoading, setSavedFoodLoading] = useState(true);
  const [savedFoodError, setSavedFoodError] = useState(null);
  
  const fetchFood = useCallback(async () => {
    try {
      if (categoryId == ""){
        return;
      }
      setSavedFoodLoading(true);
      const response = await apiFetch(`${API_URL}/foodItem?committeeId=${committeeId}&categoryId=${categoryId}`);
      const foods = await response.json();
      // ("saved :",foods.success);
      setSavedFoodList(foods.success);
      setSavedFoodLoading(false);
    } catch (err: any) {
      console.error("Error fetching food:", err);
      setSavedFoodError(err);
      setSavedFoodLoading(false);
    }
  }, [apiFetch, committeeId, categoryId]);

  useEffect(() => {
    fetchFood();
  }, [fetchFood]);
  
  return { savedFoodList, savedFoodLoading, savedFoodError };
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

async function saveFoodRows(rows: FoodRowDTO[], committeeId: string, authorId: string, token: string) {
  const payload = toPayload(rows, committeeId, authorId);
  // console.log("payload:", payload);

  if (payload.length === 0) {
    throw new Error("No valid food rows to save.");
  }

  const response = await fetch(`${API_URL}/addFoodItems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ items: payload }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? `Request failed with status ${response.status}`);
  }
  // console.log(response)
  return response.json();
}

async function removeFoodRow(row: FoodRowDTO, committeeId: string, authorId: string, token: string){
  if (row.foodId === "" || row.quantity === "" || row.co2Value === null){
    return;
  }
  const removedRow = rowToItemDTO(row, committeeId, authorId);

  const response = await fetch(`${API_URL}/removeFoodItems`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ item: removedRow }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    
    throw new Error(errorBody?.message ?? `Request failed with status ${response.status}`);
  }
  return response;
}

function useFoodCategories(){
  const apiFetch = useApi();
  const [categoryList, setCategoryList] = useState<FoodCategory[]>([]);
  const [categoryLoading, setLoading] = useState(true);
  const [categoryError, setError] = useState(null);
  
  const fetchFoodCategory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/listeFoodCategories`);
      const foodCategories = await response.json();
      setCategoryList(foodCategories);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching food:", err);
      setError(err);
      setLoading(false);
      }
  }, [apiFetch]);

  useEffect(() => {
    fetchFoodCategory();
  }, [fetchFoodCategory]);
  
  return { categoryList, categoryLoading, categoryError };
}

function useFoodCategory(id: string | null){
  const apiFetch = useApi();
  const [fetchedFoodCategory, setCategory] = useState<FoodCategory | null>(null);
  const [uniqueCategoryLoading, setLoading] = useState(true);
  const [uniqueCategoryError, setError] = useState(null);
  
  const fetchFoodCategory = useCallback(async () => {
    try {
      if (id == null) {
        setLoading(false);
        setError(null);
        return;
      }
      setLoading(true);
      const response = await apiFetch(`${API_URL}/foodCategory?id=${id}`);
      const category = await response.json();
      setCategory(category);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching food:", err);
      setError(err);
      setLoading(false);
      }
  }, [apiFetch]);

  useEffect(() => {
    fetchFoodCategory();
  }, [fetchFoodCategory]);
  
  return { fetchedFoodCategory, uniqueCategoryLoading, uniqueCategoryError };
}

export { useFoodList, useSavedFoodList, saveFoodRows, useFood, removeFoodRow, useFoodCategories, useFoodCategory }