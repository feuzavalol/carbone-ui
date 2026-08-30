import { memo } from "react";
import { useState, useEffect } from "react";
import { useAsyncStatus } from "../fetching/ErrorHandling";
import { ObjectSearchableDropdown } from "./Dropdown";
import { useGood } from "../fetching/UseGood"
import type { GoodRowProps, Good } from "../types/goodsTypes"
import { fetchGoodCarbonValue } from "../fetching/useCarbon";
import "./style/Row.css";

function GoodRow({ goods, data, onChange }: GoodRowProps) {
  const { id, goodId, name, category, quantity, co2Value } = data;
  const [ selectedGood, setSelectedGood ] = useState<Good | null>(null);

  // Fetch good if the row is filled, i.e. the goodId != null
  const { good, loading, error } = useGood(goodId || null);
  const status = useAsyncStatus({ loading, error });

  useEffect(() => {
    if (goodId !== "" && good) {
      setSelectedGood(good);
    }
  }, [goodId, good]);

  if (status) return status;
  

  async function handleGoodSelect(good: Good) {
    setSelectedGood(good);
    onChange({ name: good.name, goodId: good.id, co2Value: null });
    if (quantity !== "" && quantity > 0) {
      const result = await fetchGoodCarbonValue(good.id, quantity);
      onChange({ co2Value: result });
    }
  }

  async function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const qty = e.target.value === "" ? "" : parseFloat(e.target.value);
    onChange({ quantity: qty });
    if (goodId && qty !== "" && qty > 0) {
      const result = await fetchGoodCarbonValue(goodId, qty);
      onChange({ co2Value: result });
    } else {
      onChange({ co2Value: null });
    }
  }

  const expectedUnit = selectedGood?.expectedUnit != null ? `(${selectedGood?.expectedUnit})` : ""

  return (
    <div className="row">

      {/* Column headers */}
      <div className="col-header">Achat</div>
      <div className="col-header">Catégorie</div>
      <div className="col-header col-header--right">Quantité <em className="col-header-sub">{expectedUnit}</em></div>
      <div className="col-header col-header--right">Émissions <em className="col-header-sub">(kgCO2-éq)</em></div>

      {/* Good dropdown */}
      <div className="cell cell--border-right cell--dropdown">
        <ObjectSearchableDropdown
          options={goods}
          selectedObject={selectedGood}
          computeOnSelect={handleGoodSelect}
        />
      </div>

      {/* Category (read-only) */}
      <div className="cell cell--border-right cell--text cell--category">
        {selectedGood?.category ?? "—"}
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

export default memo(GoodRow);