import { ClientsCache } from "../cache/stores/ClientsCache";
import { GamesCache } from "../cache/stores/GamesCache";
import { CachedGames } from "../types/game/CachedGames";
import { WebSocket } from "ws";
import { sendWSResponse } from "../utils/utils";
import { MessageTypes } from "../types/message/MessageTypes";

async function createTeam(
  gameID: string,
  clientID: string,
  displayName: string
) {
  let currentCachedGame: CachedGames = GamesCache.get(gameID);
  const toNotify = currentCachedGame.game.adminClientID
  const newTeam = {
    id: clientID,
    type: "RUNNER" as "RUNNER",
    display_name: displayName,
    phase_one: {
      steps: 0,
      selectedAnswer: "None" as "None",
      phase_win: false,
    },
    phase_two: {
      steps: 0,
      stopCounter: 0,
      stopped: false,
      phase_win: false,
    },
  }

  currentCachedGame.teams.push(newTeam);

  GamesCache.set(gameID, currentCachedGame);

  const socket: WebSocket = ClientsCache.get(toNotify).socket
  sendWSResponse(socket, MessageTypes.GAME_TEAMS_UPDATE, {id: newTeam.id, type: newTeam.type, displayName: newTeam.display_name}, `Sent new player data.`, false)

  return
}

export { createTeam };
