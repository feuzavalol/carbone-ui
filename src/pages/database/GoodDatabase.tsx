import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { MissingToken, useAsyncStatus } from "../../fetching/ErrorHandling";
import { useGoodList } from "../../fetching/UseGood";
import type { CompleteGood } from "../../types/goodsTypes";
import { GoodGrid } from "../../components/DatabaseCard";
import "./Database.css"
import { useNavigate } from "react-router-dom";


export default function GoodDatabase(){
    const { token } = useAuth();
    let navigate = useNavigate();
    const isMissing = MissingToken({token});

    const [search, setSearch] = useState('');

    const {goodList, loading, error} = useGoodList();

    if (isMissing){return isMissing;}
    if (useAsyncStatus({loading, error})){return useAsyncStatus({loading, error});}

    const goToCreateMenu = () => {
        let path: string = `/db/goods/create`;
        navigate(path);
    }

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
            <button onClick={goToCreateMenu}>Créer un nouveau bien</button>
            <GoodGrid goods={goodList.filter((item: CompleteGood) => {
                return search.toLowerCase() === '' ? item : item.name.toLowerCase().includes(search);
            })}/>   
        </div>
    )

}

