<script lang="ts">
    import FaWindowClose from 'svelte-icons/fa/FaWindowClose.svelte'
    import { SearchBar, SideBar, TimelinePost, Status } from '$lib/components';
    import { mastodon_posts, bluesky_posts } from '$lib/stores'
    import { goto, invalidateAll } from '$app/navigation';
    import { sessionStore } from '$lib/store/session';
    import { onMount } from 'svelte';

    let timelineObject;
    let searchBarObject;

    let imageDialogRef: HTMLDialogElement|null = null;
    let imageDialogURL = "";

    let all_posts: any[] = [];
    let searchQuery = '';
    onMount(() => {
        function closeImageModal(e: MouseEvent) {
            if (e.target === null || (e.target as any).contains(imageDialogRef)) return;
            if (imageDialogRef !== null) {
                const rect = imageDialogRef.getBoundingClientRect();
                const isInDialog=(rect.top <= e.clientY && e.clientY <= rect.top + rect.height
                    && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
                // console.log("clicking", imageDialogRef, rect, e.clientX, e.clientY)
                if (!isInDialog) {
                    imageDialogRef.close();
                }
            }
        }

        document.addEventListener('click', closeImageModal)
    })

    // $: {
    //     if ($sessionStore.accounts.bluesky == null && $sessionStore.accounts.mastodon == null) {
    //         goto('/login');
    //     }
    // }

    function handleOpenImage(url: string) {
        if (imageDialogRef !== null) {
            imageDialogURL = url;
            imageDialogRef.showModal();
        }
    }

    $: {
        all_posts = [];

        if($sessionStore.accounts.bluesky) {
            for(let post of $bluesky_posts) {
                // console.log(post)
                const postId = post['uri'].split('/').pop();
        
                // Construct the Bluesky web URL
                const postUrl = `https://bsky.app/profile/${post['author']['handle']}/post/${postId}`;
                const mediaAttachments = post['embed'] !== undefined && post['embed']['images'] !== undefined
                                        ? Array.from(post['embed']['images']).map((p: any) => {
                                            return {
                                                preview_url: p['thumb']
                                            }
                                        })
                                        : []
                const videoAttachments = post['embed'] !== undefined && (post['embed']['$type'] as string).includes('video')
                                        ? [{ url: post['embed']['playlist'], thumbnail: post['embed']['thumbnail'] }]
                                        : []
                const embedAttachment = post['embed'] !== undefined && post['embed']['external'] !== undefined
                                        ? { 
                                            thumbnail: post['embed']['external']['thumb'],
                                            url: post['embed']['external']['uri'],
                                            title: post['embed']['external']['title'],
                                            description: post['embed']['external']['description']
                                        }
                                        : null
                all_posts.push({
                    host : "bluesky",
                    profilePicture : post['author']['avatar'],
                    username : post['author']['displayName'],
                    handle : post['author']['handle'],
                    content : post['record']['text'],
                    commentCount : post['replyCount'],
                    shareCount : post['repostCount'],
                    starCount : post['likeCount'],
                    postUrl: postUrl,
                    createdAt : new Date(post['record']['createdAt']),
                    mediaAttachments : mediaAttachments,
                    videoAttachments: videoAttachments,
                    embedAttachment: embedAttachment
                })
            }
        }

        if($sessionStore.accounts.mastodon) {
            for(let post of $mastodon_posts) {
                const mediaAttachments = post['media_attachments'] !== null
                                        ? Array.from(post['media_attachments'])
                                            .filter((p: any) => p['type'] === 'image')
                                            .map((p: any) => {
                                                return { preview_url: p['preview_url'] }
                                            })
                                        : []
                const videoAttachments = post['media_attachments'] !== null
                                        ? Array.from(post['media_attachments'])
                                            .filter((p: any) => p['type'] === 'video')
                                            .map((p: any) => {
                                                return { url: p['url'] }
                                            })
                                        : []
                const embedAttachment = post['card'] !== null
                                        ? { 
                                            thumbnail: post['card']['image'],
                                            url: post['card']['url'],
                                            title: post['card']['title'],
                                            description: post['card']['description']
                                        }
                                        : null
                all_posts.push({
                    host : "mastodon",
                    profilePicture : post['account']['avatar_static'],
                    username : post['account']['display_name'],
                    handle : post['account']['username'],
                    content : post['content'],
                    commentCount : post['replies_count'],
                    shareCount : post['reblogs_count'],
                    starCount : post['favourites_count'],
                    postUrl: post['url'],
                    createdAt : new Date(post['created_at']),
                    mediaAttachments : mediaAttachments,
                    embedAttachment : embedAttachment,
                    videoAttachments : videoAttachments
                })
            }
        }

        all_posts.sort((a,b)=> b.createdAt - a.createdAt);

        // Scrolls timeline to top
        if (typeof timelineObject !== "undefined")
        {
            timelineObject.scroll(0, 0);
        }

        // console.log(all_posts);
    }
    let enable_bluesky = true;
    let enable_mastodon = true;

</script>

<dialog 
    bind:this={imageDialogRef} 
    style="background-color: rgba(0,0,0,0);"
    class="backdrop:backdrop-blur-3xl backdrop:bg-black backdrop:opacity-50"
>
    <div class="flex">
        <form method="dialog">
            <button class="icon mr-2">
                <FaWindowClose />
            </button>
        </form>
        <img style="max-height:90vh" src={imageDialogURL} alt="">
    </div>
</dialog>

<div bind:this={timelineObject}
    class="flex justify-center h-screen overflow-auto overflow-y-scroll"
>
    <div class="timeline-container border-x border-slateGreen">
        <div
            class="search-container sticky top-0 flex items-center p-8 border-b border-slateGreen bg-blackGreen"
        >
            <SearchBar bind:this={searchBarObject} bind:searchQuery />
        </div>
        {#each all_posts as post}
            {#if (post.host == "bluesky" && enable_bluesky) || (post.host == "mastodon" && enable_mastodon)}
                <TimelinePost {...post} searchTerm={searchQuery} on:imageClick={e => handleOpenImage(e.detail.url)} />
            {/if}
        {/each}
    </div>

    <SideBar on:connect={() => {searchBarObject.refreshAgent();}} bind:enable_bluesky bind:enable_mastodon />
</div>

<style>
    .icon {
        color: white;
        width: 30px;
        height: 30px;
    }

    .timeline-container {
        min-height: 100vh;
        max-width: 758px;
        height: fit-content;
        border-left: 1px solid #2e524c;
        border-right: 1px solid #2e524c;
    }

    .search-container {
        position: sticky;
        top: 0;
        width: 758px;
        height: 120px;
        padding: 2em;
        border-bottom: 1px solid #2e524c;
        background-color: #162721;
    }
</style>
