import { getDB } from "./initialize_firebase";
import { doc, getDoc, updateDoc, addDoc, collection, setDoc } from "@firebase/firestore";
import type { DBUsersType } from "$lib/types/database/users";

const { db } = getDB();

// 31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66

/**
   * @description Use this ONLY when you cannot use a predefined function for a DB read.
   * @private
   */
async function readDocData(collection: string, docID: string) {
  const docRef = doc(db, collection, docID);
  const docData = (await getDoc(docRef)).data();

  if (docData == undefined) {
    // TODO: BETTER ERROR HANDLING/Create log helper script
    return undefined
  } else {
    return docData;
  }
}

/**
   * @description Use this ONLY when you cannot use a predefined function for a DB write.
   * @private
   */

// TODO ADD createdAt
async function updateDocData(collection: string, docID: string, toWrite: any) {
    Object.assign(toWrite, {updatedAt: new Date().getTime()})
    const docRef = doc(db, collection, docID);
    const docData = await setDoc(docRef, toWrite, {merge: true});
    return docData; 
}

async function readUsersData(docID: string) {
  return (await readDocData("users", docID)) as DBUsersType | undefined;
}

async function updateUsersData(docID: string, data: DBUsersType) {
  await updateDocData("users", docID, data);
}

export { readDocData, readUsersData, updateDocData, updateUsersData };
