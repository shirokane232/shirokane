<template>
  <div class="space-y-4">
    <div class="w-full">
      <div
        class="flex cursor-pointer items-center justify-between py-2 font-bold"
        @click="toggleCollapse"
      >
        <div class="flex items-center gap-2">
          <div>{{ $t(props.name) }}</div>
        </div>
        <Icon
          name="material-symbols-light:chevron-right-rounded"
          :class="{ 'rotate-90': isExpanded }"
        />
      </div>
      <div class="overflow-hidden">
        <div
          :class="{
            hidden: !isExpanded,
          }"
        >
          <a
            v-for="item in props.items"
            :key="item"
            :href="`${config.app.baseURL}${props.name}/${item}`"
          >
            <div
              class="hover:bg-accent/80 cursor-pointer rounded px-2 py-1"
              :class="{
                'bg-accent': props.selected === item,
              }"
            >
              {{ $t(item) }}
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    name: string;
    icon: string;
    items: string[];
    isExpanded?: boolean;
    selected?: string;
  }
  const props = defineProps<Props>();
  const isExpanded = ref(props.isExpanded);
  const toggleCollapse = () => {
    isExpanded.value = !isExpanded.value;
  };
  const config = useRuntimeConfig();
</script>
