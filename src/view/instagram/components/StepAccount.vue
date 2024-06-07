<script setup lang="ts">
import { ref, computed, watch } from "vue";
import InfinitePaging from "src/components/paging/InfinitePaging.vue";
import { useFb } from "src/store/fb";
import type { FBGetAccountsData } from "src/api/fb";

const storeFb = useFb();
const selectedPage = ref<FBGetAccountsData | null>(null);

const canGoNext = computed(() => {
    return selectedPage.value && selectedPage.value.instagram_business_account;
});

const emit = defineEmits(["onChangeFulfillState", "onSelectPage"]);

watch(canGoNext, val => {
    emit("onChangeFulfillState", !!val);
});

watch(selectedPage, () => {
    emit("onSelectPage", selectedPage.value);
});
</script>

<template>
    <div class="space-y-4">
        <div class="space-y-1">
            <h2 class="font-bold text-lg">選擇 Instagram 帳號</h2>
            <p class="text-sm link">找不到我的帳號？</p>
        </div>
        <InfinitePaging :limit="30" :fnFetchPaging="storeFb.getFbAccounts" :height="`300px`" :columns="1" class="gap-4">
            <template #content="{ data }">
                <div :class="['form-control p-6 rounded-xl border', selectedPage === data ? 'border-primary' : 'border-base-content/10']">
                    <label :class="['label p-0 gap-8', data.instagram_business_account && 'cursor-pointer']">
                        <input type="radio" :value="data" class="radio checked:bg-primary" v-model="selectedPage" :disabled="!data.instagram_business_account" />
                        <div :class="['label-text flex-grow', !data.instagram_business_account && 'opacity-70']">
                            <div class="flex flex-col justify-between">
                                <div class="space-y-1">
                                    <p>
                                        <span>Facebook 粉絲專頁</span>
                                    </p>
                                    <h3 class="font-bold text-lg">{{ data.name }}</h3>
                                </div>
                                <div class="divider my-1"></div>
                                <div class="space-y-2">
                                    <div class="flex items-center gap-2">
                                        <template v-if="data.instagram_business_account">
                                            <SvgIcon name="check-circle" class="w-4 h-4 text-success" />
                                            <p>已連結 Instagram 帳號</p>
                                        </template>
                                        <template v-else>
                                            <SvgIcon name="x-circle" class="w-4 h-4 text-error" />
                                            <p>未連結 Instagram 帳號</p>
                                        </template>
                                    </div>
                                    <template v-if="data.instagram_business_account">
                                        <div class="flex gap-4">
                                            <div class="flex items-center">
                                                <div class="avatar">
                                                    <div class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                        <img :src="data.instagram_business_account.profile_picture_url" alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="text-xs">
                                                <div class="flex items-center gap-2">
                                                    <h4 class="font-bold text-primary">@{{ data.instagram_business_account.username }}</h4>
                                                    <a class="btn btn-ghost btn-xs" :href="`https://www.instagram.com/${data.instagram_business_account.username}`" target="_blank">
                                                        <SvgIcon name="link" class="w-4 h-4" />
                                                    </a>
                                                </div>
                                                <div class="text-base-content/50">
                                                    <p>貼文: {{ data.instagram_business_account.media_count }}</p>
                                                    <p>追隨者: {{ data.instagram_business_account.followers_count }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </label>
                </div>
            </template>
            <template #empty>
                <div class="flex flex-col items-center justify-center">
                    <SvgIcon name="smile-no-mouth" class="w-6 h-6" />
                    <span>沒有</span>
                </div>
            </template>
        </InfinitePaging>
    </div>
</template>

