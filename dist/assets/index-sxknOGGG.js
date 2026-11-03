(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function o(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=o(a);fetch(a.href,r)}})();const k=["あいどり","いぬ","うさぎ","えんぴつ","おかず","かえる","がっこう","きりん","くま","ぐりむ","けしごむ","こま","さくら","しろ","すし","せき","そら","たこ","ちょうちょ","つき","てんとう虫","どら焼き","なす","にほん","ぬりえ","ねこ","のこぎり","はやし","ひかり","ふくろう","へび","ほし","まつ","みず","むし","めがね","もも","やぎ","ゆき","よる","らっぱ","りんご","るすばん","れもん","ろうか","わに","ゐんか","うんち","ちょう","おうち","ちいさな","かなかな","なべ","べんとう","とうもろこし","しっぽ","ぽっぽ","ぴかぴか","かたつむり","むしとり","りす","すいか","かき","きのこ","こおり","りょうり","やさい","いちご","ごりら","らいおん","おに","にんじん","じゅうたん","たんぽぽ","ぽてと","とんぼ","ぼうし","しおかぜ","ぜんぶ","ぶどう","うどん","どんぐり","りゅう","ゆうひ","ひつじ","じてんしゃ","しゃぼん","ん"],z=["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ","ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を","ん"],F={が:"か",ぎ:"き",ぐ:"く",げ:"け",ご:"こ",ざ:"さ",じ:"し",ず:"す",ぜ:"せ",ぞ:"そ",だ:"た",ぢ:"ち",づ:"つ",で:"て",ど:"と",ば:"は",び:"ひ",ぶ:"ふ",べ:"へ",ぼ:"ほ",ぱ:"は",ぴ:"ひ",ぷ:"ふ",ぺ:"へ",ぽ:"ほ",ぁ:"あ",ぃ:"い",ぅ:"う",ぇ:"え",ぉ:"お",ゃ:"や",ゅ:"ゆ",ょ:"よ",っ:"つ",ゎ:"わ","ゕ":"か","ゖ":"け"},B=["https://ja.wiktionary.org/w/api.php","https://ja.wikipedia.org/w/api.php"];function T(e){return e.normalize("NFKC").replace(/[ァ-ヶヷ-ヺ]/g,n=>String.fromCharCode(n.charCodeAt(0)-96)).replace(/ー/g,"").replace(/\s+/g,"").replace(/[！-／：-＠［-｀｛-～]/g,"").replace(/[\u3000]/g,"")}function v(e){return F[e]||e}async function U(e){const n=g(e),o=n.replace(/[ぁ-ゖ]/g,i=>String.fromCharCode(i.charCodeAt(0)+96)),s=[...new Set([e.trim(),n,o])].join("|"),a=await Promise.all(B.map(async i=>{var l;const d=new URLSearchParams({action:"query",format:"json",titles:s,redirects:"1",prop:"pageprops|categories",ppprop:"defaultsort|disambiguation",clprop:"sortkeyprefix",cllimit:"max",origin:"*"}),f=new AbortController,t=setTimeout(()=>f.abort(),8e3);try{const u=await fetch(`${i}?${d}`,{signal:f.signal});if(!u.ok)return null;const m=await u.json(),W=Object.values(((l=m.query)==null?void 0:l.pages)||{}).filter(h=>!Object.hasOwn(h,"missing"));return W.length?W.map(h=>{var C,I;const A=[(I=(C=h.pageprops)==null?void 0:C.defaultsort)==null?void 0:I.split(/\s+/)[0],...(h.categories||[]).map(y=>y.sortkeyprefix),h.title,n].filter(Boolean).map(y=>g(y)).find(y=>/^[ぁ-ゖー]+$/.test(y));return A?{found:!0,reading:A}:null}).find(Boolean)||{found:!0,reading:null}:!1}catch{return null}finally{clearTimeout(t)}})),r=a.find(i=>(i==null?void 0:i.found)&&i.reading);if(r)return r;if(a.some(i=>i==null?void 0:i.found))return{found:!0,reading:null};if(a.every(i=>i===!1))return{found:!1,reading:null};throw new Error("辞書に接続できませんでした。")}function g(e){return T(e).replace(/[\uFF01-\uFF5E]/g,o=>String.fromCharCode(o.charCodeAt(0)-65248)).replace(/\r|\n/g,"")}function q(e){return e.reduce((n,o)=>(n[o]=(n[o]||0)+1,n),{})}function H(e,n,o=!0){const s=[...e],a=q(s.map(v)),r=g(n);for(let i=o?1:0;i<r.length;i+=1){const d=v(r[i]);if((a[d]||0)<=0)return null;a[d]-=1;const f=s.findIndex(t=>v(t)===d);if(f===-1)return null;s.splice(f,1)}return s}function O(e,n,o){const s=g(e);if(!s)return{valid:!1,reason:"単語を入力してください。"};if(o&&v(s[0])!==v(o))return{valid:!1,reason:`先頭は「${o}」で始める必要があります。`};const a=q(n.map(v));for(let r=o?1:0;r<s.length;r+=1){const i=v(s[r]);if((a[i]||0)<=0)return{valid:!1,reason:`「${i}」は持ち駒にありません。`};a[i]-=1}return{valid:!0,reason:"OK"}}function P(e,n){return k.filter(o=>{const s=g(o);return!s||e&&v(s[0])!==v(e)?!1:O(s,n,e).valid})}function w(e,n){return P(e,n).filter(o=>!g(o).endsWith("ん"))}function K(e,n,o){const s=w(e,n);return s.length?s.map(a=>{const r=g(a),i=H(n,r,!!e),d=r.slice(-1),f=w(d,o).length,t=i?w(d,i).length:0,l=((i==null?void 0:i.length)===0?2e4:0)+(f===0?1e4:0)-f*20+Math.min(t,10)*3+r.length*2;return{word:r,score:l}}).sort((a,r)=>r.score-a.score)[0].word:null}function N(){return[...z]}function x(e,n){return{id:crypto.randomUUID(),name:e,isHuman:n,hand:N()}}function E(e="cpu"){const n=[x("プレイヤー1",!0),e==="cpu"?x("CPU",!1):x("プレイヤー2",!0)];return{mode:e,players:n,history:[],currentLead:null,activeIndex:0,gameOver:!1,winner:null,status:"好きな単語からどうぞ。",lastError:"",selectedWord:"",pending:!1}}function $(e){return e.players[e.activeIndex]}function L(e){return e.players[(e.activeIndex+1)%e.players.length]}function M(e){return e.length?e.map(n=>`<span class="tile">${n}</span>`).join(""):'<div class="empty-hand">駒なし</div>'}function c(e,n){var i,d,f,t;const o=$(n);L(n);const s=!n.gameOver&&!n.pending&&o.isHuman,a=n.currentLead?P(n.currentLead,o.hand):k.filter(l=>O(g(l),o.hand,null).valid);e.innerHTML=`
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
              <input id="word-input" type="text" value="${n.selectedWord}" placeholder="例: りんご" maxlength="20" ${s?"":"disabled"} />
            <button id="play-button" class="primary" ${s?"":"disabled"}>${n.pending?"確認中…":"使う"}</button>
            <button id="give-up" class="secondary" ${s?"":"disabled"}>ギブアップ</button>
          </div>

          <div class="suggestions">
            <p>作れる単語</p>
            <div class="suggestion-list">
              ${a.slice(0,8).map(l=>`<button type="button" class="suggestion" data-word="${l}" ${s?"":"disabled"}>${l}</button>`).join("")||'<span class="muted">候補なし</span>'}
            </div>
          </div>
        </section>

        <section class="history-panel">
          <h2>履歴</h2>
          <ol>
            ${n.history.length?n.history.map(l=>`<li>${l.player}: ${l.word}</li>`).join(""):"<li>まだありません</li>"}
          </ol>
        </section>
      </main>
    </div>
  `;const r=document.querySelector("#word-input");r&&s&&(r.focus(),r.addEventListener("input",l=>{n.selectedWord=l.target.value})),(i=document.querySelector("#play-button"))==null||i.addEventListener("click",()=>{const l=(r==null?void 0:r.value)||"";j(n,l)}),(d=document.querySelector("#give-up"))==null||d.addEventListener("click",()=>{if(n.gameOver||n.pending||!$(n).isHuman)return;const l=$(n),u=L(n);n.gameOver=!0,n.winner=u.name,n.status=`${l.name}がギブアップしました。${u.name}の勝ちです。`,n.lastError="",n.selectedWord="",c(e,n)}),(f=document.querySelector("#new-game"))==null||f.addEventListener("click",()=>{var m;const l=((m=document.querySelector("#mode-select"))==null?void 0:m.value)||"cpu",u=E(l);c(e,u),n.mode=l,n=u}),(t=document.querySelector("#mode-select"))==null||t.addEventListener("change",l=>{const u=l.target.value,m=E(u);c(e,m),n.mode=u,n=m}),document.querySelectorAll(".suggestion").forEach(l=>{l.addEventListener("click",()=>{const u=l.dataset.word||"",m=document.querySelector("#word-input");m&&(m.value=u,n.selectedWord=u)})})}async function j(e,n){if(e.gameOver||e.pending)return;const o=$(e);let s=g(n);const a=e.currentLead;if(!s){e.lastError="単語を入力してください。",c(p,e);return}if(o.isHuman){e.pending=!0,e.lastError="",c(p,e);try{const t=await U(n.trim());if(b!==e)return;if(e.pending=!1,!t.found){e.lastError="WikipediaまたはWiktionaryで見つかりませんでした。",c(p,e);return}if(!t.reading){e.lastError="辞書項目の読みを確認できませんでした。",c(p,e);return}s=t.reading}catch{if(b!==e)return;e.pending=!1,e.lastError="辞書に接続できませんでした。通信を確認して再度お試しください。",c(p,e);return}}const r=O(s,o.hand,a);if(!r.valid){e.lastError=r.reason,c(p,e);return}const i=H(o.hand,s,!!a);if(!i){e.lastError="その単語は持ち駒では作れません。",c(p,e);return}if(o.hand=i,e.history.push({player:o.name,word:s}),e.currentLead=g(s).slice(-1)||null,e.lastError="",e.selectedWord="",s.endsWith("ん")){const t=L(e);e.gameOver=!0,e.winner=t.name,e.status=`${o.name}は「ん」で終わる単語を言ったため敗北。${t.name}の勝利です。`,c(p,e);return}if(o.hand.length===0){e.gameOver=!0,e.winner=o.name,e.status=`${o.name}が駒を使い切りました。`,c(p,e);return}e.activeIndex=(e.activeIndex+1)%e.players.length;const d=$(e);if(!(d.isHuman?P(e.currentLead,d.hand):w(e.currentLead,d.hand)).length){e.gameOver=!0,e.winner=o.name,e.status=`${d.name}は作れる単語がありません。${o.name}の勝ちです。`,c(p,e);return}e.status=`${d.name}の番です。`,c(p,e),d.isHuman||setTimeout(()=>{if(b!==e||e.gameOver)return;const t=K(e.currentLead,d.hand,o.hand);if(!t){e.gameOver=!0,e.winner=o.name,e.status=`${d.name}は作れる単語がありません。${o.name}の勝ちです。`,c(p,e);return}j(e,t)},500)}let p,b;function R(){p=document.querySelector("#app"),b=E("cpu"),c(p,b)}R();
