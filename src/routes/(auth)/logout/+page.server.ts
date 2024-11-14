import { redirect } from '@sveltejs/kit'
import { sessionStore } from "$lib/store/session";
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
    throw redirect(302, '/');
}

export const actions: Actions = {
    default: async ({ cookies }) => {
        // Logs out of connected feeds
        // await sessionStore.remove_mastodon();        // TODO: FIX THIS 
        await sessionStore.remove_bluesky();
        
        // Eats the session cookie
        cookies.set("session", "", {
            path: '/',
            expires: new Date(0)
        })

        throw redirect(302, '/login');
    },
}