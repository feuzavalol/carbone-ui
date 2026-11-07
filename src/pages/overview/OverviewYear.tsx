import { useYear } from "../../fetching/UseCommittee";
import { MissingTokenMessage, useAsyncStatus } from "../../fetching/helper/ErrorHandling";
import { useAuth } from "../../auth/AuthContext";
import { useRouteChange } from "../../components/helper/onRouteChange";
import buildPath from "../../fetching/helper/buildPath";

export default function OverviewByYear(){
    const { goTo } = useRouteChange();

    const { years, loading, error } = useYear();

    const { token } = useAuth();
    if (token == null) return <MissingTokenMessage />;

    const status = useAsyncStatus({ loading, error });

    if (status) {return status;}

    return (
        <div>
            <button onClick={() => goTo("/register")}>
                Créer un nouvel utilisateur
            </button>
            <br />
            {years.map((year: string) => (
                <div key={year}>
                    <button onClick={() => goTo(buildPath("/listes", { year }))}>
                        {`${year}`}
                    </button>
                </div>
            ))}
        </div>
    )
}