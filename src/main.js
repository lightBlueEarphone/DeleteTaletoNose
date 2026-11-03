const WORDS = [
  'あいどり','いぬ','うさぎ','えんぴつ','おかず','かえる','がっこう','きりん','くま','ぐりむ','けしごむ','こま','さくら','しろ','すし','せき','そら','たこ','ちょうちょ','つき','てんとう虫','どら焼き','なす','にほん','ぬりえ','ねこ','のこぎり','はやし','ひかり','ふくろう','へび','ほし','まつ','みず','むし','めがね','もも','やぎ','ゆき','よる','らっぱ','りんご','るすばん','れもん','ろうか','わに','ゐんか', 'うんち', 'ちょう','おうち','ちいさな','かなかな','なべ','べんとう','とうもろこし','しっぽ','ぽっぽ','ぴかぴか','かたつむり','むしとり','りす','すいか','かき','きのこ','こおり','りょうり','やさい','いちご','ごりら','らいおん','おに','にんじん','じゅうたん','たんぽぽ','ぽてと','とんぼ','ぼうし','しおかぜ','ぜんぶ','ぶどう','うどん','どんぐり','りゅう','ゆうひ','ひつじ','じてんしゃ','しゃぼん','ん'
];

const BASE_HIRAGANA = [
  'あ','い','う','え','お',
  'か','き','く','け','こ',
  'さ','し','す','せ','そ',
  'た','ち','つ','て','と',
  'な','に','ぬ','ね','の',
  'は','ひ','ふ','へ','ほ',
  'ま','み','む','め','も',
  'や','ゆ','よ',
  'ら','り','る','れ','ろ',
  'わ','を','ん'
];

const BASE_MAP = {
  'が':'か','ぎ':'き','ぐ':'く','げ':'け','ご':'こ',
  'ざ':'さ','じ':'し','ず':'す','ぜ':'せ','ぞ':'そ',
  'だ':'た','ぢ':'ち','づ':'つ','で':'て','ど':'と',
  'ば':'は','び':'ひ','ぶ':'ふ','べ':'へ','ぼ':'ほ',
  'ぱ':'は','ぴ':'ひ','ぷ':'ふ','ぺ':'へ','ぽ':'ほ',
  'ぁ':'あ','ぃ':'い','ぅ':'う','ぇ':'え','ぉ':'お',
  'ゃ':'や','ゅ':'ゆ','ょ':'よ','っ':'つ','ゎ':'わ','ゕ':'か','ゖ':'け',
};

const WIKI_APIS = [
  'https://ja.wiktionary.org/w/api.php',
  'https://ja.wikipedia.org/w/api.php',
];

function kanaToHiragana(text) {
  return text
    .normalize('NFKC')
    .replace(/[ァ-ヶヷ-ヺ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60))
    .replace(/ー/g, '')
    .replace(/\s+/g, '')
    .replace(/[！-／：-＠［-｀｛-～]/g, '')
    .replace(/[\u3000]/g, '');
}

function baseKana(ch) {
  return BASE_MAP[ch] || ch;
}

async function lookupWikiEntry(word) {
  const hiragana = normalizeWord(word);
  const katakana = hiragana.replace(/[ぁ-ゖ]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60));
  const titles = [...new Set([word.trim(), hiragana, katakana])].join('|');

  const results = await Promise.all(WIKI_APIS.map(async api => {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles,
      redirects: '1',
      prop: 'pageprops|categories',
      ppprop: 'defaultsort|disambiguation',
      clprop: 'sortkeyprefix',
      cllimit: 'max',
      origin: '*',
    });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`${api}?${params}`, { signal: controller.signal });
      if (!response.ok) return null;

      const result = await response.json();
      const pages = Object.values(result.query?.pages || {});
      const foundPages = pages.filter(candidate => !Object.hasOwn(candidate, 'missing'));
      if (!foundPages.length) return false;

      const readablePage = foundPages.map(page => {
        const candidates = [
          page.pageprops?.defaultsort?.split(/\s+/)[0],
          ...(page.categories || []).map(category => category.sortkeyprefix),
          page.title,
          hiragana,
        ];
        const reading = candidates
          .filter(Boolean)
          .map(candidate => normalizeWord(candidate))
          .find(candidate => /^[ぁ-ゖー]+$/.test(candidate));
        return reading ? { found: true, reading } : null;
      }).find(Boolean);

      return readablePage || { found: true, reading: null };
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }));

  const readableEntry = results.find(result => result?.found && result.reading);
  if (readableEntry) return readableEntry;
  if (results.some(result => result?.found)) return { found: true, reading: null };
  if (results.every(result => result === false)) return { found: false, reading: null };
  throw new Error('辞書に接続できませんでした。');
}

function normalizeWord(word) {
  const normalized = kanaToHiragana(word)
    .replace(/[\uFF01-\uFF5E]/g, char => String.fromCharCode(char.charCodeAt(0) - 0xFEE0))
    .replace(/\r|\n/g, '');

  return normalized;
}

function countChars(chars) {
  return chars.reduce((result, ch) => {
    result[ch] = (result[ch] || 0) + 1;
    return result;
  }, {});
}

function removeTilesFromHand(hand, word, allowLead = true) {
  const nextHand = [...hand];
  const counts = countChars(nextHand.map(baseKana));
  const normalized = normalizeWord(word);

  for (let i = allowLead ? 1 : 0; i < normalized.length; i += 1) {
    const key = baseKana(normalized[i]);
    if ((counts[key] || 0) <= 0) {
      return null;
    }
    counts[key] -= 1;
    const index = nextHand.findIndex(tile => baseKana(tile) === key);
    if (index === -1) {
      return null;
    }
    nextHand.splice(index, 1);
  }

  return nextHand;
}

function canUseWord(word, hand, lead) {
  const normalized = normalizeWord(word);
  if (!normalized) {
    return { valid: false, reason: '単語を入力してください。' };
  }

  if (lead && baseKana(normalized[0]) !== baseKana(lead)) {
    return { valid: false, reason: `先頭は「${lead}」で始める必要があります。` };
  }

  const counts = countChars(hand.map(baseKana));
  for (let i = lead ? 1 : 0; i < normalized.length; i += 1) {
    const key = baseKana(normalized[i]);
    if ((counts[key] || 0) <= 0) {
      return { valid: false, reason: `「${key}」は持ち駒にありません。` };
    }
    counts[key] -= 1;
  }

  return { valid: true, reason: 'OK' };
}

function getValidMoves(lead, hand) {
  return WORDS.filter(word => {
    const normalized = normalizeWord(word);
    if (!normalized) return false;
    if (lead && baseKana(normalized[0]) !== baseKana(lead)) return false;
    return canUseWord(normalized, hand, lead).valid;
  });
}

function getSafeValidMoves(lead, hand) {
  return getValidMoves(lead, hand).filter(word => !normalizeWord(word).endsWith('ん'));
}

function chooseBestCpuMove(lead, hand, opponentHand) {
  const candidates = getSafeValidMoves(lead, hand);
  if (!candidates.length) return null;

  return candidates
    .map(word => {
      const normalized = normalizeWord(word);
      const nextHand = removeTilesFromHand(hand, normalized, Boolean(lead));
      const nextLead = normalized.slice(-1);
      const opponentMoves = getSafeValidMoves(nextLead, opponentHand).length;
      const ownMoves = nextHand ? getSafeValidMoves(nextLead, nextHand).length : 0;
      const score = (nextHand?.length === 0 ? 20000 : 0)
        + (opponentMoves === 0 ? 10000 : 0)
        - opponentMoves * 20
        + Math.min(ownMoves, 10) * 3
        + normalized.length * 2;
      return { word: normalized, score };
    })
    .sort((a, b) => b.score - a.score)[0].word;
}

function randomHand() {
  return [...BASE_HIRAGANA];
}

function makePlayer(name, isHuman) {
  return {
    id: crypto.randomUUID(),
    name,
    isHuman,
    hand: randomHand(),
  };
}

function stateFactory(mode = 'cpu') {
  const players = [
    makePlayer('プレイヤー1', true),
    mode === 'cpu' ? makePlayer('CPU', false) : makePlayer('プレイヤー2', true)
  ];

  return {
    mode,
    players,
    history: [],
    currentLead: null,
    activeIndex: 0,
    gameOver: false,
    winner: null,
    status: '好きな単語からどうぞ。',
    lastError: '',
    selectedWord: '',
    pending: false,
  };
}

function getActivePlayer(state) {
  return state.players[state.activeIndex];
}

function getOpponentPlayer(state) {
  return state.players[(state.activeIndex + 1) % state.players.length];
}

function renderHand(hand) {
  if (!hand.length) {
    return '<div class="empty-hand">駒なし</div>';
  }

  return hand
    .map(tile => `<span class="tile">${tile}</span>`)
    .join('');
}

function renderState(app, state) {
  const active = getActivePlayer(state);
  const opponent = getOpponentPlayer(state);
  const canHumanAct = !state.gameOver && !state.pending && active.isHuman;
  const validMoves = state.currentLead ? getValidMoves(state.currentLead, active.hand) : WORDS.filter(word => canUseWord(normalizeWord(word), active.hand, null).valid);

  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <h1>消去しりとり</h1>
        <div class="toolbar">
          <label>
            対戦モード
            <select id="mode-select">
              <option value="cpu" ${state.mode === 'cpu' ? 'selected' : ''}>CPU対戦</option>
              <option value="local" ${state.mode === 'local' ? 'selected' : ''}>ローカル対戦</option>
            </select>
          </label>
          <button id="new-game" class="primary">最初から</button>
        </div>
      </header>

      <main class="board">
        <section class="arena">
          <div class="player-card ${state.activeIndex === 0 ? 'is-active' : ''}">
            <div class="player-header">
              <span>${state.players[0].name}</span>
              <span class="badge">${state.players[0].hand.length}枚</span>
            </div>
            <div class="hand">${renderHand(state.players[0].hand)}</div>
          </div>

          <div class="status-panel ${state.gameOver ? 'is-game-over' : ''}">
            <div class="lead-box">
              <span class="lead-label">次の文字</span>
              <strong>${state.currentLead ? state.currentLead : '自由'}</strong>
            </div>
            <p class="status-text">${state.status}</p>
            ${state.lastError ? `<p class="status-error">${state.lastError}</p>` : ''}
            ${state.gameOver ? `<p class="winner-box">勝者: ${state.winner}</p>` : ''}
          </div>

          <div class="player-card ${state.activeIndex === 1 ? 'is-active' : ''}">
            <div class="player-header">
              <span>${state.players[1].name}</span>
              <span class="badge">${state.players[1].hand.length}枚</span>
            </div>
            <div class="hand">${renderHand(state.players[1].hand)}</div>
          </div>
        </section>

        <section class="controls">
          <label for="word-input">単語</label>
          <div class="input-row">
              <input id="word-input" type="text" value="${state.selectedWord}" placeholder="例: りんご" maxlength="20" ${canHumanAct ? '' : 'disabled'} />
            <button id="play-button" class="primary" ${canHumanAct ? '' : 'disabled'}>${state.pending ? '確認中…' : '使う'}</button>
            <button id="give-up" class="secondary" ${canHumanAct ? '' : 'disabled'}>ギブアップ</button>
          </div>

          <div class="suggestions">
            <p>作れる単語</p>
            <div class="suggestion-list">
              ${validMoves.slice(0, 8).map(word => `<button type="button" class="suggestion" data-word="${word}" ${canHumanAct ? '' : 'disabled'}>${word}</button>`).join('') || '<span class="muted">候補なし</span>'}
            </div>
          </div>
        </section>

        <section class="history-panel">
          <h2>履歴</h2>
          <ol>
            ${state.history.length
              ? state.history.map(item => `<li>${item.player}: ${item.word}</li>`).join('')
              : '<li>まだありません</li>'}
          </ol>
        </section>
      </main>
    </div>
  `;

  const input = document.querySelector('#word-input');
    if (input && canHumanAct) {
    input.focus();
    input.addEventListener('input', event => {
      state.selectedWord = event.target.value;
    });
  }

  document.querySelector('#play-button')?.addEventListener('click', () => {
    const value = input?.value || '';
    requestMove(state, value);
  });

  document.querySelector('#give-up')?.addEventListener('click', () => {
    if (state.gameOver || state.pending || !getActivePlayer(state).isHuman) return;

    const player = getActivePlayer(state);
    const winner = getOpponentPlayer(state);
    state.gameOver = true;
    state.winner = winner.name;
    state.status = `${player.name}がギブアップしました。${winner.name}の勝ちです。`;
    state.lastError = '';
    state.selectedWord = '';
    renderState(app, state);
  });

  document.querySelector('#new-game')?.addEventListener('click', () => {
    const nextMode = document.querySelector('#mode-select')?.value || 'cpu';
    const nextState = stateFactory(nextMode);
    renderState(app, nextState);
    state.mode = nextMode;
    state = nextState;
  });

  document.querySelector('#mode-select')?.addEventListener('change', event => {
    const nextMode = event.target.value;
    const nextState = stateFactory(nextMode);
    renderState(app, nextState);
    state.mode = nextMode;
    state = nextState;
  });

  document.querySelectorAll('.suggestion').forEach(button => {
    button.addEventListener('click', () => {
      const value = button.dataset.word || '';
      const wordInput = document.querySelector('#word-input');
      if (wordInput) {
        wordInput.value = value;
        state.selectedWord = value;
      }
    });
  });
}

  async function requestMove(currentState, rawValue) {
    if (currentState.gameOver || currentState.pending) return;

  const player = getActivePlayer(currentState);
  let normalized = normalizeWord(rawValue);
  const lead = currentState.currentLead;

  if (!normalized) {
    currentState.lastError = '単語を入力してください。';
    renderState(app, currentState);
    return;
  }

  if (player.isHuman) {
    currentState.pending = true;
    currentState.lastError = '';
    renderState(app, currentState);

    try {
      const entry = await lookupWikiEntry(rawValue.trim());
      if (state !== currentState) return;
      currentState.pending = false;
      if (!entry.found) {
        currentState.lastError = 'WikipediaまたはWiktionaryで見つかりませんでした。';
        renderState(app, currentState);
        return;
      }
      if (!entry.reading) {
        currentState.lastError = '辞書項目の読みを確認できませんでした。';
        renderState(app, currentState);
        return;
      }
      normalized = entry.reading;
    } catch {
      if (state !== currentState) return;
      currentState.pending = false;
      currentState.lastError = '辞書に接続できませんでした。通信を確認して再度お試しください。';
      renderState(app, currentState);
      return;
    }
  }

  const validation = canUseWord(normalized, player.hand, lead);
  if (!validation.valid) {
    currentState.lastError = validation.reason;
    renderState(app, currentState);
    return;
  }

  const nextHand = removeTilesFromHand(player.hand, normalized, Boolean(lead));
  if (!nextHand) {
    currentState.lastError = 'その単語は持ち駒では作れません。';
    renderState(app, currentState);
    return;
  }

  player.hand = nextHand;
  currentState.history.push({ player: player.name, word: normalized });
  currentState.currentLead = normalizeWord(normalized).slice(-1) || null;
  currentState.lastError = '';
  currentState.selectedWord = '';

  if (normalized.endsWith('ん')) {
    const opponent = getOpponentPlayer(currentState);
    currentState.gameOver = true;
    currentState.winner = opponent.name;
    currentState.status = `${player.name}は「ん」で終わる単語を言ったため敗北。${opponent.name}の勝利です。`;
    renderState(app, currentState);
    return;
  }

  if (player.hand.length === 0) {
    currentState.gameOver = true;
    currentState.winner = player.name;
    currentState.status = `${player.name}が駒を使い切りました。`;
    renderState(app, currentState);
    return;
  }

  currentState.activeIndex = (currentState.activeIndex + 1) % currentState.players.length;
  const nextPlayer = getActivePlayer(currentState);
  const nextMoves = nextPlayer.isHuman
    ? getValidMoves(currentState.currentLead, nextPlayer.hand)
    : getSafeValidMoves(currentState.currentLead, nextPlayer.hand);

  if (!nextMoves.length) {
    currentState.gameOver = true;
    currentState.winner = player.name;
    currentState.status = `${nextPlayer.name}は作れる単語がありません。${player.name}の勝ちです。`;
    renderState(app, currentState);
    return;
  }

  currentState.status = `${nextPlayer.name}の番です。`;
  renderState(app, currentState);

  if (!nextPlayer.isHuman) {
    setTimeout(() => {
      if (state !== currentState || currentState.gameOver) return;
      const cpuWord = chooseBestCpuMove(currentState.currentLead, nextPlayer.hand, player.hand);
      if (!cpuWord) {
        currentState.gameOver = true;
        currentState.winner = player.name;
        currentState.status = `${nextPlayer.name}は作れる単語がありません。${player.name}の勝ちです。`;
        renderState(app, currentState);
        return;
      }
      requestMove(currentState, cpuWord);
    }, 500);
  }
}

let app;
let state;

function init() {
  app = document.querySelector('#app');
  state = stateFactory('cpu');
  renderState(app, state);
}

init();
