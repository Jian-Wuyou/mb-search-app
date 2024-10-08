import { get, writable } from 'svelte/store';
import { type Session, type Account } from '$lib/models';
import { browser } from "$app/environment"

const initial: Session = {
    accounts: []
};

export function initStore() {
    const store = writable<Session>(initial);

    const { set, subscribe } = store;
    if (browser) {
        const store_string = localStorage.getItem("session");
        if (store_string != null) set(JSON.parse(store_string));
    }

    function persist_local() {
        const store_string = JSON.stringify(get(store));
        localStorage.setItem("session", store_string);
    }

    function create() {
        const session = {
            accounts: []
        };

        set(session);
        persist_local();
    }

    function add_account(account: Account) {
        const session = get(store);
        session.accounts.push(account);
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
        create,
        clear,
        subscribe,
        values,
        add_account
    };
}

export type Store = ReturnType<typeof initStore>;
export const sessionStore: Store = initStore();