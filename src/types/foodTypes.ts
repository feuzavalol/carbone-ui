type CompleteFood = {
  id: string,
  name: string,
  cost_per_unit: Int16Array,
  food_group: string,
  sub_food_group: string,
  details: string | null,
  source: string | null,
  unit: string | null
}

type Food = {
  id: string,
  name: string,
  category: string,
};

type FoodRowDTO = {
  id: string | "", // corresponds to the food item id
  foodId: string | "", // corresponds to the food id
  name: string | "",
  category: string | "", // TODO: not clear between foodgroup and category (repas 1, ...)
  quantity: number | "",
  co2Value: number | null
}

interface FoodRowProps {
  foods: Food[];
  data: FoodRowDTO;
  onChange: (updates: Partial<FoodRowDTO>) => void;
}

interface FoodRowData {
  id: string;
  selectedFood: Food | null;
  quantity: number | "";
  carbonValue: number | null;
}

type FoodRowPayload = {
  id: string;
  objectId: string;
  authorId: string;
  committeeId: string;
  quantity: number;
  category: string;
}

type FoodItemRequest = {
  committeeId: string;
  category: string;
}

export type { CompleteFood, Food, FoodRowProps, FoodRowDTO, FoodRowData, FoodRowPayload, FoodItemRequest };