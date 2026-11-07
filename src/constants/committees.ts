import type { Committee } from "../types/committeeTypes"

const number = (committee: Committee) => committee.number ? `n°${committee.number}` : ""
const mainTitle: (committee: Committee) => string = (committee: Committee) => `${committee.category} ${number(committee)} ${committee.year}`

export { mainTitle }