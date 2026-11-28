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
          <i class="bi bi-key-fill generator-choice-icon" aria-hidden="true"></i>
          <span>Password</span>
          <span class="generator-choice-indicator" aria-hidden="true"><i class="bi bi-check-lg"></i></span>
        </label>
        <label>
          <input type="radio" name="generator-type" :checked="selectedType === 'passphrase'" @change="$emit('select-type', 'passphrase')">
          <i class="bi bi-lock-fill generator-choice-icon" aria-hidden="true"></i>
          <span>Passphrase</span>
          <span class="generator-choice-indicator" aria-hidden="true"><i class="bi bi-check-lg"></i></span>
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
      <button class="generate-action" type="button" @click="$emit('generate')">
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
.generator-choices {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
  gap: 8px;
}

.generator-choices label {
  position: relative;
  display: flex;
  overflow-wrap: anywhere;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 8px 12px;
  border: 1px solid #657083;
  border-radius: 12px;
  background: #242932;
  color: #dbe1e9;
  font-weight: 600;
  cursor: pointer;
}

.generator-choices label:has(input:checked) {
  border-color: #72869d;
  background: #293545;
}

.generator-choices label:has(input:focus-visible) {
  outline: 2px solid #a1b4ca;
  outline-offset: 2px;
}

.generator-choices input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
}

.generator-choice-icon,
.generator-choice-indicator {
  display: grid;
  flex: none;
  place-items: center;
  line-height: 1;
}

.generator-choice-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #1d222b;
  color: #fff;
  font-size: 1.125rem;
}

.generator-choice-indicator {
  width: 20px;
  height: 20px;
  margin-left: auto;
  border: 1px solid #818c9e;
  border-radius: 6px;
  font-size: 0.9rem;
}

.generator-choice-indicator i {
  visibility: hidden;
}

input:checked ~ .generator-choice-indicator {
  border-color: #fff;
  background: #fff;
  color: #000;
}

input:checked ~ .generator-choice-indicator i {
  visibility: visible;
}

.generate-action {
  display: block;
  width: calc(100% - 24px);
  min-height: 44px;
  margin: 12px;
  padding: 10px 14px;
  border: 1px solid #ed5961;
  border-radius: 10px;
  background: #b8212e;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.generate-action:active {
  background: #981b26;
}

.generate-action:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

@media (forced-colors: active) {
  .generator-choices label:has(input:checked),
  input:checked ~ .generator-choice-indicator {
    border-color: Highlight;
  }

  .generate-action {
    border-color: ButtonText;
  }
}

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

.mcr-guide-launch.reset-button:focus-visible {
  outline-color: #ffdc78;
}

.reset-button .bi {
  font-size: 1.2rem;
  line-height: 1;
}
</style>
