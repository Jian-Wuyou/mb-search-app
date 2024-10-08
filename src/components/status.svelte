<script>
    export let content;
    export let acct_name;
</script>

<div class="post">
    <div class="post-header">
        <strong>@{acct_name}</strong>
    </div>
    <div class="post-content">
        <p>{@html content}</p>
    </div>
</div>

<style>
    .post {
        display: flex;
        flex-direction: column;  /* Ensure vertical stacking of elements */
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 1rem;
        background-color: #f9f9f9;
        width: 100%;
        box-sizing: border-box;
    }
    .post-header {
        font-weight: bold;
        margin-bottom: 0.5rem;
    }
    .post-content {
        color: #333;
    }
</style>
