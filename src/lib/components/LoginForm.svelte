<script lang="ts">
    import FaUserAlt from "svelte-icons/fa/FaUserAlt.svelte";
    import FaKey from "svelte-icons/fa/FaKey.svelte";
    import { sessionStore } from "$lib/store/session";
    import { goto } from '$app/navigation';
    import { env } from '$env/dynamic/public';
    import { getAtpAgent } from '$lib/bsky';
    
    export let successStatus = false;
    export let successHost = "";

    let selectedHost = "mastodon";
    let username = "";
    let password = "";
    let token = "";

    // If undefined or empty string, there's no error
    let errorMessage: string | undefined;

    async function getMastodonToken() {
        const clientID = env.PUBLIC_CLIENT_ID;
        const redirectURI = env.PUBLIC_REDIRECT_URI;
        const clientSecret = env.PUBLIC_CLIENT_SECRET;
        const href = "https://mastodon.social/oauth/token?client_id="+clientID+"&client_secret="+
            clientSecret+"&scope=read&redirect_uri="+redirectURI+"&grant_type=authorization_code&code="+token;
        try {
            const response = await fetch(href, {
                method: "POST"
            });
            if(response.ok){
                const authToken = await response.json();
                console.log(JSON.stringify(authToken));
                await sessionStore.add_mastodon({
                    access_token: authToken['access_token'],
                    token_type: authToken['token_type'],
                    scope: authToken['scope'],
                    created_at: authToken['created_at']
                });
                successStatus = true;
                successHost = "mastodon";
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            if (!token) {
                errorMessage = "Empty token, please click Get Code!";
            } else {
                errorMessage = "Wrong token, please try again";
            }
            console.error("Error obtaining token:", error);
        }
    }

    function getMastodonCode() {
        let clientID = env.PUBLIC_CLIENT_ID;
        let redirectURI = env.PUBLIC_REDIRECT_URI;
        let href = "https://mastodon.social/oauth/authorize?client_id="+clientID+"&scope=read&redirect_uri="+redirectURI+"&response_type=code";
        window.open(href, "mastodonCode","menubar=1,resizable=1,width=500,height=500");
    }

    async function getBlueskyToken() {
        if(!username) {
            errorMessage = "Enter a handle";
            return;
        }
        if(!password) {
            errorMessage = "Enter a password";
            return;
        }

        const agent = getAtpAgent(sessionStore);

        let resp;
        try {
            resp = await agent.login({
                identifier: username,
                password: password
            })
        } catch(e) {
            errorMessage = "Wrong username or password, please try again";
            return;
        }
        
        if(!resp.success) {
            console.error("Error obtaining token");
            return;
        }

        console.log(JSON.stringify(resp));
        successStatus = true;
        successHost = "bluesky";
    }

    function switchHost(host: string) {
        // Clear error message when switching hosts
        if(selectedHost != host) {
            errorMessage = undefined;
        }
        selectedHost = host;
    }

    function Login() {
        successStatus = false;
        successHost = "";
        if (selectedHost === "mastodon") {
            getMastodonToken();
        } else {
            getBlueskyToken();
        }
    }
</script>

<div class="flex flex-col items-center justify-center">
    <div class="text-white font-bold text-4xl mb-32">
        Connect a <span
            class={selectedHost === "mastodon"
                ? "text-mastodon"
                : "text-bluesky"}
        >
            {selectedHost === "mastodon" ? "Mastodon" : "Bluesky"}
        </span> Account
    </div>

    <form on:submit|preventDefault={Login}>
        <div class="mb-4">
            <div class="text-mintGreen font-bold">Account Host</div>
            <div class="flex items-center mt-2 mb-16">
                <button
                    type="button"
                    class="flex-1 host text-white px-4 rounded-l-lg transition-colors duration-200 ease-in-out"
                    class:bg-mastodon={selectedHost === "mastodon"}
                    class:text-white={selectedHost === "mastodon"}
                    class:cursor-default={selectedHost == "mastodon"}
                    class:bg-transparent={selectedHost !== "mastodon"}
                    class:border={selectedHost !== "mastodon"}
                    class:border-mintGreen={selectedHost !== "mastodon"}
                    class:text-mintGreen={selectedHost !== "mastodon"}
                    class:cursor-pointer={selectedHost !== "mastodon"}
                    on:click={() => switchHost("mastodon")}
                >
                    Mastodon
                </button>
                <button
                    type="button"
                    class="flex-1 host text-white px-4 rounded-r-lg transition-colors duration-200 ease-in-out"
                    class:bg-bluesky={selectedHost === "bluesky"}
                    class:text-white={selectedHost === "bluesky"}
                    class:cursor-default={selectedHost == "bluesky"}
                    class:bg-transparent={selectedHost !== "bluesky"}
                    class:border={selectedHost !== "bluesky"}
                    class:border-mintGreen={selectedHost !== "bluesky"}
                    class:text-mintGreen={selectedHost !== "bluesky"}
                    class:cursor-pointer={selectedHost !== "bluesky"}
                    on:click={() => switchHost("bluesky")}
                >
                    Bluesky
                </button>
            </div>
        </div>

        <div class="text-mintGreen font-bold">Sign in</div>

        
        
        {#if selectedHost !== "mastodon"}
        <div class="relative my-2">
            <div
                class="icon absolute left-3 top-1/2 transform -translate-y-1/2"
            >
                <FaUserAlt />
            </div>
            <input
                bind:value={username}
                type="text"
                placeholder="example.bsky.social"
                class="login-field bg-forestGreen placeholder-mintGreen placeholder-opacity-50 text-mintGreen pl-10 px-2 rounded-lg hover:border border-mintGreen"
            />
        </div>
        <div class="relative">
            <div
                class="icon absolute left-3 top-1/2 transform -translate-y-1/2"
            >
                <FaKey />
            </div>
            <input
                bind:value={password}
                type="password"
                placeholder="Password"
                class="login-field bg-forestGreen placeholder-mintGreen placeholder-opacity-50 text-mintGreen pl-10 px-2 rounded-lg hover:border border-mintGreen"
            />
        </div>
        {:else}
        <div class="relative my-2">
            <div
                class="icon absolute left-3 top-1/2 transform -translate-y-1/2"
            >
                <FaKey />
            </div>
            <input
                bind:value={token}
                placeholder="Token Code"
                class="login-field bg-forestGreen placeholder-mintGreen placeholder-opacity-50 text-mintGreen pl-10 px-2 rounded-lg hover:border border-mintGreen"
            />
        </div>
        {/if}
        {#if errorMessage}
            <div class="flex flex-row gap-2 items-center text-red-600 mt-2">
                <div>
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div>
                    <span>{errorMessage}</span>
                </div>
            </div>
        {/if}

        <div class="flex justify-end gap-4 mt-8">
            {#if selectedHost === "mastodon"}
                <button
                    type="button"
                    class="text-nowrap connect text-white font-bold rounded-lg transition duration-300 ease-in-out"
                    class:bg-mastodon={true}
                    class:hover:bg-[#4CA2FE]={selectedHost !== "mastodon"}
                    on:click={getMastodonCode}
                >
                    Get Code
                </button>
            {/if}
            <button
                type="submit"
                class="connect text-white font-bold px-4 rounded-lg transition duration-300 ease-in-out"
                class:bg-mastodon={selectedHost !== "bluesky"}
                class:bg-bluesky={selectedHost !== "mastodon"}
                class:hover:bg-[#6364FF]={selectedHost !== "bluesky"}
                class:hover:bg-[#4CA2FE]={selectedHost !== "mastodon"}
            >
                Connect
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

    .host {
        width: 336px;
        height: 36px;
    }
</style>
