import { useState, useEffect } from "react";
import { useAsyncStatus } from "../fetching/ErrorHandling";
import { useAuth } from "../auth/AuthContext";
import FoodRow from "../components/FoodRow";
import { useFoodList, useSavedFoodList, saveFoodRows, removeFoodRow } from "../fetching/UseFood";
import type { Food, FoodRowDTO } from "../types/foodTypes"
import { convertFoodCategoryToDisplay } from "../constants/categories";
import TrashIcon from "../assets/trash.png"



export default function Food(){ 
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const fetchedCommitteeId: string | null = urlParams.get('id');
  const fetchedFoodCategory: string | null = urlParams.get('category');
  const authorId: string = "858e07f9-84a2-11f1-8a5e-1eca7b0dbe67";
  const { token } = useAuth();
  
  if (token == null){
    return <div>You lost connection. You might want to relogin before doing this action.</div>
  }
  const safeToken = token;

  if (fetchedCommitteeId == null){
      return <div>Something went wrong when fetching the url parameter...<br/>The committee id parameter doesn't seem to be present</div>
  }
  const committeeId: string = fetchedCommitteeId;

  if (fetchedFoodCategory == null){
    return <div>Something went wrong when fetching the url parameter...<br/>The category parameter doesn't seem to be present</div>
  }
  const foodCategory: string = fetchedFoodCategory;

  const { foodList, loading, error } = useFoodList();
  const { savedFoodList, savedFoodLoading, savedFoodError } = useSavedFoodList(committeeId, foodCategory);
  const [foodRowList, setFoodRowList] = useState<FoodRowDTO[]>([]);

  const handleRemoveItem = (elementToRemove:FoodRowDTO) => {
    /*Removes the item inside the list displayed in the UI*/
    setFoodRowList(prev => prev.filter(foodRowDTO => foodRowDTO.id !== elementToRemove.id ))
  };

  /*Pop-up variables*/
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = (row:FoodRowDTO) => {setRemovedItem(row);setIsOpen(true)};
  const handleCancel = () => setIsOpen(false);

  useEffect(() => {
    console.log("savedFoodList a changé", savedFoodList);
    if (savedFoodList) {
      setFoodRowList(savedFoodList);
    }
  }, [savedFoodList]);

  function addFoodRow() {
    setFoodRowList((prev) => [
      ...prev,
      { id: crypto.randomUUID(), foodId: "", name: "", category: foodCategory, quantity: "", co2Value: null },
    ]);
  }

  function updateFoodRow(id: string, updates: Partial<FoodRowDTO>) {
    setFoodRowList((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...updates } : row))
    );
  }

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [removedItem, setRemovedItem] = useState<FoodRowDTO | null>(null);

  async function handleSave() {
    console.log("foodRowList: ",foodRowList);
    setIsSaving(true);
    setSaveError(null);
    try {
      const savedFoodRows = await saveFoodRows(foodRowList, committeeId, authorId, safeToken);
      console.log("saving successful");
      setFoodRowList(savedFoodRows.saved);
      console.log("set the new list successful");
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

  async function handleRemove() {
    try {
      if (removedItem !== null){
        const removedFoodRows = await removeFoodRow(removedItem, committeeId, authorId, safeToken);
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
        <h2>{convertFoodCategoryToDisplay(foodCategory)}</h2>
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
