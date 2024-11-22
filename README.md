# Mastodon-Bluesky Integrated Search App
*by David Amante, Justin Clyde Frongoso, Julia Sabado & Christian Verdad*
<br>
<br>

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=Svelte&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Homepage](https://github.com/Jian-Wuyou/mb-search-app/blob/main/static/mb-home.png?raw=true)
*Home Page*

![Login](https://github.com/Jian-Wuyou/mb-search-app/blob/main/static/mb-modal.png?raw=true)
*Account Login*

![Dashboard](https://github.com/Jian-Wuyou/mb-search-app/blob/main/static/mb-db.png?raw=true)
*Dashboard*

## Description
The Mastodon-Bluesky Integrated Search App provides a functional multi-platform search tool for Mastodon and Bluesky users. This app bridges the gap left by the limited search functionality of Mastodon and Bluesky. Mastodon's search utility only searches posts within its own domain, and the same limitation applies to Bluesky. This application aims to solve the problem of integrated searching, enhancing user experience by eliminating the need to switch between the two platforms.

## Installation
To install the dependencies, run the following 
```bash
npm install
```
To run the Search App, navigate to the `src` folder and run the command
```bash
npm run dev
```
From there, open the `localhost` link provided to use the Search App.

## Search App Login
To access the dashboard, you must first login to the Search App's central account. Enter the credentials then click `Login`. Once authenticated, you will be brought to the blank dashboard. Click the `Connect` button on the sidebar to login to your Mastodon and Bluesky accounts and start searching.

### Mastodon Login
Click `Get Code`, authorize permission to connect your Mastodon account, and copy and paste the given token into the modal. Click `Connect` and your Mastodon account is now connected to the Search App.

### Bluesky Login
Simply enter your credentials (username including `bsky.social` and password) and click `Connect` to have your Bluesky account connected to the Search App.

## Dashboard & Search Functionality
Once at least one account is connected to the Search App, you may now start searching. By clicking on the eye icon in the sidebar, the content from that specific app will be hidden from the timeline. By clicking on it again, the content will be unhidden and shown again. Similarly, clicking on the trash icon in the sidebar logs out the respective account and will clear the timeline if there is no connected account.

To search, enter any keyword/phrase in the search bar and click `Search` or press enter. The timeline will display up to a total of 200 posts (100 max each from Mastodon and Bluesky) sorted by the most recent posts first. Clicking on the `Images`, `Videos`, or `Links` buttons in the search bar will filter the timeline based on the selected category.

### Timeline Interactions
1. Clicking on the post's **text** will redirect you to the original post in Mastodon or Bluesky.
2. Clicking on the post's **photo**, if any, will enlarge the image within the app.
3. Clicking on the post's **video**, if any, will play the video within the app.
4. Clicking on the post's **embed**, if any, will redirect you to the embedded link.
