<script lang="ts">
    import type { ActionData } from './$types'
    import FaUserAlt from "svelte-icons/fa/FaUserAlt.svelte";
    import FaKey from "svelte-icons/fa/FaKey.svelte";

    export let form: ActionData
</script>

<div class="flex items-center justify-center h-screen"> 
    <div class="flex flex-col items-center justify-center">
        <div class="text-white font-bold text-6xl mb-32">
            SearchApp
        </div>

        <form action="?/login" method="POST">
            <div class="mb-4">
                <div class="text-mintGreen font-bold">Sign in</div>

                <div class="relative my-2">
                    <div class="icon absolute left-3 top-1/2 transform -translate-y-1/2">
                        <FaUserAlt />
                    </div>
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        class="login-field bg-forestGreen placeholder-mintGreen placeholder-opacity-50 text-mintGreen pl-10 px-2 rounded-lg hover:border border-mintGreen"
                    />
                </div>

                <div class="relative">
                    <div class="icon absolute left-3 top-1/2 transform -translate-y-1/2">
                        <FaKey />
                    </div>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        class="login-field bg-forestGreen placeholder-mintGreen placeholder-opacity-50 text-mintGreen pl-10 px-2 rounded-lg hover:border border-mintGreen"
                    />
                </div>

                <div class="flex justify-end gap-4 mt-8">
                    <button
                        type="submit"
                        class="connect text-white font-bold px-4 rounded-lg transition duration-300 ease-in-out bg-[#86ada7] hover:bg-mintGreen hover:text-slateGreen"
                    >
                        Login
                    </button>
                </div>
            </div>
        </form>

        <p class="text-[#86ada7]">
            Don't have an account?
            <span class="hover:underline">
                <strong><a href="/register">Sign up</a></strong>
            </span>
        </p>
    </div>
</div>

<style>
    .icon {
        color: #98cdc4;
        width: 20px;
        height: 20px;
    }

    .login-field {
        width: 672px;
        height: 48px;
    }

    .connect {
        width: 99px;
        height: 48px;
    }
</style>
