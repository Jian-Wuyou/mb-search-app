import { writable } from "svelte/store";

export const access_token = writable('');
export const access_token_token_type = writable('');
export const access_token_scope = writable('');
export const access_token_created_at = writable('');
export const mastodon_authorized = writable(false);
export const query = writable('');
export const posts = writable('');