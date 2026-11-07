import { useCommittee } from "../../fetching/UseCommittee";
import { convertCategoryToDisplay } from "../../constants/categories";
import { mainTitle } from "../../constants/committees";
import { useAsyncStatus } from "../../fetching/helper/ErrorHandling";
import { useRouteChange } from "../../components/helper/onRouteChange";
import buildPath from "../../fetching/helper/buildPath";



const Overview = ({label}:{label:string}) => {
    const { goTo } = useRouteChange();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id: string | null = urlParams.get('id');
    
    const { committee, loading, error } = useCommittee(id);
    const displayedLabel = convertCategoryToDisplay(label);
    var subtitle: string = `Section ${displayedLabel}`;

    const committeeStatus = useAsyncStatus({ loading, error });

    if (id == null){
        return <div>Something went wrong when fetching the url parameter...</div>
    }

    if (committeeStatus) {return committeeStatus;}

    return (
        <div>
            <h1>{mainTitle(committee)}</h1>
            <h2>{subtitle}</h2>
            <button onClick={() => goTo(buildPath(`/liste/${label}/data`,{ id })) }>Données</button>
            <br />
            <button onClick={()=>goTo(buildPath(`/liste/${label}/summary`,{ id }))}>Bilan</button>
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