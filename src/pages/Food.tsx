import { useState, useEffect } from "react";
import { useAsyncStatus } from "../fetching/ErrorHandling";
import { decodeJwt, useAuth } from "../auth/AuthContext";
import FoodRow from "../components/FoodRow";
import { useFoodList, useSavedFoodList, saveFoodRows, removeFoodRow, useFoodCategory } from "../fetching/UseFood";
import type { Food, FoodRowDTO } from "../types/foodTypes"
import { convertFoodCategoryToDisplay } from "../constants/categories";
import TrashIcon from "../assets/trash.png";

export default function Food(){ 
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const fetchedCommitteeId: string | null = urlParams.get('id');
  const fetchedFoodCategoryIdParam: string | null = urlParams.get('category');

  const { token } = useAuth();

  const { fetchedFoodCategory, uniqueCategoryLoading, uniqueCategoryError } = useFoodCategory(fetchedFoodCategoryIdParam);

  const foodCategoryId: string | null = fetchedFoodCategory?.id ?? null;

  const { foodList, loading, error } = useFoodList();
  const { savedFoodList, savedFoodLoading, savedFoodError } = useSavedFoodList(
    fetchedCommitteeId ?? "",
    foodCategoryId ?? ""
  );

  const [foodRowList, setFoodRowList] = useState<FoodRowDTO[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [removedItem, setRemovedItem] = useState<FoodRowDTO | null>(null);

  useEffect(() => {
    if (savedFoodList) {
      setFoodRowList(savedFoodList);
    }
  }, [savedFoodList]);

  const status = useAsyncStatus({ loading, error });
  const savedStatus = useAsyncStatus({ loading: savedFoodLoading, error: savedFoodError });

  if (token == null){
    return <div>You lost connection. You might want to relogin before doing this action.</div>
  }
  const safeToken = token;
  const authorId: string = decodeJwt(safeToken).id;

  if (fetchedCommitteeId == null){
      return <div>Something went wrong when fetching the url parameter...<br/>The committee id parameter doesn't seem to be present</div>
  }
  const committeeId: string = fetchedCommitteeId;

  if (fetchedFoodCategoryIdParam == null){
    return <div>Something went wrong when fetching the url parameter...<br/>The category parameter doesn't seem to be present</div>
  }

  if (foodCategoryId == null){
    return <div>Something went wrong when fetching food category information...<br/>This issue is linked to the database</div>
  }

  if (status) return status;
  if (savedStatus) return savedStatus;

  const handleRemoveItem = (elementToRemove:FoodRowDTO) => {
    /*Removes the item inside the list displayed in the UI*/
    setFoodRowList(prev => prev.filter(foodRowDTO => foodRowDTO.id !== elementToRemove.id ))
  };

  const handleOpen = (row:FoodRowDTO) => {setRemovedItem(row);setIsOpen(true)};
  const handleCancel = () => setIsOpen(false);

  function addFoodRow() {
    setFoodRowList((prev) => [
      ...prev,
      { id: crypto.randomUUID(), foodId: "", name: "", categoryId: foodCategoryId || "", quantity: "", co2Value: null },
    ]);
  }

  function updateFoodRow(id: string, updates: Partial<FoodRowDTO>) {
    setFoodRowList((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...updates } : row))
    );
  }

  async function handleSave() {
    setIsSaving(true);
    setSaveError(null);
    try {
      const savedFoodRows = await saveFoodRows(foodRowList, committeeId, authorId, safeToken);
      setFoodRowList(savedFoodRows.saved);
      // e.g. show a success toast, reset form, etc.
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemove() {
    try {
      if (removedItem !== null){
        await removeFoodRow(removedItem, committeeId, authorId, safeToken);
        handleRemoveItem(removedItem);
      }
      // e.g. show a success toast, reset form, etc.
    } catch (err) {
      setRemoveError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsRemoving(false);
    }
    setRemovedItem(null);
    setIsOpen(false);
  };

  return ( 
      <div>
        <h2>{convertFoodCategoryToDisplay(fetchedFoodCategory?.name || "")}</h2>
        {foodRowList.map((row: FoodRowDTO) => (
          <div key={row.id}>
          
            <FoodRow
              key={row.id}
              foods={foodList}
              data={row}
              onChange={(updates: any) => updateFoodRow(row.id, updates)}
            />
            <button><img src={TrashIcon} alt="Delete" onClick={()=>handleOpen(row)} title={row.name} className="w-4 h-4"/></button>

            {/* Pop-up / Modal */}
            {isOpen && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Êtes-vous sûr ?</h3>
                  <p>Voulez-vous vraiment supprimer cette ligne ?</p>
                  <div className="modal-actions">
                    <button onClick={handleCancel}>Annuler</button>
                    <button onClick={handleRemove}>Supprimer</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <button onClick={addFoodRow}>Add row</button>
        <br/>
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save all"}
        </button>
        {saveError && <p className="error">{saveError}</p>}
        {removeError && <p className="error">{removeError}</p>}
      </div>
  )
}