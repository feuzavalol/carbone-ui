import { EmptyCommittee, type Committee } from "../types/committeeTypes";
import buildPath from "./helper/buildPath";
import { useFetch } from "./helper/useFetch";

function useCommittee(id: string | null) {
  const path = id ? buildPath("/committee", { id }) : null;
  const { data, loading, error } = useFetch<Committee | null>(path, EmptyCommittee());
  
  return { committee: data || EmptyCommittee(), loading, error };
}

function useCommittees(year: string | number | null) {
  const path = year ? buildPath("/committees", { year }) : null;
  const { data, loading, error } = useFetch<Committee[]>(path, []);
  
  return { committees: data, loading, error };
};

function useYear(){
  const path = "/years"
  const { data, loading, error } = useFetch<string[]>(path, []);    
  return { years: data, loading, error };
}

function useRoles(year: string | number | null){
  const path = year ? buildPath("/roles", { year }) : null;
  const { data, loading, error } = useFetch<string[]>(path, []); 
  return { roles: data, loadingRoles: loading, errorRoles: error };
}

function useCommitteeCategories(year: string | number | null){
  const path = year ? buildPath("/categories", { year }) : null;
  const { data, loading, error } = useFetch<string[]>(path, []); 
  return { categories: data, loadingCategories: loading, errorCategories: error };
}

function useIsListe(committeeId : string | null){
  const path: string | null = committeeId ? buildPath("/isListe", { committeeId }) : null;;
  const { data, loading, error } = useFetch<boolean>(path, false);
  
  return { isListe: data, loading, error };
}

export { useCommittee, useCommittees, useYear, useRoles, useCommitteeCategories, useIsListe }