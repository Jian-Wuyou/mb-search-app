<script>
    import SearchBar from '../../components/searchBar.svelte';
    import SideBar from '../../components/sideBar.svelte';
    import Status from '../../components/status.svelte'
    import { access_token, query, mastodon_authorized} from '../../lib/stores'
  import { env } from '$env/dynamic/public';
  import { goto } from '$app/navigation';
    let stringsss = '';
    let statuses = [];
    async function search(event){
        event.preventDefault();
        console.log($query);
        console.log($access_token);
        const href = `https://mastodon.social/api/v2/search?q=${$query}&type=statuses`;
        let response = await fetch(href, {
            headers: {
                'Authorization': `Bearer ${$access_token}`
            }
        });
        if(response.ok){
            stringsss = await response.json();
            console.log(stringsss)
            statuses = stringsss['statuses'];
            console.log(statuses)
        }
    }
    function logout(){
        mastodon_authorized.set(false);
        goto('/login');
    }
</script>


<div class="flex justify-center h-screen" style="overflow: auto;">
    {#if mastodon_authorized}
        <button on:click={logout}>Log out</button>
        <div class="search-container">
            <form on:submit={search}>
                <div class="search-container flex items-center">
                    <SearchBar />
                </div>
                <button
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
        <div class="timeline-container">
            {#each statuses as acc}
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