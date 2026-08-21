import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import type { Transport, CompleteTransport } from "../types/transportTypes"
import { API_URL } from "../constants/url";

function useTransportList() {
  const [transportList, setTransportList] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { token } = useAuth();
  
  useEffect(() => {
    async function fetchTransport() {
      try {        
        const response = await fetch(`${API_URL}/transport`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`

            },
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
        setError(err as Error);
        setLoading(false);
      }
    }
    
    fetchTransport();
  }, []);
  
  return { transportList, loading, error };
};

export { useTransportList }