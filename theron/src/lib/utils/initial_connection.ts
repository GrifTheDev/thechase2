import { ClientsCache } from "../cache/stores/ClientsCache";
import { MessagePayloadType } from "../types/message/MessagePayloadType";
import { MessageTypes } from "../types/message/MessageTypes";
import { WebSocket } from "ws";
import { generateRandomBase64String } from "./utils";

async function initialConnectionResponse(ws: WebSocket) {
  const clientID = generateRandomBase64String(24);
  const initialPayloadResponse: MessagePayloadType = {
    type: MessageTypes.CREDENTIALS_REQUEST,
    data: { version: "0.0.1", clientID: clientID },
  };

  ws.send(JSON.stringify(initialPayloadResponse));
  ClientsCache.set(clientID, ws);

  return;
}

export { initialConnectionResponse };
