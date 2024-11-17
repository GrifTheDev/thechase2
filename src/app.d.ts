

import type { AuthCookieType } from "$lib/types/tokens/access_token";


// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {

		// Do not define message here a second time!
		interface Error {
			devDump?: string
		}
		interface Locals {
			user: AuthCookieType
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}


export {};
