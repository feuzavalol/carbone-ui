import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { MissingTokenMessage, useAsyncStatus } from "../../fetching/helper/ErrorHandling";
import { useGood, useGoodCategories, useUnits, useCreateGood, useRemoveGood } from "../../fetching/UseGood";
import type { CompleteGood } from "../../types/goodsTypes";
import GoodForm from "../../components/GoodForm";
import { createChangeItemRequest } from "../../types/Requests/ChangeItem";
import { useRouteChange } from "../../components/helper/onRouteChange";

export default function GoodDetails(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const id: string | null = urlParams.get('id');
    const actualPage = "/db/goods";

    const { goTo } = useRouteChange();
    const { token } = useAuth();
    
    const { good, loading, error } = useGood(id);
    const alreadyExists = id != null;
    
    const { mutate: createGood } = useCreateGood();
    const { mutate: modifyGood } = useRemoveGood();
    const updateGoodDatabase = id != null ? modifyGood : createGood;
    
    const {units, unitsLoading, unitsError} = useUnits(); // ["unités","kg","L"];
    const {goodCategories, goodCategoriesLoading, goodCategoriesError} = useGoodCategories(); // ["Goodies","Vêtements","Décorations","Tabac"];

    const [modifiedGood, setModifiedGood] = useState<CompleteGood>();

    useEffect(() => {
        setModifiedGood(good || undefined);
    }, [good])

    const goodStatus = useAsyncStatus({ loading, error });
    const unitsStatus = useAsyncStatus({ loading: unitsLoading, error: unitsError });
    const categoryStatus = useAsyncStatus({ loading: goodCategoriesLoading, error: goodCategoriesError });
    
    if (token == null) return <MissingTokenMessage />; 
    if (goodStatus) return goodStatus;
    if (unitsStatus) return unitsStatus;
    if (categoryStatus) return categoryStatus;

    const onSubmit = (updated: CompleteGood) => {
        // console.log("Submitted:", updated);
        try {
            updateGoodDatabase(createChangeItemRequest(updated));
        }
        catch (err: any){
            // console.log("Update of database failed or crashed: ", err.message);
        }
        goTo(actualPage);
    };    

    if (!modifiedGood) return null;

    return (
        <div>
            <GoodForm 
                item={modifiedGood} 
                expectedUnitOptions={units} 
                categoryOptions={goodCategories}
                alreadyExists={alreadyExists}
                onSubmit={onSubmit}
                previousPage={actualPage}
                />
        </div>
    )
}