import type { PageLoad } from './$types';

// TODO Chacing?
export const load: PageLoad = async({ fetch }) => {
	const questionSetIDs = await fetch("/api/question_sets/fetch_ids")
    const data = await questionSetIDs.json()
    return {serverData: data}
};