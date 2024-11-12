<script lang="ts">
    import { LoginForm } from '$lib/components';
    import { sessionStore } from '$lib/store/session';
    import { goto } from '$app/navigation';

    // TODO: Go to access (login) page if not logged in
    goto("/dashboard");

    // // if logged in, redirect
    // if($sessionStore.accounts.bluesky || $sessionStore.accounts.mastodon) {
    //     goto("/dashboard");
    // } else {
    //     goto("/login");
    // }
</script>

<div class="flex items-center justify-center h-screen">
</div>