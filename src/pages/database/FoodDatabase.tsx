import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { MissingToken, useAsyncStatus } from "../../fetching/ErrorHandling";
import { useFoodList } from "../../fetching/UseFood";
import { FoodGrid } from "../../components/DatabaseCard";
import type { CompleteFood } from "../../types/foodTypes";
import "./Database.css"


export default function FoodDatabase(){
    const { token } = useAuth();
    let navigate = useNavigate();
    const isMissing = MissingToken({token});

    const [search, setSearch] = useState('');

    const {foodList, loading, error} = useFoodList();

    if (isMissing){return isMissing;}
    if (useAsyncStatus({loading, error})){return useAsyncStatus({loading, error});}

    const goToCreateMenu = () => {
        let path: string = `/db/food/create`;
        navigate(path);
    }

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
            <button onClick={goToCreateMenu}>Créer un nouveau bien</button>
            <FoodGrid foods={foodList.filter((item: CompleteFood) => {
                return search.toLowerCase() === '' ? item : item.name.toLowerCase().includes(search);
            })}/>   
        </div>
    )

}

