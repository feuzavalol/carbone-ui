import { EmptyMeal, type MealType } from "../types/mealTypeTypes";
import buildPath from "./helper/buildPath";
import { useFetch } from "./helper/useFetch";

function useNextMealCategory(committeeId : string | null){
  const path: string | null = committeeId ? buildPath("/nextAvailableMeal", { committeeId }) : null;;
  const { data, loading, error } = useFetch<MealType>(path, EmptyMeal());
  
  return { nextMeal: data, loading, error };
}

export { useNextMealCategory }