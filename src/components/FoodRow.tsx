import { memo } from "react";
import { useState, useEffect } from "react";
import { useAsyncStatus } from "../fetching/ErrorHandling";
import { ObjectSearchableDropdown } from "./Dropdown";
import { useFood } from "../fetching/UseFood"
import type { FoodRowProps, Food } from "../types/foodTypes"
import { fetchFoodCarbonValue } from "../fetching/useCarbon";
import "./style/Row.css";

function FoodRow({ foods, data, onChange }: FoodRowProps) {
  const { id, foodId, name, category, quantity, co2Value } = data;
  const [ selectedFood, setSelectedFood ] = useState<Food | null>(null);

  // Fetch food if the row is filled, i.e. the foodId != null
  const { food, loading, error } = useFood(foodId || null);
  const status = useAsyncStatus({ loading, error });

  useEffect(() => {
    if (foodId !== "" && food) {
      setSelectedFood(food);
    }
  }, [foodId, food]);

  if (status) return status;
  

  async function handleFoodSelect(food: Food) {
    setSelectedFood(food);
    onChange({ name: food.name, foodId: food.id, co2Value: null });
    if (quantity !== "" && quantity > 0) {
      const result = await fetchFoodCarbonValue(food.id, quantity);
      onChange({ co2Value: result });
    }
  }

  async function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const qty = e.target.value === "" ? "" : parseFloat(e.target.value);
    onChange({ quantity: qty });
    if (foodId && qty !== "" && qty > 0) {
      const result = await fetchFoodCarbonValue(foodId, qty);
      onChange({ co2Value: result });
    } else {
      onChange({ co2Value: null });
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
        <ObjectSearchableDropdown
          options={foods}
          selectedObject={selectedFood}
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
      <div className={`cell cell--right cell--result ${co2Value !== null ? "cell--result-filled" : ""}`}>
        {co2Value !== null ? co2Value.toFixed(1) : "—"}
      </div>

    </div>
  );
}

export default memo(FoodRow);