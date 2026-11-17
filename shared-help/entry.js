import { createApp, h, ref } from 'vue';
import SuiteHelp from './SuiteHelp.vue';
import packageInfo from '../package.json';
import details from './content.json';
const container=document.createElement('div');
container.className='shared-suite-help';
container.style.cssText='display:flex;align-items:center;flex:0 0 auto;';
// Place the shared Help button below the generator options.
function placeHelp(){
 const target=document.querySelector('#password-generator-help');
 if(target&&container.parentElement!==target)target.append(container);
}
placeHelp();
new MutationObserver(()=>{if(!container.isConnected)placeHelp();}).observe(document.body,{childList:true,subtree:true});
const theme=ref(document.documentElement.dataset.theme==='light'?'light':'dark');
const observer=new MutationObserver(()=>{theme.value=document.documentElement.dataset.theme==='light'?'light':'dark';});
observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
createApp({render:()=>h(SuiteHelp,{...details,placement:'inline',version:packageInfo.version,theme:theme.value,comingSoon:details.comingSoon})}).mount(container);
