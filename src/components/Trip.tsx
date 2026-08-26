import { useState } from "react";
import Select, { type SingleValue } from "react-select";
import { Grid } from "../layouts/HelpCSS";
import { energyOptions, convertEnergyCategoryToDisplay, getUnit, type EnergyCategories, type Energy } from "../constants/energy";
import type { Trip } from "../types/transportTypes";
import type { Places } from "../constants/places";

type Named = { name: string };

type CustomOption = {
  value: Named,
  label: Energy | EnergyCategories | Places
}

function toOption(str: string){
    return {value: {name: str}, label: str};
}

function toOptions<T extends Named>(items: T[]): CustomOption[] {
  return items.map((item) => ({ value: item, label: item.name }));
}

// Merges "GridItem" (area placement) and "grid container" (className) into
// one component, so you don't need two nested divs to set both up.


function PlaceSelect({ isDeparture }: { isDeparture: boolean }) {
  const text = isDeparture ? "Départ :" : "Arrivée :";
  const places = [{ name: "Fort Pélissier" }, { name: "Pulnoy" }];
  const [selected, setSelected] = useState<CustomOption | null>(null);

  return (
    <Grid className="departure-grid-container">
      <Grid area="text-departure">{text}</Grid>
      <Grid area="select-departure">
        <Select options={toOptions(places)} value={selected} onChange={setSelected} />
      </Grid>
    </Grid>
  );
}

function ModeOfTransportation({ isBus, trip }: 
    { isBus: boolean, trip?: Trip }) {
  let fetchedEnergyConsumption: number = 0;
  let fetchedNumberRoundTrip: number = 0; 
  let energy: Energy | EnergyCategories = "";
  let unit: string = getUnit(energy); 
  console.log("La valeur du boolean d'avant :",trip != undefined);
  console.log(trip);
  if (trip != undefined){
    fetchedEnergyConsumption = trip.energyUsage.consumption;
    fetchedNumberRoundTrip = trip.quantity; 
    unit = trip.energyUsage.unit; 
    energy = trip.energyUsage.energy;
  };
  const mode = isBus ? "Bus :" : "Voiture :";
  

  const [energyConsumption, setEnergyConsumption] = useState<number | string>(fetchedEnergyConsumption);
  const [numberRoundTrip, setNumberRoundTrip] = useState<number>(fetchedNumberRoundTrip);
  const [selectedEnergy, setSelectedEnergy] = useState<CustomOption | null>(energy != undefined ? toOption(convertEnergyCategoryToDisplay(energy)) : null);
  const [selectedUnit, setSelectedUnit] = useState<string>(unit);

  function handleSelectEnergy(newEnergy: SingleValue<CustomOption>) {
    setSelectedEnergy(newEnergy?.label != undefined ? toOption(newEnergy?.label) : null);
    setSelectedUnit(newEnergy?.label != undefined ? getUnit(newEnergy.label) : "");
  }

  return (
    <div className="mode-transportation-grid-container">
      <Grid area="mode-transportation">{mode}</Grid>
      <Grid area="select-transportation">
        <Select options={toOptions(energyOptions)} value={selectedEnergy} onChange={(newEnergy) => handleSelectEnergy(newEnergy)} />
      </Grid>

      <Grid area="input-consumption">
        <input
          type="number"
          min={0}
          step={0.1}
          placeholder="0"
          value={energyConsumption}
          onChange={(e) => setEnergyConsumption(e.target.value === "" ? 0 : parseFloat(e.target.value))}
          className="transport-input"
        />
      </Grid>
      <Grid area="unit">{selectedUnit}</Grid>

      <Grid area="input-number">
        <input
          type="number"
          min={0}
          step={1}
          placeholder="0"
          value={numberRoundTrip}
          onChange={(e) => setNumberRoundTrip(e.target.value === "" ? 0 : parseFloat(e.target.value))}
          className="transport-input"
        />
      </Grid>
      <Grid area="number-text">aller-retours</Grid>
    </div>
  );
}

export { ModeOfTransportation, PlaceSelect}