import { useState } from "react";
import { FoodSearchableDropdown } from "./SearchableDropdown";
import type { FoodRowProps, Food } from "../types/foodTypes"
import "./Row.css";

const API_URL="http://localhost:8080";

export default function FoodRow({ foods }: FoodRowProps) {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState<number | "">("");
  const [carbonValue, setCarbonValue] = useState<number | null>(null);

  async function handleFoodSelect(food: Food) {
    setSelectedFood(food);
    setCarbonValue(null);
    if (quantity !== "" && quantity > 0) {
      const result = await fetchCarbonValue(food.id, quantity);
      setCarbonValue(result);
    }
  }

  async function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const qty = e.target.value === "" ? "" : parseFloat(e.target.value);
    setQuantity(qty);
    if (selectedFood && qty !== "" && qty > 0) {
      const result = await fetchCarbonValue(selectedFood.id, qty);
      setCarbonValue(result);
    } else {
      setCarbonValue(null);
    }
  }

  return (
    <div className="row">

      {/* Column headers */}
      <div className="col-header">Plat <em className="col-header-sub">(nom)</em></div>
      <div className="col-header">Catégorie <em className="col-header-sub">(nom)</em></div>
      <div className="col-header col-header--right">Quantité <em className="col-header-sub">(kg)</em></div>
      <div className="col-header col-header--right">Émissions <em className="col-header-sub">(kgCO2-éq)</em></div>

      {/* Food dropdown */}
      <div className="cell cell--border-right">
        <FoodSearchableDropdown
          options={foods}
          selected={selectedFood}
          computeOnSelect={handleFoodSelect}
        />
      </div>

      {/* Category (read-only) */}
      <div className="cell cell--border-right cell--text">
        {selectedFood?.category ?? "—"}
      </div>

      {/* Quantity input */}
      <div className="cell cell--border-right cell--right">
        <input
          type="number"
          min={0}
          step={0.1}
          placeholder="0"
          value={quantity}
          onChange={handleQuantityChange}
          className="qty-input"
        />
      </div>

      {/* Carbon value (read-only, green when filled) */}
      <div className={`cell cell--right cell--result ${carbonValue !== null ? "cell--result-filled" : ""}`}>
        {carbonValue !== null ? carbonValue.toFixed(1) : "—"}
      </div>

    </div>
  );
}

async function fetchCarbonValue(foodId: number, quantity: number): Promise<number> {
  const response = await fetch(`${API_URL}/foodCarbon?foodId=${foodId}&quantity=${quantity}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
  const data = await response.json();
  console.log(data);
  return data.carbon_value;
}