import { PRIVATE_JWT_ACCESS_TOKEN_SECRET } from "$env/static/private";
import { queryWhereUsersData, updateUsersData } from "$lib/database/database";
import type {
  DBCollectionName,
  UserAccessType,
  UserPermissionsType,
} from "$lib/types/misc/user_permissions";
import type { AccessTokenPayloadType } from "$lib/types/tokens/access_token";
import type { AuthTokenPairType } from "$lib/types/tokens/auth_token_pair";
import jwt from 'jsonwebtoken';
import { requestNewTokenPair } from "./auth";

// * This function needs to update the permission in the database and trigger a token regen.
async function updateUserPermissions(
  collection: DBCollectionName,
  docID: string,
  access: UserAccessType,
  tokens: AuthTokenPairType
): Promise<AuthTokenPairType> {

    // * Even though we could make the function accept already verified data, I think it is better
    // * if the function process this itself so that it can be called from a more variable
    // * amount of contexts.
    const accessTokenData = jwt.verify(tokens.accessToken, PRIVATE_JWT_ACCESS_TOKEN_SECRET) as AccessTokenPayloadType
    
    let newPermissionsObject: UserPermissionsType = accessTokenData.permissions
    newPermissionsObject[collection]!.access = access
    newPermissionsObject[collection]!.docs.push(docID)
    console.log(newPermissionsObject)

  const userDoc = await queryWhereUsersData(
    "access_token",
    tokens.accessToken,
    "==",
    "first"
  );

  // * In the unlikely case we were unable to find the user to update, we will force a relogin.
  if (userDoc == undefined) return { accessToken: "", refreshToken: "" }

  await updateUsersData(userDoc.docs[0].id, {
    permissions: newPermissionsObject
  })

  const newTokenPair = await requestNewTokenPair(tokens.refreshToken)
  switch(newTokenPair) {
    case 401:
        return {accessToken: "", refreshToken: ""}
    case 404:
        return {accessToken: "", refreshToken: ""}
    case 500:
        return {accessToken: "", refreshToken: ""}
    }

  return newTokenPair;
}

export { updateUserPermissions };
