import { AtpAgent } from '@atproto/api';
import { type Store } from '$lib/store/session';

export function getAtpAgent(sessionStore: Store) {
    return new AtpAgent({
        service: 'https://bsky.social',
        persistSession: (evt, session?) => {
            if(session) {
                sessionStore.add_bluesky(session);
            }
        }
    })
}