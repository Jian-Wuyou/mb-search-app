<script>
    import { sessionStore } from "$lib/store/session";
    $: {
        console.log(JSON.stringify($sessionStore));
    }
</script>

<div class = "side-bar">
    <h1 class="title-text">SearchApp</h1>
    <h1 style="color: #98CDC4"><strong>Connected Feeds <a href="/login">+</a></strong></h1>
    {#if $sessionStore.accounts.mastodon}
        <button type="button" on:click={sessionStore.remove_mastodon} class="cursor-pointer hover:bg-[#1D342F] text-[#98CDC4] flex flex-row items-center gap-3">
            <div class="h-10 w-10"><i class="fa-brands fa-mastodon text-[#6364FF] text-4xl m-1"></i></div>
            <div>{$sessionStore.accounts.mastodon.username || "no username"} | @{$sessionStore.accounts.mastodon.handle}</div>
        </button>
    {/if}
    {#if $sessionStore.accounts.bluesky}
        <button type="button" on:click={sessionStore.remove_bluesky} class="cursor-pointer hover:bg-[#1D342F] text-[#98CDC4] flex flex-row items-center gap-3">
            <div class="h-10 w-10"><i class="fa-brands fa-bluesky text-[#1185FE] text-4xl m-1"></i></div>
            <div>{$sessionStore.accounts.bluesky.username || "no username"} | @{$sessionStore.accounts.bluesky.handle}</div>
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
        color: #98CDC4;
        font-weight: bold;
        font-size: 2em;
        margin-bottom: 0.5em;
    }
</style>