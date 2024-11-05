<script lang="ts">
    import { goto } from "$app/navigation";
    import { createEventDispatcher } from "svelte";
    import FaRegFileAlt from 'svelte-icons/fa/FaRegFileAlt.svelte'
    
    export let host = "mastodon";
    export let profilePicture = "account_1.png";
    export let username = "username";
    export let handle = "@handle";
    export let content = "Lorem ipsum dolor sit amet";
    // export let time = 324;                  /* datetime */       // TODO
    export let commentCount = 813333433;
    export let shareCount = 5432;
    export let starCount = 28258521;
    export let createdAt: Date | undefined = undefined;
    export let searchTerm = "";
    export let postUrl = "";
    export let mediaAttachments: Array<any> = [];
    export let videoAttachments: Array<any> = [];
    export let embedAttachment: any|null = null;

    const dispatch = createEventDispatcher();

    const dateFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    function truncate(text: string, maxLength: number) {
        if (text.length < maxLength) return text;
        const substring = text.slice(0, maxLength-1);
        return substring + "...";
    }

    function cleanContent(content: string) {
        return content.split(" ")
                .map(text => truncate(text, 70))
                .join(" ")
    }

    // Turns an integer into a readable string
    function prettify(count) {
        let text = count.toString();
        let digits = text.toString().length;
        let thousandsPower = Math.ceil(digits / 3);

        let shortened = count / 1000 ** (thousandsPower - 1);
        let decimalIndex = shortened.toString().indexOf(".");

        let prettyfied = shortened.toString();
        if (decimalIndex > 0) prettyfied = shortened.toFixed(3 - decimalIndex);

        const digitAcronyms = ["", "K", "M", "B", "T"];
        return prettyfied + digitAcronyms[thousandsPower - 1];
    }

    function highlightContent(content, searchTerm) {
        if (!searchTerm) return content;
        const regex = new RegExp(`(${searchTerm})`, "gi");
        return content.replace(regex, '<span class="font-bold">$1</span>');
    }

    // Handle post click to redirect on specific post URL
    function handleClick(event: MouseEvent) {
        event.preventDefault();
        window.location.href = postUrl;
    }
</script>

<div class="post flex flex-row gap-2 p-4">
    <img
        class="profile-picture rounded-lg"
        src={profilePicture}
        alt="profile picture"
    />
    <div class="flex flex-col grow gap-1">
        <div class="flex flex-row justify-between">
            <div class="flex flex-row gap-2 mx-2">
                <!-- Account details -->
                <h1 class="font-bold text-white">{username}</h1>
                <h1 class="text-white">·</h1>
                <h1 class="text-mintGreen">{handle}</h1>
            </div>
            <div>
                {#if createdAt !== undefined}
                    <!-- @ts-ignore -->
                    <h1 class="text-mintGreen">
                        {new Intl.DateTimeFormat(
                            "en-US",
                            // @ts-ignore
                            dateFormatOptions,
                        ).format(createdAt)}
                    </h1>
                {/if}
            </div>
        </div>
        <div
            class="flex flex-col p-4 gap-4 rounded-tr-lg rounded-b-lg"
            class:bg-mastodon={host == "mastodon"}
            class:bg-opacity-30={host == "mastodon"}
            class:bg-bluesky={host == "bluesky"}
            class:bg-opacity-25={host == "bluesky"}
        >
            <!-- Post content -->
            <a
                href={postUrl}
                on:click|preventDefault={handleClick}
                class="post flex flex-row gap-2 p-4"
            >
                <article class="text-wrap w-11/12">
                    <p class="content text-white">
                        {@html highlightContent(cleanContent(content), searchTerm)}
                    </p>
                </article>
            </a>
            {#if embedAttachment !== null}
                <a href={embedAttachment.url} class="border rounded-xl">
                    {#if embedAttachment.thumbnail !== null}
                    <img src={embedAttachment.thumbnail} class="rounded-t-xl" alt="">
                    <div class="border-t-2 p-4">
                        <p class="text-gray-300">{new URL(embedAttachment.url).hostname}</p>
                        <p class="text-white font-bold">{embedAttachment.title}</p>
                        <p class="text-white">{embedAttachment.description}</p>
                    </div>
                    {:else}
                    <div class="flex flex-row items-center">
                        <div class="icon flex">
                            <FaRegFileAlt />
                        </div>
                        <div class="border-l-2 p-4">
                            <p class="text-gray-300">{new URL(embedAttachment.url).hostname}</p>
                            <p class="text-white font-bold">{embedAttachment.title}</p>
                            <p class="text-white">{embedAttachment.description}</p>
                        </div>
                    </div>
                    {/if}
                </a>
            {:else if videoAttachments !== undefined && Array.from(videoAttachments).length > 0}
                <div>
                    {#if videoAttachments[0].url.endsWith('m3u8')}
                    <img 
                        class="cursor-pointer"
                        style="width:100%"
                        src={videoAttachments[0].thumbnail}
                        alt=""
                        on:click={() => dispatch('imageClick', {
                            url: videoAttachments[0].thumbnail
                        })}
                    />
                    {:else}
                    <video controls>
                        <source src={videoAttachments[0].url} type="video/mp4" />
                    </video>
                    {/if}
                </div>
            {:else if mediaAttachments !== undefined && Array.from(mediaAttachments).length > 0}
                <div class="flex justify-stretch w-full">
                    <img
                        class="cursor-pointer"
                        style="width:100%"
                        src={mediaAttachments[0]["preview_url"]}
                        alt=""
                        on:click={() => dispatch('imageClick', {
                            url: mediaAttachments[0]["preview_url"]
                        })}
                    />
                </div>
            {/if}
            <div class="flex flex-row justify-between text-mintGreen">
                <!-- Post statistics -->
                <span class="flex flex-row items-center gap-1">
                    <i class="fa-solid fa-comment"></i>
                    <span class="text-xs">{prettify(commentCount)}</span>
                </span>
                <span class="flex flex-row items-center gap-1">
                    <i class="fa-solid fa-share"></i>
                    <span class="text-xs">{prettify(shareCount)}</span>
                </span>
                <span class="flex flex-row items-center gap-1">
                    <i class="fa-solid fa-star"></i>
                    <span class="text-xs">{prettify(starCount)}</span>
                </span>
            </div>
        </div>
    </div>
</div>

<style>
    .post .profile-picture {
        height: 100px;
        width: 100px;
    }

    .icon {
        color: white;
        max-height: 20px;
    }
</style>
