# LMIA Tech Finder

A frontend-only React application to browse and filter Canadian employers who received a positive Labour Market Impact Assessment (LMIA) for technology positions, based on the quarterly Positive LMIA Employers List published by the Government of Canada (Temporary Foreign Worker Program).

## What it does

The Canadian government publishes quarterly reports listing every employer granted a positive LMIA, along with the National Occupational Classification (NOC 2021) code of each approved position, the program stream, business location and number of positions. This app loads those reports and provides a focused workflow for software engineers looking for Canadian employers that actively sponsor foreign tech talent.

## Features

- Loads quarterly XLSX files from `public/data/` at runtime using SheetJS, no backend required. New quarters are picked up automatically via a generated manifest.
- Unified table over the combined dataset, with sorting and pagination.
- Tech-only filter enabled by default — focuses on tech NOC codes (21xxx series: software engineers, developers, data scientists, systems specialists, etc.).
- Group by employer toggle — collapses all records per company into a single row, summing total approved positions and aggregating NOC codes, occupation titles and program streams.
- Fuzzy employer search, plus filters by province, program stream and quarter.
- Per-row checkbox to mark employers as contacted (email and/or LinkedIn), with timestamps. Applied state is persisted to `localStorage`. Contacted rows are visually dimmed.
- Export tracked employers as a Markdown file and import it back, so tracking state is portable between browsers or machines.
- Quick link to LinkedIn company search for each row.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui + Radix UI
- @tanstack/react-table for sorting, pagination and column management
- SheetJS (`xlsx`) for parsing the quarterly reports
- Zustand with persist middleware for applied-state storage
- @phosphor-icons/react for icons
- Sonner for toast notifications
- Biome + Ultracite for lint and format

## Data source

Quarterly XLSX files from the official page: *Employers Who Were Issued a Positive Labour Market Impact Assessment (LMIA) by Program Stream, National Occupational Classification (NOC) 2021 and Business Location*, published by Employment and Social Development Canada. Files are placed manually in `public/data/` and served statically — they are not committed to the repository.

## Development

```bash
npm install
npm run dev
```

Place XLSX files in `public/data/` following the naming convention `YYYY_Q[1-4].xlsx`, from newest to oldest:

```
public/data/2026_Q1.xlsx
public/data/2025_Q4.xlsx
public/data/2025_Q3.xlsx
...
```

The manifest is regenerated automatically before `dev` and `build`. To regenerate it manually:

```bash
npm run manifest
```

## Scripts

- `npm run dev` — regenerate manifest and start Vite dev server
- `npm run build` — regenerate manifest, type-check and build for production
- `npm run manifest` — scan `public/data/` and regenerate `manifest.json`
- `npm run preview` — preview production build
- `npm run typecheck` — run TypeScript without emitting
- `npm run check` — Ultracite check
- `npm run fix` — Ultracite fix

## Disclaimer

This tool is a personal utility for navigating public data. It does not modify, redistribute or enrich the source dataset beyond filtering and presentation. All information shown originates from the public reports published by the Government of Canada.
