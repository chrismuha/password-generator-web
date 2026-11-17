<script setup>
import { computed, ref } from 'vue';
import OptionRow from './OptionRow.vue';
import SymbolSettingsModal from './SymbolSettingsModal.vue';

const props = defineProps({
  state: {
    type: Object,
    required: true
  },
  availableSymbols: {
    type: Array,
    required: true
  },
  isPassphrase: {
    type: Boolean,
    required: true
  },
  poolSize: {
    type: Number,
    required: true
  },
  charsetInfoOpen: {
    type: Boolean,
    required: true
  },
  entropyBits: {
    type: [Number, null],
    required: true
  },
  entropyInfoOpen: {
    type: Boolean,
    required: true
  },
  symbolSettingsOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits([
  'close-charset-info',
  'close-entropy-info',
  'close-symbol-settings',
  'open-symbol-settings',
  'toggle-charset-info',
  'toggle-entropy-info',
  'update:state',
  'update:groups',
  'update:word-count',
  'update:chars-per-group',
  'update:copy-feedback-seconds'
]);

const separators = [
  { label: 'Dot', value: '.', noSeparators: false },
  { label: '-', value: '-', noSeparators: false },
  { label: 'Space', value: ' ', noSeparators: false },
  { label: 'None', value: '', noSeparators: true }
];

const separatorLabel = computed(() => {
  const current = separators.find((item) => (
    item.noSeparators === props.state.noSeparators
    && item.value === (props.state.noSeparators ? '' : props.state.separator)
  ));

  return current?.label || 'Dot';
});
const enabledSymbolCount = computed(() => `${props.state.enabledSymbols.length} enabled`);
const groupsInfoOpen = ref(false);

function patchState(patch) {
  emit('update:state', { ...props.state, ...patch });
}

function cycleValue(values, current) {
  const currentIndex = values.findIndex((value) => value === current || value.label === current);
  const nextIndex = (currentIndex + 1) % values.length;
  return values[nextIndex];
}

function cycleSeparator() {
  const nextSeparator = cycleValue(separators, separatorLabel.value);
  patchState({
    noSeparators: nextSeparator.noSeparators,
    separator: nextSeparator.noSeparators ? '' : nextSeparator.value
  });
}
</script>

<template>
  <section class="options-panel">
    <h2>Options</h2>

    <div class="list-card">
      <template v-if="isPassphrase">
        <OptionRow
          label="Word count"
          kind="stepper"
          :value="`${state.wordCount} words`"
          @decrement="$emit('update:word-count', state.wordCount - 1)"
          @increment="$emit('update:word-count', state.wordCount + 1)"
        />
        <label class="option-row">
          <span class="option-label">Word separator</span>
          <select class="word-separator" :value="state.wordSeparator" @change="patchState({ wordSeparator: $event.target.value })">
            <option value="-">Hyphen</option>
            <option value=" ">Space</option>
            <option value=".">Dot</option>
          </select>
        </label>
      </template>
      <template v-else>
        <OptionRow
          label="Groups"
          info-label="What are password groups?"
          kind="stepper"
          :value="`${state.groups} groups`"
          @info-click="groupsInfoOpen = true"
          @decrement="$emit('update:groups', state.groups - 1)"
          @increment="$emit('update:groups', state.groups + 1)"
        />
        <OptionRow
          label="Include uppercase"
          kind="toggle"
          :checked="state.includeUppercase"
          @toggle="patchState({ includeUppercase: !state.includeUppercase })"
        />
        <OptionRow
          label="Include random number"
          kind="toggle"
          :checked="state.includeNumbers"
          @toggle="patchState({ includeNumbers: !state.includeNumbers })"
        />
        <OptionRow
          label="Include special character"
          kind="toggle"
          :checked="state.includeSymbols"
          @toggle="patchState({ includeSymbols: !state.includeSymbols })"
        />
        <OptionRow
          label="Exclude ambiguous"
          kind="toggle"
          :checked="state.excludeAmbiguous"
          @toggle="patchState({ excludeAmbiguous: !state.excludeAmbiguous })"
        />
      </template>
      <OptionRow
        label="Save only copied passwords"
        kind="toggle"
        :checked="state.historyOnCopyOnly"
        @toggle="patchState({ historyOnCopyOnly: !state.historyOnCopyOnly })"
      />
      <OptionRow
        label="Keep history after refresh"
        kind="toggle"
        :checked="state.persistHistory"
        @toggle="patchState({ persistHistory: !state.persistHistory })"
      />
      <OptionRow
        label="Show copied confirmation"
        kind="toggle"
        :checked="state.copyFeedbackEnabled"
        @toggle="patchState({ copyFeedbackEnabled: !state.copyFeedbackEnabled })"
      />
      <OptionRow
        v-if="state.copyFeedbackEnabled"
        label="Copied confirmation time"
        kind="stepper"
        :value="`${state.copyFeedbackSeconds} sec`"
        @decrement="$emit('update:copy-feedback-seconds', state.copyFeedbackSeconds - 1)"
        @increment="$emit('update:copy-feedback-seconds', state.copyFeedbackSeconds + 1)"
      />
      <template v-if="!isPassphrase">
        <OptionRow
          label="Special characters"
          :value="enabledSymbolCount"
          @click="$emit('open-symbol-settings')"
        />
        <OptionRow
          label="Separator"
          :value="separatorLabel"
          @click="cycleSeparator"
        />
        <OptionRow
          label="Characters per group"
          kind="stepper"
          :value="`${state.charsPerGroup} chars`"
          @decrement="$emit('update:chars-per-group', state.charsPerGroup - 1)"
          @increment="$emit('update:chars-per-group', state.charsPerGroup + 1)"
        />
      </template>
    </div>

    <section v-if="groupsInfoOpen" class="info-overlay" @click.self="groupsInfoOpen = false">
      <div class="info-modal">
        <div class="info-modal-header">
          <span>Groups</span>
          <button class="info-modal-close" type="button" aria-label="Close groups help" @click="groupsInfoOpen = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="info-panel">
          <p>Groups split your password into equal sections, which can make a long password easier to read or type.</p>
          <p>The total number of password characters is groups × characters per group. For example, 4 groups of 4 characters creates 16 characters.</p>
          <p>Your selected separator appears between groups. Choosing None keeps the same total characters without visible breaks.</p>
        </div>
      </div>
    </section>

    <div class="metrics-card">
      <div>
        <span class="metric-label metric-label-row">
          <span>{{ isPassphrase ? 'Word list' : 'Charset' }}</span>
          <button class="metric-info-button" type="button" :aria-label="isPassphrase ? 'About the word list' : 'What is charset?'" @click="$emit('toggle-charset-info')">
            <i class="bi bi-info-circle"></i>
          </button>
        </span>
        <strong>{{ poolSize.toLocaleString() }} {{ isPassphrase ? 'words' : 'characters' }}</strong>
      </div>
      <div>
        <span class="metric-label metric-label-row">
          <span>Entropy</span>
          <button class="metric-info-button" type="button" aria-label="What is entropy?" @click="$emit('toggle-entropy-info')">
            <i class="bi bi-info-circle"></i>
          </button>
        </span>
        <strong>{{ entropyBits === null ? '—' : `${entropyBits} bits` }}</strong>
      </div>
    </div>

    <section v-if="charsetInfoOpen" class="info-overlay" @click.self="$emit('close-charset-info')">
      <div class="info-modal">
        <div class="info-modal-header">
          <span>{{ isPassphrase ? 'Word list' : 'Charset' }}</span>
          <button class="info-modal-close" type="button" aria-label="Close character set or word list help" @click="$emit('close-charset-info')">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="info-panel">
          <template v-if="isPassphrase">
            <p>Each word is picked independently with secure randomness from {{ poolSize.toLocaleString() }} possible words.</p>
            <p>Source <a href="https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases" target="_blank" rel="noreferrer">Electronic Frontier Foundation’s long word list</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Four hyphenated entries were omitted so a hyphen always marks a word boundary.</p>
          </template>
          <template v-else>
            <p><strong>Charset</strong> is the number of different characters the generator can currently choose from.</p>
            <p>If it says <strong>58</strong>, the password can be built from 58 possible characters based on your current settings.</p>
            <p>More available characters usually means more entropy and a harder password to guess.</p>
          </template>
        </div>
      </div>
    </section>

    <section v-if="entropyInfoOpen" class="info-overlay" @click.self="$emit('close-entropy-info')">
      <div class="info-modal">
        <div class="info-modal-header">
          <span>Entropy</span>
          <button class="info-modal-close" type="button" aria-label="Close entropy help" @click="$emit('close-entropy-info')">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="info-panel">
          <p><strong>Entropy</strong> is an estimate of how hard the password is to guess.</p>
          <p><strong>Not secure:</strong> under 40 bits.</p>
          <p><strong>Somewhat secure:</strong> 40 to 59 bits.</p>
          <p><strong>Secure:</strong> 60 to 99 bits.</p>
          <p><strong>Very secure:</strong> 100+ bits.</p>
        </div>
      </div>
    </section>

    <SymbolSettingsModal
      :open="symbolSettingsOpen"
      :available-symbols="availableSymbols"
      :enabled-symbols="state.enabledSymbols"
      @close="$emit('close-symbol-settings')"
      @update:enabled-symbols="patchState({ enabledSymbols: $event })"
    />
  </section>
</template>
