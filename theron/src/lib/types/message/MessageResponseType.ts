import { MessageTypes } from "./MessageTypes"

interface MessageResponseType {
    type: MessageTypes,
    data: any
}

export type { MessageResponseType }