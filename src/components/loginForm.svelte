<script>
    import FaRegUser from "svelte-icons/fa/FaRegUser.svelte";
    import FaKey from 'svelte-icons/fa/FaKey.svelte'

    function Login() {
        console.log("hi");
    }
</script>

<div class="flex items-center justify-center">
    <form on:submit|preventDefault={Login()}>
        <div class="text-mintGreen font-bold">Sign in</div>

        <div class="relative my-2">
            <div class="icon absolute left-3 top-1/2 transform -translate-y-1/2">
                <FaRegUser />
            </div>
            <input
                type="text"
                placeholder="Username"
                class="login-field bg-forestGreen placeholder-mintGreen placeholder-opacity-50 text-mintGreen pl-10 px-2 rounded-lg hover:border border-mintGreen"
            />
        </div>

        <div class="relative mb-8">
            <div class="icon absolute left-3 top-1/2 transform -translate-y-1/2">
                <FaKey />
            </div>
            <input
                type="password"
                placeholder="Password"
                class="login-field bg-forestGreen placeholder-mintGreen placeholder-opacity-50 text-mintGreen pl-10 px-2 rounded-lg hover:border border-mintGreen"
            />
        </div>

        <div class="flex justify-end">
            <button
                type="submit"
                class="connect bg-mastodon text-white font-bold px-4 rounded-lg hover:bg-[#6364FF] transition duration-200 ease-in-out"
            >
                Connect
            </button>
        </div>
    </form>
</div>

<style>
    .icon {
        color: #98CDC4;
        width: 20px;
        height: 20px;
    }
</style>
