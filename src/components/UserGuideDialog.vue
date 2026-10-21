<script setup>
import { ref, computed, nextTick } from 'vue';
import './guide-dialog.css';
const props = defineProps({ title: String, sections: Array });
const dialog = ref(null), content = ref(null), page = ref(0), paginated = ref(true);
const visible = computed(() => paginated.value ? props.sections.slice(page.value, page.value + 1) : props.sections);
async function open() { page.value = 0; dialog.value.showModal(); await nextTick(); dialog.value.querySelector('.mcr-guide-close')?.focus(); }
function close() { dialog.value.close(); }
async function showPage(value) { page.value = Number(value); await nextTick(); if(content.value)content.value.scrollTop=0; }
function backdrop(event) { if(event.target===dialog.value){const box=dialog.value.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)close();} }
</script>
<template>
  <button class="mcr-guide-launch mcr-guide-dark" type="button" @click="open"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v15M12 5C8 2 4 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-2-1-6-2-10 1Z"/></svg><span>User Guide</span></button>
  <Teleport to="body">
    <dialog ref="dialog" class="mcr-guide mcr-guide-dark" aria-labelledby="utility-guide-title" @click="backdrop">
      <header class="mcr-guide-hero"><span class="mcr-guide-mark"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v15M12 5C8 2 4 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-2-1-6-2-10 1Z"/></svg></span><div><p class="mcr-guide-eyebrow">{{ title }} Help</p><h2 id="utility-guide-title">User Guide</h2><p class="mcr-guide-subtitle">Create passwords, customize options, and manage your history.</p></div><button class="mcr-guide-close" type="button" aria-label="Close user guide" @click="close">×</button></header>
      <div class="mcr-guide-options"><label><input v-model="paginated" type="checkbox" @change="showPage(0)">Paginate guide</label><select :value="page" aria-label="Guide section" @change="paginated = true; showPage($event.target.value)"><option v-for="(section,index) in sections" :key="section.title" :value="index">{{ index + 1 }}. {{ section.title }}</option></select></div>
      <div ref="content" class="mcr-guide-content"><article v-for="(section,index) in visible" :key="section.title" class="mcr-guide-topic"><span class="mcr-guide-number" aria-hidden="true">{{ String(paginated ? page + 1 : index + 1).padStart(2,'0') }}</span><div><h3>{{ section.title }}</h3><p v-for="line in section.lines" :key="line">{{ line }}</p></div></article></div>
      <nav v-if="paginated" class="mcr-guide-footer" aria-label="Guide pages"><button type="button" :disabled="page===0" @click="showPage(page-1)">Previous</button><span class="mcr-guide-status" role="status" aria-live="polite">Page {{ page+1 }} of {{ sections.length }}</span><button type="button" :disabled="page===sections.length-1" @click="showPage(page+1)">Next</button></nav>
    </dialog>
  </Teleport>
</template>
