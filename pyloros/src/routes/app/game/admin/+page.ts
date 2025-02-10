import type { PageLoad } from './$types';

export const load: PageLoad = async({ url, data }) => {

    let urlParam = url.searchParams.get("qID") 
    const qSetID = urlParam ?? undefined
	
    return {qSetID: qSetID,  authToken: data.authToken}
};