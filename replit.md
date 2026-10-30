# The Good Lyfe Consulting Group - Static Website

## Overview

This is a static website for The Good Lyfe Consulting Group, a consulting company that specializes in operationalizing AI solutions. The website is built using modern web technologies with a focus on clean design, responsive layout, and professional presentation.

## System Architecture

Plain static HTML, no build step. Three pages share one stylesheet and one script:

- `index.html`: hero with an operations graph (12 systems wired into the agent layer, with a feed of what AI created), integration ticker, the GLC film, the current state, integration protocols with an example config, capabilities, executive search, engagement process, contact
- `about.html`: founder bio, story, values
- `privacy-policy.html`: privacy policy
- `assets/site.css`: design tokens (colors, fonts, spacing) and all styles
- `assets/site.js`: mobile menu, film autoplay fallback, hero operations graph
- `assets/`: logo mark, favicon, founder photo, `glc-film.mp4` and its poster

Fonts load from Google Fonts (Geist, Geist Mono, Instrument Serif). Everything else is self-hosted in `assets/`.

The film is rendered with Remotion from `~/gamerplug-stories/src/glc/GLCFilm.tsx` (composition `GLCFilm`), then scaled to 1280px wide for the site.

## Deployment

Replit static deployment of the repo root.

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 01, 2025. Initial setup
- October 29, 2026. Redesign: shared CSS/JS, GLC film, Executive Search section, rebuilt About and Privacy pages
- October 29, 2026. Merged the live site's best elements (serif headlines, shimmer, glowing buttons, ticker, integration code panel, status footer) into the redesign; new hero operations graph