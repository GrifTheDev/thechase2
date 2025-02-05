import type { RequestHandler } from "./$types";
import type { ServerResponseType } from "$lib/types/misc/server_response";
import { QuestionSetCache } from "$lib/server/cache/stores/question_sets_cache";
import { readGamesData, updateGamesData } from "$lib/database/database";
import { logger } from "$lib/server/logger/logger";
import type { DBGameType } from "$lib/types/database/games";
import { GameState } from "$lib/types/game/game_state_enum";
import type { PlayerTeamObjectType } from "$lib/types/game/player_team_object";
import { generateRandomBase64String } from "$lib/server/auth/utilities";
import { PUBLIC_PLAYER_BOARD_STARTING_STEPS } from "$env/static/public";

export const POST: RequestHandler = async ({ request, cookies, url }) => {
  const { gameCode, displayName }: { gameCode: string; displayName: string } = await request.json();

  let responseObject: ServerResponseType = {
    code: 200,
    message: "Success",
    data: ""
  };

  if (gameCode == undefined || displayName == undefined) {
    responseObject.code = 400;
    responseObject.message = "One or more POST body items are missing.";

    return Response.json(responseObject);
  }

  const teamID = generateRandomBase64String(24)
  const playerObject: PlayerTeamObjectType = {
    id: teamID,
    display_name: displayName,
    hunt: {
      board_steps: Number(PUBLIC_PLAYER_BOARD_STARTING_STEPS),
      selected_answer: "A",
      win: false
    },
    final_hunt: {
      lane_steps: 0,
      pushbacks: 0,
      win: false
    }
  }

  const gData = await readGamesData(gameCode.toString())
  if (gData == undefined) {
    responseObject.code = 400;
    responseObject.message = "Wrong code provided.";

    logger.log({
      level: "warn",
      message: `Got undefined when trying to fetch ${gameCode} game from DB. Probably entered code that does not exist.`,
      service: "API",
      metadata: url.pathname,
    });

    return Response.json(responseObject);
  }
  await updateGamesData(gameCode.toString(), {
    player_teams: [...gData.player_teams, playerObject]
  })

  // * 4. Proudly log triumph.
  logger.log({
    level: "info",
    message: `Player joined`,
    service: "API",
    metadata: url.pathname,
  });

  // * 5. Add gameID data.
  responseObject.data = {teamID: teamID, gameCode: gameCode}
  return Response.json(responseObject);
};
