import type { Committee } from "../types/committeeTypes"

const number = (committee: Committee) => committee.number ? `n°${committee.number}` : ""
const secondaryTitle: (committee: Committee) => string = (committee: Committee) => `${convertCommitteeCategoryToDisplay(committee.category)} ${number(committee)}`
const mainTitle: (committee: Committee) => string = (committee: Committee) => `${secondaryTitle(committee)} ${committee.year}`

function convertCommitteeCategoryToDisplay(category: string){
    switch (category){
        case "BDA_ASSO":
            return "BDA (Asso)";
        case "BDE_ASSO":
            return "BDE (Asso)";
        case "BDS_ASSO":
            return "BDS (Asso)";
        case "Trente_MA":
            return "30MA";
        case "Mines_a_jeux":
            return "Mines à jeux";
        case "Burkinaction":
            return "Burkin'action";
        case "Mines_brasseurs":
            return "Mines brasseurs";
        default:
            return category;
    }
}

export { mainTitle, secondaryTitle, convertCommitteeCategoryToDisplay }