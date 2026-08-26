import { ModeOfTransportation } from "./Trip";
import type { Trip } from "../types/transportTypes";

const dummyTrips: Trip[] = [
    {
        id: "1",
        energyUsage: {
            consumption: 10,
            energy: "Diesel",
            unit: "L/100km"
        },
        quantity: 10
    },
    {
        id: "2",
        energyUsage: {
            consumption: 4,
            energy: "Essence",
            unit: "L/100km"
        },
        quantity: 250
        
    }
] 

export default function Cars({trips}:{trips:Trip[]}){
    trips = dummyTrips;
    return (
        <div>
            {trips.map((t: Trip) => (
                <ModeOfTransportation key={t.id} isBus={false} trip={t}/>
            ))}
        </div>
    )
}