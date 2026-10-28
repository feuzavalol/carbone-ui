import { useEffect, useState, useCallback } from "react";
import type { CompleteGood, GoodRowDTO, GoodRowPayload } from "../types/goodsTypes";
import { API_URL } from "../constants/url";
import { useApi } from "./useApi";
import { useAuth } from "../auth/AuthContext";

const EmptyGood: () => CompleteGood = () => {
    return {
        id: "",
        name: "",
        costPerUnit: 0,
        category: "",
        details: "",
        source: "",
        comments: "",
        unit: "",
        expectedUnit: ""
    }
}

function useGood(goodId: string | null){
  const { token } = useAuth();
  const [good, setGood] = useState<CompleteGood>(EmptyGood());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!goodId) {
      setGood(EmptyGood());
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function fetchGood() {
      try {        
        const response = await fetch(`${API_URL}/singleGood?goodId=${goodId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
        });

        if(!response.ok) throw new Error(`Failed to fetch good with id=${goodId}`);
        const good: CompleteGood = await response.json();
        if (!cancelled) setGood(good);
      } catch (err: any) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    
    fetchGood();
  return () => {
      cancelled = true; // cleanup: ignore this result if goodId changes again mid-flight
    };
  }, [goodId]);
  
  return { good, loading, error };
}

function useGoodList() {
  const apiFetch = useApi();
  const [goodList, setGoodList] = useState<CompleteGood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchGood = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/good`);
      const goods = await response.json();
      // const simplifiedGood: Good[] = goods.map((item: CompleteGood) => ({
      //   id: item.id,
      //   name: item.name,
      //   category: item.category
      // }));
      setGoodList(goods);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching good:", err);
      setError(err);
      setLoading(false);
      }
  }, [apiFetch]);

  useEffect(() => {
    fetchGood();
  }, [fetchGood]);
  
  return { goodList, loading, error };
};

function useGoodCategories(){
  const apiFetch = useApi();
  const [goodCategories, setGoodCategories] = useState<string[]>([]);
  const [goodCategoriesLoading, setLoading] = useState(true);
  const [goodCategoriesError, setError] = useState(null);
  
  const fetchGood = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/goodCategories`);
      const categories = await response.json();
        setGoodCategories(categories.success);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching good categories:", err);
        setError(err);
        setLoading(false);
      }
  }, [apiFetch]);

  useEffect(() => {
    fetchGood();
  }, [fetchGood]);
  
  return { goodCategories, goodCategoriesLoading, goodCategoriesError };
}

function useUnits(){
  const apiFetch = useApi();
  const [units, setUnits] = useState<string[]>([]);
  const [unitsLoading, setLoading] = useState(true);
  const [unitsError, setError] = useState(null);
  
  const fetchUnits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/expectedUnits`);
      const units = await response.json();
        setUnits(units.success);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching good units:", err);
        setError(err);
        setLoading(false);
      }
  }, [apiFetch]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);
  
  return { units, unitsLoading, unitsError };
}

async function postRequest(route: string, token: string, good: CompleteGood){
  const response = await fetch(`${API_URL}${route}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ good: good }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? `Request failed with status ${response.status}`);
  }
  return response.json();
}

async function modifyGood(good: CompleteGood, token: string){
  return postRequest("/modifyGood", token, good);
}

async function createGood(good: CompleteGood, token: string){
  return postRequest("/createGood", token, good);
}

function useSavedGoodList(committeeId: string){
  const apiFetch = useApi();
  const [savedGoodList, setSavedGoodList] = useState<GoodRowDTO[]>([]);
  const [savedGoodLoading, setSavedGoodLoading] = useState(true);
  const [savedGoodError, setSavedGoodError] = useState(null);
  
  const fetchGood = useCallback(async () => {
    try {
      setSavedGoodLoading(true);
      const response = await apiFetch(`${API_URL}/goodItem?committeeId=${committeeId}`);
      const goods = await response.json();
        setSavedGoodList(goods.success);
        setSavedGoodLoading(false);
      } catch (err: any) {
        console.error("Error fetching good:", err);
        setSavedGoodError(err);
        setSavedGoodLoading(false);
      }
  }, [apiFetch, committeeId]);

  useEffect(() => {
    fetchGood();
  }, [fetchGood]);
  
  return { savedGoodList, savedGoodLoading, savedGoodError };
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

async function saveGoodRows(rows: GoodRowDTO[], committeeId: string, authorId: string, token: string) {
  const payload = toPayload(rows, committeeId, authorId);
  // console.log("payload:", payload);

  if (payload.length === 0) {
    throw new Error("No valid good rows to save.");
  }

  const response = await fetch(`${API_URL}/addGoodItems`, {
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

async function removeGoodRow(row: GoodRowDTO, committeeId: string, authorId: string, token: string){
  if (row.goodId === "" || row.quantity === "" || row.co2Value === null){
    return;
  }
  const removedRow = rowToItemDTO(row, committeeId, authorId);

  const response = await fetch(`${API_URL}/removeGoodItems`, {
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

export { useGoodList, useSavedGoodList, saveGoodRows, useGood, removeGoodRow }
export { useGoodCategories, useUnits }
export { modifyGood, createGood }