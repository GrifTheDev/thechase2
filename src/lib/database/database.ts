import { error } from '@sveltejs/kit';
import { getDB } from "./initialize_firebase";
import { doc, getDoc, updateDoc } from "@firebase/firestore"
import type { DBUsersType } from "$lib/database/types/users"

const { db } = getDB()

// Add JSDOC so that on highlihgt you can warn not to use generic func
async function readDocData(collection: string, docID: string) {
    const docRef = doc(db, collection, docID)
    const docData = (await getDoc(docRef)).data()
    
    return docData
}
// TODO: Use readdocdata in here but dont export it?
async function readUsersData(docID: string) {
    return await readDocData("users", docID) as DBUsersType
}

export { readDocData, readUsersData }