type EnergyCategories = "oil" | "diesel" | "hybrid" | "electric" | ""; // We allow the empty string to allow for the lack of trip data in functions
type Energy = "Essence" | "Diesel" | "Hybride" | "Électrique" | "";
type Unit = "L/100km" | "W" | ""; // TODO: Add other units


function convertEnergyCategoryToDisplay(category: string): Energy{
    switch (category){
        case "oil":
        case "Essence":
            return "Essence";
        case "diesel":
        case "Diesel": 
            return "Diesel";
        case "hybrid":
        case "Hybride":
            return "Hybride";
        case "electric":
        case "Électrique":
            return "Électrique";
        case "":
        default:
            return "";
    }
}

function getUnit(category: EnergyCategories | Energy | string): Unit{
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

const energyOptions = [{id:1, name:"Essence"},{id:2, name:"Diesel"},{id:3, name:"Hybride"},{id:4, name:"Électrique"}];

export type { EnergyCategories, Energy }
export { energyOptions, convertEnergyCategoryToDisplay, getUnit }