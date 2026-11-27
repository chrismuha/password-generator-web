<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import appIcon from '../assets/icon.svg';

const props = defineProps({
  password: {
    type: String,
    required: true
  },
  selectedType: {
    type: [String, null],
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

// Match the compact layout breakpoint in style.css.
const wideLayoutQuery = window.matchMedia('(width > 900px)');
const isWideLayout = ref(wideLayoutQuery.matches);
const wideAlignment = ref('left');
const compactAlignment = ref('center');
const passwordAlignment = computed({
  get: () => (isWideLayout.value ? wideAlignment : compactAlignment).value,
  set: (alignment) => {
    const activeAlignment = isWideLayout.value ? wideAlignment : compactAlignment;
    activeAlignment.value = alignment;
  }
});

function updateLayout(event) {
  isWideLayout.value = event.matches;
}

onMounted(() => wideLayoutQuery.addEventListener('change', updateLayout));
onBeforeUnmount(() => wideLayoutQuery.removeEventListener('change', updateLayout));
const resultType = computed(() => props.selectedType === 'passphrase' ? 'passphrase' : 'password');

const emit = defineEmits(['select-type', 'reset', 'generate', 'copy', 'toggle-history', 'toggle-about']);

function resetGenerator() {
  wideAlignment.value = 'left';
  compactAlignment.value = 'center';
  emit('reset');
}
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
      <div class="hero-actions">
        <slot />
        <button class="mcr-guide-launch reset-button" type="button" @click="resetGenerator">
          <i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
          <span>Reset</span>
        </button>
      </div>
    </div>

    <fieldset class="generator-picker">
      <legend>What are you generating today?</legend>
      <div class="generator-choices">
        <label>
          <input type="radio" name="generator-type" :checked="selectedType === 'password'" @change="$emit('select-type', 'password')">
          Password
        </label>
        <label>
          <input type="radio" name="generator-type" :checked="selectedType === 'passphrase'" @change="$emit('select-type', 'passphrase')">
          Passphrase
        </label>
      </div>
    </fieldset>

    <div v-if="selectedType" class="result-card" :class="{ 'result-card-wide': isWideLayout }">
      <div v-if="password && isWideLayout" class="readable-result">
        <label for="generated-result">Generated {{ resultType }}</label>
        <textarea
          id="generated-result"
          class="result-value readable-result-value"
          :class="[`align-${passwordAlignment}`, `result-${resultType}`]"
          :value="password"
          rows="3"
          readonly
          spellcheck="false"
        ></textarea>
      </div>
      <div v-else-if="password" class="result-value" :class="`align-${passwordAlignment}`">{{ password }}</div>
      <div v-if="password" class="result-details">
        <div class="alignment-toggle" :role="isWideLayout ? 'group' : undefined" :aria-label="isWideLayout ? 'Result alignment' : 'Password alignment'">
          <button type="button" :aria-label="`Align ${isWideLayout ? resultType : 'password'} left`" :aria-pressed="passwordAlignment === 'left'" @click="passwordAlignment = 'left'">
            <i class="bi bi-text-left"></i>
          </button>
          <button type="button" :aria-label="`Center ${isWideLayout ? resultType : 'password'}`" :aria-pressed="passwordAlignment === 'center'" @click="passwordAlignment = 'center'">
            <i class="bi bi-text-center"></i>
          </button>
        </div>
        <div class="result-meta">{{ wordCount ? `${wordCount} words · ` : '' }}{{ password.length }} characters · {{ securityLabel }}</div>
      </div>
      <button class="result-action" type="button" @click="$emit('generate')">
        {{ selectedType === 'passphrase' ? 'Generate Passphrase' : 'Generate Password' }}
      </button>
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

<style scoped>
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mcr-guide-launch.reset-button {
  --guide-surface: #3a2d10;
  --guide-border: #9f7826;
  --guide-text: #ffdc78;
  align-self: stretch;
  -webkit-app-region: no-drag;
}

.mcr-guide-launch.reset-button:hover {
  background: #4a3915;
  border-color: #ffdc78;
}

.mcr-guide-launch.reset-button:focus-visible {
  outline-color: #ffdc78;
}

.reset-button .bi {
  font-size: 1.2rem;
  line-height: 1;
}
</style>
