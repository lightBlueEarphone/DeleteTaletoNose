(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function r(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(i){if(i.ep)return;i.ep=!0;const s=r(i);fetch(i.href,s)}})();const L=["あいどり","いぬ","うさぎ","えんぴつ","おかず","かえる","がっこう","きりん","くま","ぐりむ","けしごむ","こま","さくら","しろ","すし","せき","そら","たこ","ちょうちょ","つき","てんとう虫","どら焼き","なす","にほん","ぬりえ","ねこ","のこぎり","はやし","ひかり","ふくろう","へび","ほし","まつ","みず","むし","めがね","もも","やぎ","ゆき","よる","らっぱ","りんご","るすばん","れもん","ろうか","わに","ゐんか","うんち","ちょう","おうち","ちいさな","かなかな","なべ","べんとう","とうもろこし","しっぽ","ぽっぽ","ぴかぴか","かたつむり","むしとり","りす","すいか","かき","きのこ","こおり","りょうり","やさい","いちご","ごりら","らいおん","おに","にんじん","じゅうたん","たんぽぽ","ぽてと","とんぼ","ぼうし","しおかぜ","ぜんぶ","ぶどう","うどん","どんぐり","りゅう","ゆうひ","ひつじ","じてんしゃ","しゃぼん","ん"],q=["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ","ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を","ん"],k={が:"か",ぎ:"き",ぐ:"く",げ:"け",ご:"こ",ざ:"さ",じ:"し",ず:"す",ぜ:"せ",ぞ:"そ",だ:"た",ぢ:"ち",づ:"つ",で:"て",ど:"と",ば:"は",び:"ひ",ぶ:"ふ",べ:"へ",ぼ:"ほ",ぱ:"は",ぴ:"ひ",ぷ:"ふ",ぺ:"へ",ぽ:"ほ",ぁ:"あ",ぃ:"い",ぅ:"う",ぇ:"え",ぉ:"お",ゃ:"や",ゅ:"ゆ",ょ:"よ",っ:"つ",ゎ:"わ","ゕ":"か","ゖ":"け"},C=["https://ja.wiktionary.org/w/api.php","https://ja.wikipedia.org/w/api.php"];function H(e){return e.replace(/[ァ-ヶ]/g,n=>String.fromCharCode(n.charCodeAt(0)-96)).replace(/ー/g,"").replace(/\s+/g,"").replace(/[！-／：-＠［-｀｛-～]/g,"").replace(/[\u3000]/g,"")}function f(e){return k[e]||e}async function j(e){const n=await Promise.all(C.map(async o=>{var t,a,d;const i=new URLSearchParams({action:"query",format:"json",titles:e,redirects:"1",prop:"pageprops|categories",ppprop:"defaultsort|disambiguation",clprop:"sortkeyprefix",cllimit:"max",origin:"*"}),s=new AbortController,l=setTimeout(()=>s.abort(),8e3);try{const p=await fetch(`${o}?${i}`,{signal:s.signal});if(!p.ok)return null;const A=await p.json(),h=Object.values(((t=A.query)==null?void 0:t.pages)||{}).find(g=>!Object.hasOwn(g,"missing"));return h?{found:!0,reading:[(d=(a=h.pageprops)==null?void 0:a.defaultsort)==null?void 0:d.split(/\s+/)[0],...(h.categories||[]).map(g=>g.sortkeyprefix),h.title,e].filter(Boolean).map(g=>m(g)).find(g=>/^[ぁ-ゖー]+$/.test(g))||null}:!1}catch{return null}finally{clearTimeout(l)}})),r=n.find(o=>(o==null?void 0:o.found)&&o.reading);if(r)return r;if(n.some(o=>o==null?void 0:o.found))return{found:!0,reading:null};if(n.every(o=>o===!1))return{found:!1,reading:null};throw new Error("辞書に接続できませんでした。")}function m(e){return H(e).replace(/[\uFF01-\uFF5E]/g,r=>String.fromCharCode(r.charCodeAt(0)-65248)).replace(/\r|\n/g,"")}function I(e){return e.reduce((n,r)=>(n[r]=(n[r]||0)+1,n),{})}function M(e,n,r=!0){const o=[...e],i=I(o.map(f)),s=m(n);for(let l=r?1:0;l<s.length;l+=1){const t=f(s[l]);if((i[t]||0)<=0)return null;i[t]-=1;const a=o.findIndex(d=>f(d)===t);if(a===-1)return null;o.splice(a,1)}return o}function x(e,n,r){const o=m(e);if(!o)return{valid:!1,reason:"単語を入力してください。"};if(r&&f(o[0])!==f(r))return{valid:!1,reason:`先頭は「${r}」で始める必要があります。`};const i=I(n.map(f));for(let s=r?1:0;s<o.length;s+=1){const l=f(o[s]);if((i[l]||0)<=0)return{valid:!1,reason:`「${l}」は持ち駒にありません。`};i[l]-=1}return{valid:!0,reason:"OK"}}function E(e,n){return L.filter(r=>{const o=m(r);return!o||e&&f(o[0])!==f(e)?!1:x(o,n,e).valid})}function y(e,n){return E(e,n).filter(r=>!m(r).endsWith("ん"))}function z(e,n,r){const o=y(e,n);return o.length?o.map(i=>{const s=m(i),l=M(n,s,!!e),t=s.slice(-1),a=y(t,r).length,d=l?y(t,l).length:0,p=((l==null?void 0:l.length)===0?2e4:0)+(a===0?1e4:0)-a*20+Math.min(d,10)*3+s.length*2;return{word:s,score:p}}).sort((i,s)=>s.score-i.score)[0].word:null}function F(){return[...q]}function $(e,n){return{id:crypto.randomUUID(),name:e,isHuman:n,hand:F()}}function b(e="cpu"){const n=[$("プレイヤー1",!0),e==="cpu"?$("CPU",!1):$("プレイヤー2",!0)];return{mode:e,players:n,history:[],currentLead:null,activeIndex:0,gameOver:!1,winner:null,status:"好きな単語からどうぞ。",lastError:"",selectedWord:"",pending:!1}}function w(e){return e.players[e.activeIndex]}function W(e){return e.players[(e.activeIndex+1)%e.players.length]}function O(e){return e.length?e.map(n=>`<span class="tile">${n}</span>`).join(""):'<div class="empty-hand">駒なし</div>'}function c(e,n){var s,l,t;const r=w(n);W(n);const o=n.currentLead?E(n.currentLead,r.hand):L.filter(a=>x(m(a),r.hand,null).valid);e.innerHTML=`
    <div class="shell">
      <header class="topbar">
        <h1>消去しりとり</h1>
        <div class="toolbar">
          <label>
            対戦モード
            <select id="mode-select">
              <option value="cpu" ${n.mode==="cpu"?"selected":""}>CPU対戦</option>
              <option value="local" ${n.mode==="local"?"selected":""}>ローカル対戦</option>
            </select>
          </label>
          <button id="new-game" class="primary">最初から</button>
        </div>
      </header>

      <main class="board">
        <section class="arena">
          <div class="player-card ${n.activeIndex===0?"is-active":""}">
            <div class="player-header">
              <span>${n.players[0].name}</span>
              <span class="badge">${n.players[0].hand.length}枚</span>
            </div>
            <div class="hand">${O(n.players[0].hand)}</div>
          </div>

          <div class="status-panel ${n.gameOver?"is-game-over":""}">
            <div class="lead-box">
              <span class="lead-label">次の文字</span>
              <strong>${n.currentLead?n.currentLead:"自由"}</strong>
            </div>
            <p class="status-text">${n.status}</p>
            ${n.lastError?`<p class="status-error">${n.lastError}</p>`:""}
            ${n.gameOver?`<p class="winner-box">勝者: ${n.winner}</p>`:""}
          </div>

          <div class="player-card ${n.activeIndex===1?"is-active":""}">
            <div class="player-header">
              <span>${n.players[1].name}</span>
              <span class="badge">${n.players[1].hand.length}枚</span>
            </div>
            <div class="hand">${O(n.players[1].hand)}</div>
          </div>
        </section>

        <section class="controls">
          <label for="word-input">単語</label>
          <div class="input-row">
              <input id="word-input" type="text" value="${n.selectedWord}" placeholder="例: りんご" maxlength="20" ${n.gameOver||n.pending?"disabled":""} />
            <button id="play-button" class="primary" ${n.gameOver||n.pending?"disabled":""}>${n.pending?"確認中…":"使う"}</button>
          </div>

          <div class="suggestions">
            <p>作れる単語</p>
            <div class="suggestion-list">
              ${o.slice(0,8).map(a=>`<button type="button" class="suggestion" data-word="${a}" ${n.pending?"disabled":""}>${a}</button>`).join("")||'<span class="muted">候補なし</span>'}
            </div>
          </div>
        </section>

        <section class="history-panel">
          <h2>履歴</h2>
          <ol>
            ${n.history.length?n.history.map(a=>`<li>${a.player}: ${a.word}</li>`).join(""):"<li>まだありません</li>"}
          </ol>
        </section>
      </main>
    </div>
  `;const i=document.querySelector("#word-input");i&&!n.gameOver&&!n.pending&&(i.focus(),i.addEventListener("input",a=>{n.selectedWord=a.target.value})),(s=document.querySelector("#play-button"))==null||s.addEventListener("click",()=>{const a=(i==null?void 0:i.value)||"";P(n,a)}),(l=document.querySelector("#new-game"))==null||l.addEventListener("click",()=>{var p;const a=((p=document.querySelector("#mode-select"))==null?void 0:p.value)||"cpu",d=b(a);c(e,d),n.mode=a,n=d}),(t=document.querySelector("#mode-select"))==null||t.addEventListener("change",a=>{const d=a.target.value,p=b(d);c(e,p),n.mode=d,n=p}),document.querySelectorAll(".suggestion").forEach(a=>{a.addEventListener("click",()=>{const d=a.dataset.word||"",p=document.querySelector("#word-input");p&&(p.value=d,n.selectedWord=d)})})}async function P(e,n){if(e.gameOver||e.pending)return;const r=w(e);let o=m(n);const i=e.currentLead;if(!o){e.lastError="単語を入力してください。",c(u,e);return}if(r.isHuman){e.pending=!0,e.lastError="",c(u,e);try{const d=await j(n.trim());if(v!==e)return;if(e.pending=!1,!d.found){e.lastError="WikipediaまたはWiktionaryで見つかりませんでした。",c(u,e);return}if(!d.reading){e.lastError="辞書項目の読みを確認できませんでした。",c(u,e);return}o=d.reading}catch{if(v!==e)return;e.pending=!1,e.lastError="辞書に接続できませんでした。通信を確認して再度お試しください。",c(u,e);return}}const s=x(o,r.hand,i);if(!s.valid){e.lastError=s.reason,c(u,e);return}const l=M(r.hand,o,!!i);if(!l){e.lastError="その単語は持ち駒では作れません。",c(u,e);return}if(r.hand=l,e.history.push({player:r.name,word:o}),e.currentLead=m(o).slice(-1)||null,e.lastError="",e.selectedWord="",o.endsWith("ん")){const d=W(e);e.gameOver=!0,e.winner=d.name,e.status=`${r.name}は「ん」で終わる単語を言ったため敗北。${d.name}の勝利です。`,c(u,e);return}if(r.hand.length===0){e.gameOver=!0,e.winner=r.name,e.status=`${r.name}が駒を使い切りました。`,c(u,e);return}e.activeIndex=(e.activeIndex+1)%e.players.length;const t=w(e);if(!(t.isHuman?E(e.currentLead,t.hand):y(e.currentLead,t.hand)).length){e.gameOver=!0,e.winner=r.name,e.status=`${t.name}は作れる単語がありません。${r.name}の勝ちです。`,c(u,e);return}e.status=`${t.name}の番です。`,c(u,e),t.isHuman||setTimeout(()=>{if(v!==e||e.gameOver)return;const d=z(e.currentLead,t.hand,r.hand);if(!d){e.gameOver=!0,e.winner=r.name,e.status=`${t.name}は作れる単語がありません。${r.name}の勝ちです。`,c(u,e);return}P(e,d)},500)}let u,v;function B(){u=document.querySelector("#app"),v=b("cpu"),c(u,v)}B();
