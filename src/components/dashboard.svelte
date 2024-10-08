<script>
  import { access_token, mastodon_authorized} from '../lib/stores'
  import { env } from '$env/dynamic/public';
  import { goto } from '$app/navigation';
    let query = '';
    let stringsss = '';
    async function search(event){
        event.preventDefault();
        console.log(query);
        console.log($access_token);
        const href = `https://mastodon.social/api/v2/search?q=${encodeURIComponent(query)}`;
        let response = await fetch(href, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        if(response.ok){
            stringsss = await response.json();
            stringsss = JSON.stringify(stringsss);
        }
    }
    function logout(){
        mastodon_authorized.set(false);
        goto('/login');
    }
</script>
<div>
    <button on:click={logout}>Log out</button>
    {#if mastodon_authorized}
        Prongs
        <form on:submit={search}>
            <input 
                type="text"
                bind:value={query}
            />
            <button
                type="submit"
            >
                Submit
            </button>
        </form>
        {stringsss}
    {:else}
        {goto('/login')}
    {/if}
</div>