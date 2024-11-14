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

const login: Action = async ({cookies, request}) => {
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

    const user = await db.user.findUnique({
        where: { username: username }
    });

    // User does not exist
    if (!user) {
        return fail(400, { credentials: true });
    }

    const passwordSuccess = await bcrypt.compare(password, user.passwordHash);

    // Wrong password
    if (!passwordSuccess){
        return fail(400, { credentials: true });
    }

    // Generate new Auth Token
    const authenticatedUser = await db.user.update({
        where: { username: user.username },
        data: { userAuthToken: uuidv4()}
    })

    // Create cookie
    cookies.set("session", authenticatedUser.userAuthToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30   // 1 month
    })

    throw redirect(302, '/');
}

export const actions: Actions = { login }
