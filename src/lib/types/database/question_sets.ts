// Even though a DB query for users must always return all of the interface properties, the "?"
// has been added so that I can write to this collection without having to express all other
// properties of the document.

// * Here, have some typescript type-fuckery
interface QuestionSet {
    label: string,
    answerA: string,
    answerB: string,
    answerC: string,
    correctAnswer: "A" | "B" | "C"
}

interface QuestionObject {
    qsetTitle: string,
    questions: Array<QuestionSet>
}

interface QuestionSetsType {
    [key: string]: QuestionObject
}

/* const example: QuestionSetsType = {
    "2ff5cd01-e511-48e1-ad32-04dc97a42b3d": {
        qsetTitle: "Weird tech trivia",
        questions: [{
            label: "Who owns Twitter?",
            answerA: "Tim Cook",
            answerB: "Elon Musk",
            answerC: "Jeff Bezos",
            correctAnswer: "A"
        }]
    } 
} */

export type {QuestionSetsType}