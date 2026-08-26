import { useEffect, useState, useCallback } from "react";
import { useApi } from "./useApi";
import type { TransportRowDTO, TransportRowPayload } from "../types/transportTypes"
import { API_URL } from "../constants/url";

function useTransportList(committeeId: string) {
  const [transportList, setTransportList] = useState<TransportRowDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const apiFetch = useApi();
  
  const fetchTransport = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/transportItem?committeeId=${committeeId}`);
      const transports: TransportRowDTO[] = await response.json();
      setTransportList(transports);
      setLoading(false);
      } 
    catch (err: any) {
      console.error("Error fetching transport items:", err);
      setError(err);
      setLoading(false);
    }
  }, [apiFetch, committeeId]);

  useEffect(() => {
    fetchTransport();
  }, [fetchTransport]);
  
  return { transportList, loading, error };
}

function rowToItemDTO(row: TransportRowDTO, committeeId: string, authorId: string){
  return {
      id: row.id,
      objectId: row.transportId,
      authorId: authorId,
      committeeId: committeeId,
      distance: row.distance === "" ? 0 : row.distance as number
    }
}

function toPayload(rows: TransportRowDTO[], committeeId: string, authorId: string): TransportRowPayload[] {
  return rows
    .filter((row) => row.transportId !== "")
    .map((row) => rowToItemDTO(row,committeeId,authorId));
}

async function saveTransportRows(rows: TransportRowDTO[], committeeId: string, authorId: string, token: string) {
  const payload = toPayload(rows, committeeId, authorId);
  console.log("payload:", payload);

  if (payload.length === 0) {
    throw new Error("No valid transport rows to save.");
  }

  const response = await fetch(`${API_URL}/addTransportItems`, {
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
  console.log(response)
  return response.json();
}

export { useTransportList, saveTransportRows }