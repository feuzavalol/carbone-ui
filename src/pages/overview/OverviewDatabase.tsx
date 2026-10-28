import { useNavigate } from "react-router-dom";

const OverviewDatabase = () => {
    let navigate = useNavigate();
    const onRouteChange = (label: string) => {
        let path: string = `/db/${label}`;
        navigate(path);
    }

    var title: string = "Base de données de l'outil"
    // const displayedLabel = convertCategoryToDisplay(label);
    // var subtitle: string = `Section ${displayedLabel}`;


    return (
        <div>
            <h1>{title}</h1>
            <button onClick={()=>onRouteChange("food")}>Alimentation</button>
            <br />
            <button onClick={()=>onRouteChange("goods")}>Biens</button>
        </div>
    )
}

export { OverviewDatabase }