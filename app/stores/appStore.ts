// stores/appStore.ts
import { defineStore } from 'pinia';

const TopicMenus = {
  topic_automation: ['auto_update_threads_api_token'],
  others: ['test1'],
} as Record<string, string[]>;

export const useAppStore = defineStore('app', {
  state: () => {
    const topic = Object.keys(TopicMenus)[0]!;
    const menu = TopicMenus[topic]![0]!;
    return {
      selectedTopic: topic,
      selectedMenu: menu,
    };
  },
  actions: {
    select(topic: string, menu: string) {
      this.selectedTopic = topic;
      this.selectedMenu = menu;
    },
  },
});
