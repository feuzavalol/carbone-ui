import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useRouteChange } from "../../components/helper/onRouteChange";
import { useAsyncStatus } from "../../fetching/helper/ErrorHandling";
import { useGoodList } from "../../fetching/UseGood";
import type { CompleteGood } from "../../types/goodsTypes";
import { GoodGrid } from "../../components/DatabaseCard";
import "./Database.css"


export default function GoodDatabase(){
    const { goTo } = useRouteChange();
    
    const { token } = useAuth();
    if (token == null){
        return <div>You're not connected. You might want to relogin before doing this action.</div>
    }

    const [search, setSearch] = useState('');

    const {goodList, loading, error} = useGoodList();

    
    if (useAsyncStatus({loading, error})){return useAsyncStatus({loading, error});}

    return (
        <div>
            <label className="label-search-grid">
                Rechercher un bien :
                <input
                className="input-search-grid"
                name="search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
            </label>
            <button onClick={() => goTo("/db/goods/create")}>Créer un nouveau bien</button>
            <GoodGrid goods={goodList.filter((item: CompleteGood) => {
                return search.toLowerCase() === '' ? item : item.name.toLowerCase().includes(search);
            })}/>   
        </div>
    )

}

