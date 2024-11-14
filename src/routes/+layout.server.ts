import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
    // Sends the user data from locals to $page.data
    return {
        user: locals.user,
    }
}