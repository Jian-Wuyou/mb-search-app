<script>
    import FaSearch from 'svelte-icons/fa/FaSearch.svelte';
    import { query } from '../lib/stores';
    let value = '';
    function update(){
        query.set(value);
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
        on:change={update}
        bind:value={value}
    />
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
</style>
