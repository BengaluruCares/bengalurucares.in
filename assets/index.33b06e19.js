import{i as e,r as t,c as r,f as a,d as o,a as n}from"./vendor.e322686a.js";!function(e=".",t="__import__"){try{self[t]=new Function("u","return import(u)")}catch(r){const a=new URL(e,location),o=e=>{URL.revokeObjectURL(e.src),e.remove()};self[t]=e=>new Promise(((r,n)=>{const s=new URL(e,a);if(self[t].moduleMap[s])return r(self[t].moduleMap[s]);const c=new Blob([`import * as m from '${s}';`,`${t}.moduleMap['${s}']=m;`],{type:"text/javascript"}),l=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(c),onerror(){n(new Error(`Failed to import: ${e}`)),o(l)},onload(){r(self[t].moduleMap[s]),o(l)}});document.head.appendChild(l)})),self[t].moduleMap={}}}("https://bengalurucares.github.io/bengalurucares.in/assets/");function s(...e){let t="";return e.forEach((e=>{"string"==typeof e?t+=` ${e}`:Array.isArray(e)?t+=" "+s(...e):"object"==typeof e&&(t+=" "+s(...Object.keys(e).filter((t=>function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}(e,t)&&!!e[t]))))})),t}const c=e=>{const t=new AbortController;return{promise:fetch(e,{signal:t.signal}).then((e=>e.json())),controller:t}},l=e=>`https://bengalurucares.github.io/bengalurucares.in/${e}`;var u="_root_1u4sh_1",i="_focus_1u4sh_13",m="_input_1u4sh_21";const d=()=>{const[r,a]=e({focused:!1}),o=e=>{a((t=>{t.focused=e}))},n=s(u,{[i]:r.focused});return t.createElement("span",{className:n},t.createElement("input",{onBlur:()=>o(!1),onFocus:()=>o(!0),type:"text",className:m}))};var p="_root_17sip_4";const f=({className:e})=>{const r=s(p,e);return t.createElement("h1",{className:r},"Bengaluru Cares")},_=/^prod/i.test("production"),b=e=>(t,r,o)=>e((e=>t(a(e))),r,o),g={wardList:[]},h=(w="WardStore",y=e=>({state:g,updateState:(t,r)=>{e((e=>{e.state[t]=r}))}}),r(_?b(y):o((e=>(t,r,a)=>e((e=>{t(e),console.log("  %cNew State:: ","color: #ef9a9a",r().state)}),r,a))(b(y)),w)));var w,y;const E=()=>{const e=h((e=>e.updateState));return t.useEffect((()=>{let t=null;return(async()=>{const r=await c(l("/data/wards/metadata.json")).promise;for(let o=0;o<r.total;o++){if(t&&t.signal.aborted)return;const r=`${o+1}`.padStart(3,"0"),{promise:n,controller:s}=c(l(`/data/wards/${r}.json`));let u;t=s;try{u=await n}catch(a){}u||e("wardList",u)}})(),()=>{t&&t.abort()}}),[]),null};var j="_root_sgfps_1",v="_brandTitle_sgfps_11";const L=()=>t.createElement("div",{className:j},t.createElement(E,null),t.createElement(f,{className:v}),t.createElement(d,null));n.render(t.createElement(t.StrictMode,null,t.createElement(L,null)),document.getElementById("root"));
