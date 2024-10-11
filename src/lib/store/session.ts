import { get, writable } from 'svelte/store';
import { env } from '$env/dynamic/public';
import type { Session, MastodonCredentials, BlueskyCredentials } from '$lib/models';
import { browser } from "$app/environment"
import {AtpAgent} from "@atproto/api";

const initial: Session = {
    accounts: {
        mastodon: null,
        bluesky: null
    }
};

export function initStore() {
    const store = writable<Session>(initial);

    const { set, subscribe } = store;
    if (browser) {
        const store_string = localStorage.getItem("session_string");
        if (store_string != null) set(JSON.parse(store_string));
    }

    function persist_local() {
        if (browser) {
            const store_string = JSON.stringify(get(store));
            localStorage.setItem("session_string", store_string);
        }
    }

    async function add_mastodon(credentials: MastodonCredentials) {
        const session = get(store);

        const href = 'https://mastodon.social/api/v1/accounts/verify_credentials';

        let response = await fetch(href, {
            headers: {
                'Authorization': `Bearer ${credentials.access_token}`
            }
        });

        if(response.ok){
            let { display_name, username } = await response.json();
            session.accounts.mastodon = {
                host: "mastodon",
                credentials: credentials,
                handle: username,
                username: display_name
            };
        } else {
            throw new Error("Could not login to Mastodon");
        }
        set(session);
        persist_local();
    }

    async function remove_mastodon() {
        const session = get(store);
        if(!session.accounts.mastodon) return;
        session.accounts.mastodon = null;
        set(session);
        persist_local();
    }

    async function add_bluesky(credentials: BlueskyCredentials) {
        const session = get(store);

        if(!session.accounts.bluesky || credentials.handle != session.accounts.bluesky.handle) {

            session.accounts.bluesky = {
                host: "bluesky",
                handle: credentials.handle,
                credentials: credentials
            };
        }

        if(!session.accounts.bluesky.username) {
            
            const agent = new AtpAgent({
                service: "https://bsky.social"
            })
            
            await agent.resumeSession(credentials);
            
            const profile = await agent.getProfile({
                actor: credentials.handle
            });
            
            if(profile.data.displayName) {
                session.accounts.bluesky.username = profile.data.displayName;
            }
        }
        set(session);
        persist_local();
    }

    async function remove_bluesky() {
        const session = get(store);
        if(!session.accounts.bluesky) return;
        session.accounts.bluesky = null;
        set(session);
        persist_local();
    }

    function clear() {
        set(initial);
        persist_local();
    }

    function values(): Session {
        return get(store);
    }

    return {
        clear,
        subscribe,
        values,
        add_mastodon,
        remove_mastodon,
        add_bluesky,
        remove_bluesky
    };
}

export type Store = ReturnType<typeof initStore>;
export const sessionStore: Store = initStore();