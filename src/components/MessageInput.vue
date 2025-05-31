<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue';

const props = defineProps<{
  messages: string[]
}>();

const emit = defineEmits(['add-message', 'start-presentation']);

const newMessage = ref('');

const addMessage = () => {
  if (newMessage.value.trim()) {
    emit('add-message', newMessage.value);
    newMessage.value = '';
  }
};

const startPresentation = () => {
  if (props.messages.length > 0) {
    emit('start-presentation');
  } else {
    alert('Please add at least one message before starting the presentation.');
  }
};
</script>

<template>
  <div class="message-input-container">
    <div class="input-content">
      <h1>Love Message Presentation</h1>
      <p>Add your love messages below and press "Start Presentation" to see the magic!</p>
      
      <div class="message-form">
        <textarea 
          v-model="newMessage" 
          placeholder="Type your love message here..." 
          rows="4"
          @keyup.enter="addMessage"
        ></textarea>
        <button @click="addMessage" class="add-btn">Add Message</button>
      </div>
      
      <div class="messages-list" v-if="props.messages.length > 0">
        <h3>Your Messages:</h3>
        <ul>
          <li v-for="(message, index) in props.messages" :key="index">
            {{ message }}
          </li>
        </ul>
      </div>
      
      <button 
        @click="startPresentation" 
        class="present-btn"
        :disabled="props.messages.length === 0"
      >
        Start Presentation
      </button>
    </div>
  </div>
</template>

<style scoped>
.message-input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: radial-gradient(circle at center, #141414, #000000);
  padding: 2rem;
}

.input-content {
  max-width: 600px;
  width: 100%;
  background: rgba(20, 20, 20, 0.8);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #ffffff, #ff4d8b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}

textarea {
  width: 100%;
  resize: vertical;
  min-height: 100px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
}

.add-btn {
  align-self: flex-end;
  background: #333;
  color: white;
}

.messages-list {
  text-align: left;
  margin: 2rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.messages-list h3 {
  margin-top: 0;
  color: #ff4d8b;
}

.messages-list ul {
  list-style-type: none;
  padding: 0;
}

.messages-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.present-btn {
  margin-top: 1rem;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
}

.present-btn:disabled {
  background-color: #555;
  cursor: not-allowed;
  box-shadow: none;
}
</style>