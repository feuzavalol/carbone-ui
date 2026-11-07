import { useCommittee, useIsListe } from "../../fetching/UseCommittee";
import { convertFoodCategoryToDisplay } from "../../constants/categories";
import { useFoodCategories } from "../../fetching/UseFood";
import type { FoodCategory } from "../../types/foodTypes";
import { useAsyncStatus } from "../../fetching/helper/ErrorHandling";
import { useRouteChange } from "../../components/helper/onRouteChange";
import buildPath from "../../fetching/helper/buildPath";
import { useNextMealCategory } from "../../fetching/useMealType";
import { mainTitle } from "../../constants/committees";

export default function OverviewFoodCategory() {
    const { goTo } = useRouteChange()

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id: string | null = urlParams.get('id');
    
    const {committee, loading, error} = useCommittee(id);
    const { categoryList, categoryLoading, categoryError } = useFoodCategories(committee.id);
    const { isListe } = useIsListe(committee.id);
    const { nextMeal } = useNextMealCategory(committee.id);

    const committeeStatus = useAsyncStatus({ loading, error });
    const foodCategoriesStatus = useAsyncStatus({ loading: categoryLoading, error: categoryError });

    if (id == null){
        return <div>Something went wrong when fetching the url parameter...</div>
    }
    
    if (committeeStatus) {return committeeStatus;}
    if (foodCategoriesStatus) {return foodCategoriesStatus;}

    const subtitle: string = "Section Alimentation";

    return (
        <div>
            <h1>{mainTitle(committee)}</h1>
            <h2>{subtitle}</h2>
            {categoryList.map((subcategory: FoodCategory) => (
                <div>
                    <button onClick={() => goTo(buildPath("/liste/food/data/moment", { category: subcategory.id, id}))}>
                        {convertFoodCategoryToDisplay(subcategory.name)}
                    </button>
                    <br/>
                </div>
            ))}
            { !isListe && <button onClick={() => goTo(buildPath("/liste/food/data/moment", { category: nextMeal.id, id}))}>Add a meal</button>}
        </div>
    )
}