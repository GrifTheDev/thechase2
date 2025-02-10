import { WebSocketServer, WebSocket } from "ws";
import { logger } from "./lib/logger";
import { MessagePayloadType } from "./lib/types/message/MessagePayloadType";
import { MessageTypes } from "./lib/types/message/MessageTypes";
import "dotenv/config";
import { initialConnectionResponse } from "./lib/utils/initial_connection";
import { MessageResponseType } from "./lib/types/message/MessageResponseType";
import { ClientsCache } from "./lib/cache/stores/ClientsCache";
import { AccessLevels } from "./lib/types/permissions/AccessLevels";
import { manageAccessLevel } from "./lib/auth/auth_helper";

const wss: WebSocketServer = new WebSocketServer({ port: 8080 });

wss.on("listening", () => {
  logger.log({ level: "info", message: "Theron service online." });
});

wss.on("connection", function connection(ws) {
  initialConnectionResponse(ws);

  ws.on("message", (rawData) => {
    let receivedPayload: MessagePayloadType;

    try {
      receivedPayload = JSON.parse(rawData.toString());
    } catch (error) {
      logger.log({
        level: "debug",
        message:
          "An error occured whilst trying to parse the JSON data sent to Theron. Disconnecting user.",
      });

      const response: MessageResponseType = {
        type: MessageTypes.ERR_MALFORMED_REQUEST,
        data: {
          message: "All submited requests must be parsable by JSON.parse().",
        },
      };
      ws.send(JSON.stringify(response));
      return ws.terminate();
    }

    if (
      receivedPayload.clientID == undefined ||
      ClientsCache.get(receivedPayload.clientID) == undefined
    ) {
      logger.log({
        level: "debug",
        message: `A request was made without providing a clientID or an invalid clientID was provided (clientID: ${receivedPayload.clientID}). Disconnecting user.`,
      });

      const response: MessageResponseType = {
        type: MessageTypes.ERR_NO_CREDENTIALS,
        data: {
          message:
            "All requests to the Theron service must be accompanied by a clientID.",
        },
      };
      ws.send(JSON.stringify(response));
      return ws.terminate();
    }

    const clientRecord: {
      socket: WebSocket;
      gameID: string;
      clientID: string;
      accessLevel: AccessLevels;
    } = ClientsCache.get(receivedPayload.clientID);
    if (clientRecord.accessLevel == AccessLevels.NONE) {
      manageAccessLevel(clientRecord, receivedPayload);
    }

    switch (receivedPayload.type) {
      case MessageTypes.ERR_MALFORMED_REQUEST: {
        break;
      }
    }
  });

  ws.on("error", (error) => {
    logger.log({
      level: "error",
      message: `Websocket error: ${error}`,
    });
  });
});

process.on("uncaughtException", (error) => {
  logger.log({
    level: "error",
    message: `Service error: ${error}`,
  });
});
