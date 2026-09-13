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
      musicVolume: 'Music Volume', sfxVolume: 'SFX Volume', screenShake: 'Screen Shake', reducedEffects: 'Reduced Effects', on: 'ON', off: 'OFF',
      move: 'Move', jump: 'Jump', attack: 'Attack', block: 'Block', pause: 'Pause', interact: 'Continue dialogue',
      moveHint: 'A / D — MOVE', jumpHint: 'SPACE — JUMP', attackHint: 'J — ATTACK', blockHint: 'K — BLOCK', reachCheckpoint: 'REACH THE CHECKPOINT',
      checkpoint: 'CHECKPOINT', tryAgain: 'TRY AGAIN', wave: 'COMBAT TRIAL', enemiesRemain: 'ENEMIES REMAIN', pathOpen: 'PATH OPEN',
      level1: 'THE TRAINING GROUNDS', level2: 'THE FOREST PATH', level3: 'COMBAT TRIAL', level4: 'DANGEROUS PATH', level5: 'THE CLEARING',
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
      musicVolume: 'Volume da Música', sfxVolume: 'Volume dos Efeitos', screenShake: 'Tremor de Tela', reducedEffects: 'Efeitos Reduzidos', on: 'LIGADO', off: 'DESLIGADO',
      move: 'Mover', jump: 'Pular', attack: 'Atacar', block: 'Bloquear', pause: 'Pausar', interact: 'Continuar diálogo',
      moveHint: 'A / D — MOVER', jumpHint: 'ESPAÇO — PULAR', attackHint: 'J — ATACAR', blockHint: 'K — BLOQUEAR', reachCheckpoint: 'CHEGUE AO CHECKPOINT',
      checkpoint: 'CHECKPOINT', tryAgain: 'TENTE NOVAMENTE', wave: 'PROVA DE COMBATE', enemiesRemain: 'INIMIGOS RESTANTES', pathOpen: 'CAMINHO LIBERADO',
      level1: 'CAMPO DE TREINAMENTO', level2: 'TRILHA DA FLORESTA', level3: 'PROVA DE COMBATE', level4: 'CAMINHO PERIGOSO', level5: 'A CLAREIRA',
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

      document.querySelectorAll('[data-action]').forEach((btn) => {
        const action = btn.dataset.action;
        const on = (e) => {
          e.preventDefault();
          if (!this.touch[action]) this.touchPressed.add(action);
          this.touch[action] = true;
          btn.classList.add('pressed');
        };
        const off = (e) => {
          e.preventDefault();
          this.touch[action] = false;
          btn.classList.remove('pressed');
        };
        btn.addEventListener('pointerdown', on, { passive: false });
        btn.addEventListener('pointerup', off, { passive: false });
        btn.addEventListener('pointercancel', off, { passive: false });
        btn.addEventListener('pointerleave', (e) => { if (e.buttons === 0) off(e); }, { passive: false });
      });
    }
    clear() {
      this.down.clear(); this.pressed.clear(); this.released.clear(); this.touchPressed.clear();
      Object.keys(this.touch).forEach((k) => { this.touch[k] = false; });
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
        combat: { bpm: 138, notes: [220,0,262,220,294,0,262,247], bass: [55,65,55,62] },
        danger: { bpm: 132, notes: [247,294,330,294,220,262,294,262], bass: [62,55,52,55] },
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
      const x=Math.round(this.x-cx), y=Math.round(this.y-cy);
      if (x+this.w<0||x>W||y>H+30) return;
      ctx.fillStyle = this.type==='moving' ? palette.platformSide : palette.dirt;
      ctx.fillRect(x,y,this.w,this.h);
      ctx.fillStyle = palette.grass;
      ctx.fillRect(x,y,this.w,4);
      ctx.fillStyle = palette.grassLight;
      for(let i=2;i<this.w;i+=10) ctx.fillRect(x+i,y+1,5,1);
      ctx.fillStyle = palette.dirtDark;
      for(let i=5;i<this.w;i+=14) ctx.fillRect(x+i,y+8,3,2);
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
      ctx.fillStyle='#5b4630'; ctx.fillRect(x+5,y+10,3,24);
      ctx.fillStyle=this.active?'#e6bd4e':'#84735b'; ctx.fillRect(x,y+8,13,4);
      ctx.fillRect(x+3,y+4,7,4); ctx.fillRect(x+5,y,3,4);
      if(this.active) { ctx.globalAlpha=.45+.2*Math.sin(time*5); ctx.fillStyle='#f7df80'; ctx.fillRect(x+2,y+2,9,13); ctx.globalAlpha=1; }
      ctx.fillStyle='#403424'; ctx.fillRect(x+1,y+32,11,3);
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
    draw(ctx,cx,cy) { const x=Math.round(this.x-cx),y=Math.round(this.y-cy);ctx.fillStyle='#6d4026';ctx.fillRect(x,y,5,2);ctx.fillStyle='#d9d3b8';ctx.fillRect(x+(this.vx>0?4:0),y-1,2,4); }
  }

  class Enemy {
    constructor(type,x,y) {
      this.type=type; this.x=x; this.y=y; this.vx=0; this.vy=0; this.w=15; this.h=24; this.hp=type==='runner'?1:2; this.maxHp=this.hp;
      this.facing=-1; this.onGround=false; this.dead=false; this.hitFlash=0; this.invuln=0; this.attackTimer=0; this.cooldown=Math.random()*.5; this.telegraph=0; this.spawnY=y;
    }
    get bodyBox(){return {x:this.x+2,y:this.y+2,w:this.w-4,h:this.h-3};}
    damage(amount,game,fromX) {
      if(this.invuln>0||this.dead)return;
      this.hp-=amount;this.invuln=.16;this.hitFlash=.12;this.vx+=(this.x<fromX?-1:1)*55;audio.sfx('hit');game.burst(this.x+this.w/2,this.y+9,'#f0d178',6);
      if(this.hp<=0){this.dead=true;this.vy=-85;this.vx+=(this.x<fromX?-1:1)*50;game.burst(this.x+7,this.y+10,'#b66b45',10);}
    }
    update(dt,game){
      const prevTelegraph=this.telegraph;
      if(this.hitFlash>0)this.hitFlash-=dt;if(this.invuln>0)this.invuln-=dt;if(this.cooldown>0)this.cooldown-=dt;if(this.attackTimer>0)this.attackTimer-=dt;if(this.telegraph>0)this.telegraph=Math.max(0,this.telegraph-dt);
      if(this.dead){this.vy+=430*dt;this.y+=this.vy*dt;this.x+=this.vx*dt;return;}
      const p=game.player; const dx=p.x-this.x; const dy=(p.y+p.h*.5)-(this.y+this.h*.5); this.facing=dx>=0?1:-1;
      const playerCenter=p.x+p.w*.5, enemyCenter=this.x+this.w*.5;
      const betweenMin=Math.min(playerCenter,enemyCenter), betweenMax=Math.max(playerCenter,enemyCenter);
      const separatedByHazard=game.levelIndex!==2&&game.level.hazards.some(h=>h.x<betweenMax&&h.x+h.w>betweenMin);
      if(this.type==='sword'){
        const inVerticalReach=Math.abs(dy)<18;
        const engaged=game.levelIndex===2||(!separatedByHazard&&Math.abs(dx)<165);
        if(!engaged){
          this.vx=approach(this.vx,0,180*dt);
        }else if(Math.abs(dx)>28||!inVerticalReach){
          this.vx=approach(this.vx,Math.abs(dx)>8?this.facing*32:0,150*dt);
        }else{
          this.vx=approach(this.vx,0,200*dt);
          if(this.cooldown<=0){this.telegraph=.22;this.attackTimer=.42;this.cooldown=1.05;}
        }
        if(this.attackTimer>0 && this.attackTimer<.19){
          const hit={x:this.facing>0?this.x+11:this.x-11,y:this.y+8,w:15,h:10};
          if(rectsOverlap(hit,{x:p.x+2,y:p.y+2,w:p.w-4,h:p.h-4})){p.damage(1,this.x,false,game);this.attackTimer=0;}
        }
      } else if(this.type==='runner'){
        const engaged=game.levelIndex===2||(!separatedByHazard&&Math.abs(dx)<190);
        this.vx=approach(this.vx,engaged?this.facing*58:0,220*dt);
        // The old implementation damaged by X distance only, which created an invisible vertical damage wall.
        // Contact damage now requires real body overlap, so jumping cleanly over a runner is always valid.
        const playerBody={x:p.x+2,y:p.y+2,w:p.w-4,h:p.h-4};
        if(engaged&&this.cooldown<=0&&rectsOverlap(this.bodyBox,playerBody)){p.damage(1,this.x,false,game);this.cooldown=.8;}
      } else if(this.type==='archer'){
        this.vx=approach(this.vx,0,300*dt);
        if(!separatedByHazard&&Math.abs(dx)<180&&Math.abs(dy)<70&&this.cooldown<=0){this.telegraph=.35;this.cooldown=1.7;}
        if(prevTelegraph>0 && this.telegraph<=0){const speed=95;game.projectiles.push(new Projectile(this.x+(this.facing>0?14:-4),this.y+9,this.facing*speed,-3,'enemy',true));audio.sfx('click');}
      }
      if(this.onGround && Math.abs(this.vx)>1){
        const aheadX=this.vx>0?this.x+this.w+3:this.x-3;
        const footY=this.y+this.h+4;
        const safe=game.level.platforms.some(pl=>aheadX>=pl.x&&aheadX<=pl.x+pl.w&&footY>=pl.y-2&&footY<=pl.y+pl.h+8);
        if(!safe)this.vx=0;
      }
      this.vy+=420*dt;
      game.moveEntity(this,dt);
      if(this.y>H+150)this.dead=true;
    }
    draw(ctx,cx,cy,time){
      if(this.dead && this.y>H+30)return;
      const x=Math.round(this.x-cx),y=Math.round(this.y-cy);const f=this.facing;
      ctx.save();ctx.translate(x+(f<0?this.w:0),y);ctx.scale(f,1);
      if(this.hitFlash>0)ctx.globalAlpha=.45;
      // boots
      ctx.fillStyle='#201915';ctx.fillRect(2,20,5,4);ctx.fillRect(9,20,5,4);
      // legs
      ctx.fillStyle=this.type==='runner'?'#4a2730':'#514338';ctx.fillRect(3,15,4,6);ctx.fillRect(9,15,4,6);
      // torso / role color
      ctx.fillStyle=this.type==='archer'?'#425e3a':this.type==='runner'?'#7a3941':'#6f4f34';ctx.fillRect(2,7,12,9);
      ctx.fillStyle='#c4b18d';ctx.fillRect(4,1,8,7);
      ctx.fillStyle='#302018';ctx.fillRect(3,0,10,3);ctx.fillRect(11,2,3,4);
      ctx.fillStyle='#17120f';ctx.fillRect(9,4,2,1);
      if(this.type==='sword'){
        ctx.fillStyle='#c8d1cf';ctx.fillRect(14,8,2,11);ctx.fillStyle='#79542c';ctx.fillRect(13,16,4,2);
      } else if(this.type==='archer'){
        ctx.strokeStyle='#b6823f';ctx.lineWidth=1;ctx.beginPath();ctx.arc(14,11,5,-1.2,1.2);ctx.stroke();
      } else { ctx.fillStyle='#a9a49a';ctx.fillRect(13,8,2,5); }
      if(this.telegraph>0){ctx.globalAlpha=.75;ctx.fillStyle='#f0cc59';ctx.fillRect(6,-7,3,3);ctx.fillRect(6,-12,3,3);}
      ctx.restore();ctx.globalAlpha=1;
    }
  }

  class BossOldMan {
    constructor(x,groundY){
      this.x=x;this.y=groundY-25;this.groundY=groundY;this.w=16;this.h=25;this.vx=0;this.vy=0;this.hp=7;this.maxHp=7;this.state='idle';this.timer=1.2;this.facing=-1;this.dead=false;this.invuln=0;this.hitFlash=0;this.fakeHop=false;
    }
    damage(amount,game,fromX){
      if(this.invuln>0||this.dead)return false;
      const airborne=this.state==='jump' && this.y < this.groundY-this.h-4;
      if(!airborne){audio.sfx('block');game.burst(this.x+8,this.y+9,'#d8d0b4',4);return false;}
      this.hp-=amount;this.invuln=.32;this.hitFlash=.16;this.vx+=(this.x<fromX?-1:1)*35;
      // A successful mid-air sword hit interrupts the downward stomp just enough to avoid an unfair same-frame trade.
      if(this.vy>0)this.vy=-70;
      audio.sfx('hit');game.burst(this.x+8,this.y+8,'#f0d178',10);game.shake(2.5,.12);
      if(this.hp<=0){this.dead=true;this.state='defeated';this.vx=0;this.vy=0;audio.sfx('win');game.onBossDefeated();}
      return true;
    }
    update(dt,game){
      if(this.dead)return;
      if(this.invuln>0)this.invuln-=dt;if(this.hitFlash>0)this.hitFlash-=dt;
      const p=game.player;this.facing=p.x>=this.x?1:-1;this.timer-=dt;
      if(this.state==='idle'){
        this.vx=approach(this.vx,0,200*dt);
        if(this.timer<=0){
          this.state='crouch';
          const low=this.hp<=3;
          this.fakeHop=low && Math.random()<.24;
          this.timer=this.fakeHop?.18:.34;
        }
      }else if(this.state==='crouch'){
        this.vx=0;
        if(this.timer<=0){
          this.state='jump';
          const dist=clamp(p.x-this.x,-125,125);
          this.vx=(this.fakeHop?dist*.28:dist*.76);
          this.vy=this.fakeHop?-115:-185;
          this.timer=2;
        }
      }else if(this.state==='jump'){
        this.vy+=430*dt;this.x+=this.vx*dt;this.y+=this.vy*dt;
        this.x=clamp(this.x,620,1130);
        if(rectsOverlap(this,p) && this.vy>30){p.damage(1,this.x,true,game);game.shake(4,.13);}
        if(this.y+this.h>=this.groundY){this.y=this.groundY-this.h;this.vy=0;this.vx=0;this.state='recover';this.timer=this.hp<=3?.38:.55;game.burst(this.x+8,this.groundY-2,'#cdb77d',5);}
      }else if(this.state==='recover'){
        if(this.timer<=0){this.state='idle';this.timer=this.hp<=3?.45+Math.random()*.45:.75+Math.random()*.65;}
      }
    }
    draw(ctx,cx,cy,time){
      const x=Math.round(this.x-cx),y=Math.round(this.y-cy);ctx.save();ctx.translate(x+(this.facing<0?this.w:0),y);ctx.scale(this.facing,1);
      if(this.hitFlash>0)ctx.globalAlpha=.45;
      const crouch=this.state==='crouch'?3:(this.state==='defeated'?7:0);
      ctx.fillStyle='#2b251f';ctx.fillRect(3,20+crouch,5,4);ctx.fillRect(10,20+crouch,4,4);
      ctx.fillStyle='#564b39';ctx.fillRect(4,13+crouch,4,8);ctx.fillRect(9,13+crouch,4,8);
      ctx.fillStyle='#7d7158';ctx.fillRect(2,7+crouch,12,9);
      ctx.fillStyle='#d1b98f';ctx.fillRect(4,1+crouch,8,7);
      ctx.fillStyle='#d6d2c6';ctx.fillRect(3,0+crouch,9,3);ctx.fillRect(2,2+crouch,3,7);ctx.fillRect(5,7+crouch,7,3);
      ctx.fillStyle='#281f19';ctx.fillRect(9,4+crouch,2,1);
      if(this.state==='crouch'){ctx.fillStyle='#edc55c';ctx.fillRect(6,-6,3,3);}
      ctx.restore();ctx.globalAlpha=1;
    }
  }

  class Player {
    constructor(x,y){
      this.x=x;this.y=y;this.w=15;this.h=25;this.vx=0;this.vy=0;this.facing=1;this.onGround=false;this.onPlatform=null;
      this.coyote=0;this.jumpBuffer=0;this.attackTimer=0;this.attackCooldown=0;this.attackHits=new Set();this.blocking=false;this.hp=5;this.maxHp=5;
      this.invuln=0;this.hurtTimer=0;this.dead=false;this.deathTimer=0;this.state='IDLE';this.anim=0;
    }
    get attackBox(){return {x:this.facing>0?this.x+10:this.x-13,y:this.y+4,w:18,h:15};}
    damage(amount,sourceX,unblockable,game){
      if(this.invuln>0||this.dead)return;
      const fromFront=(sourceX>this.x&&this.facing>0)||(sourceX<this.x&&this.facing<0);
      if(this.blocking&&fromFront&&!unblockable){audio.sfx('block');game.burst(this.x+(this.facing>0?15:0),this.y+10,'#d8eef1',6);return;}
      this.hp-=amount;this.invuln=.9;this.hurtTimer=.26;this.vx=(this.x<sourceX?-1:1)*85;this.vy=-95;audio.sfx('hurt');game.shake(3,.12);game.burst(this.x+7,this.y+8,'#cf5f4c',8);
      if(this.hp<=0){this.dead=true;this.deathTimer=1.1;this.vy=-110;audio.sfx('death');}
    }
    update(dt,game){
      this.anim+=dt;if(this.invuln>0)this.invuln-=dt;if(this.hurtTimer>0)this.hurtTimer-=dt;if(this.attackCooldown>0)this.attackCooldown-=dt;
      if(this.dead){this.deathTimer-=dt;this.vy+=430*dt;this.y+=this.vy*dt;this.x+=this.vx*dt;if(this.deathTimer<=0)game.respawn();return;}
      const wasGround=this.onGround;
      if(this.onGround)this.coyote=.1;else this.coyote=Math.max(0,this.coyote-dt);
      if(input.jumpTap())this.jumpBuffer=.12;else this.jumpBuffer=Math.max(0,this.jumpBuffer-dt);
      if(this.hurtTimer<=0){
        this.blocking=input.blockDown()&&this.attackTimer<=0;
        const move=input.moveX();
        if(move!==0)this.facing=move;
        const target=this.blocking?move*32:move*70;
        const accel=this.onGround?430:250;
        this.vx=approach(this.vx,target,accel*dt);
        if(move===0)this.vx=approach(this.vx,0,(this.onGround?520:120)*dt);
        if(this.jumpBuffer>0&&this.coyote>0&&!this.blocking){this.vy=-205;this.onGround=false;this.coyote=0;this.jumpBuffer=0;audio.sfx('jump');game.tutorial.jump=true;}
        if(!input.jumpDown()&&this.vy<-70)this.vy+=420*dt;
        if(input.attackTap()&&this.attackCooldown<=0&&!this.blocking){this.attackTimer=.18;this.attackCooldown=.3;this.attackHits.clear();audio.sfx('sword');game.tutorial.attack=true;}
      } else this.blocking=false;
      if(input.blockDown())game.tutorial.block=true;
      if(Math.abs(this.vx)>8)game.tutorial.move=true;
      if(this.attackTimer>0){
        this.attackTimer-=dt;
        const hit=this.attackBox;
        for(const e of game.enemies){if(!e.dead&&!this.attackHits.has(e)&&rectsOverlap(hit,e)){e.damage(1,game,this.x);this.attackHits.add(e);game.hitStop=.035;}}
        if(game.boss&&!game.boss.dead&&!this.attackHits.has(game.boss)&&rectsOverlap(hit,game.boss)){if(game.boss.damage(1,game,this.x)){this.attackHits.add(game.boss);game.hitStop=.045;}}
      }
      this.vy+=430*dt;this.vy=Math.min(this.vy,260);
      const beforeY=this.y;
      game.moveEntity(this,dt,true);
      // stomp enemies when descending from above
      if(this.vy>=0){
        for(const e of game.enemies){if(e.dead)continue;const feet={x:this.x+3,y:this.y+this.h-4,w:this.w-6,h:7};if(rectsOverlap(feet,e)&&beforeY+this.h<=e.y+9){e.damage(1,game,this.x);this.vy=-135;audio.sfx('stomp');game.hitStop=.035;break;}}
      }
      if(this.y>H+170){this.damage(99,this.x,false,game);this.deathTimer=.2;}
      if(this.hurtTimer>0)this.state='HURT';
      else if(this.attackTimer>0)this.state='ATTACK';
      else if(this.blocking)this.state='BLOCK';
      else if(!this.onGround)this.state=this.vy<0?'JUMP':'FALL';
      else if(Math.abs(this.vx)>5)this.state='RUN';
      else this.state='IDLE';
    }
    draw(ctx,cx,cy){
      if(this.invuln>0&&Math.floor(this.invuln*16)%2===0)return;
      const x=Math.round(this.x-cx),y=Math.round(this.y-cy);const f=this.facing;
      const bob=this.state==='RUN'?Math.round(Math.sin(this.anim*18)):0;
      ctx.save();ctx.translate(x+(f<0?this.w:0),y+bob);ctx.scale(f,1);
      // shadow not here (world draw handles)
      // boots & legs
      ctx.fillStyle='#171717';ctx.fillRect(2,20,5,4);ctx.fillRect(9,20,5,4);
      ctx.fillStyle='#25272a';ctx.fillRect(3,14,4,7);ctx.fillRect(9,14,4,7);
      // white tunic, belt
      ctx.fillStyle='#eee9db';ctx.fillRect(2,7,12,8);ctx.fillStyle='#a6a9a7';ctx.fillRect(3,13,10,2);ctx.fillStyle='#604329';ctx.fillRect(2,15,12,2);
      // head + hair
      ctx.fillStyle='#ddb083';ctx.fillRect(4,1,8,7);ctx.fillStyle='#66361f';ctx.fillRect(3,0,10,3);ctx.fillRect(3,2,3,3);ctx.fillStyle='#2b1b14';ctx.fillRect(9,4,2,1);
      // rear shield
      ctx.fillStyle='#9b7627';ctx.fillRect(-2,8,5,11);ctx.fillStyle='#e3b930';ctx.fillRect(-3,10,2,7);ctx.fillStyle='#e7dfc9';ctx.fillRect(-1,11,2,4);
      // sword / attacking arm
      if(this.state==='ATTACK'){
        ctx.fillStyle='#ddb083';ctx.fillRect(12,8,4,3);ctx.fillStyle='#72502e';ctx.fillRect(14,8,4,2);ctx.fillStyle='#d7dedc';ctx.fillRect(17,6,10,2);ctx.fillStyle='#fff';ctx.fillRect(24,5,3,1);
      }else{
        ctx.fillStyle='#ddb083';ctx.fillRect(12,8,3,6);ctx.fillStyle='#6e4a27';ctx.fillRect(14,10,2,4);ctx.fillStyle='#cbd3d2';ctx.fillRect(15,2,2,9);
      }
      if(this.blocking){ctx.fillStyle='#d2a62d';ctx.fillRect(11,5,6,15);ctx.fillStyle='#f0cc4f';ctx.fillRect(14,7,4,11);ctx.fillStyle='#d9e1dd';ctx.fillRect(13,10,3,5);}
      ctx.restore();
    }
  }

  const palettes = [
    {sky:'#a8d9d3',far:'#7bb7a3',tree:'#4f8b4f',treeDark:'#315f39',grass:'#6cae3f',grassLight:'#a5cf4b',dirt:'#8f6647',dirtDark:'#6b4835',platformSide:'#745c43',water:'#62a9c3'},
    {sky:'#99cbbf',far:'#6ba18e',tree:'#3f7945',treeDark:'#284c34',grass:'#5f9e39',grassLight:'#96c747',dirt:'#7c5a45',dirtDark:'#5a4035',platformSide:'#66503f',water:'#4d93b6'},
    {sky:'#8fb9a7',far:'#64846f',tree:'#345c3f',treeDark:'#253c31',grass:'#537e36',grassLight:'#80aa42',dirt:'#6c503e',dirtDark:'#49382f',platformSide:'#5b493a',water:'#477d95'},
    {sky:'#879d91',far:'#53695d',tree:'#2d4a37',treeDark:'#20332a',grass:'#4d7134',grassLight:'#769743',dirt:'#604a3e',dirtDark:'#453630',platformSide:'#54443b',water:'#3f6f82'},
    {sky:'#b1b5a0',far:'#807f68',tree:'#53604c',treeDark:'#313b31',grass:'#737c3e',grassLight:'#a7a856',dirt:'#75604b',dirtDark:'#4e4137',platformSide:'#625143',water:'#5f7c86'}
  ];

  function makeLevel(index){
    const ground=(x,w,y=224)=>new Platform(x,y,w,H-y,'ground');
    const ledge=(x,y,w,type='ground',opts={})=>new Platform(x,y,w,12,type,opts);
    const level={index,width:1500,groundY:224,platforms:[],hazards:[],checkpoints:[],decor:[],enemies:[],start:{x:40,y:190},endX:1400,arena:null};
    if(index===0){
      level.width=1350;level.endX=1280;
      level.platforms=[ground(0,310),ground(350,240),ground(625,725),ledge(425,180,90),ledge(720,188,76),ledge(860,158,70),ledge(1005,190,105)];
      level.hazards=[{x:310,y:226,w:40,h:44,type:'water'}];
      level.checkpoints=[new Checkpoint(1160,190)];
      level.enemies=[new Enemy('archer',980,190)];
    }else if(index===1){
      level.width=1850;level.endX=1780;
      // Mandatory route audited against the real jump arc: no damage-boosting or pixel-perfect leap is required.
      level.platforms=[
        ground(0,250),ground(320,220),ground(600,190),ground(860,300),ground(1260,590),
        ledge(260,194,50,'moving',{axis:'y',range:18,speed:1.8}),
        ledge(500,192,52),ledge(550,166,76,'falling'),
        ledge(792,190,58,'moving',{axis:'x',range:22,speed:1.5}),
        ledge(1070,192,62),ledge(1128,164,76),ledge(1204,183,58,'falling'),
        ledge(1420,184,74,'moving',{axis:'y',range:16,speed:2.1})
      ];
      level.hazards=[{x:250,y:226,w:70,h:44,type:'water'},{x:540,y:223,w:60,h:47,type:'spike'},{x:790,y:226,w:70,h:44,type:'water'},{x:1160,y:223,w:100,h:47,type:'spike'}];
      level.checkpoints=[new Checkpoint(930,190),new Checkpoint(1660,190)];
    }else if(index===2){
      level.width=1500;level.endX=1430;
      level.platforms=[ground(0,1500),ledge(210,180,100),ledge(520,166,100),ledge(880,180,100),ledge(1170,160,90)];
      level.checkpoints=[new Checkpoint(180,190),new Checkpoint(1320,190)];
      level.arena={startX:355,left:330,right:1180,started:false,cleared:false,waves:0,spawnTimer:0};
    }else if(index===3){
      level.width=2050;level.endX=1980;
      // Harder than level 2, but every required crossing remains physically reachable without taking damage.
      level.platforms=[
        ground(0,260),ground(330,240),ground(650,210),ground(940,290),ground(1320,280),ground(1680,370),
        ledge(282,198,52,'moving',{axis:'y',range:14,speed:1.7}),
        ledge(548,193,50),ledge(588,168,72),
        ledge(830,188,100,'moving',{axis:'x',range:12,speed:1.3}),
        ledge(1120,192,60,'falling'),ledge(1175,166,78),ledge(1244,185,76),
        ledge(1515,192,62,'moving',{axis:'y',range:16,speed:2.0}),ledge(1572,166,74),ledge(1640,188,55)
      ];
      level.hazards=[{x:260,y:223,w:70,h:47,type:'spike'},{x:570,y:226,w:80,h:44,type:'water'},{x:860,y:223,w:80,h:47,type:'spike'},{x:1230,y:226,w:90,h:44,type:'water'},{x:1600,y:223,w:80,h:47,type:'spike'}];
      level.checkpoints=[new Checkpoint(1020,190),new Checkpoint(1810,190)];
      // Keep a safe landing/run-up zone after each mandatory hazard before the next enemy engagement.
      level.enemies=[new Enemy('sword',475,190),new Enemy('archer',745,190),new Enemy('runner',1085,190),new Enemy('archer',1445,190),new Enemy('sword',1815,190)];
    }else{
      level.width=1240;level.endX=1180;level.groundY=226;
      level.platforms=[ground(0,1240,226)];level.checkpoints=[new Checkpoint(520,192)];
      level.start={x:450,y:190};
    }
    return level;
  }

  class Game {
    constructor(){
      this.scene='title';this.levelIndex=0;this.level=makeLevel(0);this.player=new Player(40,190);this.enemies=[];this.projectiles=[];this.boss=null;this.particles=[];
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
      if(jumpBtn)jumpBtn.textContent=t('jump').toUpperCase();if(attackBtn)attackBtn.textContent=t('attack').toUpperCase();if(blockBtn)blockBtn.textContent=t('block').toUpperCase();ui.pauseTouch.setAttribute('aria-label',t('pause'));
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
        <button id="option-language" class="pixel-btn" type="button">${t('language')}: ${t('languageName')}</button>`;
      ui.modal.classList.remove('hidden');
      const mr=$('music-range'),sr=$('sfx-range');
      mr.addEventListener('input',()=>{settings.music=Number(mr.value);$('music-val').textContent=Math.round(settings.music*100)+'%';saveSettings();audio.syncVolumes();});
      sr.addEventListener('input',()=>{settings.sfx=Number(sr.value);$('sfx-val').textContent=Math.round(settings.sfx*100)+'%';saveSettings();audio.syncVolumes();});
      $('shake-toggle').addEventListener('change',(e)=>{settings.screenShake=e.target.checked;saveSettings();});
      $('reduced-toggle').addEventListener('change',(e)=>{settings.reducedEffects=e.target.checked;saveSettings();});
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
      this.levelIndex=index;this.level=makeLevel(index);this.enemies=[...this.level.enemies];this.projectiles=[];this.boss=null;this.bossStarted=false;this.particles=[];this.player=new Player(this.level.start.x,this.level.start.y);this.camera.x=clamp(this.player.x-W*.38,0,Math.max(0,this.level.width-W));
      if(index===0)this.tutorial={move:false,jump:false,attack:false,block:false};
      this.checkpoint={level:index,x:this.level.start.x,y:this.level.start.y};this.levelTitle=t(`level${index+1}`);this.levelTitleTimer=2.2;this.fade=1;this.fadeDir=-1;
      const mus=['forest','path','combat','danger','boss'][index];audio.setMusic(mus);
    }
    setGameplayUI(active){ui.mobileControls.classList.toggle('gameplay',active);ui.pauseTouch.classList.toggle('gameplay',active);}
    toTitle(){
      this.scene='title';this.paused=false;ui.pause.classList.add('hidden');ui.modal.classList.add('hidden');ui.title.classList.remove('hidden');ui.youtube.classList.add('hidden');this.removeEndOverlay();this.setGameplayUI(false);audio.setMusic('title');this.applyLanguage();
    }
    respawn(force=false){
      const cp=this.checkpoint.level===this.levelIndex?this.checkpoint:{level:this.levelIndex,x:this.level.start.x,y:this.level.start.y};
      this.player=new Player(cp.x,cp.y);this.player.hp=this.player.maxHp;this.projectiles=[];this.camera.x=clamp(cp.x-W*.35,0,Math.max(0,this.level.width-W));this.notice(t('tryAgain'),.9);
      if(this.levelIndex===2&&this.level.arena&&this.level.arena.started&&!this.level.arena.cleared){this.level=makeLevel(2);this.enemies=[];this.checkpoint={level:2,x:180,y:190};}
      if(this.levelIndex===4&&this.bossStarted){this.boss=null;this.bossStarted=false;}
    }
    notice(text,time=1){this.noticeText=text;this.noticeTimer=time;}
    burst(x,y,color,count=8){
      const n=settings.reducedEffects?Math.max(2,Math.floor(count*.4)):count;
      for(let i=0;i<n;i++)this.particles.push(new Particle(x,y,(Math.random()-.5)*85,-25-Math.random()*80,.25+Math.random()*.35,color,1+Math.floor(Math.random()*2)));
    }
    shake(power,time){if(!settings.screenShake)return;this.shakePower=Math.max(this.shakePower,power);this.shakeTimer=Math.max(this.shakeTimer,time);}
    moveEntity(ent,dt,isPlayer=false){
      ent.onGround=false;if(isPlayer)ent.onPlatform=null;
      ent.x+=ent.vx*dt;
      for(const p of this.level.platforms){if(rectsOverlap(ent,p)){if(ent.vx>0)ent.x=p.x-ent.w;else if(ent.vx<0)ent.x=p.x+p.w;ent.vx=0;}}
      ent.y+=ent.vy*dt;
      for(const p of this.level.platforms){
        if(rectsOverlap(ent,p)){
          if(ent.vy>=0 && ent.y+ent.h-ent.vy*dt<=p.y+5){ent.y=p.y-ent.h;ent.vy=0;ent.onGround=true;if(isPlayer)ent.onPlatform=p;}
          else if(ent.vy<0){ent.y=p.y+p.h;ent.vy=0;}
        }
      }
    }
    transitionNext(){if(this.transitionPending)return;this.transitionPending=true;this.fadeDir=1;this.fade=0;}
    onFadeComplete(){
      if(!this.transitionPending)return;this.transitionPending=false;
      if(this.levelIndex<4)this.loadLevel(this.levelIndex+1,true);
    }
    updateArena(dt){
      const a=this.level.arena;if(!a)return;
      if(!a.started&&this.player.x>a.startX){a.started=true;a.waves=1;a.spawnTimer=.5;this.notice(t('wave'),1.3);}
      if(!a.started||a.cleared)return;
      this.player.x=clamp(this.player.x,a.left,a.right-this.player.w);
      if(a.spawnTimer>0){a.spawnTimer-=dt;if(a.spawnTimer<=0){
        const y=190;
        if(a.waves===1){this.enemies.push(new Enemy('sword',a.left+30,y),new Enemy('runner',a.right-45,y));}
        else if(a.waves===2){this.enemies.push(new Enemy('sword',a.left+45,y),new Enemy('archer',a.right-55,y),new Enemy('runner',a.right-100,y));}
        else if(a.waves===3){this.enemies.push(new Enemy('runner',a.left+35,y),new Enemy('sword',a.left+80,y),new Enemy('archer',a.right-55,y));}
      }}
      const alive=this.enemies.filter(e=>!e.dead).length;
      if(a.spawnTimer<=0&&alive===0){
        if(a.waves<3){a.waves++;a.spawnTimer=.75;}
        else{a.cleared=true;this.notice(t('pathOpen'),1.5);audio.sfx('checkpoint');}
      }
    }
    startBoss(){
      if(this.bossStarted)return;this.bossStarted=true;this.player.x=Math.max(this.player.x,610);this.boss=new BossOldMan(990,this.level.groundY);this.notice(t('finalLesson'),1.7);this.shake(1.5,.12);
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
      if(this.scene==='intro'){
        this.introTime+=dt;if(input.confirmTap()&&this.introTime>1.2)this.introTime=999;
        if(this.introTime>32){this.startGame(0);}return;
      }
      if(this.scene==='dialogue'){
        if(input.confirmTap())this.advanceDialogue();return;
      }
      if(this.scene==='cliff'){
        this.cliffTime+=dt;if(this.cliffTime>4.8)this.beginCredits();return;
      }
      if(this.scene==='credits'){
        this.creditsTime+=dt;const total=translations[settings.language].creditLines.length*18+H+100;if(this.creditsTime*22>total)this.showEnd();return;
      }
      if(this.scene==='end')return;
      if(this.scene!=='game')return;
      if(input.pauseTap()){this.setPaused(!this.paused);return;}
      if(this.paused)return;
      if(this.hitStop>0){this.hitStop-=dt;return;}
      if(this.noticeTimer>0)this.noticeTimer-=dt;if(this.levelTitleTimer>0)this.levelTitleTimer-=dt;
      if(this.shakeTimer>0){this.shakeTimer-=dt;if(this.shakeTimer<=0)this.shakePower=0;}
      this.level.platforms.forEach(p=>p.update(dt,this.player));
      this.player.update(dt,this);
      for(const h of this.level.hazards){
        const hitbox=h.type==='spike'
          ? {x:h.x+3,y:h.y+3,w:Math.max(1,h.w-6),h:Math.max(1,h.h-3)}
          : h;
        if(rectsOverlap(this.player,hitbox)){
          if(h.type==='water'){this.player.damage(99,h.x,false,this);this.player.deathTimer=.18;}
          else if(h.type==='spike'&&this.player.vy>=0)this.player.damage(1,h.x+h.w/2,true,this);
        }
      }
      for(const cp of this.level.checkpoints)cp.update(this.player,this);
      if(this.levelIndex===2)this.updateArena(dt);
      for(const e of this.enemies)e.update(dt,this);
      this.enemies=this.enemies.filter(e=>!(e.dead&&e.y>H+80));
      for(const p of this.projectiles)p.update(dt,this);this.projectiles=this.projectiles.filter(p=>!p.dead);
      if(this.levelIndex===4){
        if(!this.bossStarted&&this.player.x>610)this.startBoss();
        if(this.bossStarted&&this.boss&&!this.boss.dead){
          // Once the duel begins, keep both fighters inside the clearing so the boss cannot be escaped/soft-locked.
          this.player.x=clamp(this.player.x,595,this.level.width-this.player.w-18);
        }
        if(this.boss)this.boss.update(dt,this);
        if(this.bossDefeatTimer>0){this.bossDefeatTimer-=dt;if(this.bossDefeatTimer<=0)this.beginDialogue();}
      }
      for(const p of this.particles)p.update(dt);this.particles=this.particles.filter(p=>p.life>0);
      // end condition
      if(this.levelIndex<4&&this.player.x>this.level.endX){if(this.levelIndex!==2||this.level.arena.cleared)this.transitionNext();}
      if(this.fadeDir!==0){this.fade=clamp(this.fade+this.fadeDir*dt*1.9,0,1);if(this.fadeDir<0&&this.fade<=0)this.fadeDir=0;if(this.fadeDir>0&&this.fade>=1){this.fadeDir=0;this.onFadeComplete();}}
      // camera
      const target=clamp(this.player.x-W*.42,0,Math.max(0,this.level.width-W));this.camera.x=lerp(this.camera.x,target,1-Math.pow(.001,dt));
    }
    drawBackground(palette){
      ctx.fillStyle=palette.sky;ctx.fillRect(0,0,W,H);
      // clouds
      ctx.fillStyle='rgba(247,246,226,.72)';
      for(let i=0;i<Math.ceil(W/112)+2;i++){const bx=((i*112-this.camera.x*.08+this.time*2.5)%(W+130))-50;const by=30+(i%3)*18;ctx.fillRect(Math.round(bx),by,50,8);ctx.fillRect(Math.round(bx+8),by-6,28,8);ctx.fillRect(Math.round(bx+20),by-10,20,6);}
      // distant hills
      ctx.fillStyle=palette.far;
      for(let i=-1;i<Math.ceil(W/90)+2;i++){const x=Math.round(i*90-(this.camera.x*.16%90));ctx.fillRect(x,128,72,62);ctx.fillRect(x+12,116,48,18);ctx.fillRect(x+24,108,25,14);}
      // distant tree line
      ctx.fillStyle=palette.treeDark;
      for(let i=-2;i<Math.ceil(W/42)+4;i++){const x=Math.round(i*42-(this.camera.x*.30%42));const h=38+(i%4)*8;ctx.fillRect(x+16,150-h,7,h+40);ctx.fillRect(x+4,145-h,32,17);ctx.fillRect(x+9,137-h,23,14);}
      // near trunks / canopy
      ctx.fillStyle=palette.tree;
      for(let i=-1;i<Math.ceil(W/150)+4;i++){const world=i*150+70;const x=Math.round(world-this.camera.x*.62);ctx.fillStyle='#59462f';ctx.fillRect(x+16,122,10,96);ctx.fillStyle=palette.tree;ctx.fillRect(x,104,43,25);ctx.fillRect(x+8,91,28,21);ctx.fillStyle=palette.grassLight;ctx.fillRect(x+6,96,19,4);}
      if(this.levelIndex===4){ctx.fillStyle='rgba(220,210,170,.28)';ctx.fillRect(0,0,W,H);}
    }
    drawHazard(h,palette){
      const x=Math.round(h.x-this.camera.x),y=Math.round(h.y);
      if(h.type==='water'){ctx.fillStyle=palette.water;ctx.fillRect(x,y,h.w,H-y);ctx.fillStyle='rgba(210,245,245,.55)';for(let i=0;i<h.w;i+=14)ctx.fillRect(x+i,y+3,8,2);}
      else{ctx.fillStyle='#d4d1c3';for(let i=0;i<h.w;i+=10){ctx.beginPath();ctx.moveTo(x+i,y+10);ctx.lineTo(x+i+5,y);ctx.lineTo(x+i+10,y+10);ctx.fill();}ctx.fillStyle='#6a5647';ctx.fillRect(x,y+10,h.w,H-y-10);}
    }
    drawDecor(palette){
      // foreground grass tufts, stones, ruins
      const baseY=this.level.groundY;
      for(let i=0;i<Math.ceil(this.level.width/70);i++){const wx=i*70+25;const x=Math.round(wx-this.camera.x);if(x<-20||x>W+20)continue;ctx.fillStyle=palette.grassLight;ctx.fillRect(x,baseY-7,2,7);ctx.fillRect(x+3,baseY-5,2,5);}
      if(this.levelIndex>=3){const x=Math.round(1510-this.camera.x);ctx.fillStyle='#66645c';ctx.fillRect(x,171,18,54);ctx.fillRect(x-5,168,28,5);ctx.fillStyle='#3b4038';ctx.fillRect(x+6,180,6,6);}
      if(this.levelIndex===4){const x=Math.round(1080-this.camera.x);ctx.fillStyle='#777368';ctx.fillRect(x,181,10,45);ctx.fillRect(x-8,178,27,5);ctx.fillStyle='#393933';ctx.fillRect(x+3,188,4,12);}
    }
    drawHUD(){
      // health hearts
      for(let i=0;i<this.player.maxHp;i++){const x=12+i*17,y=10;ctx.fillStyle=i<this.player.hp?'#b9433b':'#3d3433';ctx.fillRect(x+3,y,8,3);ctx.fillRect(x,y+3,14,6);ctx.fillRect(x+2,y+9,10,3);ctx.fillRect(x+4,y+12,6,3);ctx.fillStyle='rgba(255,255,255,.35)';if(i<this.player.hp)ctx.fillRect(x+2,y+4,3,2);}
      if(this.boss&&this.bossStarted&&!this.boss.dead){
        const bw=170,bx=(W-bw)/2,by=12;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(bx-2,by-2,bw+4,14);ctx.fillStyle='#432520';ctx.fillRect(bx,by,bw,10);ctx.fillStyle='#a94d3e';ctx.fillRect(bx,by,bw*(this.boss.hp/this.boss.maxHp),10);ctx.strokeStyle='#d9c790';ctx.strokeRect(bx-.5,by-.5,bw+1,11);this.text(t('bossName'),W/2,by+24,9,'center','#f1e3c2');
      }
      if(this.levelIndex===2&&this.level.arena?.started&&!this.level.arena.cleared){const count=this.enemies.filter(e=>!e.dead).length;this.text(`${t('enemiesRemain')}: ${count}`,W-10,12,8,'right','#f1e3c2');}
    }
    text(str,x,y,size=10,align='left',color='#fff',shadow=true){
      ctx.font=`bold ${size}px "Courier New", monospace`;ctx.textAlign=align;ctx.textBaseline='top';if(shadow){ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillText(str,x+1,y+1);}ctx.fillStyle=color;ctx.fillText(str,x,y);
    }
    wrapText(str,maxWidth,size=10){ctx.font=`bold ${size}px "Courier New", monospace`;const words=str.split(' '),lines=[];let line='';for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word;}else line=test;}if(line)lines.push(line);return lines;}
    drawTutorial(){
      if(this.levelIndex!==0||this.levelTitleTimer>0)return;
      let msg='';if(!this.tutorial.move)msg=t('moveHint');else if(!this.tutorial.jump)msg=t('jumpHint');else if(!this.tutorial.attack)msg=t('attackHint');else if(!this.tutorial.block)msg=t('blockHint');else if(!this.level.checkpoints[0].active)msg=t('reachCheckpoint');
      if(msg){const lines=this.wrapText(msg,260,9);const ww=Math.max(...lines.map(l=>ctx.measureText(l).width))+22;const hh=lines.length*13+12;ctx.fillStyle='rgba(7,10,12,.78)';ctx.fillRect((W-ww)/2,H-58,ww,hh);ctx.strokeStyle='#ad8c48';ctx.strokeRect((W-ww)/2+.5,H-57.5,ww-1,hh-1);lines.forEach((l,i)=>this.text(l,W/2,H-52+i*13,9,'center','#f5e8c8'));}
    }
    drawGame(){
      const palette=palettes[this.levelIndex];
      let sx=0,sy=0;if(this.shakeTimer>0){sx=(Math.random()*2-1)*this.shakePower;sy=(Math.random()*2-1)*this.shakePower;}
      ctx.save();ctx.translate(Math.round(sx),Math.round(sy));
      this.drawBackground(palette);
      this.level.hazards.forEach(h=>this.drawHazard(h,palette));
      this.level.platforms.forEach(p=>p.draw(ctx,this.camera.x,0,palette));
      this.drawDecor(palette);
      this.level.checkpoints.forEach(cp=>cp.draw(ctx,this.camera.x,0,this.time));
      // gate walls for arena
      if(this.levelIndex===2&&this.level.arena?.started&&!this.level.arena.cleared){const a=this.level.arena;ctx.fillStyle='#4b4439';ctx.fillRect(Math.round(a.left-12-this.camera.x),150,10,74);ctx.fillRect(Math.round(a.right+2-this.camera.x),150,10,74);ctx.fillStyle='#8c7e5e';for(let yy=154;yy<220;yy+=12){ctx.fillRect(Math.round(a.left-10-this.camera.x),yy,6,3);ctx.fillRect(Math.round(a.right+4-this.camera.x),yy,6,3);}}
      for(const p of this.projectiles)p.draw(ctx,this.camera.x,0);
      for(const e of this.enemies)e.draw(ctx,this.camera.x,0,this.time);
      if(this.boss)this.boss.draw(ctx,this.camera.x,0,this.time);
      // player shadow
      ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(Math.round(this.player.x-this.camera.x+2),Math.round(this.level.groundY-2),12,2);
      this.player.draw(ctx,this.camera.x,0);
      for(const p of this.particles)p.draw(ctx,this.camera.x,0);
      ctx.restore();
      this.drawHUD();this.drawTutorial();
      if(this.levelTitleTimer>0){const a=clamp(this.levelTitleTimer<.5?this.levelTitleTimer*2:1,0,1);ctx.globalAlpha=a;this.text(this.levelTitle,W/2,48,13,'center','#f4e6bc');ctx.globalAlpha=1;}
      if(this.noticeTimer>0){const a=clamp(this.noticeTimer*2,0,1);ctx.globalAlpha=a;this.text(this.noticeText,W/2,76,10,'center','#f4d36b');ctx.globalAlpha=1;}
      if(this.player.dead){ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(0,0,W,H);this.text(t('tryAgain'),W/2,H/2-7,14,'center','#f3e5c3');}
      if(this.fade>0){ctx.fillStyle=`rgba(0,0,0,${this.fade})`;ctx.fillRect(0,0,W,H);}
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
      // standalone atmospheric title background
      ctx.fillStyle='#0b1720';ctx.fillRect(0,0,W,H);ctx.fillStyle='#203c3f';for(let i=0;i<Math.ceil(W/48)+2;i++){const x=i*48-(this.time*2%48);ctx.fillRect(x,126,33,94);ctx.fillRect(x-8,110,48,25);ctx.fillRect(x+3,98,30,18);}ctx.fillStyle='#263428';ctx.fillRect(0,220,W,50);ctx.fillStyle='#766443';ctx.fillRect(0,224,W,46);ctx.fillStyle='#5a7b42';ctx.fillRect(0,220,W,5);
      // distant ruined crest
      ctx.globalAlpha=.28;ctx.fillStyle='#c3aa6b';ctx.fillRect(230,125,20,78);ctx.fillRect(217,145,46,9);ctx.fillRect(236,112,8,102);ctx.globalAlpha=1;
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
