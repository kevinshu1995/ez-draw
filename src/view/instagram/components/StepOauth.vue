<template>
    <div class="flex flex-col items-center gap-4" v-if="!storeFb.isAbleToAccessFb">
        <FbOAuthButton class="btn-outline py-3 px-12 h-auto flex items-center">
            <div class="rounded-lg">
                <SvgIcon name="facebook" class="w-8 h-8" />
            </div>
            <p>前往驗證</p>
        </FbOAuthButton>
        <ul class="text-sm text-base-content">
            <li>
                <button class="flex items-center gap-2 tooltip tooltip-secondary tooltip-bottom" data-tip="沒有您的驗證，將無法使用抽獎功能" @click="openInfoAlert">
                    <SvgIcon name="information-circle" class="w-4 h-4" />
                    <p>為什麼要驗證？</p>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useFb } from "src/store/fb";
import FbOAuthButton from "src/components/button/FbOAuthButton.vue";
import { useAlert } from "src/composables/useInject";

const storeFb = useFb();
const alert = useAlert();

function openInfoAlert() {
    alert.openAlert({
        title: "為什麼需要驗證？",
        message: `<div class='text-left space-y-2'>
                <p>按下授權按鈕後，您將會透過 Facebook 登入，登入成功後會顯示您將授予本站的權限，若您不同意，將無法使用本站的 Instagram 抽獎功能。</p>
                <p>驗證功能為 Meta 官方提供之功能，取得之資料將只會用於抽獎功能，請放心使用。</p>
            </div>`,
    });
}
</script>

