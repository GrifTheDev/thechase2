import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ url, data }) => {
    const endpoint = url.pathname
    if (endpoint.startsWith("/app/dashboard")) return {selected: [1, 0, 0]}
    if (endpoint.startsWith("/app/questions")) return {selected: [0, 1, 0]}
    if (endpoint.startsWith("/app/account")) return {selected: [0, 0, 1]}
    return {selected: [0, 0, 0], data}
};