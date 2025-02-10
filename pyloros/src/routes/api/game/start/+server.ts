import type { RequestHandler } from "./$types";
import type { ServerResponseType } from "$lib/types/misc/server_response";
import { QuestionSetCache } from "$lib/server/cache/stores/question_sets_cache";
import { queryWhereUsersData, readGamesData, readUsersData, updateGamesData, updateUsersData } from "$lib/database/database";
import { logger } from "$lib/server/logger/logger";
import type { DBGameType } from "$lib/types/database/games";
import { GameState } from "$lib/types/game/game_state_enum";

export const POST: RequestHandler = async ({ request, cookies, url }) => {
  const { qSetID } = await request.json();
  const authToken = cookies.get("AccessToken")!

  let responseObject: ServerResponseType = {
    code: 200,
    message: "Success",
    data: ""
  };

  if (qSetID == undefined) {
    responseObject.code = 400;
    responseObject.message = "One or more POST body items are missing.";

    return Response.json(responseObject);
  }

  // ? Sometimes Math.random() with the Math.floor() would generate a number that is shorter then with 6 digits.
  // ? Googling for a solution showed this. I have no idea why or how, and at this point in time, I do not care.
  // ? Leaving the source here so I can return and puzzle this out when life permits me more time:
  // ? https://www.wscubetech.com/blog/generate-random-number-in-javascript/#Generate_6_Digit_Random_Number_in_JavaScript
  const gameID = (
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  ).toString();

  // * 1. Check if we have a cached version of the question set, if not cache it so we can use it during the game.
  const cachedQSet = QuestionSetCache.get(qSetID);
  if (cachedQSet == undefined) {
    const DBData = await readGamesData(qSetID);
    QuestionSetCache.set(qSetID, DBData);
    logger.log({
      level: "info",
      message: `Updated cache before game start on Game ID ${gameID}.`,
      service: "API",
      metadata: url.pathname,
    });
  }

  // * 2. Create DB document.
  const DBWrite: DBGameType = {
    game: {
      id: gameID,
      state: GameState.PLAYERS_JOINING,
    },
    question_set_id: qSetID,
    player_teams: [],
    hunter: {
      id: "",
      display_name: "",
      hunt: {
        board_steps: 0,
        selected_answer: "A",
        win: false,
      },
      final_hunt: {
        lane_steps: 0,
        stopped: 0,
        win: false,
      },
    },
  };
  await updateGamesData(gameID, DBWrite);

  // * 3. Set cookie
  cookies.set("GID", gameID, {
    sameSite: true,
    path: "/",
    maxAge: 60 * 60 * 3, // ? 3 hours,
    secure: true,
  });

  // * 4. Proudly log triumph.
  logger.log({
    level: "info",
    message: `Starting a new game with Game ID ${gameID} and Question Set ID ${qSetID}.`,
    service: "API",
    metadata: url.pathname,
  });

  // * 5. Add gameID data.
  responseObject.data = {gameID: gameID}

  const usrData = (await queryWhereUsersData("access_token", authToken, "==", "first"))?.docs[0]
  if (usrData != undefined) updateUsersData(usrData?.id, {activeGames: [...usrData?.data().activeGames, gameID]})

  return Response.json(responseObject);
};
