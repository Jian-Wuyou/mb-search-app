<script>
    import { sessionStore } from "$lib/store/session";
    $: {
        console.log(JSON.stringify($sessionStore));
    }
</script>

<div class = "side-bar">
    <h1 class="title-text">SearchApp</h1>
    <h1 style="color: #98CDC4"><strong>Connected Feeds <a href="/">+</a></strong></h1>
    {#if $sessionStore.accounts.mastodon}
        <div on:click={sessionStore.remove_mastodon} class="cursor-pointer hover:bg-[#1D342F] text-[#98CDC4] flex flex-row items-center gap-3">
            <div><i class="fa-brands fa-mastodon text-[#6364FF] text-4xl"></i></div>
            <div>{$sessionStore.accounts.mastodon.username || "no username"} | @{$sessionStore.accounts.mastodon.handle}</div>
        </div>
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