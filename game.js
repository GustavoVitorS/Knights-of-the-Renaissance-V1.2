(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d', { alpha: false });
  const coarsePointer = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  const reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  let W = 480;
  let H = 270;
  let RENDER_SCALE = 1.5;

  const CONFIG = Object.freeze({
    logicalHeight: 270,
    minWidth: 480,
    maxWidth: 760,
    gravity: 520,
    playerSpeed: 125,
    jumpSpeed: 218,
    gameFrameMs: 1000 / 60,
    staticFrameMs: 1000 / 30,
    maxFrameMs: 50,
    desktopParticles: 110,
    mobileParticles: 65,
    reducedParticles: 28
  });

  const C = Object.freeze({
    bgDeep: '#070418', bgVoid: '#03040d', bgPurple: '#17103a', bgBlue: '#081932',
    grid: '#4f4b88', cyan: '#65e6ff', cyanHi: '#d9fbff', cyanDim: '#2f6a9e',
    magenta: '#ff58c8', pink: '#ff91e2', violet: '#9b65ff', violetDeep: '#5a38ad',
    danger: '#ff4e79', crimson: '#c84068', orange: '#ff9f5c', white: '#f7f7ff',
    muted: '#9d9ab1', black: '#05040c', teal: '#54ffd3'
  });

  function resizeCanvasToViewport() {
    const vw = Math.max(1, window.innerWidth || 480);
    const vh = Math.max(1, window.innerHeight || 270);
    H = CONFIG.logicalHeight;
    W = Math.round(H * (vw / vh));
    W = Math.min(CONFIG.maxWidth, Math.max(CONFIG.minWidth, W));

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const cssScale = vh / H;
    const cap = coarsePointer ? 2 : 3;
    RENDER_SCALE = Math.min(cap, Math.max(1.25, cssScale * Math.min(1.5, dpr)));

    const bw = Math.max(1, Math.round(W * RENDER_SCALE));
    const bh = Math.max(1, Math.round(H * RENDER_SCALE));
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    }
    ctx.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    game?.invalidateBackdrop?.();
  }

  const $ = (id) => document.getElementById(id);
  const ui = {
    title: $('title-screen'), eyebrow: $('eyebrow'), subtitle: $('subtitle'), titleHint: $('title-hint'),
    start: $('btn-start'), options: $('btn-options'), controls: $('btn-controls'), language: $('btn-language'),
    modal: $('modal'), modalTitle: $('modal-title'), modalContent: $('modal-content'), modalClose: $('modal-close'),
    pause: $('pause-menu'), pauseTitle: $('pause-title'), pauseResume: $('pause-resume'), pauseRestart: $('pause-restart'),
    pauseControls: $('pause-controls'), pauseOptions: $('pause-options'), pauseLanguage: $('pause-language'), pauseQuit: $('pause-quit'),
    mobileControls: $('mobile-controls'), pauseTouch: $('pause-touch'), inventoryTouch: $('inventory-touch'),
    inventory: $('inventory-screen'), inventoryTitle: $('inventory-title'), inventoryKicker: $('inventory-kicker'),
    inventoryContent: $('inventory-content'), inventoryHint: $('inventory-hint'), inventoryClose: $('inventory-close'),
    youtube: $('youtube-link'), orientation: $('orientation-screen'), orientationTitle: $('orientation-title'),
    orientationText: $('orientation-text'), orientationBtn: $('orientation-btn'), orientationHelp: $('orientation-help')
  };

  const LANGS = ['en', 'ptBR'];
  const translations = {
    en: {
      presents: 'VIGU STUDIO PRESENTS', subtitle: 'A PLAYABLE PROLOGUE', startJourney: 'START JOURNEY',
      options: 'OPTIONS', controls: 'CONTROLS', language: 'LANGUAGE', back: 'BACK', paused: 'PAUSED', resume: 'RESUME',
      restartCheckpoint: 'RESTART CHECKPOINT', quitTitle: 'QUIT TO TITLE', keyboardTouch: 'Keyboard or touch controls supported',
      rotateTitle: 'ROTATE YOUR DEVICE', rotateText: 'For the best experience, play in landscape mode.',
      rotateButton: 'ENTER LANDSCAPE', rotateHelp: 'If automatic rotation is unavailable, rotate your phone manually.',
      musicVolume: 'Music Volume', sfxVolume: 'SFX Volume', screenShake: 'Screen Shake', reducedEffects: 'Reduced Effects',
      fullscreen: 'Fullscreen', on: 'ON', off: 'OFF', move: 'Move', jump: 'Double jump', attack: 'Whip', block: 'Block',
      power: 'Dash / aerial jump-dash', heal: 'Heal', switchWeapon: 'Switch weapon', pause: 'Pause', inventory: 'Inventory', interact: 'Continue dialogue',
      level1: 'GEOMETRIC CASTLE', level2: 'THE FOREST PATH', level3: 'ANCIENT RUINS', level4: 'COMBAT TRIAL',
      level5: 'DANGEROUS PATH', level6: 'TWILIGHT PASS', level7: 'THE OLD SANCTUM', level8: 'THE OLD MAN',
      checkpoint: 'CHECKPOINT', tryAgain: 'TRY AGAIN', noHealing: 'NO HEALING DRAUGHTS', healUsed: 'HEALING DRAUGHT',
      weaponUnlocked: 'WEAPON UNLOCKED', powerUnlocked: 'POWER AWAKENED', energyLow: 'NOT ENOUGH SPIRIT',
      bossName: 'OLD MAN', bossPhase1: 'MASTER OF BODY', bossPhase2: 'MASTER OF SHADOW', bossPhase3: 'MASTER OF SPIRIT',
      swordName: 'Serpent Whip', greatswordName: 'Ember Whip', spearName: 'Astral Whip',
      inventoryTitle: 'INVENTORY', inventoryKicker: "KNIGHT'S SATCHEL", closeInventory: 'I — close inventory',
      equipment: 'Equipment', supplies: 'Supplies', powers: 'Powers', equip: 'Equip', equipped: 'Equipped', locked: 'Locked', use: 'Use',
      spirit: 'Spirit', healing: 'Healing Draught', shadowStep: 'Shadow Step', airBurst: 'Air Burst', guardBurst: 'Guard Burst', energySlash: 'Energy Slash',
      trainingComplete: 'Your training is complete.', continues: 'THE STORY CONTINUES...', thankYou: 'THANK YOU FOR PLAYING', replay: 'REPLAY DEMO',
      prologue: [
        'Long ago, the Third Kingdom stood on the edge of ruin.',
        'The last great dragon gathered creatures and darkness to claim the realm.',
        'Against it rose an ancient order: the Knights of the Renaissance.',
        'The dragon fell. So did the order\'s leader and almost every knight.',
        'One knight survived and vanished beyond the frontier into the Isolated Lands.',
        'Years later, he broke an ancient vow... and had a son.',
        'The title was abandoned. The legacy was not.'
      ]
    },
    ptBR: {
      presents: 'VIGU STUDIO APRESENTA', subtitle: 'UM PRÓLOGO JOGÁVEL', startJourney: 'INICIAR JORNADA',
      options: 'OPÇÕES', controls: 'CONTROLES', language: 'IDIOMA', back: 'VOLTAR', paused: 'PAUSADO', resume: 'CONTINUAR',
      restartCheckpoint: 'REINICIAR CHECKPOINT', quitTitle: 'VOLTAR AO MENU', keyboardTouch: 'Compatível com teclado e controles por toque',
      rotateTitle: 'VIRE O SEU CELULAR', rotateText: 'Para uma melhor experiência, jogue com o celular na horizontal.',
      rotateButton: 'VIRAR PARA HORIZONTAL', rotateHelp: 'Se a rotação automática não estiver disponível, vire o celular manualmente.',
      musicVolume: 'Volume da Música', sfxVolume: 'Volume dos Efeitos', screenShake: 'Tremor de Tela', reducedEffects: 'Efeitos Reduzidos',
      fullscreen: 'Tela Cheia', on: 'LIGADO', off: 'DESLIGADO', move: 'Mover', jump: 'Pulo duplo', attack: 'Chicote', block: 'Bloquear',
      power: 'Dash / pulo-dash aéreo', heal: 'Curar', switchWeapon: 'Trocar arma', pause: 'Pausar', inventory: 'Inventário', interact: 'Continuar diálogo',
      level1: 'CASTELO GEOMÉTRICO', level2: 'TRILHA DA FLORESTA', level3: 'RUÍNAS ANTIGAS', level4: 'PROVA DE COMBATE',
      level5: 'CAMINHO PERIGOSO', level6: 'PASSAGEM DO CREPÚSCULO', level7: 'SANTUÁRIO ANTIGO', level8: 'O VELHO',
      checkpoint: 'CHECKPOINT', tryAgain: 'TENTE NOVAMENTE', noHealing: 'SEM ELIXIRES DE CURA', healUsed: 'ELIXIR DE CURA',
      weaponUnlocked: 'ARMA DESBLOQUEADA', powerUnlocked: 'PODER DESPERTO', energyLow: 'ESPÍRITO INSUFICIENTE',
      bossName: 'O VELHO', bossPhase1: 'MESTRE DO CORPO', bossPhase2: 'MESTRE DAS SOMBRAS', bossPhase3: 'MESTRE DO ESPÍRITO',
      swordName: 'Chicote Serpente', greatswordName: 'Chicote de Brasas', spearName: 'Chicote Astral',
      inventoryTitle: 'INVENTÁRIO', inventoryKicker: 'BOLSA DO CAVALEIRO', closeInventory: 'I — fechar inventário',
      equipment: 'Equipamento', supplies: 'Suprimentos', powers: 'Poderes', equip: 'Equipar', equipped: 'Equipado', locked: 'Bloqueado', use: 'Usar',
      spirit: 'Espírito', healing: 'Elixir de Cura', shadowStep: 'Passo Sombrio', airBurst: 'Impulso Aéreo', guardBurst: 'Explosão de Guarda', energySlash: 'Corte de Energia',
      trainingComplete: 'Seu treinamento está concluído.', continues: 'A HISTÓRIA CONTINUA...', thankYou: 'OBRIGADO POR JOGAR', replay: 'JOGAR NOVAMENTE',
      prologue: [
        'Há muitos anos, o Terceiro Reino esteve à beira da destruição.',
        'O último grande dragão reuniu criaturas e trevas para tomar o reino.',
        'Contra ele surgiu uma antiga ordem: os Knights of the Renaissance.',
        'O dragão caiu. Também caíram o líder da ordem e quase todos os cavaleiros.',
        'Um cavaleiro sobreviveu e desapareceu além da fronteira, nas Terras Isoladas.',
        'Anos depois, ele quebrou um antigo juramento... e teve um filho.',
        'O título foi abandonado. O legado não.'
      ]
    }
  };

  const storageGet = (key, fallback = null) => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } };
  const storageSet = (key, value) => { try { localStorage.setItem(key, String(value)); } catch { /* no-op */ } };
  const settings = {
    language: storageGet('knights_language', 'ptBR'),
    music: Number(storageGet('knights_music', 0.36)),
    sfx: Number(storageGet('knights_sfx', 0.62)),
    screenShake: storageGet('knights_shake', 'true') !== 'false',
    reducedEffects: storageGet('knights_reduced', 'false') === 'true'
  };
  if (!LANGS.includes(settings.language)) settings.language = 'en';
  const t = (key) => translations[settings.language][key] ?? translations.en[key] ?? key;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const rectsOverlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  const approach = (v, target, amount) => v < target ? Math.min(target, v + amount) : Math.max(target, v - amount);
  const TAU = Math.PI * 2;

  function saveSettings() {
    storageSet('knights_language', settings.language);
    storageSet('knights_music', settings.music);
    storageSet('knights_sfx', settings.sfx);
    storageSet('knights_shake', settings.screenShake);
    storageSet('knights_reduced', settings.reducedEffects);
  }

  class Input {
    constructor() {
      this.down = new Set(); this.pressed = new Set(); this.released = new Set();
      this.touch = { left:false, right:false, jump:false, attack:false, block:false, power:false };
      this.touchPressed = new Set(); this.touchPointers = new Map();
      const prevent = new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space']);
      window.addEventListener('keydown', (e) => {
        if (prevent.has(e.code)) e.preventDefault();
        if (!this.down.has(e.code)) this.pressed.add(e.code);
        this.down.add(e.code);
      }, { passive:false });
      window.addEventListener('keyup', (e) => { this.down.delete(e.code); this.released.add(e.code); });
      window.addEventListener('blur', () => this.clear());
      document.querySelectorAll('[data-action]').forEach((btn) => {
        const action = btn.dataset.action;
        const on = (e) => {
          e.preventDefault(); e.stopPropagation();
          try { btn.setPointerCapture?.(e.pointerId); } catch {}
          const active = [...this.touchPointers.values()].some((v) => v === action);
          this.touchPointers.set(e.pointerId, action);
          if (!active && !this.touch[action]) this.touchPressed.add(action);
          this.touch[action] = true; btn.classList.add('pressed');
        };
        const off = (e) => {
          e.preventDefault(); e.stopPropagation();
          this.touchPointers.delete(e.pointerId);
          const held = [...this.touchPointers.values()].some((v) => v === action);
          this.touch[action] = held; if (!held) btn.classList.remove('pressed');
        };
        btn.addEventListener('pointerdown', on, { passive:false });
        btn.addEventListener('pointerup', off, { passive:false });
        btn.addEventListener('pointercancel', off, { passive:false });
        btn.addEventListener('lostpointercapture', off, { passive:false });
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
      });
    }
    clear() {
      this.down.clear(); this.pressed.clear(); this.released.clear(); this.touchPressed.clear(); this.touchPointers.clear();
      Object.keys(this.touch).forEach((k) => { this.touch[k] = false; });
      document.querySelectorAll('[data-action].pressed').forEach((b) => b.classList.remove('pressed'));
    }
    endFrame() { this.pressed.clear(); this.released.clear(); this.touchPressed.clear(); }
    key(...codes) { return codes.some((c) => this.down.has(c)); }
    tap(...codes) { return codes.some((c) => this.pressed.has(c)); }
    moveX() { return ((this.key('KeyD','ArrowRight') || this.touch.right) ? 1 : 0) - ((this.key('KeyA','ArrowLeft') || this.touch.left) ? 1 : 0); }
    jumpDown() { return this.key('Space','KeyW','ArrowUp') || this.touch.jump; }
    jumpTap() { return this.tap('Space','KeyW','ArrowUp') || this.touchPressed.has('jump'); }
    attackTap() { return this.tap('KeyJ','KeyX') || this.touchPressed.has('attack'); }
    blockDown() { return this.key('KeyK','KeyC') || this.touch.block; }
    powerTap() { return this.tap('ShiftLeft','ShiftRight','KeyL') || this.touchPressed.has('power'); }
    healTap() { return this.tap('KeyH'); }
    weaponTap() { return this.tap('KeyQ'); }
    inventoryTap() { return this.tap('KeyI'); }
    pauseTap() { return this.tap('Escape','KeyP'); }
    confirmTap() { return this.tap('Enter','Space','KeyE'); }
  }

  class AudioManager {
    constructor() { this.ctx = null; this.master = null; this.musicGain = null; this.sfxGain = null; this.timer = null; this.mode = ''; this.step = 0; }
    unlock() {
      if (!this.ctx) {
        const A = window.AudioContext || window.webkitAudioContext;
        if (!A) return;
        this.ctx = new A(); this.master = this.ctx.createGain(); this.musicGain = this.ctx.createGain(); this.sfxGain = this.ctx.createGain();
        this.musicGain.connect(this.master); this.sfxGain.connect(this.master); this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.sync(); if (!this.timer && this.mode) { const m = this.mode; this.mode = ''; this.setMusic(m); }
    }
    sync() { if (!this.ctx) return; this.musicGain.gain.value = settings.music * .18; this.sfxGain.gain.value = settings.sfx * .32; }
    tone(freq, duration=.07, type='sine', gain=.18, delay=0, dest=null) {
      if (!this.ctx) return;
      const now = this.ctx.currentTime + delay; const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(Math.max(30, freq), now); g.gain.setValueAtTime(.0001, now);
      g.gain.exponentialRampToValueAtTime(Math.max(.0002, gain), now + .008); g.gain.exponentialRampToValueAtTime(.0001, now + duration);
      o.connect(g); g.connect(dest || this.sfxGain); o.start(now); o.stop(now + duration + .025);
    }
    sfx(name) {
      if (!this.ctx) return;
      const m = {
        jump:()=>{this.tone(300,.06,'triangle',.15);this.tone(470,.08,'triangle',.09,.03);},
        sword:()=>{this.tone(650,.05,'sawtooth',.09);this.tone(920,.04,'triangle',.08,.02);},
        hit:()=>{this.tone(125,.08,'square',.18);this.tone(230,.05,'sawtooth',.08);},
        block:()=>{this.tone(820,.05,'square',.12);this.tone(1240,.04,'triangle',.08,.02);},
        power:()=>{this.tone(310,.09,'triangle',.12);this.tone(620,.13,'sine',.1,.04);},
        pickup:()=>{[520,720,980].forEach((f,i)=>this.tone(f,.07,'triangle',.08,i*.045));},
        checkpoint:()=>{[392,523,659].forEach((f,i)=>this.tone(f,.1,'sine',.09,i*.07));},
        death:()=>{[210,160,110].forEach((f,i)=>this.tone(f,.16,'sawtooth',.12,i*.08));},
        boss:()=>{this.tone(80,.18,'sawtooth',.18);this.tone(50,.22,'triangle',.14,.02);},
        win:()=>{[262,330,392,523,659].forEach((f,i)=>this.tone(f,.12,'triangle',.09,i*.08));},
        click:()=>this.tone(560,.035,'triangle',.06)
      };
      (m[name] || (()=>{}))();
    }
    setMusic(mode) {
      if (this.mode === mode && this.timer) return;
      this.mode = mode; this.step = 0; if (this.timer) clearInterval(this.timer); this.timer = null;
      if (!this.ctx || !mode) return;
      const patterns = {
        title:{bpm:86,n:[110,0,165,0,146,0,123,0],b:[55,55,49,49]},
        world:{bpm:106,n:[220,277,330,277,247,311,370,311],b:[55,62,69,62]},
        ruins:{bpm:94,n:[196,247,294,247,220,262,330,262],b:[49,55,62,55]},
        boss:{bpm:142,n:[196,0,233,247,196,0,294,247],b:[49,46,55,52]},
        ending:{bpm:76,n:[262,330,392,0,349,330,294,0],b:[65,55,49,55]}
      };
      const p = patterns[mode] || patterns.world; const tick = Math.round(60000/p.bpm/2);
      const play = () => { if (!this.ctx || this.mode !== mode) return; const note=p.n[this.step%p.n.length]; if(note)this.tone(note,.09,'triangle',.08,0,this.musicGain); if(this.step%2===0)this.tone(p.b[(this.step/2|0)%p.b.length],.14,'sine',.07,0,this.musicGain); this.step++; };
      play(); this.timer = setInterval(play, tick);
    }
  }

  const input = new Input();
  const audio = new AudioManager();

  class Particle {
    constructor(x,y,vx,vy,life,color,size=2,gravity=40,shape='square') { Object.assign(this,{x,y,vx,vy,life,maxLife:life,color,size,gravity,shape}); }
    update(dt) { this.life -= dt; this.x += this.vx*dt; this.y += this.vy*dt; this.vy += this.gravity*dt; }
    draw(ctx,cx,cy) {
      const a = clamp(this.life/this.maxLife,0,1); if(a<=0)return;
      const x=this.x-cx,y=this.y-cy; ctx.globalAlpha=a; ctx.fillStyle=this.color;
      if(this.shape==='diamond'){ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.fillRect(-this.size/2,-this.size/2,this.size,this.size);ctx.restore();}
      else {ctx.fillRect(x,y,this.size,this.size);} ctx.globalAlpha=1;
    }
  }

  class RingEffect {
    constructor(x,y,color,r=4,life=.35,speed=70,line=1.5) { Object.assign(this,{x,y,color,r,life,maxLife:life,speed,line}); }
    update(dt){this.life-=dt;this.r+=this.speed*dt;}
    draw(ctx,cx,cy){const a=clamp(this.life/this.maxLife,0,1);ctx.globalAlpha=a*.8;ctx.strokeStyle=this.color;ctx.lineWidth=this.line;ctx.beginPath();ctx.arc(this.x-cx,this.y-cy,this.r,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
  }

  class Platform {
    constructor(x,y,w,h=16,type='ground',opts={}) { Object.assign(this,{x,y,w,h,type,baseX:x,baseY:y,t:0,range:opts.range||0,speed:opts.speed||1,axis:opts.axis||'x',oneWay:opts.oneWay ?? h<=14,fallDelay:0,falling:false,vy:0,fallTime:0}); }
    update(dt,player) {
      this.t += dt;
      if(this.type==='moving') { const ox=this.x,oy=this.y,offset=Math.sin(this.t*this.speed)*this.range; if(this.axis==='x')this.x=this.baseX+offset;else this.y=this.baseY+offset; if(player?.onPlatform===this){player.x+=this.x-ox;player.y+=this.y-oy;} }
      if(this.type==='falling') {
        if(player?.onPlatform===this && !this.falling && this.fallDelay<=0)this.fallDelay=.42;
        if(this.fallDelay>0){this.fallDelay-=dt;if(this.fallDelay<=0){this.falling=true;this.fallTime=0;}}
        if(this.falling){this.fallTime+=dt;this.vy+=180*dt;this.y+=this.vy*dt;if(player?.onPlatform!==this&&(this.fallTime>2.2||this.y>this.baseY+150)){this.x=this.baseX;this.y=this.baseY;this.vy=0;this.falling=false;this.fallDelay=0;this.fallTime=0;}}
      }
    }
    draw(ctx,cx,cy,theme) {
      const x=Math.round(this.x-cx), y=Math.round(this.y-cy); if(x+this.w<0||x>W||y>H+40)return;
      const edge=this.type==='falling'?C.danger:this.type==='moving'?C.violet:C.cyan;
      ctx.fillStyle='rgba(7,8,24,.88)';ctx.fillRect(x,y,this.w,this.h);
      ctx.globalAlpha=.18;ctx.fillStyle=theme.fill;ctx.fillRect(x+1,y+2,this.w-2,Math.max(1,this.h-3));ctx.globalAlpha=1;
      neonLine(ctx,x,y,x+this.w,y,edge,1.1,.25);
      ctx.globalAlpha=.25;ctx.strokeStyle=edge;ctx.lineWidth=.65;ctx.strokeRect(x+.5,y+3.5,this.w-1,Math.max(1,this.h-4));ctx.globalAlpha=1;
      for(let i=10;i<this.w;i+=22){ctx.globalAlpha=.16;ctx.strokeStyle=edge;ctx.beginPath();ctx.moveTo(x+i,y+4);ctx.lineTo(x+i-6,y+this.h-2);ctx.stroke();ctx.globalAlpha=1;}
    }
  }

  class Hazard {
    constructor(x,y,w=32,h=12){Object.assign(this,{x,y,w,h});}
    draw(ctx,cx,cy){const x=this.x-cx,y=this.y-cy,count=Math.max(1,Math.floor(this.w/10));ctx.fillStyle='rgba(34,6,24,.7)';ctx.fillRect(x,y+this.h-3,this.w,3);for(let i=0;i<count;i++){const sx=x+i*(this.w/count),sw=this.w/count;ctx.beginPath();ctx.moveTo(sx,y+this.h);ctx.lineTo(sx+sw*.5,y);ctx.lineTo(sx+sw,y+this.h);ctx.closePath();ctx.fillStyle='rgba(83,11,55,.9)';ctx.fill();ctx.strokeStyle=C.danger;ctx.lineWidth=.8;ctx.stroke();}}
  }

  class Checkpoint {
    constructor(x,y){this.x=x;this.y=y;this.w=16;this.h=38;this.active=false;this.phase=Math.random()*TAU;}
    update(player,game){if(!this.active&&rectsOverlap({x:this.x-8,y:this.y-5,w:32,h:46},player)){this.active=true;game.checkpoint={level:game.levelIndex,x:this.x-14,y:this.y-28};game.notice(t('checkpoint'),1.3);audio.sfx('checkpoint');game.burst(this.x+8,this.y+9,C.cyan,12);game.ring(this.x+8,this.y+10,C.magenta,6,.55,60);}}
    draw(ctx,cx,cy,time){const x=this.x-cx,y=this.y-cy,p=.5+.5*Math.sin(time*3+this.phase),col=this.active?C.cyan:C.violet;ctx.globalAlpha=.18+.12*p;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x+8,y+10,14,0,TAU);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=col;ctx.lineWidth=1;ctx.strokeRect(x+4,y+7,8,27);ctx.beginPath();ctx.moveTo(x+8,y);ctx.lineTo(x+14,y+8);ctx.lineTo(x+8,y+16);ctx.lineTo(x+2,y+8);ctx.closePath();ctx.fillStyle=this.active?C.cyanHi:'#3c315f';ctx.fill();ctx.strokeStyle=col;ctx.stroke();}
  }

  class Pickup {
    constructor(type,x,y){Object.assign(this,{type,x,y,w:14,h:18,collected:false,t:Math.random()*TAU});}
    update(dt,game){this.t+=dt;const box={x:this.x,y:this.y+Math.sin(this.t*2)*2,w:this.w,h:this.h};if(!this.collected&&rectsOverlap(box,game.player)){this.collected=true;game.obtain(this.type);}}
    draw(ctx,cx,cy){if(this.collected)return;const x=this.x-cx,y=this.y-cy+Math.sin(this.t*2)*2;let col=C.cyan,symbol='◇';if(this.type==='heal'){col=C.magenta;symbol='+';}if(this.type==='greatsword'||this.type==='spear'){col=C.orange;symbol='†';}if(this.type.startsWith('power')){col=C.violet;symbol='✦';}ctx.globalAlpha=.17+.06*Math.sin(this.t*4);ctx.fillStyle=col;ctx.beginPath();ctx.arc(x+7,y+9,13,0,TAU);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=col;ctx.lineWidth=1;ctx.strokeRect(x+1,y+2,12,14);ctx.fillStyle=C.white;ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(symbol,x+7,y+9);ctx.textAlign='left';ctx.textBaseline='alphabetic';}
  }

  class Projectile {
    constructor(x,y,vx,vy,owner='enemy',blockable=true,color=C.danger){Object.assign(this,{x,y,vx,vy,owner,blockable,color,w:8,h:4,dead:false,life:3});}
    update(dt,game){this.life-=dt;this.x+=this.vx*dt;this.y+=this.vy*dt;if(this.life<=0){this.dead=true;return;}for(const p of game.level.platforms){if(rectsOverlap(this,p)){this.dead=true;return;}}if(this.owner==='enemy'&&rectsOverlap(this,game.player)){const p=game.player;const blocked=p.blocking&&this.blockable&&((this.vx>0&&p.facing<0)||(this.vx<0&&p.facing>0));if(blocked){audio.sfx('block');game.burst(this.x,this.y,C.cyan,5);game.ring(this.x,this.y,C.cyan,3,.2,55);this.dead=true;}else{p.damage(1,this.x,false,game);this.dead=true;}}}
    draw(ctx,cx,cy){const x=this.x-cx,y=this.y-cy;ctx.globalAlpha=.22;ctx.fillStyle=this.color;ctx.fillRect(x-6,y-3,20,8);ctx.globalAlpha=1;neonLine(ctx,x-5,y,x+8,y,this.color,1.3,.3);}
  }

  class Enemy {
    constructor(type,x,y){this.type=type;this.x=x;this.y=y;this.vx=0;this.vy=0;const dims={bat:[18,12],wolf:[22,15],crawler:[18,10]};const d=dims[type]||[18,26];this.w=d[0];this.h=d[1];const hp={runner:1,bat:1,crawler:1,wolf:2,sword:2,archer:2,shield:3,elite:4};this.hp=hp[type]||2;this.maxHp=this.hp;this.facing=-1;this.onGround=false;this.dead=false;this.invuln=0;this.hitFlash=0;this.attackTimer=0;this.cooldown=Math.random()*.7;this.telegraph=0;this.spawnY=y;this.phase=Math.random()*TAU;this.lunge=0;}
    get bodyBox(){return{x:this.x+2,y:this.y+2,w:Math.max(4,this.w-4),h:Math.max(4,this.h-3)};}
    damage(amount,game,fromX){if(this.dead||this.invuln>0)return false;if(this.type==='shield'){const front=(fromX<this.x&&this.facing<0)||(fromX>this.x&&this.facing>0);const above=game.player.y+game.player.h<this.y+8;if(front&&!above){audio.sfx('block');game.burst(this.x+this.w/2,this.y+9,C.cyan,5);return false;}}this.hp-=amount;this.invuln=.16;this.hitFlash=.12;this.vx+=(this.x<fromX?-1:1)*45;audio.sfx('hit');game.burst(this.x+this.w/2,this.y+8,C.magenta,7);if(this.hp<=0){this.dead=true;this.vy=-85;game.burst(this.x+this.w/2,this.y+8,C.crimson,11);game.score+=50;}return true;}
    update(dt,game){if(this.hitFlash>0)this.hitFlash-=dt;if(this.invuln>0)this.invuln-=dt;if(this.cooldown>0)this.cooldown-=dt;if(this.attackTimer>0)this.attackTimer=Math.max(0,this.attackTimer-dt);if(this.telegraph>0)this.telegraph=Math.max(0,this.telegraph-dt);if(this.dead){this.vy+=CONFIG.gravity*dt;this.y+=this.vy*dt;this.x+=this.vx*dt;return;}const p=game.player,dx=p.x-this.x,dy=(p.y+p.h*.5)-(this.y+this.h*.5);this.facing=dx>=0?1:-1;const playerBody={x:p.x+2,y:p.y+2,w:p.w-4,h:p.h-4};const groundAI=()=>{this.vy+=CONFIG.gravity*dt;game.moveEntity(this,dt);if(this.y>H+170)this.dead=true;};
      if(this.type==='bat'){this.phase+=dt*2.8;this.y=lerp(this.y,this.spawnY+Math.sin(this.phase)*14,1-Math.pow(.02,dt));this.vx=approach(this.vx,Math.abs(dx)<220?this.facing*38:Math.sin(this.phase*.7)*12,90*dt);this.x+=this.vx*dt;if(this.cooldown<=0&&rectsOverlap(this.bodyBox,playerBody)){if(p.damage(1,this.x+this.w/2,false,game)||p.blocking)this.cooldown=.9;}return;}
      if(this.type==='archer'){this.vy+=CONFIG.gravity*dt;game.moveEntity(this,dt);if(Math.abs(dx)<250){this.vx=approach(this.vx,Math.abs(dx)<100?-this.facing*22:0,120*dt);if(this.cooldown<=0&&Math.abs(dy)<65){this.cooldown=1.25;this.telegraph=.24;}if(this.telegraph>0&&this.telegraph<.04){const speed=105;game.projectiles.push(new Projectile(this.x+this.w/2,this.y+8,this.facing*speed,dy*.25,'enemy',true,C.danger));this.telegraph=0;}}return;}
      if(this.type==='sword'||this.type==='elite'||this.type==='shield'){const elite=this.type==='elite',shield=this.type==='shield',engaged=Math.abs(dx)<(elite?220:160);const desired=shield?28:elite?34:29;if(engaged&&Math.abs(dx)>desired)this.vx=approach(this.vx,this.facing*(elite?46:shield?28:35),(elite?190:150)*dt);else this.vx=approach(this.vx,0,220*dt);if(engaged&&Math.abs(dx)<desired+8&&Math.abs(dy)<22&&this.cooldown<=0){this.attackTimer=elite?.34:.42;this.cooldown=elite?.75:shield?1.15:1.0;}if(this.attackTimer>0&&this.attackTimer<.16){const reach=elite?23:18,hit={x:this.facing>0?this.x+this.w-2:this.x-reach+2,y:this.y+6,w:reach,h:13};if(rectsOverlap(hit,playerBody)){p.damage(1,this.x,false,game);this.attackTimer=0;}}groundAI();return;}
      if(this.type==='runner'||this.type==='wolf'||this.type==='crawler'){const wolf=this.type==='wolf',crawl=this.type==='crawler',engaged=Math.abs(dx)<(wolf?230:crawl?140:190);const speed=this.lunge>0?112:wolf?66:crawl?44:60;if(wolf&&engaged&&this.cooldown<=0&&Math.abs(dx)<95){this.lunge=.3;this.cooldown=1.0;}if(this.lunge>0)this.lunge-=dt;this.vx=approach(this.vx,engaged?this.facing*speed:0,230*dt);if(engaged&&rectsOverlap(this.bodyBox,playerBody)&&(this.cooldown<=0||this.lunge>0)){p.damage(1,this.x,false,game);this.cooldown=.8;}groundAI();}
    }
    draw(ctx,cx,cy,time){if(this.dead&&this.y>H+40)return;const x=this.x-cx,y=this.y-cy,flash=this.hitFlash>0;ctx.save();ctx.translate(x+this.w/2,y+this.h/2);ctx.scale(this.facing,1);const base=flash?C.white:(this.type==='elite'?C.orange:this.type==='shield'?C.crimson:C.violet),core=this.type==='bat'?C.magenta:this.type==='wolf'?C.danger:C.crimson;ctx.globalAlpha=.18;ctx.fillStyle=base;ctx.fillRect(-this.w*.7,-this.h*.65,this.w*1.4,this.h*1.3);ctx.globalAlpha=1;ctx.strokeStyle=base;ctx.lineWidth=1;
      if(this.type==='bat'){const flap=Math.sin(time*10+this.phase)*4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-10,-5-flap);ctx.lineTo(-6,4);ctx.lineTo(0,2);ctx.lineTo(6,4);ctx.lineTo(10,-5-flap);ctx.closePath();ctx.stroke();ctx.fillStyle=core;ctx.fillRect(-2,-2,4,5);}
      else if(this.type==='wolf'){ctx.beginPath();ctx.moveTo(-9,2);ctx.lineTo(-5,-5);ctx.lineTo(6,-5);ctx.lineTo(10,1);ctx.lineTo(5,5);ctx.lineTo(-7,5);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(-6,4);ctx.lineTo(-7,10);ctx.moveTo(5,4);ctx.lineTo(7,10);ctx.stroke();ctx.fillStyle=C.danger;ctx.fillRect(5,-3,2,2);}
      else if(this.type==='crawler'){ctx.strokeRect(-8,-3,16,7);for(let i=-6;i<=6;i+=4){ctx.beginPath();ctx.moveTo(i,3);ctx.lineTo(i-3,7);ctx.moveTo(i,3);ctx.lineTo(i+3,7);ctx.stroke();}}
      else {ctx.strokeRect(-5,-5,10,12);ctx.strokeRect(-4,-13,8,8);ctx.beginPath();ctx.moveTo(-3,7);ctx.lineTo(-5,13);ctx.moveTo(3,7);ctx.lineTo(5,13);ctx.stroke();if(this.type==='archer'){ctx.beginPath();ctx.arc(7,-1,8,-Math.PI/2,Math.PI/2);ctx.stroke();ctx.beginPath();ctx.moveTo(7,-9);ctx.lineTo(7,7);ctx.stroke();}else{ctx.beginPath();ctx.moveTo(5,-2);ctx.lineTo(12,6);ctx.stroke();}if(this.type==='shield'){ctx.strokeStyle=C.cyan;ctx.beginPath();ctx.moveTo(-7,-5);ctx.lineTo(-12,-2);ctx.lineTo(-11,7);ctx.lineTo(-7,10);ctx.closePath();ctx.stroke();}}
      ctx.restore();if(this.hp<this.maxHp&&!this.dead){ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(x,y-5,this.w,2);ctx.fillStyle=base;ctx.fillRect(x,y-5,this.w*(this.hp/this.maxHp),2);} }
  }

  function bossMeleeBox(b){const mid=b.x+b.w/2,reach=44;return {x:b.facing>0?mid:mid-reach,y:b.y+4,w:reach,h:30};}
  class Boss {
    constructor(x,y){this.x=x;this.y=y;this.w=22;this.h=36;this.vx=0;this.vy=0;this.facing=-1;this.onGround=false;this.phase=1;this.hp=12;this.maxHp=12;this.dead=false;this.cooldown=1;this.attackTimer=0;this.invuln=0;this.hitFlash=0;this.telegraph=0;this.special=0;this.after=[];}
    get color(){return this.phase===1?C.orange:this.phase===2?C.violet:C.cyan;}
    damage(amount,game,fromX){if(this.dead||this.invuln>0)return false;this.hp-=amount;this.invuln=.15;this.hitFlash=.12;audio.sfx('hit');game.burst(this.x+11,this.y+14,this.color,12);game.shake(.12,3);if(this.hp<=0){if(this.phase<3){this.phase++;this.hp=this.maxHp;this.invuln=1.1;this.cooldown=1.0;game.burst(this.x+11,this.y+12,this.color,26);game.ring(this.x+11,this.y+12,this.color,8,.9,80,2);game.notice(t(`bossPhase${this.phase}`),1.8);audio.sfx('boss');game.environmentPulse=1;return true;}this.dead=true;game.burst(this.x+11,this.y+10,C.white,40);game.ring(this.x+11,this.y+10,C.cyan,10,1.2,95,2);audio.sfx('win');game.startEnding();}return true;}
    update(dt,game){if(this.dead)return;if(this.invuln>0)this.invuln-=dt;if(this.hitFlash>0)this.hitFlash-=dt;if(this.cooldown>0)this.cooldown-=dt;if(this.attackTimer>0)this.attackTimer=Math.max(0,this.attackTimer-dt);if(this.special>0)this.special-=dt;const p=game.player,dx=p.x-this.x;this.facing=dx>=0?1:-1;this.vy+=CONFIG.gravity*dt;
      if(this.phase===1){if(this.cooldown<=0){if(Math.abs(dx)<48){this.attackTimer=.46;this.cooldown=.8;game.shake(.07,2);}else{this.cooldown=1.1;game.shockwaves.push({x:this.x+this.w/2-11,y:game.level.groundY-10,dir:this.facing,vx:this.facing*130,w:22,h:10,life:1.5,dead:false});audio.sfx('boss');}}this.vx=approach(this.vx,Math.abs(dx)>38?this.facing*42:0,170*dt);}
      if(this.phase===2){if(this.cooldown<=0){this.after.push({x:this.x,y:this.y,life:.35});this.x+=this.facing*clamp(Math.abs(dx)*.52,48,90);this.x=clamp(this.x,18,game.level.width-40);this.attackTimer=.3;this.cooldown=.72;game.burst(this.x+11,this.y+13,C.violet,9);game.ring(this.x+11,this.y+13,C.violet,4,.25,70);}this.vx=approach(this.vx,0,280*dt);}
      if(this.phase===3){if(this.cooldown<=0){this.cooldown=.82;for(let i=-1;i<=1;i++){const ang=Math.atan2((p.y+10)-(this.y+10),(p.x+10)-(this.x+11))+i*.14;game.projectiles.push(new Projectile(this.x+11,this.y+11,Math.cos(ang)*125,Math.sin(ang)*125,'enemy',true,C.cyan));}game.ring(this.x+11,this.y+11,C.cyan,4,.28,62);}this.vx=approach(this.vx,Math.abs(dx)>95?this.facing*34:0,130*dt);}
      if(this.attackTimer>0&&this.attackTimer<.14){const hit=this.phase===1?bossMeleeBox(this):{x:this.facing>0?this.x+15:this.x-19,y:this.y+5,w:25,h:21};if(rectsOverlap(hit,p)){p.damage(1,this.x,this.phase===1,game);this.attackTimer=0;}}
      game.moveEntity(this,dt);this.after.forEach(a=>a.life-=dt);this.after=this.after.filter(a=>a.life>0);
    }
    draw(ctx,cx,cy,time){for(const a of this.after){ctx.globalAlpha=(a.life/.35)*.2;drawBossFigure(ctx,a.x-cx,a.y-cy,this.facing,C.violet,time,true);ctx.globalAlpha=1;}drawBossFigure(ctx,this.x-cx,this.y-cy,this.facing,this.hitFlash>0?C.white:this.color,time,false);if(this.phase===1&&this.attackTimer>0){const hit=bossMeleeBox(this);ctx.save();ctx.strokeStyle=C.orange;ctx.globalAlpha=this.attackTimer<.14?.85:.28;ctx.lineWidth=this.attackTimer<.14?2:1;ctx.beginPath();ctx.moveTo(this.x+11-cx,this.y+14-cy);ctx.lineTo((this.facing>0?hit.x+hit.w:hit.x)-cx,this.y+19-cy);ctx.stroke();ctx.restore();}}
  }

  function drawBossFigure(ctx,x,y,facing,color,time,ghost){ctx.save();ctx.translate(x+11,y+17);ctx.scale(facing,1);ctx.strokeStyle=color;ctx.lineWidth=ghost?.7:1.2;ctx.globalAlpha*=ghost?.7:1;ctx.strokeRect(-6,-7,12,15);ctx.strokeRect(-5,-16,10,9);ctx.beginPath();ctx.moveTo(-5,8);ctx.lineTo(-8,17);ctx.moveTo(5,8);ctx.lineTo(8,17);ctx.moveTo(6,-3);ctx.lineTo(16,5);ctx.stroke();ctx.globalAlpha*=.18;ctx.fillStyle=color;ctx.fillRect(-9,-18,20,35);ctx.restore();ctx.globalAlpha=1;}

  class Player {
    constructor(x,y){this.x=x;this.y=y;this.w=18;this.h=28;this.vx=0;this.vy=0;this.facing=1;this.onGround=false;this.onPlatform=null;this.coyote=0;this.jumpBuffer=0;this.hp=4;this.maxHp=4;this.spirit=100;this.maxSpirit=100;this.blocking=false;this.invuln=0;this.attackTimer=0;this.attackCooldown=0;this.attackId=0;this.dashTimer=0;this.dashCooldown=0;this.airBurstUsed=false;this.heals=1;this.weapon='sword';this.unlocked={sword:true,greatsword:false,spear:false,shadowStep:true,airBurst:true,guardBurst:false,energySlash:false};this.trailTimer=0;this.anim=0;}
    damage(amount,fromX,unblockable,game){if(this.invuln>0)return false;const front=(fromX<this.x&&this.facing<0)||(fromX>this.x&&this.facing>0);if(this.blocking&&!unblockable&&front){audio.sfx('block');game.burst(this.x+this.w/2,this.y+10,C.cyan,6);game.ring(this.x+this.w/2,this.y+10,C.cyan,3,.2,55);return false;}this.hp-=amount;this.invuln=.85;this.vx=(this.x<fromX?-1:1)*85;this.vy=-90;audio.sfx('hit');game.burst(this.x+9,this.y+9,C.danger,11);game.shake(.14,3);game.environmentPulse=.45;if(this.hp<=0){audio.sfx('death');game.die();}return true;}
    heal(game){if(this.heals<=0){game.notice(t('noHealing'),1.1);return;}if(this.hp>=this.maxHp)return;this.heals--;this.hp=Math.min(this.maxHp,this.hp+2);game.notice(t('healUsed'),1.1);game.burst(this.x+9,this.y+9,C.magenta,14);audio.sfx('pickup');game.refreshInventory();}
    cycleWeapon(){const order=['sword','greatsword','spear'].filter(k=>this.unlocked[k]);if(order.length<2)return;this.weapon=order[(order.indexOf(this.weapon)+1)%order.length];}
    weaponStats(){if(this.weapon==='greatsword')return{reach:30,damage:2,duration:.34,cooldown:.44};if(this.weapon==='spear')return{reach:38,damage:1,duration:.24,cooldown:.28};return{reach:24,damage:1,duration:.22,cooldown:.26};}
    attack(game){if(this.attackCooldown>0||this.blocking||this.dashTimer>0)return;const s=this.weaponStats();this.attackTimer=s.duration;this.attackCooldown=s.cooldown;this.attackId++;audio.sfx('sword');game.weaponArcs.push({x:this.x+9,y:this.y+11,dir:this.facing,life:s.duration,max:s.duration,color:this.weapon==='greatsword'?C.orange:this.weapon==='spear'?C.cyan:C.magenta,reach:s.reach});}
    usePower(game){if(this.dashCooldown<=0&&this.unlocked.shadowStep&&this.onGround){if(this.spirit<18){game.notice(t('energyLow'),.9);return;}this.spirit-=18;this.dashTimer=.17;this.dashCooldown=.45;this.vx=this.facing*250;game.burst(this.x+9,this.y+12,C.violet,9);game.ring(this.x+9,this.y+12,C.violet,3,.22,75);audio.sfx('power');return;}if(this.unlocked.guardBurst&&this.blocking){if(this.spirit<30){game.notice(t('energyLow'),.9);return;}this.spirit-=30;game.ring(this.x+9,this.y+12,C.cyan,8,.4,120,2);game.burst(this.x+9,this.y+12,C.cyan,14);for(const e of game.enemies){if(!e.dead&&Math.hypot((e.x+e.w/2)-(this.x+9),(e.y+e.h/2)-(this.y+12))<58)e.damage(1,game,this.x);}audio.sfx('power');return;}if(this.unlocked.energySlash){if(this.spirit<24){game.notice(t('energyLow'),.9);return;}this.spirit-=24;game.projectiles.push(new Projectile(this.x+(this.facing>0?this.w:-8),this.y+10,this.facing*165,0,'player',false,C.cyan));audio.sfx('power');}}
    update(dt,game){if(this.invuln>0)this.invuln-=dt;if(this.attackCooldown>0)this.attackCooldown-=dt;if(this.attackTimer>0)this.attackTimer=Math.max(0,this.attackTimer-dt);if(this.dashCooldown>0)this.dashCooldown-=dt;this.spirit=Math.min(this.maxSpirit,this.spirit+8*dt);if(this.coyote>0)this.coyote-=dt;if(this.jumpBuffer>0)this.jumpBuffer-=dt;this.blocking=input.blockDown()&&this.dashTimer<=0&&this.attackTimer<=0;
      if(input.jumpTap())this.jumpBuffer=.12;if(input.healTap())this.heal(game);if(input.weaponTap())this.cycleWeapon();if(input.attackTap())this.attackBuffer=.14;this.attackBuffer=Math.max(0,(this.attackBuffer||0)-dt);if(this.attackBuffer>0&&this.attackCooldown<=0){this.attack(game);this.attackBuffer=0;}
      if(this.jumpBuffer>0){if(this.onGround||this.coyote>0){this.vy=-CONFIG.jumpSpeed;this.onGround=false;this.onPlatform=null;this.coyote=0;this.jumpBuffer=0;this.airBurstUsed=false;audio.sfx('jump');game.burst(this.x+9,this.y+this.h,C.magenta,5);}else if(this.unlocked.airBurst&&!this.airBurstUsed){this.vy=-205;this.airBurstUsed=true;this.jumpBuffer=0;game.ring(this.x+9,this.y+17,C.cyan,5,.3,90);game.burst(this.x+9,this.y+17,C.cyan,10);audio.sfx('power');}}
      if(input.powerTap())this.usePower(game);
      if(this.dashTimer>0){this.dashTimer-=dt;this.vx=this.facing*(this.airDashing?265:245);if(this.airDashing)this.vy+=CONFIG.gravity*.6*dt;else this.vy*=.6;this.trailTimer-=dt;if(this.trailTimer<=0){game.afterimages.push({x:this.x,y:this.y,facing:this.facing,life:.22,max:.22});this.trailTimer=.035;}}
      else {const mx=input.moveX();if(mx){this.facing=mx;this.vx=approach(this.vx,mx*(this.blocking?38:CONFIG.playerSpeed),410*dt);}else this.vx=approach(this.vx,0,(this.onGround?520:170)*dt);if(!input.jumpDown()&&this.vy<-85)this.vy=approach(this.vy,-85,1200*dt);this.vy+=CONFIG.gravity*dt;}
      const beforeGround=this.onGround;this.onGround=false;this.onPlatform=null;game.moveEntity(this,dt);if(beforeGround&&!this.onGround&&this.vy>=0)this.coyote=.09;if(this.onGround){this.airDashing=false;this.airBurstUsed=false;this.coyote=.09;}this.anim+=Math.abs(this.vx)*dt*.04;
      if(this.attackTimer>0){
        const stats=this.weaponStats(),progress=1-this.attackTimer/stats.duration;
        if(progress>.20&&progress<.76){const points=[...whipPoints(this),...whipPoints(this,dt*.5),...whipPoints(this,dt)];
          for(const e of [...game.enemies,...(game.boss?[game.boss]:[])]){
            if(e.dead||e._lastAttack===this.attackId)continue;
            const box=e.bodyBox||e;
            if(points.some(q=>rectsOverlap({x:q.x-3,y:q.y-3,w:6,h:6},box))){
              e._lastAttack=this.attackId;
              if(e.damage(stats.damage,game,this.x+9)){game.ring(box.x+box.w/2,box.y+box.h/2,C.pink,3,.18,55);this.spirit=Math.min(100,this.spirit+3);}
            }
          }
        }
      }
      if(this.y>H+150){this.hp=0;audio.sfx("death");game.die();}
    }
    draw(ctx,cx,cy,time,alpha=1,xOverride=null,yOverride=null,facingOverride=null){const x=(xOverride??this.x)-cx,y=(yOverride??this.y)-cy,facing=facingOverride??this.facing;ctx.save();ctx.globalAlpha*=alpha;ctx.translate(x+9,y+14);ctx.scale(facing,1);const hurt=this.invuln>0&&Math.floor(this.invuln*16)%2===0;const col=hurt?C.white:C.magenta;const leg=Math.sin(this.anim)*3*(Math.abs(this.vx)>8&&this.onGround?1:0);ctx.globalAlpha*=.16;ctx.fillStyle=col;ctx.fillRect(-10,-15,20,31);ctx.globalAlpha=alpha;ctx.strokeStyle=col;ctx.lineWidth=1.2;ctx.strokeRect(-5,-6,10,14);ctx.beginPath();ctx.moveTo(-4,8);ctx.lineTo(-5-leg,14);ctx.moveTo(4,8);ctx.lineTo(5+leg,14);ctx.stroke();ctx.strokeRect(-4,-14,8,8);ctx.fillStyle=C.pink;ctx.fillRect(1,-11,1.5,1.5);if(this.blocking){ctx.strokeStyle=C.cyan;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(-7,-4);ctx.quadraticCurveTo(-14,0,-8,11);ctx.quadraticCurveTo(-3,8,-3,1);ctx.closePath();ctx.stroke();}else{ctx.strokeStyle=C.cyanHi;ctx.beginPath();ctx.moveTo(5,-1);ctx.lineTo(13,8);ctx.stroke();}ctx.restore();}
  }

  function neonLine(ctx,x1,y1,x2,y2,color,width=1,halo=.3){ctx.globalAlpha=halo;ctx.strokeStyle=color;ctx.lineWidth=width*4;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.globalAlpha=1;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}

  const LEVEL_META = [
    {name:'level1', theme:'training', width:1250, fill:'#17426a'},
    {name:'level2', theme:'forest', width:1450, fill:'#0c665d'},
    {name:'level3', theme:'ruins', width:1550, fill:'#382a78'},
    {name:'level4', theme:'trial', width:1320, fill:'#6a235f'},
    {name:'level5', theme:'danger', width:1600, fill:'#5d173f'},
    {name:'level6', theme:'twilight', width:1500, fill:'#24225e'},
    {name:'level7', theme:'sanctum', width:1500, fill:'#23557c'},
    {name:'level8', theme:'boss', width:980, fill:'#3a276e'}
  ];

  function makeLevel(index) {
    const meta=LEVEL_META[index], groundY=236, platforms=[], hazards=[], enemies=[], pickups=[], checkpoints=[];
    const addGround=(x,w)=>platforms.push(new Platform(x,groundY,w,34,'ground',{oneWay:false}));
    if(index===0){addGround(0,420);addGround(455,410);addGround(905,345);platforms.push(new Platform(215,195,95,12));platforms.push(new Platform(515,185,80,12));platforms.push(new Platform(705,158,75,12,'moving',{range:34,speed:1.35}));hazards.push(new Hazard(420,224,35,12));hazards.push(new Hazard(865,224,40,12));enemies.push(new Enemy('sword',330,207));enemies.push(new Enemy('runner',610,210));pickups.push(new Pickup('heal',250,171));pickups.push(new Pickup('powerAirBurst',760,130));checkpoints.push(new Checkpoint(1020,198));}
    if(index===1){addGround(0,300);addGround(345,260);addGround(650,300);addGround(1000,450);platforms.push(new Platform(180,185,80,12));platforms.push(new Platform(420,165,90,12));platforms.push(new Platform(735,183,75,12,'falling'));platforms.push(new Platform(880,150,86,12));hazards.push(new Hazard(300,224,45,12));hazards.push(new Hazard(605,224,45,12));hazards.push(new Hazard(950,224,50,12));enemies.push(new Enemy('bat',430,115));enemies.push(new Enemy('wolf',730,210));enemies.push(new Enemy('archer',1110,207));pickups.push(new Pickup('spirit',495,135));pickups.push(new Pickup('heal',900,120));checkpoints.push(new Checkpoint(1240,198));}
    if(index===2){addGround(0,330);addGround(380,380);addGround(810,300);addGround(1160,390);platforms.push(new Platform(250,180,95,12));platforms.push(new Platform(520,150,80,12));platforms.push(new Platform(700,190,68,12));platforms.push(new Platform(985,165,96,12));hazards.push(new Hazard(330,224,50,12));hazards.push(new Hazard(760,224,50,12));hazards.push(new Hazard(1110,224,50,12));enemies.push(new Enemy('shield',455,207));enemies.push(new Enemy('bat',720,118));enemies.push(new Enemy('archer',930,207));enemies.push(new Enemy('crawler',1230,224));pickups.push(new Pickup('greatsword',1040,135));checkpoints.push(new Checkpoint(1370,198));}
    if(index===3){addGround(0,1320);platforms.push(new Platform(190,180,90,12));platforms.push(new Platform(520,165,100,12));platforms.push(new Platform(850,180,90,12));enemies.push(new Enemy('sword',330,207));enemies.push(new Enemy('runner',470,210));enemies.push(new Enemy('shield',650,207));enemies.push(new Enemy('archer',790,207));enemies.push(new Enemy('wolf',980,210));enemies.push(new Enemy('elite',1110,207));pickups.push(new Pickup('powerGuardBurst',1210,205));checkpoints.push(new Checkpoint(118,198));}
    if(index===4){addGround(0,260);addGround(325,280);addGround(665,260);addGround(990,250);addGround(1310,290);platforms.push(new Platform(180,180,72,12));platforms.push(new Platform(430,155,72,12,'moving',{range:38,speed:1.2}));platforms.push(new Platform(760,175,75,12,'falling'));platforms.push(new Platform(1090,150,85,12));hazards.push(new Hazard(260,224,65,12));hazards.push(new Hazard(605,224,60,12));hazards.push(new Hazard(925,224,65,12));hazards.push(new Hazard(1240,224,70,12));enemies.push(new Enemy('archer',450,207));enemies.push(new Enemy('wolf',720,210));enemies.push(new Enemy('elite',1050,207));enemies.push(new Enemy('bat',1160,110));pickups.push(new Pickup('spear',1125,120));checkpoints.push(new Checkpoint(1410,198));}
    if(index===5){addGround(0,340);addGround(390,300);addGround(745,300);addGround(1100,400);platforms.push(new Platform(210,172,90,12));platforms.push(new Platform(470,145,78,12));platforms.push(new Platform(820,170,90,12));platforms.push(new Platform(1010,135,70,12));hazards.push(new Hazard(340,224,50,12));hazards.push(new Hazard(690,224,55,12));hazards.push(new Hazard(1045,224,55,12));enemies.push(new Enemy('crawler',430,224));enemies.push(new Enemy('archer',640,207));enemies.push(new Enemy('shield',850,207));enemies.push(new Enemy('wolf',1210,210));enemies.push(new Enemy('elite',1320,207));pickups.push(new Pickup('powerEnergySlash',1030,105));checkpoints.push(new Checkpoint(1240,198));}
    if(index===6){addGround(0,260);addGround(310,360);addGround(720,300);addGround(1070,430);platforms.push(new Platform(190,165,80,12));platforms.push(new Platform(465,145,75,12));platforms.push(new Platform(815,155,82,12));platforms.push(new Platform(1010,120,75,12));hazards.push(new Hazard(260,224,50,12));hazards.push(new Hazard(670,224,50,12));hazards.push(new Hazard(1020,224,50,12));enemies.push(new Enemy('shield',390,207));enemies.push(new Enemy('bat',550,100));enemies.push(new Enemy('archer',810,207));enemies.push(new Enemy('elite',1160,207));enemies.push(new Enemy('wolf',1280,210));pickups.push(new Pickup('heal',880,125));pickups.push(new Pickup('spirit',1030,88));checkpoints.push(new Checkpoint(1360,198));}
    if(index===7){addGround(0,980);platforms.push(new Platform(130,175,90,12));platforms.push(new Platform(760,175,90,12));checkpoints.push(new Checkpoint(70,198));}
    return { index, ...meta, groundY, platforms, hazards, enemies, pickups, checkpoints };
  }

  class Game {
    constructor(){this.mode='title';this.levelIndex=0;this.level=makeLevel(0);this.player=new Player(45,190);this.enemies=this.level.enemies;this.boss=null;this.projectiles=[];this.shockwaves=[];this.particles=[];this.rings=[];this.afterimages=[];this.weaponArcs=[];this.camera={x:0};this.checkpoint={level:0,x:45,y:190};this.time=0;this.noticeText='';this.noticeTimer=0;this.score=0;this.backdrop=null;this.backdropKey='';this.shakeTime=0;this.shakeAmount=0;this.environmentPulse=0;this.introIndex=0;this.introTimer=0;this.endingTimer=0;this.lastFrame=performance.now();this.lastRender=0;this.running=true;}
    particleLimit(){return settings.reducedEffects||reducedMotion?CONFIG.reducedParticles:(coarsePointer?CONFIG.mobileParticles:CONFIG.desktopParticles);}
    burst(x,y,color,count=8){const allowed=Math.max(0,this.particleLimit()-this.particles.length),n=Math.min(count,allowed);for(let i=0;i<n;i++){const a=Math.random()*TAU,s=20+Math.random()*65;this.particles.push(new Particle(x,y,Math.cos(a)*s,Math.sin(a)*s-.3*s,.22+Math.random()*.35,color,1+Math.random()*2,30,Math.random()>.65?'diamond':'square'));}}
    ring(x,y,color,r=4,life=.35,speed=70,line=1.5){if(settings.reducedEffects&&this.rings.length>5)return;this.rings.push(new RingEffect(x,y,color,r,life,speed,line));}
    shake(time=.1,amount=2){if(!settings.screenShake||reducedMotion)return;this.shakeTime=Math.max(this.shakeTime,time);this.shakeAmount=Math.max(this.shakeAmount,amount);}
    notice(text,time=1.2){this.noticeText=text;this.noticeTimer=time;}
    invalidateBackdrop(){this.backdropKey='';}
    setLevel(index,spawnX=35,spawnY=190){this.levelIndex=clamp(index,0,7);this.level=makeLevel(this.levelIndex);this.enemies=this.level.enemies;this.projectiles=[];this.shockwaves=[];this.rings=[];this.afterimages=[];this.weaponArcs=[];this.player.x=spawnX;this.player.y=spawnY;this.player.vx=0;this.player.vy=0;this.player.onGround=false;this.player.onPlatform=null;this.player.attackTimer=0;this.player.attackCooldown=0;this.player.dashTimer=0;this.player.airDashing=false;this.player.airBurstUsed=false;this.player.invuln=.8;this.camera.x=clamp(spawnX-W*.42,0,Math.max(0,this.level.width-W));this.checkpoint={level:this.levelIndex,x:spawnX,y:spawnY};this.boss=this.levelIndex===7?new Boss(690,198):null;this.invalidateBackdrop();this.notice(t(this.level.name),1.7);audio.setMusic(this.levelIndex===7?'boss':this.levelIndex>=2?'ruins':'world');this.environmentPulse=.45;}
    start(){audio.unlock();this.player=new Player(35,190);this.score=0;this.mode='intro';this.introIndex=0;this.introTimer=0;ui.title.classList.add('hidden');ui.youtube.classList.add('hidden');this.setGameplayUI(false);audio.setMusic('world');}
    startLevel(){this.mode='playing';this.setLevel(0);this.setGameplayUI(true);}
    setGameplayUI(on){ui.mobileControls.classList.toggle('gameplay',on);ui.pauseTouch.classList.toggle('gameplay',on);ui.inventoryTouch.classList.toggle('gameplay',on);ui.mobileControls.setAttribute('aria-hidden',String(!on));}
    pause(){if(this.mode!=='playing')return;this.mode='paused';ui.pause.classList.remove('hidden');this.setGameplayUI(false);input.clear();}
    resume(){if(this.mode!=='paused')return;this.mode='playing';ui.pause.classList.add('hidden');this.setGameplayUI(true);input.clear();}
    openInventory(){if(this.mode!=='playing')return;this.mode='inventory';this.refreshInventory();ui.inventory.classList.remove('hidden');this.setGameplayUI(false);input.clear();}
    closeInventory(){if(this.mode!=='inventory')return;ui.inventory.classList.add('hidden');this.mode='playing';this.setGameplayUI(true);input.clear();}
    refreshInventory(){renderInventory();}
    die(){if(this.mode!=='playing')return;this.mode='dead';this.setGameplayUI(false);this.noticeText=t('tryAgain');this.noticeTimer=99;setTimeout(()=>{if(this.mode==='dead')this.restartCheckpoint();},900);}
    restartCheckpoint(){const cp=this.checkpoint;this.player.hp=this.player.maxHp;this.player.spirit=Math.max(this.player.spirit,55);this.setLevel(cp.level,cp.x,cp.y);this.checkpoint=cp;this.mode='playing';ui.pause.classList.add('hidden');this.setGameplayUI(true);}
    quit(){this.mode='title';ui.pause.classList.add('hidden');ui.inventory.classList.add('hidden');ui.title.classList.remove('hidden');ui.youtube.classList.add('hidden');this.setGameplayUI(false);audio.setMusic('title');input.clear();}
    obtain(type){audio.sfx('pickup');if(type==='heal'){this.player.heals=Math.min(5,this.player.heals+1);this.notice(t('healing'),1.1);this.burst(this.player.x+9,this.player.y+8,C.magenta,12);}else if(type==='spirit'){this.player.spirit=Math.min(this.player.maxSpirit,this.player.spirit+45);this.notice(t('spirit'),1.1);this.burst(this.player.x+9,this.player.y+8,C.cyan,12);}else if(type==='greatsword'){this.player.unlocked.greatsword=true;this.player.weapon='greatsword';this.notice(`${t('weaponUnlocked')}: ${t('greatswordName')}`,1.6);this.burst(this.player.x+9,this.player.y+8,C.orange,18);}else if(type==='spear'){this.player.unlocked.spear=true;this.player.weapon='spear';this.notice(`${t('weaponUnlocked')}: ${t('spearName')}`,1.6);this.burst(this.player.x+9,this.player.y+8,C.orange,18);}else if(type==='powerAirBurst'){this.player.unlocked.airBurst=true;this.notice(`${t('powerUnlocked')}: ${t('airBurst')}`,1.6);this.burst(this.player.x+9,this.player.y+8,C.cyan,18);}else if(type==='powerGuardBurst'){this.player.unlocked.guardBurst=true;this.notice(`${t('powerUnlocked')}: ${t('guardBurst')}`,1.6);this.burst(this.player.x+9,this.player.y+8,C.violet,18);}else if(type==='powerEnergySlash'){this.player.unlocked.energySlash=true;this.notice(`${t('powerUnlocked')}: ${t('energySlash')}`,1.6);this.burst(this.player.x+9,this.player.y+8,C.cyan,18);}this.refreshInventory();}
    moveEntity(e,dt){const prevX=e.x,prevY=e.y;e.x=clamp(e.x+e.vx*dt,0,this.level.width-e.w);for(const p of this.level.platforms){if(p.oneWay)continue;if(rectsOverlap(e,p)){if(e.vx>0)e.x=p.x-e.w;else if(e.vx<0)e.x=p.x+p.w;e.vx=0;}}e.y+=e.vy*dt;e.onGround=false;e.onPlatform=null;for(const p of this.level.platforms){const fallingDown=e.vy>=0;const prevBottom=prevY+e.h;const currBottom=e.y+e.h;const withinX=e.x+e.w>p.x+1&&e.x<p.x+p.w-1;if(p.oneWay){if(fallingDown&&withinX&&prevBottom<=p.y+4&&currBottom>=p.y){e.y=p.y-e.h;e.vy=0;e.onGround=true;e.onPlatform=p;}}else if(rectsOverlap(e,p)){if(fallingDown&&prevBottom<=p.y+8){e.y=p.y-e.h;e.vy=0;e.onGround=true;e.onPlatform=p;}else if(e.vy<0&&prevY>=p.y+p.h-4){e.y=p.y+p.h;e.vy=0;}else{e.x=prevX;e.vx=0;}}}
    }
    startEnding(){this.mode='ending';this.endingTimer=0;this.setGameplayUI(false);audio.setMusic('ending');}
    update(dt){this.time+=dt;if(this.noticeTimer>0)this.noticeTimer-=dt;if(this.environmentPulse>0)this.environmentPulse=Math.max(0,this.environmentPulse-dt*1.5);if(this.shakeTime>0)this.shakeTime-=dt;
      if(this.mode==='intro'){this.introTimer+=dt;if(input.pauseTap()){this.startLevel();return;}if(input.confirmTap()||this.introTimer>3.2){this.introTimer=0;this.introIndex++;if(this.introIndex>=t('prologue').length)this.startLevel();}return;}
      if(this.mode==='ending'){this.endingTimer+=dt;if(this.endingTimer>7||input.confirmTap()){this.mode='credits';this.endingTimer=0;ui.youtube.classList.remove('hidden');}return;}
      if(this.mode==='credits'){if(input.confirmTap()){ui.youtube.classList.add('hidden');this.quit();}return;}
      if(this.mode!=='playing')return;
      if(!ui.modal.classList.contains('hidden'))return;
      if(input.pauseTap()){this.pause();return;}if(input.inventoryTap()){this.openInventory();return;}
      this.level.platforms.forEach(p=>p.update(dt,this.player));this.player.update(dt,this);if(this.mode!=='playing')return;for(const cp of this.level.checkpoints)cp.update(this.player,this);for(const p of this.level.pickups)p.update(dt,this);for(const e of this.enemies)e.update(dt,this);if(this.boss)this.boss.update(dt,this);
      for(const h of this.level.hazards){const feet={x:this.player.x+2,y:this.player.y+this.player.h-5,w:this.player.w-4,h:6};if(rectsOverlap(feet,h))this.player.damage(1,h.x+h.w/2,true,this);}
      for(const pr of this.projectiles){if(pr.owner==='player'){pr.life-=dt;pr.x+=pr.vx*dt;pr.y+=pr.vy*dt;if(pr.life<=0){pr.dead=true;continue;}for(const e of this.enemies){if(!e.dead&&rectsOverlap(pr,e.bodyBox)){e.damage(1,this,pr.x);pr.dead=true;break;}}if(this.boss&&!this.boss.dead&&rectsOverlap(pr,this.boss)){this.boss.damage(1,this,pr.x);pr.dead=true;}}else pr.update(dt,this);}this.projectiles=this.projectiles.filter(p=>!p.dead);
      for(const s of this.shockwaves){s.life-=dt;s.x+=s.vx*dt;if(s.life<=0)s.dead=true;const feet={x:this.player.x+2,y:this.player.y+this.player.h-6,w:this.player.w-4,h:6};if(!s.dead&&rectsOverlap(s,feet)){this.player.damage(1,s.x,true,this);s.dead=true;}}this.shockwaves=this.shockwaves.filter(s=>!s.dead);
      this.particles.forEach(p=>p.update(dt));this.particles=this.particles.filter(p=>p.life>0);this.rings.forEach(r=>r.update(dt));this.rings=this.rings.filter(r=>r.life>0);this.afterimages.forEach(a=>a.life-=dt);this.afterimages=this.afterimages.filter(a=>a.life>0);this.weaponArcs.forEach(a=>a.life-=dt);this.weaponArcs=this.weaponArcs.filter(a=>a.life>0);
      const target=clamp(this.player.x-W*.42,0,Math.max(0,this.level.width-W));this.camera.x=lerp(this.camera.x,target,1-Math.pow(.0008,dt));
      if(this.levelIndex<7&&this.player.x>this.level.width-36){this.setLevel(this.levelIndex+1,30,190);}
    }
    draw(){ctx.setTransform(RENDER_SCALE,0,0,RENDER_SCALE,0,0);let sx=0,sy=0;if(this.shakeTime>0){sx=(Math.random()*2-1)*this.shakeAmount;sy=(Math.random()*2-1)*this.shakeAmount;}ctx.save();ctx.translate(sx,sy);drawBackdrop(this);if(this.mode==='intro'){drawIntro(this);ctx.restore();return;}if(this.mode==='ending'||this.mode==='credits'){drawWorld(this);drawEnding(this);ctx.restore();return;}if(this.mode==='title'){ctx.restore();return;}drawWorld(this);ctx.restore();}
  }

  function areaPalette(index){const p=[
    {a:C.cyan,b:C.violet,fill:'#15375e'}, {a:C.teal,b:C.cyan,fill:'#0d5f62'}, {a:C.violet,b:C.cyan,fill:'#362b72'}, {a:C.magenta,b:C.cyan,fill:'#6a235f'},
    {a:C.danger,b:C.violet,fill:'#56163c'}, {a:C.violet,b:C.cyan,fill:'#23245b'}, {a:C.cyanHi,b:C.violet,fill:'#214e78'}, {a:C.violet,b:C.magenta,fill:'#3b276f'}
  ];return p[index]||p[0];}

  function ensureBackdrop(game){const key=`${game.levelIndex}:${W}:${H}:${settings.reducedEffects}`;if(game.backdropKey===key&&game.backdrop)return;const o=document.createElement('canvas');o.width=Math.round(W*RENDER_SCALE);o.height=Math.round(H*RENDER_SCALE);const c=o.getContext('2d');c.setTransform(RENDER_SCALE,0,0,RENDER_SCALE,0,0);const pal=areaPalette(game.levelIndex);const grad=c.createLinearGradient(0,0,0,H);grad.addColorStop(0,game.levelIndex===5?'#090823':C.bgDeep);grad.addColorStop(.58,'#211039');grad.addColorStop(1,'#071325');c.fillStyle=grad;c.fillRect(0,0,W,H);
    const rg=c.createRadialGradient(W*.72,H*.45,5,W*.72,H*.45,W*.5);rg.addColorStop(0,hexAlpha(pal.b,.14));rg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=rg;c.fillRect(0,0,W,H);
    drawGrid(c,pal.a,game.levelIndex===0?.065:.06);drawDistantArchitecture(c,game.levelIndex,pal);if(!settings.reducedEffects){for(let i=0;i<(coarsePointer?18:28);i++){const x=(i*83%W)+((i*19)%17),y=20+(i*47%(H-80));c.fillStyle=i%3===0?hexAlpha(pal.b,.35):'rgba(235,245,255,.24)';c.fillRect(x,y,1,1);}}
    game.backdrop=o;game.backdropKey=key;
  }

  function drawBackdrop(game){ensureBackdrop(game);ctx.drawImage(game.backdrop,0,0,canvas.width,canvas.height,0,0,W,H);if(game.environmentPulse>0){const pal=areaPalette(game.levelIndex);ctx.globalAlpha=game.environmentPulse*.07;ctx.fillStyle=pal.a;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}const pal=areaPalette(game.levelIndex);const offset=-(game.camera.x*.08)%44;ctx.globalAlpha=.05;ctx.strokeStyle=pal.b;ctx.lineWidth=.7;for(let x=offset;x<W;x+=44){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}ctx.globalAlpha=1;}

  function drawGrid(c,color,alpha){c.globalAlpha=alpha;c.strokeStyle=color;c.lineWidth=.6;for(let x=0;x<W;x+=22){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}for(let y=0;y<H;y+=22){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}c.globalAlpha=alpha*1.3;c.lineWidth=.85;for(let x=0;x<W;x+=88){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}for(let y=0;y<H;y+=88){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}c.globalAlpha=1;}

  function drawDistantArchitecture(c,index,pal){const base=218;c.globalAlpha=.18;c.fillStyle=pal.fill;c.fillRect(0,base,W,H-base);c.globalAlpha=.26;c.strokeStyle=pal.a;c.lineWidth=.8;const castleX=W*.62;drawCastle(c,castleX,base-34,150,42,pal.a,index===5||index===7);c.globalAlpha=.1;c.strokeStyle=pal.b;c.lineWidth=1;c.beginPath();c.arc(W*.55,H*.53,90,Math.PI,TAU);c.stroke();c.beginPath();c.arc(W*.55,H*.53,76,Math.PI,TAU);c.stroke();if(index===2||index===6||index===7){for(let i=0;i<3;i++)drawArch(c,45+i*105,base-75,70,75,pal.a);}if(index===1){for(let i=0;i<7;i++){const x=40+i*80;c.beginPath();c.moveTo(x,base);c.lineTo(x+18,base-70-(i%2)*12);c.lineTo(x+34,base);c.stroke();}}c.globalAlpha=1;}

  function drawCastle(c,x,ground,w,h,color,strong=false){c.save();c.translate(x-w/2,ground-h);c.fillStyle=strong?'rgba(77,44,117,.24)':'rgba(52,36,95,.18)';c.strokeStyle=color;c.lineWidth=strong?1.1:.75;const towerW=w*.24;c.fillRect(0,0,towerW,h);c.strokeRect(0,0,towerW,h);c.fillRect(w-towerW,6,towerW,h-6);c.strokeRect(w-towerW,6,towerW,h-6);c.fillRect(towerW-4,16,w-towerW*2+8,h-16);c.strokeRect(towerW-4,16,w-towerW*2+8,h-16);for(const tx of [0,w-towerW]){for(let i=0;i<3;i++){c.strokeRect(tx+i*(towerW/3),-5,towerW/3-2,7);}}for(let i=0;i<3;i++){c.fillStyle='rgba(255,88,200,.18)';c.fillRect(10+i*15,18,5,9);}c.restore();}

  function drawArch(c,x,y,w,h,color){c.save();c.translate(x,y);c.strokeStyle=color;c.beginPath();c.moveTo(0,h);c.lineTo(0,h*.45);c.bezierCurveTo(0,0,w,0,w,h*.45);c.lineTo(w,h);c.stroke();c.restore();}

  function drawWorld(game){const cx=game.camera.x,pal=areaPalette(game.levelIndex);drawNearArchitecture(ctx,game,cx,pal);for(const p of game.level.platforms)p.draw(ctx,cx,0,pal);for(const h of game.level.hazards)h.draw(ctx,cx,0);for(const cp of game.level.checkpoints)cp.draw(ctx,cx,0,game.time);for(const p of game.level.pickups)p.draw(ctx,cx,0);for(const a of game.afterimages)game.player.draw(ctx,cx,0,game.time,(a.life/a.max)*.18,a.x,a.y,a.facing);for(const e of game.enemies)e.draw(ctx,cx,0,game.time);if(game.boss)game.boss.draw(ctx,cx,0,game.time);for(const pr of game.projectiles)pr.draw(ctx,cx,0);for(const s of game.shockwaves)drawShockwave(ctx,s,cx);for(const arc of game.weaponArcs)drawWeaponArc(ctx,arc,cx);game.player.draw(ctx,cx,0,game.time);for(const p of game.particles)p.draw(ctx,cx,0);for(const r of game.rings)r.draw(ctx,cx,0);drawHUD(ctx,game,pal);if(game.noticeTimer>0)drawNotice(ctx,game.noticeText,game.noticeTimer);}

  function drawNearArchitecture(c,game,cx,pal){const index=game.levelIndex;const q=(x)=>x-cx;c.globalAlpha=.13;c.fillStyle=pal.fill;const spacing=240;for(let wx=Math.floor(cx/spacing)*spacing-120;wx<cx+W+spacing;wx+=spacing){const x=q(wx),kind=((wx/spacing|0)+index)%3;if(kind===0){c.fillRect(x,90,22,146);c.strokeStyle=pal.a;c.strokeRect(x,90,22,146);for(let j=0;j<3;j++)c.strokeRect(x+j*7,84,6,7);}else if(kind===1){c.strokeStyle=pal.a;drawArch(c,x,145,70,91,pal.a);}else{c.beginPath();c.arc(x+40,170,52,Math.PI,TAU);c.strokeStyle=pal.b;c.stroke();}}c.globalAlpha=1;}

  function drawShockwave(c,s,cx){const a=clamp(s.life/.22,0,1),x=s.x-cx;c.save();c.globalAlpha=.85*a;c.fillStyle='rgba(255,159,92,.22)';c.strokeStyle=C.orange;c.lineWidth=1.4;c.beginPath();c.moveTo(x,s.y+s.h);c.lineTo(x+s.w*.35,s.y+2);c.lineTo(x+s.w*.60,s.y+s.h*.45);c.lineTo(x+s.w*.78,s.y);c.lineTo(x+s.w,s.y+s.h);c.closePath();c.fill();c.stroke();c.restore();}

  function drawWeaponArc(c,a,cx){const p=1-a.life/a.max,x=a.x-cx,y=a.y;c.globalAlpha=(1-p)*.7;c.strokeStyle=a.color;c.lineWidth=2;c.beginPath();const start=a.dir>0?-.8*Math.PI:-.2*Math.PI,end=a.dir>0?.2*Math.PI:-1.2*Math.PI;c.arc(x,y,a.reach*.72,start,end,a.dir<0);c.stroke();c.globalAlpha=1;}

  function drawHUD(c,game,pal){const p=game.player;c.save();c.textBaseline='top';for(let i=0;i<p.maxHp;i++)drawHeart(c,18+i*20,16,i<p.hp);drawWeaponIcon(c,20,48,p.weapon);drawBottleIcon(c,50,48,p.heals);const barX=83,barY=51,barW=96;c.fillStyle='rgba(5,5,18,.72)';c.fillRect(barX,barY,barW,7);c.strokeStyle=hexAlpha(C.cyan,.6);c.strokeRect(barX+.5,barY+.5,barW-1,6);c.fillStyle=C.cyan;c.fillRect(barX+1,barY+1,(barW-2)*(p.spirit/p.maxSpirit),5);c.fillStyle=C.white;c.font='9px monospace';c.fillText('SPIRIT',barX,barY-11);c.textAlign='right';c.font='11px monospace';c.fillStyle=C.white;c.fillText(`LEVEL ${game.levelIndex+1}: ${t(game.level.name)}`,W-16,17);c.fillStyle=pal.a;c.font='9px monospace';c.fillText(`SCORE ${String(game.score).padStart(5,'0')}`,W-16,32);c.textAlign='left';if(game.boss&&!game.boss.dead){const b=game.boss,bw=Math.min(290,W*.5),bx=(W-bw)/2,by=18;c.fillStyle='rgba(4,4,14,.8)';c.fillRect(bx,by,bw,20);c.strokeStyle=b.color;c.strokeRect(bx+.5,by+.5,bw-1,19);c.fillStyle=b.color;c.fillRect(bx+2,by+14,(bw-4)*(b.hp/b.maxHp),4);c.textAlign='center';c.fillStyle=C.white;c.font='10px monospace';c.fillText(`${t('bossName')} — ${t(`bossPhase${b.phase}`)}`,W/2,by+3);c.textAlign='left';for(let i=1;i<=3;i++){c.fillStyle=i<=b.phase?b.color:'rgba(100,90,130,.35)';c.fillRect(W/2-20+(i-1)*16,by+23,8,3);}}c.restore();}

  function drawHeart(c,x,y,full){c.save();c.translate(x,y);c.fillStyle=full?C.magenta:'rgba(63,36,78,.7)';c.strokeStyle=full?C.pink:'#49325e';c.lineWidth=1;c.beginPath();c.moveTo(0,3);c.bezierCurveTo(0,-2,7,-4,9,1);c.bezierCurveTo(11,-4,18,-2,18,3);c.bezierCurveTo(18,8,9,14,9,14);c.bezierCurveTo(9,14,0,8,0,3);c.fill();c.stroke();c.restore();}
  function drawWeaponIcon(c,x,y,weapon){c.save();c.translate(x,y);c.strokeStyle=weapon==='greatsword'?C.orange:C.cyan;c.lineWidth=1.3;c.beginPath();c.moveTo(3,15);c.lineTo(14,3);c.stroke();c.beginPath();c.moveTo(3,12);c.lineTo(7,16);c.stroke();c.fillStyle=C.white;c.font='7px monospace';c.fillText(weapon==='greatsword'?'GS':weapon==='spear'?'SP':'SW',19,7);c.restore();}
  function drawBottleIcon(c,x,y,count){c.save();c.translate(x,y);c.strokeStyle=C.magenta;c.strokeRect(0,5,11,12);c.strokeRect(3,1,5,4);c.fillStyle=C.magenta;c.globalAlpha=.3;c.fillRect(2,11,7,5);c.globalAlpha=1;c.fillStyle=C.white;c.font='9px monospace';c.fillText(`×${count}`,15,7);c.restore();}
  function drawNotice(c,text,timer){const a=clamp(Math.min(timer,1)*2,0,1);c.globalAlpha=a;c.textAlign='center';c.fillStyle='rgba(4,4,14,.76)';c.fillRect(W/2-118,H-51,236,24);c.strokeStyle=hexAlpha(C.magenta,.45);c.strokeRect(W/2-117.5,H-50.5,235,23);c.fillStyle=C.white;c.font='10px monospace';c.fillText(text,W/2,H-43);c.textAlign='left';c.globalAlpha=1;}

  function drawIntro(game){ctx.fillStyle='rgba(3,4,13,.78)';ctx.fillRect(0,0,W,H);const lines=t('prologue'),text=lines[clamp(game.introIndex,0,lines.length-1)];ctx.textAlign='center';ctx.fillStyle=C.magenta;ctx.font='10px monospace';ctx.fillText('KNIGHTS OF THE RENAISSANCE',W/2,58);ctx.fillStyle=C.white;ctx.font='14px monospace';wrapText(ctx,text,W/2,105,Math.min(520,W-80),22);ctx.fillStyle=C.muted;ctx.font='9px monospace';ctx.fillText(`${game.introIndex+1} / ${lines.length}   •   ENTER / SPACE · ESC: SKIP`,W/2,H-42);ctx.textAlign='left';}
  function drawEnding(game){ctx.fillStyle='rgba(3,4,13,.76)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle=C.cyanHi;ctx.font='bold 18px monospace';if(game.mode==='ending'){ctx.fillText(t('trainingComplete'),W/2,105);ctx.fillStyle=C.magenta;ctx.font='11px monospace';ctx.fillText(t('continues'),W/2,142);}else{ctx.fillText(t('thankYou'),W/2,95);ctx.fillStyle=C.magenta;ctx.font='11px monospace';ctx.fillText('VIGU STUDIO',W/2,128);ctx.fillStyle=C.muted;ctx.fillText('ENTER / SPACE',W/2,172);}ctx.textAlign='left';}
  function wrapText(c,text,x,y,maxWidth,lineHeight){const words=text.split(' '),lines=[];let line='';for(const w of words){const test=line?`${line} ${w}`:w;if(c.measureText(test).width>maxWidth&&line){lines.push(line);line=w;}else line=test;}if(line)lines.push(line);lines.forEach((l,i)=>c.fillText(l,x,y+i*lineHeight));}

  function hexAlpha(hex,a){const h=hex.replace('#','');const full=h.length===3?h.split('').map(c=>c+c).join(''):h;const n=parseInt(full,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;}

  // Shared whip geometry drives both visible beads and combat collision.
  function whipPose(p,offset=0){
    const u=clamp(1-(p.attackTimer+offset)/p.weaponStats().duration,0,1);
    const smooth=v=>{v=clamp(v,0,1);return v*v*(3-2*v);};
    // Raise vertically, snap down across the enemy, then recover.
    const sweep=smooth((u-.20)/.43),recover=smooth((u-.76)/.24);
    return {u,sweep,recover,angle:-Math.PI*.55+sweep*Math.PI*.60,
      handX:6+8*sweep,handY:-15+14*sweep};
  }
  function playerBob(p){return p.onGround?Math.abs(Math.sin(p.anim*2))*.7:0;}
  function whipGrip(p,offset=0){const pose=whipPose(p,offset);return {x:lerp(pose.handX,10,pose.recover),y:lerp(pose.handY,4,pose.recover)};}
  function whipPoints(p,offset=0){
    if(p.attackTimer<=0||p.blocking)return [];
    const st=p.weaponStats(),pose=whipPose(p,offset),grip=whipGrip(p,offset),pts=[];
    const length=st.reach*(.70+.30*Math.sin(Math.min(1,pose.u/.60)*Math.PI/2))*(1-pose.recover);
    for(let i=0;i<=32;i++){
      const q=i/32,lag=Math.sin(q*Math.PI)*.32*(1-pose.sweep),angle=pose.angle-lag;
      const dx=grip.x+Math.cos(angle)*q*length;
      const dy=grip.y+Math.sin(angle)*q*length+Math.sin(q*Math.PI)*5*Math.sin(pose.u*Math.PI)*(1-pose.recover);
      pts.push({x:p.x+9+p.facing*dx,y:p.y+14-playerBob(p)+dy,r:(2.25-q*1.35)*(1-pose.recover*.7)});
    }return pts;
  }
  const groundPower=Player.prototype.usePower;
  Player.prototype.usePower=function(g){
    if(!this.onGround&&!this.blocking){
      if(this.airBurstUsed)return;
      this.airBurstUsed=true;this.coyote=0;this.jumpBuffer=0;
      this.facing=input.moveX()||this.facing;this.vy=-210;this.vx=this.facing*265;
      this.dashTimer=.19;this.dashCooldown=.35;this.airDashing=true;this.trailTimer=0;
      g.ring(this.x+9,this.y+22,C.cyan,4,.26,85);g.burst(this.x+9,this.y+22,C.cyan,10);audio.sfx('power');return;
    }
    this.airDashing=false;groundPower.call(this,g);
  };
  Player.prototype.weaponStats=function(){return this.weapon==='greatsword'?{reach:77,damage:2,duration:.52,cooldown:.54}:this.weapon==='spear'?{reach:102,damage:1,duration:.42,cooldown:.44}:{reach:82,damage:1,duration:.46,cooldown:.48};};
  Player.prototype.attack=function(g){if(this.attackCooldown>0||this.blocking||this.dashTimer>0)return;const s=this.weaponStats();this.attackTimer=s.duration;this.attackCooldown=s.cooldown;this.attackId++;audio.sfx('sword');};
  function bead(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  function limb(c,points,color,width=3){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke();points.forEach(p=>bead(c,p[0],p[1],width*.6,color));}
  Player.prototype.draw=function(c,cx,cy,time,alpha=1,xOverride=null,yOverride=null,facingOverride=null){
    const x=(xOverride??this.x)-cx,y=(yOverride??this.y)-cy,f=facingOverride??this.facing;
    c.save();c.globalAlpha=alpha;c.translate(x+9,y+14);c.scale(f,1);
    const col=this.invuln>0&&Math.floor(this.invuln*18)%2===0?C.white:C.magenta;
    const run=this.onGround?Math.sin(this.anim*2)*4:0,bob=playerBob(this);
    c.translate(0,-bob);
    // Glow only on the small body, never on the entire scene.
    if(!settings.reducedEffects){c.shadowColor=col;c.shadowBlur=9;}
    c.fillStyle=col;c.beginPath();c.roundRect(-4.5,-5,9,10,1.7);c.fill();
    c.fillRect(-5,-15,10,9);c.fillRect(-3,-17,6,2);c.shadowBlur=0;
    c.fillStyle='#69244f';c.fillRect(0,-12,4,2);c.fillRect(2,-10,2,4);c.fillStyle=C.pink;c.fillRect(-3,-14,3,1);
    const air=!this.onGround;
    limb(c,[[-2,6],[-3-run,9],[air?-9:-3-run*1.5,air?12:14]],col,2.8);
    limb(c,[[3,6],[4+run,air?5:10],[air?7:4+run*1.5,air?9:14]],col,2.8);
    limb(c,[[-5,-3],[-9,-1-run*.3],[-11,3-run*.3]],col,2.6);
    const grip=this.attackTimer>0?whipGrip(this):{x:10,y:4};limb(c,[[5,-3],[grip.x*.65,grip.y*.6],[grip.x,grip.y]],col,2.8);
    if(this.blocking){c.strokeStyle=C.cyan;c.lineWidth=1.5;c.beginPath();c.ellipse(13,0,4,12,0,-1.4,1.4);c.stroke();}
    c.restore();
    if(alpha===1&&this.attackTimer>0&&!this.blocking){const pts=whipPoints(this),color=this.weapon==='greatsword'?C.orange:this.weapon==='spear'?C.cyan:C.magenta;c.save();
      if(this.attackTimer>0&&!settings.reducedEffects){c.strokeStyle=hexAlpha(color,.16);c.lineWidth=5;c.beginPath();pts.forEach((q,i)=>i?c.lineTo(q.x-cx,q.y-cy):c.moveTo(q.x-cx,q.y-cy));c.stroke();}
      for(let i=0;i<pts.length;i++){const q=pts[i];bead(c,q.x-cx,q.y-cy,q.r,color);}c.restore();}
  };
  const oldEnemyDraw=Enemy.prototype.draw;
  Enemy.prototype.draw=function(c,cx,cy,time){
    if(this.x+this.w<cx-30||this.x>cx+W+30||this.dead)return;
    const x=this.x+this.w/2-cx,y=this.y+this.h/2-cy,co=this.hitFlash>0?C.white:this.type==='elite'?C.orange:C.violet;
    c.save();c.translate(x,y);c.scale(this.facing,1);c.strokeStyle=co;c.fillStyle='#512980';c.lineWidth=1;
    if(this.type==='bat'){
      const flap=Math.sin(time*13+this.phase)*5;
      for(const d of [-1,1]){c.beginPath();c.moveTo(d*3,-2);c.lineTo(d*9,-7-flap);c.lineTo(d*15,-7-flap);c.lineTo(d*15,0-flap*.4);c.lineTo(d*9,0);c.lineTo(d*8,5);c.lineTo(d*3,4);c.closePath();c.fill();c.stroke();}
      c.fillStyle=co;c.fillRect(-4,-4,8,11);c.beginPath();c.moveTo(-4,-4);c.lineTo(-4,-8);c.lineTo(0,-4);c.lineTo(4,-8);c.lineTo(4,-4);c.fill();bead(c,0,0,1.7,C.cyanHi);
    }else if(this.type==='wolf'||this.type==='crawler'){
      c.fillStyle=co;c.beginPath();c.moveTo(-10,-3);c.lineTo(3,-6);c.lineTo(9,-3);c.lineTo(12,2);c.lineTo(6,4);c.lineTo(-8,4);c.closePath();c.fill();
      for(let i=0;i<4;i++){const sx=-7+i*4,w=Math.sin(time*13+i*2)*2;limb(c,[[sx,3],[sx+w,7],[sx+w+2,8]],co,1.5);}bead(c,7,-1,1.3,C.pink);
    }else{
      const walk=Math.sin(time*10)*Math.min(3,Math.abs(this.vx)/12);
      c.fillStyle=co;c.fillRect(-5,-5,10,12);c.fillRect(-4,-14,9,8);c.fillStyle='#231731';c.fillRect(-2,-11,7,2);bead(c,3,-10,1,C.danger);
      limb(c,[[-3,7],[-4-walk,12],[-2-walk,13]],co,2.4);limb(c,[[3,7],[4+walk,12],[6+walk,13]],co,2.4);
      limb(c,[[5,-3],[9,0],[12,this.attackTimer>0?-6:4]],co,2);
      if(this.type==='archer'){c.strokeStyle=C.pink;c.beginPath();c.arc(10,-1,8,-Math.PI/2,Math.PI/2);c.closePath();c.stroke();}
      else if(this.type==='shield'){c.fillStyle='#29385a';c.strokeStyle=C.cyan;c.beginPath();c.moveTo(8,-5);c.lineTo(15,-3);c.lineTo(14,7);c.lineTo(10,10);c.closePath();c.fill();c.stroke();}
      else{neonLine(c,11,3,17,this.attackTimer>0?-15:-5,C.pink,1,.2);}
      if(this.attackTimer>.16||this.telegraph>0){c.fillStyle=C.orange;c.font='bold 10px monospace';c.fillText('!',-3,-20);}
    }c.restore();
    if(this.hp<this.maxHp){c.fillStyle='#281d3b';c.fillRect(x-9,y-this.h/2-5,18,2);c.fillStyle=co;c.fillRect(x-9,y-this.h/2-5,18*this.hp/this.maxHp,2);}
  };
  Platform.prototype.draw=function(c,cx,cy,theme){
    const x=this.x-cx,y=this.y-cy;if(x+this.w<0||x>W||y>H+40)return;
    const edge=this.type==='moving'?C.violet:this.type==='falling'?C.danger:'#79b9f5';
    c.fillStyle='#101026';c.fillRect(x,y,this.w,this.h);c.strokeStyle='#514174';c.lineWidth=.7;
    const left=Math.max(0,Math.floor((cx-this.x)/16)*16);
    for(let j=0;j<this.h;j+=14)for(let i=left;i<this.w&&x+i<W;i+=16)c.strokeRect(x+i+.5,y+j+.5,Math.min(16,this.w-i)-1,Math.min(14,this.h-j)-1);
    neonLine(c,x,y,x+this.w,y,edge,.9,.22);c.strokeStyle=edge;c.lineWidth=.7;c.strokeRect(x+.3,y+.3,this.w-.6,4.5);
    for(let i=16;i<this.w&&x+i<W;i+=16){if(x+i<0)continue;c.beginPath();c.moveTo(x+i,y);c.lineTo(x+i,y+5);c.stroke();}
  };
  // Static arcade masonry tiles, cached once and culled by viewport.
  const arcade=document.createElement('canvas');arcade.width=384;arcade.height=180;
  {const c=arcade.getContext('2d');c.scale(2,2);c.fillStyle='#0e0b23';c.fillRect(0,0,192,90);
    for(let k=0;k<3;k++){const x=k*64;c.save();c.globalCompositeOperation='destination-out';c.beginPath();c.moveTo(x+8,90);c.lineTo(x+8,44);c.arc(x+32,44,24,Math.PI,0);c.lineTo(x+56,90);c.closePath();c.fill();c.restore();c.strokeStyle='#604387';c.lineWidth=.8;c.beginPath();c.moveTo(x+8,90);c.lineTo(x+8,44);c.arc(x+32,44,24,Math.PI,0);c.lineTo(x+56,90);c.stroke();c.fillStyle='#25203b';c.fillRect(x+3,49,10,3);c.fillRect(x+52,49,10,3);c.strokeRect(x+3,49,10,3);c.strokeRect(x+52,49,10,3);c.strokeStyle='#514075';c.beginPath();c.moveTo(x+4,61);c.lineTo(x+8,67);c.lineTo(x+4,70);c.lineTo(x+10,77);c.stroke();}
  }
  drawNearArchitecture=function(c,g,cx,pal){
    for(const p of g.level.platforms){if(p.h<=14&&p.type!=='moving'&&p.type!=='falling'&&p.w>=75){c.save();c.beginPath();c.rect(p.x-cx,p.y+p.h,p.w,90);c.clip();for(let i=0;i<p.w;i+=192)c.drawImage(arcade,p.x-cx+i,p.y+p.h,192,90);c.restore();}}
    for(let wx=Math.floor(cx/280)*280;wx<cx+W;wx+=280){const x=wx-cx+28,y=151;
      c.fillStyle='#231934';c.fillRect(x-1,y+7,3,14);c.strokeStyle='#74bbeb';c.strokeRect(x-4,y+4,8,6);
      bead(c,x,y,2.5+Math.sin(g.time*8+wx)*.4,C.pink);
      if(!settings.reducedEffects){c.fillStyle='rgba(255,88,200,.065)';c.beginPath();c.arc(x,y,17,0,TAU);c.fill();}
    }
    const ex=g.level.width-26-cx;if(ex<W&&ex>-30&&g.levelIndex<7){c.strokeStyle=C.cyan;c.lineWidth=1.5;c.strokeRect(ex,190,18,46);c.fillStyle='rgba(101,230,255,.16)';c.fillRect(ex+2,192,14,42);c.fillStyle=C.cyanHi;c.font='12px monospace';c.fillText('›',ex+5,215);}
  };
  const oldDistant=drawDistantArchitecture;
  drawDistantArchitecture=function(c,index,pal){
    c.save();const glow=c.createRadialGradient(W*.79,230,3,W*.79,230,150);glow.addColorStop(0,'rgba(156,91,241,.5)');glow.addColorStop(1,'rgba(116,49,195,0)');c.fillStyle=glow;c.fillRect(0,0,W,H);
    c.strokeStyle='rgba(237,113,207,.23)';c.lineWidth=1.5;c.beginPath();c.ellipse(W*.57,147,108,116,0,0,TAU);c.stroke();c.lineWidth=.6;c.beginPath();c.ellipse(W*.57,147,103,110,0,0,TAU);c.stroke();
    c.fillStyle='#623b86';for(let i=0;i<6;i++){let x=W*.68+i*27,y=155+(i%3)*16;c.fillRect(x,y,22,H-y);for(let j=0;j<3;j++)c.fillRect(x+j*8,y-4,5,5);c.fillStyle='#27162f';c.fillRect(x+8,y+14,4,7);c.fillStyle='#623b86';}c.restore();
  };
  drawWeaponIcon=function(c,x,y,weapon){c.save();c.strokeStyle=weapon==='greatsword'?C.orange:C.cyan;c.lineWidth=1.5;c.beginPath();c.moveTo(x,y+14);c.bezierCurveTo(x+19,y+10,x-2,y-2,x+14,y+3);c.stroke();c.restore();};
  const makeOriginalLevel=makeLevel;
  makeLevel=function(index){const l=makeOriginalLevel(index);if(index===0){
    l.platforms=[new Platform(0,236,420,34,'ground',{oneWay:false}),new Platform(465,236,400,34,'ground',{oneWay:false}),new Platform(905,236,345,34,'ground',{oneWay:false}),new Platform(0,157,174,12),new Platform(0,65,174,12),new Platform(225,196,94,12),new Platform(365,153,102,12),new Platform(536,177,96,12),new Platform(705,146,100,12,'moving',{range:24,speed:1})];
    l.enemies=[new Enemy('bat',220,114),new Enemy('sword',337,207),new Enemy('bat',557,145),new Enemy('runner',653,207),new Enemy('archer',965,207)];
    l.pickups=[new Pickup('heal',111,129),new Pickup('spirit',391,124),new Pickup('spirit',752,115)];
  }return l;};

  drawHUD=function(c,g,pal){const p=g.player;c.save();c.fillStyle='rgba(8,7,22,.45)';c.fillRect(0,0,W,41);
    for(let i=0;i<4;i++){c.save();c.translate(10+i*14,8);c.scale(.62,.62);drawHeart(c,0,0,i<p.hp);c.restore();}
    drawWeaponIcon(c,10,23,p.weapon);drawBottleIcon(c,31,21,p.heals);c.fillStyle='#2e2540';c.fillRect(73,27,54,3);c.fillStyle=C.cyan;c.fillRect(73,27,54*p.spirit/100,3);
    c.textAlign='right';c.font='8px monospace';c.fillStyle='#ded9ec';c.fillText(`${settings.language==='ptBR'?'FASE':'LEVEL'} ${g.levelIndex+1}: ${t(g.level.name)}`,W-48,13);c.fillStyle=C.pink;c.fillText(`SCORE ${String(g.score).padStart(5,'0')}`,W-48,25);
    if(g.boss&&!g.boss.dead){const b=g.boss,bw=Math.min(200,W*.45),bx=(W-bw)/2,by=H-21;c.fillStyle='rgba(7,5,19,.85)';c.fillRect(bx-8,by-16,bw+16,31);c.textAlign='center';c.fillStyle=b.color;c.font='8px monospace';c.fillText(`${t('bossName')} · ${b.phase}/3`,W/2,by-5);for(let i=0;i<3;i++){c.fillStyle='#342340';c.fillRect(bx+i*bw/3,by,bw/3-3,4);c.fillStyle=b.color;const ratio=i<b.phase-1?0:i===b.phase-1?b.hp/b.maxHp:1;c.fillRect(bx+i*bw/3,by,(bw/3-3)*ratio,4);}}
    c.restore();
  };

  drawBossFigure=function(c,x,y,facing,color,time,ghost){c.save();c.translate(x+11,y+17);c.scale(facing,1);if(ghost)c.globalAlpha*=.25;
    c.fillStyle='#27213f';c.strokeStyle=color;c.lineWidth=1;c.beginPath();c.moveTo(-7,-7);c.lineTo(6,-7);c.lineTo(10,16);c.lineTo(-10,16);c.closePath();c.fill();c.stroke();
    c.fillStyle=color;c.fillRect(-5,-15,11,9);c.fillRect(-7,-8,15,4);c.fillStyle='#e9dbeb';c.fillRect(-3,-12,8,5);c.fillStyle='#392441';c.fillRect(1,-11,4,1);c.fillStyle='#ece3fa';c.beginPath();c.moveTo(-3,-6);c.lineTo(5,-6);c.lineTo(1,1);c.closePath();c.fill();
    limb(c,[[-4,7],[-6,13],[-7,17]],color,2.5);limb(c,[[4,7],[6,13],[8,17]],color,2.5);limb(c,[[6,-3],[11,0],[13,-5]],color,2.5);
    neonLine(c,14,-12,14,17,color,1,.2);bead(c,14,-14,3,color);c.restore();
  };

  const game = new Game();
  resizeCanvasToViewport();

  function applyLanguage(){document.documentElement.lang=settings.language==='ptBR'?'pt-BR':'en';ui.eyebrow.textContent=t('presents');ui.subtitle.textContent=t('subtitle');ui.start.textContent=t('startJourney');ui.options.textContent=t('options');ui.controls.textContent=t('controls');ui.language.textContent=`${t('language')}: ${settings.language==='en'?'ENGLISH':'PORTUGUÊS (BRASIL)'}`;ui.titleHint.textContent=t('keyboardTouch');ui.modalClose.textContent=t('back');ui.pauseTitle.textContent=t('paused');ui.pauseResume.textContent=t('resume');ui.pauseRestart.textContent=t('restartCheckpoint');ui.pauseControls.textContent=t('controls');ui.pauseOptions.textContent=t('options');ui.pauseLanguage.textContent=`${t('language')}: ${settings.language==='en'?'ENGLISH':'PORTUGUÊS (BRASIL)'}`;ui.pauseQuit.textContent=t('quitTitle');ui.orientationTitle.textContent=t('rotateTitle');ui.orientationText.textContent=t('rotateText');ui.orientationBtn.textContent=t('rotateButton');ui.orientationHelp.textContent=t('rotateHelp');ui.inventoryTitle.textContent=t('inventoryTitle');ui.inventoryKicker.textContent=t('inventoryKicker');ui.inventoryHint.textContent=t('closeInventory');saveSettings();game.refreshInventory();}

  function openOptions(){ui.modalTitle.textContent=t('options');ui.modalContent.innerHTML=`
    <div class="option-row"><label><span>${t('musicVolume')}</span><b>${Math.round(settings.music*100)}%</b></label><input id="opt-music" type="range" min="0" max="1" step="0.01" value="${settings.music}"></div>
    <div class="option-row"><label><span>${t('sfxVolume')}</span><b>${Math.round(settings.sfx*100)}%</b></label><input id="opt-sfx" type="range" min="0" max="1" step="0.01" value="${settings.sfx}"></div>
    <label class="toggle-row"><span>${t('screenShake')}</span><input id="opt-shake" type="checkbox" ${settings.screenShake?'checked':''}></label>
    <label class="toggle-row"><span>${t('reducedEffects')}</span><input id="opt-reduced" type="checkbox" ${settings.reducedEffects?'checked':''}></label>
    <button id="opt-fullscreen" class="pixel-btn" type="button">${t('fullscreen')}</button>`;
    ui.modal.classList.remove('hidden');
    const music=$('opt-music'),sfx=$('opt-sfx'),shake=$('opt-shake'),reduced=$('opt-reduced'),fs=$('opt-fullscreen');
    music.addEventListener('input',()=>{settings.music=Number(music.value);music.previousElementSibling.querySelector('b').textContent=`${Math.round(settings.music*100)}%`;audio.sync();saveSettings();});
    sfx.addEventListener('input',()=>{settings.sfx=Number(sfx.value);sfx.previousElementSibling.querySelector('b').textContent=`${Math.round(settings.sfx*100)}%`;audio.sync();saveSettings();});
    shake.addEventListener('change',()=>{settings.screenShake=shake.checked;saveSettings();});
    reduced.addEventListener('change',()=>{settings.reducedEffects=reduced.checked;saveSettings();game.invalidateBackdrop();});
    fs.addEventListener('click',()=>document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.());
  }

  function openControls(){ui.modalTitle.textContent=t('controls');ui.modalContent.innerHTML=`<div class="control-grid"><b>← → / A D</b><span>${t('move')}</span><b>SPACE / W</b><span>${t('jump')}</span><b>J / X</b><span>${t('attack')}</span><b>K / C</b><span>${t('block')}</span><b>SHIFT / L</b><span>${t('power')}</span><b>H</b><span>${t('heal')}</span><b>Q</b><span>${t('switchWeapon')}</span><b>I</b><span>${t('inventory')}</span><b>ESC / P</b><span>${t('pause')}</span></div>`;ui.modal.classList.remove('hidden');}

  function toggleLanguage(){settings.language=settings.language==='en'?'ptBR':'en';applyLanguage();audio.sfx('click');}

  function renderInventory(){if(!ui.inventoryContent||!game.player)return;const p=game.player;const weaponCard=(id,name,icon)=>{const unlocked=p.unlocked[id],eq=p.weapon===id;return `<div class="inventory-card ${eq?'equipped':''} ${!unlocked?'locked':''}"><div class="inventory-icon">${icon}</div><div><strong>${name}</strong><small>${!unlocked?t('locked'):eq?t('equipped'):id==='greatsword'?'77 · 2 HP':id==='spear'?'102 · 1 HP':'82 · 1 HP'}</small>${unlocked&&!eq?`<button data-equip="${id}" type="button">${t('equip')}</button>`:''}</div></div>`;};
    const powerCard=(id,name,icon)=>`<div class="inventory-card ${p.unlocked[id]?'':'locked'}"><div class="inventory-icon">${icon}</div><div><strong>${name}</strong><small>${p.unlocked[id]?'✓':t('locked')}</small></div></div>`;
    ui.inventoryContent.innerHTML=`<section class="inventory-section"><h3>${t('equipment')}</h3>${weaponCard('sword',t('swordName'),'†')}${weaponCard('greatsword',t('greatswordName'),'‡')}${weaponCard('spear',t('spearName'),'↟')}</section><section class="inventory-section"><h3>${t('supplies')}</h3><div class="inventory-card"><div class="inventory-icon">+</div><div><strong>${t('healing')} ×${p.heals}</strong><small>Restore up to 2 vitality.</small><button id="inventory-heal" type="button">${t('use')}</button></div></div><div class="inventory-card"><div class="inventory-icon">◇</div><div><strong>${t('spirit')}</strong><small>${Math.round(p.spirit)} / ${p.maxSpirit}</small></div></div></section><section class="inventory-section"><h3>${t('powers')}</h3>${powerCard('shadowStep',t('shadowStep'),'»')}${powerCard('airBurst',t('airBurst'),'↑')}${powerCard('guardBurst',t('guardBurst'),'◯')}${powerCard('energySlash',t('energySlash'),'⌁')}</section>`;
    ui.inventoryContent.querySelectorAll('[data-equip]').forEach(btn=>btn.addEventListener('click',()=>{p.weapon=btn.dataset.equip;audio.sfx('click');renderInventory();}));
    $('inventory-heal')?.addEventListener('click',()=>{p.heal(game);renderInventory();});
  }

  function updateOrientation(){const should=coarsePointer&&window.innerHeight>window.innerWidth*1.03;ui.orientation.classList.toggle('visible',should);ui.orientation.setAttribute('aria-hidden',String(!should));}
  ui.orientationBtn.addEventListener('click',async()=>{try{await document.documentElement.requestFullscreen?.();await screen.orientation?.lock?.('landscape');}catch{}updateOrientation();});

  ui.start.addEventListener('click',()=>game.start());ui.options.addEventListener('click',openOptions);ui.controls.addEventListener('click',openControls);ui.language.addEventListener('click',toggleLanguage);ui.modalClose.addEventListener('click',()=>ui.modal.classList.add('hidden'));
  ui.pauseResume.addEventListener('click',()=>game.resume());ui.pauseRestart.addEventListener('click',()=>game.restartCheckpoint());ui.pauseControls.addEventListener('click',openControls);ui.pauseOptions.addEventListener('click',openOptions);ui.pauseLanguage.addEventListener('click',toggleLanguage);ui.pauseQuit.addEventListener('click',()=>game.quit());ui.pauseTouch.addEventListener('click',()=>game.pause());ui.inventoryTouch.addEventListener('click',()=>game.openInventory());ui.inventoryClose.addEventListener('click',()=>game.closeInventory());

  window.addEventListener('resize',()=>{resizeCanvasToViewport();updateOrientation();});window.addEventListener('orientationchange',()=>setTimeout(()=>{resizeCanvasToViewport();updateOrientation();},120));
  applyLanguage();updateOrientation();audio.setMusic('title');

  // Physics advances at a fixed 120 Hz, independently of monitor refresh.
  let accumulator=0;
  function frame(now){
    if(!game.running)return;
    const elapsed=Math.min(50,Math.max(0,now-game.lastFrame));game.lastFrame=now;
    if(!document.hidden){
      accumulator+=elapsed/1000;
      while(accumulator>=1/120){game.update(1/120);input.endFrame();accumulator-=1/120;}
      const interval=game.mode==='playing'?1000/60:1000/30;
      if(now-game.lastRender>=interval-.5){game.lastRender=now;game.draw();}
    }else accumulator=0;
    requestAnimationFrame(frame);
  }
  window.addEventListener('blur',()=>{if(game.mode==='playing')game.pause();});
  document.addEventListener('visibilitychange',()=>{input.clear();accumulator=0;game.lastFrame=performance.now();if(document.hidden){if(game.mode==='playing')game.pause();audio.ctx?.suspend();}else if(audio.ctx)audio.ctx.resume();});
  window.addEventListener('keydown',e=>{if(game.mode==='paused'&&(e.code==='Escape'||e.code==='KeyP')&&ui.modal.classList.contains('hidden')){game.resume();}else if(game.mode==='inventory'&&(e.code==='KeyI'||e.code==='Escape'))game.closeInventory();});
  requestAnimationFrame(frame);

  window.__KOTR_V5__={game,settings,version:'5.3.0-combat-fix'};
})();
