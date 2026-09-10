import { useState, useEffect, useId } from "react";
import { useAsyncStatus } from "../fetching/ErrorHandling";
import { useRoute } from "../fetching/useTransport";
import { Grid } from "../layouts/HelpCSS";
import { energyOptions, convertEnergyCategoryToDisplay, getUnit, type Energy } from "../constants/energy";
import type { TripRowDTO } from "../types/transportTypes";
import type { Route } from "../types/routeType";

// ---------------------------------------------------------------------------
// Shared logic: energy / consumption / quantity fields used by both
// ModeOfTransportation and CarTrip.
// ---------------------------------------------------------------------------

function useTripFields(trip: TripRowDTO | undefined, onChange: (updates: Partial<TripRowDTO>) => void) {
  const [consumption, setConsumption] = useState<number | string>(trip?.consumption ?? 0);
  const [quantity, setQuantity] = useState<number | string>(trip?.quantity ?? 0);
  const [selectedEnergy, setSelectedEnergy] = useState<Energy | null>(
    trip?.energy != undefined ? convertEnergyCategoryToDisplay(trip.energy) : null
  );
  const [selectedUnit, setSelectedUnit] = useState<string>(trip?.energy != undefined ? getUnit(trip.energy) : "");

  // Resync local state whenever the underlying trip's own values change
  // (e.g. the row is loaded asynchronously, or the parent swaps which trip
  // this component is editing). This is what the old no-op useEffect was
  // trying, and failing, to do.
  useEffect(() => {
    if (trip == undefined) return;
    setConsumption(trip.consumption);
    setQuantity(trip.quantity);
    setSelectedEnergy(convertEnergyCategoryToDisplay(trip.energy));
    setSelectedUnit(getUnit(trip.energy));
  }, [trip?.consumption, trip?.quantity, trip?.energy]);

  function handleEnergyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newEnergy = e.target.value;
    setSelectedEnergy(convertEnergyCategoryToDisplay(newEnergy));
    setSelectedUnit(getUnit(newEnergy));
    onChange({ energy: newEnergy });
  }

  function handleConsumptionChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cons = e.target.value === "" ? "" : parseFloat(e.target.value);
    setConsumption(cons);
    onChange({ consumption: cons === "" ? 0 : cons });
  }

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const qty = e.target.value === "" ? "" : parseInt(e.target.value, 10);
    setQuantity(qty);
    onChange({ quantity: qty === "" ? 0 : qty });
  }

  return {
    consumption,
    quantity,
    selectedEnergy,
    selectedUnit,
    handleEnergyChange,
    handleConsumptionChange,
    handleQuantityChange,
  };
}

function EnergyQuantityFields({
  energySelectId,
  selectedEnergy,
  selectedUnit,
  consumption,
  quantity,
  quantityText,
  onEnergyChange,
  onConsumptionChange,
  onQuantityChange,
}: {
  energySelectId: string;
  selectedEnergy: Energy | null;
  selectedUnit: string;
  consumption: number | string;
  quantity: number | string;
  quantityText?: string;
  onEnergyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onConsumptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <Grid area="select-transportation">
        <select
          name="select-energy"
          id={energySelectId}
          value={selectedEnergy ?? ""}
          onChange={onEnergyChange}
        >
          <option value="" disabled>Select an option</option>
          {energyOptions.map((option) => (
            <option key={option.id} value={option.name}>{option.name}</option>
          ))}
        </select>
      </Grid>

      <Grid area="input-consumption">
        <input
          type="number"
          min={0}
          step={0.1}
          placeholder="0"
          value={consumption}
          onChange={onConsumptionChange}
          className="transport-input"
        />
      </Grid>
      <Grid area="unit" className="unit-section">{selectedUnit}</Grid>

      <Grid area="input-number">
        <input
          type="number"
          min={0}
          step={1}
          placeholder="0"
          value={quantity}
          onChange={onQuantityChange}
          className="transport-input"
        />
      </Grid>
      <Grid area="number-text" className="unit-section">{quantityText || "aller-retours"}</Grid>
    </>
  );
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function getRouteFromId(routes: Route[], routeId: string | null){
  if (routeId == null){return null;}
  for (const route of routes){
    if (route.id === routeId) {
      return route;
    }
  }
  return null;
}

function RouteSelect({ routeId, onChange }: { routeId: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) {
  const text = "Trajet";
  const { routes, loading, error } = useRoute();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  useEffect(() => {
    if (selectedRoute == null){
      setSelectedRoute(getRouteFromId(routes,routeId));
    }    
  })
  const status = useAsyncStatus({ loading, error });
  const selectId = useId();
  if (status) return status;

  return (
    <Grid className="route-grid-container">
      <Grid area="text-route">{text}</Grid>
      <Grid area="select-route">
        <select name="routes" id={selectId} value={selectedRoute?.id ?? ""} 
          onChange={(e) => {setSelectedRoute(getRouteFromId(routes,e.target.value));onChange(e)}}>
          <option value="" disabled>Select an option</option>
          {routes.map((route: Route) => (
            <option key={route.id} value={route.id}>{route.name}</option>
          ))}
        </select>
      </Grid>
    </Grid>
  );
}

function ModeOfTransportation({ isBus, trip, quantityText, onChange }:
    { isBus: boolean, trip?: TripRowDTO, quantityText?: string, onChange: (updates: Partial<TripRowDTO>) => void }) {
  const mode = isBus ? "Bus :" : "Voiture :";
  const energySelectId = useId();
  const fields = useTripFields(trip, onChange);

  return (
    <div className="mode-transportation-grid-container">
      <Grid area="mode-transportation">{mode}</Grid>
      <EnergyQuantityFields
        energySelectId={energySelectId}
        selectedEnergy={fields.selectedEnergy}
        selectedUnit={fields.selectedUnit}
        consumption={fields.consumption}
        quantity={fields.quantity}
        quantityText={quantityText}
        onEnergyChange={fields.handleEnergyChange}
        onConsumptionChange={fields.handleConsumptionChange}
        onQuantityChange={fields.handleQuantityChange}
      />
    </div>
  );
}

function CarTrip({ trip, quantityText, onChange }:
  { trip: TripRowDTO, quantityText?: string, onChange: (updates: Partial<TripRowDTO>) => void }) {
  const energySelectId = useId();
  const fields = useTripFields(trip, onChange);
  const [comment, setComment] = useState<string>(trip.comment || "");

  useEffect(() => {
    setComment(trip.comment || "");
  }, [trip.comment]);

  function handleCommentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newComment = e.target.value;
    setComment(newComment);
    onChange({ comment: newComment });
  }

  return (
    <div className="car-transportation-grid-container">
      <Grid area="comment-transportation">
        <input
          placeholder="Ajoutez un titre à ce voyage..."
          value={comment}
          onChange={handleCommentChange}
          className="comment-input"
        />
      </Grid>
      <Grid area="mode-transportation">Voiture</Grid>
      <EnergyQuantityFields
        energySelectId={energySelectId}
        selectedEnergy={fields.selectedEnergy}
        selectedUnit={fields.selectedUnit}
        consumption={fields.consumption}
        quantity={fields.quantity}
        quantityText={quantityText}
        onEnergyChange={fields.handleEnergyChange}
        onConsumptionChange={fields.handleConsumptionChange}
        onQuantityChange={fields.handleQuantityChange}
      />
    </div>
  );
}

export { ModeOfTransportation, RouteSelect, CarTrip };