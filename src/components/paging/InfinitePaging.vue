<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePaging } from "src/composables/usePaging";
import type { PaginationApi } from "src/api/fb";
import { useInfiniteScroll } from "@vueuse/core";
import type { ArgsPaging } from "src/api/fb";

interface ArgsFnFetchPaging extends ArgsPaging {
    [key: string]: any;
}

type Props = {
    limit: number;
    fnFetchPaging: PaginationApi<any, any, ArgsFnFetchPaging>;
    height: string;
    columns: number;
};

const props = defineProps<Props>();

const {
    fullDataList,
    // pagingParams,
    hasNext,
    //hasPrev,
    isFetching,
    hasFetchedBefore,
    fetchData,
    fetchNextData,
} = usePaging({ limit: props.limit, fnFetchPaging: props.fnFetchPaging });

const elInfiniteScroll = ref(null);

useInfiniteScroll(
    elInfiniteScroll,
    () => {
        if (hasNext.value) {
            fetchNextData();
        }
    },
    { distance: 100 }
);

onMounted(async () => {
    await fetchData({});
});
</script>

<template>
    <ul class="grid overflow-auto overscroll-none content-start" :style="{ height: props.height, 'grid-template-columns': `repeat(${props.columns}, minmax(0, 1fr))` }" ref="elInfiniteScroll">
        <li v-for="(data, index) in fullDataList" :key="index">
            <slot name="content" :data="data" />
        </li>
        <li class="py-8 flex flex-col items-center justify-center text-base" :style="{ 'grid-column': `span ${props.columns} / span ${props.columns}` }" v-show="isFetching">
            <SvgIcon name="loader" class="animate-spin w-7 h-7" />
        </li>

        <li class="col-span-3 py-8 flex flex-col items-center justify-center gap-4" v-show="fullDataList.length === 0 && hasFetchedBefore">
            <slot name="empty" />
        </li>
    </ul>
</template>

