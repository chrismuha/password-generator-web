<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    default: ''
  },
  kind: {
    type: String,
    default: 'disclosure'
  },
  checked: {
    type: Boolean,
    default: false
  },
  infoLabel: {
    type: String,
    default: ''
  }
});

defineEmits(['toggle', 'decrement', 'increment', 'click', 'info-click']);
</script>

<template>
  <div class="option-row" @click="$emit('click')">
    <span class="option-label-row">
      <span class="option-label">{{ label }}</span>
      <button
        v-if="infoLabel"
        class="option-info-button"
        type="button"
        :aria-label="infoLabel"
        @click.stop="$emit('info-click')"
      >
        <i class="bi bi-info-circle"></i>
      </button>
    </span>

    <div v-if="kind === 'stepper'" class="stepper" @click.stop>
      <button type="button" class="stepper-button" aria-label="Decrease" @click="$emit('decrement')">−</button>
      <span class="stepper-value">{{ value }}</span>
      <button type="button" class="stepper-button" aria-label="Increase" @click="$emit('increment')">+</button>
    </div>

    <button
      v-else-if="kind === 'toggle'"
      type="button"
      class="toggle"
      :class="{ on: checked }"
      :aria-pressed="checked"
      @click.stop="$emit('toggle')"
    >
      <span class="toggle-knob"></span>
    </button>

    <div v-else class="disclosure">
      <span class="option-value">{{ value }}</span>
      <span class="chevron">›</span>
    </div>
  </div>
</template>
