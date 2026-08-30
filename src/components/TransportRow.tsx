import { useState } from "react";
import type { TransportRowProps } from "../types/transportTypes";
import { fetchTransportCarbonValue } from "../fetching/useCarbon";
import "./style/TransportRow.css";


export default function TransportRow({ transport }: TransportRowProps) {
  const [distance, setDistance] = useState<number | string>(transport.distance);
  const [carbonValue, setCarbonValue] = useState<number | null>(transport.co2Value);

  async function handleDistanceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const dist = e.target.value === "" ? "" : parseFloat(e.target.value);
    setDistance(dist);
    transport.distance = dist;
    if (dist !== "" && dist > 0) {
      const result = await fetchTransportCarbonValue(transport.transportId, dist);
      setCarbonValue(result);
      transport.co2Value = result;
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