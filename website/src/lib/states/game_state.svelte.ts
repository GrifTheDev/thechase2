import { GameState } from "$lib/types/game/game_state_enum";

export const gameState: {state: GameState} = $state({state: GameState.GAME_NOT_STARTED})