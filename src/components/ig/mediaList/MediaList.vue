<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useIgMedia } from "./useIgMedia";
import type { MediaData } from "src/api/ig";
import { useInfiniteScroll } from "@vueuse/core";

const { mediaList, isFetching, hasNext, fetchIgMedia, fetchMediaNext } = useIgMedia({ limit: 30 });

const elInfiniteScroll = ref(null);

useInfiniteScroll(
    elInfiniteScroll,
    () => {
        if (hasNext.value) {
            fetchMediaNext();
        }
    },
    { distance: 100 }
);

function img(media: MediaData) {
    if (media.media_type === "IMAGE") {
        return {
            src: media.media_url,
        };
    }
    if (media.media_type === "CAROUSEL_ALBUM") {
        return {
            src: media.media_url,
        };
    }
    if (media.media_type === "VIDEO") {
        return {
            src: media.thumbnail_url,
        };
    }
    return {
        src: "",
    };
}

onMounted(async () => {
    await fetchIgMedia({});
});
</script>

<template>
    <div>
        <div class="flex justify-center">
            <ul class="grid grid-cols-3 gap-1 h-[50vh] overflow-auto" ref="elInfiniteScroll">
                <li v-for="media in mediaList" :key="media.id">
                    <div class="flex">
                        <img class="aspect-square object-cover w-full" :src="img(media).src" />
                        <!-- <p v-html="media.caption"></p> -->
                    </div>
                </li>
                <li class="col-span-3 py-8 gap-2 flex flex-col items-center justify-center text-base" v-show="isFetching">
                    <SvgIcon name="loader" class="animate-spin w-7 h-7" />
                </li>

                <li class="col-span-3 py-8 flex flex-col items-center justify-center gap-4" v-show="mediaList.length === 0">
                    <span>這個帳號沒有任何貼文</span>
                    <SvgIcon name="mood-empty" class="w-7 h-7" />
                </li>
            </ul>
        </div>
    </div>
</template>

