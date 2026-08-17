import { useNavigate } from "react-router-dom";
import { useCommittees } from "../fetching/UseCommittee";
import type { Committee } from "../types/committeeTypes";

export default function Overview(){
    let navigate = useNavigate();
    const onRouteChange = (id: string) => {
        // let id: string = "833ee25c-3d98-11f1-825c-a651a351d1ac";
        let path: string = `/liste?id=${id}`;
        navigate(path);
    }
    const year = 2025;
    const { committees, loading, error } = useCommittees(year);

    return (
        <div>
            {committees.map((committee: Committee) => (
                <div key={committee.id}>
                    <button onClick={() => onRouteChange(committee.id)}>
                        {`${committee.category} n°${committee.number} ${committee.year}`}
                    </button>
                </div>
            ))}
        </div>
    )
}