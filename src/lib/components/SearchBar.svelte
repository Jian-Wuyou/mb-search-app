<script lang="ts">
    import { onMount } from 'svelte';
    import FaSearch from "svelte-icons/fa/FaSearch.svelte";
    import { mastodon_posts, bluesky_posts } from '$lib/stores';
    import { sessionStore } from '$lib/store/session';
    import { getAtpAgent } from '$lib/bsky';

    const agent = getAtpAgent(sessionStore);
    if($sessionStore.accounts.bluesky) {
        agent.resumeSession($sessionStore.accounts.bluesky.credentials);
    }

    export let searchQuery = '';
    let searchHistory: Array<{ query: string; timestamp: string }> = [];
    const MAX_HISTORY_ITEMS = 5;

    onMount(() => {
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            searchHistory = JSON.parse(savedHistory);
        }
    });

    function addToHistory(query: string) {
        
        if (!query.trim()) return;
        
        searchHistory = searchHistory.filter(item => item.query !== query);
        
        searchHistory = [{
            query,
            timestamp: new Date().toISOString()
        }, ...searchHistory];
        
        if (searchHistory.length > MAX_HISTORY_ITEMS) {
            searchHistory = searchHistory.slice(0, MAX_HISTORY_ITEMS);
        }
        
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }

    function removeFromHistory(query: string) {
        searchHistory = searchHistory.filter(item => item.query !== query);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }

    function clearHistory() {
        searchHistory = [];
        localStorage.setItem('searchHistory', JSON.stringify([]));
    }

    async function search(event?: Event) {
        if (event) {
            event.preventDefault();
        }

        if (searchQuery.length > 300) {
            searchQuery = searchQuery.slice(0, 300);
        }

        addToHistory(searchQuery);

        if($sessionStore.accounts.mastodon) {
            const searchParams = new URLSearchParams({
                q: searchQuery,
                limit: '20',
                type: 'statuses'
            });

            const href = `https://mastodon.social/api/v2/search?${searchParams.toString()}`;
            const response = await fetch(href, {
                headers: {
                    'Authorization': `Bearer ${$sessionStore.accounts.mastodon.credentials.access_token}`
                }
            });

            if(response.ok){
                let post = await response.json();
                mastodon_posts.set(post['statuses']);
            }
        }

        if($sessionStore.accounts.bluesky) {
            const searchParams = new URLSearchParams({
                q: searchQuery,
                limit: '20'
            });
            
            const pdsUrl = agent.pdsUrl;
            const href = `${pdsUrl}xrpc/app.bsky.feed.searchPosts?${searchParams.toString()}`
            const response = await fetch(
                href, {
                    headers: {
                        Authorization: `Bearer ${$sessionStore.accounts.bluesky.credentials.accessJwt}`
                    }
                }
            );

            if(response.ok) {
                let post = await response.json();
                bluesky_posts.set(post['posts']);
            }
        }
    }

    let isExpanded = false;

    function handleFocus() {
        isExpanded = true;
    }

    function handleBlur() {
        setTimeout(() => {
            isExpanded = false;
        }, 200);
    }

    function useHistoryItem(query: string) {
        searchQuery = query;
        search();
    }
</script>

<div class="relative w-full">
    <div class="search-bar">
        <div class="icon absolute left-3.5 top-1/2 transform -translate-y-1/2">
            <FaSearch />
        </div>
        <input
            type="text"
            class="search-input pl-12 px-4 bg-teal text-lg text-mintGreen placeholder-mintGreen placeholder-opacity-50 focus:outline-none hover:border border-mintGreen {isExpanded
                ? 'rounded-t-lg border-b-2 border-opacity-20 border-mintGreen'
                : 'rounded-lg'}"
            placeholder="Search"
            on:keydown={(e) => e.key === 'Enter' && search(e)}
            bind:value={searchQuery}
            on:focus={handleFocus}
            on:blur={handleBlur}
        />
        <button
            class="search-button absolute right-2 top-1/2 transform -translate-y-1/2 bg-mintGreen text-teal px-3 py-1 rounded-md hover:bg-opacity-80"
            on:click={search}
        >
            Search
        </button>

        {#if isExpanded}
            <div
                class="expanded-content absolute top-full left-0 w-full bg-teal rounded-b-lg p-6 py-2 z-10"
            >
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-2">
                        <p class="font-semibold text-mintGreen">HISTORY</p>
                        <button 
                            class="text-sm text-mintGreen hover:text-white"
                            on:click={clearHistory}
                        >
                            Clear All
                        </button>
                    </div>
                    
                    {#if searchHistory.length === 0}
                        <p class="font-light text-base text-mintGreen mb-4">
                            No recent searches
                        </p>
                    {:else}
                        <div class="space-y-2">
                            {#each searchHistory as { query, timestamp }}
                                <div class="flex justify-between items-center group">
                                    <button 
                                        class="font-light text-mintGreen hover:text-white text-left flex-grow"
                                        on:click={() => useHistoryItem(query)}
                                    >
                                        {query}
                                    </button>
                                    <button 
                                        class="text-mintGreen hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        on:click={() => removeFromHistory(query)}
                                    >
                                        ×
                                    </button>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>

                <div class="mb-2">
                    <p class="font-semibold text-mintGreen">SEARCH OPTIONS</p>
                    <div class="flex justify-between mt-2">
                        <p class="font-light text-mintGreen w-1/2">
                            <span class="font-semibold text-white">from:</span> user
                        </p>
                        <p class="font-light text-mintGreen w-1/2">
                            <span class="font-semibold text-white">has:</span> link / image / video
                        </p>
                    </div>
                </div>
            </div>
        {/if}
    </div>
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

    .search-bar input {
        height: 100%;
        width: 100%;
    }

    .expanded-content {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .search-button {
        font-size: 14px;
        transition: background-opacity 0.2s;
    }
</style>