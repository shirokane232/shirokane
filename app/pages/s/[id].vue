<template>
  <div></div>
</template>
<script setup lang="ts">
  import { SHORT_URLS } from '~/constant/menu';

  definePageMeta({
    layout: false,
  });
  const route = useRoute();
  const paths = route.path.split('/');
  const code = paths[paths.length - 1];
  if (code && SHORT_URLS[code]) {
    navigateTo(SHORT_URLS[code]);
  } else {
    navigateTo('/');
  }
</script>
