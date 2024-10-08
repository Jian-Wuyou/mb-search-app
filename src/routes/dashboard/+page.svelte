<script>
    import SearchBar from '../../components/searchBar.svelte';
    import SideBar from '../../components/sideBar.svelte';
    import Status from '../../components/status.svelte'
    import { access_token, posts, query, mastodon_authorized} from '../../lib/stores'
  import { env } from '$env/dynamic/public';
  import { goto } from '$app/navigation';
    let stringsss = '';

    function logout(){
        mastodon_authorized.set(false);
        goto('/login');
    }

    $: {
        $posts
    }
</script>


<div class="flex justify-center h-screen" style="overflow: auto;">
    {#if mastodon_authorized}
        <button on:click={logout}>Log out</button>
        <div class="timeline-container">
            <div class="search-container">
                <div class="search-container flex items-center">
                    <SearchBar />
                </div>
            </div>
            {#each $posts as acc}
                <Status content={acc['content']} acct_name={acc['account']['username']}/>
            {/each}
        </div>
        <SideBar />
    {:else}
        {goto('/login')}
    {/if}
</div>

<style>
    .timeline-container {
        height: fit-content;
        border-left: 1px solid #2E524C;
        border-right: 1px solid #2E524C;
    }

    .search-container {
        position: sticky;
        top: 0;
        width: 758px;
        height: 120px;
        padding: 2em;
        border-bottom: 1px solid #2E524C;
        background-color: #162721;
    }

</style>