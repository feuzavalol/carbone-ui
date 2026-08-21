import { API_URL } from "../constants/url";

async function fetchFoodCarbonValue(foodId: string, quantity: number): Promise<number> {
  const response = await fetch(`${API_URL}/foodCarbon?foodId=${foodId}&quantity=${quantity}`,
    {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    });
  const data = await response.json();
  return data.carbon_value;
}

async function fetchTransportCarbonValue(transportId: number, distance: number): Promise<number> {
  const response = await fetch(`${API_URL}/transportCarbon?transportId=${transportId}&distance=${distance}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data.carbon_value;
}

export { fetchFoodCarbonValue, fetchTransportCarbonValue }