# Landing Page Specification

## Overview

The landing page serves as the homepage of the application. It provides essential information, including a greeting and the latest weekly prayer times for the SGR01 zone (Selangor, Malaysia) fetched from the E-Solat API. The design should be clear and user-friendly.

---

## Design Reference

## Use `landing-page-image.png` as your design reference. Generate as close as possible from the image references.

## User Stories

### 1. Homepage Access

**As a** user  
**I want** to visit the site and land on a simple, welcoming homepage  
**So that** I know I'm in the right place and can view the latest prayer times

---

### 2. Prayer Time Display

**As a** user  
**I want** to see the current week's prayer times for my zone  
**So that** I can plan my daily prayers efficiently

---

### 3. Error Handling

**As a** user  
**I want** to be notified gracefully if prayer time data cannot be loaded  
**So that** I understand there’s a temporary issue rather than a broken site

---

## Functional Requirements

- Fetch weekly prayer times for zone `SGR01` (Selangor) upon page load.
- Display a loading indicator while fetching data.
- Present the prayer timetable clearly with day labels and times (subuh, zuhur, asar, maghrib, isyak).
- If data fetch fails, show a user-friendly error message.

---

## Non-Functional Requirements

- The page should load in under 2 seconds on a standard broadband connection (excluding delays from the external API).
- The UI must be accessible and support screen readers.
- Data is always fetched live from the e-solat.gov.my API.

---

## API Specification

- **Endpoint:** `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=week&zone=SGR01`
- **Method:** GET
- **Expected Response:** JSON array of prayer times for 7 days.

---

## Acceptance Criteria

- [ ] Visiting the root route (`/`) shows a homepage message (e.g., "Homepage").
- [ ] Weekly prayer times for the current week and zone SGR01 are shown in a tabular format.
- [ ] If fetching prayer times fails, an error message ("Failed to fetch prayer time") appears.
- [ ] Data is refreshed on each page load.
- [ ] Layout is mobile responsive and accessible.

---
