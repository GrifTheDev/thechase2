import type { UserPermissionsType } from "../misc/user_permissions"
import type { RefreshTokenType } from "../tokens/refresh_token"

interface DBUsersType {
    name: string,
    surname: string,
    email: string,
    password: string,
    access_token: string, // this is the token that expires super quickly
    refresh_tokens: Array<RefreshTokenType>,
    consumed_refresh_tokens: Array<RefreshTokenType>,
    permissions: UserPermissionsType
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
    consumed_refresh_tokens?: Array<RefreshTokenType>,
    permissions?: UserPermissionsType
}
export type {DBUsersType, DBUsersTypeWrite}