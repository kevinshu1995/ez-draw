import { defineStore, storeToRefs } from "pinia";
import { watch, onMounted } from "vue";
import { useSessionStorage } from "@vueuse/core";

import { useIg } from "./ig";
import { useFb } from "./fb";

type Token = string;

type IgId = string;

interface StorageUser {
    ig: {
        token: Token | null;
        id: IgId | null;
    };
}

const initUserData: StorageUser = {
    ig: {
        token: null,
        id: null,
    },
};

export const useUser = defineStore("user", () => {
    const userStorage = useSessionStorage("user", initUserData, { deep: true });
    const storeIg = useIg();
    const storeFb = useFb();
    const { token: igToken, info: igInfo, isAbleToAccessIg } = storeToRefs(storeIg);
    const { info: fbInfo, isAbleToAccessFb } = storeToRefs(storeFb);

    onMounted(async () => {
        igToken.value = userStorage.value.ig.token;
        igInfo.value.id = userStorage.value.ig.id;

        if (igToken.value && igInfo.value.id) {
            await storeIg.setupIgInfo({ token: igToken.value, id: igInfo.value.id });
        }
    });

    watch([igToken, igInfo], () => {
        userStorage.value.ig.token = igToken.value;
        userStorage.value.ig.id = igInfo.value.id;
    });

    return {
        igToken,
        igInfo,
        isAbleToAccessIg,
        setupIgInfo: storeIg.setupIgInfo,
        goGetIgOAuth: storeIg.goGetIgOAuth,
        resetIg: storeIg.resetIg,
        //
        fbInfo,
        isAbleToAccessFb,
        setupFbInfo: storeFb.setupFbInfo,
        goGetFbOAuth: storeFb.goGetFbOAuth,
        resetFb: storeFb.resetFb,
    };
});

