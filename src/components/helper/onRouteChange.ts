import { useNavigate } from "react-router-dom";

function useRouteChange(){
    let navigate = useNavigate();
    const goTo = (path: string) => navigate(path);
    return { goTo }
}

export { useRouteChange }