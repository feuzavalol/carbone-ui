import { useNavigate } from "react-router-dom";
import { useAuth, decodeJwt } from "../../auth/AuthContext";
import { useCommittees } from "../../fetching/UseCommittee";
import type { Committee } from "../../types/committeeTypes";
import type { AuthUser } from "../../types/authTypes";
import { checkUser } from "../../auth/AuthUtil";
import { useAsyncStatus } from "../../fetching/ErrorHandling";

export default function Overview(){
    let navigate = useNavigate();
    const onRouteChange = (id: string) => {
        let path: string = `/liste?id=${id}`;
        navigate(path);
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const year: string | null = urlParams.get('year');
    const { committees, loading, error } = useCommittees(year);
    const status = useAsyncStatus({ loading, error });

    const { token } = useAuth();
    if (year == null){
        return <div>The 'year' parameter doesn't seem to be present. <br/>Make sure it exists in the url query.</div>
    }

    if (status) {return status;}

    if (token == null){
        return <div>You're not connected. You might want to relogin before doing this action.</div>
    }
    const safeToken = token;
    const user: AuthUser = decodeJwt(safeToken);

    function getFullName(committee: Committee){
        if (committee.number == null) { // C'est une asso, donc n'a pas de numéro
            return `${committee.category} ${committee.year}`;
        }
        return `${committee.category} n°${committee.number} ${committee.year}`
    }

    return (
        <div>
            {committees.filter((committee: Committee) => checkUser(user,committee.id)).map((committee: Committee) => (
                <div key={committee.id}>
                    <button onClick={() => onRouteChange(committee.id)}>
                        {getFullName(committee)}
                    </button>
                </div>
            ))}
        </div>
    )
}