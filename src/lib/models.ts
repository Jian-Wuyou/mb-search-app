export type Session = {
    accounts: Account[]
};

export type Account = {
    host: string,
    username?: string | null,
    handle?: string | null,
    credentials: {
        username: string,
        password: string
    } | null
};