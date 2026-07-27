import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Committee } from "../types/committeeTypes"
const API_URL="http://localhost:8080";

function useCommittee(id:string) {
  const [committee, setCommittee] = useState<Committee>({
    category: "",
    number: 0,
    year: 0
} );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchCommittee() {
      try {        
        const response = await fetch(`${API_URL}/committee?id=${id}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });

        const committee = await response.json();
        setCommittee(committee);
        console.log(committee);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching food:", err);
        setError(err);
        setLoading(false);
      }
    }
    
    fetchCommittee();
  }, []);
  
  return { committee, loading, error };
};

export default function Liste( ){
    let navigate = useNavigate();
    const onRouteChange = (id: string, label: string) => {
        let path: string = `/liste/${label}?id=${id}`;
        navigate(path);
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id: string | null = urlParams.get('id');
    if (id == null){
        return <div>Something went wrong when fetching the url parameter...</div>
    }
    const {committee,loading,error} = useCommittee(id);
    console.log(committee);
    var title: string = `${committee.category} n°${committee.number} ${committee.year}`
    return (
    <div>
        <h1>{title}</h1>
        <p>
            <button
                onClick={() => onRouteChange(id,"food")}
                title="Alimentation"
                color="#88e23e"
                >Alimentation</button>
        </p>
        <p>
            <button
                onClick={() => onRouteChange(id,"transport")}
                title="Transport"
                color="#5144ff"
                >Transport</button>
        </p>
        <p>
            <button
                onClick={() => onRouteChange(id,"goods")}
                title="Biens"
                color="#f04cf0"
                >Biens</button>
        </p>
    </div>)
}