# LMIA Tech Finder

A frontend-only React application to browse and filter Canadian employers who received a positive Labour Market Impact Assessment (LMIA) for technology positions, based on the quarterly Positive LMIA Employers List published by the Government of Canada (Temporary Foreign Worker Program).

## What it does

The Canadian government publishes quarterly reports listing every employer granted a positive LMIA, along with the National Occupational Classification (NOC 2021) code of each approved position, the program stream, business location and number of positions. This app loads those reports and provides a focused workflow for software engineers looking for Canadian employers that actively sponsor foreign tech talent.

## Features

- Loads the four 2025 quarterly POS reports (Q1–Q4) from `public/data/` at runtime using SheetJS, no backend required.
- Unified, virtualized table over the combined dataset, with sorting and pagination.
- Filters pre-configured for tech NOC codes (21xxx series: software engineers, developers, data scientists, systems specialists, etc.), plus filters by province, program stream and quarter.
- Fuzzy employer search.
- Per-row checkbox to mark employers already contacted. Applied state is persisted to `localStorage`.
- Export the list of contacted employers as a Markdown file and import it back, so tracking state is portable between browsers or machines.
- Quick link to LinkedIn company search for each row.

## Stack

- Vite 7 + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui + Radix UI
- @tanstack/react-table + @tanstack/react-virtual
- SheetJS (`xlsx`) for parsing the quarterly reports
- Zustand with persist middleware for applied-state storage
- @phosphor-icons/react for icons
- Biome + Ultracite for lint and format

## Data source

Quarterly XLSX files from the official page: *Employers Who Were Issued a Positive Labour Market Impact Assessment (LMIA) by Program Stream, National Occupational Classification (NOC) 2021 and Business Location*, published by Employment and Social Development Canada. Files are placed manually in `public/data/` and served statically — they are not committed to the repository.

## Development

```bash
npm install
npm run dev
```

Place the four XLSX files in `public/data/` as:

```
public/data/TFWP_2025_Q1_POS.xlsx
public/data/TFWP_2025_Q2_POS.xlsx
public/data/TFWP_2025_Q3_POS.xlsx
public/data/TFWP_2025_Q4_POS.xlsx
```

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview production build
- `npm run typecheck` — run TypeScript without emitting
- `npm run check` — Ultracite check
- `npm run fix` — Ultracite fix

## Disclaimer

This tool is a personal utility for navigating public data. It does not modify, redistribute or enrich the source dataset beyond filtering and presentation. All information shown originates from the public reports published by the Government of Canada.
