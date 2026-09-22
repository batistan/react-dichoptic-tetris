# CLAUDE.md

## Project Overview

React-based Tetris game designed for treating amblyopia (lazy eye) using dichoptic presentation. Built with React 19, TypeScript, Vite, and Tailwind CSS v4.

## Commands

- `npm install` first — without `node_modules`, `npx jest` fetches a standalone Jest and fails with `Cannot find module '@babel/preset-env'`
- `npm run dev` — Start Vite development server
- `npm run build` — TypeScript check + Vite production build (`tsc -b && vite build`)
- `npm run lint` — Run ESLint
- `npm run preview` — Preview production build
- `npx jest` — Run tests (Jest + ts-jest)
- `npx jest test/Board.test.ts` — Run a specific test file

## Architecture

### Source Structure

`src/components/game/logic/` — pure game mechanics:

- `Blocks.ts` — tetromino shapes, rotation, random generator
- `Board.ts` — board state, collision, line clearing
- `GameState.ts` — game reducer, scoring, actions

Everything else under `src/components/` is presentation; run `find src -type f` for the current layout.

### Key Design Decisions

- **Pure game logic separation**: All mechanics live in `logic/` as pure functions, decoupled from React
- **useReducer pattern**: Game state managed via reducer with `GameStateAction` enum (TICK, MOVE_LEFT, ROTATE_CLOCKWISE, HARD_DROP, HOLD, etc.)
- **React Context**: `SettingsContext` propagates user color/display preferences; no external state library
- **localStorage persistence**: Settings (base64-encoded JSON), theme, and high score

### Board Constants

- Width: 10, Height: 22
- Initial block spawn: `{x: 5, y: -2}`
- 7 standard tetrominoes: I, J, L, O, S, T, Z

### Scoring

Points per line clear × (level + 1): Single=40, Double=100, Triple=300, Tetris=1200. Level = `floor(linesCleared / 10) + 1`.

## Code Conventions

- **TypeScript strict mode** — no unused locals or parameters
- **Functional components only** with hooks (no class components)
- **PascalCase** for React component files (.tsx), **camelCase** for hooks/utilities (.ts)
- **CSS**: Tailwind utility classes + custom CSS variables for theming; component-specific `.css` files co-located with components
- **Imports**: Library imports first, then local imports

## Testing

- **Framework**: Jest via `babel-jest` — no Jest config; `babel.config.cjs` is the transform. `ts-jest` is installed but unused
- **Type-checking**: `npx jest` strips types without checking them; `npm run build` (`tsc -b`) type-checks `test/` via `tsconfig.test.json`. Run both after changing an export used by tests
- **Location**: `test/` directory at project root
- **Scope**: Unit tests for pure game logic (`Blocks.test.ts`, `Board.test.ts`); no React component tests
- **Style**: `describe`/`test` blocks, direct assertions with `expect()`, no mocks needed for pure functions

## Tech Stack

- React 19 + TypeScript 5.8
- Vite 6 (build + dev server)
- Tailwind CSS v4 with PostCSS
- ESLint 9 (flat config) with react-hooks and react-refresh plugins
- Jest 29 for testing
- react-colorful for color picker
