type MealType = {
    id: string,
    name: string,
    isListe: boolean
}

const EmptyMeal: () => MealType = () => {
    return {
        id: "",
        name: "",
        isListe: false
    }
}

export type { MealType }
export { EmptyMeal }