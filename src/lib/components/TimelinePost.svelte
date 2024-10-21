<script lang="ts">
    import { goto } from '$app/navigation';

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

    const dateFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    }

    // Turns an integer into a readable string
    function prettify(count)
    {
        let text = count.toString();
        let digits = text.toString().length;
        let thousandsPower = Math.ceil(digits / 3);

        let shortened = count / (1000 ** (thousandsPower - 1));
        let decimalIndex = shortened.toString().indexOf(".");

        let prettyfied = shortened.toString();
        if (decimalIndex > 0)
            prettyfied = shortened.toFixed(3 - decimalIndex);

        const digitAcronyms = ["", "K", "M", "B", "T"];
        return prettyfied + digitAcronyms[thousandsPower - 1];
    }    

    function highlightContent(content, searchTerm) {
        if (!searchTerm) return content;  
        const regex = new RegExp(`(${searchTerm})`, 'gi');  
        return content.replace(regex, '<span class="font-bold">$1</span>');
    }

    // Handle post click to redirect on specific post URL
    function handleClick(event: MouseEvent) {
        event.preventDefault();
        window.location.href = postUrl;
    }
</script>

<div class="post flex flex-row gap-2 p-4">
    <img class="profile-picture rounded-lg" src={profilePicture} alt="profile picture"/>
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
                <h1 class="text-mintGreen">{
                    new Intl.DateTimeFormat('en-US', 
                    // @ts-ignore
                    dateFormatOptions).format(createdAt)}</h1>
                {/if}
            </div>
        </div>
        <div class="flex flex-col p-4 gap-4 rounded-tr-lg rounded-b-lg" 
            class:bg-mastodon={host == "mastodon"}
            class:bg-opacity-30={host == "mastodon"}
            class:bg-bluesky={host == "bluesky"}
            class:bg-opacity-25={host == "bluesky"}>
            <!-- Post content -->
            <a href={postUrl} on:click|preventDefault={handleClick} class="post flex flex-row gap-2 p-4">
                <article class="text-wrap">
                    <p class="content text-white">{@html highlightContent(content, searchTerm)}</p>
                </article>
              </a>
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
</style>
