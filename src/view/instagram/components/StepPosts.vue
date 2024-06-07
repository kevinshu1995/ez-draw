<script setup lang="ts">
import { watch } from "vue";
import InfinitePaging from "src/components/paging/InfinitePaging.vue";
import { useFb } from "src/store/fb";
import type { FBGetIGMediasData, FBGetAccountsData, ArgsPaging } from "src/api/fb";
import dayjs from "src/lib/dayjs";

const storeFb = useFb();
const props = defineProps<{
    page: FBGetAccountsData | null;
    post: FBGetIGMediasData | null;
}>();

function fetchMedia(options: ArgsPaging) {
    const igId = props.page?.instagram_business_account?.id ?? "";
    return storeFb.getIGMedias({ igId, ...options });
}

const emit = defineEmits(["update:post", "onChangeFulfillState"]);

watch(
    () => props.post,
    val => {
        emit("onChangeFulfillState", val !== null);
    }
);

function img(media: FBGetIGMediasData) {
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

function selectPost(post: FBGetIGMediasData | null) {
    emit("update:post", post);
}
</script>

<template>
    <div class="space-y-4">
        <div class="space-y-1">
            <h2 class="font-bold text-lg">選擇一篇貼文</h2>
            <!-- <p class="text-sm link">找不到我的帳號？</p> -->
        </div>
        <div class="relative max-w-[400px]">
            <Transition
                enter-from-class="opacity-0 -translate-x-8"
                enter-to-class="opacity-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0 -translate-x-8"
                enter-active-class="transition-all"
                leave-active-class="transition-all absolute inset-0 size-full"
            >
                <InfinitePaging v-if="props.page" v-show="!props.post" :limit="9" :fnFetchPaging="fetchMedia" :height="`60vh`" :columns="3" class="gap-1">
                    <template #content="{ data }">
                        <button class="border-3 border-transparent hover:border-primary rounded-lg overflow-hidden" @click="selectPost(data)">
                            <img class="aspect-square object-cover w-full" :src="img(data).src" />
                        </button>
                    </template>
                    <template #empty>
                        <div class="flex flex-col items-center justify-center">
                            <span>這個帳號沒有任何貼文</span>
                            <SvgIcon name="smile-no-mouth" class="w-6 h-6" />
                        </div>
                    </template>
                </InfinitePaging>
            </Transition>

            <Transition
                enter-from-class="opacity-0 -translate-x-8"
                enter-to-class="opacity-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0 -translate-x-8"
                enter-active-class="transition-all"
                leave-active-class="transition-all absolute inset-0 size-full"
            >
                <div v-if="props.post">
                    <div class="flex items-center flex-wrap p-2 sticky top-0 w-full">
                        <button class="btn btn-ghost btn-sm" @click="selectPost(null)">
                            <SvgIcon name="chevron-left" class="w-4 h-4" />
                            <span class="sr-only lg:not-sr-only"> 返回列表 </span>
                        </button>
                        <div class="flex-1 justify-center flex-grow">
                            <h3 class="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 font-bold max-w-35 truncate" :title="props.post.username">{{ props.post.username }}</h3>
                        </div>
                    </div>
                    <div class="space-y-2 max-h-60vh overflow-auto">
                        <div class="group relative overflow-hidden rounded-lg">
                            <img class="aspect-square object-cover w-full" :src="img(props.post).src" />
                            <a
                                :class="[
                                    'group-hover:opacity-100 group-hover:bg-opacity-70 opacity-0 bg-opacity-0 bg-base-100 transition',
                                    'absolute z-2 inset-0 size-full',
                                    'flex items-center justify-center',
                                ]"
                                :href="props.post.permalink"
                            >
                                <div class="flex items-center gap-2">
                                    <SvgIcon name="link" class="w-4 h-4" />
                                    <span> 前往 Instagram 查看 </span>
                                </div>
                            </a>
                            <div v-show="props.post.media_type !== 'IMAGE'" :class="['absolute z-1 inset-0 size-full', 'flex items-end justify-end', 'text-opacity-70 text-xs p-1 tracking-wider']">
                                <SvgIcon name="movie" class="w-4 h-4" />
                            </div>
                            <div v-show="props.post.media_type === 'IMAGE'" :class="['absolute z-1 inset-0 size-full', 'flex items-end justify-end', 'text-opacity-70 text-xs p-1 tracking-wider']">
                                <SvgIcon name="photo" class="w-4 h-4" />
                            </div>
                        </div>
                        <div class="flex flex-col gap-2 py-4">
                            <p>{{ props.post.caption }}</p>
                            <p class="text-sm text-right opacity-50">{{ dayjs(props.post.timestamp).format("YYYY/MM/DD HH:mm") }}</p>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

