<script lang="ts">
    import FaSearch from "svelte-icons/fa/FaSearch.svelte";
    import { posts } from '$lib/stores';
    import { sessionStore } from '$lib/store';

    let value = '';
    async function search(event){
        event.preventDefault();
        console.log(value, $sessionStore.accounts.mastodon)
        const href = `https://mastodon.social/api/v2/search?q=${value}&type=statuses`;
        let response = await fetch(href, {
            headers: {
                'Authorization': `Bearer ${$sessionStore.accounts.mastodon.credentials.access_token}`
            }
        });
        if(response.ok){
            let post = await response.json();
            posts.set(post['statuses']);
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
            bind:value={value}
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
                <!-- need to automate/logic this part for history purposes -->
                <div class="mb-6">
                    <p class="font-semibold text-mintGreen mb-2">HISTORY</p>
                    <p class="font-light text-base text-mintGreen mb-4">
                        No recent searches
                    </p>
                </div>

                <div class="mb-2">
                    <p class="font-semibold text-mintGreen">SEARCH OPTIONS</p>
                    <div class="flex justify-between mt-2">
                        <p class="font-light text-mintGreen w-1/2"><span class="font-semibold text-white">from:</span> user</p>
                        <p class="font-light text-mintGreen w-1/2"><span class="font-semibold text-white">has:</span> link / image / video</p>
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
