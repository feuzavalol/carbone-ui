import { useEffect, useState, useCallback } from "react";
import { useApi } from "./useApi";
import type { TransportRowDTO, TransportRowPayload, TripRowDTO, TripRowPayload } from "../types/transportTypes"
import { API_URL } from "../constants/url";
import type { Route } from "../types/routeType";
import type { PartyRowDTO } from "../types/partyType";

function useTransportList(committeeId: string) {
  const [transportList, setTransportList] = useState<TransportRowDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const apiFetch = useApi();
  
  const fetchTransport = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/transportItem?committeeId=${committeeId}`);
      const transports = await response.json();
      setTransportList(transports.success);
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
  return response.json();
}



function useTripList(committeeId: string): { tripList: TripRowDTO[], numberTrip: number, loading: boolean, error: Error | null } {
  const [tripList, setTripList] = useState<TripRowDTO[]>([]);
  const [numberTrip, setNumberTrip] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const apiFetch = useApi();
  
  const fetchTrip = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/carTrip?committeeId=${committeeId}`);
      const data = await response.json();
      setTripList(data.success.trips);
      setNumberTrip(data.success.number)
      setLoading(false);
      } 
    catch (err: any) {
      console.error("Error fetching trips:", err);
      setError(err);
      setLoading(false);
    }
  }, [apiFetch, committeeId]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);
  
  return { tripList, numberTrip, loading, error };
}



function rowToTripItemDTO(row: TripRowDTO, committeeId: string, authorId: string): TripRowPayload{
  return {
      id: row.id,
      authorId: authorId,
      committeeId: committeeId,
      quantity: row.quantity as number,
      usageId: row.usageId,
      energy: row.energy,
      consumption: row.consumption,
      routeId: row.routeId,
      comment: row.comment || ""
    }
}

function toTripPayload(rows: TripRowDTO[], committeeId: string, authorId: string): TripRowPayload[] {
  return rows
    .filter((row) => row.id !== "" && row.quantity !== 0 && row.energy !== "" && row.consumption !== 0) // the food and the quantity has been set to something
    .map((row) => rowToTripItemDTO(row,committeeId,authorId));
}


async function saveTripRows(rows: TripRowDTO[], committeeId: string, authorId: string, token: string){
  const payload = toTripPayload(rows, committeeId, authorId);

  if (payload.length === 0) {
    throw new Error("No valid trip rows to save.");
  }

  const response = await fetch(`${API_URL}/addTrips`, {
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
  return response.json();
}

async function removeTripRow(removedItem: TripRowDTO, committeeId: string, authorId: string, token: string){
  if (removedItem.energy === null && removedItem.consumption === 0 && removedItem.quantity === 0, removedItem.comment === ""){
      return;
    }
    const removedRow = rowToTripItemDTO(removedItem, committeeId, authorId);
  
    const response = await fetch(`${API_URL}/removeTrip`, {
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

// --------------------------------------------------------
// ---------------------- PARTY ---------------------------
// --------------------------------------------------------


function useParty(committeeId: string | null): { party: PartyRowDTO | undefined, loading: boolean, error: Error | null } {
  const [party, setParty] = useState<PartyRowDTO | undefined>(undefined);
  const [loading, setLoading] = useState(committeeId != null);
  const [error, setError] = useState<Error | null>(null);
  const apiFetch = useApi();

  const fetchParty = useCallback(async () => {
    if (committeeId == null) {
      setParty(undefined);
      setLoading(false);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch(`${API_URL}/party?committeeId=${committeeId}`);
      const data = await response.json();
      setParty(data.success);
    } catch (err: any) {
      console.error("Error fetching party:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, committeeId]);

  useEffect(() => {
    fetchParty();
  }, [fetchParty]);

  return { party, loading, error };
}

async function saveParty(party: PartyRowDTO, committeeId: string, authorId: string, token: string){
  const busTrip = rowToTripItemDTO(party.busTrip, committeeId, authorId);
  const carTrip = rowToTripItemDTO(party.carTrip, committeeId, authorId);
  const payload = {id: party.id, committeeId, authorId, busTrip, carTrip, routeId: party.routeId};

  const response = await fetch(`${API_URL}/addParty`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({item: payload}),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? `Request failed with status ${response.status}`);
  }
  return response.json();
}

// --------------------------------------------------------
// ---------------------- ROUTE ---------------------------
// --------------------------------------------------------

function useRoute(): { routes: Route[], loading: boolean, error: Error | null } {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const apiFetch = useApi();
  
  const fetchParty = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/routes`);
      const routes = await response.json();
      setRoutes(routes.success);
      setLoading(false);
      } 
    catch (err: any) {
      console.error("Error fetching party:", err);
      setError(err);
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchParty();
  }, [fetchParty]);
  
  return { routes, loading, error };
}

export { useTransportList, saveTransportRows }
export { saveTripRows, useTripList, removeTripRow }
export { useParty, saveParty, useRoute }