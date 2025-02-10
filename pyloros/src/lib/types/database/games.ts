import type { HunterObjectType } from "../game/hunter_object";
import type { PlayerTeamObjectType } from "../game/player_team_object";

interface DBGameType {
    game: {
        id: string,
        state: number,
    },
    question_set_id: string,
    player_teams: Array<PlayerTeamObjectType>,
    hunter: HunterObjectType
}

interface DBGameTypeWrite {
    game?: {
        id: string,
        state: number,
    },
    question_set_id?: string,
    player_teams?: Array<PlayerTeamObjectType>,
    hunter?: HunterObjectType
}

export type {DBGameType, DBGameTypeWrite}