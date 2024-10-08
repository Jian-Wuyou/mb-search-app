<script>
    import { sessionStore } from "$lib/store/session";
    $: {
        console.log(JSON.stringify($sessionStore));
    }
</script>

<div class = "side-bar">
    <h1 class="title-text">SearchApp</h1>
    <h1 style="color: #98CDC4"><strong>Connected Feeds</strong></h1>
    <!-- {#each $sessionStore.accounts as account}
        <h2 class="text-white">{account.host}: {account.credentials?.username}</h2>
    {/each} -->
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