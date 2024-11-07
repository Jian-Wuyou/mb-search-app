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
    let displayQuery = '';
    let searchHistory: Array<{ query: string; timestamp: string }> = [];
    const MAX_HISTORY_ITEMS = 5;
    let activeFilters: SearchFilters = {};

    interface SearchFilters {
        from?: string;
        hasLink?: boolean;
        hasImage?: boolean;
        hasVideo?: boolean;
        baseQuery?: string;
    }

    function parseSearchQuery(query: string): SearchFilters {
        const filters: SearchFilters = {};
        const parts = query.split(' ');
        const queryParts: string[] = [];

        parts.forEach(part => {
            if (part.startsWith('from:')) {
                filters.from = part.slice(5);
            } else if (part === 'has:link') {
                filters.hasLink = true;
            } else if (part === 'has:image') {
                filters.hasImage = true;
            } else if (part === 'has:video') {
                filters.hasVideo = true;
            } else {
                queryParts.push(part);
            }
        });

        filters.baseQuery = queryParts.join(' ');
        activeFilters = filters;
        return filters;
    }

    function updateSearchQuery(filterType: 'hasImage' | 'hasVideo' | 'hasLink') {
        const filterText = `has:${filterType.slice(3).toLowerCase()}`;
        const currentFilters = getActiveFilters();
        
        if (currentFilters[filterType]) {
            currentFilters[filterType] = false;
        } else {
            currentFilters[filterType] = true;
        }
        
        const filterParts = [];
        if (currentFilters.hasImage) filterParts.push('has:image');
        if (currentFilters.hasVideo) filterParts.push('has:video');
        if (currentFilters.hasLink) filterParts.push('has:link');
        
        searchQuery = [displayQuery, ...filterParts].filter(Boolean).join(' ');
        activeFilters = currentFilters;
        search();
    }

    function getActiveFilters(): SearchFilters {
        return {
            hasImage: searchQuery.includes('has:image'),
            hasVideo: searchQuery.includes('has:video'),
            hasLink: searchQuery.includes('has:link'),
            baseQuery: displayQuery
        };
    }

    function removeFilter(filterType: keyof SearchFilters) {
        const parts = searchQuery.split(' ');
        let newParts: string[] = [];
        
        parts.forEach(part => {
            if (
                (filterType === 'hasLink' && part !== 'has:link') &&
                (filterType === 'hasImage' && part !== 'has:image') &&
                (filterType === 'hasVideo' && part !== 'has:video') &&
                (filterType === 'from' && !part.startsWith('from:'))
            ) {
                newParts.push(part);
            }
        });
        
        searchQuery = newParts.join(' ');
        search();
    }

    async function searchMastodon(filters: SearchFilters) {
        const searchParams = new URLSearchParams();
        
        if (filters.baseQuery) {
            searchParams.append('q', filters.baseQuery);
        }
        
        if (filters.from) {
            searchParams.append('account_id', filters.from);
        }
        
        if (filters.hasImage || filters.hasVideo) {
            searchParams.append('only_media', 'true');
        }
        
        searchParams.append('type', 'statuses');
        searchParams.append('limit', '20');

        const href = `https://mastodon.social/api/v2/search?${searchParams.toString()}`;
        const response = await fetch(href, {
            headers: {
                'Authorization': `Bearer ${$sessionStore.accounts.mastodon.credentials.access_token}`
            }
        });

        if(response.ok){
            let post = await response.json();
            let filteredPosts = post['statuses'];

            if (filters.hasLink || filters.hasImage || filters.hasVideo) {
                filteredPosts = filteredPosts.filter(post => {
                    if (filters.hasLink && !post.card) return false;
                    if (filters.hasImage && !post.media_attachments.some(media => media.type === 'image')) return false;
                    if (filters.hasVideo && !post.media_attachments.some(media => media.type === 'video')) return false;
                    return true;
                });
            }

            mastodon_posts.set(filteredPosts);
        }
    }

    async function searchBluesky(filters: SearchFilters) {
        const searchParams = new URLSearchParams();
        
        let queryString = filters.baseQuery || '';
        if (filters.from) {
            queryString = `${queryString} from:${filters.from}`.trim();
        }
        
        searchParams.append('q', queryString);
        searchParams.append('limit', '20');
        
        const pdsUrl = agent.pdsUrl;
        const href = `${pdsUrl}xrpc/app.bsky.feed.searchPosts?${searchParams.toString()}`;
        
        const response = await fetch(href, {
            headers: {
                Authorization: `Bearer ${$sessionStore.accounts.bluesky.credentials.accessJwt}`
            }
        });

        if(response.ok) {
            let post = await response.json();
            let filteredPosts = post['posts'];

            if (filters.hasLink || filters.hasImage || filters.hasVideo) {
                filteredPosts = filteredPosts.filter(post => {
                    const embed = post.embed;
                    
                    if (filters.hasLink && !embed?.external) return false;
                    if (filters.hasImage && !embed?.images?.length) return false;
                    if (filters.hasVideo && !embed?.media?.videos?.length) return false;
                    
                    return true;
                });
            }

            bluesky_posts.set(filteredPosts);
        }
    }

    async function search(event?: Event) {
        if (event) {
            event.preventDefault();
        }

        if (searchQuery.length > 300) {
            searchQuery = searchQuery.slice(0, 300);
        }

        addToHistory(searchQuery);

        const filters = parseSearchQuery(searchQuery);

        if($sessionStore.accounts.mastodon) {
            await searchMastodon(filters);
        }

        if($sessionStore.accounts.bluesky) {
            await searchBluesky(filters);
        }
    }

    onMount(() => {
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            searchHistory = JSON.parse(savedHistory);
        }
    });

    $: {
        displayQuery = searchQuery
            .replace('has:image', '')
            .replace('has:video', '')
            .replace('has:link', '')
            .trim();
        activeFilters = getActiveFilters();
    }

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

    let isExpanded = false;

    function handleInput(event: Event) {
        const input = event.target as HTMLInputElement;
        displayQuery = input.value;
        
        const currentFilters = getActiveFilters();
        const filterParts = [];
        if (currentFilters.hasImage) filterParts.push('has:image');
        if (currentFilters.hasVideo) filterParts.push('has:video');
        if (currentFilters.hasLink) filterParts.push('has:link');
        
        searchQuery = [displayQuery, ...filterParts].filter(Boolean).join(' ');
    }

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
    <div class="search-container">
        <div class="search-bar-wrapper">
            <div class="search-input-container">
                <div class="search-icon">
                    <FaSearch />
                </div>
                <div class="filter-buttons">
                    <button 
                        class="filter-button {activeFilters.hasImage ? 'active' : ''}"
                        on:click={() => updateSearchQuery('hasImage')}
                    >
                        Images
                    </button>
                    <button 
                        class="filter-button {activeFilters.hasVideo ? 'active' : ''}"
                        on:click={() => updateSearchQuery('hasVideo')}
                    >
                        Videos
                    </button>
                    <button 
                        class="filter-button {activeFilters.hasLink ? 'active' : ''}"
                        on:click={() => updateSearchQuery('hasLink')}
                    >
                        Links
                    </button>
                </div>
                <input
                    type="text"
                    class="search-input"
                    placeholder="Search"
                    on:input={handleInput}
                    value={displayQuery}
                    on:keydown={(e) => e.key === 'Enter' && search(e)}
                    on:focus={handleFocus}
                    on:blur={handleBlur}
                />
                <button
                    class="search-button"
                    on:click={search}
                >
                    Search
                </button>
            </div>
        </div>

        {#if isExpanded}
            <div
                class="expanded-content"
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
    .search-container {
        width: 100%;
    }

    .search-bar-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        background-color: var(--teal);
    }

    .search-input-container {
        position: relative;
        display: flex;
        align-items: center;
        height: 48px;
        width: 100%;
        padding: 0 8px;
        border-radius: 8px;
        background-color: var(--teal);
    }

    .search-input-container:hover,
    .search-input-container:focus-within {
        border: 1px solid var(--mintGreen);
    }

    .search-icon {
        width: 20px;
        height: 20px;
        color: #98cdc4;
        margin: 0 8px;
    }

    .filter-buttons {
        display: flex;
        gap: 4px;
        margin-right: 8px;
    }

    .filter-button {
        padding: 2px 8px;
        font-size: 14px;
        color: var(--mintGreen);
        background-color: transparent;
        border: 1px solid rgba(152, 205, 196, 0.3);
        border-radius: 4px;
        transition: all 0.2s;
    }

    .filter-button:hover {
        background-color: rgba(152, 205, 196, 0.1);
    }

    .filter-button.active {
        background-color: rgba(152, 205, 196, 0.2);
        border-color: var(--mintGreen);
    }

    .search-input {
        flex: 1;
        height: 100%;
        background-color: transparent;
        color: var(--mintGreen);
        font-size: 18px;
        border: none;
        padding: 0 8px;
    }

    .search-input:focus {
        outline: none;
    }

    .search-input::placeholder {
        color: rgba(152, 205, 196, 0.5);
    }

    .search-button {
        padding: 4px 12px;
        background-color: var(--mintGreen);
        color: var(--teal);
        font-size: 14px;
        border-radius: 6px;
        transition: opacity 0.2s;
        margin-left: 8px;
    }

    .search-button:hover {
        opacity: 0.8;
    }

    .expanded-content {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: var(--teal);
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        padding: 16px 24px 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10;
    }

    :root {
        --teal: #1a3837;
        --mintGreen: #98cdc4;
    }
</style>