import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async({ url, data }) => {
    let urlParam = url.searchParams.get("gID") 
    const gameID = urlParam ?? undefined
    if (gameID == undefined) throw redirect(303, "/app/game/player/join")

    let urlParam2 = url.searchParams.get("displayName") 
    const displayName = urlParam2 ?? undefined
    if (displayName == undefined) throw redirect(303, "/app/game/player/join")
	
    return {gameID: gameID, displayName: decodeURIComponent(displayName)}
};