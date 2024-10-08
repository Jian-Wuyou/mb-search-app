import { get, writable } from 'svelte/store';
import { type Session, type Account } from '$lib/models';

const initial: Session = {
    accounts: []
};

export function initStore() {
    const store = writable<Session>(initial);

    const { set, subscribe } = store;

    function create() {
        const session = {
            accounts: []
        };

        set(session);
    }

    function add_account(account: Account) {
        const session = get(store);
        session.accounts.push(account);
        set(session);
    }
    
    function clear() {
        set(initial);
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