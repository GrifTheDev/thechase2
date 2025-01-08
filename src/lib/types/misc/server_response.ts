interface ServerResponseType {
    code: 200 | 201 | 202 | 204 | 400 | 401 | 403 | 404 | 405 | 500 | 501 | 502 | 503, // * List graciously provided by Copilot.
    message: string,
    data: any
}

export type {ServerResponseType}