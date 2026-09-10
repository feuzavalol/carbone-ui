import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import type { AuthUser } from "../types/authTypes";
import { decodeJwt } from "../auth/AuthContext";
import { CarTrip } from "./Trip";
import { removeTripRow, saveTripRows, useTripList } from "../fetching/useTransport";
import type { TripRowDTO } from "../types/transportTypes";
import TrashIcon from "../assets/trash.png"
import "./style/Cars.css"

export default function Cars({trips}:{trips:TripRowDTO[]}){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const fetchedCommitteeId: string | null = urlParams.get('id');
    const { token } = useAuth();
    
    if (token == null){
    return <div>You lost connection. You might want to relogin before doing this action.</div>
    }
    const safeToken = token;
    const author: AuthUser = decodeJwt(safeToken);
    const authorId: string = author.id;

    if (fetchedCommitteeId == null){
        return <div>Something went wrong when fetching the url parameter...<br/>The committee id parameter doesn't seem to be present</div>
    }
    const committeeId: string = fetchedCommitteeId;

    const [numberTripDisplayed, setNumberTripDisplayed] = useState<number>(0);
    const [displayedTrips, setDisplayedTrips] = useState<TripRowDTO[]>(trips);

    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const [isRemoving, setIsRemoving] = useState(false);
    const [removeError, setRemoveError] = useState<string | null>(null);
    const [removedItem, setRemovedItem] = useState<TripRowDTO | null>(null);

    const handleRemoveItem = (elementToRemove: TripRowDTO) => {
        /*Removes the item inside the list displayed in the UI*/
        setDisplayedTrips(prev => prev.filter(tripRowDTO => tripRowDTO.id !== elementToRemove.id ))
    };

    /*Pop-up variables*/
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleOpen = (row:TripRowDTO) => {setRemovedItem(row);setIsOpen(true)};
    const handleCancel = () => setIsOpen(false);

    const { tripList, numberTrip, loading, error } = useTripList(committeeId)

    useEffect(() => {
        if (numberTrip) {
            setNumberTripDisplayed(numberTrip);
        }
    }, [numberTrip]);

    useEffect(() => {
        if (tripList) {
            setDisplayedTrips(tripList.slice(0, numberTripDisplayed));
        }
    }, [tripList, numberTripDisplayed]);

    function addRow(){
        setNumberTripDisplayed(prev => prev + 1); 
    }

    // function addRow(){
    //     setDisplayedTrips((prev) => [
    //   ...prev,
    //   { id: crypto.randomUUID(), routeId: null, quantity: 0, usageId: "", energy: "", consumption: 0, comment: ""},
    // ]);
    // }

    async function handleSave() {
        setIsSaving(true);
        setSaveError(null);
        try {
            const savedTripRows = await saveTripRows(displayedTrips, committeeId, authorId, safeToken);
            setDisplayedTrips(savedTripRows.saved);
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
                const removedTripRow = await removeTripRow(removedItem, committeeId, authorId, safeToken);
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

    function updateTripRow(id: string, updates: Partial<TripRowDTO>) {
        setDisplayedTrips((prev) =>
        prev.map((row) => (row.id === id ? { ...row, ...updates } : row))
        );
    }

    return (
        <div>
            {displayedTrips.map((t: TripRowDTO) => (
                <div>
                    <CarTrip key={t.id} trip={t} quantityText="km" onChange={(updates: any) => updateTripRow(t.id, updates)}/>
                    <button><img src={TrashIcon} alt="Delete" onClick={()=>handleOpen(t)} title={t.comment ?? "Voyage sans nom"} className="w-4 h-4"/></button>
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
            
            <button onClick={addRow}>Add row</button>
            <br />
            <button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save all"}
            </button>
            {saveError && <p className="error">{saveError}</p>}
        </div>
    )
}