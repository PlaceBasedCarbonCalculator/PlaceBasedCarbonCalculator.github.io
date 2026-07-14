# Carbon & Place Website Upgrade Plan

## Objective
Create a major website upgrade for Carbon & Place that improves reliability, usability, search visibility, analytics insights, and the core data explorer experience across PBCC, transport, retrofit, landownership, and landuse.

The plan below is written so an AI or developer can follow it sequentially and clearly.

---

## 1. Code Audit and Quality

Goal: Discover and fix existing functional bugs, remove technical debt, and ensure pages behave consistently.

Tasks:
- Review all HTML, JS, and CSS files for syntax issues, dead code, and broken references.
- Verify all pages use the shared `js/ui-common.js`, `js/settings-common.js`, and `js/datasets-common.js` patterns correctly.
- Confirm service worker cache entries in `sw.js` are correct and cover all deployed pages and assets.
- Test the map tools in a local web server and note any console errors or broken user flows.

Acceptance criteria:
- No console errors on page load for the main site and feature tools.
- `sw.js` serves the correct files and does not reference missing assets.
- Shared UI behaviors work consistently across feature folders.

Known issues to address:
- `js/ui-common.js` currently parses URL hash state only in one specific format and may not support richer report hash state or query parameters.
- `sw.js` has a typo in the pre-cache list (`/landownership/datsets.js`) and uses two separate cache names, which can cause inconsistent offline behavior.
- `manifest.webmanifest` uses `start_url: "./"` and `scope: "./"`, which is likely too narrow for subfolders such as `/pbcc/` and `/transport/`.
- `pbcc/ui.js` hardcodes the PBCC year array as 2010-2020 in `makeChartOverview()`, so the UI must be updated for 2022.
- `js/common-nonmap.js` manages analytics consent, but pages still load Google Analytics/Tag Manager scripts unconditionally.
- `js/ui-common.js` uses `placeholder_name` in `initialiseDatasets()` for layer insertion, which may result in uncontrolled layer ordering.

---

## 2. PWA and Offline Support

Goal: Ensure the website fully supports the Progressive Web App standard and works reliably offline.

Tasks:
- Verify `manifest.webmanifest` is complete and correctly linked from all pages.
- Confirm service worker registration and caching behavior in `sw.js` works for the website and all feature pages.
- Ensure pages are served over HTTPS in deployment and include correct PWA metadata (`theme-color`, icons, manifest, `apple-mobile-web-app-*` tags).
- Test offline fallback behavior, cache updates, and page reloads with the service worker.
- Add or update documentation or checklist for PWA compliance.

Acceptance criteria:
- The site has a valid web app manifest referenced from pages.
- The service worker installs, activates, and caches assets successfully.
- The website can load at least an offline fallback page when the network is unavailable.
- PWA metadata validates in browser dev tools and installation prompts are supported where available.

---

## 3. URL State and Shareable Reports

Goal: Enable deep linking to specific map reports, area popups, and shared views across tools.

Tasks:
- Consolidate URL hash logic in `js/ui-common.js` so layer state and map state are parsed consistently.
- Add support for shareable popup/report IDs via hash or query string in tool pages like `pbcc/index.html`, `transport/index.html`, and others.
- Define a stable hash format, e.g. `#/report/E01000001` or `#/zones/#8/51.5/-0.1/report/E01000001`.
- Ensure map view and popup load from hash on initial page load.
- Add coordinates to data JSON if needed so the map can pan to the selected report target without requiring a click.

Acceptance criteria:
- A direct URL opens a page and immediately shows the correct popup/report.
- The map pans/zooms in the background if needed to match the report target.
- Sharing the URL preserves the selected layer and report state.

---

## 4. Add RESP / Administrative Boundaries

Goal: Add RESP boundaries alongside existing boundary layers so users can compare neighbourhood data to policy areas.

Tasks:
- Identify source data and boundary IDs for RESP boundaries. A likely source is the Northern Powergrid RESP dataset: https://northernpowergrid.opendatasoft.com/explore/dataset/resp-shapefile/information/?disjunctive.resp25
- Determine whether new vector/tile datasets are required and whether these need to be generated in the R-based build pipeline located at `../build`.
- Update the build repo pipeline to ingest, process, and export RESP geometry and metadata if new data is required.
- Add a new boundary layer configuration in `js/datasets-common.js` or the relevant tool dataset file.
- Add layer controls, legend entry, and help text for RESP boundaries.
- Ensure RESP boundaries are included in URL share state if displayed.

Acceptance criteria:
- RESP boundaries can be toggled on/off from the layer control panel.
- They appear above fill layers and below labels/placenames.
- The help text explains what RESP boundaries represent.
- Any new RESP data is generated from the `../build` pipeline and integrated into the website build.

---

## 5. Layer Rendering and Map Control

Goal: Improve map layer ordering, visual clarity, and consistent layer controls across tools.

Tasks:
- Audit each tool's layer order and placement logic in `datasets.js` and tool-specific `ui.js` files.
- Add explicit layer order handling where needed so roads render behind 3D buildings but above zones, and boundaries render above fill layers.
- Add a names toggle for administrative boundary layers so users can show/hide labels for LA, parish, ward, constituency, etc., while keeping main LSOA boundary labels off by default.
- Verify layer visibility toggles and legend updates are stable.
- Ensure basemap and placename toggles do not interfere with terrain and symbol layers.

Acceptance criteria:
- Boundaries and labels remain readable at all zoom levels.
- 3D building and road order is correct for each tool.
- Users can clearly toggle layers without visual glitches.
- Administrative boundary labels can be toggled on/off independently from the main LSOA boundaries.

---

## 6. Aggregated Reports for LA / Ward / Parish / Constituency

Goal: Build summaries across all tools for higher-level administrative areas using common aggregation logic.

Tasks:
- Inventory available area geometries in `js/datasets-common.js` and per-tool datasets.
- Determine which aggregated data products need to be generated in the R-based build pipeline at `../build`.
- Update the build repo pipeline to compute and export area-level summaries for Local Authority, Ward, Parish, and Constituency.
- Add a report generation layer or modal for Local Authority, Ward, Parish, and Constituency summaries.
- Create common aggregation utilities to compute area totals, averages, and key indicators from tool data.
- Provide a shared dashboard or dedicated report page for each area type, preferably in `reports/`.
- Ensure the new reports use the same narrative structure and can be linked from tool popups.

Acceptance criteria:
- LA/Ward/Parish/Constituency summaries exist and load from the common data sources.
- Required aggregated data files are produced by the `../build` pipeline and consumed by the website.
- Users can access summary reports from tool popups and from `reports/` pages.
- The reports are consistent across tools and reference the same definitions.
- The homepage postcode search routes users to a combined LSOA report with tool links.

---

## 7. Update PBCC Results to 2010-2022

Goal: Integrate the already-updated PBCC 2010-2022 data into the website and make sure the interface reflects the new time range.

Tasks:
- Identify where the PBCC UI, chart settings, labels, and tooltips currently assume a 2010-2020 timeseries.
- Update the website to load the new 2021-2022 PBCC output files and ensure any file paths or data keys match the updated exports.
- Update any year-range labels, chart axes, report summaries, and text descriptions to reference 2010-2022.
- Test the PBCC tool to verify the extended timeseries displays correctly and that all charts, popups, and summaries include the new years.

Acceptance criteria:
- PBCC tool data includes years 2010 through 2022.
- Website charts and reports correctly display the updated year range.
- No UI or data loading errors occur because of the added years.

---

## 8. Isochrones in Transport Tool

Goal: Bring isochrone functionality from legacy PBCC into `transport` so users can inspect accessibility and travel time.

Tasks:
- Review legacy isochrone code in `legacy/js/layer_control.js` and any other legacy files supporting `isochrones`.
- Determine how transport datasets can expose travel time polygons or layer sources.
- Add isochrone layer toggle to `transport/index.html` and configure the corresponding source/layer in `transport/datasets.js`.
- Add removal and refresh logic to avoid duplicate layers.
- Add help content in the manual and a help button in the transport UI.

Acceptance criteria:
- Users can enable/disable isochrones in the transport tool.
- Transport isochrones render correctly and respond to map interactions.
- No stale or duplicate `isochrones` sources remain after toggling.

---

## 9. Homepage Postcode Search and Combined LSOA Report

Goal: Add an accessible postcode search on the homepage that opens a combined local report for the correct LSOA and links into the core map tools.

Tasks:
- Add a postcode search input on `index.html` that validates UK postcode formatting.
- Use a postcode-to-LSOA lookup service or build a local postcode lookup dataset in `../build` if external API access is not acceptable.
- Route successful lookups to a combined report page or a report view that uses `?lsoa={LSOA}` or `?id={LSOA}` semantics.
- Ensure the combined report page shows the resolved LSOA, local authority, ward/parish/constituency metadata, and links to `pbcc`, `transport`, `retrofit`, `landownership`, and `landuse` tools.
- Include clear error messaging for invalid postcodes or missing lookup results.
- Add analytics event tracking for postcode searches and report navigation.

Acceptance criteria:
- The homepage supports postcode search and routes users to a combined LSOA report.
- The report page includes contextual links to the main tools.
- Invalid postcode inputs produce a user-friendly error message.
- The search workflow is explicitly reflected in the site’s shareable URL/query parameter design.

---

## 10. Start Here Experience and Tool Tutorials

Goal: Add a beginner-friendly onboarding layer that explains how to use the website tools and offers optional tutorial mode guidance for each feature.

Tasks:
- Add a high-level “Start Here” intro to the homepage or main navigation that explains the purpose of PBCC, transport, retrofit, landownership, and landuse tools.
- Provide a brief step-by-step orientation for first-time visitors, with links to each tool and the combined report workflow.
- Add an optional tutorial mode inside each tool that walks users through the interface, key controls, and how to interpret the main charts/maps.
- Consider using a simple in-page overlay, modal, or guided tour with a “Skip tutorial” option.
- Ensure tutorial mode is optional, non-intrusive, and can be restarted from the tool help or settings.

Acceptance criteria:
- The website has a clear “Start Here” onboarding path for new users.
- Each major tool can optionally enter a tutorial mode that highlights UI elements and explains task flow.
- The onboarding copy is concise and accessible for general audiences.
- Users can dismiss or restart tutorials without losing their current map/report state.

---

## 11. Documentation and In-Tool Help Improvements

Goal: Improve user guidance by adding richer narrative help and structured manual sections for every graph.

Tasks:
- Standardize help content format in the tools using the tab structure: Overview, Policy, Methods.
- Update each tool's help buttons and manual anchors to reflect this structure.
- Audit existing tool and manual content in `manual/index.md` and identify missing or low-quality sections.
- Add contextual help for the key graph types and map features in PBCC, transport, retrofit, landownership, and landuse.

Acceptance criteria:
- Every major chart/feature has an Overview, Policy, and Methods tab or section.
- Tool help buttons open the correct manual content.
- The manual is easier for the general public, policymakers, and academic users to navigate.

---

## 12. SEO and Structured Data

Goal: Improve search performance and page discoverability with better metadata and rich snippets.

Tasks:
- Update meta descriptions to 150-160 characters for all main pages and feature pages.
- Add or fix missing `<h1>` tags on pages such as `landownership/index.html` and other feature pages.
- Standardize title tags to 50-60 characters with descriptive terms and tool names.
- Add JSON-LD structured data for site navigation, organization, breadcrumbs, and tool pages.
- Verify canonical URLs and social meta tags are correct.

Acceptance criteria:
- All pages have a unique meta description in the recommended length range.
- Each tool page has one valid `<h1>` and matching `<title>` text.
- Structured data validates in Google’s Rich Results test.
- Social preview metadata is consistent.

---

## 13. Analytics and Event Tracking

Goal: Capture more useful analytics without harming privacy or consent requirements.

Tasks:
- Review `js/common-nonmap.js` and tool-specific analytics consent handling in `landownership/ui.js` etc.
- Add event tracking for key interactions: layer toggles, popup opens, report sharing, help button clicks, and filter changes.
- Validate Google Analytics / Google Tag Manager setup on the main site and feature pages.
- Add test cases to verify analytics events fire only after cookie consent is granted.

Acceptance criteria:
- Key UI events are tracked and distinguishable in the analytics backend.
- Consent logic remains compliant and does not fire analytics before opt-in.
- The analytics implementation works on both development and deployed URLs.

---

## 14. Project Roadmap and Priorities

1. Audit and fix the core codebase.
2. Ensure PWA/offline support.
3. Standardize URL/hash handling and shareable reports.
4. Add RESP boundaries and improve layer rendering.
5. Build aggregated area reports.
6. Update PBCC timeseries to 2010-2022.
7. Implement transport isochrones from legacy PBCC.
8. Add homepage postcode search and combined LSOA reporting.
9. Create a Start Here experience with optional tool tutorials.
10. Enhance documentation and manual content.
11. Optimize SEO and structured data.
12. Improve analytics tracking.

---

## 14. Implementation Notes for AI

- Use `js/ui-common.js` for shared map and URL state logic.
- Use `js/settings-common.js` and `js/datasets-common.js` to keep tool-specific changes minimal.
- Inspect `pbcc/ui.js` for PBCC chart time-series logic and ensure the 2010-2022 year range is reflected.
- Review `sw.js`, `app.js`, and `manifest.webmanifest` for PWA support, including pre-cache lists, cache names, and manifest scope/start_url.
- Add or update HTML metadata in the feature page templates such as `pbcc/index.html`, `transport/index.html`, `landownership/index.html`, and `index.html`.
- Add postcode search UI and lookup routing in `index.html`, and define query-param based report routing for combined LSOA reports.
- If external postcode lookup is used, specify fallback behavior or a local `../build` postcode-to-LSOA lookup dataset.
- Check `js/common-nonmap.js` analytics consent logic alongside page-level GA/GTM includes.
- Refer to legacy isochrone code in `legacy/js/layer_control.js` and `legacy/js/map_later.js` when implementing transport isochrones.
- Keep the codebase consistent with the existing static HTML + vanilla JS architecture.
- Prefer small, incremental changes with tests on a local server before committing.

---

## 15. Success Criteria

The upgrade is complete when:
- Shared UI works across feature pages with no JavaScript errors.
- Deep links and shareable report URLs work reliably.
- Transport includes isochrone map functionality.
- RESP boundaries are available and correctly rendered.
- Admin area summaries exist for LA, wards, parishes, and constituencies.
- SEO metadata and structured data are implemented.
- Analytics tracks meaningful user actions with consent.
- The manual has clear Overview, Policy, and Methods guidance.

