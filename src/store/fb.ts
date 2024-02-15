import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { FBGetMe, FBGetIGMedias, FBGetAccounts, FBSubscribe, FBGetLoginStatus, FbPopupOAuth, FbLogout } from "src/api/fb";
import type { Me, ArgsPaging, ArgsFBGetIGMedias } from "src/api/fb";
import { useScriptTag } from "@vueuse/core";
import CONFIG from "src/configs";
// import { useToast } from "src/composables/useInject";

interface FbInfo {
    id: Me["id"] | null;
    name: Me["name"] | null;
    first_name: Me["first_name"] | null;
    last_name: Me["last_name"] | null;
    picture: Me["picture"] | null;

    email: Me["email"] | null;
}

export const useFb = defineStore("fb", () => {
    useScriptTag("https://connect.facebook.net/zh_TW/sdk.js", () => {
        FB.init({
            appId: import.meta.env.VITE_FACEBOOK_APP_ID,
            cookie: true,
            status: true,
            version: CONFIG.facebook.sdkVersion,
        });
        FBGetLoginStatus(handleLoginStatusResponse);
        FBSubscribe("auth.statusChange", handleLoginStatusResponse);
    });
    const router = useRouter();
    // const toast = useToast();

    // Axios.AxiosGraphInstagram.interceptors.response.use(
    //     function (response) {
    //         return response;
    //     },
    //     function (error) {
    //         const status = error?.response?.status;
    //         const code = error?.response?.data?.error?.code;
    //         const subCode = error?.response?.data?.error?.error_subcode;
    //         if (status === 400) {
    //             if (code === 100 && !subCode) {
    //                 console.error("[AxiosGraphInstagram error: dev fault] Tried accessing nonexisting field FIELD_NAME on node type NODE_NAME");
    //             }
    //             if (code === 100 && subCode === 33) {
    //                 console.error(
    //                     "[AxiosGraphInstagram error: dev fault] Unsupported get request. Object with ID OBJECT_ID does not exist, cannot be loaded due to missing permissions, or does not support this operation"
    //                 );
    //             }
    //             if (code === 190) {
    //                 console.error("[AxiosGraphInstagram error] Invalid Oauth Access Token. (token expired)");
    //                 toast.addNewToast({
    //                     status: "error",
    //                     message: "🙁 權限過期，請重新驗證 Instagram",
    //                 });
    //                 resetIg();
    //                 return Promise.reject(error);
    //             }
    //         }
    //         if (status === 403) {
    //             if (code === 4 && subCode === 1349210) {
    //                 console.error("[AxiosGraphInstagram error] Rate limit exceeded: You are hitting rate limits on the node that you are attempting to fetch. Please wait and try again later.");
    //                 toast.addNewToast({
    //                     status: "error",
    //                     message: "🥲 很抱歉，目前暫時無法使用 Instagram 相關功能，請稍候再嘗試。",
    //                 });
    //                 resetIg();
    //                 return Promise.reject(error);
    //             }
    //             if (code === 10) {
    //                 console.error("[AxiosGraphInstagram error: dev fault] Application does not have permission for this action");
    //             }
    //             if (code === 200) {
    //                 console.error("[AxiosGraphInstagram error: dev fault] Permission Error");
    //             }
    //         }
    //         toast.addNewToast({
    //             status: "error",
    //             message: "😔 很抱歉，出現不可預期的錯誤，請稍候再嘗試。",
    //         });
    //         return Promise.reject(error);
    //     }
    // );

    const info = reactive<FbInfo>({
        id: null,
        name: null,
        first_name: null,
        last_name: null,
        picture: null,
        email: null,
    });

    const isAbleToAccessFb = ref(false);

    async function goGetFbOAuth() {
        if (isAbleToAccessFb.value) {
            await setupFbInfo();
            router.push({ name: "Instagram" });
            return;
        }
        FbPopupOAuth(response => {
            console.log("oauth response: ", response);
        });
    }

    async function setupFbInfo() {
        if (isAbleToAccessFb.value === false) {
            return { ok: false };
        }
        const { data } = await FBGetMe();
        if (data) {
            info.name = data.name ?? null;
            info.first_name = data.first_name ?? null;
            info.last_name = data.last_name ?? null;
            info.picture = data.picture ?? null;
            info.email = data.email ?? null;
        }
    }

    function handleLoginStatusResponse({ status, authResponse }: fb.StatusResponse) {
        console.log({ status, authResponse });
        if (status === "connected") {
            isAbleToAccessFb.value = true;
            const { accessToken, userID } = authResponse;
            info.id = userID;

            setupFbInfo();
            return;
        }
        if (status === "not_authorized") {
            isAbleToAccessFb.value = false;
            console.log("not_authorized: fb need auth");
            return;
        }
        if (status === "unknown") {
            isAbleToAccessFb.value = false;
            console.log("unknown: fb need auth");
            return;
        }
    }

    function getAccounts({ since, until, before, after, limit }: ArgsPaging) {
        return FBGetAccounts({ since, until, before, after, limit });
    }

    function getIGMedias({ igId, since, until, before, after, limit }: ArgsFBGetIGMedias) {
        return FBGetIGMedias({ igId, since, until, before, after, limit });
    }

    function logout() {
        FbLogout(response => {
            console.log(response);
            resetFb();
        });
    }

    function resetFb() {
        info.id = null;
        info.name = null;
        info.first_name = null;
        info.last_name = null;
        info.picture = null;
        info.email = null;
        router.push({ name: "Instagram" });
    }

    return { info, isAbleToAccessFb, setupFbInfo, goGetFbOAuth, resetFb, getFbAccounts: getAccounts, getIGMedias, fbLogout: logout };
});

