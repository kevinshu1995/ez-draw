import { ref, reactive, computed } from "vue";
import API_IG from "src/api/ig";
import type { GetUserMediaData, MediaData } from "src/api/ig";
import { useUser } from "src/store/user";

interface MediaPaging {
    before: string | null;
    after: string | null;
    since: string | null;
    until: string | null;
}

interface ParamsFetchIgMedia {
    before?: null | string;
    after?: null | string;
    until?: null | string;
    since?: null | string;
}

export const useIgMedia = ({ limit = null }: { limit?: null | number }) => {
    const storeUser = useUser();
    const igToken = computed(() => storeUser.igToken);
    const igId = computed(() => storeUser.igInfo.id);

    const apiDataMedia = ref<GetUserMediaData | null>(null);
    const mediaList = ref<MediaData[]>([]);
    const mediaPaging: MediaPaging = reactive({
        before: null,
        after: null,
        since: null, // TODO
        until: null, // TODO
    });
    // states
    const isFetching = ref(false);
    const hasFetchedBefore = ref(false);
    const hasNext = computed(() => hasFetchedBefore.value === true && mediaPaging.after !== null);
    const hasPrev = computed(() => hasFetchedBefore.value === true && mediaPaging.before !== null);

    async function privateFetchIgMedia({ before = null, after = null, until = null, since = null }: ParamsFetchIgMedia) {
        if (isFetching.value) return;
        if (!igToken.value || !igId.value) {
            return;
        }
        isFetching.value = true;
        const { data } = await API_IG.getUserMedia({
            token: igToken.value,
            userId: igId.value,
            before,
            after,
            limit,
            until,
            since,
        });
        hasFetchedBefore.value = true;
        isFetching.value = false;

        if (data && Array.isArray(data.data)) {
            apiDataMedia.value = data;

            if (!before && !after) {
                mediaList.value.push(...data.data);
                mediaPaging.before = data?.paging?.cursors?.before ?? null;
                mediaPaging.after = data?.paging?.cursors?.after ?? null;
            }
            if (before) {
                mediaList.value.unshift(...data.data);
                mediaPaging.before = data?.paging?.cursors?.before ?? null;
            }
            if (after) {
                mediaList.value.push(...data.data);
                mediaPaging.after = data?.paging?.cursors?.after ?? null;
            }
            console.log({ media: data });
        }
    }

    function fetchIgMedia({ before = null, after = null, until = null, since = null }: ParamsFetchIgMedia) {
        mediaPaging.before = null;
        mediaPaging.after = null;
        mediaPaging.since = null;
        mediaPaging.until = null;
        apiDataMedia.value = null;
        mediaList.value = [];
        return privateFetchIgMedia({
            before,
            after,
            until,
            since,
        });
    }

    function fetchMediaNext() {
        if (!mediaPaging?.after) {
            return null;
        }
        return privateFetchIgMedia({ after: mediaPaging.after });
    }

    return { mediaList, mediaPaging, hasNext, hasPrev, isFetching, hasFetchedBefore, fetchIgMedia, fetchMediaNext };
};

