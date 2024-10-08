import { get, writable } from 'svelte/store';
import type { Session, Account, MastodonCredentials } from '$lib/models';
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

    function add_mastodon(credentials: MastodonCredentials) {
        const session = get(store);
        session.accounts.mastodon = {
            host: "mastodon",
            credentials: credentials
        };
        // session.accounts.push(account);
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
        add_mastodon
    };
}

export type Store = ReturnType<typeof initStore>;
export const sessionStore: Store = initStore();