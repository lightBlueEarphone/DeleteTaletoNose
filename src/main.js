const WORDS = [
  'あいどり','いぬ','うさぎ','えんぴつ','おかず','かえる','がっこう','きりん','くま','ぐりむ','けしごむ','こま','さくら','しろ','すし','せき','そら','たこ','ちょうちょ','つき','てんとう虫','どら焼き','なす','にほん','ぬりえ','ねこ','のこぎり','はやし','ひかり','ふくろう','へび','ほし','まつ','みず','むし','めがね','もも','やぎ','ゆき','よる','らっぱ','りんご','るすばん','れもん','ろうか','わに','ゐんか', 'うんち', 'ちょう','おうち','ちいさな','かなかな','なべ','べんとう','とうもろこし','しっぽ','ぽっぽ','ぴかぴか','かたつむり','むしとり','りす','すいか','かき','きのこ','こおり','りょうり','やさい','いちご','ごりら','らいおん','おに','にんじん','じゅうたん','たんぽぽ','ぽてと','とんぼ','ぼうし','しおかぜ','ぜんぶ','ぶどう','うどん','どんぐり','りゅう','ゆうひ','ひつじ','じてんしゃ','しゃぼん','ん' ]
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
};

function kanaToHiragana(text) {
  return text
    .replace(/[ァ-ヴ]/g, ch => ch.replace(/ァ/g, 'ぁ').replace(/ィ/g, 'ぃ').replace(/ゥ/g, 'ぅ').replace(/ェ/g, 'ぇ').replace(/ォ/g, 'ぉ').replace(/ャ/g, 'ゃ').replace(/ュ/g, 'ゅ').replace(/ョ/g, 'ょ').replace(/ッ/g, 'っ').replace(/ー/g, 'ー'))
    .replace(/ー/g, '')
    .replace(/\s+/g, '')
    .replace(/[！-／：-＠［-｀｛-～]/g, '')
    .replace(/[\u3000]/g, '');
}

function baseKana(ch) {
  return BASE_MAP[ch] || ch;
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

function chooseBestCpuMove(lead, hand) {
  const validMoves = getValidMoves(lead, hand);
  if (!validMoves.length) return null;

  return validMoves
    .map(word => {
      const normalized = normalizeWord(word);
      const score = normalized.length * 3 + (normalized.endsWith('ん') ? 4 : 0) + (normalized.endsWith('る') ? 2 : 0);
      return { word: normalized, score };
    })
    .sort((a, b) => b.score - a.score)[0].word;
}

function randomHand() {
  const selected = new Set();
  while (selected.size < 8) {
    const index = Math.floor(Math.random() * BASE_HIRAGANA.length);
    selected.add(BASE_HIRAGANA[index]);
  }
  return Array.from(selected);
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
    status: '対戦開始！先頭の単語を決めてください。',
    lastError: '',
    selectedWord: '',
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
  const validMoves = state.currentLead ? getValidMoves(state.currentLead, active.hand) : WORDS.filter(word => canUseWord(normalizeWord(word), active.hand, null).valid);

  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">消去しりとり</p>
          <h1>DeleteTaletoNose</h1>
        </div>
        <div class="toolbar">
          <label>
            対戦モード
            <select id="mode-select">
              <option value="cpu" ${state.mode === 'cpu' ? 'selected' : ''}>CPU対戦</option>
              <option value="local" ${state.mode === 'local' ? 'selected' : ''}>ローカル対戦</option>
            </select>
          </label>
          <button id="new-game" class="primary">新規対戦</button>
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
              <span class="lead-label">現在の引き継ぎ</span>
              <strong>${state.currentLead ? state.currentLead : '開始時は自由'}</strong>
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
          <label for="word-input">単語を入力</label>
          <div class="input-row">
            <input id="word-input" type="text" value="${state.selectedWord}" placeholder="例: りんご" maxlength="20" ${state.gameOver ? 'disabled' : ''} />
            <button id="play-button" class="primary" ${state.gameOver ? 'disabled' : ''}>決定</button>
          </div>

          <div class="suggestions">
            <p>候補</p>
            <div class="suggestion-list">
              ${validMoves.slice(0, 8).map(word => `<button type="button" class="suggestion" data-word="${word}">${word}</button>`).join('') || '<span class="muted">候補なし</span>'}
            </div>
          </div>
        </section>

        <section class="history-panel">
          <h2>履歴</h2>
          <ol>
            ${state.history.length
              ? state.history.map(item => `<li>${item.player}: ${item.word}</li>`).join('')
              : '<li>まだ単語がありません。</li>'}
          </ol>
        </section>
      </main>
    </div>
  `;

  const input = document.querySelector('#word-input');
  if (input && !state.gameOver) {
    input.focus();
    input.addEventListener('input', event => {
      state.selectedWord = event.target.value;
    });
  }

  document.querySelector('#play-button')?.addEventListener('click', () => {
    const value = input?.value || '';
    requestMove(state, value);
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

function requestMove(currentState, rawValue) {
  if (currentState.gameOver) return;

  const player = getActivePlayer(currentState);
  const normalized = normalizeWord(rawValue);
  const lead = currentState.currentLead;

  if (!normalized) {
    currentState.lastError = '単語を入力してください。';
    renderState(app, currentState);
    return;
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

  if (player.hand.length === 0) {
    currentState.gameOver = true;
    currentState.winner = player.name;
    currentState.status = `${player.name}が全駒を使い切って勝利！`;
    renderState(app, currentState);
    return;
  }

  currentState.activeIndex = (currentState.activeIndex + 1) % currentState.players.length;
  const nextPlayer = getActivePlayer(currentState);
  const nextMoves = getValidMoves(currentState.currentLead, nextPlayer.hand);

  if (!nextMoves.length) {
    currentState.gameOver = true;
    currentState.winner = player.name;
    currentState.status = `${nextPlayer.name}は残りの駒では単語が作れず敗北。${player.name}の勝利です。`;
    renderState(app, currentState);
    return;
  }

  currentState.status = `${nextPlayer.name}の番です。`;
  renderState(app, currentState);

  if (!nextPlayer.isHuman) {
    setTimeout(() => {
      const cpuWord = chooseBestCpuMove(currentState.currentLead, nextPlayer.hand);
      if (!cpuWord) {
        currentState.gameOver = true;
        currentState.winner = player.name;
        currentState.status = `${nextPlayer.name}は残りの駒では単語が作れず敗北。${player.name}の勝利です。`;
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
