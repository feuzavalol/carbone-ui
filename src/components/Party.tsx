import { useState, useEffect } from "react";
import { decodeJwt, useAuth } from "../auth/AuthContext";
import { Grid } from "../layouts/HelpCSS";
import { useAsyncStatus } from "../fetching/ErrorHandling";
import { ModeOfTransportation, RouteSelect } from "./Trip";
import { useParty, saveParty } from "../fetching/useTransport";
import type { TripRowDTO } from "../types/transportTypes";
import type { AuthUser } from "../types/authTypes";
import type { PartyRowDTO } from "../types/partyType";
import './style/Party.css';

export default function TransportParty() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const fetchedCommitteeId: string | null = urlParams.get('id');

  const { token } = useAuth();
  const { party, loading, error } = useParty(fetchedCommitteeId);
  const [selectedParty, setSelectedParty] = useState<PartyRowDTO | undefined>(party);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const status = useAsyncStatus({ loading, error });

  useEffect(() => {
    if (party != undefined) {
      setSelectedParty(party);
    }
  }, [party]);

  if (token == null) {
    return <div>You lost connection. You might want to relogin before doing this action.</div>;
  }
  if (fetchedCommitteeId == null) {
    return <div>Something went wrong when fetching the url parameter...<br />The committee id parameter doesn't seem to be present</div>;
  }
  if (status) return status;
  if (selectedParty == undefined) {
    return <div>Loading...</div>;
  }

  const safeToken = token;
  const committeeId: string = fetchedCommitteeId;
  const author: AuthUser = decodeJwt(safeToken);
  const authorId: string = author.id;

  const busTrip: TripRowDTO | undefined = selectedParty.busTrip;
  const carTrip: TripRowDTO | undefined = selectedParty.carTrip;

  function updateTrip(id: string, updates: Partial<TripRowDTO>) {
    setSelectedParty((prev) => {
      if (prev == undefined) return prev;
      if (prev.busTrip?.id === id) {
        return { ...prev, busTrip: { ...prev.busTrip, ...updates } };
      }
      if (prev.carTrip?.id === id) {
        return { ...prev, carTrip: { ...prev.carTrip, ...updates } };
      }
      return prev;
    });
  }

  function routeUpdateParty(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRouteId = e.target.value;
    setSelectedParty((prev) => (prev == undefined ? prev : { ...prev, routeId: newRouteId }));
  }

  async function handleSave() {
    if (selectedParty == undefined) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const savedParty = await saveParty(selectedParty, committeeId, authorId, safeToken);
      setSelectedParty(savedParty.saved);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <Grid className="whole-party-grid-container">
      <Grid area="departure" className="whole-route-grid-container">
        <RouteSelect routeId={selectedParty.routeId} onChange={routeUpdateParty} />
      </Grid>
      <Grid area="transportation" className="whole-transportation-grid-container">
        <Grid area="bus">
          <ModeOfTransportation
            isBus={true}
            onChange={(updates) => busTrip != undefined && updateTrip(busTrip.id, updates)}
            trip={busTrip}
            quantityText="aller-retours" />
        </Grid>
        <Grid area="car">
          <ModeOfTransportation
            isBus={false}
            onChange={(updates) => carTrip != undefined && updateTrip(carTrip.id, updates)}
            trip={carTrip}
            quantityText="aller-retours" />
        </Grid>
      </Grid>
      <Grid area="save-button">
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save all"}
        </button>
        {saveError && <p className="error">{saveError}</p>}
      </Grid>
    </Grid>
  );
}