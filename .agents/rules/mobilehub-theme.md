---
name: MobileHub Theme Redesign
description: Rules for modifying MobileHub theme components. Applies to all UI and styling tasks.
always_on: true
---

# MobileHub Theme Redesign Guidelines

When modifying the MobileHub store UI (`src/app/`, `src/components/`), you MUST adhere to the following rules:

## 1. Brand Identity & Styling
- **Colors**: Maintain the primary orange, black, and off-white color scheme.
  - Off-white backgrounds: `bg-background` or `bg-secondary`
  - Black elements: `text-foreground` or `bg-primary`
  - Orange accents: `text-accent`, `bg-accent`
  - Success/Conversion: `text-success`, `bg-success`
- **Typography**: Use bold condensed headline styles (`font-bold`, `font-black`, `tracking-tight`, uppercase where appropriate).

## 2. Non-Negotiable Honesty (Placeholders)
- **NO fake numbers or data.** If real data is unknown, you MUST use placeholders:
  - Phone: `{{PHONE}}`
  - Address: `{{ADDRESS}}`
  - Email: `{{EMAIL}}`
  - WhatsApp: `{{WHATSAPP}}`
  - Reviews: `{{REVIEW_COUNT}}` or "Be the first to review"
- Use phrasing like "Quality-checked", "Sourced from trusted suppliers", and "7-day replacement warranty".
- Do NOT use claims like "Official", "Authorized", or invent fake contact details.

## 3. Architecture Constraints
- **UI ONLY**: Do NOT change product data schemas, API routes, or backend business logic.
- Real photos or branded placeholder tiles must be used for products (no generic stock photos).
