import { GamesCache } from "../cache/stores/GamesCache";
import { readGamesData } from "../database/database";
import { logger } from "../logger";
import { CachedGames } from "../types/game/CachedGames";
import { GameState } from "../types/game/game_state_enum";

async function createGame(gameID: string, adminClientID: string) {
  const gameObject: CachedGames = {
    game: {
      id: gameID,  
      qSetID: gameID, // will be updated once start is pressed
      state: GameState.GAME_NOT_STARTED,
      adminClientID: adminClientID
    },
    teams: [],
  };

  GamesCache.set(gameID, gameObject)

  logger.info(`Cached a new game with code ${gameID}.`)
}

export { createGame };
