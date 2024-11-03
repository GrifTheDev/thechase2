type UserAccessType = "read" | "write" | "readwrite";
type DBCollectionName = "question_sets" | "users";
interface ScopedDBCollectionPermissionObject { access: UserAccessType, docs: Array<string> }

type UserPermissionsType = {
    [key in DBCollectionName]?: ScopedDBCollectionPermissionObject
}

//const a: UserPermissionsType = {"question_sets": {access: "read", docs: ["asd"]}}

export type { UserAccessType, UserPermissionsType };
