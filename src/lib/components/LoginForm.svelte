<script lang="ts">
    import FaUserAlt from "svelte-icons/fa/FaUserAlt.svelte";
    import FaKey from "svelte-icons/fa/FaKey.svelte";
    import { sessionStore } from "$lib/store/session";
    import { goto } from '$app/navigation';

    let selectedHost = "mastodon";
    let username = "";
    let password = "";

    function switchHost(host) {
        selectedHost = host;
    }

    function Login() {
        if (selectedHost === "mastodon") {
            console.log("Logging into Mastodon");
        } else {
            console.log("Logging into Bluesky");
        }

        sessionStore.add_account({
            host: selectedHost,
            credentials: {
                username: username,
                password: password
            },
        });

        goto('/dashboard');
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

        <div class="relative my-2">
            <div
                class="icon absolute left-3 top-1/2 transform -translate-y-1/2"
            >
                <FaUserAlt />
            </div>
            <input
                bind:value={username}
                type="text"
                placeholder="Username"
                class="login-field bg-forestGreen placeholder-mintGreen placeholder-opacity-50 text-mintGreen pl-10 px-2 rounded-lg hover:border border-mintGreen"
            />
        </div>

        <div class="relative mb-8">
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

        <div class="flex justify-end">
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
