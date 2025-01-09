// onSnapshot(doc(db, "gameIDs", PUBLIC_GAMEID), (doc1) => {

import { onSnapshot, doc, type Unsubscribe } from "firebase/firestore"
import { getDB } from "../initialize_firebase";
import type { DBGameType } from "$lib/types/database/games";
const { db } = getDB();
// https://stackoverflow.com/questions/72431485/how-to-create-a-reactive-statement-in-svelte-with-firebases-onsnapshot
export const gamesDBSubStore= (() => {
    let unsub: Unsubscribe
    let gamesDocLive: DBGameType | undefined = $state(undefined)

    return {
        startSub(gameID: string) {
            unsub = onSnapshot(doc(db, "games", gameID), (doc) => {
                gamesDocLive = doc.data() as DBGameType
            })
        },
        destroySub() {
            if (unsub) unsub()
        }
    }
})()
