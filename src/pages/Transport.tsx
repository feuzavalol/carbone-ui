import { useEffect, useState } from "react";
import TransportRow from "../components/TransportRow";
import type { Transport, CompleteTransport } from "../types/transportTypes"

const API_URL="http://localhost:8080";

// type SimplifiedTransport = {
//   name: string
// }

function useTransportList() {
  const [transportList, setTransportList] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchTransport() {
      try {        
        const response = await fetch(`${API_URL}/transport`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });

        const transports = await response.json();
        const simplifiedTransport: Transport[] = transports.map((item: CompleteTransport) => ({
          id: item.id,
          name: item.name,
          unit: item.unit
        }));
        setTransportList(simplifiedTransport);
          
        console.log(transports);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching transport:", err);
        setError(err);
        setLoading(false);
      }
    }
    
    fetchTransport();
  }, []);
  
  return { transportList, loading, error };
};

export default function Transport(){ 
  const { transportList, loading, error } = useTransportList();

  return ( 
    <div> 
      {transportList.map(t => (
        <TransportRow key={t.id} transport={t} />
      ))}
    </div>
  )
}
