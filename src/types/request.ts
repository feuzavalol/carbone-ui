type baseAnswer = {
    success: string,
}

const EmptyAnswer: () => baseAnswer = () => {
    return {
        success: ""
    }
}

export type { baseAnswer }
export { EmptyAnswer }