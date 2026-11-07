import { useAuth, decodeJwt } from "../../auth/AuthContext";
import { useCommittees } from "../../fetching/UseCommittee";
import type { Committee } from "../../types/committeeTypes";
import type { AuthUser } from "../../types/authTypes";
import { checkUser } from "../../auth/AuthUtil";
import { MissingTokenMessage, useAsyncStatus } from "../../fetching/helper/ErrorHandling";
import { mainTitle } from "../../constants/committees";
import { useRouteChange } from "../../components/helper/onRouteChange";
import buildPath from "../../fetching/helper/buildPath";

export default function Overview(){
    const { goTo } = useRouteChange();
    
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

    if (token == null) return <MissingTokenMessage />;
    const safeToken = token;
    const user: AuthUser = decodeJwt(safeToken);

    return (
        <div>
            {committees.filter((committee: Committee) => checkUser(user,committee.id)).map((committee: Committee) => (
                <div key={committee.id}>
                    <button onClick={() => goTo(buildPath("/liste",{ id: committee.id }))} >
                        {mainTitle(committee)}
                    </button>
                </div>
            ))}
        </div>
    )
}