import type { TripRowDTO } from "./transportTypes"

type PartyRowDTO = {
    id: string,
    routeId: string,
    busTrip: TripRowDTO,
    carTrip: TripRowDTO
}

export type { PartyRowDTO }