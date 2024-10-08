<script>
    import FaSearch from 'svelte-icons/fa/FaSearch.svelte';
    import { access_token, posts } from '$lib/stores';
    let value = '';
    async function search(event){
        event.preventDefault();
        console.log(value, $access_token)
        const href = `https://mastodon.social/api/v2/search?q=${value}&type=statuses`;
        let response = await fetch(href, {
            headers: {
                'Authorization': `Bearer ${$access_token}`
            }
        });
        if(response.ok){
            let post = await response.json();
            posts.set(post['statuses']);
        }
    }
</script>

<div class="search-bar">
    <div class="icon absolute left-3.5 top-1/2 transform -translate-y-1/2">
        <FaSearch />
    </div>
    <input
        type="text"
        class="search-input pl-12 px-4 bg-teal text-lg text-mintGreen placeholder-mintGreen placeholder-opacity-50 hover:border border-mintGreen rounded-lg"
        placeholder="Search"
        on:keydown={(e) => e.key === 'Enter' && search(e)}
        bind:value={value}
    />
    <button
        class="search-button absolute right-2 top-1/2 transform -translate-y-1/2 bg-mintGreen text-teal px-3 py-1 rounded-md hover:bg-opacity-80"
        on:click={search}
    >
        Search
    </button>
</div>

<style>
    .icon {
        color: #98cdc4;
        width: 20px;
        height: 20px;
    }

    .search-bar {
        position: relative;
        height: 48px;
        width: 100%;
    }

    .search-input {
        height: 100%;
        width: 100%;
    }

    .search-button {
        font-size: 14px;
        transition: background-opacity 0.2s;
    }
</style>
