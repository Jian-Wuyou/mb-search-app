export type Session = {
    accounts: {
        mastodon: Account<MastodonCredentials> | null,
        bluesky: Account<BlueskyCredentials> | null
    }
};

export type Account<Credentials> = {
    host: string,
    username?: string | null,
    handle?: string | null,
    credentials: Credentials
};

export type MastodonCredentials = {
    access_token: string,
    token_type: string,
    scope: string,
    created_at: number
};

export type BlueskyCredentials = any;