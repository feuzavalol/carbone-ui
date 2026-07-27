import { useState, useEffect } from "react";
import { useAsyncStatus } from "../fetching/ErrorHandling";
import { FoodRow } from "../components/FoodRow";
import { useFoodList, useSavedFoodList, saveFoodRows } from "../fetching/UseFood";
import type { Food, FoodRowDTO } from "../types/foodTypes"

export default function Food(){ 
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const committeeId: string | null = urlParams.get('id');
  const authorId: string = "858e07f9-84a2-11f1-8a5e-1eca7b0dbe67";
  if (committeeId == null){
      return <div>Something went wrong when fetching the url parameter...</div>
  }
  const { foodList, loading, error } = useFoodList();
  const { savedFoodList, savedFoodLoading, savedFoodError } = useSavedFoodList(committeeId, "test");
  const [foodRowList, setFoodRowList] = useState<FoodRowDTO[]>([]);

  useEffect(() => {
    if (savedFoodList) {
      setFoodRowList(savedFoodList);
    }
  }, [savedFoodList]);

  function addFoodRow() {
    setFoodRowList((prev) => [
      ...prev,
      { id: crypto.randomUUID(), foodId: "", name: "", category: "", quantity: "", co2Value: null },
    ]);
  }

  function updateFoodRow(id: string, updates: Partial<FoodRowDTO>) {
    setFoodRowList((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...updates } : row))
    );
  }

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSave() {
    setIsSaving(true);
    setSaveError(null);
    try {
      const savedFoodRows = await saveFoodRows(foodRowList, committeeId, authorId);
      setFoodRowList(savedFoodRows.saved);
      // e.g. show a success toast, reset form, etc.
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  const status = useAsyncStatus({ loading, error });
  if (status) return status;

  const savedStatus = useAsyncStatus({ loading: savedFoodLoading, error: savedFoodError });
  if (savedStatus) return savedStatus;

  return ( 
      <div>
        {foodRowList.map((row: FoodRowDTO) => (
          <FoodRow
            key={row.id}
            foods={foodList}
            data={row}
            onChange={(updates) => updateFoodRow(row.id, updates)}
          />
        ))}
        <button onClick={addFoodRow}>Add row</button>
        <br/>
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save all"}
        </button>
        {saveError && <p className="error">{saveError}</p>}
      </div>
  )
}
