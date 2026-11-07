import type { CommitteeCategory } from "../constants/roles";

type Committee = {
  id: string,
  category: CommitteeCategory,
  number: number,
  year: number
};

const EmptyCommittee: () => Committee = () => {
    return {
      id: "",
      category: "",
      number: 0,
      year: 0,
    }
  }

export type { Committee }
export { EmptyCommittee }