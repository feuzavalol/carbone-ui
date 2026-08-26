type EnergyCategories = "oil" | "diesel" | "hybrid" | "electric" | ""; // We allow the empty string to allow for the lack of trip data in functions
type Energy = "Essence" | "Diesel" | "Hybride" | "Électrique" | "";
type Unit = "L/100km" | "W" | ""; // TODO: Add other units


function convertEnergyCategoryToDisplay(category: EnergyCategories | Energy): Energy{
    switch (category){
        case "oil":
            return "Essence";
        case "diesel":
            return "Diesel";
        case "hybrid":
            return "Hybride";
        case "electric":
            return "Électrique";
        case "":
        default:
            return category;
    }
}

function getUnit(category: EnergyCategories | Energy): Unit{
    switch (category){
        case "oil":
        case "Essence":
        case "diesel":
        case "Diesel":
            return "L/100km";
        case "hybrid":
        case "Hybride":
            return "L/100km";
        case "electric":
        case "Électrique":
            return "W";
        case "":
        default:
            return "";
    }
}

const energyOptions = [{ name: "Essence" }, { name: "Diesel" }, { name: "Hybride" }, { name: "Électrique" }];

export type { EnergyCategories, Energy }
export { energyOptions, convertEnergyCategoryToDisplay, getUnit }