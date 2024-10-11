import { writable } from "svelte/store";

export const query = writable('');
export const mastodon_posts = writable('');
export const bluesky_posts = writable([]);