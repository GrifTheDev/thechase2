// Even though a DB query for users must always return all of the interface properties, the "?"
// has been added so that I can write to this collection without having to express all other
// properties of the document.

interface DBUsersType {
    name?: string,
    surname?: string,
    email?: string,
    passwordHash?: string,
}

export type {DBUsersType}