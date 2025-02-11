import { GameState } from "./game_state_enum"

interface CachedGames {
    game: {
        id: string,
        state: GameState
        qSetID: string,
        adminClientID: string
    },
    teams: Array<TeamObject>
}

interface TeamObject {
    id: string,
    type: "HUNTER" | "RUNNER",
    display_name: string,
    phase_one: {
        steps: number,
        selectedAnswer: "A" | "B" | "C" | "None",
        phase_win: boolean
    },
    phase_two: {
        steps: number,
        stopped: boolean,
        stopCounter: number
        phase_win: boolean
    }
}

export type {CachedGames}