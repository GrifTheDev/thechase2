import type { UserPermissionsType } from "../misc/user_permissions"

interface AccessTokenType {
    name: string,
    permissions: UserPermissionsType
}

export type {AccessTokenType}