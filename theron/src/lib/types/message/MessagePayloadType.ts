import { MessageTypes } from "./MessageTypes"

interface MessagePayloadType {
    type: MessageTypes,
    data: any
}

export type { MessagePayloadType }