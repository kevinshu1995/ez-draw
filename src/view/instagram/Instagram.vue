<script setup lang="ts">
import { watch, provide, ref, reactive, computed } from "vue";
import { useFb } from "src/store/fb";
import { useStepper } from "@vueuse/core";
import BaseStep from "src/components/step/BaseStep.vue";
import StepAccount from "./components/StepAccount.vue";
import StepPosts from "./components/StepPosts.vue";
import StepOauth from "./components/StepOauth.vue";
import StepDraw from "./components/StepDraw.vue";
import { InstagramStep } from "./type";
import { InstagramStepperSymbol } from "./symbol";
import { useToast } from "src/composables/useInject";
import type { FBGetAccountsData, FBGetIGMediasData } from "src/api/fb";

const toast = useToast();
const storeFb = useFb();

const initStep: InstagramStep = {
    oauth: {
        name: "oauth",
        title: "驗證",
        iconText: "a",
        next: "account",
        prev: null,
        displayPrev: false,
        displayNext: false,
    },
    account: {
        name: "account",
        title: "選擇帳號",
        next: "post",
        prev: "oauth",
        displayPrev: true,
        displayNext: true,
    },
    post: {
        name: "post",
        title: "選擇貼文",
        next: "settings",
        prev: "account",
        displayPrev: true,
        displayNext: true,
    },
    settings: {
        name: "settings",
        title: "抽獎設定",
        next: "draw",
        prev: "post",
        displayPrev: true,
        displayNext: true,
    },
    draw: {
        name: "draw",
        title: "抽獎",
        iconText: "★",
        next: null,
        prev: "settings",
        displayPrev: true,
        displayNext: false,
    },
};

const instagramStepper = useStepper(initStep);
const currentSelectedPage = ref<FBGetAccountsData | null>(null);
const currentSelectedPost = ref<FBGetIGMediasData | null>(null);
const { steps, index: currentStepIndex, current, goTo } = instagramStepper;
provide(InstagramStepperSymbol, instagramStepper);

type ActionBtns = {
    prev: {
        text: {
            default: string;
            [key: string]: string;
        };
    };
    next: {
        text: {
            default: string;
            [key: string]: string;
        };
    };
};

const actionBtns = reactive<ActionBtns>({
    prev: {
        text: {
            default: "上一步",
        },
    },
    next: {
        text: {
            default: "下一步",
            post: "選擇此貼文",
        },
    },
});

const actionBtnPrevText = computed(() => {
    const currentStep = current.value.name;
    return actionBtns.prev.text?.[currentStep] ?? actionBtns.prev.text.default;
});

const actionBtnNextText = computed(() => {
    const currentStep = current.value.name;
    return actionBtns.next.text?.[currentStep] ?? actionBtns.next.text.default;
});

const canGoNext = ref(false);

function tryGoToNext() {
    if (canGoNext.value === false) {
        toast.addNewToast({
            message: "尚未完成當前步驟",
            status: "warn",
        });
        return;
    }
    if (current.value.next !== null) {
        goTo(current.value.next);
    }
}

function tryGoToPrev() {
    if (current.value.prev !== null) {
        goTo(current.value.prev);
    }

    if (current.value.name === "oauth" && storeFb.isAbleToAccessFb) {
        storeFb.fbLogout();
    }
}

function onSelectPage(page: FBGetAccountsData | null) {
    currentSelectedPage.value = page;
}

function onChangeFulfillState(step: keyof typeof initStep, isFulfill: boolean) {
    if (step === current.value.name) {
        canGoNext.value = isFulfill;
    }
}

watch(
    () => storeFb.isAbleToAccessFb,
    val => {
        if (val === false) {
            goTo("oauth");
        }
        if (val === true) {
            goTo("account");
        }
    }
);

watch(
    current,
    (now, old) => {
        canGoNext.value = false;

        const currentStep = now?.name || null;
        const prevStep = old?.name ?? null;
        console.log({ currentStep, prevStep });

        // first coming
        if (prevStep === null) {
            if (currentSelectedPage.value !== null) {
                goTo("post");
                return;
            }
            if (storeFb.isAbleToAccessFb) {
                goTo("account");
                return;
            }
        }

        if (currentStep === null || ["oauth", "account"].includes(currentStep)) {
            currentSelectedPost.value = null;
        }

        // triggered go prev
    },
    { immediate: true }
);
</script>

<template>
    <div class="flex items-center justify-center min-h-75vh">
        <div class="grid md:grid-cols-2 items-center gap-12">
            <div class="flex flex-col justify-center items-center gap-16 min-h-[80vh]">
                <div class="space-y-4">
                    <div class="space-y-4 text-center">
                        <h1 class="text-primary text-4xl font-bold">Instagram 抽獎</h1>
                        <p>四個步驟，選擇一則 Instagram 貼文後，五分鐘完成抽獎！</p>
                    </div>

                    <BaseStep :steps="Object.values(steps)" :current-step="currentStepIndex" />
                </div>

                <div v-if="storeFb.isAbleToAccessFb" class="flex flex-col gap-4 w-full">
                    <div class="flex flex-col gap-4">
                        <div class="flex items-start gap-4">
                            <div class="flex items-center gap-2">
                                <SvgIcon name="facebook" class="w-6 h-6" />
                                <h3>登入帳號</h3>
                            </div>
                            <div>
                                <p class="font-bold">{{ storeFb.info.name }}</p>
                                <p class="text-sm text-base-content/50">{{ storeFb.info.email }}</p>
                            </div>
                        </div>
                        <div :class="['flex items-start gap-4', !currentSelectedPage && 'opacity-30']">
                            <div class="flex items-center gap-2">
                                <SvgIcon name="instagram" class="w-5 h-5 mr-1" />
                                <h3>抽獎帳號</h3>
                            </div>
                            <a
                                v-if="currentSelectedPage?.instagram_business_account"
                                class="flex items-center gap-2 btn normal-case"
                                :href="`https://www.instagram.com/${currentSelectedPage?.instagram_business_account?.username}`"
                            >
                                <img
                                    class="w-6 h-6 rounded-full"
                                    :src="currentSelectedPage?.instagram_business_account?.profile_picture_url"
                                    :alt="currentSelectedPage?.instagram_business_account?.username"
                                />
                                <p class="text-sm text-base-content/50">{{ currentSelectedPage?.instagram_business_account?.username }}</p>
                            </a>
                            <p v-else>未選擇</p>
                        </div>
                        <div :class="['flex items-start gap-4', currentSelectedPost || 'opacity-30']">
                            <div class="flex items-center gap-2">
                                <SvgIcon name="feed" class="w-5 h-5 mr-1" />
                                <h3>抽獎貼文</h3>
                            </div>
                            <a v-if="currentSelectedPost" :href="currentSelectedPost.permalink" target="_blank" class="btn h-auto py-4">
                                <div class="flex flex-col gap-4 max-w-[200px] items-center normal-case">
                                    <img class="size-30 object-cover rounded-2xl" :src="currentSelectedPost.thumbnail_url || currentSelectedPost.media_url" alt="" />
                                    <p class="text-xs text-base-content/50 line-clamp-2">
                                        <span v-if="currentSelectedPost.caption">{{ currentSelectedPost.caption }}</span>
                                        <span v-else class="flex items-center gap-1">
                                            <SvgIcon name="information-circle-solid" class="h-5 w-5" />
                                            <span>內文為空</span>
                                        </span>
                                    </p>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="divider my-1"></div>
                    <div class="flex justify-end">
                        <button class="btn btn-ghost" @click="storeFb.fbLogout">登出</button>
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 border border-base-content/5 shadow-xl">
                <div class="card-body">
                    <template v-if="current.name === 'oauth'">
                        <StepOauth />
                    </template>
                    <template v-if="current.name === 'account'">
                        <StepAccount @onChangeFulfillState="onChangeFulfillState('account', $event)" @onSelectPage="onSelectPage" />
                    </template>
                    <template v-if="current.name === 'post'">
                        <StepPosts @onChangeFulfillState="onChangeFulfillState('post', $event)" :page="currentSelectedPage" v-model:post="currentSelectedPost" />
                    </template>
                    <template v-if="current.name === 'settings'">
                        <StepDraw :post="currentSelectedPost" />
                    </template>
                    <div class="card-actions justify-end">
                        <button class="btn btn-outline btn-primary" v-show="current.displayPrev" @click="tryGoToPrev">{{ actionBtnPrevText }}</button>
                        <button :class="['btn btn-primary', !canGoNext && 'btn-disabled']" v-show="current.displayNext" @click="tryGoToNext">{{ actionBtnNextText }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

