# MoeMath Visual Identity 2.0

**Status: Plus Studio selected and approved by the user as the Visual Identity 2.0 direction. Phase 1 only.** This approval selects the direction; it does not authorize starting the full production redesign. PR #7 is an inspected baseline, not the approved visual system. No production UI, arithmetic, session, scoring, adaptive-learning, persistence, or dependency changes belong to this phase.

Open [the concept viewer](index.html). Each direction contains Home, active Gameplay, and Results at 360 × 780 in Sakura Light and OLED Dark: **18 rendered screens**. These are browser-rendered visual prototypes, not React Native screenshots or a functioning mathematics application. Session examples are illustrative: 8/10 correct, 80%, 24 seconds total, 2.4 seconds average. Only concept navigation is interactive.

## What the current interface gets right—and why it still feels generic

Inspected `src/theme`, shared UI, all feature groups, Expo Router layouts, and all six Suu-chan portraits. Compared archived Android Home, Gameplay, Results, records, settings, and tablet captures with source. The archived gameplay image predates the last compact-companion spacing adjustment; it is not evidence of the exact latest gameplay layout.

- **A character inside a feature panel is still a feature panel.** `HomeScreen` places Suu-chan in a rounded lavender stage followed by a full-width CTA. `SessionResults` repeats the same stage, diagonal motif, character-right/summary-left arrangement. The repeated containment makes the art feel attached to a general-purpose layout.
- **The visual signature does not encode the task.** `PanelMotif` supplies the same three diagonal paths to Home, Results, and Settings; the small skewed dash on headings is another recurring ornament. Neither establishes a distinctive relationship between the character, mathematics, and navigation.
- **Expressive type is spread too widely.** Nunito Sans Black Italic serves both the wordmark and all Progress summary values. It gives energy, but repetition dilutes its significance. The equation uses another size override rather than a visibly different mathematical composition.
- **The focus screen retreats to a standard calculator panel.** The archived gameplay capture shows a centered equation, a filled answer rectangle, and boxed keys. Readable and familiar, but it could belong to many apps.
- **Dark currently means plum, not OLED black.** `tokens.ts` uses `#16121D` for the current dark canvas. The new exploration explicitly uses `#000000` for OLED Dark.
- **Do not diagnose a universal card problem that is not present.** History and mistake rows already use open separators; `Surface` is now an open grouping primitive. Those are useful foundations. Touch labels, accurate metrics, safe-area handling, existing SVG charts, and modest WebP portraits should be preserved.

## Research translated into decisions

| Reference | Useful principle | What MoeMath should leave behind |
|---|---|---|
| [Project SEKAI / official gameplay material](https://www.colorfulstage.com/aboutgame/gameplay/) and [a published results capture](https://akusadoki.hatenablog.com/entry/2021/01/14/210308) | Strong type contrast, concentrated color, compact performance information, and a clear focal moment. | Rank badges, reward economies, difficulty colors copied verbatim, interface density, and copyrighted game imagery. |
| [Blue Archive](https://bluearchive.nexon.com/) and [a lobby capture on Nexon's forum](https://forum.nexon.com/bluearchive/board_view?board=4209&thread=2424988) | A character inhabits the screen; controls occupy deliberately reserved areas around the figure. | Currency bars, event promotions, floating notifications, monetization controls, or a literal imitation of its lobby. |
| [Ishimura+Neichi / Keita Takemura Studio](https://keitatakemura.com/projects/ishimura-neichi/) | Optical alignment, disciplined type proportions, and useful negative space can carry identity without effects. | Importing a desktop editorial layout into a phone, gratuitous vertical Japanese text, or licensed reference typefaces. |

The interpretations above are art-direction judgments, not claims that these products prescribe MoeMath's layout. Reference artwork was inspected, not incorporated into the prototypes. All mascot art is the existing Suu-chan artwork.

The four installed skills supply different constraints rather than four competing styles:

- [Expo Design System](https://skills.sh/expo/skills/expo-design-system): extend the existing theme entry point; establish text roles and reusable component contracts.
- [Anthropic Frontend Design](https://github.com/anthropics/skills/tree/main/skills/frontend-design): subject-specific identity, different compositions before selection, and one deliberate focal idea.
- [Expo Animation](https://skills.sh/expo/skills/expo-animation): frequency-based motion restraint, UI-thread feedback, reduced-motion alternatives, and release-device verification before performance claims.
- [Vercel React Native Skills](https://skills.sh/vercel-labs/agent-skills/vercel-react-native-skills): preserve bounded `expo-image` assets, memoized hot-path components, native navigation, and narrow state subscriptions.

Impeccable was not used. Recommendations for new libraries or wholesale navigator replacement are not adopted without a demonstrated need. Existing Pressable/key dispatch behavior takes precedence over introducing a gesture library merely to follow a generic rule.

## Three complete directions

| | Vector Club | Quiet Folio | Plus Studio |
|---|---|---|---|
| Composition | Open character stage; four compact operation controls; vertical gameplay progress rail. | Portrait/type columns; open operation list; left-aligned equation and ruled answer. | Continuous character margin on Home and Results; full-width mathematical band during play. |
| Type | Saira Semi Condensed display/numerals; Zen Kaku Gothic New reading text. | Noto Serif for display and equations; Zen Kaku Gothic New controls. | M PLUS 1p: geometric, upright, two proposed native weights. |
| Color and shape | Violet and pale lilac, a restrained circular/diagonal stage, small-radius keys. | Cool stone, navy ink, dusty rose; open rules and nearly square controls. | Sakura paper, indigo ink, lavender character margin; rectangular arithmetic band and precise keys. |
| Originality | Familiar rhythm-game grammar, newly composed for portrait arithmetic. | Unexpectedly editorial, but less immediately identifiable as a moe product. | Strongest ownable relationship between character space and work space. |
| Readability | Broad UI text fixes the first draft's overly condensed captions. | Calm hierarchy; serif numerals need particular native legibility scrutiny. | Clear arithmetic and high contrast; narrow copy column needs an explicit reflow rule. |
| Character integration | Most generous open portrait. | Character and text share a grid; still relatively conventional. | Selective crop is part of the layout, not a mascot card. |
| Native feasibility | Simple Views, one static SVG, existing image and keypad. | Cheapest geometry and lowest visual complexity. | Simple grid-equivalent flex layout; no masks, shaders, or new image assets. |
| Frequent practice | Clear task, but the lobby is the most visually assertive. | Least distracting; risks undershooting the desired game personality. | Separates welcoming character presence from concentrated mathematical input. |

**Selected direction: Plus Studio.** Recommended after comparison and then explicitly selected by the user. The same character margin supports Home and the completion moment; gameplay changes to a full-width mathematical surface, so identity does not steal input space. Its trade-off is the tighter Home/Results column. Collapse that composition before shrinking text. The evaluation is art-direction judgment, not measured usability evidence; Vector Club and Quiet Folio are retained as unselected alternatives.

## Approved direction specification — Plus Studio

### Type and numerals

Use M PLUS 1p Regular, 700, and 800: one family, with 800 reserved for the wordmark and result numeral. Body 16/24; labels 15/21; supporting metadata 13/19; screen titles 24/30; brand/display 28–30/36; equation 48–56/64; answer 44–48/58; result numeral 72–80 with a separate 24–28 denominator. Use upright numerals and tabular figures where supported. Keep the mathematical baseline, multiplication sign, division sign, decimal separator, and minus sign optically consistent.

The prototype includes Latin WOFF2 subsets for all explored families, with licenses. They are **browser assets**, not Expo font assets. A subsequent native implementation needs tested TTF/OTF assets for the selected family, glyph-coverage checks, and size measurement. Do not ship all exploration fonts in the app. Preserve text scaling and provide a system-font fallback if a font fails to load.

### Semantic palette

| Role | Sakura Light | OLED Dark |
|---|---|---|
| Canvas | `#FFF8FC` | `#000000` |
| Main text | `#292D5C` | `#F1EFFF` |
| Secondary text | `#646078` | `#BDB5CF` |
| Primary action | `#3E429C` | `#C3C4FF` |
| Text on primary | `#FFFFFF` | `#242342` |
| Quiet surface | `#F6F1FA` | `#13121B` |
| Character margin | `#E4DFF8` | `#24203B` |
| Separator | `#D3CBE1` | `#39334E` |
| Mathematical band | `#3E429C` | `#191C3B` |
| Text on band | `#FFFFFF` | `#F1EFFF` |
| Correct answer | `#1D6B58` | `#8CD8BE` |
| Error/correction cue | `#C02B66` | `#FFA2C5` |

Indigo carries actions and focus; sakura appears in character context and correction cues. Correctness always also has an icon/text explanation. Do not use four unrelated operation colors or imply a rank through color. Pale separators are grouping devices, not sufficient state indicators; if a control boundary is the only affordance, it must meet non-text contrast requirements.

### Geometry, placement, and navigation

- Keep the existing 4-point spacing vocabulary. Use 24dp outer padding, 16dp related-group gaps, and 24–32dp section separation. The example's 128dp character margin is a reference proportion at 360dp, not a universal fixed width.
- Home/Results use a character margin anchored to the canvas edge. Gameplay uses the whole width. Use 4–6dp control corners, modest 8–12dp grouping corners only where grouping earns a surface, and no decorative shadow system.
- Keep Home, Practice, and Progress as the three peer destinations. Preserve system back, confirmation dialogs, safe areas, and current route behavior. Expanded widths retain the already-supported rail; do not migrate navigation architecture for appearance.
- Keep Suu-chan's eyes and plus hairclip within the visible crop. Crop clothing/hair at the canvas edge deliberately; never alter her proportions or place actionable controls over her face. No blur, color filter, repainting, replacement character, or new raster backdrop.
- Neutral welcomes; thinking supports active work; happy/encouraging/surprised retain the existing expression rules; sleepy belongs to pause. Optional companion visibility remains respected. Decorative portraits stay out of screen-reader traversal.

### Interaction and state

Keep the familiar 3 × 4 keypad and existing digit, delete, and submit semantics. The equation and answer must remain immediately readable; the new question must not wait for a fade or entrance. Keys use clear numeric labels, a modest pressed fill/depression, and a distinct submit control. Do not animate individual digits or scale the mathematical content.

Controls retain default, pressed, disabled, busy, selected, and error states. Selection uses a check/indicator plus color. Disabled submit remains announced as disabled until input is valid. Saving/error messaging and retry controls remain truthful and visible. Loading, empty, failed-storage, no-companion, interrupted, and long-history states must use the same system.

Motion is proposed, not performance-verified: at most 80–120ms press feedback; instant peer-tab and question changes; native stack transitions; at most 180ms portrait crossfade or one restrained completion acknowledgment. No loops or animation queue. Reduced motion removes spatial movement and preserves immediate state feedback. Reuse existing optional answer haptics; no haptic per digit, on scroll, on app entrance, or after a delayed animation.

### Responsive and accessibility rules

At small widths or larger type, replace the character margin with a short portrait/header row and let content take full width. Never solve a tight column by disabling scaling or shrinking labels. On short/landscape gameplay, reduce or omit optional character presence before compromising the equation or keypad. Keep 48dp Android / 44pt iOS touch targets; labels, focus order, live feedback, and native safe-area behavior matter as much as appearance. Tablet reading areas stay bounded; do not enlarge portraits merely to fill empty space.

### Rules that keep the identity specific

One character margin, one work area, one primary action. A route's content determines its structure; a universal feature-card template does not. No headline kickers, ornamental section numbers, fake ranks, currencies, counters, badges, or untranslated Japanese navigation. Use the plus motif as a brand cue, not a repeating wallpaper. Records are records: aligned equations, answers, dates, and units, not gamified tiles. The existing Suu-chan art supplies warmth; the shell supplies precision.

## Implementation blueprint — no logic migration

| Existing boundary | Follow-up treatment |
|---|---|
| `theme/tokens.ts`, `theme/provider.tsx`, `AppText` | Extend the existing single theme system with approved semantic colors and type roles; keep preference loading and theme ownership. |
| `Screen`, `Header`, tabs/stack layouts | Reuse safe areas, max-width behavior, route hierarchy, and supported tablet navigation. Add composition variants only where real screens require them. |
| `Button`, `IconButton`, `SegmentedChoice`, `ChoiceRow`, `SwitchRow` | Reuse behavior/APIs and native switches; align shapes, state indicators, and touch areas. Add layout overrides rather than screen-specific copies. |
| `PanelMotif`, `Surface`, `SectionTitle` | Retire the repeated decorative diagonal/dash treatment. Keep useful open record grouping; do not wrap every section in a new container. The character margin is a layout composition, not a universal card. |
| `OperationMark`, `OperationPicker`, `DifficultyPicker` | Reuse mathematical SVG marks and selection logic. Present operation rows and six clear difficulty choices; preserve manual/adaptive availability. |
| `CompanionPortrait`, `SessionCompanion`, expression helpers | Reuse all six bounded images, existing fallback/expression rules, reduced-motion support, and companion preference. Add crop/layout props only when needed. |
| `QuestionStage`, `Keypad`, `AnswerFeedback`, `SessionProgress`, `SessionTimer` | Restyle as the work band and stable keypad. Preserve memoization, callback signatures, index/generation guards, timer, reducer actions, and immediate submit. |
| `SessionResults` | Replace stage composition; feed the new view with the same `summarizeAttempts` result and existing mistake list. Preserve save/retry/done behavior. |
| `ProgressChart`, `SkillLevels`, `AttemptRow` | Reuse SVG charts, actual aggregates, levels, answer/timing content, accessible chart inspection, and shared answer rows. No invented trend lines. |
| Preferences/adaptive providers and database modules | Consume existing public values only. No schema, migration, query, scheduling, scoring, or adaptive changes. |

| Screen | Resulting composition |
|---|---|
| Home | Character margin, concise task copy, obvious Start practice, four direct operation rows. |
| Practice | Full-width native-style choices; selected operation and manual/adaptive difficulty remain unmistakable. |
| Gameplay / pause | Full-width mathematics and thumb-reachable keypad; compact optional thinking portrait. Pause may show sleepy Suu, with unchanged resume/restart/end actions. |
| Results | Character margin, truthful correct/total and timings, open mistake rows, existing save states, Practice again and Done. |
| Progress | Period selector scopes the same real totals/chart. Upright tabular values and a clear level list; no character consuming chart space. |
| History / detail | Date/session ledger and shared equation/answer rows, preserving pagination and interrupted timing. |
| Review | Due/early status, scheduled-review explanation, existing start behavior; no invented rewards or claims that early review clears a scheduled item. |
| Settings | Open grouped native controls, clear theme names, quiet companion identification, unchanged export/reset confirmations and recovery. |

## Prioritized follow-up phases

1. **Direction selection — complete.** The user selected Plus Studio, including its narrow-screen reflow requirement. Keep the other concepts as references; do not implement all three or blend their typography opportunistically.
2. **Foundation + first native screen.** Tokens, selected native font assets, reusable primitives, and Home/Practice. Review actual Android/iOS phone renders and text scaling before expanding the surface area.
3. **Study loop.** Gameplay, pause, results, immediate input, interrupted sessions, saving/retry states. Keep the learning engine and persistence untouched. Validate only changed behavior with existing tests.
4. **Records and preferences.** Progress, History/detail, Review, Settings, empty/loading/error states, and tablet/landscape composition.
5. **Release verification.** Capture both themes, narrow phones/tablets, large text, reduced motion, and no-companion states. Measure memory and frame timing on the slowest supported release device; verify offline fonts/assets. Run the appropriate existing checks before the implementation PR. Do not create redundant test files or trigger CI for these concepts.

## Evidence and limits

The three six-screen boards were rendered and visually inspected, then revised for caption readability, crop safety, and keypad spacing. Original character files are unchanged. A focused palette calculation found the proposed Plus Studio main text at **12.37:1 / 18.53:1**, secondary text at **5.76:1 / 10.67:1**, primary-button text at **8.52:1 / 9.08:1**, and equation-band text at **8.52:1 / 14.58:1** (light/dark). These are specific declared color pairs, not a blanket accessibility certification.

Browser layout inspection found no overflow or out-of-frame controls in the inspected Plus Studio screens; keypad controls were at least 72px there. This does not prove native layout, Dynamic Type, VoiceOver/TalkBack behavior, animation smoothness, memory efficiency, or release-device performance. Native prototypes and representative user evaluation are subsequent-phase work. No app test suite, Expo export, CI run, PR, or production redesign was needed or performed for Phase 1.
