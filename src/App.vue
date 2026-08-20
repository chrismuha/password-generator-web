<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import WindowChrome from './components/WindowChrome.vue';
import PasswordPanel from './components/PasswordPanel.vue';
import OptionsCard from './components/OptionsCard.vue';
import HistoryCard from './components/HistoryCard.vue';

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const AVAILABLE_SYMBOLS = ['&', '\'', '*', '@', '"', '^', '>', '}', ')', ']', ':', '$', '=', '!', '-', '<', '{', '(', '[', '%', '+', '#', '?', ';', '/', '~'];
const AMBIGUOUS = new Set(['0', 'O', 'o', '1', 'l', 'I', '|']);

const state = ref({
  groups: 4,
  charsPerGroup: 4,
  includeUppercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: true,
  historyOnCopyOnly: true,
  noSeparators: true,
  separator: '',
  enabledSymbols: AVAILABLE_SYMBOLS
});

const password = ref('');
const status = ref('Ready');
const history = ref([]);
const historyOpen = ref(false);
const entropyInfoOpen = ref(false);
const charsetInfoOpen = ref(false);
const symbolSettingsOpen = ref(false);
const aboutOpen = ref(false);
const isDesktopApp = Boolean(window.passwordGeneratorApi);
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

function getFocusableElements() {
  return Array.from(document.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) => {
    if (!(element instanceof HTMLElement)) return false;
    if (element.hidden || element.getAttribute('aria-hidden') === 'true') return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
}

function handleTabAndEscapeFocus(event) {
  if (event.defaultPrevented) return;

  if (event.key === 'Escape') {
    const active = document.activeElement;
    if (active && active !== document.body && active !== document.documentElement && typeof active.blur === 'function') {
      active.blur();
    }
    return;
  }

  if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return;

  const focusable = getFocusableElements();
  const currentIndex = focusable.indexOf(document.activeElement);
  if (currentIndex === -1 || focusable.length < 2) return;

  const target = event.shiftKey && currentIndex === 0
    ? focusable[focusable.length - 1]
    : !event.shiftKey && currentIndex === focusable.length - 1
      ? focusable[0]
      : null;

  if (!target) return;
  event.preventDefault();
  target.focus({ preventScroll: true });
}

function secureRandomInt(maxExclusive) {
  const values = new Uint32Array(1);
  const maxUint = 0x100000000;
  const limit = maxUint - (maxUint % maxExclusive);
  let value = 0;

  do {
    crypto.getRandomValues(values);
    value = values[0];
  } while (value >= limit);

  return value % maxExclusive;
}

const symbolCharacters = computed(() => state.value.enabledSymbols.join(''));

const activePools = computed(() => {
  const pools = [LOWERCASE];

  if (state.value.includeUppercase) pools.push(UPPERCASE);
  if (state.value.includeNumbers) pools.push(NUMBERS);
  if (state.value.includeSymbols) pools.push(symbolCharacters.value);

  if (!state.value.excludeAmbiguous) return pools;

  return pools.map((pool) => Array.from(pool).filter((character) => !AMBIGUOUS.has(character)).join('')).filter(Boolean);
});

const combinedCharset = computed(() => activePools.value.join(''));

const totalCharacters = computed(() => state.value.groups * state.value.charsPerGroup);
const renderedLength = computed(() => {
  const separatorLength = state.value.noSeparators ? 0 : (state.value.groups - 1) * state.value.separator.length;
  return totalCharacters.value + separatorLength;
});
const entropyBits = computed(() => {
  if (!combinedCharset.value.length) return 0;
  return totalCharacters.value * Math.log2(combinedCharset.value.length);
});
const entropyWholeBits = computed(() => Math.round(entropyBits.value));
const securityLabel = computed(() => {
  if (entropyWholeBits.value < 40) return 'not secure';
  if (entropyWholeBits.value < 60) return 'somewhat secure';
  if (entropyWholeBits.value < 100) return 'secure';
  return 'very secure';
});

function shuffle(items) {
  const clone = items.slice();

  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomInt(index + 1);
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }

  return clone;
}

function choose(pool) {
  return pool[secureRandomInt(pool.length)];
}

function addHistoryEntry(value) {
  if (!value) return;

  const newestEntry = history.value[0];
  if (newestEntry?.value === value) return;

  history.value.unshift({
    value,
    length: value.length,
    createdAt: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  });

  history.value = history.value.slice(0, 10);
}

function buildPassword(recordHistory = true) {
  if (!combinedCharset.value.length) {
    password.value = '';
    status.value = 'Select at least one usable character set.';
    return;
  }

  const characters = [];

  for (const pool of activePools.value) {
    if (characters.length < totalCharacters.value) {
      characters.push(choose(pool));
    }
  }

  while (characters.length < totalCharacters.value) {
    characters.push(choose(combinedCharset.value));
  }

  const groups = [];
  const shuffled = shuffle(characters);

  for (let index = 0; index < shuffled.length; index += state.value.charsPerGroup) {
    groups.push(shuffled.slice(index, index + state.value.charsPerGroup).join(''));
  }

  password.value = state.value.noSeparators ? groups.join('') : groups.join(state.value.separator);
  status.value = 'Generated password';

  if (recordHistory && !state.value.historyOnCopyOnly) {
    addHistoryEntry(password.value);
  }
}

async function copyPassword() {
  if (!password.value) {
    status.value = 'Nothing to copy';
    return;
  }

  await navigator.clipboard.writeText(password.value);
  if (state.value.historyOnCopyOnly) {
    addHistoryEntry(password.value);
    status.value = 'Copied to clipboard and saved to history';
    return;
  }

  status.value = 'Copied to clipboard';
}

async function copyHistoryValue(value) {
  await navigator.clipboard.writeText(value);
  status.value = 'Copied history item to clipboard';
}

function clearHistory() {
  history.value = [];
  status.value = 'Password history cleared';
}

function updateGroups(nextValue) {
  state.value.groups = Math.max(1, Math.min(12, nextValue));
}

function updateCharsPerGroup(nextValue) {
  state.value.charsPerGroup = Math.max(1, Math.min(32, nextValue));
}

watch(() => state.value.noSeparators, (isDisabled) => {
  if (isDisabled) {
    status.value = 'Separators disabled';
  }
});

watch(() => state.value.enabledSymbols, (symbols) => {
  const dedupedSymbols = AVAILABLE_SYMBOLS.filter((symbol) => symbols.includes(symbol));

  if (dedupedSymbols.length !== symbols.length || dedupedSymbols.some((symbol, index) => symbol !== symbols[index])) {
    state.value.enabledSymbols = dedupedSymbols;
  }
}, { deep: true });

watch(state, () => {
  buildPassword(false);
}, { deep: true });

buildPassword(false);

onMounted(() => {
  window.addEventListener('keydown', handleTabAndEscapeFocus);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleTabAndEscapeFocus);
});
</script>

<template>
  <div class="app-shell">
    <WindowChrome title="Password Generator" />

    <main class="app-frame">
      <PasswordPanel
        :password="password"
        :history-count="history.length"
        :length="renderedLength"
        :security-label="securityLabel"
        @generate="buildPassword()"
        @copy="copyPassword"
        @toggle-history="historyOpen = !historyOpen"
        @toggle-about="aboutOpen = !aboutOpen"
      />

      <OptionsCard
        :state="state"
        :available-symbols="AVAILABLE_SYMBOLS"
        :charset-size="combinedCharset.length"
        :entropy-bits="entropyWholeBits"
        :charset-info-open="charsetInfoOpen"
        :entropy-info-open="entropyInfoOpen"
        :symbol-settings-open="symbolSettingsOpen"
        @close-charset-info="charsetInfoOpen = false"
        @close-entropy-info="entropyInfoOpen = false"
        @close-symbol-settings="symbolSettingsOpen = false"
        @toggle-charset-info="charsetInfoOpen = !charsetInfoOpen"
        @toggle-entropy-info="entropyInfoOpen = !entropyInfoOpen"
        @open-symbol-settings="symbolSettingsOpen = true"
        @update:state="state = $event"
        @update:groups="updateGroups"
        @update:chars-per-group="updateCharsPerGroup"
      />

      <HistoryCard
        :open="historyOpen"
        :history="history"
        @clear-history="clearHistory"
        @close="historyOpen = false"
        @copy="copyHistoryValue"
      />

      <section v-if="aboutOpen" class="info-overlay" @click.self="aboutOpen = false">
        <div class="info-modal version-modal">
          <div class="info-modal-header">
            <span>About This Version</span>
            <button class="info-modal-close" type="button" aria-label="Close version information" @click="aboutOpen = false">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="info-panel version-info">
            <p><strong>{{ isDesktopApp ? 'Desktop app' : 'Web app' }}</strong></p>
            <p>The password generator, options, defaults, entropy calculation, secure randomness, history, symbol settings, and clipboard behavior are the same in both versions.</p>
            <ul>
              <li>The desktop edition includes a native window, startup screen, installers, and operating-system packaging.</li>
              <li>The web edition runs in a browser, follows browser clipboard permissions, and adapts to smaller screens.</li>
              <li>Fonts can render slightly differently depending on the browser and operating system.</li>
              <li>Password history is temporary and resets when the app or page is restarted.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
