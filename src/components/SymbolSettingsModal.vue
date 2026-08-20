<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  availableSymbols: {
    type: Array,
    required: true
  },
  enabledSymbols: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'update:enabledSymbols']);

function updateEnabledSymbols(nextSymbols) {
  emit('update:enabledSymbols', props.availableSymbols.filter((symbol) => nextSymbols.includes(symbol)));
}

function toggleSymbol(symbol) {
  const isEnabled = props.enabledSymbols.includes(symbol);
  const nextSymbols = isEnabled
    ? props.enabledSymbols.filter((item) => item !== symbol)
    : [...props.enabledSymbols, symbol];

  updateEnabledSymbols(nextSymbols);
}

function setAllEnabled(nextEnabled) {
  updateEnabledSymbols(nextEnabled ? props.availableSymbols : []);
}
</script>

<template>
  <section v-if="open" class="info-overlay" @click.self="$emit('close')">
    <div class="symbol-panel">
      <div class="history-header">
        <div class="history-heading">
          <p class="history-kicker">Generator Settings</p>
          <h2>Special Characters</h2>
          <p class="history-subtitle">
            <span>{{ enabledSymbols.length }} enabled</span>
            <span>Only enabled symbols are used when special characters are turned on.</span>
          </p>
        </div>
        <div class="history-header-actions">
          <button class="symbol-bulk-action" type="button" @click="setAllEnabled(true)">Select All</button>
          <button class="symbol-bulk-action" type="button" @click="setAllEnabled(false)">Select None</button>
          <button class="history-close" type="button" aria-label="Close special character settings" @click="$emit('close')">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <div class="symbol-list">
        <button
          v-for="symbol in availableSymbols"
          :key="symbol"
          class="symbol-row"
          type="button"
          @click="toggleSymbol(symbol)"
        >
          <span class="symbol-row-value">{{ symbol }}</span>
          <span class="symbol-row-state">{{ enabledSymbols.includes(symbol) ? 'Included' : 'Excluded' }}</span>
          <span class="toggle" :class="{ on: enabledSymbols.includes(symbol) }" aria-hidden="true">
            <span class="toggle-knob"></span>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>
