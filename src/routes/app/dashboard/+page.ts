import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { readQuestionSetsData } from '$lib/database/database';

// TODO Chacing?
export const load: PageLoad = async({ fetch }) => {
	const questionSetIDs = await fetch("/api/question_sets/fetch_ids")
    const data = await questionSetIDs.json()
    return {questionSets: data.questionSetIDs}
};