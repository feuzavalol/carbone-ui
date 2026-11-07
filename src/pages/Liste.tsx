import { useCommittee } from "../fetching/UseCommittee";
import { useAsyncStatus } from "../fetching/helper/ErrorHandling";
import { mainTitle } from "../constants/committees";
import { useRouteChange } from "../components/helper/onRouteChange";
import buildPath from "../fetching/helper/buildPath";

export default function Liste( ){
    const { goTo } = useRouteChange();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id: string | null = urlParams.get('id');
    
    const {committee,loading,error} = useCommittee(id);
    const committeeStatus = useAsyncStatus({ loading, error });
    if (id == null){
        return <div>Something went wrong when fetching the url parameter...</div>
    }
    if (committeeStatus) {return committeeStatus;}
    return (
    <div>
        <h1>{mainTitle(committee)}</h1>
        <p>
            <button
                onClick={() => goTo(buildPath(`/liste/food`, { id }))} //onRouteChange(id,"food")}
                title="Alimentation"
                color="#88e23e"
                >Alimentation</button>
        </p>
        <p>
            <button
                onClick={() => goTo(buildPath(`/liste/transport`, { id }))}
                title="Transport"
                color="#5144ff"
                >Transport</button>
        </p>
        <p>
            <button
                onClick={() => goTo(buildPath(`/liste/goods`, { id }))}
                title="Biens"
                color="#f04cf0"
                >Biens</button>
        </p>
    </div>)
}