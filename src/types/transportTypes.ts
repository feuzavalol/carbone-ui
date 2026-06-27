type CompleteTransport = {
  id: string,
  type: string,
  name: string,
  cost_per_unit: Int16Array,
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

type TransportRowProps = {
  transport: Transport;
};

export type { CompleteTransport, Transport, TransportRowProps};