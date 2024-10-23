import { error } from "@sveltejs/kit";
import { getDB } from "./initialize_firebase";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import type { DBUsersType } from "$lib/database/types/users";

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
    error(500, {
      message: `Could not query data from collection ${collection} with ID ${docID}`,
      devDump: `Could not query data from collection ${collection} with ID ${docID}`,
    });
  } else {
    return docData;
  }
}

/**
   * @description Use this ONLY when you cannot use a predefined function for a DB write.
   * @private
   */
async function updateDocData(collection: string, docID: string, toWrite: any) {
  const docRef = doc(db, collection, docID);
  const docData = await updateDoc(docRef, toWrite);
  return docData;
}

async function readUsersData(docID: string) {
  return (await readDocData("users", docID)) as DBUsersType;
}

async function updateUsersData(docID: string, data: DBUsersType) {
  await updateDocData("users", docID, data);
}

export { readDocData, readUsersData, updateDocData, updateUsersData };
