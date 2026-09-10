import { useNavigate } from "react-router-dom";
import { useCommittee } from "../fetching/UseCommittee";
import { convertFoodCategoryToDisplay } from "../constants/categories";
import { useFoodCategories } from "../fetching/UseFood";
import type { FoodCategory } from "../types/foodTypes";

export default function OverviewFoodCategory() {
    let navigate = useNavigate();
    const onRouteChange = (subcategory: string) => {
        let path: string = `/liste/food/data/moment?category=${subcategory}&id=${id}`;
        navigate(path);
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id: string | null = urlParams.get('id');
    if (id == null){
        return <div>Something went wrong when fetching the url parameter...</div>
    }
    const {committee, loading, error} = useCommittee(id);
    const { categoryList, categoryLoading, categoryError } = useFoodCategories();
    var title: string = `${committee.category} n°${committee.number} ${committee.year}`
    var subtitle: string = "Section Alimentation";

    return (
        <div>
            <h1>{title}</h1>
            <h2>{subtitle}</h2>
            {categoryList.map((subcategory: FoodCategory) => (
                <div>
                    <button onClick={()=>onRouteChange(subcategory.id)}>{convertFoodCategoryToDisplay(subcategory.name)}</button>
                    <br/>
                </div>
            ))}
        </div>
    )
}