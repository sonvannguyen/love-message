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
    if (!container.isConnected) return;
    
    currentRotationX += (targetRotationX - currentRotationX) * 0.1;
    currentRotationY += (targetRotationY - currentRotationY) * 0.1;
    
    const scene = container.querySelector('.scene-container');
    if (scene && scene instanceof HTMLElement) {
      scene.style.transform = `
        perspective(2000px) 
        rotateX(${-currentRotationX}deg) 
        rotateY(${currentRotationY}deg) 
        scale(${scale})
      `;
    }
    
    requestAnimationFrame(animate);
  }
  
  requestAnimationFrame(animate);
}

function createAndAppendElement(container: HTMLElement, className: string): HTMLElement {
  const element = document.createElement('div');
  element.className = className;
  container.appendChild(element);
  return element;
}

export function createHeartParticles(container: HTMLElement, count: number): HTMLElement[] {
  const hearts: HTMLElement[] = [];
  
  for (let i = 0; i < count; i++) {
    const heart = createAndAppendElement(container, 'heart-particle');
    heart.innerHTML = '❤';
    Object.assign(heart.style, {
      position: 'absolute',
      color: '#ff4d8b',
      fontSize: `${Math.random() * 20 + 10}px`,
      opacity: '0',
      left: `${Math.random() * 100}%`,
      top: '-50px',
      zIndex: '1',
      pointerEvents: 'none'
    });
    
    hearts.push(heart);
    animateHeart(heart);
  }
  
  return hearts;
}

function animateHeart(heart: HTMLElement) {
  if (!heart.isConnected) return;
  
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
      if (heart.isConnected) {
        animateHeart(heart);
      }
    }
  });
}

export function createFloatingMessages(container: HTMLElement, messages: string[]): HTMLElement[] {
  const messageElements: HTMLElement[] = [];
  const sceneContainer = createAndAppendElement(container, 'scene-container');
  
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const depthLayers = [-2000, -1500, -1000, -500, 0, 500, 1000, 1500, 2000];
  
  messages.forEach((text) => {
    depthLayers.forEach((depth) => {
      const messageEl = createAndAppendElement(sceneContainer, 'floating-message');
      messageEl.innerText = text;
      
      const scale = Math.max(0.5, 1 + (depth / 4000));
      const fontSize = Math.max(16, 24 * scale);
      const opacity = Math.max(0.4, 1 - Math.abs(depth/2000));
      
      Object.assign(messageEl.style, {
        position: 'absolute',
        color: '#ffffff',
        fontSize: `${fontSize}px`,
        fontWeight: 'bold',
        textShadow: '0 0 20px #ffffff, 0 0 30px #ff69b4, 0 0 40px #ff69b4',
        whiteSpace: 'nowrap',
        opacity: String(opacity),
        zIndex: String(Math.floor(2000 + depth)),
        transform: `translateZ(${depth}px)`,
        pointerEvents: 'none',
        backfaceVisibility: 'visible',
        transformStyle: 'preserve-3d',
        transition: 'color 2s ease-in-out, text-shadow 2s ease-in-out',
        filter: `blur(${Math.abs(depth) / 6000}px)`,
        willChange: 'transform, opacity, color'
      });
      
      messageElements.push(messageEl);
      animateFloatingMessage(messageEl, containerWidth, containerHeight, depth);
    });
  });
  
  return messageElements;
}

function animateFloatingMessage(element: HTMLElement, containerWidth: number, containerHeight: number, depth: number) {
  if (!element.isConnected) return;
  
  const startX = Math.random() * containerWidth;
  const startY = -50 - Math.abs(depth/2);
  
  gsap.set(element, {
    x: startX,
    y: startY,
    opacity: 0
  });
  
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: Math.random() * 2 + (Math.abs(depth) / 1000)
  });
  
  tl.to(element, {
    opacity: Math.max(0.4, 1 - Math.abs(depth/2000)),
    duration: 1,
    ease: "power2.inOut"
  });
  
  tl.to(element, {
    color: '#ff69b4',
    textShadow: '0 0 20px #ff69b4, 0 0 30px #ff69b4, 0 0 40px #ff69b4',
    duration: 3,
    ease: "power2.inOut"
  }, "-=0.5");
  
  tl.to(element, {
    y: containerHeight + 100,
    x: startX + Math.random() * 100 - 50,
    duration: Math.random() * 5 + 8,
    ease: "none",
  }, "-=2");
  
  tl.to(element, {
    opacity: 0,
    duration: 1,
    ease: "power2.in"
  }, "-=1.5");
  
  tl.set(element, {
    x: Math.random() * containerWidth,
    y: startY,
    color: '#ffffff',
    textShadow: '0 0 20px #ffffff, 0 0 30px #ff69b4, 0 0 40px #ff69b4'
  });
}