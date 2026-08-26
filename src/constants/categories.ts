const SpendingCategories = ["food","transport","goods"];

function convertCategoryToDisplay(label: string){
    /*Useful to go from "food" to "Alimentation" etc.*/
    switch (label) {
        case "food":
            return "Alimentation";
        case "transport":
            return "Transport";
        case "goods": 
            return "Biens";
        default:
            console.error("The translation from the label to displayed text went wrong");
            break;
    }
}

const FoodCategories = ["meal1","meal2","meal3","meal4",
                        "breakfast1","breakfast2","party","call","activities"];

function convertFoodCategoryToDisplay(category: string){
    switch (category){
        case "meal1":
            return "Repas 1";
        case "meal2":
            return "Repas 2";
        case "meal3":
            return "Repas 3";
        case "meal4":
            return "Repas 4";
        case "breakfast1":
            return "Petit-déj 1";
        case "breakfast2":
            return "Petit-déj 2";
        case "party":
            return "Soirée";
        case "call":
            return "Allos";
        case "activities":
            return "Activités";
        default:
    }
}

export { FoodCategories, convertFoodCategoryToDisplay, convertCategoryToDisplay }