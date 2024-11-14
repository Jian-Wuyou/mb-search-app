<script>
	import { page } from '$app/stores';
    import { SideBar } from '$lib/components';

    console.log($page);
</script>



<div class="flex justify-center h-screen overflow-auto overflow-y-scroll">
    <div class="timeline-container border-x border-slateGreen p-4">
        <h1 class="title-text">Error Code: {$page.status}</h1>
        <p class="text-mintGreen opacity-70">{$page.error.message}</p>
    </div>
    <SideBar />
</div>

<style>
    .timeline-container {
        min-height: 100vh;
        width: 758px;
        height: fit-content;
        border-left: 1px solid #2e524c;
        border-right: 1px solid #2e524c;
    }

    .title-text {
        color: #98cdc4;
        font-weight: bold;
        font-size: 2em;
        margin-bottom: 0.5em;
    }
</style>