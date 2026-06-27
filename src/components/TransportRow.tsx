import { useState } from "react";
import type { TransportRowProps } from "../types/transportTypes";
import "./TransportRow.css";

const API_URL = "http://localhost:8080";


export default function TransportRow({ transport }: TransportRowProps) {
  const [distance, setDistance] = useState<number | "">("");
  const [carbonValue, setCarbonValue] = useState<number | null>(null);

  async function handleDistanceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const dist = e.target.value === "" ? "" : parseFloat(e.target.value);
    setDistance(dist);
    if (dist !== "" && dist > 0) {
      const result = await fetchCarbonValue(transport.id, dist);
      setCarbonValue(result);
    } else {
      setCarbonValue(null);
    }
  }

  return (
    <div className="transport-row">

      {/* Transport name */}
      <div className="transport-cell transport-cell--name transport-cell--border-right">
        {transport.name}
      </div>

      {/* Distance input */}
      <div className="transport-cell transport-cell--border-right transport-cell--right">
        <input
          type="number"
          min={0}
          step={1}
          placeholder="0"
          value={distance}
          onChange={handleDistanceChange}
          className="transport-distance-input"
        />
        <span className="transport-unit">km</span>
      </div>

      {/* Carbon result */}
      <div className={`transport-cell transport-cell--right transport-cell--result ${carbonValue !== null ? "transport-cell--result-filled" : ""}`}>
        {carbonValue !== null ? carbonValue.toFixed(1) : "—"}
      </div>

    </div>
  );
}

async function fetchCarbonValue(transportId: number, distance: number): Promise<number> {
  const response = await fetch(`${API_URL}/transportCarbon?transportId=${transportId}&distance=${distance}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data.carbon_value;
}