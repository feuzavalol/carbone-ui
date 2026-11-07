import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useAsyncStatus } from "../../fetching/helper/ErrorHandling";
import { useFoodList } from "../../fetching/UseFood";
import { FoodGrid } from "../../components/DatabaseCard";
import type { CompleteFood } from "../../types/foodTypes";
import "./Database.css"
import { useRouteChange } from "../../components/helper/onRouteChange";


export default function FoodDatabase(){
    const { goTo } = useRouteChange();
    
    const { token } = useAuth();
    if (token == null){
        return <div>You're not connected. You might want to relogin before doing this action.</div>
    }

    const [search, setSearch] = useState('');

    const {foodList, loadingFoodList: loading, errorFoodList: error} = useFoodList();

    if (useAsyncStatus({loading, error})){return useAsyncStatus({loading, error});}

    return (
        <div>
            <label className="label-search-grid">
                Rechercher un aliment :
                <input
                className="input-search-grid"
                name="search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
            </label>
            <button onClick={() => goTo("/db/food/create")}>Créer un nouvel aliment ou boisson</button>
            <FoodGrid foods={foodList.filter((item: CompleteFood) => {
                return search.toLowerCase() === '' ? item : item.name.toLowerCase().includes(search);
            })}/>   
        </div>
    )

}

