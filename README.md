# Knights of the Renaissance

**Knights of the Renaissance** is a short browser-based action-platformer and playable prologue created by **Gustavo Vitor / Vigu Studio**.

The demo is built entirely with standard web technologies and is designed to run as a static project on GitHub Pages. Its presentation is inspired by the clarity and pacing of classic 16-bit platformers, while all artwork, gameplay code, UI, music logic, effects, characters, and level layouts are original to this project.

## About

The Third Kingdom survived a war against the last great dragon, but the victory nearly destroyed the legendary Knights of the Renaissance. Years later, far beyond the kingdom's border, a young warrior trains with only a sword, a shield, and questions about a past that has never been fully explained.

This demo is meant to feel like the opening chapter of a larger game rather than a disconnected prototype.

## Features

- Five connected stages with escalating mechanics
- Contextual movement and combat tutorial
- Sword attacks and mid-air attacks
- Directional shield blocking
- Platforming with moving and falling platforms
- Hazards, ranged enemies, melee enemies, and combat waves
- Checkpoints and in-level respawning
- A timing-focused final boss encounter
- Story intro, final dialogue, cliffhanger, and scrolling credits
- Procedural retro sound effects and lightweight chiptune-style music using the Web Audio API
- Original code-drawn pixel-art visuals with no external game assets
- Adaptive fullscreen canvas that matches desktop, tablet, and landscape-phone aspect ratios without stretching the pixel art
- Portrait-phone rotation screen with fullscreen/landscape request when supported by the browser
- Responsive touch controls for phones and tablets
- English and Brazilian Portuguese localization
- Persistent volume, accessibility, and language preferences through `localStorage`

## Gameplay Structure

1. **The Training Grounds** — learn movement, jumping, attacking, and blocking.
2. **The Forest Path** — practice platforming through hazards and moving terrain.
3. **Combat Trial** — survive enemies approaching from both sides.
4. **Dangerous Path** — combine platforming with melee and ranged combat.
5. **The Clearing** — face the Old Man in a boss fight built around timing and aerial sword strikes.

## Controls

| Action | Keyboard |
| --- | --- |
| Move | `A` / `D` or `←` / `→` |
| Jump | `Space`, `W`, or `↑` |
| Attack | `J` or `X` |
| Block | `K` or `C` |
| Pause | `Esc` or `P` |
| Continue dialogue | `Enter`, `Space`, or `E` |

Touchscreen devices automatically receive on-screen movement, jump, attack, block, and pause controls. On phones held vertically, the game displays a dedicated landscape prompt before gameplay. The button requests fullscreen and landscape orientation on browsers that support orientation locking; otherwise the player can rotate the device manually.

## Languages

The game includes:

- English
- Português (Brasil)

The language can be changed from the main menu, the pause menu, or Options. The selection is saved locally and restored on the next visit.

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- Canvas API
- Web Audio API
- `localStorage`

No framework, package manager, backend, build tool, or external runtime dependency is required.

## Running Locally

For the closest behavior to GitHub Pages, serve the folder with any simple static server. For example:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

The files are also intentionally simple enough for direct static hosting.

## GitHub Pages

1. Upload the project files to the root of a GitHub repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder.
5. Save and wait for the GitHub Pages URL to become available.

No build step is needed.

## Performance Notes

The project uses a low-resolution adaptive internal canvas with pixel-perfect rendering. Its virtual width or height expands to match the current viewport ratio, allowing wide mobile screens to fill the display without horizontally stretching the game. The game loop uses `requestAnimationFrame`, caps large frame deltas, removes expired particles/projectiles, and avoids recreating large DOM structures during gameplay.

For lower-powered devices, enable **Reduced Effects** in Options.


## V1.1 Gameplay & Mobile Fixes

- Reworked the mandatory platform route in **The Forest Path** so every required jump is inside the protagonist's real jump arc.
- Added safer setup stones before spike beds to prevent unwinnable death loops.
- Audited and rebuilt equivalent hazard crossings in **Dangerous Path** to avoid later progression blockers.
- Slightly improved jump height while keeping the same platforming feel.
- Rebuilt the page shell as true fullscreen responsive layout.
- Added adaptive canvas sizing for wide displays and landscape phones.
- Added a bilingual portrait-orientation prompt with a landscape/fullscreen action button.
- Improved title-screen spacing and compact landscape layouts so the crest, title, subtitle, and menu no longer collide on short screens.


## V1.2 Gameplay Reliability Pass

- Fixed the **runner enemy's invisible air-damage bug**: contact damage now requires real 2D body overlap instead of only horizontal proximity, so the player can jump cleanly over runners.
- Tightened sword-enemy attack reach and added vertical-range validation so melee attacks no longer trigger unfairly against a player positioned well above the enemy.
- Added a small collision inset to spike hazards to make their damaging area match the visible spike bed more fairly.
- Repositioned enemies in **Dangerous Path** to preserve a safe landing/run-up area after mandatory hazard crossings.
- Exploration enemies now use a local engagement range and do not aggro or fire across an uncrossed spike/water gap, preventing them from camping the edge of a mandatory crossing before the player can land.
- Falling platforms now automatically reset after being missed, preventing permanent level soft-locks without forcing a death/reload.
- Locked the final boss duel to the clearing after it begins, preventing the player from escaping the encounter and leaving the boss in an unwinnable state.
- A successful aerial sword hit now briefly interrupts the Old Man's downward stomp, preventing an unfair same-frame hit trade after the player correctly executes the intended counter.
- Re-audited damage sources, hazard crossings, checkpoints, arena flow, boss flow, and level-transition conditions after the fix.

## Project Status

**Playable Demo / Prologue**

The project is intentionally scoped as a short introduction to a larger future game concept.

## Future

The complete vision for *Knights of the Renaissance* can expand beyond this web demo with a larger world, deeper progression, additional characters, exploration systems, and more of the history surrounding the Third Kingdom and the lost order.

## Author

**Gustavo Vitor**  
**Vigu Studio**

## YouTube

https://www.youtube.com/@ViguStudio
