import { useNavigate } from "react-router-dom";
import { useYear } from "../fetching/UseCommittee";
import { useAsyncStatus } from "../fetching/ErrorHandling";

export default function OverviewByYear(){
    let navigate = useNavigate();
    const onRouteChange = (year: string) => {
        let path: string = `/listes?year=${year}`;
        navigate(path);
    }
    const { years, loading, error } = useYear();

    const status = useAsyncStatus({ loading, error });
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