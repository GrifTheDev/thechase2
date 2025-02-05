import { getDB } from "./initialize_firebase";
import {
  doc,
  getDoc,
  collection,
  setDoc,
  query,
  where,
  type WhereFilterOp,
  getDocs,
  type DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import type { DBUsersType, DBUsersTypeWrite } from "$lib/types/database/users";
import type {
  QuestionSetType,
  QuestionSetTypeWrite,
} from "$lib/types/database/question_sets";
import { logger } from "$lib/server/logger/logger";
import type { DBGameType, DBGameTypeWrite } from "$lib/types/database/games";

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
    return undefined;
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
  Object.assign(toWrite, { updatedAt: new Date().getTime() });
  const docRef = doc(db, collection, docID);
  const docData = await setDoc(docRef, toWrite, { merge: true });
  return docData;
}

/**
 * @description Use this ONLY when you cannot use a predefined function for a DB query.
 * @private
 */

// TODO ADD createdAt
async function queryWhere(
  collectionName: string,
  field: string,
  value: string,
  operator: WhereFilterOp
) {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where(field, operator, value));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

async function readUsersData(docID: string) {
  return (await readDocData("users", docID)) as DBUsersType | undefined;
}

async function updateUsersData(docID: string, data: DBUsersTypeWrite) {
  await updateDocData("users", docID, data);
}

async function queryWhereUsersData(
  field: string,
  value: string,
  operator: WhereFilterOp,
  options: "all" | "first"
): Promise<QuerySnapshot<DBUsersType, DocumentData> | undefined> {
  let querySnapshot;

  try {
    querySnapshot = (await queryWhere(
      "users",
      field,
      value,
      operator
    )) as QuerySnapshot<DBUsersType>;
  } catch (err) {
    if (querySnapshot?.size == 0) {
      logger.log({
        level: "warn",
        service: "DB",
        metadata: "queryWhereUsersData",
        message: `Could query document where ${field} ${operator} ${value}.`,
      });
      return undefined;
    } else {
      logger.log({
        level: "error",
        service: "DB",
        metadata: "queryWhereUsersData",
        message: `Returned an unknown error while querying: ${err}`,
      });
    }
    return undefined;
  }

  if (querySnapshot.size == 0) return undefined;

  switch (options) {
    case "all":
      return querySnapshot;
    case "first":
      if (querySnapshot.size > 1) {
        logger.log({
          level: "warn",
          service: "DB",
          metadata: "queryWhereUsersData",
          message: `You specified the "first" option, however, multiple docs were found. Query: ${field} ${operator} ${value}.`,
        });
        return undefined;
      } else {
        return querySnapshot;
      }
  }
}

async function queryWhereQuestionSetsData(
  field: string,
  value: string,
  operator: WhereFilterOp,
  options: "all" | "first"
): Promise<QuerySnapshot<DBUsersType, DocumentData> | undefined> {
  let querySnapshot;

  try {
    querySnapshot = (await queryWhere(
      "question_sets",
      field,
      value,
      operator
    )) as QuerySnapshot<DBUsersType>;
  } catch (err) {
    if (querySnapshot?.size == 0) {
      logger.log({
        level: "warn",
        service: "DB",
        metadata: "queryWhereQuestionSetsData",
        message: `Could query document where ${field} ${operator} ${value}.`,
      });
      return undefined;
    } else {
      logger.log({
        level: "error",
        service: "DB",
        metadata: "queryWhereUsersData",
        message: `Returned an unknown error while querying: ${err}`,
      });
    }
    return undefined;
  }

  if (querySnapshot.size == 0) return undefined;

  switch (options) {
    case "all":
      return querySnapshot;
    case "first":
      if (querySnapshot.size > 1) {
        logger.log({
          level: "warn",
          service: "DB",
          metadata: "queryWhereUsersData",
          message: `You specified the "first" option, however, multiple docs were found. Query: ${field} ${operator} ${value}.`,
        });
        return undefined;
      } else {
        return querySnapshot;
      }
  }
}

async function readQuestionSetsData(docID: string) {
  return (await readDocData("question_sets", docID)) as
    | QuestionSetType
    | undefined;
}

async function updateQuestionSetsData(
  docID: string,
  data: QuestionSetTypeWrite
) {
  await updateDocData("question_sets", docID, data);
}

async function readGamesData(docID: string) {
  return (await readDocData("games", docID)) as DBGameType | undefined;
}

async function updateGamesData(docID: string, data: DBGameTypeWrite) {
  await updateDocData("games", docID, data);
}

export {
  readDocData,
  readUsersData,
  updateDocData,
  updateUsersData,
  readQuestionSetsData,
  updateQuestionSetsData,
  queryWhereUsersData,
  queryWhereQuestionSetsData,
  readGamesData,
  updateGamesData
};
