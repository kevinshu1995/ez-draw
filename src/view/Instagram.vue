<script setup lang="ts">
import { useUser } from "src/store/user";
import IgOAuthButton from "src/components/button/IgOAuthButton.vue";
import IgMediaList from "src/components/ig/mediaList/MediaList.vue";
const storeUser = useUser();
</script>

<template>
    <div class="container mx-auto px-4">
        <div>
            <RouterLink to="/" class="link"> Home </RouterLink>
        </div>
        <IgOAuthButton v-if="!storeUser.isAbleToAccessIg" />
        <IgMediaList v-if="storeUser.isAbleToAccessIg" />
    </div>
</template>

