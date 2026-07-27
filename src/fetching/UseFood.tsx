import { useEffect, useState } from "react";
import type { Food, CompleteFood, FoodRowDTO, FoodRowPayload } from "../types/foodTypes";

const API_URL="http://localhost:8080";

function useFood(foodId: string | null){
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
            headers: {"Content-Type": "application/json"},
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
  const [foodList, setFoodList] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchFood() {
      try {        
        const response = await fetch(`${API_URL}/food`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });

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
    }
    
    fetchFood();
  }, []);
  
  return { foodList, loading, error };
};

function useSavedFoodList(committeeId: string, category: string | null){
  const [savedFoodList, setSavedFoodList] = useState<FoodRowDTO[]>([]);
  const [savedFoodLoading, setSavedFoodLoading] = useState(true);
  const [savedFoodError, setSavedFoodError] = useState(null);
  
  useEffect(() => {
    async function fetchFood() {
      try {        
        const response = await fetch(`${API_URL}/foodItem?committeeId=${committeeId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        });

        const foods = await response.json();
        setSavedFoodList(foods);
        setSavedFoodLoading(false);
      } catch (err: any) {
        console.error("Error fetching food:", err);
        setSavedFoodError(err);
        setSavedFoodLoading(false);
      }
    }
    
    fetchFood();
  }, []);
  
  return { savedFoodList, savedFoodLoading, savedFoodError };
}

function toPayload(rows: FoodRowDTO[], committeeId: string, authorId: string): FoodRowPayload[] {
  return rows
    .filter((row) => row.foodId !== "" && row.quantity !== "" && row.co2Value !== null) // the food and the quantity has been set to something
    .map((row) => ({
      id: row.id,
      objectId: row.foodId,
      authorId: authorId,
      committeeId: committeeId,
      quantity: row.quantity as number,
      category: row.category
    }));
}

async function saveFoodRows(rows: FoodRowDTO[], committeeId: string, authorId: string) {
  const payload = toPayload(rows, committeeId, authorId);

  if (payload.length === 0) {
    throw new Error("No valid food rows to save.");
  }

  const response = await fetch(`${API_URL}/addFoodItems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items: payload }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? `Request failed with status ${response.status}`);
  }

  return response.json();
}

export { useFoodList, useSavedFoodList, saveFoodRows, useFood }