import{s as A,d as D,n as R,r as F,o as H}from"../chunks/scheduler.DUa3pFyD.js";import{S as L,i as M,e as u,s as _,c as f,d as E,g as k,h as x,m as y,n,j as V,k as o,o as w}from"../chunks/index.DTG4TIt5.js";function W(m){let e,t,S,p,a,l,T="Reload Feed",g,s,h="Reconnect Server",v,r,U="Camera On",I,i,N="Camera Off",B,d,P="Reboot System",O,q;return{c(){e=u("div"),t=u("iframe"),p=_(),a=u("div"),l=u("button"),l.textContent=T,g=_(),s=u("button"),s.textContent=h,v=_(),r=u("button"),r.textContent=U,I=_(),i=u("button"),i.textContent=N,B=_(),d=u("button"),d.textContent=P,this.h()},l(C){e=f(C,"DIV",{id:!0,class:!0});var b=E(e);t=f(b,"IFRAME",{id:!0,title:!0,src:!0,frameborder:!0,class:!0}),E(t).forEach(k),p=x(b),a=f(b,"DIV",{id:!0,class:!0});var c=E(a);l=f(c,"BUTTON",{id:!0,class:!0,"data-svelte-h":!0}),y(l)!=="svelte-po3z75"&&(l.textContent=T),g=x(c),s=f(c,"BUTTON",{id:!0,class:!0,"data-svelte-h":!0}),y(s)!=="svelte-13lp7a8"&&(s.textContent=h),v=x(c),r=f(c,"BUTTON",{id:!0,class:!0,"data-svelte-h":!0}),y(r)!=="svelte-1yhpnc4"&&(r.textContent=U),I=x(c),i=f(c,"BUTTON",{id:!0,class:!0,"data-svelte-h":!0}),y(i)!=="svelte-2r0cii"&&(i.textContent=N),B=x(c),d=f(c,"BUTTON",{id:!0,class:!0,"data-svelte-h":!0}),y(d)!=="svelte-foxova"&&(d.textContent=P),c.forEach(k),b.forEach(k),this.h()},h(){n(t,"id","stream"),n(t,"title","Live Stream"),D(t.src,S="")||n(t,"src",S),n(t,"frameborder","0"),n(t,"class","svelte-19yvhab"),n(l,"id","reload"),n(l,"class","svelte-19yvhab"),n(s,"id","reconnect"),n(s,"class","svelte-19yvhab"),n(r,"id","on"),n(r,"class","svelte-19yvhab"),n(i,"id","off"),n(i,"class","svelte-19yvhab"),n(d,"id","reboot"),n(d,"class","svelte-19yvhab"),n(a,"id","buttons"),n(a,"class","svelte-19yvhab"),n(e,"id","main"),n(e,"class","svelte-19yvhab")},m(C,b){V(C,e,b),o(e,t),o(e,p),o(e,a),o(a,l),o(a,g),o(a,s),o(a,v),o(a,r),o(a,I),o(a,i),o(a,B),o(a,d),O||(q=[w(l,"click",m[0]),w(s,"click",m[1]),w(r,"click",m[2]),w(i,"click",m[3]),w(d,"click",m[4])],O=!0)},p:R,i:R,o:R,d(C){C&&k(e),O=!1,F(q)}}}function $(m){let e="localhost",t;H(()=>{const g=new URLSearchParams(location.search),s=window.localStorage,h=g.get("client");if(h===null){if(s.length===0){alert("Creating new client. Page will refresh to add new parameter."),location.href="?client=0";return}alert("Attempting last client. Page will refresh to add client parameter."),location.href="?client="+(s.length-1);return}const v=s.getItem(h);v===null?(e=prompt("Camera IP/Hostname")||"localhost",s.setItem(h,e)):e=v,document.getElementById("stream").src="http://"+e+":8889/cam",t=new WebSocket("wss://"+e+":3000"),t.onmessage=r=>{console.log(r.data)},t.onerror=()=>{alert("Connection error. Refreshing page."),location.reload()},t.onclose=()=>{alert("Connection closed. Refreshing page."),location.reload()},t.send("status")});function S(){document.getElementById("stream").src="http://"+e+":8889/cam"}function p(){t=new WebSocket(t.url)}function a(){t.send("on")}function l(){t.send("off")}function T(){t.send("reboot")}return[S,p,a,l,T]}class G extends L{constructor(e){super(),M(this,e,$,W,A,{})}}export{G as component};