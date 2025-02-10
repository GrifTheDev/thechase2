import crypto from "crypto"
import { readGamesData } from "../database/database";
import { logger } from "../logger";
import { WebSocket } from "ws"
import { MessageTypes } from "../types/message/MessageTypes";
import { MessageResponseType } from "../types/message/MessageResponseType";

function generateRandomBase64String(lengthBytes: number): string {
    return crypto.randomBytes(lengthBytes).toString("base64");
}

async function checkGameIDValidity(gameID: string) {
    return await readGamesData(gameID) != undefined
}

interface anyObject {
    [key: string | number]: any
}

async function sendWSResponse(socket: WebSocket, responseType: MessageTypes, dataObj: anyObject, logMessage: string, terminate: boolean) {
    logger.log({
        level: "debug",
        message: logMessage,
      });
  
      const response: MessageResponseType = {
        type: responseType,
        data: dataObj,
      };

      socket.send(JSON.stringify(response));
      if (terminate) return socket.terminate();
      return
}

export {generateRandomBase64String, checkGameIDValidity, sendWSResponse}