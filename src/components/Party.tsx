import { Grid } from "../layouts/HelpCSS";
import { ModeOfTransportation, PlaceSelect } from "./Trip";
import './Party.css'

export default function TransportParty() {
  return (
    <Grid className="whole-party-grid-container">
      <Grid area="departure" className="whole-departure-grid-container">
        <Grid area="departure"><PlaceSelect isDeparture={true} /></Grid>
        <Grid area="arrival"><PlaceSelect isDeparture={false} /></Grid>
      </Grid>
      <Grid area="transportation" className="whole-transportation-grid-container">
        <Grid area="bus"><ModeOfTransportation isBus={true} /></Grid>
        <Grid area="car"><ModeOfTransportation isBus={false} /></Grid>
      </Grid>
    </Grid>
  );
}