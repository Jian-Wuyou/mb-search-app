import { get, writable } from 'svelte/store';
import { env } from '$env/dynamic/public';
import type { Session, MastodonCredentials } from '$lib/models';
import { browser } from "$app/environment"

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
        session.accounts.mastodon = {
            host: "mastodon",
            credentials: credentials
        };

        let response = await fetch(href, {
            headers: {
                'Authorization': `Bearer ${credentials.access_token}`
            }
        });
        if(response.ok){
            let account = await response.json();
            session.accounts.mastodon.username = account["display_name"];
            session.accounts.mastodon.handle = account["username"];
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
        remove_mastodon
    };
}

export type Store = ReturnType<typeof initStore>;
export const sessionStore: Store = initStore();