<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import API_IG from "src/api/ig";
import { useUser } from "src/store/user";

const route = useRoute();
const router = useRouter();
const user = useUser();

onMounted(async () => {
    const query = route.query;
    const action = route.params?.action;

    console.log({ query, action });
    if (action === "ig") {
        if (query?.code && typeof query?.code === "string") {
            const code = query.code.replace("#_", "");
            const { data, error, message } = await API_IG.getAccessToken({ code });
            if (error) {
                console.error({ error, message });
            }

            if (data) {
                await user.setupIgInfo({ token: data.access_token, id: data.user_id });
                router.push({ name: "Instagram" });
                return;
            }
            return;
        }

        // TODO 授權取消
    }
});
</script>

<template>
    <div>
        <routerLink to="/">Home</routerLink>
    </div>
</template>

