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
  categoryId: string | "", // the id of the category used
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
  categoryId: string;
}

type FoodItemRequest = {
  committeeId: string;
  category: string;
}

type FoodCategory = {
  id: string,
  name: string,
  isListe: boolean
}

export type { CompleteFood, Food, FoodRowProps, FoodRowDTO, FoodRowData, FoodRowPayload, FoodItemRequest, FoodCategory };