import { createApp } from 'vue';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App.vue';
import './style.css';

createApp(App).mount('#app');

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const serviceWorkerUrl = new URL(`${import.meta.env.BASE_URL}sw.js`, window.location.href).href;
    navigator.serviceWorker.register(serviceWorkerUrl, {
      scope: import.meta.env.BASE_URL,
      updateViaCache: 'none'
    }).catch((error) => {
      console.warn('[pwa] Service worker registration failed.', error);
    });
  });
}
