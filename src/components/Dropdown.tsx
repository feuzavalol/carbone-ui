import { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import type { Food } from "../types/foodTypes";

type CustomOption = {
  value: Food,
  label: string
}

function convertFoodToCustomOption(f: Food){
  const opt : CustomOption = {
    value: f,
    label: f.name
  }
  return opt
}

function toCustomOption(l:Food[]){
  return l.map((f:Food) => convertFoodToCustomOption(f));
}

function FoodSearchableDropdown( {options, selectedFood, computeOnSelect}: {
    options: Food[], 
    selectedFood: Food | null, 
    computeOnSelect: (f: Food) => Promise<void>
    } ) {
  
  const [displayedSelectedFood, setDisplayedSelectedFood] = useState<CustomOption | null>(null);

  const foodOptions = useMemo(() => toCustomOption(options), [options]);
  function handleSelect(foodOption: CustomOption) {
    setDisplayedSelectedFood(foodOption);
    computeOnSelect(foodOption.value); // used to compute the carbon value of this food item
  }

  useEffect(() => {
      if (selectedFood != null){
        setDisplayedSelectedFood(convertFoodToCustomOption(selectedFood));
      }
    }, [selectedFood]);
  
  
  return (
    <div style={{ position: "relative", width: 280 }}>
        <Select
            options={foodOptions}
            value={displayedSelectedFood}
            onChange={handleSelect}
        />
    </div>
  );
}

export { FoodSearchableDropdown }