# The Good Lyfe Consulting Group - Static Website

## Overview

This is a static website for The Good Lyfe Consulting Group, a consulting company that specializes in operationalizing AI solutions. The website is built using modern web technologies with a focus on clean design, responsive layout, and professional presentation.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Pure HTML5, CSS3, and JavaScript (no framework dependencies)
- **Styling Framework**: Tailwind CSS (CDN-based implementation)
- **Typography**: Google Fonts (Inter family) for consistent, modern typography
- **Icons**: Lucide React icons for UI elements
- **Layout Pattern**: Multi-page static site with shared design patterns

### Design System
- **Color Scheme**: Dark theme with deep purple/blue accents (#0A0917 background, #E0E0E0 text)
- **Visual Effects**: Gradient backgrounds, backdrop blur effects, and hover animations
- **Responsive Design**: Mobile-first approach using Tailwind's responsive utilities

## Key Components

### Pages Structure
1. **index.html** - Main landing page with hero section, services overview, and company introduction
2. **about.html** - Detailed company information, team, and history (partially implemented)

### Shared Components
- **Header Navigation**: Fixed header with backdrop blur and transparency effects
- **Hero Sections**: Gradient backgrounds with animated elements
- **Content Sections**: Standardized padding and spacing (8rem sections)
- **Interactive Elements**: Hover effects and smooth transitions

### Visual Elements
- **Gradient Text**: Linear gradient effects for accent text (#4F46E5 to #00A9FF)
- **Button Animations**: Transform and shadow effects on hover
- **Scroll Animations**: Reveal animations for content sections
- **Timeline Components**: Visual timeline elements with custom styling

## Data Flow

### Static Content Delivery
- Pure client-side rendering with no backend dependencies
- External assets loaded via CDN (fonts, icons, styling framework)
- Image assets hosted on external services (PostImg for favicon)

### User Interactions
- Smooth scrolling navigation between sections
- Hover effects and micro-interactions for enhanced UX
- Responsive design adapts to different screen sizes

## External Dependencies

### CDN Resources
- **Tailwind CSS**: `https://cdn.tailwindcss.com` - Main CSS framework
- **Google Fonts**: Inter font family for typography consistency
- **Lucide Icons**: `https://unpkg.com/lucide-react@latest/dist/lucide-react.js` - Icon library
- **External Images**: PostImg service for hosting brand assets

### Browser Compatibility
- Modern browsers supporting CSS Grid, Flexbox, and CSS custom properties
- Progressive enhancement approach for older browsers

## Deployment Strategy

### Static Hosting
- **Deployment Type**: Static site deployment suitable for any web server
- **Requirements**: No server-side processing needed
- **CDN Compatibility**: All external dependencies loaded from reliable CDNs
- **Performance**: Optimized for fast loading with minimal dependencies

### Hosting Options
- Compatible with GitHub Pages, Netlify, Vercel, or traditional web hosting
- No build process required - direct file serving
- HTTPS recommended for secure font and asset loading

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 01, 2025. Initial setup