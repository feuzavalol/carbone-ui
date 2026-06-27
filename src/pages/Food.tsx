import { useEffect, useState } from "react";
import FoodRow from "../components/FoodRow";
import type { Food, CompleteFood } from "../types/foodTypes"

const API_URL="http://localhost:8080";

// type SimplifiedFood = {
//   name: string
// }

function useFoodList() {
  const [foodList, setFoodList] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchFood() {
      try {        
        const response = await fetch(`${API_URL}/food`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });

        const foods = await response.json();
        const simplifiedFood: Food[] = foods.map((item: CompleteFood) => ({
          id: item.id,
          name: item.name,
          category: item.food_group
        }));
        setFoodList(simplifiedFood);
          
        console.log(foods);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching food:", err);
        setError(err);
        setLoading(false);
      }
    }
    
    fetchFood();
  }, []);
  
  return { foodList, loading, error };
};

export default function Food(){ 
  const { foodList, loading, error } = useFoodList();
  const [foodRowList, setFoodRowList] = useState<typeof FoodTest[]>([]);

  // setFoodRowList([<FoodRow foods={foodList} />])

  const FoodTest = () => {
    return <FoodRow foods = {foodList}/>;
  }

  const onAddButtonClick = () => {
    setFoodRowList(foodRowList.concat(<FoodTest key={foodRowList.length} />));
  };
  return ( 
    <div> 
      {foodRowList}
      <button onClick={onAddButtonClick}>Add row</button>
    </div>
  )
}
