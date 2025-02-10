import { ClientsCache } from "../cache/stores/ClientsCache";
import { MessagePayloadType } from "../types/message/MessagePayloadType";
import { MessageTypes } from "../types/message/MessageTypes";
import { WebSocket } from "ws";
import { generateRandomBase64String } from "./utils";
import { MessageResponseType } from "../types/message/MessageResponseType";
import { AccessLevels } from "../types/permissions/AccessLevels";

async function initialConnectionResponse(ws: WebSocket) {
  //const clientID = generateRandomBase64String(24);
  // !!! TESTING ONLY
  const clientID = "bFCE7R5CDNeJe1xuq7e2IAU52geN3sGf"
  const initialPayloadResponse: MessageResponseType = {
    type: MessageTypes.CREDENTIALS_REQUEST,
    data: { version: "0.0.1", clientID: clientID },
  };

  ws.send(JSON.stringify(initialPayloadResponse));
  ClientsCache.set(clientID, {socket: ws, gameID: "", clientID: clientID, accessLevel: AccessLevels.NONE});

  return;
}

export { initialConnectionResponse };
