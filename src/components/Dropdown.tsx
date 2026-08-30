import { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import type { Food } from "../types/foodTypes";
import type { Good } from "../types/goodsTypes"

type Object = Food | Good

type CustomOption = {
  value: Object,
  label: string
}

function convertObjectToCustomOption(f: Object){
  const opt : CustomOption = {
    value: f,
    label: f.name
  }
  return opt
}

function toCustomOption(l:Object[]){
  return l.map((f:Object) => convertObjectToCustomOption(f));
}

function ObjectSearchableDropdown( {options, selectedObject, computeOnSelect}: {
    options: Object[], 
    selectedObject: Object | null, 
    computeOnSelect: (f: Object) => Promise<void>
    } ) {
  
  const [displayedSelectedObject, setDisplayedSelectedObject] = useState<CustomOption | null>(null);

  const objectOptions = useMemo(() => toCustomOption(options), [options]);
  function handleSelect(objectOption: CustomOption) {
    setDisplayedSelectedObject(objectOption);
    computeOnSelect(objectOption.value); // used to compute the carbon value of this object item
  }

  useEffect(() => {
      if (selectedObject != null){
        setDisplayedSelectedObject(convertObjectToCustomOption(selectedObject));
      }
    }, [selectedObject]);
  
  
  return (
    <div style={{ position: "relative", width: 280 }}>
        <Select
            options={objectOptions}
            value={displayedSelectedObject}
            onChange={handleSelect}
        />
    </div>
  );
}

export { ObjectSearchableDropdown }