<script>
    import { sessionStore } from "$lib/store/session";
    export let enable_mastodon = true;
    export let enable_bluesky = true;
</script>

<div class="side-bar">
    <h1 class="title-text">SearchApp</h1>
    <h1 style="color: #98CDC4">
        <strong>Connected Feeds <a href="/login">+</a></strong>
    </h1>
    {#if $sessionStore.accounts.mastodon}
        <button
            type="button"
            on:click={() => (enable_mastodon = !enable_mastodon)}
            class="w-full mt-2 hover:bg-[#1D342F] text-[#98CDC4] flex flex-row items-center gap-3"
        >
            <div class="h-10 w-10 mr-2">
                <i
                    class="fa-brands fa-mastodon text-[#6364FF] text-4xl m-1 {enable_mastodon
                        ? 'opacity-100'
                        : 'opacity-40'}"
                ></i>
            </div>
            <div class="text-left w-full">
                <div class={enable_mastodon ? "opacity-70" : "opacity-40"}>
                    {$sessionStore.accounts.mastodon.username || "no username"}
                </div>
                <div class={enable_mastodon ? "opacity-100" : "opacity-40"}>
                    @{$sessionStore.accounts.mastodon.handle}
                </div>
            </div>
            <button
                type="button"
                class="ml-auto"
                on:click={sessionStore.remove_mastodon}>X</button
            >
        </button>
    {/if}
    {#if $sessionStore.accounts.bluesky}
        <button
            type="button"
            on:click={() => (enable_bluesky = !enable_bluesky)}
            class="w-full mt-2 hover:bg-[#1D342F] text-[#98CDC4] flex flex-row items-center gap-3"
        >
            <div class="h-10 w-10 mr-2">
                <i
                    class="fa-brands fa-bluesky text-[#1185FE] text-4xl m-1 {enable_bluesky
                        ? 'opacity-100'
                        : 'opacity-40'}"
                ></i>
            </div>
            <div class="text-left w-full">
                <div class={enable_bluesky ? "opacity-70" : "opacity-40"}>
                    {$sessionStore.accounts.bluesky.username || "no username"}
                </div>
                <div class={enable_bluesky ? "opacity-100" : "opacity-40"}>
                    @{$sessionStore.accounts.bluesky.handle}
                </div>
            </div>
            <button
                type="button"
                class="ml-auto"
                on:click={sessionStore.remove_bluesky}>X</button
            >
        </button>
    {/if}
</div>

<style>
    .side-bar {
        position: sticky;
        top: 0;
        right: 0;
        height: 100vh;
        width: 300px;
        padding: 1em;
        background-color: #162721;
    }

    .title-text {
        color: #98cdc4;
        font-weight: bold;
        font-size: 2em;
        margin-bottom: 0.5em;
    }
</style>
