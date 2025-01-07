import type { HunterObjectType } from "../misc/hunter_object";
import type { PlayerTeamObjectType } from "../misc/player_team_object";

interface DBGameType {
    game_id: string,
    question_set_id: string,
    player_teams: Array<PlayerTeamObjectType>,
    hunter: HunterObjectType
}

interface DBGameTypeWrite {
    game_id?: string,
    question_set_id?: string,
    player_teams?: Array<PlayerTeamObjectType>,
    hunter?: HunterObjectType
}

export type {DBGameType, DBGameTypeWrite}