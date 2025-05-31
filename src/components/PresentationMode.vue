<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { createHeartParticles, createFloatingMessages, initMouseTracking } from '../utils/presentationEffects';

const props = defineProps<{
  messages: string[]
}>();

const emit = defineEmits(['exit']);

const presentationContainer = ref<HTMLElement | null>(null);
let animationFrameId: number | null = null;
let scene: any = null;
let isInitialized = false;

onMounted(() => {
  if (presentationContainer.value && !isInitialized) {
    initMouseTracking(presentationContainer.value);
    const { cleanup, animate } = initializePresentation();
    
    animationFrameId = requestAnimationFrame(animate);
    scene = { cleanup };
    isInitialized = true;
  }
});

watch(() => props.messages, (newMessages) => {
  if (isInitialized && presentationContainer.value && newMessages.length > 0) {
    // Update messages in the scene if needed
  }
}, { deep: true });

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  if (scene && scene.cleanup) {
    scene.cleanup();
  }
});

const exitPresentation = () => {
  emit('exit');
};

const initializePresentation = () => {
  if (!presentationContainer.value) return { cleanup: () => {}, animate: () => {} };
  
  const container = presentationContainer.value;
  
  const hearts = createHeartParticles(container, 50);
  const messageElements = createFloatingMessages(container, props.messages);
  
  let colorToggle = false;
  const toggleColors = () => {
    colorToggle = !colorToggle;
    const color = colorToggle ? '#ff8db7' : '#ffffff';
    const glow = colorToggle ? 
      `0 0 30px ${color}, 0 0 40px #ff69b4, 0 0 50px #ff69b4, 0 0 60px #ff69b4` :
      `0 0 30px ${color}, 0 0 40px ${color}, 0 0 50px ${color}, 0 0 60px ${color}`;
    
    messageElements.forEach(el => {
      el.style.color = color;
      el.style.textShadow = glow;
    });
  };
  
  const colorInterval = setInterval(toggleColors, 5000);
  
  const cleanup = () => {
    clearInterval(colorInterval);
    hearts.forEach(heart => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    });
    messageElements.forEach(msg => {
      if (msg.parentNode) {
        msg.parentNode.removeChild(msg);
      }
    });
  };
  
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
  };
  
  return { cleanup, animate };
};
</script>

<template>
  <div class="presentation-container" ref="presentationContainer">
    <button class="exit-btn" @click="exitPresentation">
      Exit
    </button>
  </div>
</template>

<style scoped>
.presentation-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000000;
  overflow: hidden;
  perspective: 2000px;
  cursor: move;
}

.exit-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.exit-btn:hover {
  background-color: rgba(255, 77, 139, 0.7);
}

:deep(.scene-container) {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
}

:deep(.floating-message) {
  filter: blur(0.5px);
  text-shadow: 0 0 30px #ffffff, 0 0 40px #ff69b4, 0 0 50px #ff69b4, 0 0 60px #ff69b4;
  backface-visibility: hidden;
}
</style>