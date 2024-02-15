import { ref, reactive, computed } from "vue";
import type { PaginationApi } from "src/api/fb";

type PageData = any[];

export type ArgsPaging = {
    since?: string | null;
    until?: string | null;
    before?: string | null;
    after?: string | null;
    limit?: number | null;
};

type PagingParams = {
    before: string | null;
    after: string | null;
    since: string | null;
    until: string | null;
};

export const usePaging = ({ limit, fnFetchPaging }: { limit?: null | number; fnFetchPaging: PaginationApi<any, any> }) => {
    const apiData = ref<PageData | null>(null);
    const fullDataList = ref<PageData>([]);
    const pagingParams: PagingParams = reactive({
        before: null,
        after: null,
        since: null, // TODO
        until: null, // TODO
    });
    // states
    const isFetching = ref(false);
    const hasFetchedBefore = ref(false);
    const hasNext = computed(() => hasFetchedBefore.value === true && pagingParams.after !== null);
    const hasPrev = computed(() => hasFetchedBefore.value === true && pagingParams.before !== null);

    async function privateFetchIgMedia({ before = null, after = null, until = null, since = null }: ArgsPaging) {
        if (isFetching.value) return;
        isFetching.value = true;
        const { data } = await fnFetchPaging({
            before,
            after,
            limit,
            until,
            since,
        });
        hasFetchedBefore.value = true;
        isFetching.value = false;

        if (data?.data && Array.isArray(data.data)) {
            apiData.value = data.data;

            if (!before && !after) {
                fullDataList.value.push(...data.data);
                pagingParams.before = data?.paging?.cursors?.before ?? null;
                pagingParams.after = data?.paging?.cursors?.after ?? null;
            }
            if (before) {
                fullDataList.value.unshift(...data.data);
                pagingParams.before = data?.paging?.cursors?.before ?? null;
            }
            if (after) {
                fullDataList.value.push(...data.data);
                pagingParams.after = data?.paging?.cursors?.after ?? null;
            }
        }
    }

    function fetchData({ before = null, after = null, until = null, since = null }) {
        pagingParams.before = null;
        pagingParams.after = null;
        pagingParams.since = null;
        pagingParams.until = null;
        apiData.value = null;
        fullDataList.value = [];
        return privateFetchIgMedia({
            before,
            after,
            until,
            since,
        });
    }

    function fetchNextData() {
        if (!pagingParams?.after) {
            return null;
        }
        return privateFetchIgMedia({ after: pagingParams.after });
    }

    return { fullDataList, pagingParams, hasNext, hasPrev, isFetching, hasFetchedBefore, fetchData, fetchNextData };
};

