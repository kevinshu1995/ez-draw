<script setup lang="ts">
import dayjs from "dayjs";
import { FBGetIGMediaAllComments } from "src/api/fb";
import type { FBGetIGMediasData } from "src/api/fb";

const props = defineProps<{
    post: FBGetIGMediasData | null;
}>();

async function getComments() {
    if (props.post && props.post.timestamp) {
        const res = await FBGetIGMediaAllComments({ igMediaId: props.post.id, since: props.post.timestamp, until: dayjs().toISOString() });
        console.log(res);
        return;
    }
    console.log("props.post is null");
}
</script>

<template>
    <div>
        <button @click="getComments">get comments</button>
    </div>
</template>

