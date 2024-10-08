<script>
    import { env } from '$env/dynamic/public';
    import { goto } from '$app/navigation';
    import { sessionStore } from '$lib/store';

    let token = '';

    async function obtainToken(event) {
        event.preventDefault();
        const clientID = env.PUBLIC_CLIENT_ID;
        const redirectURI = env.PUBLIC_REDIRECT_URI;
        const clientSecret = env.PUBLIC_CLIENT_SECRET;
        const href = "http://mastodon.social/oauth/token?client_id="+clientID+"&client_secret="+clientSecret+"&scope=read&redirect_uri="+redirectURI+"&grant_type=authorization_code&code="+token;
        try {
            const response = await fetch(href, {
                method: "POST"
            });
            if(response.ok){
                const authToken = await response.json();
                console.log(JSON.stringify(authToken));
                sessionStore.add_mastodon({
                    access_token: authToken['access_token'],
                    token_type: authToken['token_type'],
                    scope: authToken['scope'],
                    created_at: authToken['created_at']
                });
                goto('/dashboard');
            }else{
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error obtaining token:", error);
        }
    }
</script>

<div class="flex flex-col items-center justify-center">

    <form on:submit={obtainToken}>
        <div class="relative my-2">
            <div
                class="icon absolute left-3 top-1/2 transform -translate-y-1/2"
            >
            </div>
            <input
                type="text"
                placeholder="Token Code"
                class="login-field bg-forestGreen placeholder-mintGreen placeholder-opacity-50 text-mintGreen pl-10 px-2 rounded-lg hover:border border-mintGreen"
                bind:value={token}
            />
        </div>

        <div class="flex justify-end">
            <button
                type="submit"
                class="connect text-white font-bold px-4 rounded-lg transition duration-300 ease-in-out"
            >
                Submit
            </button>
        </div>
    </form>
</div>

<style>
    .icon {
        color: #98cdc4;
        width: 20px;
        height: 20px;
    }

    .login-field {
        width: 672px;
        height: 48px;
    }

    .connect {
        width: 99px;
        height: 48px;
    }
</style>
