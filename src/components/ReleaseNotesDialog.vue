<script setup>
import { ref } from 'vue';
import notes from '../../RELEASE_NOTES.md?raw';

const dialog = ref(null);
const versions = notes.split(/^## /m).slice(1).map((version) => {
  const [title, ...lines] = version.trim().split('\n');
  const sections = [{ title: '', paragraphs: [], bullets: [] }];

  for (const line of lines) {
    const text = line.trim().replaceAll('**', '');
    if (!text) continue;

    if (text.startsWith('### ')) {
      sections.push({ title: text.slice(4), paragraphs: [], bullets: [] });
    } else if (text.startsWith('- ')) {
      sections.at(-1).bullets.push(text.slice(2));
    } else {
      sections.at(-1).paragraphs.push(text);
    }
  }

  return { title, sections: sections.filter((section) => section.title || section.paragraphs.length || section.bullets.length) };
});
const currentVersion = versions[0].title.split(' — ')[0];
const categoryIcons = {
  Accessibility: 'bi-universal-access-circle',
  Generation: 'bi-key',
  'Help and support': 'bi-question-circle'
};

defineExpose({ open: () => dialog.value.showModal() });
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="release-notes" aria-labelledby="release-notes-title">
      <header class="release-notes-header">
        <h2 id="release-notes-title">What’s New in {{ currentVersion }}</h2>
        <p>Choose a generator card and use the red Generate button on desktop or mobile. Reset restores the default options in one click.</p>
      </header>
      <div class="release-notes-content">
        <template v-for="(version, index) in versions" :key="version.title">
          <h3 v-if="index === 0">Latest Version</h3>
          <h3 v-else-if="index === 1">Version History</h3>
          <component :is="index === 0 ? 'section' : 'details'" class="release-version">
            <summary v-if="index > 0">{{ version.title }}</summary>
            <section v-for="section in version.sections" :key="section.title" class="release-category">
              <h4 v-if="section.title">
                <i class="bi" :class="categoryIcons[section.title] || 'bi-journal-text'" aria-hidden="true"></i>
                {{ section.title }}
              </h4>
              <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
              <ul v-if="section.bullets.length">
                <li v-for="bullet in section.bullets" :key="bullet">{{ bullet }}</li>
              </ul>
            </section>
          </component>
        </template>
        <details class="release-version">
          <summary>About This Version</summary>
          <slot />
        </details>
      </div>
      <footer class="release-notes-footer">
        <form method="dialog"><button autofocus type="submit">Close</button></form>
      </footer>
    </dialog>
  </Teleport>
</template>

<style scoped>
.release-notes {
  --notes-surface: #232323;
  --notes-card: #2f2f31;
  --notes-border: #535357;
  --notes-text: #ededee;
  --notes-muted: #d4d4d6;
  --notes-accent: #a9cfff;
  color: var(--notes-text);
  background: var(--notes-surface);
  border: 1px solid var(--notes-border);
  border-radius: 16px;
  padding: 0;
  width: min(600px, calc(100% - 24px));
  max-height: min(760px, calc(100dvh - 24px));
}
:global(html[data-theme="light"] .release-notes) {
  --notes-surface: #fff;
  --notes-card: #f3f5f8;
  --notes-border: #c5ccd6;
  --notes-text: #18263c;
  --notes-muted: #36455a;
  --notes-accent: #194f94;
  color-scheme: light;
}
.release-notes[open] { display: flex; flex-direction: column; }
.release-notes::backdrop { background: rgb(0 0 0 / 60%); }
.release-notes-header,
.release-notes-content,
.release-notes-footer { padding: clamp(12px, 4vw, 24px); }
.release-notes-header { border-bottom: 1px solid var(--notes-border); }
.release-notes-content { min-height: 0; overflow: auto; overscroll-behavior: contain; }
.release-notes-footer { border-top: 1px solid var(--notes-border); text-align: right; }
.release-notes h2,
.release-notes h3,
.release-notes h4 { margin: 0 0 8px; }
.release-notes h3 { font-size: 1.05rem; }
.release-notes h4 { font-size: .95rem; }
.release-notes p,
.release-notes ul { margin: 0; color: var(--notes-muted); line-height: 1.5; }
.release-notes ul { padding-inline-start: 20px; }
.release-notes li + li { margin-top: 6px; }
.release-category + .release-category { margin-top: 16px; }
.release-category i { margin-inline-end: 4px; color: var(--notes-accent); }
.release-version {
  margin-bottom: 12px;
  padding: 12px 16px;
  border: 1px solid var(--notes-border);
  border-radius: 12px;
  background: var(--notes-card);
}
.release-version summary { cursor: pointer; font-weight: 600; }
.release-version[open] summary { margin-bottom: 12px; }
.release-notes button {
  min-height: 40px;
  padding: 6px 18px;
  color: var(--notes-surface);
  background: var(--notes-accent);
  border-radius: 8px;
  cursor: pointer;
}
.release-notes :focus-visible { outline: 2px solid var(--notes-accent); outline-offset: 3px; }
</style>
