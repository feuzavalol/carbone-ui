// TODO: Fetch the roles and the committee categories dynamically

type Role = "VIS" | "LIS" | "BRE" | "ADM";
const Roles: Role[] = ["VIS", "LIS", "BRE", "ADM"]
const AuthorisedRoles: Role[] = ["LIS","BRE","ADM"];

type CommitteeCategory = "BDE" | "BDA" | "BDS" | "Forum" | "WEI" | "Ski" | "Surf" | "Gala" 
const CommitteeCategories: CommitteeCategory[] = ["BDE","BDA","BDS","Forum","WEI", "Ski", "Surf","Gala"]
const NumberNeedingCategories: CommitteeCategory[] = ["BDE","BDA","BDS","Forum"]

export type { Role, CommitteeCategory }
export { AuthorisedRoles, NumberNeedingCategories, CommitteeCategories, Roles }