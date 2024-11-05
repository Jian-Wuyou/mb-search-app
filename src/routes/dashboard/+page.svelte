<script lang="ts">
    import { SearchBar, SideBar, TimelinePost, Status } from '$lib/components';
    import { mastodon_posts, bluesky_posts } from '$lib/stores'
    import { goto } from '$app/navigation';
    import { sessionStore } from '$lib/store/session';
  import { onMount } from 'svelte';

    let all_posts: any[] = [];
    let searchQuery = '';
    onMount(() => {
        if (!$sessionStore.accounts.bluesky || !$sessionStore.accounts.mastodon) {
            goto('/login');
        }
    })
    $: {
        all_posts = [];

        if($sessionStore.accounts.bluesky) {
            for(let post of $bluesky_posts) {
                // console.log(post)
                const postId = post['uri'].split('/').pop();
        
                // Construct the Bluesky web URL
                const postUrl = `https://bsky.app/profile/${post['author']['handle']}/post/${postId}`;
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
                    createdAt : new Date(post['record']['createdAt'])
                })
            }
        }

        if($sessionStore.accounts.mastodon) {
            for(let post of $mastodon_posts) {
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
                    createdAt : new Date(post['created_at'])
                })
            }
        }

        all_posts.sort((a,b)=> b.createdAt - a.createdAt);
        console.log(all_posts);
    }
    let enable_bluesky = true;
    let enable_mastodon = true;

</script>

<div class="flex justify-center h-screen overflow-auto" >
    <div class="timeline-container border-x border-slateGreen">
        <div class="search-container sticky top-0 flex items-center p-8 border-b border-slateGreen bg-blackGreen">
            <SearchBar bind:searchQuery={searchQuery}/>
        </div>
        {#each all_posts as post}
            {#if post.host == "bluesky" && enable_bluesky || post.host == "mastodon" && enable_mastodon}
                <TimelinePost {...post} searchTerm={searchQuery}/>
            {/if}
        {/each}

    </div>

    <SideBar bind:enable_bluesky={enable_bluesky} bind:enable_mastodon={enable_mastodon}/>
</div>

<style>
    .timeline-container {
        min-height: 100vh;
        max-width: 758px;
        height: fit-content;
        border-left: 1px solid #2E524C;
        border-right: 1px solid #2E524C;
    }


    .search-container {
        position: sticky;
        top: 0;
        width: 758px;
        height: 120px;
        padding: 2em;
        border-bottom: 1px solid #2E524C;
        background-color: #162721;
    }
</style>