// Even though a DB query for users must always return all of the interface properties, the "?"
// has been added so that I can write to this collection without having to express all other
// properties of the document.

interface RefreshTokenArrayObject {
    token: string,
    expiry: string, // smth like 1 week, if expired require relog to get new refresh token
}
interface DBUsersType {
    name: string,
    surname: string,
    email: string,
    password: string,
    access_token: string, // this is the token that expires super quickly
    refresh_tokens: Array<RefreshTokenArrayObject>,
    consumed_refresh_tokens: Array<RefreshTokenArrayObject>
}

export type {DBUsersType}