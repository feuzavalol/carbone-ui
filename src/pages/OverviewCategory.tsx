import { useNavigate } from "react-router-dom";
import { useCommittee } from "../fetching/UseCommittee";
import { convertCategoryToDisplay } from "../constants/categories";



const Overview = ({label}:{label:string}) => {
    let navigate = useNavigate();
    const onRouteChange = (subcategory: string) => {
        let path: string = `/liste/${label}/${subcategory}?id=${id}`;
        navigate(path);
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id: string | null = urlParams.get('id');
    if (id == null){
        return <div>Something went wrong when fetching the url parameter...</div>
    }
    const {committee,loading,error} = useCommittee(id);
    var title: string = `${committee.category} n°${committee.number} ${committee.year}`;
    const displayedLabel = convertCategoryToDisplay(label);
    var subtitle: string = `Section ${displayedLabel}`;


    return (
        <div>
            <h1>{title}</h1>
            <h2>{subtitle}</h2>
            <button onClick={()=>onRouteChange("data")}>Données</button>
            <br />
            <button onClick={()=>onRouteChange("summary")}>Bilan</button>
        </div>
    )
}

function OverviewFood() {
    return (
        <Overview label={"food"} />
    )
}

function OverviewTransport() {
    return (
        <Overview label={"transport"} />
    )
}

function OverviewGoods() {
    return (
        <Overview label={"goods"} />
    )
}

export {OverviewFood, OverviewTransport, OverviewGoods}