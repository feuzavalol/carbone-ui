import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { MissingTokenMessage, useAsyncStatus } from "../../fetching/ErrorHandling";
import { useFood, modifyFood, createFood, useUnits, useFoodGroup, useSubFoodGroup } from "../../fetching/UseFood";
import type { CompleteFood } from "../../types/foodTypes";
import FoodForm from "../../components/FoodForm";


export default function FoodDetails(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const id: string | null = urlParams.get('id');
    const actualPage = "/db/food";

    const { token } = useAuth();
    let navigate = useNavigate();
    
    const { food, loading, error } = useFood(id);
    const alreadyExists = id != null;
    const updateFoodDatabase = id != null ? modifyFood : createFood;
        
    
    const {units, unitsLoading, unitsError} = useUnits(); // ["kgCO2eq/unités","kgCO2eq/kg","kgCO2eq/L"];
    const { foodGroup, foodGroupLoading, foodGroupError } = useFoodGroup(); // [];
    const { subFoodGroup, subFoodGroupLoading, suboodGroupError } = useSubFoodGroup()

    const [modifiedFood, setModifiedFood] = useState<CompleteFood>();

    useEffect(() => {
        setModifiedFood(food || undefined);
    }, [food])

    // const isMissing = MissingToken({token}); // Should be changed to something that is type compliant
    if (token == null){
        return MissingTokenMessage; // This early return is not
    }
    if (useAsyncStatus({loading, error})){return useAsyncStatus({loading, error});}
    if (useAsyncStatus({loading: unitsLoading, error: unitsError})){
        return useAsyncStatus({loading: unitsLoading, error: unitsError});
    }
    if (useAsyncStatus({loading: foodGroupLoading, error: foodGroupError})){
        return useAsyncStatus({loading: foodGroupLoading, error: foodGroupError});
    }
    if (useAsyncStatus({loading: subFoodGroupLoading, error: suboodGroupError})){
        return useAsyncStatus({loading: subFoodGroupLoading, error: suboodGroupError});
    }

    const goBackToOverview = () => {
        let path: string = actualPage;
        navigate(path);
    } 

    const onSubmit = (updated: CompleteFood, isRemoving: boolean) => {
        if (!isRemoving){
            updateFoodDatabase(updated, token);
            goBackToOverview();
        }
    };    

    return (
        <div>
            <FoodForm 
                item={modifiedFood} 
                unitOptions={units}
                foodGroupOptions={foodGroup}
                subFoodGroupOptions={subFoodGroup}
                alreadyExists={alreadyExists}
                onSubmit={onSubmit}
                previousPage={actualPage}
                />
        </div>
    )
}