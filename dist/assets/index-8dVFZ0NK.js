(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))l(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&l(i)}).observe(document,{childList:!0,subtree:!0});function r(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(s){if(s.ep)return;s.ep=!0;const o=r(s);fetch(s.href,o)}})();const H=["あいどり","いぬ","うさぎ","えんぴつ","おかず","かえる","がっこう","きりん","くま","ぐりむ","けしごむ","こま","さくら","しろ","すし","せき","そら","たこ","ちょうちょ","つき","てんとう虫","どら焼き","なす","にほん","ぬりえ","ねこ","のこぎり","はやし","ひかり","ふくろう","へび","ほし","まつ","みず","むし","めがね","もも","やぎ","ゆき","よる","らっぱ","りんご","るすばん","れもん","ろうか","わに","ゐんか","うんち","ちょう","おうち","ちいさな","かなかな","なべ","べんとう","とうもろこし","しっぽ","ぽっぽ","ぴかぴか","かたつむり","むしとり","りす","すいか","かき","きのこ","こおり","りょうり","やさい","いちご","ごりら","らいおん","おに","にんじん","じゅうたん","たんぽぽ","ぽてと","とんぼ","ぼうし","しおかぜ","ぜんぶ","ぶどう","うどん","どんぐり","りゅう","ゆうひ","ひつじ","じてんしゃ","しゃぼん","ん"],F=["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ","ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を","ん"],R={が:"か",ぎ:"き",ぐ:"く",げ:"け",ご:"こ",ざ:"さ",じ:"し",ず:"す",ぜ:"せ",ぞ:"そ",だ:"た",ぢ:"ち",づ:"つ",で:"て",ど:"と",ば:"は",び:"ひ",ぶ:"ふ",べ:"へ",ぼ:"ほ",ぱ:"は",ぴ:"ひ",ぷ:"ふ",ぺ:"へ",ぽ:"ほ",ぁ:"あ",ぃ:"い",ぅ:"う",ぇ:"え",ぉ:"お",ゃ:"や",ゅ:"ゆ",ょ:"よ",っ:"つ",ゎ:"わ","ゕ":"か","ゖ":"け"},B=["https://ja.wiktionary.org/w/api.php","https://ja.wikipedia.org/w/api.php"];function T(e){return e.normalize("NFKC").replace(/[ァ-ヶヷ-ヺ]/g,n=>String.fromCharCode(n.charCodeAt(0)-96)).replace(/ー/g,"").replace(/\s+/g,"").replace(/[！-／：-＠［-｀｛-～]/g,"").replace(/[\u3000]/g,"")}function v(e){return R[e]||e}async function U(e){const n=m(e),r=n.replace(/[ぁ-ゖ]/g,i=>String.fromCharCode(i.charCodeAt(0)+96)),l=[...new Set([e.trim(),n,r])].join("|"),s=await Promise.all(B.map(async i=>{var h;const d=new URLSearchParams({action:"query",format:"json",titles:l,redirects:"1",prop:"pageprops|categories",ppprop:"defaultsort|disambiguation",clprop:"sortkeyprefix",cllimit:"max",origin:"*"}),f=new AbortController,c=setTimeout(()=>f.abort(),8e3);try{const a=await fetch(`${i}?${d}`,{signal:f.signal});if(!a.ok)return null;const p=await a.json(),W=Object.values(((h=p.query)==null?void 0:h.pages)||{}).filter(y=>!Object.hasOwn(y,"missing"));return W.length?W.map(y=>{var C,M;const A=[(M=(C=y.pageprops)==null?void 0:C.defaultsort)==null?void 0:M.split(/\s+/)[0],...(y.categories||[]).map($=>$.sortkeyprefix),y.title,n].filter(Boolean).map($=>m($)).find($=>/^[ぁ-ゖー]+$/.test($));return A?{found:!0,reading:A}:null}).find(Boolean)||{found:!0,reading:null}:!1}catch{return null}finally{clearTimeout(c)}})),o=s.find(i=>(i==null?void 0:i.found)&&i.reading);if(o)return o;if(s.some(i=>i==null?void 0:i.found))return{found:!0,reading:null};if(s.every(i=>i===!1))return{found:!1,reading:null};throw new Error("辞書に接続できませんでした。")}function m(e){return T(e).replace(/[\uFF01-\uFF5E]/g,r=>String.fromCharCode(r.charCodeAt(0)-65248)).replace(/\r|\n/g,"")}function j(e){return e.reduce((n,r)=>(n[r]=(n[r]||0)+1,n),{})}function z(e,n,r=!0){const l=[...e],s=j(l.map(v)),o=m(n);for(let i=r?1:0;i<o.length;i+=1){const d=v(o[i]);if((s[d]||0)<=0)return null;s[d]-=1;const f=l.findIndex(c=>v(c)===d);if(f===-1)return null;l.splice(f,1)}return l}function I(e,n,r){const l=m(e);if(!l)return{valid:!1,reason:"単語を入力してください。"};if(r&&v(l[0])!==v(r))return{valid:!1,reason:`先頭は「${r}」で始める必要があります。`};const s=j(n.map(v));for(let o=r?1:0;o<l.length;o+=1){const i=v(l[o]);if((s[i]||0)<=0)return{valid:!1,reason:`「${i}」は持ち駒にありません。`};s[i]-=1}return{valid:!0,reason:"OK"}}function P(e,n){return H.filter(r=>{const l=m(r);return!l||e&&v(l[0])!==v(e)?!1:I(l,n,e).valid})}function x(e,n){return P(e,n).filter(r=>!m(r).endsWith("ん"))}function K(e,n,r){const l=x(e,n);return l.length?l.map(s=>{const o=m(s),i=z(n,o,!!e),d=o.slice(-1),f=x(d,r).length,c=i?x(d,i).length:0,h=((i==null?void 0:i.length)===0?2e4:0)+(f===0?1e4:0)-f*20+Math.min(c,10)*3+o.length*2;return{word:o,score:h}}).sort((s,o)=>o.score-s.score)[0].word:null}function N(){return[...F]}function E(e,n){return{id:crypto.randomUUID(),name:e,isHuman:n,hand:N()}}function L(e="cpu"){const n=[E("プレイヤー1",!0),e==="cpu"?E("CPU",!1):E("プレイヤー2",!0)];return{mode:e,players:n,history:[],currentLead:null,activeIndex:0,gameOver:!1,winner:null,status:"好きな単語からどうぞ。",lastError:"",selectedWord:"",pending:!1,showRules:!1}}function b(e){return e.players[e.activeIndex]}function O(e){return e.players[(e.activeIndex+1)%e.players.length]}function q(e){return e.length?e.map(n=>`<span class="tile">${n}</span>`).join(""):'<div class="empty-hand">駒なし</div>'}function t(e,n){var i,d,f,c,h;const r=b(n);O(n);const l=!n.gameOver&&!n.pending&&r.isHuman,s=n.currentLead?P(n.currentLead,r.hand):H.filter(a=>I(m(a),r.hand,null).valid);e.innerHTML=`
    <div class="shell">
      <header class="topbar">
        <div class="brand">
          <h1>消去しりとり</h1>
        </div>
        <div class="toolbar">
          <label>
            対戦モード
            <select id="mode-select">
              <option value="cpu" ${n.mode==="cpu"?"selected":""}>CPU対戦</option>
              <option value="local" ${n.mode==="local"?"selected":""}>ローカル対戦</option>
            </select>
          </label>
          <button id="new-game" class="primary">最初から</button>
          <button
            id="rules-toggle"
            class="secondary"
            type="button"
            aria-expanded="${n.showRules}"
            aria-controls="rules-panel"
          >${n.showRules?"遊び方を閉じる":"遊び方"}</button>
        </div>
      </header>

      ${n.showRules?`
        <section id="rules-panel" class="rules-panel" aria-labelledby="rules-title">
          <div class="rules-heading">
            <h2 id="rules-title">遊び方</h2>
          </div>
          <ol class="rules-list">
            <li>最初の単語は自由です。次の単語は、前の単語の最後の文字から始めます。</li>
            <li>単語の先頭以外の文字は、持ち駒から使います。使った駒は戻りません。</li>
            <li>「ん」で終わる単語を言うと負けです。持ち駒を先に使い切るか、相手が単語を作れなくなると勝ちです。</li>
          </ol>
          <p class="rules-note">単語の読みを確認するにはインターネット接続が必要です。</p>
        </section>
      `:""}

      <main class="board">
        <section class="arena">
          <div class="player-card ${n.activeIndex===0?"is-active":""}" role="group" aria-label="${n.players[0].name}の持ち駒">
            <div class="player-header">
              <span>${n.players[0].name}</span>
              <span class="badge">${n.players[0].hand.length}枚${n.activeIndex===0?"・手番":""}</span>
            </div>
            <div class="hand" role="group" aria-label="持ち駒 ${n.players[0].hand.length}枚">${q(n.players[0].hand)}</div>
          </div>

          <div class="status-panel ${n.gameOver?"is-game-over":""}">
            <div class="lead-box">
              <span class="lead-label">次の文字</span>
              <strong>${n.currentLead?n.currentLead:"自由"}</strong>
            </div>
            <p class="status-text" role="status" aria-live="polite">${n.status}</p>
            ${n.lastError?`<p class="status-error" role="alert">${n.lastError}</p>`:""}
            ${n.gameOver?`<p class="winner-box">勝者: ${n.winner}</p>`:""}
          </div>

          <div class="player-card ${n.activeIndex===1?"is-active":""}" role="group" aria-label="${n.players[1].name}の持ち駒">
            <div class="player-header">
              <span>${n.players[1].name}</span>
              <span class="badge">${n.players[1].hand.length}枚${n.activeIndex===1?"・手番":""}</span>
            </div>
            <div class="hand" role="group" aria-label="持ち駒 ${n.players[1].hand.length}枚">${q(n.players[1].hand)}</div>
          </div>
        </section>

        <section class="controls">
          <label for="word-input">単語</label>
          <div class="input-row">
              <input id="word-input" type="text" value="${n.selectedWord}" placeholder="例: りんご" maxlength="20" autocomplete="off" aria-label="単語を入力" ${l?"":"disabled"} />
            <button id="play-button" class="primary" ${l?"":"disabled"}>${n.pending?"確認中…":"単語を使う"}</button>
            <button id="give-up" class="secondary" ${l?"":"disabled"}>ギブアップ</button>
          </div>

          <div class="suggestions">
            <p>作れる単語</p>
            <div class="suggestion-list">
              ${s.slice(0,8).map(a=>`<button type="button" class="suggestion" data-word="${a}" ${l?"":"disabled"}>${a}</button>`).join("")||'<span class="muted">候補なし</span>'}
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
  `;const o=document.querySelector("#word-input");o&&l&&(o.addEventListener("input",a=>{n.selectedWord=a.target.value}),o.addEventListener("keydown",a=>{a.key==="Enter"&&(a.preventDefault(),k(n,o.value))})),(i=document.querySelector("#rules-toggle"))==null||i.addEventListener("click",()=>{n.showRules=!n.showRules,t(e,n)}),(d=document.querySelector("#play-button"))==null||d.addEventListener("click",()=>{const a=(o==null?void 0:o.value)||"";k(n,a)}),(f=document.querySelector("#give-up"))==null||f.addEventListener("click",()=>{if(n.gameOver||n.pending||!b(n).isHuman)return;const a=b(n),p=O(n);n.gameOver=!0,n.winner=p.name,n.status=`${a.name}がギブアップしました。${p.name}の勝ちです。`,n.lastError="",n.selectedWord="",t(e,n)}),(c=document.querySelector("#new-game"))==null||c.addEventListener("click",()=>{var g;const a=((g=document.querySelector("#mode-select"))==null?void 0:g.value)||"cpu",p=L(a);t(e,p),n.mode=a,n=p}),(h=document.querySelector("#mode-select"))==null||h.addEventListener("change",a=>{const p=a.target.value,g=L(p);t(e,g),n.mode=p,n=g}),document.querySelectorAll(".suggestion").forEach(a=>{a.addEventListener("click",()=>{const p=a.dataset.word||"",g=document.querySelector("#word-input");g&&(g.value=p,n.selectedWord=p)})})}async function k(e,n){if(e.gameOver||e.pending)return;const r=b(e);let l=m(n);const s=e.currentLead;if(!l){e.lastError="単語を入力してください。",t(u,e);return}if(r.isHuman){e.pending=!0,e.lastError="",t(u,e);try{const c=await U(n.trim());if(w!==e)return;if(e.pending=!1,!c.found){e.lastError="WikipediaまたはWiktionaryで見つかりませんでした。",t(u,e);return}if(!c.reading){e.lastError="辞書項目の読みを確認できませんでした。",t(u,e);return}l=c.reading}catch{if(w!==e)return;e.pending=!1,e.lastError="辞書に接続できませんでした。通信を確認して再度お試しください。",t(u,e);return}}const o=I(l,r.hand,s);if(!o.valid){e.lastError=o.reason,t(u,e);return}const i=z(r.hand,l,!!s);if(!i){e.lastError="その単語は持ち駒では作れません。",t(u,e);return}if(r.hand=i,e.history.push({player:r.name,word:l}),e.currentLead=m(l).slice(-1)||null,e.lastError="",e.selectedWord="",l.endsWith("ん")){const c=O(e);e.gameOver=!0,e.winner=c.name,e.status=`${r.name}は「ん」で終わる単語を言ったため敗北。${c.name}の勝利です。`,t(u,e);return}if(r.hand.length===0){e.gameOver=!0,e.winner=r.name,e.status=`${r.name}が駒を使い切りました。`,t(u,e);return}e.activeIndex=(e.activeIndex+1)%e.players.length;const d=b(e);if(!(d.isHuman?P(e.currentLead,d.hand):x(e.currentLead,d.hand)).length){e.gameOver=!0,e.winner=r.name,e.status=`${d.name}は作れる単語がありません。${r.name}の勝ちです。`,t(u,e);return}e.status=`${d.name}の番です。`,t(u,e),d.isHuman||setTimeout(()=>{if(w!==e||e.gameOver)return;const c=K(e.currentLead,d.hand,r.hand);if(!c){e.gameOver=!0,e.winner=r.name,e.status=`${d.name}は作れる単語がありません。${r.name}の勝ちです。`,t(u,e);return}k(e,c)},500)}let u,w;function D(){u=document.querySelector("#app"),w=L("cpu"),t(u,w)}D();
