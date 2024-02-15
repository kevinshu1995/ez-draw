import type { UseStepperReturn } from "@vueuse/core";

type StepNames = "oauth" | "account" | "post" | "settings" | "draw";

export type InstagramStep = {
    [StepName in StepNames]: {
        name: string;
        title: string;
        iconText?: string;
        next: StepNames | null;
        prev: StepNames | null;
        displayNext: boolean;
        displayPrev: boolean;
    };
};

export type InstagramStepperReturn = UseStepperReturn<Exclude<keyof InstagramStep, symbol>, InstagramStep, InstagramStep[keyof InstagramStep]>;

