import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({cookies}) => {
    return {authToken: cookies.get("AccessToken")}
};