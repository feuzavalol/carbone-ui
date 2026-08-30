import { useState, useEffect } from "react";
import { useAsyncStatus } from "../fetching/ErrorHandling";
import { useAuth } from "../auth/AuthContext";
import GoodRow from "../components/GoodRow";
import { useGoodList, useSavedGoodList, saveGoodRows, removeGoodRow } from "../fetching/UseGood";
import type { GoodRowDTO } from "../types/goodsTypes"
import TrashIcon from "../assets/trash.png"
import { jwtDecode } from "jwt-decode";



export default function Goods(){ 
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const fetchedCommitteeId: string | null = urlParams.get('id');
  const { token } = useAuth();
  
  if (token == null){
    return <div>You lost connection. You might want to relogin before doing this action.</div>
  }
  const safeToken = token;
  const authorId: string = jwtDecode(safeToken).id;

  if (fetchedCommitteeId == null){
      return <div>Something went wrong when fetching the url parameter...<br/>The committee id parameter doesn't seem to be present</div>
  }
  const committeeId: string = fetchedCommitteeId;

  const { goodList, loading, error } = useGoodList();
  const { savedGoodList, savedGoodLoading, savedGoodError } = useSavedGoodList(committeeId);
  const [goodRowList, setGoodRowList] = useState<GoodRowDTO[]>([]);

  const handleRemoveItem = (elementToRemove:GoodRowDTO) => {
    /*Removes the item inside the list displayed in the UI*/
    setGoodRowList(prev => prev.filter(goodRowDTO => goodRowDTO.id !== elementToRemove.id ))
  };

  /*Pop-up variables*/
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = (row:GoodRowDTO) => {setRemovedItem(row);setIsOpen(true)};
  const handleCancel = () => setIsOpen(false);

  useEffect(() => {
    console.log("savedGoodList a changé", savedGoodList);
    if (savedGoodList) {
      setGoodRowList(savedGoodList);
    }
  }, [savedGoodList]);

  function addGoodRow() {
    setGoodRowList((prev) => [
      ...prev,
      { id: crypto.randomUUID(), goodId: "", name: "", category: "", quantity: "", co2Value: null },
    ]);
  }

  function updateGoodRow(id: string, updates: Partial<GoodRowDTO>) {
    setGoodRowList((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...updates } : row))
    );
  }

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [removedItem, setRemovedItem] = useState<GoodRowDTO | null>(null);

  async function handleSave() {
    console.log("goodRowList: ",goodRowList);
    setIsSaving(true);
    setSaveError(null);
    try {
      const savedGoodRows = await saveGoodRows(goodRowList, committeeId, authorId, safeToken);
      console.log("saving successful");
      setGoodRowList(savedGoodRows.saved);
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

  const savedStatus = useAsyncStatus({ loading: savedGoodLoading, error: savedGoodError });
  if (savedStatus) return savedStatus;

  async function handleRemove() {
    try {
      if (removedItem !== null){
        const removedGoodRows = await removeGoodRow(removedItem, committeeId, authorId, safeToken);
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
        <h2>Biens</h2>
        {goodRowList.map((row: GoodRowDTO) => (
          <div key={row.id}>
          
            <GoodRow
              key={row.id}
              goods={goodList}
              data={row}
              onChange={(updates: any) => updateGoodRow(row.id, updates)}
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
        <button onClick={addGoodRow}>Add row</button>
        <br/>
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save all"}
        </button>
        {saveError && <p className="error">{saveError}</p>}
        {removeError && <p className="error">{removeError}</p>}
      </div>
  )
}
