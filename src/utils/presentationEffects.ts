import { gsap } from 'gsap';

let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;
let scale = 1;
let isDragging = false;
let startX = 0;
let startY = 0;

export function initMouseTracking(container: HTMLElement) {
  container.addEventListener('mousedown', (event) => {
    isDragging = true;
    startX = event.clientX - targetRotationY;
    startY = event.clientY - targetRotationX;
  });

  container.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    
    if (isDragging) {
      targetRotationY = (event.clientX - startX) * 0.5;
      targetRotationX = (event.clientY - startY) * 0.5;
    }
  });

  container.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  container.addEventListener('wheel', (event) => {
    event.preventDefault();
    scale = Math.min(Math.max(0.5, scale + event.deltaY * -0.001), 2);
  });

  function animate() {
    currentRotationX += (targetRotationX - currentRotationX) * 0.1;
    currentRotationY += (targetRotationY - currentRotationY) * 0.1;
    
    const scene = container.querySelector('.scene-container') as HTMLElement;
    if (scene) {
      scene.style.transform = `perspective(2000px) rotateX(${-currentRotationX}deg) rotateY(${currentRotationY}deg) scale(${scale})`;
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

export function createHeartParticles(container: HTMLElement, count: number): HTMLElement[] {
  const hearts: HTMLElement[] = [];
  
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart-particle');
    heart.innerHTML = '❤';
    heart.style.position = 'absolute';
    heart.style.color = '#ff4d8b';
    heart.style.fontSize = `${Math.random() * 20 + 10}px`;
    heart.style.opacity = '0';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = '-50px';
    heart.style.zIndex = '1';
    heart.style.pointerEvents = 'none';
    
    container.appendChild(heart);
    hearts.push(heart);
    
    animateHeart(heart);
  }
  
  return hearts;
}

function animateHeart(heart: HTMLElement) {
  const duration = Math.random() * 5 + 5;
  const delay = Math.random() * 10;
  
  gsap.set(heart, {
    y: -50,
    x: 0,
    opacity: 0,
    rotation: Math.random() * 60 - 30
  });
  
  gsap.to(heart, {
    y: window.innerHeight + 100,
    x: Math.random() * 100 - 50,
    opacity: 0.7,
    rotation: Math.random() * 360,
    duration: duration,
    delay: delay,
    ease: "none",
    onComplete: () => {
      animateHeart(heart);
    }
  });
}

export function createFloatingMessages(container: HTMLElement, messages: string[]): HTMLElement[] {
  const messageElements: HTMLElement[] = [];
  const sceneContainer = document.createElement('div');
  sceneContainer.classList.add('scene-container');
  container.appendChild(sceneContainer);
  
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  
  // Create multiple depth layers
  const depthLayers = [-1000, -500, 0, 500, 1000];
  
  messages.forEach((text) => {
    depthLayers.forEach((depth) => {
      const messageEl = document.createElement('div');
      messageEl.classList.add('floating-message');
      messageEl.innerText = text;
      messageEl.style.position = 'absolute';
      messageEl.style.color = '#ffffff';
      
      // Adjust size based on depth layer
      const scale = 1 + (depth / 2000); // Objects further back appear smaller
      const fontSize = Math.max(12, 24 * scale);
      messageEl.style.fontSize = `${fontSize}px`;
      
      messageEl.style.fontWeight = 'bold';
      messageEl.style.textShadow = '0 0 20px #ffffff, 0 0 30px #ff69b4, 0 0 40px #ff69b4';
      messageEl.style.whiteSpace = 'nowrap';
      messageEl.style.opacity = '0';
      messageEl.style.zIndex = `${Math.floor(depth)}`;
      messageEl.style.transform = `translateZ(${depth}px)`;
      messageEl.style.pointerEvents = 'none';
      messageEl.style.filter = `blur(${Math.abs(depth) / 4000}px)`; // Depth-based blur
      messageEl.style.transition = 'color 2s ease-in-out, text-shadow 2s ease-in-out';
      messageEl.style.transformStyle = 'preserve-3d';
      messageEl.style.perspective = '1000px';
      
      sceneContainer.appendChild(messageEl);
      messageElements.push(messageEl);
      
      animateFloatingMessage(messageEl, containerWidth, containerHeight, depth);
    });
  });
  
  return messageElements;
}

function animateFloatingMessage(element: HTMLElement, containerWidth: number, containerHeight: number, depth: number) {
  const startX = Math.random() * containerWidth;
  const startY = -50 - Math.abs(depth/2); // Stagger start position based on depth
  
  gsap.set(element, {
    x: startX,
    y: startY,
    z: depth,
    opacity: 0
  });
  
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: Math.random() * 2 + (Math.abs(depth) / 1000) // Depth-based delay
  });
  
  // Fade in with initial white color
  tl.to(element, {
    opacity: Math.max(0.3, 1 - Math.abs(depth/1000)), // Depth-based opacity
    duration: 0.5,
    ease: "power2.inOut"
  });
  
  // Smoothly transition to pink
  tl.to(element, {
    color: '#ff69b4',
    textShadow: '0 0 20px #ff69b4, 0 0 30px #ff69b4, 0 0 40px #ff69b4',
    duration: 2,
    ease: "power2.inOut"
  }, "-=0.5");
  
  // Fall down with subtle horizontal movement
  tl.to(element, {
    y: containerHeight + 100,
    x: startX + Math.random() * 100 - 50,
    duration: Math.random() * 5 + 8,
    ease: "none",
  }, "-=2");
  
  // Fade out
  tl.to(element, {
    opacity: 0,
    duration: 0.5,
    ease: "power2.in"
  }, "-=1");
  
  // Reset for next iteration
  tl.set(element, {
    x: Math.random() * containerWidth,
    y: startY,
    color: '#ffffff',
    textShadow: '0 0 20px #ffffff, 0 0 30px #ff69b4, 0 0 40px #ff69b4'
  });
}