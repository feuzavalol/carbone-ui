import { useState } from "react";
import type { Food } from "../types/foodTypes"
import type { Transport } from "../types/transportTypes"



function FoodSearchableDropdown( {options, selected, computeOnSelect}: {
    options: Food[], 
    selected: Food | null, 
    computeOnSelect: (f: Food) => Promise<void>
    } ) {
  const [isOpen, setIsOpen]     = useState(false);
  const [query, setQuery]       = useState("");

  // Filter options whenever the query changes
  const filtered = options.filter((o: Food) =>
    o.name.toLowerCase().includes(query.toLowerCase())
  );
  var selected_name: string;
  if (selected != null){
    selected_name = selected.name;
  }
  else{
    selected_name = "Choose a food item...";
  }

  function handleSelect(option: Food) {
    computeOnSelect(option); // used to compute the carbon value of this food item
    setIsOpen(false); // disable the dropdown menu to clear the space for the user
    setQuery("");
  }
  
  
  return (
    <div style={{ position: "relative", width: 280 }}>

      <button onClick={() => setIsOpen(prev => !prev)}>
        {selected_name}
      </button>

      {isOpen && (
        <div style={{ position: "absolute", top: "100%", width: "100%" }}>

          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search…"
          />

          <ul>
            {filtered.length === 0
              ? <li>No results</li>
              : filtered.map(option => (
                  <li key={option.id} onClick={() => handleSelect(option)}>
                    {option.name}
                  </li>
                ))
            }
          </ul>
        </div>
      )}
    </div>
  );
}

function TransportSearchableDropdown( {options, selected, computeOnSelect}: {
    options: Transport[], 
    selected: Transport | null, 
    computeOnSelect: (f: Transport) => Promise<void>
    } ) {
  const [isOpen, setIsOpen]     = useState(false);
  const [query, setQuery]       = useState("");

  // Filter options whenever the query changes
  const filtered = options.filter((o: Transport) =>
    o.name.toLowerCase().includes(query.toLowerCase())
  );
  var selected_name: string;
  if (selected != null){
    selected_name = selected.name;
  }
  else{
    selected_name = "Choose a transport item...";
  }

  function handleSelect(option: Transport) {
    computeOnSelect(option); // used to compute the carbon value of this transport item
    setIsOpen(false); // disable the dropdown menu to clear the space for the user
    setQuery("");
  }
  
  
  return (
    <div style={{ position: "relative", width: 280 }}>

      <button onClick={() => setIsOpen(prev => !prev)}>
        {selected_name}
      </button>

      {isOpen && (
        <div style={{ position: "absolute", top: "100%", width: "100%" }}>

          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search…"
          />

          <ul>
            {filtered.length === 0
              ? <li>No results</li>
              : filtered.map(option => (
                  <li key={option.id} onClick={() => handleSelect(option)}>
                    {option.name}
                  </li>
                ))
            }
          </ul>
        </div>
      )}
    </div>
  );
}

export { FoodSearchableDropdown, TransportSearchableDropdown}