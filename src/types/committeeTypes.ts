import type { CommitteeCategory } from "../constants/roles";

type Committee = {
  id: string,
  category: CommitteeCategory,
  number: number,
  year: number
};

export type { Committee }