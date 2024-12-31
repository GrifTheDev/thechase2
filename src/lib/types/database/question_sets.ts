// * I decided to comment this out since I find it beautiful and cool.
/* interface QuestionSetsType {
    [key: string]: QuestionObject
} 
    
const example: QuestionSetsType = {
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
// * ------------------------------------------------------------------

import type { QuestionsThreeObject } from "../misc/question_three_object"

interface QuestionSetType {
    title: string,
    questions_open: Array<string>
    questions_three: Array<QuestionsThreeObject>,
    progress: number
}
interface QuestionSetTypeWrite {
    title?: string,
    questions_open?: Array<string>
    questions_three?: Array<QuestionsThreeObject>,
    progress?: number
}

export type {QuestionSetType, QuestionSetTypeWrite}