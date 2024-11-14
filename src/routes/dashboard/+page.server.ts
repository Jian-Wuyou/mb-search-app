import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    // Prevents access without account
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    // Prevents access from non-admins
    if (locals.user.role !== 'ADMIN') {
        error(401, "Unauthorized Access")
    }
}