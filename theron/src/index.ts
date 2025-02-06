import { WebSocketServer, WebSocket } from "ws";
import { logger } from "./lib/logger";
import { MessagePayloadType } from "./lib/types/message/MessagePayloadType";
import { MessageTypes } from "./lib/types/message/MessageTypes";
import "dotenv/config";
import { initialConnectionResponse } from "./lib/utils/initial_connection";
import { MessageResponseType } from "./lib/types/message/MessageResponseType";

const wss: WebSocketServer = new WebSocketServer({ port: 8080 });

wss.on("listening", () => {
  logger.log({ level: "info", message: "Theron service online." });
});

wss.on("connection", function connection(ws) {
  initialConnectionResponse(ws);

  

  ws.on("message", (rawData) => {
    let data: MessagePayloadType;

    try {
      data = JSON.parse(rawData.toString());
    } catch (error) {
      logger.log({
        level: "debug",
        message:
          "An error occured whilst trying to parse the JSON data sent to Theron. Disconnecting user.",
      });

      const response: MessageResponseType = {type: MessageTypes.ERR_MALFORMED_REQUEST, data: {message: "All submited requests must be parsable by JSON.parse()."}}
      ws.send(JSON.stringify(response))
      return ws.terminate();
    }

    if (data.clientID == undefined || data.clientID == "") {
      logger.log({
        level: "debug",
        message:
          "A request was made without providing a clientID. Disconnecting user.",
      });
      ws.terminate();
      return 
    }

    switch(data.type) {
      case MessageTypes.CREDENTIALS: {

        

        break
      }
        
        

    }
  });

  ws.on("error", (error) => {
    logger.log({
      level: "error",
      message: `Websocket error: ${error}`
    })
  });
});

process.on('uncaughtException', (error) => {
  logger.log({
    level: "error",
    message: `Service error: ${error}`
  })
})