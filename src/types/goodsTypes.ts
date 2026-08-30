type CompleteGood = {
  id: string,
  name: string,
  cost_per_unit: Int16Array,
  category: string,
  details: string | null,
  source: string | null,
  comments: string | null,
  unit: string | null,
  expectedUnit: string | null
}

type Good = {
  id: string,
  name: string,
  category: string,
  expectedUnit: string | null
};

type GoodRowDTO = {
  id: string | "", // corresponds to the good item id
  goodId: string | "", // corresponds to the good id
  name: string | "",
  category: string | "", // TODO: not clear between goodgroup and category (repas 1, ...)
  quantity: number | "",
  co2Value: number | null,
  expectedUnit: string | null
}

interface GoodRowProps {
  goods: Good[];
  data: GoodRowDTO;
  onChange: (updates: Partial<GoodRowDTO>) => void;
}

interface GoodRowData {
  id: string;
  selectedGood: Good | null;
  quantity: number | "";
  carbonValue: number | null;
}

type GoodRowPayload = {
  id: string;
  objectId: string;
  authorId: string;
  committeeId: string;
  quantity: number;
}

type GoodItemRequest = {
  committeeId: string;
  category: string;
}

export type { CompleteGood, Good, GoodRowProps, GoodRowDTO, GoodRowData, GoodRowPayload, GoodItemRequest };