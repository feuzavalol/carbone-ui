import { useNavigate } from "react-router-dom";
import { useCommittee } from "../fetching/UseCommittee";

export default function Liste( ){
    let navigate = useNavigate();
    const onRouteChange = (id: string, label: string) => {
        let path: string = `/liste/${label}?id=${id}`;
        navigate(path);
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id: string | null = urlParams.get('id');
    if (id == null){
        return <div>Something went wrong when fetching the url parameter...</div>
    }
    const {committee,loading,error} = useCommittee(id);
    var title: string = `${committee.category} n°${committee.number} ${committee.year}`
    return (
    <div>
        <h1>{title}</h1>
        <p>
            <button
                onClick={() => onRouteChange(id,"food")}
                title="Alimentation"
                color="#88e23e"
                >Alimentation</button>
        </p>
        <p>
            <button
                onClick={() => onRouteChange(id,"transport")}
                title="Transport"
                color="#5144ff"
                >Transport</button>
        </p>
        <p>
            <button
                onClick={() => onRouteChange(id,"goods")}
                title="Biens"
                color="#f04cf0"
                >Biens</button>
        </p>
    </div>)
}