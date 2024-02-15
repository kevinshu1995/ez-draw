import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import API_IG from "src/api/ig";
import Axios from "src/lib/axios";
import { useToast } from "src/composables/useInject";

type Token = string;

type IgId = string;

interface IgInfo {
    id: IgId | null;
    account_type: null | "BUSINESS" | "MEDIA_CREATOR" | "PERSONAL";
    media_count: null | number;
    username: null | string;
}

export const useIg = defineStore("ig", () => {
    const router = useRouter();
    const toast = useToast();

    Axios.AxiosGraphInstagram.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            const status = error?.response?.status;
            const code = error?.response?.data?.error?.code;
            const subCode = error?.response?.data?.error?.error_subcode;
            if (status === 400) {
                if (code === 100 && !subCode) {
                    console.error("[AxiosGraphInstagram error: dev fault] Tried accessing nonexisting field FIELD_NAME on node type NODE_NAME");
                }
                if (code === 100 && subCode === 33) {
                    console.error(
                        "[AxiosGraphInstagram error: dev fault] Unsupported get request. Object with ID OBJECT_ID does not exist, cannot be loaded due to missing permissions, or does not support this operation"
                    );
                }
                if (code === 190) {
                    console.error("[AxiosGraphInstagram error] Invalid Oauth Access Token. (token expired)");
                    toast.addNewToast({
                        status: "error",
                        message: "🙁 權限過期，請重新驗證 Instagram",
                    });
                    resetIg();
                    return Promise.reject(error);
                }
            }
            if (status === 403) {
                if (code === 4 && subCode === 1349210) {
                    console.error("[AxiosGraphInstagram error] Rate limit exceeded: You are hitting rate limits on the node that you are attempting to fetch. Please wait and try again later.");
                    toast.addNewToast({
                        status: "error",
                        message: "🥲 很抱歉，目前暫時無法使用 Instagram 相關功能，請稍候再嘗試。",
                    });
                    resetIg();
                    return Promise.reject(error);
                }
                if (code === 10) {
                    console.error("[AxiosGraphInstagram error: dev fault] Application does not have permission for this action");
                }
                if (code === 200) {
                    console.error("[AxiosGraphInstagram error: dev fault] Permission Error");
                }
            }
            toast.addNewToast({
                status: "error",
                message: "😔 很抱歉，出現不可預期的錯誤，請稍候再嘗試。",
            });
            return Promise.reject(error);
        }
    );

    const igToken = ref<Token | null>(null);

    const info = reactive<IgInfo>({
        id: null,
        account_type: null,
        media_count: null,
        username: null,
    });

    const isAbleToAccessIg = computed(() => {
        return igToken.value !== null;
    });

    async function goGetIgOAuth() {
        if (igToken.value && info.id) {
            await setupIgInfo({ token: igToken.value, id: info.id });
            router.push({ name: "Instagram" });
            return;
        }
        API_IG.goGetIgOAuth();
    }

    async function setupIgInfo({ token: newToken, id }: { token: Token; id: IgId }) {
        if (!newToken || !id) {
            igToken.value = null;
            info.id = null;
            return { ok: false };
        }
        igToken.value = newToken;
        info.id = id;
        const { data } = await API_IG.getMeByUserId({ token: newToken, userId: id });

        if (data) {
            info.account_type = data?.account_type ?? null;
            info.media_count = data?.media_count ?? null;
            info.username = data?.username ?? null;
        }
    }

    function resetIg() {
        igToken.value = null;
        info.id = null;
        router.push({ name: "Instagram" });
    }

    return { token: igToken, info, isAbleToAccessIg, setupIgInfo, goGetIgOAuth, resetIg };
});

