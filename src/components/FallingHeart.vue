<script setup lang="ts">
import { ref, onMounted } from 'vue';

// This component creates a single animated heart
const props = defineProps<{
  size?: number;
  delay?: number;
  duration?: number;
  left?: number;
}>();

const heartRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (heartRef.value) {
    const heart = heartRef.value;
    
    // Set initial position
    heart.style.left = `${props.left || Math.random() * 100}%`;
    heart.style.animationDelay = `${props.delay || Math.random() * 5}s`;
    heart.style.animationDuration = `${props.duration || (Math.random() * 5 + 5)}s`;
    
    // Set size
    const size = props.size || Math.random() * 20 + 10;
    heart.style.fontSize = `${size}px`;
    
    // Add some random rotation
    heart.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;
  }
});
</script>

<template>
  <div class="heart" ref="heartRef">❤</div>
</template>

<style scoped>
.heart {
  position: absolute;
  top: -50px;
  color: #ff4d8b;
  opacity: 0;
  animation-name: fall;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(calc(100vh + 50px)) rotate(360deg);
    opacity: 0;
  }
}
</style>