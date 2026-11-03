(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))i(l);new MutationObserver(l=>{for(const r of l)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function o(l){const r={};return l.integrity&&(r.integrity=l.integrity),l.referrerPolicy&&(r.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?r.credentials="include":l.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(l){if(l.ep)return;l.ep=!0;const r=o(l);fetch(l.href,r)}})();const q=["あいどり","いぬ","うさぎ","えんぴつ","おかず","かえる","がっこう","きりん","くま","ぐりむ","けしごむ","こま","さくら","しろ","すし","せき","そら","たこ","ちょうちょ","つき","てんとう虫","どら焼き","なす","にほん","ぬりえ","ねこ","のこぎり","はやし","ひかり","ふくろう","へび","ほし","まつ","みず","むし","めがね","もも","やぎ","ゆき","よる","らっぱ","りんご","るすばん","れもん","ろうか","わに","ゐんか","うんち","ちょう","おうち","ちいさな","かなかな","なべ","べんとう","とうもろこし","しっぽ","ぽっぽ","ぴかぴか","かたつむり","むしとり","りす","すいか","かき","きのこ","こおり","りょうり","やさい","いちご","ごりら","らいおん","おに","にんじん","じゅうたん","たんぽぽ","ぽてと","とんぼ","ぼうし","しおかぜ","ぜんぶ","ぶどう","うどん","どんぐり","りゅう","ゆうひ","ひつじ","じてんしゃ","しゃぼん","ん"],F=["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ","ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を","ん"],R={が:"か",ぎ:"き",ぐ:"く",げ:"け",ご:"こ",ざ:"さ",じ:"し",ず:"す",ぜ:"せ",ぞ:"そ",だ:"た",ぢ:"ち",づ:"つ",で:"て",ど:"と",ば:"は",び:"ひ",ぶ:"ふ",べ:"へ",ぼ:"ほ",ぱ:"は",ぴ:"ひ",ぷ:"ふ",ぺ:"へ",ぽ:"ほ",ぁ:"あ",ぃ:"い",ぅ:"う",ぇ:"え",ぉ:"お",ゃ:"や",ゅ:"ゆ",ょ:"よ",っ:"つ",ゎ:"わ","ゕ":"か","ゖ":"け"},B=["https://ja.wiktionary.org/w/api.php","https://ja.wikipedia.org/w/api.php"];function T(e){return e.normalize("NFKC").replace(/[ァ-ヶヷ-ヺ]/g,n=>String.fromCharCode(n.charCodeAt(0)-96)).replace(/ー/g,"").replace(/\s+/g,"").replace(/[！-／：-＠［-｀｛-～]/g,"").replace(/[\u3000]/g,"")}function v(e){return R[e]||e}async function U(e){const n=m(e),o=n.replace(/[ぁ-ゖ]/g,s=>String.fromCharCode(s.charCodeAt(0)+96)),i=[...new Set([e.trim(),n,o])].join("|"),l=await Promise.all(B.map(async s=>{var h;const d=new URLSearchParams({action:"query",format:"json",titles:i,redirects:"1",prop:"pageprops|categories",ppprop:"defaultsort|disambiguation",clprop:"sortkeyprefix",cllimit:"max",origin:"*"}),f=new AbortController,t=setTimeout(()=>f.abort(),8e3);try{const a=await fetch(`${s}?${d}`,{signal:f.signal});if(!a.ok)return null;const p=await a.json(),k=Object.values(((h=p.query)==null?void 0:h.pages)||{}).filter(y=>!Object.hasOwn(y,"missing"));return k.length?k.map(y=>{var C,I;const A=[(I=(C=y.pageprops)==null?void 0:C.defaultsort)==null?void 0:I.split(/\s+/)[0],...(y.categories||[]).map($=>$.sortkeyprefix),y.title,n].filter(Boolean).map($=>m($)).find($=>/^[ぁ-ゖー]+$/.test($));return A?{found:!0,reading:A}:null}).find(Boolean)||{found:!0,reading:null}:!1}catch{return null}finally{clearTimeout(t)}})),r=l.find(s=>(s==null?void 0:s.found)&&s.reading);if(r)return r;if(l.some(s=>s==null?void 0:s.found))return{found:!0,reading:null};if(l.every(s=>s===!1))return{found:!1,reading:null};throw new Error("辞書に接続できませんでした。")}function m(e){return T(e).replace(/[\uFF01-\uFF5E]/g,o=>String.fromCharCode(o.charCodeAt(0)-65248)).replace(/\r|\n/g,"")}function H(e){return e.reduce((n,o)=>(n[o]=(n[o]||0)+1,n),{})}function j(e,n,o=!0){const i=[...e],l=H(i.map(v)),r=m(n);for(let s=o?1:0;s<r.length;s+=1){const d=v(r[s]);if((l[d]||0)<=0)return null;l[d]-=1;const f=i.findIndex(t=>v(t)===d);if(f===-1)return null;i.splice(f,1)}return i}function P(e,n,o){const i=m(e);if(!i)return{valid:!1,reason:"単語を入力してください。"};if(o&&v(i[0])!==v(o))return{valid:!1,reason:`先頭は「${o}」で始める必要があります。`};const l=H(n.map(v));for(let r=o?1:0;r<i.length;r+=1){const s=v(i[r]);if((l[s]||0)<=0)return{valid:!1,reason:`「${s}」は持ち駒にありません。`};l[s]-=1}return{valid:!0,reason:"OK"}}function W(e,n){return q.filter(o=>{const i=m(o);return!i||e&&v(i[0])!==v(e)?!1:P(i,n,e).valid})}function x(e,n){return W(e,n).filter(o=>!m(o).endsWith("ん"))}function K(e,n,o){const i=x(e,n);return i.length?i.map(l=>{const r=m(l),s=j(n,r,!!e),d=r.slice(-1),f=x(d,o).length,t=s?x(d,s).length:0,h=((s==null?void 0:s.length)===0?2e4:0)+(f===0?1e4:0)-f*20+Math.min(t,10)*3+r.length*2;return{word:r,score:h}}).sort((l,r)=>r.score-l.score)[0].word:null}function N(){return[...F]}function E(e,n){return{id:crypto.randomUUID(),name:e,isHuman:n,hand:N()}}function L(e="cpu"){const n=[E("プレイヤー1",!0),e==="cpu"?E("CPU",!1):E("プレイヤー2",!0)];return{mode:e,players:n,history:[],currentLead:null,activeIndex:0,gameOver:!1,winner:null,status:"好きな単語からどうぞ。",lastError:"",selectedWord:"",pending:!1,showRules:!1}}function b(e){return e.players[e.activeIndex]}function O(e){return e.players[(e.activeIndex+1)%e.players.length]}function M(e){return e.length?e.map(n=>`<span class="tile">${n}</span>`).join(""):'<div class="empty-hand">駒なし</div>'}function c(e,n){var s,d,f,t,h;const o=b(n);O(n);const i=!n.gameOver&&!n.pending&&o.isHuman,l=n.currentLead?W(n.currentLead,o.hand):q.filter(a=>P(m(a),o.hand,null).valid);e.innerHTML=`
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
          <div class="player-card ${n.activeIndex===0?"is-active":""}">
            <div class="player-header">
              <span>${n.players[0].name}</span>
              <span class="badge">${n.players[0].hand.length}枚</span>
            </div>
            <div class="hand">${M(n.players[0].hand)}</div>
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
            <div class="hand">${M(n.players[1].hand)}</div>
          </div>
        </section>

        <section class="controls">
          <label for="word-input">単語</label>
          <div class="input-row">
              <input id="word-input" type="text" value="${n.selectedWord}" placeholder="例: りんご" maxlength="20" ${i?"":"disabled"} />
            <button id="play-button" class="primary" ${i?"":"disabled"}>${n.pending?"確認中…":"使う"}</button>
            <button id="give-up" class="secondary" ${i?"":"disabled"}>ギブアップ</button>
          </div>

          <div class="suggestions">
            <p>作れる単語</p>
            <div class="suggestion-list">
              ${l.slice(0,8).map(a=>`<button type="button" class="suggestion" data-word="${a}" ${i?"":"disabled"}>${a}</button>`).join("")||'<span class="muted">候補なし</span>'}
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
  `;const r=document.querySelector("#word-input");r&&i&&(r.focus(),r.addEventListener("input",a=>{n.selectedWord=a.target.value})),(s=document.querySelector("#rules-toggle"))==null||s.addEventListener("click",()=>{n.showRules=!n.showRules,c(e,n)}),(d=document.querySelector("#play-button"))==null||d.addEventListener("click",()=>{const a=(r==null?void 0:r.value)||"";z(n,a)}),(f=document.querySelector("#give-up"))==null||f.addEventListener("click",()=>{if(n.gameOver||n.pending||!b(n).isHuman)return;const a=b(n),p=O(n);n.gameOver=!0,n.winner=p.name,n.status=`${a.name}がギブアップしました。${p.name}の勝ちです。`,n.lastError="",n.selectedWord="",c(e,n)}),(t=document.querySelector("#new-game"))==null||t.addEventListener("click",()=>{var g;const a=((g=document.querySelector("#mode-select"))==null?void 0:g.value)||"cpu",p=L(a);c(e,p),n.mode=a,n=p}),(h=document.querySelector("#mode-select"))==null||h.addEventListener("change",a=>{const p=a.target.value,g=L(p);c(e,g),n.mode=p,n=g}),document.querySelectorAll(".suggestion").forEach(a=>{a.addEventListener("click",()=>{const p=a.dataset.word||"",g=document.querySelector("#word-input");g&&(g.value=p,n.selectedWord=p)})})}async function z(e,n){if(e.gameOver||e.pending)return;const o=b(e);let i=m(n);const l=e.currentLead;if(!i){e.lastError="単語を入力してください。",c(u,e);return}if(o.isHuman){e.pending=!0,e.lastError="",c(u,e);try{const t=await U(n.trim());if(w!==e)return;if(e.pending=!1,!t.found){e.lastError="WikipediaまたはWiktionaryで見つかりませんでした。",c(u,e);return}if(!t.reading){e.lastError="辞書項目の読みを確認できませんでした。",c(u,e);return}i=t.reading}catch{if(w!==e)return;e.pending=!1,e.lastError="辞書に接続できませんでした。通信を確認して再度お試しください。",c(u,e);return}}const r=P(i,o.hand,l);if(!r.valid){e.lastError=r.reason,c(u,e);return}const s=j(o.hand,i,!!l);if(!s){e.lastError="その単語は持ち駒では作れません。",c(u,e);return}if(o.hand=s,e.history.push({player:o.name,word:i}),e.currentLead=m(i).slice(-1)||null,e.lastError="",e.selectedWord="",i.endsWith("ん")){const t=O(e);e.gameOver=!0,e.winner=t.name,e.status=`${o.name}は「ん」で終わる単語を言ったため敗北。${t.name}の勝利です。`,c(u,e);return}if(o.hand.length===0){e.gameOver=!0,e.winner=o.name,e.status=`${o.name}が駒を使い切りました。`,c(u,e);return}e.activeIndex=(e.activeIndex+1)%e.players.length;const d=b(e);if(!(d.isHuman?W(e.currentLead,d.hand):x(e.currentLead,d.hand)).length){e.gameOver=!0,e.winner=o.name,e.status=`${d.name}は作れる単語がありません。${o.name}の勝ちです。`,c(u,e);return}e.status=`${d.name}の番です。`,c(u,e),d.isHuman||setTimeout(()=>{if(w!==e||e.gameOver)return;const t=K(e.currentLead,d.hand,o.hand);if(!t){e.gameOver=!0,e.winner=o.name,e.status=`${d.name}は作れる単語がありません。${o.name}の勝ちです。`,c(u,e);return}z(e,t)},500)}let u,w;function _(){u=document.querySelector("#app"),w=L("cpu"),c(u,w)}_();
