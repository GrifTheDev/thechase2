import { MessageTypes } from "./MessageTypes"

interface MessagePayloadType {
    type: MessageTypes,
    clientID: string,
    data: any
}

export type { MessagePayloadType }