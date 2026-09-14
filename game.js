(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d', { alpha: false });
  let W = canvas.width;
  let H = canvas.height;

  function resizeCanvasToViewport() {
    const vw = Math.max(1, window.innerWidth || 480);
    const vh = Math.max(1, window.innerHeight || 270);
    const aspect = vw / vh;
    const baseAspect = 16 / 9;
    let nextW = 480;
    let nextH = 270;

    if (aspect >= baseAspect) nextW = Math.round(nextH * aspect);
    else nextH = Math.round(nextW / aspect);

    nextW = Math.min(960, Math.max(480, nextW));
    nextH = Math.min(960, Math.max(270, nextH));

    if (canvas.width !== nextW || canvas.height !== nextH) {
      canvas.width = nextW;
      canvas.height = nextH;
    }
    W = canvas.width;
    H = canvas.height;
    ctx.imageSmoothingEnabled = false;
  }

  resizeCanvasToViewport();

  const $ = (id) => document.getElementById(id);
  const ui = {
    title: $('title-screen'),
    eyebrow: $('eyebrow'),
    subtitle: $('subtitle'),
    titleHint: $('title-hint'),
    start: $('btn-start'),
    options: $('btn-options'),
    controls: $('btn-controls'),
    language: $('btn-language'),
    modal: $('modal'),
    modalTitle: $('modal-title'),
    modalContent: $('modal-content'),
    modalClose: $('modal-close'),
    pause: $('pause-menu'),
    pauseTitle: $('pause-title'),
    pauseResume: $('pause-resume'),
    pauseRestart: $('pause-restart'),
    pauseControls: $('pause-controls'),
    pauseOptions: $('pause-options'),
    pauseLanguage: $('pause-language'),
    pauseQuit: $('pause-quit'),
    mobileControls: $('mobile-controls'),
    pauseTouch: $('pause-touch'),
    youtube: $('youtube-link'),
    orientation: $('orientation-screen'),
    orientationTitle: $('orientation-title'),
    orientationText: $('orientation-text'),
    orientationBtn: $('orientation-btn'),
    orientationHelp: $('orientation-help')
  };

  const LANGS = ['en', 'ptBR'];
  const translations = {
    en: {
      presents: 'VIGU STUDIO PRESENTS', subtitle: 'A PLAYABLE PROLOGUE',
      startJourney: 'START JOURNEY', options: 'OPTIONS', controls: 'CONTROLS', language: 'LANGUAGE', credits: 'CREDITS',
      languageName: 'ENGLISH', back: 'BACK', paused: 'PAUSED', resume: 'RESUME', restartCheckpoint: 'RESTART CHECKPOINT', quitTitle: 'QUIT TO TITLE',
      keyboardTouch: 'Keyboard or touch controls supported',
      rotateTitle: 'ROTATE YOUR DEVICE', rotateText: 'For the best experience, play in landscape mode.', rotateButton: 'ENTER LANDSCAPE', rotateHelp: 'If automatic rotation is unavailable, rotate your phone manually.',
      musicVolume: 'Music Volume', sfxVolume: 'SFX Volume', screenShake: 'Screen Shake', reducedEffects: 'Reduced Effects', fullscreen: 'Fullscreen', on: 'ON', off: 'OFF',
      move: 'Move', jump: 'Jump', attack: 'Attack', block: 'Block', pause: 'Pause', interact: 'Continue dialogue',
      moveHint: 'A / D — MOVE', jumpHint: 'SPACE — JUMP', attackHint: 'J — ATTACK', blockHint: 'K — BLOCK', reachCheckpoint: 'REACH THE CHECKPOINT',
      checkpoint: 'CHECKPOINT', tryAgain: 'TRY AGAIN', wave: 'COMBAT TRIAL', enemiesRemain: 'ENEMIES REMAIN', pathOpen: 'PATH OPEN',
      level1: 'THE TRAINING GROUNDS', level2: 'THE FOREST PATH', level3: 'ANCIENT RUINS', level4: 'COMBAT TRIAL', level5: 'DANGEROUS PATH', level6: 'TWILIGHT PASS', level7: 'THE OLD MAN',
      finalLesson: 'One final lesson.', bossName: 'THE OLD MAN', unblockable: 'THE SHIELD CANNOT STOP THIS!',
      trainingComplete: 'Your training is complete.', inherit: 'Soon, you will inherit more than my sword and shield.', mustKnow: 'There is something you must know about—',
      continues: 'THE STORY CONTINUES...', thankYou: 'THANK YOU FOR PLAYING', replay: 'REPLAY DEMO', youtube: 'YOUTUBE',
      prologue: [
        'Long ago, the Third Kingdom stood on the edge of ruin.',
        'The last of the great dragons gathered creatures and forces of darkness to claim the realm.',
        'Against it rose an ancient order of warriors: the Knights of the Renaissance.',
        'The dragon was defeated, and its darkness was banished beyond the known borders.',
        'But victory demanded a terrible price. The order\'s leader fell, and almost every knight fell with him.',
        'The Third Kingdom believed its greatest defense against the darkness had vanished forever.',
        'Yet one knight survived.',
        'He crossed the frontier into the Isolated Lands — a place many simply called the Underworld.',
        'There, he disappeared. Years later, he broke one of the order\'s oldest vows... and had a son.',
        'The knight abandoned his title. But the legacy of the order had not ended.'
      ],
      creditLines: [
        'KNIGHTS OF THE RENAISSANCE', '', 'A PLAYABLE PROLOGUE', '', '',
        'CREATED AND DEVELOPED BY', 'GUSTAVO VITOR', '',
        'GAME DESIGN', 'GUSTAVO VITOR', '',
        'PROGRAMMING', 'GUSTAVO VITOR', '',
        'STORY', 'GUSTAVO VITOR', '', '',
        'VIGU STUDIO', '', 'THANK YOU FOR PLAYING.', '', '',
        'THE JOURNEY HAS ONLY JUST BEGUN.', '',
        'MORE NEWS COMING SOON', '', 'YOUTUBE.COM/@VIGUSTUDIO'
      ]
    },
    ptBR: {
      presents: 'VIGU STUDIO APRESENTA', subtitle: 'UM PRÓLOGO JOGÁVEL',
      startJourney: 'INICIAR JORNADA', options: 'OPÇÕES', controls: 'CONTROLES', language: 'IDIOMA', credits: 'CRÉDITOS',
      languageName: 'PORTUGUÊS (BRASIL)', back: 'VOLTAR', paused: 'PAUSADO', resume: 'CONTINUAR', restartCheckpoint: 'REINICIAR CHECKPOINT', quitTitle: 'VOLTAR AO MENU',
      keyboardTouch: 'Compatível com teclado e controles por toque',
      rotateTitle: 'VIRE O SEU CELULAR', rotateText: 'Para uma melhor experiência, jogue com o celular na horizontal.', rotateButton: 'VIRAR PARA HORIZONTAL', rotateHelp: 'Se a rotação automática não estiver disponível, vire o celular manualmente.',
      musicVolume: 'Volume da Música', sfxVolume: 'Volume dos Efeitos', screenShake: 'Tremor de Tela', reducedEffects: 'Efeitos Reduzidos', fullscreen: 'Tela Cheia', on: 'LIGADO', off: 'DESLIGADO',
      move: 'Mover', jump: 'Pular', attack: 'Atacar', block: 'Bloquear', pause: 'Pausar', interact: 'Continuar diálogo',
      moveHint: 'A / D — MOVER', jumpHint: 'ESPAÇO — PULAR', attackHint: 'J — ATACAR', blockHint: 'K — BLOQUEAR', reachCheckpoint: 'CHEGUE AO CHECKPOINT',
      checkpoint: 'CHECKPOINT', tryAgain: 'TENTE NOVAMENTE', wave: 'PROVA DE COMBATE', enemiesRemain: 'INIMIGOS RESTANTES', pathOpen: 'CAMINHO LIBERADO',
      level1: 'CAMPO DE TREINAMENTO', level2: 'TRILHA DA FLORESTA', level3: 'RUÍNAS ANTIGAS', level4: 'PROVA DE COMBATE', level5: 'CAMINHO PERIGOSO', level6: 'PASSAGEM DO CREPÚSCULO', level7: 'O VELHO',
      finalLesson: 'Uma última lição.', bossName: 'O VELHO', unblockable: 'O ESCUDO NÃO PODE PARAR ESTE GOLPE!',
      trainingComplete: 'Seu treinamento está concluído.', inherit: 'Em breve, você herdará mais do que minha espada e meu escudo.', mustKnow: 'Há algo que você precisa saber sobre—',
      continues: 'A HISTÓRIA CONTINUA...', thankYou: 'OBRIGADO POR JOGAR', replay: 'JOGAR NOVAMENTE', youtube: 'YOUTUBE',
      prologue: [
        'Há muitos anos, o Terceiro Reino esteve à beira da destruição.',
        'O último dos grandes dragões reuniu criaturas e forças das trevas para tomar o reino.',
        'Contra ele se levantou uma antiga ordem de guerreiros: os Knights of the Renaissance.',
        'O dragão foi derrotado, e suas trevas foram banidas para além das fronteiras conhecidas.',
        'Mas a vitória cobrou um preço terrível. O líder da ordem morreu, e quase todos os cavaleiros tombaram com ele.',
        'O Terceiro Reino acreditou que sua maior defesa contra as trevas havia desaparecido para sempre.',
        'Porém, um cavaleiro sobreviveu.',
        'Ele atravessou a fronteira rumo às Terras Isoladas — uma região que muitos chamavam simplesmente de Submundo.',
        'Ali, desapareceu. Anos depois, quebrou um dos juramentos mais antigos da ordem... e teve um filho.',
        'O cavaleiro abandonou seu título. Mas o legado da ordem ainda não havia terminado.'
      ],
      creditLines: [
        'KNIGHTS OF THE RENAISSANCE', '', 'UM PRÓLOGO JOGÁVEL', '', '',
        'CRIADO E DESENVOLVIDO POR', 'GUSTAVO VITOR', '',
        'GAME DESIGN', 'GUSTAVO VITOR', '',
        'PROGRAMAÇÃO', 'GUSTAVO VITOR', '',
        'HISTÓRIA', 'GUSTAVO VITOR', '', '',
        'VIGU STUDIO', '', 'OBRIGADO POR JOGAR.', '', '',
        'A JORNADA ESTÁ APENAS COMEÇANDO.', '',
        'MAIS NOVIDADES EM BREVE', '', 'YOUTUBE.COM/@VIGUSTUDIO'
      ]
    }
  };

  const storageGet = (key, fallback = null) => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } };
  const storageSet = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Settings still work for the current session. */ } };
  const settings = {
    language: storageGet('knights_language', 'en'),
    music: Number(storageGet('knights_music', 0.42)),
    sfx: Number(storageGet('knights_sfx', 0.68)),
    screenShake: storageGet('knights_shake', 'true') !== 'false',
    reducedEffects: storageGet('knights_reduced', 'false') === 'true'
  };
  if (!LANGS.includes(settings.language)) settings.language = 'en';
  const t = (key) => translations[settings.language][key] ?? translations.en[key] ?? key;

  const LEVEL = Object.freeze({ TRAINING:0, FOREST:1, RUINS:2, TRIAL:3, DANGER:4, TWILIGHT:5, BOSS:6 });
  const FINAL_LEVEL = LEVEL.BOSS;

  function saveSettings() {
    storageSet('knights_language', settings.language);
    storageSet('knights_music', String(settings.music));
    storageSet('knights_sfx', String(settings.sfx));
    storageSet('knights_shake', String(settings.screenShake));
    storageSet('knights_reduced', String(settings.reducedEffects));
  }

  class Input {
    constructor() {
      this.down = new Set();
      this.pressed = new Set();
      this.released = new Set();
      this.touch = { left: false, right: false, jump: false, attack: false, block: false };
      this.touchPressed = new Set();
      const prevent = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space']);
      window.addEventListener('keydown', (e) => {
        if (prevent.has(e.code)) e.preventDefault();
        if (!this.down.has(e.code)) this.pressed.add(e.code);
        this.down.add(e.code);
      }, { passive: false });
      window.addEventListener('keyup', (e) => {
        this.down.delete(e.code);
        this.released.add(e.code);
      });
      window.addEventListener('blur', () => this.clear());

      this.touchPointers = new Map();
      document.querySelectorAll('[data-action]').forEach((btn) => {
        const action = btn.dataset.action;
        const on = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (btn.setPointerCapture) {
            try { btn.setPointerCapture(e.pointerId); } catch { /* Some WebViews reject capture; state still works. */ }
          }
          const activeForAction = [...this.touchPointers.values()].some((value) => value === action);
          this.touchPointers.set(e.pointerId, action);
          if (!activeForAction && !this.touch[action]) this.touchPressed.add(action);
          this.touch[action] = true;
          btn.classList.add('pressed');
        };
        const off = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.touchPointers.delete(e.pointerId);
          const stillHeld = [...this.touchPointers.values()].some((value) => value === action);
          this.touch[action] = stillHeld;
          if (!stillHeld) btn.classList.remove('pressed');
        };
        btn.addEventListener('pointerdown', on, { passive: false });
        btn.addEventListener('pointerup', off, { passive: false });
        btn.addEventListener('pointercancel', off, { passive: false });
        btn.addEventListener('lostpointercapture', off, { passive: false });
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
      });
    }
    clear() {
      this.down.clear(); this.pressed.clear(); this.released.clear(); this.touchPressed.clear();
      Object.keys(this.touch).forEach((k) => { this.touch[k] = false; });
      if (this.touchPointers) this.touchPointers.clear();
      document.querySelectorAll('[data-action].pressed').forEach((btn)=>btn.classList.remove('pressed'));
    }
    endFrame() { this.pressed.clear(); this.released.clear(); this.touchPressed.clear(); }
    key(...codes) { return codes.some((c) => this.down.has(c)); }
    tap(...codes) { return codes.some((c) => this.pressed.has(c)); }
    moveX() {
      const left = this.key('KeyA', 'ArrowLeft') || this.touch.left;
      const right = this.key('KeyD', 'ArrowRight') || this.touch.right;
      return (right ? 1 : 0) - (left ? 1 : 0);
    }
    jumpDown() { return this.key('Space', 'KeyW', 'ArrowUp') || this.touch.jump; }
    jumpTap() { return this.tap('Space', 'KeyW', 'ArrowUp') || this.touchPressed.has('jump'); }
    attackTap() { return this.tap('KeyJ', 'KeyX') || this.touchPressed.has('attack'); }
    blockDown() { return this.key('KeyK', 'KeyC') || this.touch.block; }
    pauseTap() { return this.tap('Escape', 'KeyP'); }
    confirmTap() { return this.tap('Enter', 'Space', 'KeyE'); }
  }

  class AudioManager {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.musicGain = null;
      this.sfxGain = null;
      this.timer = null;
      this.step = 0;
      this.mode = 'none';
    }
    unlock() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.master = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.musicGain.connect(this.master);
        this.sfxGain.connect(this.master);
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.syncVolumes();
      if (!this.timer && this.mode !== 'none') { const desired=this.mode; this.mode=''; this.setMusic(desired); }
    }
    syncVolumes() {
      if (!this.ctx) return;
      this.musicGain.gain.setTargetAtTime(settings.music * 0.28, this.ctx.currentTime, 0.02);
      this.sfxGain.gain.setTargetAtTime(settings.sfx * 0.34, this.ctx.currentTime, 0.02);
    }
    tone(freq, duration = 0.08, type = 'square', gain = 0.35, when = 0, destination = null) {
      if (!this.ctx) return;
      const now = this.ctx.currentTime + when;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(25, freq), now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), now + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(g); g.connect(destination || this.sfxGain);
      osc.start(now); osc.stop(now + duration + 0.03);
    }
    noise(duration = 0.05, gain = 0.15) {
      if (!this.ctx) return;
      const length = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
      const src = this.ctx.createBufferSource();
      const g = this.ctx.createGain();
      src.buffer = buffer; g.gain.value = gain;
      src.connect(g); g.connect(this.sfxGain); src.start();
    }
    sfx(name) {
      if (!this.ctx) return;
      const m = {
        jump: () => { this.tone(230,.06,'square',.23); this.tone(345,.08,'square',.16,.035); },
        sword: () => { this.noise(.06,.12); this.tone(510,.05,'sawtooth',.12); },
        hit: () => { this.noise(.08,.23); this.tone(90,.09,'square',.2); },
        block: () => { this.tone(780,.045,'square',.23); this.tone(1170,.035,'square',.1,.02); },
        hurt: () => { this.tone(140,.12,'sawtooth',.2); this.tone(95,.12,'square',.15,.05); },
        checkpoint: () => { [392,523,659].forEach((f,i)=>this.tone(f,.12,'square',.16,i*.08)); },
        click: () => this.tone(520,.035,'square',.12),
        stomp: () => { this.tone(110,.07,'square',.17); this.noise(.04,.09); },
        bossStomp: () => { this.tone(72,.13,'sawtooth',.22); this.tone(48,.18,'triangle',.2,.02); this.noise(.11,.16); },
        death: () => { [220,174,130,98].forEach((f,i)=>this.tone(f,.14,'square',.16,i*.08)); },
        win: () => { [262,330,392,523].forEach((f,i)=>this.tone(f,.16,'square',.14,i*.11)); }
      };
      (m[name] || (()=>{}))();
    }
    setMusic(mode) {
      if (this.mode === mode) return;
      this.mode = mode; this.step = 0;
      if (this.timer) clearInterval(this.timer);
      this.timer = null;
      if (!this.ctx || mode === 'none') return;
      const patterns = {
        title: { bpm: 86, notes: [110,0,165,0,146,0,123,0], bass: [55,55,49,49] },
        intro: { bpm: 72, notes: [98,0,110,0,123,0,110,0], bass: [49,49,55,55] },
        forest: { bpm: 104, notes: [262,330,392,330,294,349,440,349], bass: [131,147,165,147] },
        path: { bpm: 122, notes: [294,349,440,349,330,392,494,392], bass: [147,165,196,165] },
        ruins: { bpm: 108, notes: [196,247,294,247,220,262,330,262], bass: [49,55,62,55] },
        combat: { bpm: 138, notes: [220,0,262,220,294,0,262,247], bass: [55,65,55,62] },
        danger: { bpm: 132, notes: [247,294,330,294,220,262,294,262], bass: [62,55,52,55] },
        twilight: { bpm: 96, notes: [174,220,262,220,196,233,294,233], bass: [43,49,55,49] },
        boss: { bpm: 152, notes: [196,0,220,233,196,0,247,220], bass: [49,49,46,55] },
        ending: { bpm: 76, notes: [262,330,392,0,349,330,294,0], bass: [65,55,49,55] }
      };
      const p = patterns[mode] || patterns.title;
      const tickMs = Math.round(60000 / p.bpm / 2);
      const playStep = () => {
        if (!this.ctx || this.mode !== mode) return;
        const note = p.notes[this.step % p.notes.length];
        if (note) this.tone(note, .1, 'square', .11, 0, this.musicGain);
        if (this.step % 2 === 0) {
          const bass = p.bass[Math.floor(this.step / 2) % p.bass.length];
          this.tone(bass, .16, 'triangle', .11, 0, this.musicGain);
        }
        this.step++;
      };
      playStep();
      this.timer = setInterval(playStep, tickMs);
    }
  }

  const input = new Input();
  const audio = new AudioManager();

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rectsOverlap = (a,b) => a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
  const approach = (v, target, amount) => v < target ? Math.min(v + amount, target) : Math.max(v - amount, target);

  class Particle {
    constructor(x,y,vx,vy,life,color,size=2) { Object.assign(this,{x,y,vx,vy,life,maxLife:life,color,size}); }
    update(dt) { this.life -= dt; this.x += this.vx*dt; this.y += this.vy*dt; this.vy += 80*dt; }
    draw(ctx,cx,cy) { ctx.globalAlpha = clamp(this.life/this.maxLife,0,1); ctx.fillStyle=this.color; ctx.fillRect(Math.round(this.x-cx),Math.round(this.y-cy),this.size,this.size); ctx.globalAlpha=1; }
  }

  class Platform {
    constructor(x,y,w,h=16,type='ground',opts={}) {
      Object.assign(this,{x,y,w,h,type});
      this.baseX=x; this.baseY=y; this.t=0; this.range=opts.range||0; this.speed=opts.speed||1;
      this.axis=opts.axis||'x'; this.fallDelay=0; this.falling=false; this.vy=0; this.fallingTime=0;
      // Thin ledges are intentionally one-way. The V3 art pass placed several decorative/gameplay
      // ledges above the main route; treating their underside and side edges as solid created
      // invisible progression blockers. Ground masses remain fully solid.
      this.oneWay = opts.oneWay ?? h <= 16;
    }
    update(dt, player) {
      this.t += dt;
      if (this.type === 'moving') {
        const oldX=this.x, oldY=this.y;
        const offset=Math.sin(this.t*this.speed)*this.range;
        if(this.axis==='x') this.x=this.baseX+offset; else this.y=this.baseY+offset;
        if (player && player.onPlatform === this) { player.x += this.x-oldX; player.y += this.y-oldY; }
      }
      if (this.type === 'falling') {
        if (player && player.onPlatform === this && !this.falling && this.fallDelay<=0) this.fallDelay=.45;
        if (this.fallDelay>0) {
          this.fallDelay-=dt;
          if(this.fallDelay<=0){this.falling=true;this.fallingTime=0;}
        }
        if (this.falling) {
          this.fallingTime += dt;
          this.vy += 170*dt;
          this.y += this.vy*dt;
          const playerRiding = player && player.onPlatform === this;
          // Falling platforms are reusable. Missing one should never create a permanent soft-lock.
          if(!playerRiding && (this.fallingTime>2.35 || this.y>this.baseY+145)){
            this.y=this.baseY;this.x=this.baseX;this.vy=0;this.falling=false;this.fallDelay=0;this.fallingTime=0;
          }
        }
      }
    }
    draw(ctx,cx,cy,palette) {
      const x=Math.round(this.x-cx), y=Math.round(this.y-cy);if(x+this.w<0||x>W||y>H+35)return;
      const side=this.type==='moving'?palette.platformSide:palette.dirt;
      ctx.fillStyle=palette.dirtDark;ctx.fillRect(x,y+3,this.w,this.h-3);ctx.fillStyle=side;ctx.fillRect(x,y+4,this.w,Math.max(1,this.h-7));
      ctx.fillStyle=palette.grass;ctx.fillRect(x,y,this.w,4);ctx.fillStyle=palette.grassLight;ctx.fillRect(x,y,this.w,1);
      // broken masonry and soil layers create a denser, reference-inspired platform edge.
      for(let i=4;i<this.w;i+=12){ctx.fillStyle=palette.grassLight;ctx.fillRect(x+i,y+2,5,1);ctx.fillStyle=palette.dirtDark;ctx.fillRect(x+i+1,y+8+(i%3),4,2);}
      for(let i=7;i<this.w;i+=24){ctx.fillStyle=palette.stone;ctx.globalAlpha=.34;ctx.fillRect(x+i,y+6,8,3);ctx.fillRect(x+i+5,y+11,10,3);ctx.globalAlpha=1;ctx.fillStyle='rgba(26,21,19,.28)';ctx.fillRect(x+i+4,y+9,5,2);}
      if(this.h>18){for(let i=16;i<this.w;i+=41){ctx.fillStyle='rgba(36,55,34,.55)';ctx.fillRect(x+i,y+4,2,8+(i%13));ctx.fillRect(x+i+2,y+10,4,2);}}
      if(this.type==='falling'){ctx.fillStyle='#b08c4a';for(let i=8;i<this.w;i+=18)ctx.fillRect(x+i,y+2,2,2);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(x+4,y+5,this.w-8,1);}
      if(this.type==='moving'){ctx.fillStyle='#a48c58';ctx.fillRect(x+3,y+this.h-3,Math.max(0,this.w-6),2);ctx.fillStyle='#d2b66d';ctx.fillRect(x+7,y+2,8,1);}
    }
  }

  class Checkpoint {
    constructor(x,y) { this.x=x; this.y=y; this.w=12; this.h=34; this.active=false; }
    update(player,game) {
      if (!this.active && rectsOverlap({x:this.x-8,y:this.y-4,w:28,h:42},player)) {
        this.active=true;
        game.checkpoint={ level:game.levelIndex, x:this.x-14, y:this.y-26 };
        game.notice(t('checkpoint'),1.4);
        audio.sfx('checkpoint');
        game.burst(this.x+6,this.y+8,'#e9c459',10);
      }
    }
    draw(ctx,cx,cy,time) {
      const x=Math.round(this.x-cx), y=Math.round(this.y-cy);
      const glow=.35+.18*Math.sin(time*4.5);
      if(this.active){ctx.globalAlpha=glow;ctx.fillStyle='#f3cf69';ctx.fillRect(x-5,y-6,23,33);ctx.globalAlpha=1;}
      ctx.fillStyle='#3c2d20';ctx.fillRect(x+5,y+7,4,27);ctx.fillStyle='#80643a';ctx.fillRect(x+6,y+7,2,27);
      ctx.fillStyle=this.active?'#d8aa38':'#695e4c';ctx.fillRect(x-1,y+5,15,13);
      ctx.fillStyle=this.active?'#f0c957':'#8a7b61';ctx.fillRect(x,y+4,13,2);ctx.fillRect(x+2,y+7,9,1);
      ctx.fillStyle='#30281f';ctx.fillRect(x+4,y+8,5,7);ctx.fillStyle=this.active?'#f2d275':'#aaa08a';ctx.fillRect(x+6,y+9,1,5);ctx.fillRect(x+4,y+11,5,1);
      ctx.fillStyle='#2d251d';ctx.fillRect(x,y+32,14,3);ctx.fillStyle='#85735a';ctx.fillRect(x+2,y+31,10,2);
    }
  }

  class Projectile {
    constructor(x,y,vx,vy,owner='enemy',blockable=true) { Object.assign(this,{x,y,vx,vy,owner,blockable,w:5,h:3,dead:false}); }
    update(dt,game) {
      this.x+=this.vx*dt; this.y+=this.vy*dt;
      if(this.x<game.camera.x-80||this.x>game.camera.x+W+80||this.y>H+80) {this.dead=true;return;}
      for(const p of game.level.platforms){ if(rectsOverlap(this,p)){this.dead=true;return;} }
      if(this.owner==='enemy' && rectsOverlap(this,game.player)){
        const blocked = game.player.blocking && this.blockable && ((this.vx>0&&game.player.facing<0)||(this.vx<0&&game.player.facing>0));
        if(blocked){audio.sfx('block');game.burst(this.x,this.y,'#d8e8ef',5);this.dead=true;return;}
        game.player.damage(1,this.x,false,game); this.dead=true;
      }
    }
    draw(ctx,cx,cy) { const x=Math.round(this.x-cx),y=Math.round(this.y-cy);const dir=this.vx>=0?1:-1;ctx.save();ctx.translate(x,y);ctx.scale(dir,1);ctx.fillStyle='#6a4728';ctx.fillRect(-5,-1,10,2);ctx.fillStyle='#d9d6c8';ctx.fillRect(4,-2,4,4);ctx.fillStyle='#8d6b3d';ctx.fillRect(-7,-3,3,2);ctx.fillRect(-7,1,3,2);ctx.restore(); }
  }

  class Shockwave {
    constructor(x,y,dir){this.x=x;this.y=y;this.dir=dir;this.vx=dir*115;this.w=18;this.h=5;this.life=1.15;this.dead=false;this.hit=false;}
    update(dt,game){
      this.life-=dt;this.x+=this.vx*dt;
      if(this.life<=0||this.x<game.camera.x-70||this.x>game.camera.x+W+70){this.dead=true;return;}
      const p=game.player;const feet={x:p.x+2,y:p.y+p.h-5,w:p.w-4,h:6};
      if(!this.hit&&p.vy>=-10&&rectsOverlap(this,feet)){this.hit=true;p.damage(1,this.x,true,game);}
    }
    draw(ctx,cx){
      const x=Math.round(this.x-cx),y=Math.round(this.y);const a=clamp(this.life/.28,0,1);
      ctx.globalAlpha=.82*a;ctx.fillStyle='#c68a43';ctx.fillRect(x,y-2,this.w,2);ctx.fillStyle='#f2c66c';ctx.fillRect(x+3,y-4,this.w-6,2);
      ctx.fillStyle='#705238';ctx.fillRect(x+2,y,this.w-4,2);ctx.globalAlpha=1;
    }
  }

  class Enemy {
    constructor(type,x,y) {
      this.type=type; this.x=x; this.y=y; this.vx=0; this.vy=0;
      const dims={bat:[17,12],wolf:[19,15],crawler:[17,10]};const d=dims[type]||[16,25];this.w=d[0];this.h=d[1];
      const hp={runner:1,bat:1,crawler:1,wolf:2,sword:2,archer:2,shield:3,elite:4};this.hp=hp[type]||2;this.maxHp=this.hp;
      this.facing=-1; this.onGround=false; this.dead=false; this.hitFlash=0; this.invuln=0; this.attackTimer=0; this.cooldown=Math.random()*.55; this.telegraph=0; this.spawnY=y;this.phase=Math.random()*6.28;this.lunge=0;
    }
    get bodyBox(){return {x:this.x+2,y:this.y+2,w:Math.max(4,this.w-4),h:Math.max(4,this.h-3)};}
    damage(amount,game,fromX) {
      if(this.invuln>0||this.dead)return false;
      if(this.type==='shield'){
        const fromFront=(fromX<this.x&&this.facing<0)||(fromX>this.x&&this.facing>0);
        const attackerAbove=game.player.y+game.player.h<this.y+9;
        if(fromFront&&!attackerAbove){audio.sfx('block');game.burst(this.x+this.w/2,this.y+8,'#d7d0b2',5);this.cooldown=Math.max(this.cooldown,.28);return false;}
      }
      this.hp-=amount;this.invuln=.18;this.hitFlash=.13;this.vx+=(this.x<fromX?-1:1)*52;audio.sfx('hit');game.burst(this.x+this.w/2,this.y+Math.min(9,this.h/2),'#f0d178',7);
      if(this.hp<=0){this.dead=true;this.vy=-88;this.vx+=(this.x<fromX?-1:1)*52;game.burst(this.x+this.w/2,this.y+8,'#a95643',11);}
      return true;
    }
    update(dt,game){
      const prevTelegraph=this.telegraph;
      if(this.hitFlash>0)this.hitFlash-=dt;if(this.invuln>0)this.invuln-=dt;if(this.cooldown>0)this.cooldown-=dt;if(this.attackTimer>0)this.attackTimer-=dt;if(this.telegraph>0)this.telegraph=Math.max(0,this.telegraph-dt);
      if(this.dead){this.vy+=430*dt;this.y+=this.vy*dt;this.x+=this.vx*dt;return;}
      const p=game.player; const dx=p.x-this.x; const dy=(p.y+p.h*.5)-(this.y+this.h*.5); this.facing=dx>=0?1:-1;
      const pc=p.x+p.w*.5,ec=this.x+this.w*.5,betweenMin=Math.min(pc,ec),betweenMax=Math.max(pc,ec);
      const separatedByHazard=game.levelIndex!==LEVEL.TRIAL&&game.level.hazards.some(h=>h.x<betweenMax&&h.x+h.w>betweenMin);
      const playerBody={x:p.x+2,y:p.y+2,w:p.w-4,h:p.h-4};
      const groundAI=()=>{
        if(this.onGround&&Math.abs(this.vx)>1){const aheadX=this.vx>0?this.x+this.w+4:this.x-4;const footY=this.y+this.h+4;const safe=game.level.platforms.some(pl=>aheadX>=pl.x&&aheadX<=pl.x+pl.w&&footY>=pl.y-2&&footY<=pl.y+pl.h+8);if(!safe)this.vx=0;}
        this.vy+=420*dt;game.moveEntity(this,dt);if(this.y>H+160)this.dead=true;
      };

      if(this.type==='bat'){
        this.phase+=dt*2.7;const targetY=this.spawnY+Math.sin(this.phase)*12;this.y=lerp(this.y,targetY,1-Math.pow(.01,dt));
        const engaged=Math.abs(dx)<210&&Math.abs(dy)<95;
        this.vx=approach(this.vx,engaged?this.facing*34:Math.sin(this.phase*.63)*14,90*dt);this.x+=this.vx*dt;
        if(engaged&&this.cooldown<=0&&Math.abs(dx)<42){this.telegraph=.28;this.cooldown=1.15;}
        if(prevTelegraph>0&&this.telegraph<=0){this.y+=8;this.vx=this.facing*82;}
        if(this.cooldown>.6&&rectsOverlap(this.bodyBox,playerBody))p.damage(1,this.x,false,game);
        return;
      }
      if(this.type==='sword'||this.type==='elite'||this.type==='shield'){
        const elite=this.type==='elite',shield=this.type==='shield';const inVerticalReach=Math.abs(dy)<19;const engageRange=elite?210:shield?150:170;
        const engaged=game.levelIndex===LEVEL.TRIAL||(!separatedByHazard&&Math.abs(dx)<engageRange);
        const desiredDist=shield?24:elite?31:28;
        if(!engaged)this.vx=approach(this.vx,0,190*dt);
        else if(Math.abs(dx)>desiredDist||!inVerticalReach)this.vx=approach(this.vx,Math.abs(dx)>8?this.facing*(elite?43:shield?27:33):0,(elite?190:150)*dt);
        else{this.vx=approach(this.vx,0,220*dt);if(this.cooldown<=0){this.telegraph=elite?.16:.23;this.attackTimer=elite?.36:.44;this.cooldown=elite?.78:shield?1.18:1.03;}}
        if(this.attackTimer>0&&this.attackTimer<(elite?.17:.19)){
          const reach=elite?19:16;const hit={x:this.facing>0?this.x+11:this.x-reach+1,y:this.y+7,w:reach,h:11};
          if(rectsOverlap(hit,playerBody)){p.damage(1,this.x,false,game);this.attackTimer=0;}
        }
        groundAI();return;
      }
      if(this.type==='runner'||this.type==='wolf'||this.type==='crawler'){
        const isWolf=this.type==='wolf',isCrawler=this.type==='crawler';const range=isWolf?220:isCrawler?125:190;const engaged=game.levelIndex===LEVEL.TRIAL||(!separatedByHazard&&Math.abs(dx)<range);
        if(isWolf&&engaged&&this.cooldown<=0&&Math.abs(dx)<95){this.telegraph=.2;this.cooldown=1.1;this.lunge=.34;}
        const speed=this.lunge>0?105:isWolf?62:isCrawler?42:60;if(this.lunge>0)this.lunge-=dt;
        this.vx=approach(this.vx,engaged?this.facing*speed:0,(isWolf?260:220)*dt);
        if(engaged&&this.cooldown<=0&&rectsOverlap(this.bodyBox,playerBody)){p.damage(1,this.x,false,game);this.cooldown=.8;}
        if(isWolf&&this.lunge>0&&rectsOverlap(this.bodyBox,playerBody)){p.damage(1,this.x,false,game);this.lunge=0;}
        groundAI();return;
      }
      if(this.type==='archer'){
        this.vx=approach(this.vx,0,300*dt);
        if(!separatedByHazard&&Math.abs(dx)<220&&Math.abs(dy)<80&&this.cooldown<=0){this.telegraph=.36;this.cooldown=1.6;}
        if(prevTelegraph>0&&this.telegraph<=0){const speed=105;game.projectiles.push(new Projectile(this.x+(this.facing>0?15:-5),this.y+9,this.facing*speed,-3,'enemy',true));audio.sfx('click');}
        groundAI();return;
      }
      groundAI();
    }
    draw(ctx,cx,cy,time){
      if(this.dead&&this.y>H+35)return;
      const px=Math.round(this.x+this.w/2-cx),py=Math.round(this.y-(this.type==='bat'?5:8)-cy);const f=this.facing;
      const moving=Math.abs(this.vx)>7,frame=Math.floor((time*10+this.x*.013))%4,step=[[-3,2],[1,-1],[3,-2],[-1,1]][frame];
      ctx.save();ctx.translate(px,py);ctx.scale(f,1);if(this.hitFlash>0)ctx.globalAlpha=.42;if(this.dead)ctx.rotate(clamp(this.vy/230,-.35,.6));
      if(this.type==='bat'){
        const flap=Math.floor(time*12+this.phase)%2?3:-2;ctx.fillStyle='#241b29';ctx.fillRect(-6,5,12,7);ctx.fillStyle='#472e4c';ctx.fillRect(-5,6,10,5);ctx.fillStyle='#171219';ctx.beginPath();ctx.moveTo(-5,7);ctx.lineTo(-17,2+flap);ctx.lineTo(-12,12);ctx.fill();ctx.beginPath();ctx.moveTo(5,7);ctx.lineTo(17,2+flap);ctx.lineTo(12,12);ctx.fill();ctx.fillStyle='#d44949';ctx.fillRect(-3,7,2,1);ctx.fillRect(2,7,2,1);
      }else if(this.type==='wolf'){
        ctx.fillStyle='#25282b';ctx.fillRect(-10,8,18,9);ctx.fillStyle='#3a3d40';ctx.fillRect(-7,6,13,8);ctx.fillRect(6,8,6,5);ctx.fillStyle='#17191b';ctx.fillRect(-9,16,4,6);ctx.fillRect(4,16,4,6);ctx.fillStyle='#b4433d';ctx.fillRect(9,9,2,1);ctx.fillStyle='#33363a';ctx.fillRect(-12,5,5,4);
      }else if(this.type==='crawler'){
        ctx.fillStyle='#372c36';ctx.fillRect(-9,5,18,8);ctx.fillStyle='#625062';ctx.fillRect(-6,3,12,7);ctx.fillStyle='#1b171d';for(let i=-8;i<=6;i+=5)ctx.fillRect(i,12,3,4);ctx.fillStyle='#d1a84a';ctx.fillRect(4,5,2,1);
      }else{
        let lx=-7,rx=2,ly=23,ry=23;if(moving){lx+=step[0];rx+=step[1];ly+=Math.max(0,-step[0]);ry+=Math.max(0,-step[1]);}
        const body=this.type==='archer'?'#354b39':this.type==='runner'?'#762f3f':this.type==='shield'?'#46545a':this.type==='elite'?'#5b2732':'#65432f';
        ctx.fillStyle='#322822';ctx.fillRect(lx,ly,5,7);ctx.fillRect(rx,ry,5,7);ctx.fillStyle='#151313';ctx.fillRect(lx-1,ly+6,7,4);ctx.fillRect(rx-1,ry+6,7,4);
        ctx.fillStyle=body;ctx.fillRect(-9,9,18,14);ctx.fillStyle=this.type==='elite'?'#8c3940':this.type==='shield'?'#65757a':'rgba(255,255,255,.12)';ctx.fillRect(-7,10,12,4);ctx.fillStyle='#3d3027';ctx.fillRect(-9,21,18,3);
        ctx.fillStyle='#c69b76';ctx.fillRect(-5,1,10,9);ctx.fillStyle='#ddb18a';ctx.fillRect(-3,4,8,5);
        const hood=this.type==='archer'?'#263629':this.type==='elite'?'#2a1b1d':this.type==='shield'?'#333d42':'#36251d';ctx.fillStyle=hood;ctx.fillRect(-7,-1,13,4);ctx.fillRect(-7,2,3,6);ctx.fillStyle='#201814';ctx.fillRect(3,5,2,1);
        if(this.type==='archer'){
          ctx.strokeStyle='#c59b52';ctx.lineWidth=2;ctx.beginPath();ctx.arc(10,14,8,-1.35,1.35);ctx.stroke();ctx.strokeStyle='#dbd0aa';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(11,6);ctx.lineTo(11,22);ctx.stroke();ctx.fillStyle='#684a31';ctx.fillRect(-12,7,3,18);
        }else if(this.type==='shield'){
          ctx.fillStyle='#6b5229';ctx.fillRect(7,7,12,20);ctx.fillStyle='#95a0a2';ctx.fillRect(8,6,11,20);ctx.fillStyle='#c1b27a';ctx.fillRect(11,8,5,16);ctx.fillStyle='#443c31';ctx.fillRect(12,12,3,7);
          ctx.fillStyle='#7a5432';ctx.fillRect(-12,12,7,3);ctx.fillStyle='#b9c0be';ctx.fillRect(-17,11,9,3);
        }else{
          const active=this.attackTimer>0,progress=active?clamp(1-this.attackTimer/(this.type==='elite'?.36:.44),0,1):0;ctx.fillStyle='#c69b76';ctx.fillRect(7,11,5,5);ctx.save();ctx.translate(10,13);ctx.rotate(active?-1.0+progress*1.25:-.48);ctx.fillStyle='#79522f';ctx.fillRect(0,-2,7,4);ctx.fillStyle=this.type==='elite'?'#d7c4bd':'#c8d0ce';ctx.fillRect(6,-2,this.type==='elite'?20:17,3);ctx.fillStyle='#f3efe4';ctx.fillRect(this.type==='elite'?21:18,-2,4,1);ctx.restore();
        }
      }
      if(this.telegraph>0){ctx.globalAlpha=.86;ctx.fillStyle='#f1c95a';ctx.fillRect(-2,-10,4,4);ctx.fillRect(-1,-16,2,4);}ctx.restore();ctx.globalAlpha=1;
    }
  }

  class BossOldMan {
    constructor(x,groundY){
      this.x=x;this.y=groundY-25;this.groundY=groundY;this.w=17;this.h=25;this.vx=0;this.vy=0;this.hp=9;this.maxHp=9;this.state='idle';this.timer=1.15;this.facing=-1;this.dead=false;this.invuln=0;this.hitFlash=0;this.fakeHop=false;this.targetX=x;this.hasLanded=false;
    }
    get phase(){return this.hp<=3?3:this.hp<=6?2:1;}
    damage(amount,game,fromX){
      if(this.invuln>0||this.dead)return false;
      const airborne=this.state==='jump'&&this.y<this.groundY-this.h-5;
      if(!airborne){audio.sfx('block');game.burst(this.x+8,this.y+9,'#d8d0b4',4);return false;}
      this.hp-=amount;this.invuln=.3;this.hitFlash=.16;this.vx+=(this.x<fromX?-1:1)*32;if(this.vy>0)this.vy=-72;
      audio.sfx('hit');game.burst(this.x+8,this.y+8,'#f0d178',11);game.shake(2.8,.12);
      if(this.hp<=0){this.dead=true;this.state='defeated';this.vx=0;this.vy=0;audio.sfx('win');game.onBossDefeated();}
      return true;
    }
    update(dt,game){
      if(this.dead)return;if(this.invuln>0)this.invuln-=dt;if(this.hitFlash>0)this.hitFlash-=dt;
      const p=game.player;this.facing=p.x>=this.x?1:-1;this.timer-=dt;
      if(this.state==='idle'){
        this.vx=approach(this.vx,0,210*dt);
        if(this.timer<=0){
          if(this.phase===3&&Math.random()<.23){this.state='dash';this.timer=.34;this.vx=this.facing*92;}
          else{this.state='crouch';this.targetX=clamp(p.x,630,1125);this.fakeHop=this.phase>=2&&Math.random()<(this.phase===3?.28:.18);this.timer=this.fakeHop?.18:(this.phase===3?.24:.34);}
        }
      }else if(this.state==='dash'){
        this.x+=this.vx*dt;this.x=clamp(this.x,620,1135);if(rectsOverlap(this,p)){p.damage(1,this.x,false,game);this.timer=0;}
        if(this.timer<=0){this.state='recover';this.timer=.26;this.vx=0;}
      }else if(this.state==='crouch'){
        this.vx=0;if(this.timer<=0){this.state='jump';const dist=clamp(this.targetX-this.x,-135,135);this.vx=(this.fakeHop?dist*.26:dist*(this.phase===3?.88:.76));this.vy=this.fakeHop?-112:(this.phase===3?-202:-187);this.timer=2;this.hasLanded=false;}
      }else if(this.state==='jump'){
        this.vy+=440*dt;this.x+=this.vx*dt;this.y+=this.vy*dt;this.x=clamp(this.x,620,1135);
        if(rectsOverlap(this,p)&&this.vy>28){p.damage(1,this.x,true,game);game.shake(4.5,.13);}
        if(this.y+this.h>=this.groundY){
          this.y=this.groundY-this.h;this.vy=0;this.vx=0;this.state='recover';this.timer=this.phase===3?.28:this.phase===2?.42:.56;
          game.burst(this.x+8,this.groundY-2,'#cdb77d',this.phase===3?11:7);game.shake(this.phase===3?4.2:2.5,.12);audio.sfx('bossStomp');
          if(this.phase===3&&!this.fakeHop){game.shockwaves.push(new Shockwave(this.x-18,this.groundY-4,-1),new Shockwave(this.x+16,this.groundY-4,1));}
        }
      }else if(this.state==='recover'){
        if(this.timer<=0){this.state='idle';this.timer=this.phase===3?.34+Math.random()*.28:this.phase===2?.48+Math.random()*.42:.78+Math.random()*.58;}
      }
    }
    draw(ctx,cx,cy,time){
      const px=Math.round(this.x+this.w/2-cx),py=Math.round(this.y-9-cy);const f=this.facing;const airborne=this.state==='jump',crouch=this.state==='crouch'?5:(this.state==='defeated'?8:0);
      ctx.save();ctx.translate(px,py+crouch);ctx.scale(f,1);if(this.hitFlash>0)ctx.globalAlpha=.42;
      let lx=-8,rx=2,ly=23,ry=23;if(airborne){if(this.vy<0){lx=-9;rx=1;ly=20;ry=24;}else{lx=-7;rx=4;ly=24;ry=23;}}if(this.state==='dash'){lx=-10;rx=3;ly=24;ry=21;}if(this.state==='defeated'){lx=-10;rx=0;ly=25;ry=27;}
      ctx.fillStyle='#4b4135';ctx.fillRect(lx,ly,5,7);ctx.fillRect(rx,ry,5,7);ctx.fillStyle='#211d19';ctx.fillRect(lx-1,ly+6,7,4);ctx.fillRect(rx-1,ry+6,7,4);
      ctx.fillStyle='#6f624f';ctx.fillRect(-9,9,18,15);ctx.fillStyle='#93866a';ctx.fillRect(-6,10,12,9);ctx.fillStyle='#4a4033';ctx.fillRect(-10,21,20,3);ctx.fillStyle='#a17e48';ctx.fillRect(-9,16,18,2);
      ctx.fillStyle='#c7a77f';if(airborne&&this.vy<0){ctx.fillRect(-13,7,5,9);ctx.fillRect(8,7,5,9);}else if(airborne){ctx.fillRect(-13,13,6,5);ctx.fillRect(7,13,6,5);}else if(this.state==='dash'){ctx.fillRect(-12,10,5,7);ctx.fillRect(7,12,5,6);}else{ctx.fillRect(-11,11,4,8);ctx.fillRect(7,11,4,8);}
      ctx.fillStyle='#cdb08b';ctx.fillRect(-5,1,10,9);ctx.fillStyle='#dfc09b';ctx.fillRect(-3,4,8,5);
      ctx.fillStyle='#d7d3c8';ctx.fillRect(-8,-2,14,4);ctx.fillRect(-8,1,3,9);ctx.fillRect(3,0,5,6);ctx.fillRect(-5,8,11,6);ctx.fillRect(-2,13,8,4);ctx.fillStyle='#efece5';ctx.fillRect(-7,-2,6,2);ctx.fillStyle='#291f19';ctx.fillRect(3,5,2,1);
      if(this.state==='crouch'){
        ctx.globalAlpha=.88;ctx.fillStyle=this.phase===3?'#e56c45':'#f0c65f';ctx.fillRect(-3,-11,6,5);ctx.fillRect(-1,-17,2,4);
        ctx.globalAlpha=.35;ctx.fillStyle=this.phase===3?'#e3523f':'#d6b45c';ctx.fillRect(-13,29,26,2);ctx.globalAlpha=1;
      }
      if(airborne&&this.vy>20){ctx.globalAlpha=.22;ctx.fillStyle='#e4c56d';ctx.fillRect(-12,32,24,2);ctx.globalAlpha=1;}
      ctx.restore();ctx.globalAlpha=1;
      if(this.state==='crouch'&&!this.fakeHop){const tx=Math.round(this.targetX-cx);ctx.globalAlpha=.42;ctx.strokeStyle=this.phase===3?'#e35a45':'#d7aa50';ctx.lineWidth=1;ctx.beginPath();ctx.arc(tx,this.groundY-3,10+Math.sin(time*10)*2,0,Math.PI*2);ctx.stroke();ctx.fillStyle=this.phase===3?'#d84e3f':'#c59a48';ctx.fillRect(tx-1,this.groundY-6,3,5);ctx.globalAlpha=1;}
    }
  }

  class Player {
    constructor(x,y){
      this.x=x;this.y=y;this.w=15;this.h=25;this.vx=0;this.vy=0;this.facing=1;this.onGround=false;this.onPlatform=null;
      this.coyote=0;this.jumpBuffer=0;this.attackTimer=0;this.attackCooldown=0;this.attackHits=new Set();this.blocking=false;this.blockImpact=0;this.hp=5;this.maxHp=5;
      this.invuln=0;this.hurtTimer=0;this.dead=false;this.deathTimer=0;this.state='IDLE';this.anim=0;this.landTimer=0;this.stepDust=0;
    }
    get attackBox(){return {x:this.facing>0?this.x+9:this.x-15,y:this.y+3,w:21,h:16};}
    damage(amount,sourceX,unblockable,game){
      if(this.invuln>0||this.dead)return;const fromFront=(sourceX>this.x&&this.facing>0)||(sourceX<this.x&&this.facing<0);
      if(this.blocking&&fromFront&&!unblockable){this.blockImpact=.12;audio.sfx('block');game.burst(this.x+(this.facing>0?16:0),this.y+10,'#d8eef1',7);return;}
      this.hp-=amount;this.invuln=.9;this.hurtTimer=.27;this.vx=(this.x<sourceX?-1:1)*85;this.vy=-96;audio.sfx('hurt');game.shake(3,.12);game.burst(this.x+7,this.y+8,'#cf5f4c',9);
      if(this.hp<=0){this.dead=true;this.deathTimer=1.1;this.vy=-110;audio.sfx('death');}
    }
    update(dt,game){
      this.anim+=dt;if(this.invuln>0)this.invuln-=dt;if(this.hurtTimer>0)this.hurtTimer-=dt;if(this.attackCooldown>0)this.attackCooldown-=dt;if(this.blockImpact>0)this.blockImpact-=dt;
      if(this.dead){this.deathTimer-=dt;this.vy+=430*dt;this.y+=this.vy*dt;this.x+=this.vx*dt;if(this.deathTimer<=0)game.respawn();return;}
      const wasGround=this.onGround;if(this.onGround)this.coyote=.1;else this.coyote=Math.max(0,this.coyote-dt);if(input.jumpTap())this.jumpBuffer=.12;else this.jumpBuffer=Math.max(0,this.jumpBuffer-dt);
      if(this.hurtTimer<=0){
        this.blocking=input.blockDown()&&this.attackTimer<=0;const move=input.moveX();if(move!==0)this.facing=move;const target=this.blocking?move*30:move*72;const accel=this.onGround?450:255;this.vx=approach(this.vx,target,accel*dt);if(move===0)this.vx=approach(this.vx,0,(this.onGround?540:120)*dt);
        if(this.jumpBuffer>0&&this.coyote>0&&!this.blocking){this.vy=-207;this.onGround=false;this.coyote=0;this.jumpBuffer=0;audio.sfx('jump');game.tutorial.jump=true;}
        if(!input.jumpDown()&&this.vy<-70)this.vy+=425*dt;
        if(input.attackTap()&&this.attackCooldown<=0&&!this.blocking){this.attackTimer=.22;this.attackCooldown=.32;this.attackHits.clear();audio.sfx('sword');game.tutorial.attack=true;}
      }else this.blocking=false;
      if(input.blockDown())game.tutorial.block=true;if(Math.abs(this.vx)>8)game.tutorial.move=true;
      if(this.attackTimer>0){
        this.attackTimer-=dt;const hit=this.attackBox;
        for(const e of game.enemies){if(!e.dead&&!this.attackHits.has(e)&&rectsOverlap(hit,e)){if(e.damage(1,game,this.x)){this.attackHits.add(e);game.hitStop=.035;}}}
        if(game.boss&&!game.boss.dead&&!this.attackHits.has(game.boss)&&rectsOverlap(hit,game.boss)){if(game.boss.damage(1,game,this.x)){this.attackHits.add(game.boss);game.hitStop=.045;}}
      }
      this.vy+=430*dt;this.vy=Math.min(this.vy,260);const beforeY=this.y;game.moveEntity(this,dt,true);
      if(this.landTimer>0)this.landTimer=Math.max(0,this.landTimer-dt);if(!wasGround&&this.onGround){this.landTimer=.12;audio.sfx('stomp');game.burst(this.x+this.w/2,this.y+this.h-1,'#a58e68',5);}
      if(this.stepDust>0)this.stepDust-=dt;if(this.onGround&&Math.abs(this.vx)>45&&this.stepDust<=0){this.stepDust=.16;game.burst(this.x+(this.facing<0?this.w:0),this.y+this.h-1,'#8f795c',2);}
      if(this.vy>=0){for(const e of game.enemies){if(e.dead)continue;const feet={x:this.x+3,y:this.y+this.h-4,w:this.w-6,h:7};if(rectsOverlap(feet,e)&&beforeY+this.h<=e.y+Math.min(9,e.h*.55)){if(e.damage(1,game,this.x)){this.vy=-138;audio.sfx('stomp');game.hitStop=.035;break;}}}}
      if(this.y>H+170){this.damage(99,this.x,false,game);this.deathTimer=.2;}
      if(this.hurtTimer>0)this.state='HURT';else if(this.attackTimer>0)this.state='ATTACK';else if(this.blocking)this.state='BLOCK';else if(!this.onGround)this.state=this.vy<-45?'JUMP':Math.abs(this.vy)<45?'APEX':'FALL';else if(this.landTimer>0)this.state='LAND';else if(Math.abs(this.vx)>5)this.state='RUN';else this.state='IDLE';
    }
    draw(ctx,cx,cy){
      if(this.invuln>0&&Math.floor(this.invuln*18)%2===0)return;
      const px=Math.round(this.x+this.w/2-cx),py=Math.round(this.y-10-cy),f=this.facing,runFrame=Math.floor(this.anim*12)%6;const legs=[[-4,3],[-2,2],[1,-1],[4,-3],[2,-2],[-1,1]][runFrame];
      const idle=Math.sin(this.anim*2.8)>.55?1:0,landing=this.landTimer>0?2:0;ctx.save();ctx.translate(px,py+landing);ctx.scale(f,1);if(this.hurtTimer>0){ctx.globalAlpha=.9;ctx.translate((Math.floor(this.anim*48)%2)*2-1,0);}
      // rear shield and scabbard
      ctx.fillStyle='#4b351e';ctx.fillRect(-13,11,5,20);ctx.fillStyle='#987020';ctx.fillRect(-15,11,8,16);ctx.fillStyle='#d3a633';ctx.fillRect(-14,10,7,17);ctx.fillStyle='#f1cb50';ctx.fillRect(-12,12,4,13);ctx.fillStyle='#37312b';ctx.fillRect(-10,15,2,8);ctx.fillStyle='#6e5532';ctx.fillRect(-10,27,2,8);
      // cloak/tunic tails move with gait
      const tailShift=this.state==='RUN'?legs[0]>.5?-1:1:0;ctx.fillStyle='#c8c1ae';ctx.fillRect(-8+tailShift,21,6,6);ctx.fillRect(2-tailShift,21,6,6);ctx.fillStyle='#eee6d1';ctx.fillRect(-6+tailShift,21,4,4);ctx.fillRect(2-tailShift,21,4,4);
      // legs
      let l1x=-8,l2x=2,l1y=25,l2y=25;if(this.state==='RUN'){l1x+=legs[0];l2x+=legs[1];l1y+=Math.max(0,-legs[0]*.45);l2y+=Math.max(0,-legs[1]*.45);}if(this.state==='JUMP'){l1x=-10;l2x=1;l1y=23;l2y=27;}if(this.state==='APEX'){l1x=-8;l2x=3;l1y=25;l2y=25;}if(this.state==='FALL'){l1x=-6;l2x=4;l1y=27;l2y=24;}if(this.state==='HURT'){l1x=-10;l2x=3;l1y=27;l2y=28;}
      ctx.fillStyle='#202126';ctx.fillRect(l1x,l1y,6,8);ctx.fillRect(l2x,l2y,6,8);ctx.fillStyle='#111216';ctx.fillRect(l1x-1,l1y+7,8,4);ctx.fillRect(l2x-1,l2y+7,8,4);ctx.fillStyle='#6b5238';ctx.fillRect(l1x,l1y+5,6,2);ctx.fillRect(l2x,l2y+5,6,2);
      // torso with shoulder and belt
      const ty=9+idle;ctx.fillStyle='#c9c2ae';ctx.fillRect(-9,ty,18,14);ctx.fillStyle='#f0ead8';ctx.fillRect(-7,ty+1,12,9);ctx.fillStyle='#dad3c1';ctx.fillRect(-10,ty+2,4,8);ctx.fillStyle='#b1aa9c';ctx.fillRect(-8,ty+10,16,2);ctx.fillStyle='#684429';ctx.fillRect(-10,ty+12,20,3);ctx.fillStyle='#ba8743';ctx.fillRect(-1,ty+12,3,3);
      // head, hair, face
      ctx.fillStyle='#d59e72';ctx.fillRect(-6,0+idle,11,10);ctx.fillStyle='#e7b58a';ctx.fillRect(-3,4+idle,8,5);ctx.fillStyle='#552b1c';ctx.fillRect(-8,-2+idle,14,5);ctx.fillRect(-8,1+idle,4,7);ctx.fillRect(2,0+idle,5,4);ctx.fillStyle='#211612';ctx.fillRect(3,5+idle,2,1);
      // sword arm / attack arc
      ctx.fillStyle='#d5a078';ctx.fillRect(7,12,5,5);if(this.state==='ATTACK'){
        const p=clamp(1-this.attackTimer/.22,0,1),angle=-1.22+p*1.68;ctx.save();ctx.translate(10,14);ctx.rotate(angle);ctx.globalAlpha=.2;ctx.fillStyle='#f6dda0';ctx.beginPath();ctx.moveTo(5,-6);ctx.lineTo(30,-2);ctx.lineTo(29,5);ctx.lineTo(5,5);ctx.fill();ctx.globalAlpha=1;ctx.fillStyle='#7c552e';ctx.fillRect(0,-2,7,4);ctx.fillStyle='#d9e0df';ctx.fillRect(6,-2,22,3);ctx.fillStyle='#fffaf0';ctx.fillRect(23,-2,6,1);ctx.fillStyle='#d6aa40';ctx.fillRect(5,-4,2,7);ctx.restore();
      }else{ctx.fillStyle='#73502d';ctx.fillRect(10,12,3,6);ctx.fillStyle='#cbd2d0';ctx.fillRect(12,0,3,15);ctx.fillStyle='#f4f5ee';ctx.fillRect(13,0,1,12);ctx.fillStyle='#c39a3f';ctx.fillRect(10,13,7,2);}
      if(this.blocking){const shove=this.blockImpact>0?2:0;ctx.fillStyle='#5b421d';ctx.fillRect(6+shove,6,13,24);ctx.fillStyle='#b78629';ctx.fillRect(7+shove,5,12,24);ctx.fillStyle='#e3b642';ctx.fillRect(10+shove,7,7,19);ctx.fillStyle='#d7d5ca';ctx.fillRect(11+shove,11,5,9);ctx.fillStyle='#604718';ctx.fillRect(8+shove,27,10,2);ctx.fillStyle='#f1d26b';ctx.fillRect(13+shove,8,2,18);}
      ctx.restore();ctx.globalAlpha=1;
    }
  }

  const palettes = [
    {sky:'#7b9c9a',skyTop:'#314850',far:'#4a6a62',tree:'#2c533c',treeDark:'#152f27',grass:'#466f36',grassLight:'#8bac4e',dirt:'#654a39',dirtDark:'#352922',platformSide:'#514339',water:'#3d6d85',mist:'#b6cdbd',stone:'#6e756b',accent:'#c7a34f',sun:'#ead9a4'},
    {sky:'#6f8e89',skyTop:'#2b4048',far:'#415f57',tree:'#284935',treeDark:'#142923',grass:'#416731',grassLight:'#77984a',dirt:'#62483a',dirtDark:'#342822',platformSide:'#4c4037',water:'#38667e',mist:'#a9c1b1',stone:'#676f66',accent:'#bea04d',sun:'#decf9c'},
    {sky:'#697c74',skyTop:'#26343a',far:'#3b514b',tree:'#253b30',treeDark:'#131f1b',grass:'#3e5d2f',grassLight:'#708843',dirt:'#595047',dirtDark:'#302b27',platformSide:'#48433c',water:'#354f5d',mist:'#929f94',stone:'#6f7169',accent:'#af8d43',sun:'#d7c792'},
    {sky:'#66756f',skyTop:'#242f35',far:'#374943',tree:'#22352b',treeDark:'#131e1a',grass:'#3b552e',grassLight:'#687d3d',dirt:'#57433a',dirtDark:'#302722',platformSide:'#453a32',water:'#314f60',mist:'#83958b',stone:'#64655f',accent:'#aa8440',sun:'#cabb89'},
    {sky:'#5d6e6b',skyTop:'#232d34',far:'#334744',tree:'#1f322a',treeDark:'#111c19',grass:'#38502b',grassLight:'#62793b',dirt:'#534038',dirtDark:'#2d2522',platformSide:'#423731',water:'#2f4b5a',mist:'#768b83',stone:'#5d615d',accent:'#a67d3b',sun:'#c1af78'},
    {sky:'#514f5d',skyTop:'#1d1c29',far:'#3d3b47',tree:'#26312d',treeDark:'#111918',grass:'#3d4930',grassLight:'#6b7440',dirt:'#504039',dirtDark:'#292222',platformSide:'#403530',water:'#304455',mist:'#777481',stone:'#5e5a5c',accent:'#a4773d',sun:'#d09c69'},
    {sky:'#3a2e34',skyTop:'#120f17',far:'#44343b',tree:'#292729',treeDark:'#111113',grass:'#4b4e2f',grassLight:'#817642',dirt:'#554139',dirtDark:'#2c2222',platformSide:'#443632',water:'#342f3b',mist:'#6d5962',stone:'#5a5051',accent:'#b07945',sun:'#d46a53'}
  ];

  function makeLevel(index){
    const ground=(x,w,y=224)=>new Platform(x,y,w,H-y,'ground');
    const ledge=(x,y,w,type='ground',opts={})=>new Platform(x,y,w,12,type,opts);
    const level={index,width:1500,groundY:224,platforms:[],hazards:[],checkpoints:[],decor:[],enemies:[],start:{x:40,y:190},endX:1400,arena:null,theme:'forest'};
    if(index===LEVEL.TRAINING){
      level.width=1510;level.endX=1435;level.theme='training';
      level.platforms=[ground(0,330),ground(375,335),ground(750,760),ledge(455,184,92),ledge(645,174,74),ledge(875,188,86),ledge(1045,164,76),ledge(1210,190,105)];
      level.hazards=[{x:330,y:226,w:45,h:44,type:'water'}];level.checkpoints=[new Checkpoint(1340,190)];
      level.enemies=[new Enemy('sword',1000,190),new Enemy('archer',1215,190)];
    }else if(index===LEVEL.FOREST){
      level.width=1950;level.endX=1875;level.theme='forest';
      level.platforms=[ground(0,270),ground(335,245),ground(650,230),ground(950,290),ground(1325,625),ledge(282,194,50,'moving',{axis:'y',range:17,speed:1.8}),ledge(535,190,55),ledge(590,166,76,'falling'),ledge(875,190,64,'moving',{axis:'x',range:18,speed:1.45}),ledge(1175,193,62),ledge(1232,166,78),ledge(1297,187,60,'falling'),ledge(1490,181,78,'moving',{axis:'y',range:16,speed:2})];
      level.hazards=[{x:270,y:226,w:65,h:44,type:'water'},{x:580,y:223,w:70,h:47,type:'spike'},{x:880,y:226,w:70,h:44,type:'water'},{x:1240,y:223,w:85,h:47,type:'spike'}];
      level.checkpoints=[new Checkpoint(1015,190),new Checkpoint(1740,190)];
      level.enemies=[new Enemy('crawler',430,214),new Enemy('wolf',730,205),new Enemy('bat',1110,125),new Enemy('archer',1515,190)];
    }else if(index===LEVEL.RUINS){
      level.width=1880;level.endX=1800;level.theme='ruins';
      level.platforms=[ground(0,340),ground(405,245),ground(715,310),ground(1090,250),ground(1405,475),ledge(350,188,58),ledge(650,171,70),ledge(1015,188,65,'moving',{axis:'y',range:14,speed:1.6}),ledge(1295,163,86),ledge(1370,190,62),ledge(1600,172,90)];
      level.hazards=[{x:340,y:223,w:65,h:47,type:'spike'},{x:650,y:226,w:65,h:44,type:'water'},{x:1025,y:223,w:65,h:47,type:'spike'},{x:1340,y:226,w:65,h:44,type:'water'}];
      level.checkpoints=[new Checkpoint(845,190),new Checkpoint(1680,190)];
      level.enemies=[new Enemy('shield',500,190),new Enemy('bat',790,118),new Enemy('archer',955,190),new Enemy('crawler',1185,214),new Enemy('shield',1515,190)];
    }else if(index===LEVEL.TRIAL){
      level.width=1600;level.endX=1520;level.theme='arena';
      level.platforms=[ground(0,1600),ledge(220,180,100),ledge(535,165,105),ledge(900,179,105),ledge(1210,160,95)];level.checkpoints=[new Checkpoint(185,190),new Checkpoint(1410,190)];
      level.arena={startX:365,left:340,right:1260,started:false,cleared:false,waves:0,spawnTimer:0};
    }else if(index===LEVEL.DANGER){
      level.width=2240;level.endX=2160;level.theme='danger';
      level.platforms=[ground(0,280),ground(350,245),ground(665,220),ground(955,300),ground(1345,275),ground(1690,550),ledge(300,196,50,'moving',{axis:'y',range:13,speed:1.8}),ledge(575,191,55),ledge(615,167,72),ledge(875,187,72,'moving',{axis:'x',range:15,speed:1.4}),ledge(1260,192,62,'falling'),ledge(1315,166,78),ledge(1605,191,62,'moving',{axis:'y',range:15,speed:2}),ledge(1660,165,78),ledge(1880,184,76,'falling')];
      level.hazards=[{x:280,y:223,w:70,h:47,type:'spike'},{x:595,y:226,w:70,h:44,type:'water'},{x:885,y:223,w:70,h:47,type:'spike'},{x:1255,y:226,w:90,h:44,type:'water'},{x:1620,y:223,w:70,h:47,type:'spike'}];
      level.checkpoints=[new Checkpoint(1080,190),new Checkpoint(1995,190)];
      level.enemies=[new Enemy('sword',485,190),new Enemy('archer',760,190),new Enemy('wolf',1070,205),new Enemy('shield',1455,190),new Enemy('bat',1560,118),new Enemy('elite',1880,190),new Enemy('archer',2060,190)];
    }else if(index===LEVEL.TWILIGHT){
      level.width=1820;level.endX=1745;level.theme='twilight';
      level.platforms=[ground(0,410),ground(465,315),ground(835,320),ground(1210,610),ledge(415,184,55),ledge(790,174,62),ledge(1155,188,58),ledge(1390,160,88),ledge(1540,184,84)];
      level.hazards=[{x:410,y:226,w:55,h:44,type:'water'},{x:780,y:223,w:55,h:47,type:'spike'},{x:1155,y:226,w:55,h:44,type:'water'}];
      level.checkpoints=[new Checkpoint(925,190),new Checkpoint(1610,190)];
      level.enemies=[new Enemy('bat',525,112),new Enemy('wolf',685,205),new Enemy('elite',1010,190),new Enemy('bat',1320,105),new Enemy('shield',1510,190)];
    }else{
      level.width=1260;level.endX=1190;level.groundY=226;level.theme='boss';level.platforms=[ground(0,1260,226)];level.checkpoints=[new Checkpoint(530,192)];level.start={x:430,y:190};
    }
    return level;
  }

  class Game {
    constructor(){
      this.scene='title';this.levelIndex=0;this.level=makeLevel(0);this.player=new Player(40,190);this.enemies=[];this.projectiles=[];this.shockwaves=[];this.boss=null;this.particles=[];
      this.camera={x:0,y:0};this.time=0;this.noticeText='';this.noticeTimer=0;this.levelTitleTimer=0;this.levelTitle='';this.fade=0;this.fadeDir=0;this.transitionPending=false;
      this.checkpoint={level:0,x:40,y:190};this.tutorial={move:false,jump:false,attack:false,block:false};this.paused=false;this.hitStop=0;this.shakePower=0;this.shakeTimer=0;
      this.introTime=0;this.dialogueIndex=0;this.dialogueLines=[];this.cliffTime=0;this.creditsTime=0;this.endOverlay=null;this.bossStarted=false;this.bossDefeatTimer=0;
      this.lastTime=performance.now();this.accumulator=0;
      this.bindUI();this.applyLanguage();audio.setMusic('none');
      requestAnimationFrame((ts)=>this.loop(ts));
    }
    bindUI(){
      ui.start.addEventListener('click',()=>{audio.unlock();audio.sfx('click');this.startIntro();});
      ui.options.addEventListener('click',()=>{audio.unlock();audio.sfx('click');this.showOptions(false);});
      ui.controls.addEventListener('click',()=>{audio.unlock();audio.sfx('click');this.showControls(false);});
      ui.language.addEventListener('click',()=>{audio.unlock();audio.sfx('click');this.toggleLanguage();});
      ui.modalClose.addEventListener('click',()=>{audio.sfx('click');ui.modal.classList.add('hidden');});
      ui.pauseResume.addEventListener('click',()=>this.setPaused(false));
      ui.pauseRestart.addEventListener('click',()=>{this.setPaused(false);this.respawn(true);});
      ui.pauseControls.addEventListener('click',()=>this.showControls(true));
      ui.pauseOptions.addEventListener('click',()=>this.showOptions(true));
      ui.pauseLanguage.addEventListener('click',()=>this.toggleLanguage());
      ui.pauseQuit.addEventListener('click',()=>{this.setPaused(false);this.toTitle();});
      ui.pauseTouch.addEventListener('click',()=>{if(this.scene==='game')this.setPaused(!this.paused);});
      ui.orientationBtn.addEventListener('click',()=>this.requestLandscape());
      canvas.addEventListener('pointerdown',()=>{if(this.scene==='dialogue')this.advanceDialogue();else if(this.scene==='intro'&&this.introTime>2)this.introTime=999;});
      const refreshViewport=()=>{resizeCanvasToViewport();this.updateOrientationGate();};
      window.addEventListener('resize',refreshViewport,{passive:true});
      window.addEventListener('orientationchange',()=>setTimeout(refreshViewport,120),{passive:true});
      document.addEventListener('fullscreenchange',()=>setTimeout(refreshViewport,60));
      this.updateOrientationGate();
    }
    applyLanguage(){
      document.documentElement.lang=settings.language==='ptBR'?'pt-BR':'en';
      ui.eyebrow.textContent=t('presents');ui.subtitle.textContent=t('subtitle');ui.start.textContent=t('startJourney');ui.options.textContent=t('options');ui.controls.textContent=t('controls');
      ui.language.textContent=`${t('language')}: ${t('languageName')}`;ui.titleHint.textContent=t('keyboardTouch');ui.modalClose.textContent=t('back');
      ui.pauseTitle.textContent=t('paused');ui.pauseResume.textContent=t('resume');ui.pauseRestart.textContent=t('restartCheckpoint');ui.pauseControls.textContent=t('controls');ui.pauseOptions.textContent=t('options');ui.pauseLanguage.textContent=`${t('language')}: ${t('languageName')}`;ui.pauseQuit.textContent=t('quitTitle');
      const jumpBtn=document.querySelector('[data-action="jump"]');const attackBtn=document.querySelector('[data-action="attack"]');const blockBtn=document.querySelector('[data-action="block"]');
      const leftBtn=document.querySelector('[data-action="left"]');const rightBtn=document.querySelector('[data-action="right"]');
      if(jumpBtn)jumpBtn.setAttribute('aria-label',t('jump'));if(attackBtn)attackBtn.setAttribute('aria-label',t('attack'));if(blockBtn)blockBtn.setAttribute('aria-label',t('block'));
      if(leftBtn)leftBtn.setAttribute('aria-label',settings.language==='ptBR'?'Mover para esquerda':'Move left');if(rightBtn)rightBtn.setAttribute('aria-label',settings.language==='ptBR'?'Mover para direita':'Move right');
      ui.pauseTouch.setAttribute('aria-label',t('pause'));
      ui.orientationTitle.textContent=t('rotateTitle');ui.orientationText.textContent=t('rotateText');ui.orientationBtn.textContent=t('rotateButton');ui.orientationHelp.textContent=t('rotateHelp');
      if(!ui.modal.classList.contains('hidden')){const type=ui.modal.dataset.type;if(type==='options')this.showOptions(this.paused);if(type==='controls')this.showControls(this.paused);}
      if(this.scene==='dialogue'&&this.bossDefeatTimer>0)this.buildFinalDialogue();
      if(this.endOverlay)this.buildEndOverlay();
    }
    isTouchDevice(){return navigator.maxTouchPoints>0||window.matchMedia('(pointer: coarse)').matches;}
    updateOrientationGate(){
      const portrait=window.innerHeight>window.innerWidth;
      const shouldShow=this.isTouchDevice()&&portrait;
      ui.orientation.classList.toggle('visible',shouldShow);
      ui.orientation.setAttribute('aria-hidden',shouldShow?'false':'true');
      if(shouldShow)input.clear();
    }
    async requestLandscape(){
      audio.unlock();audio.sfx('click');
      try{
        const target=document.documentElement;
        if(!document.fullscreenElement&&target.requestFullscreen)await target.requestFullscreen({navigationUI:'hide'});
      }catch{/* Fullscreen is optional and browser-dependent. */}
      try{
        if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock('landscape');
      }catch{/* iOS and some browsers require manual rotation. */}
      setTimeout(()=>{resizeCanvasToViewport();this.updateOrientationGate();},120);
    }
    toggleLanguage(){settings.language=settings.language==='en'?'ptBR':'en';saveSettings();this.applyLanguage();audio.sfx('click');}
    showOptions(fromPause){
      ui.modal.dataset.type='options';ui.modalTitle.textContent=t('options');
      ui.modalContent.innerHTML=`
        <div class="option-row"><label><span>${t('musicVolume')}</span><b id="music-val">${Math.round(settings.music*100)}%</b></label><input id="music-range" type="range" min="0" max="1" step="0.05" value="${settings.music}"></div>
        <div class="option-row"><label><span>${t('sfxVolume')}</span><b id="sfx-val">${Math.round(settings.sfx*100)}%</b></label><input id="sfx-range" type="range" min="0" max="1" step="0.05" value="${settings.sfx}"></div>
        <label class="toggle-row"><span>${t('screenShake')}</span><input id="shake-toggle" type="checkbox" ${settings.screenShake?'checked':''}></label>
        <label class="toggle-row"><span>${t('reducedEffects')}</span><input id="reduced-toggle" type="checkbox" ${settings.reducedEffects?'checked':''}></label>
        <button id="option-fullscreen" class="pixel-btn" type="button">${t('fullscreen')}</button>
        <button id="option-language" class="pixel-btn" type="button">${t('language')}: ${t('languageName')}</button>`;
      ui.modal.classList.remove('hidden');
      const mr=$('music-range'),sr=$('sfx-range');
      mr.addEventListener('input',()=>{settings.music=Number(mr.value);$('music-val').textContent=Math.round(settings.music*100)+'%';saveSettings();audio.syncVolumes();});
      sr.addEventListener('input',()=>{settings.sfx=Number(sr.value);$('sfx-val').textContent=Math.round(settings.sfx*100)+'%';saveSettings();audio.syncVolumes();});
      $('shake-toggle').addEventListener('change',(e)=>{settings.screenShake=e.target.checked;saveSettings();});
      $('reduced-toggle').addEventListener('change',(e)=>{settings.reducedEffects=e.target.checked;saveSettings();});
      $('option-fullscreen').addEventListener('click',async()=>{audio.sfx('click');try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen({navigationUI:'hide'});}catch{};setTimeout(()=>{resizeCanvasToViewport();this.updateOrientationGate();},80);});
      $('option-language').addEventListener('click',()=>this.toggleLanguage());
    }
    showControls(fromPause){
      ui.modal.dataset.type='controls';ui.modalTitle.textContent=t('controls');
      ui.modalContent.innerHTML=`<div class="control-grid">
        <b>A / D · ← →</b><span>${t('move')}</span>
        <b>SPACE · W · ↑</b><span>${t('jump')}</span>
        <b>J · X</b><span>${t('attack')}</span>
        <b>K · C</b><span>${t('block')}</span>
        <b>ESC · P</b><span>${t('pause')}</span>
        <b>ENTER · E</b><span>${t('interact')}</span>
      </div>`;
      ui.modal.classList.remove('hidden');
    }
    setPaused(v){
      if(this.scene!=='game')return;this.paused=v;ui.pause.classList.toggle('hidden',!v);if(v)input.clear();audio.sfx('click');
    }
    startIntro(){
      ui.title.classList.add('hidden');ui.modal.classList.add('hidden');ui.youtube.classList.add('hidden');this.removeEndOverlay();
      this.scene='intro';this.introTime=0;this.fade=1;this.fadeDir=-1;audio.setMusic('intro');this.setGameplayUI(false);
    }
    startGame(levelIndex=0){
      this.scene='game';this.paused=false;ui.pause.classList.add('hidden');this.loadLevel(levelIndex,true);this.setGameplayUI(true);
    }
    loadLevel(index,fresh=false){
      this.levelIndex=index;this.level=makeLevel(index);this.enemies=[...this.level.enemies];this.projectiles=[];this.shockwaves=[];this.boss=null;this.bossStarted=false;this.bossDefeatTimer=0;this.particles=[];this.player=new Player(this.level.start.x,this.level.start.y);this.camera.x=clamp(this.player.x-W*.38,0,Math.max(0,this.level.width-W));
      if(index===0)this.tutorial={move:false,jump:false,attack:false,block:false};
      this.checkpoint={level:index,x:this.level.start.x,y:this.level.start.y};this.levelTitle=t(`level${index+1}`);this.levelTitleTimer=2.2;this.fade=1;this.fadeDir=-1;
      const mus=['forest','path','ruins','combat','danger','twilight','boss'][index]||'forest';audio.setMusic(mus);
    }
    setGameplayUI(active){ui.mobileControls.classList.toggle('gameplay',active);ui.pauseTouch.classList.toggle('gameplay',active);}
    toTitle(){
      this.scene='title';this.paused=false;ui.pause.classList.add('hidden');ui.modal.classList.add('hidden');ui.title.classList.remove('hidden');ui.youtube.classList.add('hidden');this.removeEndOverlay();this.setGameplayUI(false);audio.setMusic('title');this.applyLanguage();
    }
    respawn(force=false){
      const cp=this.checkpoint.level===this.levelIndex?this.checkpoint:{level:this.levelIndex,x:this.level.start.x,y:this.level.start.y};
      this.player=new Player(cp.x,cp.y);this.player.hp=this.player.maxHp;this.projectiles=[];this.shockwaves=[];this.camera.x=clamp(cp.x-W*.35,0,Math.max(0,this.level.width-W));this.notice(t('tryAgain'),.9);
      if(this.levelIndex===LEVEL.TRIAL&&this.level.arena&&this.level.arena.started&&!this.level.arena.cleared){this.level=makeLevel(LEVEL.TRIAL);this.enemies=[];this.checkpoint={level:LEVEL.TRIAL,x:185,y:190};}
      if(this.levelIndex===LEVEL.BOSS&&this.bossStarted){this.boss=null;this.bossStarted=false;this.bossDefeatTimer=0;}
    }
    notice(text,time=1){this.noticeText=text;this.noticeTimer=time;}
    burst(x,y,color,count=8){
      const n=settings.reducedEffects?Math.max(2,Math.floor(count*.4)):count;
      for(let i=0;i<n;i++)this.particles.push(new Particle(x,y,(Math.random()-.5)*85,-25-Math.random()*80,.25+Math.random()*.35,color,1+Math.floor(Math.random()*2)));
    }
    shake(power,time){if(!settings.screenShake)return;this.shakePower=Math.max(this.shakePower,power);this.shakeTimer=Math.max(this.shakeTimer,time);}
    moveEntity(ent,dt,isPlayer=false){
      ent.onGround=false;if(isPlayer)ent.onPlatform=null;
      const prevX=ent.x,prevY=ent.y;

      ent.x+=ent.vx*dt;
      for(const p of this.level.platforms){
        // One-way ledges never behave like walls. This lets the player run beneath a ledge or
        // jump through it from below, while still allowing a normal landing from above.
        if(p.oneWay)continue;
        if(rectsOverlap(ent,p)){
          if(ent.vx>0)ent.x=p.x-ent.w;else if(ent.vx<0)ent.x=p.x+p.w;
          ent.vx=0;
        }
      }

      ent.y+=ent.vy*dt;
      for(const p of this.level.platforms){
        if(p.oneWay){
          if(ent.vy<0)continue;
          const prevBottom=prevY+ent.h;
          const nextBottom=ent.y+ent.h;
          const horizontallyOverlapping=ent.x+ent.w>p.x+1&&ent.x<p.x+p.w-1;
          // A small tolerance keeps landings stable on moving platforms without turning the
          // underside into a ceiling.
          if(horizontallyOverlapping&&prevBottom<=p.y+5&&nextBottom>=p.y){
            ent.y=p.y-ent.h;ent.vy=0;ent.onGround=true;if(isPlayer)ent.onPlatform=p;
          }
          continue;
        }
        if(rectsOverlap(ent,p)){
          if(ent.vy>=0 && prevY+ent.h<=p.y+5){ent.y=p.y-ent.h;ent.vy=0;ent.onGround=true;if(isPlayer)ent.onPlatform=p;}
          else if(ent.vy<0){ent.y=p.y+p.h;ent.vy=0;}
        }
      }
    }
    transitionNext(){if(this.transitionPending)return;this.transitionPending=true;this.fadeDir=1;this.fade=0;}
    onFadeComplete(){
      if(!this.transitionPending)return;this.transitionPending=false;
      if(this.levelIndex<FINAL_LEVEL)this.loadLevel(this.levelIndex+1,true);
    }
    updateArena(dt){
      const a=this.level.arena;if(!a)return;
      if(!a.started&&this.player.x>a.startX){a.started=true;a.waves=1;a.spawnTimer=.55;this.notice(t('wave'),1.3);}
      if(!a.started||a.cleared)return;
      this.player.x=clamp(this.player.x,a.left,a.right-this.player.w);
      if(a.spawnTimer>0){a.spawnTimer-=dt;if(a.spawnTimer<=0){
        const y=190;
        if(a.waves===1)this.enemies.push(new Enemy('sword',a.left+34,y),new Enemy('runner',a.right-52,y));
        else if(a.waves===2)this.enemies.push(new Enemy('shield',a.left+45,y),new Enemy('archer',a.right-62,y),new Enemy('bat',a.right-170,112));
        else if(a.waves===3)this.enemies.push(new Enemy('wolf',a.left+40,205),new Enemy('sword',a.left+104,y),new Enemy('archer',a.right-60,y));
        else if(a.waves===4)this.enemies.push(new Enemy('elite',a.left+55,y),new Enemy('crawler',a.left+160,214),new Enemy('shield',a.right-85,y));
      }}
      const alive=this.enemies.filter(e=>!e.dead).length;
      if(a.spawnTimer<=0&&alive===0){if(a.waves<4){a.waves++;a.spawnTimer=.8;}else{a.cleared=true;this.notice(t('pathOpen'),1.6);audio.sfx('checkpoint');}}
    }
    startBoss(){
      if(this.bossStarted)return;this.bossStarted=true;this.player.x=Math.max(this.player.x,610);this.boss=new BossOldMan(990,this.level.groundY);this.notice(t('finalLesson'),1.7);this.shake(1.8,.14);
    }
    onBossDefeated(){this.bossDefeatTimer=1.5;this.setGameplayUI(false);}
    buildFinalDialogue(){this.dialogueLines=[t('trainingComplete'),t('inherit'),t('mustKnow')];}
    beginDialogue(){
      this.scene='dialogue';this.dialogueIndex=0;this.buildFinalDialogue();audio.setMusic('ending');this.setGameplayUI(false);
    }
    advanceDialogue(){
      if(this.scene!=='dialogue')return;audio.sfx('click');this.dialogueIndex++;
      if(this.dialogueIndex>=this.dialogueLines.length){this.scene='cliff';this.cliffTime=0;}
    }
    beginCredits(){this.scene='credits';this.creditsTime=0;ui.youtube.classList.add('hidden');}
    showEnd(){
      this.scene='end';ui.youtube.classList.remove('hidden');this.buildEndOverlay();
    }
    buildEndOverlay(){
      this.removeEndOverlay();
      const el=document.createElement('section');el.id='end-overlay';el.className='overlay modal';
      el.innerHTML=`<div class="panel pause-panel" style="text-align:center"><h2>${t('thankYou')}</h2><button id="end-replay" class="pixel-btn primary" type="button">${t('replay')}</button><a class="pixel-btn" style="display:block;text-decoration:none;margin-top:8px" href="https://www.youtube.com/@ViguStudio" target="_blank" rel="noopener noreferrer">${t('youtube')} · VIGU STUDIO</a></div>`;
      document.getElementById('game-frame').appendChild(el);this.endOverlay=el;
      el.querySelector('#end-replay').addEventListener('click',()=>{this.removeEndOverlay();ui.youtube.classList.add('hidden');this.startIntro();});
    }
    removeEndOverlay(){if(this.endOverlay){this.endOverlay.remove();this.endOverlay=null;}}
    update(dt){
      this.time+=dt;
      if(this.scene==='title')return;
      if(this.scene==='intro'){this.introTime+=dt;if(input.confirmTap()&&this.introTime>1.2)this.introTime=999;if(this.introTime>32)this.startGame(0);return;}
      if(this.scene==='dialogue'){if(input.confirmTap())this.advanceDialogue();return;}
      if(this.scene==='cliff'){this.cliffTime+=dt;if(this.cliffTime>4.8)this.beginCredits();return;}
      if(this.scene==='credits'){this.creditsTime+=dt;const total=translations[settings.language].creditLines.length*18+H+100;if(this.creditsTime*22>total)this.showEnd();return;}
      if(this.scene==='end'||this.scene!=='game')return;
      if(input.pauseTap()){this.setPaused(!this.paused);return;}if(this.paused)return;if(this.hitStop>0){this.hitStop-=dt;return;}
      if(this.noticeTimer>0)this.noticeTimer-=dt;if(this.levelTitleTimer>0)this.levelTitleTimer-=dt;if(this.shakeTimer>0){this.shakeTimer-=dt;if(this.shakeTimer<=0)this.shakePower=0;}
      this.level.platforms.forEach(p=>p.update(dt,this.player));this.player.update(dt,this);
      for(const h of this.level.hazards){const hitbox=h.type==='spike'?{x:h.x+3,y:h.y+3,w:Math.max(1,h.w-6),h:Math.max(1,h.h-3)}:h;if(rectsOverlap(this.player,hitbox)){if(h.type==='water'){this.player.damage(99,h.x,false,this);this.player.deathTimer=.18;}else if(h.type==='spike'&&this.player.vy>=0)this.player.damage(1,h.x+h.w/2,true,this);}}
      for(const cp of this.level.checkpoints)cp.update(this.player,this);
      if(this.levelIndex===LEVEL.TRIAL)this.updateArena(dt);
      for(const e of this.enemies)e.update(dt,this);this.enemies=this.enemies.filter(e=>!(e.dead&&e.y>H+90));
      for(const p of this.projectiles)p.update(dt,this);this.projectiles=this.projectiles.filter(p=>!p.dead);
      for(const w of this.shockwaves)w.update(dt,this);this.shockwaves=this.shockwaves.filter(w=>!w.dead);
      if(this.levelIndex===LEVEL.BOSS){
        if(!this.bossStarted&&this.player.x>610)this.startBoss();
        if(this.bossStarted&&this.boss&&!this.boss.dead)this.player.x=clamp(this.player.x,595,this.level.width-this.player.w-18);
        if(this.boss)this.boss.update(dt,this);
        if(this.bossDefeatTimer>0){this.bossDefeatTimer-=dt;if(this.bossDefeatTimer<=0)this.beginDialogue();}
      }
      for(const p of this.particles)p.update(dt);this.particles=this.particles.filter(p=>p.life>0);
      if(this.levelIndex<FINAL_LEVEL&&this.player.x>this.level.endX){if(this.levelIndex!==LEVEL.TRIAL||this.level.arena.cleared)this.transitionNext();}
      if(this.fadeDir!==0){this.fade=clamp(this.fade+this.fadeDir*dt*1.9,0,1);if(this.fadeDir<0&&this.fade<=0)this.fadeDir=0;if(this.fadeDir>0&&this.fade>=1){this.fadeDir=0;this.onFadeComplete();}}
      const lookAhead=clamp(this.player.vx*.45,-26,26);let target=clamp(this.player.x-W*.42+lookAhead,0,Math.max(0,this.level.width-W));
      if(this.levelIndex===LEVEL.BOSS&&this.bossStarted)target=clamp(780-W*.5,0,Math.max(0,this.level.width-W));
      this.camera.x=lerp(this.camera.x,target,1-Math.pow(.001,dt));
    }
    drawBackground(palette){
      const boss=this.levelIndex===LEVEL.BOSS,twilight=this.levelIndex===LEVEL.TWILIGHT,ruins=this.levelIndex===LEVEL.RUINS;
      const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,palette.skyTop);grad.addColorStop(.58,palette.sky);grad.addColorStop(1,palette.far);ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
      // celestial light: pale sun in early areas, amber dusk, blood-red moon in the duel.
      const orbX=W*.78-Math.round(this.camera.x*.018),orbY=boss?43:twilight?47:40,orbR=boss?30:twilight?25:22;
      ctx.globalAlpha=boss?.32:.18;ctx.fillStyle=boss?'#e45848':twilight?'#e2a36c':palette.sun;ctx.beginPath();ctx.arc(orbX,orbY,orbR,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
      if(boss){ctx.globalAlpha=.1;ctx.fillStyle='#ff7057';ctx.beginPath();ctx.arc(orbX,orbY,orbR+8,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
      // layered mountain skyline.
      ctx.fillStyle=boss?'#241d27':'rgba(31,47,48,.52)';ctx.beginPath();ctx.moveTo(0,135);for(let x=-40;x<W+80;x+=72){const n=((x/72)|0);ctx.lineTo(x,105-((n*17)%38));ctx.lineTo(x+38,82-((n*23)%27));ctx.lineTo(x+74,120-((n*11)%30));}ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
      // distant castle/ruins. This is procedural scenery, not the reference image itself.
      const castleX=Math.round(W*.68-this.camera.x*.075);const castleY=boss?83:92;ctx.globalAlpha=boss?.82:.38;ctx.fillStyle=boss?'#16131a':'#263d3b';
      ctx.fillRect(castleX,castleY,72,70);ctx.fillRect(castleX+10,castleY-25,15,25);ctx.fillRect(castleX+48,castleY-34,14,34);ctx.fillRect(castleX+31,castleY-13,13,13);ctx.fillRect(castleX+13,castleY-32,9,7);ctx.fillRect(castleX+50,castleY-41,10,8);
      ctx.beginPath();ctx.moveTo(castleX+8,castleY-25);ctx.lineTo(castleX+17,castleY-38);ctx.lineTo(castleX+26,castleY-25);ctx.fill();ctx.beginPath();ctx.moveTo(castleX+46,castleY-34);ctx.lineTo(castleX+55,castleY-51);ctx.lineTo(castleX+64,castleY-34);ctx.fill();ctx.globalAlpha=1;
      // thin cloud/fog bands.
      ctx.fillStyle=boss?'rgba(105,74,82,.14)':'rgba(225,231,214,.15)';for(let i=0;i<Math.ceil(W/150)+3;i++){const bx=Math.round(((i*151-this.camera.x*.04+this.time*.8)%(W+190))-90),by=37+(i%3)*25;ctx.fillRect(bx,by,74,4);ctx.fillRect(bx+17,by-5,39,5);ctx.fillRect(bx+30,by-9,22,4);}
      // deep tree silhouettes.
      for(let layer=0;layer<2;layer++){const speed=layer===0?.18:.31,spacing=layer===0?49:65;ctx.fillStyle=layer===0?palette.treeDark:palette.tree;ctx.globalAlpha=layer===0?.86:.73;for(let i=-3;i<Math.ceil(W/spacing)+5;i++){const wx=i*spacing+(layer*19),x=Math.round(wx-(this.camera.x*speed%spacing)),th=46+((i*17)%5)*8;ctx.fillRect(x+20,134-th,7,th+95);ctx.fillRect(x+4,128-th,39,16);ctx.fillRect(x+10,117-th,29,14);ctx.fillRect(x+15,108-th,20,11);}}ctx.globalAlpha=1;
      // ruined arches create a stronger medieval silhouette in the second half of the demo.
      if(this.levelIndex>=LEVEL.RUINS){ctx.globalAlpha=ruins?.45:.26;ctx.fillStyle=palette.stone;for(let i=-1;i<Math.ceil(W/180)+2;i++){const x=Math.round(i*180-(this.camera.x*.4%180));ctx.fillRect(x+22,117,12,87);ctx.fillRect(x+94,117,12,87);ctx.fillRect(x+22,112,84,9);ctx.fillRect(x+34,117,60,5);ctx.fillStyle=palette.treeDark;ctx.beginPath();ctx.arc(x+64,145,30,Math.PI,0);ctx.lineTo(x+94,172);ctx.lineTo(x+34,172);ctx.fill();ctx.fillStyle=palette.stone;}ctx.globalAlpha=1;}
      ctx.fillStyle=palette.mist;ctx.globalAlpha=boss?.06:.1;ctx.fillRect(0,146,W,42);ctx.globalAlpha=1;
      // near trunks; they gradually thin out toward the final clearing.
      if(!boss){const density=twilight?190:150;for(let i=-2;i<Math.ceil(W/density)+5;i++){const world=i*density+74,x=Math.round(world-this.camera.x*.58),sway=Math.round(Math.sin(this.time*.75+i)*1);ctx.fillStyle='#342a24';ctx.fillRect(x+17,108,15,H-108);ctx.fillStyle='#60452f';ctx.fillRect(x+20,108,6,H-108);ctx.fillStyle='#876044';ctx.fillRect(x+22,112,2,65);ctx.fillStyle=palette.treeDark;ctx.fillRect(x-13+sway,86,68,32);ctx.fillRect(x+sway,67,49,25);ctx.fillRect(x+10+sway,53,31,20);ctx.fillStyle=palette.tree;ctx.fillRect(x-5+sway,83,49,22);ctx.fillRect(x+7+sway,65,34,18);ctx.fillStyle='rgba(174,193,103,.22)';ctx.fillRect(x+2+sway,84,20,3);if(i%2===0){ctx.fillStyle='#27352a';ctx.fillRect(x+9,115,2,38);ctx.fillRect(x+11,150,11,2);}}}
      else{ctx.fillStyle='rgba(18,16,19,.72)';ctx.fillRect(0,151,W,4);for(const side of [35,W-64]){ctx.fillStyle='#40373a';ctx.fillRect(side,111,22,113);ctx.fillStyle='#6b5c58';ctx.fillRect(side+4,114,5,77);ctx.fillRect(side-8,107,38,8);ctx.fillStyle='#211e21';ctx.fillRect(side+8,132,6,14);}ctx.fillStyle='rgba(140,70,61,.08)';ctx.fillRect(0,0,W,H);}
      // ambient motes and leaves, bounded for performance.
      if(!settings.reducedEffects&&!boss){ctx.fillStyle=twilight?'rgba(220,151,82,.32)':'rgba(190,174,102,.34)';for(let i=0;i<12;i++){const lx=Math.round((i*83+this.time*(3+i%3)-this.camera.x*.41)%(W+34))-17,ly=62+((i*37)%116);ctx.fillRect(lx,ly,1+(i%2),1);}}
    }
    drawHazard(h,palette){
      const x=Math.round(h.x-this.camera.x),y=Math.round(h.y);
      if(h.type==='water'){
        const g=ctx.createLinearGradient(0,y,0,H);g.addColorStop(0,palette.water);g.addColorStop(1,'#172d38');ctx.fillStyle=g;ctx.fillRect(x,y,h.w,H-y);
        ctx.fillStyle='rgba(194,225,224,.52)';for(let i=0;i<h.w;i+=17){const wobble=Math.round(Math.sin(this.time*3+i)*2);ctx.fillRect(x+i+wobble,y+3,10,2);}
        ctx.fillStyle='rgba(12,25,31,.35)';for(let i=5;i<h.w;i+=23)ctx.fillRect(x+i,y+11,13,2);
      }else{
        ctx.fillStyle='#66554a';ctx.fillRect(x,y+12,h.w,H-y-12);ctx.fillStyle='#312a27';ctx.fillRect(x,y+18,h.w,H-y-18);
        for(let i=0;i<h.w;i+=9){const hh=10+(i%3);ctx.fillStyle='#bfc0b7';ctx.beginPath();ctx.moveTo(x+i,y+13);ctx.lineTo(x+i+4,y+13-hh);ctx.lineTo(x+i+8,y+13);ctx.fill();ctx.fillStyle='#e0ddd0';ctx.fillRect(x+i+3,y+4,2,3);}
      }
    }
    drawDecor(palette){
      const baseY=this.level.groundY,theme=this.level.theme;
      const onGround=(wx)=>this.level.platforms.some(p=>wx>=p.x&&wx<=p.x+p.w&&Math.abs(p.y-baseY)<3);
      for(let i=0;i<Math.ceil(this.level.width/56);i++){const wx=i*56+18;if(!onGround(wx))continue;const x=Math.round(wx-this.camera.x);if(x<-25||x>W+25)continue;ctx.fillStyle=palette.grassLight;ctx.fillRect(x,baseY-8,2,8);ctx.fillRect(x+3,baseY-5,1,5);ctx.fillRect(x-2,baseY-4,1,4);if(i%4===0){ctx.fillStyle=palette.stone;ctx.fillRect(x+9,baseY-4,8,4);ctx.fillStyle='rgba(255,255,255,.2)';ctx.fillRect(x+11,baseY-5,4,1);}if(i%7===0){ctx.fillStyle='#b8a275';ctx.fillRect(x+23,baseY-5,2,5);ctx.fillStyle=theme==='twilight'?'#8e5e7a':'#7e4c43';ctx.fillRect(x+20,baseY-7,8,3);ctx.fillStyle='#d6c79f';ctx.fillRect(x+21,baseY-8,2,1);}}
      // hand-placed world props: order banners, arches, statues and torches.
      const props={
        training:[{x:760,t:'banner'}],forest:[{x:1480,t:'arch'},{x:1660,t:'torch'}],ruins:[{x:510,t:'statue'},{x:915,t:'arch'},{x:1490,t:'banner'},{x:1665,t:'torch'}],arena:[{x:290,t:'banner'},{x:1320,t:'banner'}],danger:[{x:720,t:'torch'},{x:1360,t:'arch'},{x:1880,t:'statue'}],twilight:[{x:520,t:'banner'},{x:1120,t:'statue'},{x:1510,t:'torch'}],boss:[{x:690,t:'banner'},{x:1085,t:'banner'},{x:820,t:'torch'},{x:1020,t:'torch'}]
      }[theme]||[];
      for(const pr of props){const x=Math.round(pr.x-this.camera.x);if(x<-60||x>W+60)continue;if(pr.t==='arch'){ctx.fillStyle='#4b4c47';ctx.fillRect(x,147,13,78);ctx.fillRect(x+48,147,13,78);ctx.fillRect(x,141,61,8);ctx.fillStyle='#6f7068';ctx.fillRect(x+3,144,55,3);ctx.fillStyle='#252a26';ctx.beginPath();ctx.arc(x+30,167,18,Math.PI,0);ctx.lineTo(x+48,183);ctx.lineTo(x+12,183);ctx.fill();ctx.fillStyle='#3c4b35';ctx.fillRect(x+4,142,2,31);ctx.fillRect(x+57,151,2,24);}else if(pr.t==='statue'){ctx.fillStyle='#4d504c';ctx.fillRect(x+5,164,20,60);ctx.fillRect(x,158,30,8);ctx.fillStyle='#6c7069';ctx.fillRect(x+8,154,14,13);ctx.fillRect(x+10,144,10,11);ctx.fillStyle='#2b2e2a';ctx.fillRect(x+12,147,2,2);ctx.fillRect(x+17,147,2,2);ctx.fillStyle='#7a735f';ctx.fillRect(x+14,165,3,24);}else if(pr.t==='banner'){ctx.fillStyle='#3a2b22';ctx.fillRect(x,145,4,79);ctx.fillStyle=theme==='boss'?'#6c2e31':'#5a4030';ctx.fillRect(x+4,151,24,36);ctx.fillStyle='#b88a45';ctx.fillRect(x+8,156,16,2);ctx.fillRect(x+15,160,2,20);ctx.fillRect(x+10,169,12,2);ctx.fillStyle='#302822';ctx.fillRect(x+4,185,7,5);ctx.fillRect(x+21,185,7,5);}else if(pr.t==='torch'){ctx.fillStyle='#4b3525';ctx.fillRect(x+7,171,4,53);ctx.fillStyle='#8f6739';ctx.fillRect(x+3,168,12,5);const flick=Math.sin(this.time*12+pr.x)*2;ctx.fillStyle='rgba(238,146,56,.18)';ctx.beginPath();ctx.arc(x+9,160,13+flick,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e9973e';ctx.fillRect(x+6,158,7,11);ctx.fillStyle='#ffd979';ctx.fillRect(x+8,154,4,10);}}
      if(theme==='boss'){ctx.globalAlpha=.22;ctx.fillStyle='#1a1116';for(let i=0;i<Math.ceil(W/68)+2;i++){const x=i*68-Math.round(this.camera.x*.86%68);ctx.fillRect(x,H-22,36,22);ctx.fillRect(x+10,H-31,5,12);}ctx.globalAlpha=1;}
      else{ctx.globalAlpha=.22;ctx.fillStyle='#0b1410';for(let i=0;i<Math.ceil(W/72)+2;i++){const x=i*72-Math.round(this.camera.x*.8%72);ctx.fillRect(x,H-22,34,22);ctx.fillRect(x+8,H-30,4,12);ctx.fillRect(x+18,H-27,3,9);}ctx.globalAlpha=1;}
    }
    drawHUD(){
      const top=7,left=8;
      // V3 crest + framed vitality display.
      ctx.fillStyle='rgba(5,7,9,.82)';ctx.fillRect(left,top,132,34);ctx.strokeStyle='#80683c';ctx.strokeRect(left+.5,top+.5,131,33);ctx.strokeStyle='rgba(218,179,88,.35)';ctx.strokeRect(left+4.5,top+4.5,123,25);
      ctx.save();ctx.translate(left+18,top+17);ctx.rotate(Math.PI/4);ctx.fillStyle='#171a1b';ctx.fillRect(-10,-10,20,20);ctx.strokeStyle='#c6a24f';ctx.strokeRect(-9.5,-9.5,19,19);ctx.rotate(-Math.PI/4);ctx.fillStyle='#c8d2cf';ctx.fillRect(-3,-8,6,15);ctx.fillStyle='#d1aa49';ctx.fillRect(-7,-1,14,3);ctx.fillStyle='#6c5330';ctx.fillRect(-2,6,4,5);ctx.restore();
      for(let i=0;i<this.player.maxHp;i++){const x=left+37+i*17,y=top+8,alive=i<this.player.hp;ctx.fillStyle=alive?'#772321':'#272427';ctx.fillRect(x+3,y,8,3);ctx.fillRect(x,y+3,14,6);ctx.fillRect(x+2,y+9,10,3);ctx.fillRect(x+4,y+12,6,3);ctx.fillStyle=alive?'#cf493e':'#3c373a';ctx.fillRect(x+3,y+3,8,6);ctx.fillStyle=alive?'#f17f70':'#4a4547';ctx.fillRect(x+3,y+3,3,2);}
      ctx.fillStyle='#2a241e';ctx.fillRect(left+38,top+26,87,3);ctx.fillStyle='#9a7c3f';ctx.fillRect(left+39,top+26,Math.max(4,86*(this.player.hp/this.player.maxHp)),1);
      if(this.boss&&this.bossStarted&&!this.boss.dead){
        const bw=Math.min(300,W*.55),bx=(W-bw)/2,by=8;ctx.fillStyle='rgba(4,5,7,.9)';ctx.fillRect(bx-13,by-5,bw+26,35);ctx.strokeStyle='#8b6d3f';ctx.strokeRect(bx-12.5,by-4.5,bw+25,34);ctx.fillStyle='#c39b4d';ctx.fillRect(bx-8,by+4,6,11);ctx.fillRect(bx+bw+2,by+4,6,11);ctx.fillStyle='#241417';ctx.fillRect(bx,by+6,bw,9);const hpw=bw*(this.boss.hp/this.boss.maxHp);ctx.fillStyle=this.boss.phase===3?'#a8312e':'#7f2d2b';ctx.fillRect(bx,by+6,hpw,9);ctx.fillStyle='#d8644d';ctx.fillRect(bx,by+6,Math.max(0,hpw),2);this.text(t('bossName'),W/2,by+18,8,'center','#e7d6b4');for(let i=0;i<3;i++){ctx.fillStyle=i<this.boss.phase?'#d7a94b':'#41382d';ctx.fillRect(W/2-11+i*9,by+27,6,2);}
      }else{
        const roman=['I','II','III','IV','V','VI','VII'][this.levelIndex]||'';const boxW=48,bx=W-boxW-9;ctx.fillStyle='rgba(5,7,9,.72)';ctx.fillRect(bx,top,boxW,24);ctx.strokeStyle='#6e5c3c';ctx.strokeRect(bx+.5,top+.5,boxW-1,23);this.text(roman,bx+boxW/2,top+6,9,'center','#d8ba70');
      }
      if(this.levelIndex===LEVEL.TRIAL&&this.level.arena?.started&&!this.level.arena.cleared){const count=this.enemies.filter(e=>!e.dead).length,msg=`${t('enemiesRemain')}: ${count}`;ctx.font='bold 8px "Courier New", monospace';const mw=ctx.measureText(msg).width+14;ctx.fillStyle='rgba(5,7,9,.76)';ctx.fillRect(W-mw-9,39,mw,18);ctx.strokeStyle='#675535';ctx.strokeRect(W-mw-8.5,39.5,mw-1,17);this.text(msg,W-16,44,8,'right','#e5d6b4');}
    }
    text(str,x,y,size=10,align='left',color='#fff',shadow=true){
      ctx.font=`bold ${size}px "Courier New", monospace`;ctx.textAlign=align;ctx.textBaseline='top';if(shadow){ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillText(str,x+1,y+1);}ctx.fillStyle=color;ctx.fillText(str,x,y);
    }
    wrapText(str,maxWidth,size=10){ctx.font=`bold ${size}px "Courier New", monospace`;const words=str.split(' '),lines=[];let line='';for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word;}else line=test;}if(line)lines.push(line);return lines;}
    drawTutorial(){
      if(this.levelIndex!==0||this.levelTitleTimer>0)return;
      let msg='';if(!this.tutorial.move)msg=t('moveHint');else if(!this.tutorial.jump)msg=t('jumpHint');else if(!this.tutorial.attack)msg=t('attackHint');else if(!this.tutorial.block)msg=t('blockHint');else if(!this.level.checkpoints[0].active)msg=t('reachCheckpoint');
      if(msg){ctx.font='bold 9px "Courier New", monospace';const lines=this.wrapText(msg,250,9);const ww=Math.min(W-30,Math.max(...lines.map(l=>ctx.measureText(l).width))+34);const hh=lines.length*13+16;const x=(W-ww)/2,y=H-hh-14;ctx.fillStyle='rgba(5,7,9,.82)';ctx.fillRect(x,y,ww,hh);ctx.strokeStyle='#8b7040';ctx.strokeRect(x+.5,y+.5,ww-1,hh-1);ctx.fillStyle='#c49b45';ctx.fillRect(x+6,y+5,2,hh-10);ctx.fillRect(x+ww-8,y+5,2,hh-10);lines.forEach((l,i)=>this.text(l,W/2,y+8+i*13,9,'center','#f0e4c8'));}
    }
    drawGame(){
      const palette=palettes[this.levelIndex]||palettes[0];let sx=0,sy=0;if(this.shakeTimer>0){sx=(Math.random()*2-1)*this.shakePower;sy=(Math.random()*2-1)*this.shakePower;}
      ctx.save();ctx.translate(Math.round(sx),Math.round(sy));this.drawBackground(palette);this.level.hazards.forEach(h=>this.drawHazard(h,palette));this.level.platforms.forEach(p=>p.draw(ctx,this.camera.x,0,palette));this.drawDecor(palette);this.level.checkpoints.forEach(cp=>cp.draw(ctx,this.camera.x,0,this.time));
      if(this.levelIndex===LEVEL.TRIAL&&this.level.arena?.started&&!this.level.arena.cleared){const a=this.level.arena;ctx.fillStyle='#3c3834';ctx.fillRect(Math.round(a.left-12-this.camera.x),145,10,79);ctx.fillRect(Math.round(a.right+2-this.camera.x),145,10,79);ctx.fillStyle='#927c54';for(let yy=150;yy<221;yy+=12){ctx.fillRect(Math.round(a.left-10-this.camera.x),yy,6,3);ctx.fillRect(Math.round(a.right+4-this.camera.x),yy,6,3);}}
      for(const p of this.projectiles)p.draw(ctx,this.camera.x,0);for(const w of this.shockwaves)w.draw(ctx,this.camera.x);for(const e of this.enemies)e.draw(ctx,this.camera.x,0,this.time);if(this.boss)this.boss.draw(ctx,this.camera.x,0,this.time);
      ctx.fillStyle='rgba(0,0,0,.24)';ctx.fillRect(Math.round(this.player.x-this.camera.x+1),Math.round(this.level.groundY-2),14,2);this.player.draw(ctx,this.camera.x,0);for(const p of this.particles)p.draw(ctx,this.camera.x,0);ctx.restore();
      this.drawHUD();this.drawTutorial();
      if(this.levelTitleTimer>0){const a=clamp(this.levelTitleTimer<.5?this.levelTitleTimer*2:1,0,1);ctx.globalAlpha=a;ctx.fillStyle='rgba(5,7,9,.72)';ctx.fillRect(W/2-100,48,200,25);ctx.strokeStyle='#715d38';ctx.strokeRect(W/2-99.5,48.5,199,24);this.text(this.levelTitle,W/2,55,11,'center','#f4e6bc');ctx.globalAlpha=1;}
      if(this.noticeTimer>0){const a=clamp(this.noticeTimer*2,0,1);ctx.globalAlpha=a;this.text(this.noticeText,W/2,82,10,'center','#f4d36b');ctx.globalAlpha=1;}
      if(this.player.dead){ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(0,0,W,H);this.text(t('tryAgain'),W/2,H/2-7,14,'center','#f3e5c3');}if(this.fade>0){ctx.fillStyle=`rgba(0,0,0,${this.fade})`;ctx.fillRect(0,0,W,H);}
    }
    drawIntro(){
      ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
      // subtle vignette stars/dust
      ctx.fillStyle='#594f3b';for(let i=0;i<20;i++){const x=(i*83)%W,y=(i*47+Math.floor(this.time*4))%H;ctx.fillRect(x,y,1,1);}
      const paragraphs=t('prologue');
      const speed=15.5;let y=H+20-this.introTime*speed;
      this.text('KNIGHTS OF THE RENAISSANCE',W/2,y,13,'center','#d8b75d');y+=34;
      for(const p of paragraphs){const lines=this.wrapText(p,Math.min(420,W-48),10);for(const line of lines){this.text(line,W/2,y,10,'center','#e9e3d2');y+=14;}y+=13;}
      if(this.introTime<2.8)this.text(settings.language==='ptBR'?'ENTER / ESPAÇO PARA PULAR':'ENTER / SPACE TO SKIP',W/2,H-18,7,'center','#6f6c65');
      if(y<-40)this.introTime=999;
      if(this.introTime>31 || this.introTime===999)this.startGame(0);
    }
    drawDialogue(){
      this.drawGame();ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(0,0,W,H);
      const w=Math.min(412,W-36),h=72,x=(W-w)/2,y=Math.min(H-94,176);ctx.fillStyle='#efe8d5';ctx.fillRect(x,y,w,h);ctx.fillStyle='#1b1b19';ctx.fillRect(x+3,y+3,w-6,h-6);ctx.fillStyle='#e9dfc9';ctx.fillRect(x+6,y+6,w-12,h-12);
      ctx.fillStyle='#302b24';ctx.beginPath();ctx.moveTo(x+w*.76,y+72);ctx.lineTo(x+w*.8,y+72);ctx.lineTo(x+w*.78,y+84);ctx.fill();
      const line=this.dialogueLines[this.dialogueIndex]||'';const lines=this.wrapText(line,w-34,11);lines.forEach((l,i)=>this.text(l,x+17,y+17+i*16,11,'left','#2a241d',false));
      const hint=settings.language==='ptBR'?'ENTER / TOQUE':'ENTER / TAP';this.text(hint,x+w-12,y+h-14,7,'right','#726858',false);
    }
    drawCliff(){
      ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);const a=clamp((this.cliffTime-.6)/1.4,0,1)*clamp((4.6-this.cliffTime)/.8,0,1);ctx.globalAlpha=a;this.text(t('continues'),W/2,H/2-10,16,'center','#eee3c6');ctx.globalAlpha=1;
    }
    drawCredits(){
      ctx.fillStyle='#050607';ctx.fillRect(0,0,W,H);const lines=t('creditLines');let y=H+50-this.creditsTime*22;for(let i=0;i<lines.length;i++){const line=lines[i];const special=line.includes('KNIGHTS')||line.includes('VIGU STUDIO')||line.includes('JOURNEY')||line.includes('JORNADA');this.text(line,W/2,y+i*18,special?12:9,'center',special?'#e2bd58':'#ddd5c3');}
    }
    drawTitleBackground(){
      const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#070a0e');g.addColorStop(.5,'#0c1618');g.addColorStop(1,'#17150f');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      ctx.globalAlpha=.18;ctx.fillStyle='#d9b967';ctx.beginPath();ctx.arc(W*.74,H*.22,28,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
      // distant mountains and fortress silhouette
      ctx.fillStyle='#101a1c';ctx.beginPath();ctx.moveTo(0,H*.52);for(let x=-20;x<W+50;x+=55){ctx.lineTo(x,H*.48-((x/55|0)%3)*10);ctx.lineTo(x+26,H*.39-((x/55|0)%4)*7);}ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
      const fx=Math.round(W*.68);ctx.fillStyle='#0d1719';ctx.fillRect(fx,H*.29,78,H*.36);ctx.fillRect(fx+12,H*.20,16,H*.12);ctx.fillRect(fx+49,H*.16,14,H*.16);ctx.fillRect(fx+31,H*.25,12,H*.1);ctx.beginPath();ctx.moveTo(fx+9,H*.20);ctx.lineTo(fx+20,H*.12);ctx.lineTo(fx+31,H*.20);ctx.fill();ctx.beginPath();ctx.moveTo(fx+46,H*.16);ctx.lineTo(fx+56,H*.08);ctx.lineTo(fx+66,H*.16);ctx.fill();
      // ruined wall / arcade
      ctx.fillStyle='#0b1415';const keepY=Math.round(H*.55);for(let i=-1;i<Math.ceil(W/64)+2;i++){const x=i*64;ctx.fillRect(x,keepY,48,H-keepY);ctx.fillRect(x+6,keepY-17,10,17);ctx.fillRect(x+31,keepY-17,10,17);ctx.fillRect(x+2,keepY-25,43,8);ctx.fillStyle='#071011';ctx.beginPath();ctx.arc(x+24,keepY+18,12,Math.PI,0);ctx.lineTo(x+36,keepY+44);ctx.lineTo(x+12,keepY+44);ctx.fill();ctx.fillStyle='#0b1415';}
      // tree silhouettes frame the title
      ctx.fillStyle='#080f0e';for(let i=-1;i<Math.ceil(W/135)+2;i++){const x=i*135-Math.round(this.time*.15%135);ctx.fillRect(x+34,H*.34,19,H*.52);ctx.fillRect(x+3,H*.29,83,33);ctx.fillRect(x+17,H*.21,55,30);ctx.fillRect(x+27,H*.15,35,22);}
      // foreground stone line + order monument
      ctx.fillStyle='#1d2119';ctx.fillRect(0,H*.83,W,H*.17);ctx.fillStyle='#3a4631';ctx.fillRect(0,H*.83,W,4);ctx.globalAlpha=.4;ctx.fillStyle='#c2a45d';const cx=W*.5;ctx.fillRect(cx-2,H*.54,4,62);ctx.fillRect(cx-18,H*.63,36,4);ctx.fillRect(cx-6,H*.52,12,7);ctx.globalAlpha=1;
      if(!settings.reducedEffects){ctx.fillStyle='rgba(218,190,111,.25)';for(let i=0;i<20;i++){const x=(i*97+this.time*(1.2+i%3))%W,y=(i*43)%Math.max(1,H-30);ctx.fillRect(x,y,1,1);}}
    }
    draw(){
      ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;
      if(this.scene==='title'){this.drawTitleBackground();return;}
      if(this.scene==='intro'){this.drawIntro();return;}
      if(this.scene==='game'){this.drawGame();return;}
      if(this.scene==='dialogue'){this.drawDialogue();return;}
      if(this.scene==='cliff'){this.drawCliff();return;}
      if(this.scene==='credits'){this.drawCredits();return;}
      if(this.scene==='end'){ctx.fillStyle='#050607';ctx.fillRect(0,0,W,H);this.text('KNIGHTS OF THE RENAISSANCE',W/2,70,15,'center','#dfbd63');return;}
    }
    loop(ts){
      let dt=Math.min(.033,(ts-this.lastTime)/1000||0);this.lastTime=ts;
      this.update(dt);this.draw();input.endFrame();requestAnimationFrame((t)=>this.loop(t));
    }
  }

  const game=new Game();
  audio.setMusic('title');
  window.__knightsGame=game;
})();
