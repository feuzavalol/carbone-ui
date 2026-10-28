import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { MissingTokenMessage, useAsyncStatus } from "../../fetching/ErrorHandling";
import { useGood, useGoodCategories, useUnits, modifyGood, createGood } from "../../fetching/UseGood";
import type { CompleteGood } from "../../types/goodsTypes";
import GoodForm from "../../components/GoodForm";

export default function GoodDetails(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const id: string | null = urlParams.get('id');

    const { token } = useAuth();
    let navigate = useNavigate();
    
    const { good, loading, error } = useGood(id);
    const alreadyExists = id != null;
    const updateGoodDatabase = id != null ? modifyGood : createGood;
        
    
    const {units, unitsLoading, unitsError} = useUnits(); // ["unités","kg","L"];
    const {goodCategories, goodCategoriesLoading, goodCategoriesError} = useGoodCategories(); // ["Goodies","Vêtements","Décorations","Tabac"];

    const [modifiedGood, setModifiedGood] = useState<CompleteGood>();

    useEffect(() => {
        setModifiedGood(good);
    }, [good])

    

    // const isMissing = MissingToken({token}); // Should be changed to something that is type compliant
    if (token == null){
        return MissingTokenMessage; // This early return is not
    }
    if (useAsyncStatus({loading, error})){return useAsyncStatus({loading, error});}
    if (useAsyncStatus({loading: unitsLoading, error: unitsError})){
        return useAsyncStatus({loading: unitsLoading, error: unitsError});
    }
    if (useAsyncStatus({loading: goodCategoriesLoading, error: goodCategoriesError})){
        return useAsyncStatus({loading: goodCategoriesLoading, error: goodCategoriesError});
    }

    const goBackToOverview = () => {
        let path: string = `/db/goods`;
        navigate(path);
    } 

    const onSubmit = (updated: CompleteGood) => {
        console.log("Submitted:", updated);
        updateGoodDatabase(updated, token);
        goBackToOverview();
    };    

    return (
        <div>
            <GoodForm 
                item={modifiedGood} 
                expectedUnitOptions={units} 
                categoryOptions={goodCategories}
                alreadyExists={alreadyExists}
                onSubmit={onSubmit}/>
        </div>
    )
}