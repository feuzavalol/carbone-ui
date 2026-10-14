import { useNavigate } from "react-router-dom";
import { useYear } from "../../fetching/UseCommittee";
import { MissingToken, useAsyncStatus } from "../../fetching/ErrorHandling";
import { useAuth } from "../../auth/AuthContext";

export default function OverviewByYear(){
    let navigate = useNavigate();
    const onRouteChange = (year: string) => {
        let path: string = `/listes?year=${year}`;
        navigate(path);
    }

    const { token } = useAuth();
    const { years, loading, error } = useYear();

    const status = useAsyncStatus({ loading, error });
    const tokenMissing = MissingToken({token});

    if (tokenMissing) {return tokenMissing;}
    if (status) {return status;}

    

    return (
        <div>
            {years.map((year: string) => (
                <div key={year}>
                    <button onClick={() => onRouteChange(year as string)}>
                        {`${year}`}
                    </button>
                </div>
            ))}
        </div>
    )
}