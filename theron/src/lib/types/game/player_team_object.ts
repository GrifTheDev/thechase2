interface PlayerTeamObjectType {
    id: string,
    display_name: string,
    hunt: {
        board_steps: number,
        selected_answer: "A" | "B" | "C",
        win: boolean
    },
    final_hunt: {
        lane_steps: number,
        pushbacks: number,
        win: boolean
    }
}

export type {PlayerTeamObjectType}