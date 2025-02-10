import { WebSocketMessage } from "./websocket_msg_types"

interface MessageResponseType {
    type: WebSocketMessage,
    data: any
}

export type { MessageResponseType }