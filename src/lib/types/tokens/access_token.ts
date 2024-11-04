import type { UserPermissionsType } from "../misc/user_permissions"

interface AccessTokenType {
    name: string,
    permissions: UserPermissionsType,
    salt: string
}

export type {AccessTokenType}