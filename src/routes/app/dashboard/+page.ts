import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { readQuestionSetsData } from '$lib/database/database';

// TODO Chacing?
export const load: PageLoad = async({ data, fetch }) => {
	const questionSetIDs = await fetch("/api/question_sets/fetch_ids")
    const d = await questionSetIDs.json()
    return {questionSets: d}
};