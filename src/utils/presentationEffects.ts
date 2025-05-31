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
      scene.style.transform = `rotateX(${-currentRotationX}deg) rotateY(${currentRotationY}deg) scale(${scale})`;
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
  const duration = Math.random() * 5 + 5; // Faster heart animation
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
  
  messages.forEach((text) => {
    for (let i = 0; i < 10; i++) {
      const messageEl = document.createElement('div');
      messageEl.classList.add('floating-message');
      messageEl.innerText = text;
      messageEl.style.position = 'absolute';
      messageEl.style.color = '#ffffff';
      messageEl.style.fontSize = `${Math.random() * 10 + 20}px`;
      messageEl.style.fontWeight = 'bold';
      messageEl.style.textShadow = '0 0 20px #ffffff, 0 0 30px #ff69b4, 0 0 40px #ff69b4';
      messageEl.style.whiteSpace = 'nowrap';
      messageEl.style.opacity = '0';
      messageEl.style.zIndex = '2';
      messageEl.style.transform = 'translateZ(0px)';
      messageEl.style.pointerEvents = 'none';
      
      sceneContainer.appendChild(messageEl);
      messageElements.push(messageEl);
      
      animateFloatingMessage(messageEl, containerWidth, containerHeight);
    }
  });
  
  return messageElements;
}

function animateFloatingMessage(element: HTMLElement, containerWidth: number, containerHeight: number) {
  const startX = Math.random() * containerWidth - containerWidth/2;
  const startY = Math.random() * containerHeight - containerHeight/2;
  const startZ = Math.random() * 2000 - 1000;
  
  gsap.set(element, {
    x: startX,
    y: startY,
    z: startZ,
    opacity: 0,
    scale: calculateScale(startZ)
  });
  
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: Math.random()
  });
  
  tl.to(element, {
    opacity: 0.9,
    duration: 1,
    ease: "power2.inOut"
  });
  
  tl.to(element, {
    y: `+=${containerHeight * 1.5}`, // Faster downward movement
    x: `+=${Math.random() * 400 - 200}`,
    z: Math.random() * 2000 - 1000,
    rotationX: Math.random() * 360,
    rotationY: Math.random() * 360,
    rotationZ: Math.random() * 360,
    duration: Math.random() * 8 + 8, // Faster overall animation
    ease: "none",
  }, "-=0.5");
  
  tl.to(element, {
    opacity: 0,
    duration: 1,
    ease: "power2.in"
  }, "-=2");
}

function calculateScale(z: number): number {
  return 1 + (z / 2000);
}