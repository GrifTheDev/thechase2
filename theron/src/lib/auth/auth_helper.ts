import { ClientsCache } from "../cache/stores/ClientsCache";
import { logger } from "../logger";
import { MessagePayloadType } from "../types/message/MessagePayloadType";
import { MessageResponseType } from "../types/message/MessageResponseType";
import { MessageTypes } from "../types/message/MessageTypes";
import { AccessLevels } from "../types/permissions/AccessLevels";
import { WebSocket } from "ws";
import { checkGameIDValidity, sendWSResponse } from "../utils/utils";
import { queryWhereUsersData, readDocData, readUsersData } from "../database/database";

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
    return sendWSResponse(
      clientRecord.socket,
      MessageTypes.ERR_UNAUTHORIZED,
      {
        message:
          "You MUST send a CREDENTIALS request before sending any other requests to the Theron service.",
      },
      `An unauthorized request has been attempted (clientID: ${receivedPayload.clientID}). Disconnecting user.`,
      true
    );
  } else if (receivedPayload.type == MessageTypes.CREDENTIALS) {
    const payloadData = receivedPayload.data;
    const authType = Object.keys(payloadData);

    // * Admin case
    if (authType.includes("authToken") && authType.includes("gameID")) {
      const userDoc = (await queryWhereUsersData("access_token", payloadData.authToken, "==", "first"))

      // * 1. Check if account exists
      if (userDoc == undefined)
        return sendWSResponse(
          clientRecord.socket,
          MessageTypes.ERR_UNAUTHORIZED,
          { message: "The account provided does not exist." },
          `Client tried to access a non-existent account (clientID: ${receivedPayload.clientID}).`,
          true
        );

      // * 2. Check if the game code is valid.
      if ((await checkGameIDValidity(receivedPayload.data.gameID)) == false)
        return sendWSResponse(
          clientRecord.socket,
          MessageTypes.ERR_INVALID_GAMEID,
          { message: "The game ID provided is inavlid." },
          `A client (clientID: ${receivedPayload.clientID}) attempted to authenticate but provided an invalid gameID. Disconnecting user.`,
          true
        );

      // * 3. Check if user is an admin of the given game.
      if (!userDoc.docs[0].data().activeGames.includes(receivedPayload.data.gameID))
        return sendWSResponse(
          clientRecord.socket,
          MessageTypes.ERR_UNAUTHORIZED,
          { message: "You are not an admin of the game code provided." },
          `User tried to access a game with privilege where they do not have such (clientID: ${receivedPayload.clientID}). Disconnecting user.`,
          true
        );

      // * 4. Set proper access level & inform user  
      ClientsCache.setSpecific(
        clientRecord.clientID,
        "accessLevel",
        AccessLevels.ADMIN
      );

      ClientsCache.setSpecific(
        clientRecord.clientID,
        "gameID",
        receivedPayload.data.gameID
      );

      return sendWSResponse(
        clientRecord.socket,
        MessageTypes.CREDENTIALS_SUCCESS,
        {},
        `Player authenticated as admin (clientID: ${receivedPayload.clientID}), client record updated.`,
        false
      );
    }
    // * Player case
    else if (!authType.includes("authToken") && authType.includes("gameID")) {
      ClientsCache.setSpecific(
        clientRecord.clientID,
        "accessLevel",
        AccessLevels.PLAYER
      );

      if ((await checkGameIDValidity(receivedPayload.data.gameID)) == false) {
        return sendWSResponse(
          clientRecord.socket,
          MessageTypes.ERR_INVALID_GAMEID,
          { message: "The game ID provided is inavlid." },
          `A client (clientID: ${receivedPayload.clientID}) attempted to authenticate but provided an invalid gameID. Disconnecting user.`,
          true
        );
      }

      ClientsCache.setSpecific(
        clientRecord.clientID,
        "gameID",
        receivedPayload.data.gameID
      );

      return sendWSResponse(
        clientRecord.socket,
        MessageTypes.CREDENTIALS_SUCCESS,
        {},
        `Player authenticated (clientID: ${receivedPayload.clientID}), client record updated.`,
        false
      );
    }
    // * ERROR
    else {
      return sendWSResponse(
        clientRecord.socket,
        MessageTypes.ERR_MALFORMED_REQUEST,
        {
          message:
            "All CREDENTIALS requests must at least contain a gameCode property.",
        },
        "A CREDENTIALS request was made without the gameID property.",
        true
      );
    }
  }
}

export { manageAccessLevel };
