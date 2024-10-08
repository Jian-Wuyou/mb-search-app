<script>
    import { SearchBar, SideBar, TimelinePost } from '$lib/components';

    // Dummy posts
    const post1 = {
        host: "mastodon",
        profilePicture: "account_1.png",
        username: "Business Guy",
        handle: "@nine_to_five",
        content: "I love computers and science!",
        commentCount: 52,
        shareCount: 324,
        starCount: 738, 
    }

    const post2 = {
        host: "bluesky",
        profilePicture: "account_2.png",
        username: "Can’t live without Corporate",
        handle: "@suit_up_and_enterprise",
        content: `🚀💻 Excited to share my journey into the world of computer science! I’ve always understood the importance of technology, 
                  but taking a formal class has opened my eyes to the endless possibilities in this field.
                  Learning to code and build websites has not only enhanced my skills but also transformed the way I approach problem-solving
                  in my business. 💡📈 The future is digital, and I’m committed to staying ahead of the curve. If you’re in business and haven’t 
                  explored computer science yet, I highly recommend it! It’s a game changer. 
                  #TechSavvy #BusinessInnovation #LifelongLearning`,
        commentCount: 421,
        shareCount: 3543,
        starCount: 17432, 
    }

    const post3 = {
        host: "bluesky",
        profilePicture: "account_3.png",
        username: "Lad Boyson",
        handle: "@ladboyson83",
        content: `🌟💻 Hey everyone! Just wanted to share how much I’m loving my computer science class this year! 🖥️✨ We’ve been diving 
                  into coding and building our first websites, and it’s so cool to see my ideas come to life.`,
        commentCount: 39,
        shareCount: 211,
        starCount: 636, 
    }

    const post4 = {
        host: "mastodon",
        profilePicture: "account_4.png",
        username: "Jennifer is my name",
        handle: "@jennnnnny",
        content: `I can’t wait for dishwashers to be powered by Artificial Intelligence!`,
        commentCount: 2388,
        shareCount: 342000,
        starCount: 843000, 
    } 

    const post5 = {
        host: "mastodon",
        profilePicture: "account_5.png",
        username: "Dishes Begone",
        handle: "@hot_single_dishwasher_near_you",
        content: `Beep Boop`,
        commentCount: 12400,
        shareCount: 3200000,
        starCount: 5950000, 
    } 
</script>

<div class="flex justify-center h-screen" style="overflow: auto;">
    <div class="timeline-container border-x border-slateGreen">
        <div class="search-container sticky top-0 flex items-center p-8 border-b border-slateGreen bg-blackGreen">
            <SearchBar />
        </div>
        <TimelinePost {...post1}/>
        <TimelinePost {...post2}/>
        <TimelinePost {...post3}/>
        <TimelinePost {...post4}/>
        <TimelinePost {...post5}/>
    </div>

    <SideBar />
</div>

<style>
    .timeline-container {
        min-height: 100vh;
        max-width: 758px;
        height: fit-content;
    }

    .search-container {
        height: 120px;
    }
</style>