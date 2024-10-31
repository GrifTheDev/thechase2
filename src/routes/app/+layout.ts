import type { LayoutLoad } from './$types';

// * Data returns values returned from +layout.server.ts
export const load: LayoutLoad = ({ url, data }) => {
    const endpoint = url.pathname
    if (endpoint.startsWith("/app/dashboard")) return {selected: [1, 0, 0], localsData: data}
    if (endpoint.startsWith("/app/questions")) return {selected: [0, 1, 0], localsData: data}
    if (endpoint.startsWith("/app/account")) return {selected: [0, 0, 1], localsData: data}
    return {localsData: data, selected: [0, 0, 0]}
};