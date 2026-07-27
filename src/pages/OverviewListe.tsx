import { useNavigate } from "react-router-dom";

export default function Overview(){
    let navigate = useNavigate();
    const onRouteChange = () => {
        let id: string = "833ee25c-3d98-11f1-825c-a651a351d1ac";
        let path: string = `/liste?id=${id}`;
        navigate(path);
    }

    return (
        <button onClick={onRouteChange}>Liste test</button>
    )
}