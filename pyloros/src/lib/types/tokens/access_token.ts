import type { UserPermissionsType } from "../misc/user_permissions"

interface AccessTokenPayloadType {
    name: string,
    permissions: UserPermissionsType,
    salt: string
}

export type {AccessTokenPayloadType}