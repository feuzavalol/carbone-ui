import { useEffect, useState, useCallback } from "react";
import type { Good, CompleteGood, GoodRowDTO, GoodRowPayload } from "../types/goodsTypes";
import { API_URL } from "../constants/url";
import { useApi } from "./useApi";
import { useAuth } from "../auth/AuthContext";

function useGood(goodId: string | null){
  const { token } = useAuth();
  const [good, setGood] = useState<Good | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!goodId) {
      setGood(null);
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
        const good: Good = await response.json();
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
  const [goodList, setGoodList] = useState<Good[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchGood = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/good`);
      const goods = await response.json();
      const simplifiedGood: Good[] = goods.map((item: CompleteGood) => ({
        id: item.id,
        name: item.name,
        category: item.category
      }));
      setGoodList(simplifiedGood);
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