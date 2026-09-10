import type { EnergyCategories, Energy } from "../constants/energy";

type CompleteTransport = {
  id: string,
  type: string,
  name: string,
  cost_per_unit: number,
  unit: string | null,
  details: string | null,
  comments: string | null,
  source: string | null
}

type Transport = {
  id: number;
  name: string;
  unit: string;
};

type TransportRowDTO = {
  id: string | "", // corresponds to the transport item id
  transportId: string | "", // corresponds to the transport id
  name: string | "",
  distance: number | "",
  unit: string | "",
  co2Value: number | null
}

type TransportRowProps = {
  transport: TransportRowDTO;
};

type TransportRowPayload = {
  id: string;
  objectId: string;
  authorId: string;
  committeeId: string;
  distance: number;
}

type EnergyUsage = {
  consumption: number,
  energy: Energy | EnergyCategories
}

type TripRowDTO = {
  id: string,
  routeId: string | null,
  usageId: string, 
  energy: Energy | EnergyCategories, 
  consumption: number, 
  quantity: number, 
  comment: string | null
}

type TripRowPayload = {
  id: string, 
  authorId: string,
  committeeId: string,
  usageId: string,  
  quantity: number,  
  energy: Energy | EnergyCategories,  
  consumption: number,  
  routeId: string | null,  
  comment: string
}



export type { CompleteTransport, Transport, TransportRowDTO, TransportRowProps, TransportRowPayload};
export type { EnergyUsage, TripRowDTO, TripRowPayload };