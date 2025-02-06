import { WebSocketServer, WebSocket } from 'ws';
import { logger } from './lib/logger';
import { MessagePayloadType } from './lib/types/message/MessagePayloadType';
import { MessageTypes } from './lib/types/message/MessageTypes';
import 'dotenv/config'
import { initialConnectionResponse } from './lib/utils/initial_connection';

const wss: WebSocketServer = new WebSocketServer({ port: 8080 });

wss.on("listening", () => {
    logger.log({level: "info", message:"Theron service online."})
})

wss.on('connection', function connection(ws) {

  initialConnectionResponse(ws)
  
  ws.on('error', console.error);

  ws.on('message', (rawData) => {

    let data: MessagePayloadType
    try {
      data = JSON.parse(rawData.toString())  
    } catch (error) {
      logger.log({level: "warn", message: "An error occured whilst trying to parse the JSON data sent to Theron. Disconnecting user."})
    
      return ws.terminate()
    }

    if (data.data.clientID == undefined) return ws.terminate()
    

    console.log('received: %s', rawData);
  });
});