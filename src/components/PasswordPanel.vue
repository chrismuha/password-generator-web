<script setup>
import { ref } from 'vue';
import appIcon from '../assets/icon.svg';

const passwordAlignment = ref('center');

defineProps({
  password: {
    type: String,
    required: true
  },
  historyCount: {
    type: Number,
    required: true
  },
  wordCount: {
    type: Number,
    required: true
  },
  securityLabel: {
    type: String,
    required: true
  },
  copied: {
    type: Boolean,
    default: false
  }
});

defineEmits(['generate', 'copy', 'toggle-history', 'toggle-about']);
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
          <button class="toolbar-button" type="button" aria-label="What’s New and version information" aria-haspopup="dialog" @click="$emit('toggle-about')">
            <i class="bi bi-info-circle"></i>
          </button>
          <button class="toolbar-button" type="button" aria-label="Password history" @click="$emit('toggle-history')">
            <i class="bi bi-clock-history"></i>
            <span class="toolbar-count">{{ historyCount }}</span>
          </button>
        </div>
      </div>
      <slot />
    </div>

    <div class="result-card">
      <div class="result-value" :class="`align-${passwordAlignment}`">{{ password }}</div>
      <div v-if="password" class="result-details">
        <div class="alignment-toggle" aria-label="Password alignment">
          <button type="button" aria-label="Align password left" :aria-pressed="passwordAlignment === 'left'" @click="passwordAlignment = 'left'">
            <i class="bi bi-text-left"></i>
          </button>
          <button type="button" aria-label="Center password" :aria-pressed="passwordAlignment === 'center'" @click="passwordAlignment = 'center'">
            <i class="bi bi-text-center"></i>
          </button>
        </div>
        <div class="result-meta">{{ wordCount ? `${wordCount} words · ` : '' }}{{ password.length }} characters · {{ securityLabel }}</div>
      </div>
      <button class="result-action" type="button" @click="$emit('generate', 'password')">Generate Password</button>
      <button class="result-action" type="button" @click="$emit('generate', 'passphrase')">Generate Passphrase</button>
      <button
        class="result-action copy-action"
        :class="{ 'is-copied': copied }"
        type="button"
        :disabled="!password"
        @click="$emit('copy')"
      >{{ copied ? 'Copied' : 'Copy to Clipboard' }}</button>
    </div>
  </section>
</template>
