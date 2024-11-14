<script>
    import { sessionStore } from "$lib/store/session";
    import { mastodon_posts, bluesky_posts } from "$lib/stores";
    import { LoginForm } from '$lib/components';
    import { createEventDispatcher } from "svelte";
    import { page } from '$app/stores'
    import FaEye from "svelte-icons/fa/FaEye.svelte";
    import FaEyeSlash from 'svelte-icons/fa/FaEyeSlash.svelte'
    import FaTrashAlt from 'svelte-icons/fa/FaTrashAlt.svelte'
    export let enable_mastodon = true;
    export let enable_bluesky = true;

    const dispatch = createEventDispatcher();

    async function logout_mastodon() {
        await sessionStore.remove_mastodon();
        mastodon_posts.set([]);
    }

    async function logout_bluesky() {
        await sessionStore.remove_bluesky();
        bluesky_posts.set([]);
    }

    let connectModal;
    function closeModalWhenClickedOutside(modal, event)
    {
        let dimensions = modal.getBoundingClientRect()
        if (
            (event.clientX < dimensions.left || event.clientX > dimensions.right) ||
            (event.clientY < dimensions.top || event.clientY > dimensions.bottom)
        ) {
            modal.close();
        }
    }

    function connectSuccess(event)
    {
        connectModal.close();
        if (event.detail.host == "mastodon") enable_mastodon = true;
        if (event.detail.host == "bluesky") enable_bluesky = true;
        dispatch("connect");
    }

    $: console.log($sessionStore.accounts);
</script>

<div class="side-bar">
    <h1 class="title-text">SearchApp</h1>

    {#if $page.data.user}
        <div
            class="w-full p-2 mt-2 text-[#98CDC4] flex flex-row justify-between items-center"
        >
            <div class="flex flex-row items-center gap-3">
                <div class="h-10 w-10 mr-2">
                    <i class="text-4xl m-1 fa-solid fa-circle-user"></i>
                </div>
                <div class="text-left w-full break-all w-[20ch]">
                    <strong>{$page.data.user.name}</strong>
                </div>
            </div>
            <form action="/logout" method="post">
                <button 
                    type="submit"
                    class="p-1 text-mintGreen opacity-70 hover:underline"
                >
                    Logout
                </button>
            </form>
        </div>
    {/if}

    <h1 style="color: #98CDC4" class="mt-2">
        <strong>Connected Feeds</strong>
    </h1>
    {#if $sessionStore.accounts.mastodon}
        <button
            type="button"
            on:click={() => (enable_mastodon = !enable_mastodon)}
            class="w-full p-2 mt-2 hover:bg-[#1D342F] text-[#98CDC4] flex flex-row justify-between items-center"
        >
            <div class="flex flex-row items-center gap-3">
                <div class="h-10 w-10 mr-2">
                    <i
                        class="fa-brands fa-mastodon text-[#6364FF] text-4xl m-1 {enable_mastodon
                            ? 'opacity-100'
                            : 'opacity-40'}"
                    ></i>
                </div>
                <div class="text-left w-full break-all w-[20ch]">
                    <div class={enable_mastodon ? "opacity-70" : "opacity-40"}>
                        { $sessionStore.accounts.mastodon.username || "no username"}
                    </div>
                    <div class={enable_mastodon ? "opacity-100" : "opacity-40"}>
                        @{ $sessionStore.accounts.mastodon.handle}
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center gap-3">
                {#if enable_mastodon}
                    <button class="hide flex justify-center items-center">
                        <FaEye />
                    </button>
                {/if}
                {#if !enable_mastodon}
                    <button class="unhide flex justify-center items-center">
                        <FaEyeSlash />
                    </button>
                {/if}
                <button type="button" class="logout flex justify-center items-center" on:click={logout_mastodon}
                    ><FaTrashAlt /></button
                >
            </div>
        </button>
    {/if}
    {#if $sessionStore.accounts.bluesky}
        <button
            type="button"
            on:click={() => (enable_bluesky = !enable_bluesky)}
            class="w-full p-2 mt-2 hover:bg-[#1D342F] text-[#98CDC4] flex flex-row justify-between items-center"
        >
            <div class="flex flex-row items-center gap-3">
                <div class="h-10 w-10 mr-2">
                    <i
                        class="fa-brands fa-bluesky text-[#1185FE] text-4xl m-1 {enable_bluesky
                            ? 'opacity-100'
                            : 'opacity-40'}"
                    ></i>
                </div>
                <div class="text-left w-full break-all w-[20ch]">
                    <div class={enable_bluesky ? "opacity-70" : "opacity-40"}>
                        { $sessionStore.accounts.bluesky.username || "no username"}
                    </div>
                    <div class={enable_bluesky ? "opacity-100" : "opacity-40"}>
                        @{$sessionStore.accounts.bluesky.handle}
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center gap-3">
                {#if enable_bluesky}
                    <button class="hide flex justify-center items-center">
                        <FaEye />
                    </button>
                {/if}
                {#if !enable_bluesky}
                    <button class="unhide flex justify-center items-center">
                        <FaEyeSlash />
                    </button>
                {/if}
                <button type="button" class="logout flex justify-center items-center" on:click={logout_bluesky}
                    ><FaTrashAlt /></button
                >
            </div>
        </button>
    {/if}

    <button 
        on:click={() => connectModal.showModal()}
        class="rounded-full w-full mt-4 bg-mintGreen text-blackGreen"
    >
        <strong>Connect</strong>
    </button>

    <dialog bind:this={connectModal}
        on:click={(e) => closeModalWhenClickedOutside(connectModal, e)}
        class="p-8 rounded-lg bg-blackGreen border border-slateGreen"    
    >
        <LoginForm on:success={connectSuccess}/>
    </dialog>
</div>

<style>
    .side-bar {
        position: sticky;
        top: 0;
        right: 0;
        height: 100vh;
        width: 30ch;
        padding: 1em;
        background-color: #162721;
    }

    .title-text {
        color: #98cdc4;
        font-weight: bold;
        font-size: 2em;
        margin-bottom: 0.5em;
    }

    .hide {
        color: rgba(235, 235, 228, 0.90);
        height: 24px;
        width: 24px;
        margin-left: 16px;
    }

    .unhide {
        color: rgba(235, 235, 228, 0.4);
        height: 24px;
        width: 24px;
        margin-left: 16px;
    }

    .logout {
        color: #82202c;
        height: 24px;
        width: 24px;
    }

    dialog::backdrop {
        background-color: black;
        opacity: 0.25;
    }
</style>
