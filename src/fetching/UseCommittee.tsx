import { useEffect, useState } from "react";
import type { Committee } from "../types/committeeTypes"

const API_URL="http://localhost:8080";

function useCommittee(id:string) {
  const [committee, setCommittee] = useState<Committee>({
    id: "",
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

function useCommittees(year: number) {
    const [committees, setCommittees] = useState<Committee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        async function fetchCommitteeList() {
        try {        
            const response = await fetch(`${API_URL}/committees?year=${year}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });

            const committees = await response.json();
            setCommittees(committees[`${year}`]);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching food:", err);
            setError(err);
            setLoading(false);
        }
        }
        
        fetchCommitteeList();
    }, []);
    
    return { committees, loading, error };
};

export { useCommittee, useCommittees }