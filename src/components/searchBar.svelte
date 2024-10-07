<script>
    import FaSearch from 'svelte-icons/fa/FaSearch.svelte'
</script>

<div class="flex flex-col items-center justify-center">
    <div class="relative my-2">
        <div
            class="icon absolute left-3.5 top-1/2 transform -translate-y-1/2"
        >
            <FaSearch />
        </div>
    <input
        type="text"
        class="search-bar pl-12 px-4 bg-teal text-lg text-mintGreen placeholder-mintGreen placeholder-opacity-50 hover:border border-mintGreen rounded-lg"
        placeholder="Search"
    />
    </div>
</div>

<style>
    .icon {
        color: #98cdc4;
        width: 20px;
        height: 20px;
    }

    .search-bar {
        width: 758px;
        height: 48px;
    }
</style>
