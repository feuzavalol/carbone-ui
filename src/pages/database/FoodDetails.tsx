import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { MissingTokenMessage, useAsyncStatus } from "../../fetching/helper/ErrorHandling";
import { useFood, useUnits, useFoodGroup, useSubFoodGroup, useCreateFood, useRemoveFood } from "../../fetching/UseFood";
import type { CompleteFood } from "../../types/foodTypes";
import FoodForm from "../../components/FoodForm";
import { createChangeItemRequest } from "../../types/Requests/ChangeItem";
import { useRouteChange } from "../../components/helper/onRouteChange";


export default function FoodDetails(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const id: string | null = urlParams.get('id');
    const actualPage = "/db/food";

    const { goTo } = useRouteChange();
    const { token } = useAuth();
    
    const { food, loading, error } = useFood(id);
    const alreadyExists = id != null;
    const { mutate: createFood } = useCreateFood();
    const { mutate: modifyFood } = useRemoveFood();
    const updateFoodDatabase = id != null ? modifyFood : createFood;
        
    
    const {units, unitsLoading, unitsError} = useUnits(); // ["kgCO2eq/unités","kgCO2eq/kg","kgCO2eq/L"];
    const { foodGroup, foodGroupLoading, foodGroupError } = useFoodGroup(); // [];
    const { subFoodGroup, subFoodGroupLoading, subFoodGroupError } = useSubFoodGroup()

    const [modifiedFood, setModifiedFood] = useState<CompleteFood>();

    useEffect(() => {
        setModifiedFood(food || undefined);
    }, [food])

    // const isMissing = MissingToken({token}); // Should be changed to something that is type compliant
    const foodStatus = useAsyncStatus({ loading, error });
    const unitsStatus = useAsyncStatus({ loading: unitsLoading, error: unitsError });
    const groupStatus = useAsyncStatus({ loading: foodGroupLoading, error: foodGroupError });
    const subGroupStatus = useAsyncStatus({ loading: subFoodGroupLoading, error: subFoodGroupError });

    if (token == null) return <MissingTokenMessage />;
    if (foodStatus) return foodStatus;
    if (unitsStatus) return unitsStatus;
    if (groupStatus) return groupStatus;
    if (subGroupStatus) return subGroupStatus;

    const onSubmit = (updated: CompleteFood, isRemoving: boolean) => {
        if (!isRemoving){
            updateFoodDatabase(createChangeItemRequest(updated));
            goTo(actualPage);
        }
    };

    if (!modifiedFood) return null;

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