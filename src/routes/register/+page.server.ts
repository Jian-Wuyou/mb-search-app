import { fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from "uuid";
import { db } from '$lib/database'

export const prerender = false;

export const load: PageServerLoad = async ({ locals }) => {
    // // Redirects user if already logged in
    // if (locals.user) {
    //     throw redirect(302, '/')
    // }
}

const register: Action = async ({request}) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    // Validate username and password
    if (
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        !username || !password
    ) {
        return fail(400, { invalid: true });
    }

    // Checks existing user
    const user = await db.user.findUnique({
        where: { username: username }
    })
    if (user) {
        return fail(400, { user: true });
    }

    // Creates new user
    await db.user.create({
        data: {
            username: username,
            passwordHash: await bcrypt.hash(password, 10),
            userAuthToken: uuidv4(),
            role: { connect: { name: 'USER'} }
        }
    })

    throw redirect(303, '/login');
}

export const actions: Actions = { register };