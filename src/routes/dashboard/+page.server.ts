import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
    // Prevents access without account
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    // Prevents access from non-admins
    if (locals.user.role !== 'ADMIN') {
        throw redirect(302, '/error');
    }
}