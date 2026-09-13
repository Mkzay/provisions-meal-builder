# Release hardening design

## Purpose

Harden Provisions for production while preserving its current meal-building flow and a strictly isolated owner model. Every authenticated account may access only the records assigned to its own `Owner` value.

## Authorization and data ownership

Server routes will derive the owner exclusively from the authenticated session through a shared guard. Missing or malformed sessions return `401`; the client-provided `owner` field and query parameter are ignored for protected operations.

For mutations addressed by a Notion page ID, the server will load the page, determine its `Owner`, and mutate only when it equals the session owner. A mismatch returns `404`, preventing cross-owner modification and record-existence disclosure. This applies to inventory availability/deletion, ready-meal leftover updates, and weight-log deletion.

Authentication will require an environment-provided secret. There will be no static fallback secret. Middleware and route guards will fail closed on authorization errors.

## API safety and AI curation

The curator will validate a bounded JSON payload: known meal type, trimmed strings with length limits, and a limited side list. A local per-session/IP sliding-window limiter will protect each running instance; the deployment guide will note that horizontally scaled production enforcement requires a shared rate-limit store.

Side compatibility stays deterministic and local. AI can refine a title and note, but it cannot introduce arbitrary ingredients. The client will use the returned allowed-side list only after mapping it to the current selected side IDs, clear pending AI state for each changed selection, and never preserve a stale response.

## Reliability, accessibility, and documentation

Client writes will check `response.ok`, retain failed requests in the offline outbox, and replay ordered entries at startup and on the browser `online` event. The interface will show failure rather than silently advancing after a non-success response.

The walkthrough will manage initial focus, tab containment, Escape, and focus restoration. The viewport will allow user scaling while retaining the current mobile-first default layout.

The README will document OpenRouter variables, data sharing/fallback behavior, rate-limit deployment expectations, and the curator route. It will also gain an operational release checklist.

## Testing and verification

Add route-level tests for unauthenticated access, ignored owner spoofing, cross-owner page IDs, curator validation/rate limiting, and offline replay. Preserve helper tests. Run the full test suite and a production build after the changes.
