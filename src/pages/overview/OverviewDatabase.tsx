import { useRouteChange } from "../../components/helper/onRouteChange";

const OverviewDatabase = () => {
    const { goTo } = useRouteChange();

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