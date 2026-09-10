import { useState, useEffect } from "react";
import { useAuth, decodeJwt } from "../auth/AuthContext";
import { Grid } from "../layouts/HelpCSS";
import { saveTransportRows, useTransportList } from "../fetching/useTransport";
import TransportRow from "../components/TransportRow";
import TransportParty from "../components/Party";
import Cars from "../components/Cars";
import type { Transport, TransportRowDTO } from "../types/transportTypes";
import "./Transport.css";

export default function Transport(){ 
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const fetchedCommitteeId: string | null = urlParams.get('id');
  
  const { token } = useAuth();
  
  
  if (token == null){
    return <div>You lost connection. You might want to relogin before doing this action.</div>
  }
  const safeToken = token;
  const authorId: string = decodeJwt(safeToken).id;

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
      if (transportList) {
        setTransportRowList(transportList);
      }
    }, [transportList]);

  async function handleSave() {
    setIsSaving(true);
    setSaveError(null);
    try {
      const savedTransportRows = await saveTransportRows(transportRowList, committeeId, authorId, safeToken);
      setTransportRowList(savedTransportRows.saved);
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
          <h2>Transport hors</h2>
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
          <h2>Soirée</h2>
          <TransportParty/>
        </div>
      </Grid>
      <Grid area="cars">
        <div>
          <h2>Trajets voiture</h2>
          <Cars trips={[]}/>
        </div>
      </Grid>
    </Grid>
  )
}
