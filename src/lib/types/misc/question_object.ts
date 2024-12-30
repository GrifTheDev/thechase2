interface QuestionObject {
    label: string,
    answerA: string,
    answerB: string,
    answerC: string,
    correctAnswer: "A" | "B" | "C" | ""
}

export type {QuestionObject}