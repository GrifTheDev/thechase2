import { ClientsCache } from "../cache/stores/ClientsCache";
import { logger } from "../logger";
import { MessagePayloadType } from "../types/message/MessagePayloadType";
import { MessageResponseType } from "../types/message/MessageResponseType";
import { MessageTypes } from "../types/message/MessageTypes";
import { AccessLevels } from "../types/permissions/AccessLevels";
import { WebSocket } from "ws";
import { checkGameIDValidity } from "../utils/utils";

async function manageAccessLevel(
  clientRecord: {
    socket: WebSocket;
    gameID: string;
    clientID: string;
    accessLevel: AccessLevels;
  },
  receivedPayload: MessagePayloadType
) {
  // * Unauthenticated user is trying to access the service.
  if (
    receivedPayload.type != MessageTypes.CREDENTIALS &&
    receivedPayload.type != MessageTypes.RECONNECT
  ) {
    logger.log({
      level: "debug",
      message: `An unauthorized request has been attempted (clientID: ${receivedPayload.clientID}). Disconnecting user.`,
    });

    const response: MessageResponseType = {
      type: MessageTypes.ERR_UNAUTHORIZED,
      data: {
        message:
          "You MUST send a CREDENTIALS request before sending any other requests to the Theron service.",
      },
    };
    clientRecord.socket.send(JSON.stringify(response));
    return clientRecord.socket.terminate();
  } else if (receivedPayload.type == MessageTypes.CREDENTIALS) {
    const payloadData = receivedPayload.data;
    const authType = Object.keys(payloadData);

    // * Admin case
    if (authType.includes("authToken") && authType.includes("gameID")) {
    }
    // * Player case
    else if (!authType.includes("authToken") && authType.includes("gameID")) {
      ClientsCache.setSpecific(
        clientRecord.clientID,
        "accessLevel",
        AccessLevels.PLAYER
      );

      if (await (checkGameIDValidity(receivedPayload.data.gameID)) == false) {
        logger.log({
            level: "debug",
            message: `A client (clientID: ${receivedPayload.clientID}) attempted to authenticate but provided an invalid gameID. Disconnecting user.`,
          });
      
          const response: MessageResponseType = {
            type: MessageTypes.ERR_INVALID_GAMEID,
            data: {
              message:
                "The game ID provided is inavlid.",
            },
          };
          clientRecord.socket.send(JSON.stringify(response));
          return clientRecord.socket.terminate();
      }


      ClientsCache.setSpecific(
        clientRecord.clientID,
        "gameID",
        receivedPayload.data.gameID
      );

      logger.log({
        level: "debug",
        message: `Player authenticated (clientID: ${receivedPayload.clientID}), client record updated.`,
      });

      const response: MessageResponseType = {
        type: MessageTypes.CREDENTIALS_SUCCESS,
        data: {},
      };
      return clientRecord.socket.send(JSON.stringify(response));
    }
    // * ERROR
    else {
      logger.log({
        level: "debug",
        message: "A CREDENTIALS request was made without the gameID property.",
      });

      const response: MessageResponseType = {
        type: MessageTypes.ERR_MALFORMED_REQUEST,
        data: {
          message:
            "All CREDENTIALS requests must at least contain a gameCode property.",
        },
      };
      clientRecord.socket.send(JSON.stringify(response));
      return clientRecord.socket.terminate();
    }
  }
}

export { manageAccessLevel };
