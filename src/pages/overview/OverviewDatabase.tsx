import { useAuth } from "../../auth/AuthContext";
import { useRouteChange } from "../../components/helper/onRouteChange";
import { MissingTokenMessage } from "../../fetching/helper/ErrorHandling";

const OverviewDatabase = () => {
    const { goTo } = useRouteChange();

    const { token } = useAuth();
    if (token == null) return <MissingTokenMessage />;

    var title: string = "Base de données de l'outil"
    // const displayedLabel = convertCategoryToDisplay(label);
    // var subtitle: string = `Section ${displayedLabel}`;


    return (
        <div>
            <h1>{title}</h1>
            <button onClick={()=>goTo("/db/food")}>Alimentation</button>
            <br />
            <button onClick={()=>goTo("/db/goods")}>Biens</button>
        </div>
    )
}

export { OverviewDatabase }