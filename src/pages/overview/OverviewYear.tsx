import { useNavigate } from "react-router-dom";
import { useYear } from "../../fetching/UseCommittee";
import { MissingToken, useAsyncStatus } from "../../fetching/ErrorHandling";
import { useAuth } from "../../auth/AuthContext";

export default function OverviewByYear(){
    let navigate = useNavigate();

    const goTo = ({path, arg}:{path: string, arg: string | undefined}) => {
        let finalPath: string;
        if (arg != undefined){
            finalPath = `${path}${arg}`;
        }
        else{
            finalPath = `${path}`;
        }
        navigate(finalPath);
    }

    const { token } = useAuth();
    const { years, loading, error } = useYear();

    const status = useAsyncStatus({ loading, error });
    const tokenMissing = MissingToken({token});

    if (tokenMissing) {return tokenMissing;}
    if (status) {return status;}

    

    return (
        <div>
            <button onClick={() => goTo({path: "/register"})}>
                Créer un nouvel utilisateur
            </button>
            <br />
            {years.map((year: string) => (
                <div key={year}>
                    <button onClick={() => goTo({path: "/listes?year=", arg: year as string})}>
                        {`${year}`}
                    </button>
                </div>
            ))}
        </div>
    )
}