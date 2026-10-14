import { useCallback, useEffect, useState } from "react";
import type { Summary } from "../../types/summaryTypes";
import { useApi } from "../../fetching/useApi";
import { API_URL } from "../../constants/url";
import { useAsyncStatus } from "../../fetching/ErrorHandling";
import { PieChart } from "../../components/PieChart";
import { toDisplay } from "../../constants/categories";

function useFoodSummary(committeeId: string | null) {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const apiFetch = useApi();
  
  const fetchSummary = useCallback(async () => {
    if (committeeId == null){
        return;
    }
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/mealSummary?committeeId=${committeeId}`);
      const summary = await response.json();
      setSummary(summary.success);
      setLoading(false);
      } 
    catch (err: any) {
      console.error("Error fetching the meal summary:", err);
      setError(err);
      setLoading(false);
    }
  }, [apiFetch, committeeId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);
  
  return { summary, loading, error };
}

export default function FoodSummary(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const fetchedCommitteeId: string | null = urlParams.get('id');

    const { summary, loading, error } = useFoodSummary(fetchedCommitteeId);
    const displayedLabels: string[] = toDisplay(summary?.labels ?? []);
    const displayedSummary: Summary = {labels: displayedLabels, datasets: summary?.datasets ?? []}

    const status = useAsyncStatus({loading, error});

    if (fetchedCommitteeId == null){
        return <div>Something went wrong when fetching the url parameter...<br/>The committee id parameter doesn't seem to be present</div>
    }

    if (status) {return status;}
    return (
        <div>
            <PieChart data={displayedSummary} />
        </div>
    )
}