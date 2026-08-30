import { useNavigate } from "react-router-dom";
import { useAuth, decodeJwt } from "../auth/AuthContext";
import { useCommittees } from "../fetching/UseCommittee";
import type { Committee } from "../types/committeeTypes";
import type { AuthUser } from "../types/authTypes";
import { checkUser } from "../auth/AuthUtil";

export default function Overview(){
    let navigate = useNavigate();
    const onRouteChange = (id: string) => {
        // let id: string = "833ee25c-3d98-11f1-825c-a651a351d1ac";
        let path: string = `/liste?id=${id}`;
        navigate(path);
    }
    const year = 2025;
    const { committees, loading, error } = useCommittees(year);

    const { token } = useAuth();
    if (token == null){
        return <div>You're not connected. You might want to relogin before doing this action.</div>
    }
    const safeToken = token;
    const user: AuthUser = decodeJwt(safeToken);
    console.log(user);
    

    return (
        <div>
            {committees.filter((committee: Committee) => checkUser(user,committee.id)).map((committee: Committee) => (
                <div key={committee.id}>
                    <button onClick={() => onRouteChange(committee.id)}>
                        {`${committee.category} n°${committee.number} ${committee.year}`}
                    </button>
                </div>
            ))}
        </div>
    )
}