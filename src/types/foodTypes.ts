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
  id: number;
  name: string;
  category: string;
};

type FoodRowProps = {
  foods: Food[];
};

export type { CompleteFood, Food, FoodRowProps};