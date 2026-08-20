<script setup>
import appIcon from '../assets/icon.svg';

defineProps({
  password: {
    type: String,
    required: true
  },
  historyCount: {
    type: Number,
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  securityLabel: {
    type: String,
    required: true
  }
});

defineEmits(['generate', 'copy', 'toggle-history']);
</script>

<template>
  <section class="hero-panel">
    <div class="hero-heading">
      <div class="hero-title-row">
        <div class="hero-title">
          <img class="hero-title-icon" :src="appIcon" alt="" aria-hidden="true">
          <h1>Password Generator</h1>
        </div>
        <div class="hero-toolbar">
          <button class="toolbar-button" type="button" aria-label="Password history" @click="$emit('toggle-history')">
            <i class="bi bi-clock-history"></i>
            <span class="toolbar-count">{{ historyCount }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="result-card">
      <div class="result-value">{{ password }}</div>
      <div class="result-meta">{{ length }} characters · {{ securityLabel }}</div>
      <button class="result-action" type="button" @click="$emit('generate')">Generate Password</button>
      <button class="result-action" type="button" @click="$emit('copy')">Copy to Clipboard</button>
    </div>
  </section>
</template>
