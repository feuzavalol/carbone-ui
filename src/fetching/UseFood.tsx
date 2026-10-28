import { useEffect, useState, useCallback } from "react";
import type { Food, CompleteFood, FoodRowDTO, FoodRowPayload, FoodCategory } from "../types/foodTypes";
import { API_URL } from "../constants/url";
import { useApi } from "./useApi";
import { useAuth } from "../auth/AuthContext";

const EmptyFood: () => CompleteFood = () => {
    return {
        id: "",
        name: "",
        costPerUnit: 0,
        foodGroup: "",
        subFoodGroup: "",
        source: "",
        details: "",
        unit: ""
    }
}

function useFood(foodId: string | null){
  const { token } = useAuth();
  const [food, setFood] = useState<CompleteFood | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Guard INSIDE the effect, not around the hook call
    if (!foodId) {
      setFood(EmptyFood());
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
        const food: CompleteFood = await response.json();
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
  const [foodList, setFoodList] = useState<CompleteFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchFood = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/food`);
      const foods = await response.json();
      // const simplifiedFood: Food[] = foods.map((item: CompleteFood) => ({
      //   id: item.id,
      //   name: item.name,
      //   category: item.food_group
      // }));
      setFoodList(foods);
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

function useFoodGroup(){
  const apiFetch = useApi();
  const [foodGroup, setFoodGroup] = useState<string[]>([]);
  const [foodGroupLoading, setLoading] = useState(true);
  const [foodGroupError, setError] = useState(null);
  
  const fetchFoodGroup = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/foodGroup`);
      const categories = await response.json();
        setFoodGroup(categories.success);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching food groups:", err);
        setError(err);
        setLoading(false);
      }
  }, [apiFetch]);

  useEffect(() => {
    fetchFoodGroup();
  }, [fetchFoodGroup]);
  
  return { foodGroup, foodGroupLoading, foodGroupError };
}

function useSubFoodGroup(){
  const apiFetch = useApi();
  const [subFoodGroup, setFoodGroup] = useState<string[]>([]);
  const [subFoodGroupLoading, setLoading] = useState(true);
  const [suboodGroupError, setError] = useState(null);
  
  const fetchFoodGroup = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/subFoodGroup`);
      const categories = await response.json();
        setFoodGroup(categories.success);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching sub food groups:", err);
        setError(err);
        setLoading(false);
      }
  }, [apiFetch]);

  useEffect(() => {
    fetchFoodGroup();
  }, [fetchFoodGroup]);
  
  return { subFoodGroup, subFoodGroupLoading, suboodGroupError };
}

function useUnits(){
  const apiFetch = useApi();
  const [units, setUnits] = useState<string[]>([]);
  const [unitsLoading, setLoading] = useState(true);
  const [unitsError, setError] = useState(null);
  
  const fetchUnits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/units`);
      const units = await response.json();
        setUnits(units.success);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching food units:", err);
        setError(err);
        setLoading(false);
      }
  }, [apiFetch]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);
  
  return { units, unitsLoading, unitsError };
}

type ChangeFoodRequest = {
  food: CompleteFood
}

async function request(requestKeyWord: string, route: string, bodyContent: ChangeFoodRequest, token: string){
  const response = await fetch(`${API_URL}${route}`, {
    method: `${requestKeyWord}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(bodyContent),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? `Request failed with status ${response.status}`);
  }
  return await response.json();
}

async function modifyFood(food: CompleteFood, token: string){
  return request("POST","/modifyFood", {food: food}, token);
}

async function createFood(food: CompleteFood, token: string){
  return request("POST","/createFood", {food: food}, token);
}

async function removeFood(food: CompleteFood, token: string){
  return request("DELETE", "/removeFood", {food: food}, token)
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
export { modifyFood, createFood, removeFood, useFoodGroup, useSubFoodGroup, useUnits }