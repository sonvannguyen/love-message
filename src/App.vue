<script setup lang="ts">
import { ref } from 'vue';
import MessageInput from './components/MessageInput.vue';
import PresentationMode from './components/PresentationMode.vue';

const showPresentation = ref(false);
const messages = ref<string[]>([]);

const startPresentation = () => {
  if (messages.value.length > 0) {
    showPresentation.value = true;
  }
};

const exitPresentation = () => {
  showPresentation.value = false;
};

const addMessage = (message: string) => {
  if (message.trim()) {
    messages.value.push(message);
  }
};
</script>

<template>
  <div>
    <MessageInput 
      v-if="!showPresentation" 
      @add-message="addMessage" 
      @start-presentation="startPresentation"
      :messages="messages"
    />
    <PresentationMode 
      v-else 
      :messages="messages" 
      @exit="exitPresentation" 
    />
  </div>
</template>