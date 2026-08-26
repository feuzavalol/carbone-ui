import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { Grid } from "../layouts/HelpCSS";
import { saveTransportRows, useTransportList } from "../fetching/useTransport";
import TransportRow from "../components/TransportRow";
import TransportParty from "../components/Party";
import Cars from "../components/Cars";
import type { Transport, TransportRowDTO } from "../types/transportTypes"
import "./Transport.css"
// type SimplifiedTransport = {
//   name: string
// }


export default function Transport(){ 
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const fetchedCommitteeId: string | null = urlParams.get('id');
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

  const { transportList, loading, error } = useTransportList(committeeId);
  const [transportRowList, setTransportRowList] = useState<TransportRowDTO[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [removedItem, setRemovedItem] = useState<TransportRowDTO | null>(null);

  useEffect(() => {
      console.log("savedFoodList a changé", transportList);
      if (transportList) {
        setTransportRowList(transportList);
      }
    }, [transportList]);

  async function handleSave() {
    console.log("The thing we want to save:",transportRowList);
    setIsSaving(true);
    setSaveError(null);
    try {
      const savedTransportRows = await saveTransportRows(transportRowList, committeeId, authorId, safeToken);
      console.log("saving successful");
      setTransportRowList(savedTransportRows.saved);
      console.log("set the new list successful");
      // e.g. show a success toast, reset form, etc.
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  return ( 
    <Grid className="transport-grid-container">
      <Grid area="outsider">
        <div> 
          <h3>Transport hors</h3>
          {transportRowList.map((t: TransportRowDTO) => (
            <TransportRow key={t.id} transport={t} />
          ))}
          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save all"}
          </button>
          {saveError && <p className="error">{saveError}</p>}
        </div>
      </Grid>
      <Grid area="party">
        <div>
          <h3>Soirée</h3>
          <TransportParty/>
        </div>
      </Grid>
      <Grid area="cars">
        <div>
          <h3>Trajets voiture</h3>
          <Cars trips={[]}/>
        </div>
      </Grid>
    </Grid>
  )
}
