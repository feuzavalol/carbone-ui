// import { useState, useCallback, useEffect } from "react";
import { API_URL } from "../constants/url";
// import { useApi } from "./useApi";

function getUrl(category: string, objectId: string, value: number){
  let url: string;
  switch (category){
    case "transport":
      url = `${API_URL}/transportCarbon?transportId=${objectId}&distance=${value}`;
      break;
    case "food":
      url = `${API_URL}/foodCarbon?foodId=${objectId}&quantity=${value}`;
      break;
    case "good":
      url = `${API_URL}/goodCarbon?goodId=${objectId}&quantity=${value}`;
      break;
    default:
      throw new Error("This category cannot be fetched yet");
  }
  return url;
}

async function fetchCarbonValue(category: string, objectId: string, value: number, token: string): Promise<number> {
  const url = getUrl(category, objectId, value);
  const response = await fetch(url,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });
  const data = await response.json();
  return data.carbon_value;
}

async function fetchFoodCarbonValue(foodId: string, quantity: number, token: string): Promise<number> {
  return fetchCarbonValue("food",foodId,quantity,token);
}

async function fetchTransportCarbonValue(transportId: string, distance: number, token: string): Promise<number> {
  return fetchCarbonValue("transport",transportId,distance,token);
}

async function fetchGoodCarbonValue(goodId: string, quantity: number, token: string): Promise<number> {
  return fetchCarbonValue("good",goodId,quantity,token);
}

export { fetchFoodCarbonValue, fetchTransportCarbonValue, fetchGoodCarbonValue }