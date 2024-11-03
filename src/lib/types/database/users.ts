// Even though a DB query for users must always return all of the interface properties, the "?"
// has been added so that I can write to this collection without having to express all other
// properties of the document.

import type { RefreshTokenType } from "../tokens/refresh_token"

interface DBUsersType {
    name: string,
    surname: string,
    email: string,
    password: string,
    access_token: string, // this is the token that expires super quickly
    refresh_tokens: Array<RefreshTokenType>,
    consumed_refresh_tokens: Array<RefreshTokenType>
}

// TODO Look into rewriting with Partials?
// TODO https://stackoverflow.com/questions/74095584/optional-and-required-properties-in-ts-interfaces
interface DBUsersTypeWrite {
    name?: string,
    surname?: string,
    email?: string,
    password?: string,
    access_token?: string, // this is the token that expires super quickly
    refresh_tokens?: Array<RefreshTokenType>,
    consumed_refresh_tokens?: Array<RefreshTokenType>
}
export type {DBUsersType, DBUsersTypeWrite}