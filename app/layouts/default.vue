<script setup lang="ts">
  import { LINKS, MENUS, SHORT_URLS_REVERSED, SUB_MENUS } from '~/constant/menu';
  const route = useRoute();
  const config = useRuntimeConfig();
  const splited = route.fullPath.replace(/^\/|\/$/g, '').split('/');
  const selectedMenu = splited.length === 2 ? splited[0] : '';
  const selectedSubMenu = splited.length === 2 ? splited[1] : '';
  const isDrawerOpen = ref(false);
  const nextLink = ref<string | undefined>(undefined);
  const prevLink = ref<string | undefined>(undefined);
  if (selectedMenu && selectedSubMenu) {
    const currentLink = `/${selectedMenu}/${selectedSubMenu}`;
    const pageIndex = LINKS.indexOf(currentLink);
    if (pageIndex != 0) {
      prevLink.value = `${config.app.baseURL}${LINKS[pageIndex - 1]}`.replace('//', '/');
    }
    if (pageIndex != LINKS.length - 1) {
      nextLink.value = `${config.app.baseURL}${LINKS[pageIndex + 1]}`.replace('//', '/');
    }
  }
  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value;
  };
  const hash = ref<string | undefined>(undefined);
  const shortUrl = ref('');
  onMounted(() => {
    console.log(route.path);
    hash.value = SHORT_URLS_REVERSED[route.path];
    if (hash.value) {
      const url = useRequestURL();
      shortUrl.value = `${url.origin}${config.app.baseURL}s/${hash.value}`;
    }
  });
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header
      class="sticky top-0 z-50 flex h-16 max-h-16 min-h-16 items-center justify-center border-b border-dashed"
    >
      <div
        class="grid h-full w-full max-w-[1400px] grid-cols-[auto_1fr_auto] items-center justify-center gap-6 border-x border-dashed px-4 xl:max-w-[calc(100vw-128px)]"
      >
        <div class="flex cursor-pointer items-center justify-center gap-3" @click="toggleDrawer">
          <icon name="gg:menu-round" class="mt-1 h-8 w-8" />
          <h1 class="font-serif text-3xl font-semibold">白金雜記</h1>
        </div>
        <!-- center -->
        <div></div>
        <!-- right -->
        <div>
          <ShadcnButton
            variant="ghost"
            @click="
              () => {
                copyToClipboard(shortUrl);
              }
            "
          >
            <Icon name="mdi:share-variant" /> {{ hash }}
          </ShadcnButton>
        </div>
      </div>
    </header>
    <div class="flex h-[calc(100vh-4rem)] justify-center">
      <div class="flex w-full max-w-[1400px] border-x border-dashed xl:max-w-[calc(100vw-128px)]">
        <!-- Sidebar -->
        <aside
          class="hide-scrollbar w-full overflow-y-auto border-r border-dashed"
          :class="{
            hidden: !isDrawerOpen,
          }"
        >
          <div class="w-full space-y-3 p-4">
            <AppSidebarItems
              v-for="item in MENUS"
              :key="item.name"
              :items="SUB_MENUS[item.name] as string[]"
              :name="item.name"
              :icon="item.name"
              :is-expanded="selectedMenu === item.name"
              :selected="selectedSubMenu"
            />
          </div>
        </aside>

        <main
          class="hide-scrollbar flex-1 overflow-y-auto"
          :class="{
            hidden: isDrawerOpen,
          }"
        >
          <div class="markdown flex1 space-y-6 p-6">
            <slot />
          </div>
          <div
            class="flex h-16 max-h-16 min-h-16 flex-row items-center justify-center gap-6 border-t"
          >
            <a v-if="prevLink" :href="prevLink">
              <ShadcnButton v-if="prevLink" variant="ghost"> Prev </ShadcnButton>
            </a>
            <a v-if="nextLink" :href="nextLink">
              <ShadcnButton v-if="nextLink" variant="ghost"> Next </ShadcnButton>
            </a>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
