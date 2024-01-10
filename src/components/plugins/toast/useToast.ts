import { ref } from "vue";
import type { ToastList, ParamsNewToast } from "./type";

export default function useToast({ toastDisappearTime = 5000 }: { toastDisappearTime: number }) {
    const toasts = ref<ToastList[]>([]);
    const count = ref(0);

    const refToastDisappearTime = ref(toastDisappearTime);

    function addNewToast(toastDetail: ParamsNewToast) {
        const id = `${count.value}-${Date.now()}`;
        count.value += 1;
        toasts.value.unshift({ ...toastDetail, id });
        setTimeout(() => {
            const targetToastIndex = toasts.value.findIndex(toast => toast.id === id);
            toasts.value.splice(targetToastIndex, 1);
        }, refToastDisappearTime.value);
    }

    return { toasts, addNewToast, toastDisappearTime: refToastDisappearTime };
}

