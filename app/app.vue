<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>
<script setup lang="js">
  const colorMode = useColorMode();
  colorMode.preference = 'dark';
</script>
