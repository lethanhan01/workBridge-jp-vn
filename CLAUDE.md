# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**workBridge-jp-vn** is a full-stack web application bridging the Japan–Vietnam job/IT market. The repository uses a monorepo layout with two top-level directories:

- `client/` — frontend application
- `server/` — backend API / services

The project is currently in early setup; neither directory contains code yet.

## Architecture

This is a client/server monorepo. When both sides are scaffolded, keep concerns cleanly separated: the `client/` should never import directly from `server/` (and vice versa) — communication goes through the API.

## Commands

> Commands will be added here once `package.json` files are created inside `client/` and/or `server/`.

Typical patterns to follow when the stack is chosen:

| Task | Where to run |
|---|---|
| Install deps | `client/` and/or `server/` |
| Start dev server | each workspace separately or via root-level script |
| Run tests | inside the relevant workspace |
| Lint | inside the relevant workspace |

## Tech Stack

Not yet decided. The `.gitignore` covers Node.js, TypeScript, Next.js, Vite, and common testing/linting tools — update this section once the stack is finalized.
