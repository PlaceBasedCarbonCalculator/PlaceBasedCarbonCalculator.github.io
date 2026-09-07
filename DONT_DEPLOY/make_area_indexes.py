# -*- coding: utf-8 -*-
"""Generate the browsable area index pages and the sitemap set.

The report pages are query-string driven (`/reports/la.html?id=E08000035`) and
build their content in the browser, so a crawler arriving at /reports/ has
nothing to follow: the search boxes there are JavaScript widgets, not links.
These index pages are the crawl path. Every area report gets one real anchor in
served HTML, with no server-side rewriting and no per-area file.

Inputs are the same id/name lookups the reports index already searches, plus the
LSOA code list from the centroid file. Outputs are committed to the repo, since
there is no build system on deploy.

Re-run whenever an area lookup changes:

    python reports/make_area_indexes.py

Writes:
    reports/{la,wards,parishes,constituencies}/index.html
    reports/lsoa/index.html + reports/lsoa/page-<n>.html
    sitemap.xml (a sitemap index) + sitemap-*.xml
"""
import io
import json
import os
from datetime import date
from html import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://www.carbon.place'
TODAY = date.today().isoformat()

# LSOA codes are opaque and there are 43,064 of them, so the listing is split
# rather than served as one multi-megabyte document.
LSOA_PER_PAGE = 5000


def load(rel):
    with io.open(os.path.join(ROOT, rel), encoding='utf-8') as fh:
        return json.load(fh)


def write(rel, text):
    path = os.path.join(ROOT, rel)
    directory = os.path.dirname(path)
    if directory and not os.path.isdir(directory):
        os.makedirs(directory)
    with io.open(path, 'w', encoding='utf-8', newline='') as fh:
        fh.write(text)
    return len(text.encode('utf-8'))


# ---------------------------------------------------------------------------
# Page shell
# ---------------------------------------------------------------------------

# The other index pages, so each one links to its siblings and a crawler that
# finds any of them can reach the rest.
SIBLINGS = [
    ('/reports/la/', 'Local authorities'),
    ('/reports/wards/', 'Wards'),
    ('/reports/parishes/', 'Parishes'),
    ('/reports/constituencies/', 'Constituencies'),
    ('/reports/lsoa/', 'Neighbourhoods'),
]

SHELL = u"""<!DOCTYPE html>
<html lang="en">
<head>
\t<meta charset="utf-8">
\t<meta name="viewport" content="width=device-width, initial-scale=1">
\t<meta name="Description" content="{description}">
\t<title>{title}</title>
\t<link rel="canonical" href="{canonical}">
{robots}
\t<!-- Social media / Open Graph. og:title and og:description mirror the
\t     page title and meta description above, so there is one source. -->
\t<meta property="og:type" content="website">
\t<meta property="og:site_name" content="Carbon &amp; Place">
\t<meta property="og:locale" content="en_GB">
\t<meta property="og:title" content="{title}">
\t<meta property="og:description" content="{description}">
\t<meta property="og:url" content="{canonical}">
\t<meta property="og:image" content="https://www.carbon.place/images/thumbnail.jpg">
\t<meta property="og:image:width" content="1200">
\t<meta property="og:image:height" content="630">
\t<meta property="og:image:alt" content="Carbon &amp; Place: a map of Great Britain shaded by neighbourhood carbon footprint">
\t<meta name="twitter:card" content="summary_large_image">
\t<meta name="twitter:image" content="https://www.carbon.place/images/thumbnail.jpg">
\t<meta name="twitter:image:alt" content="Carbon &amp; Place: a map of Great Britain shaded by neighbourhood carbon footprint">

\t<link rel="stylesheet" href="/css/main.css">
\t<link rel="stylesheet" href="/css/content-new.css">
\t<!-- Set Up Icon -->
\t<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
\t<link rel="icon" href="/favicon.ico" type="image/x-icon">

\t<!-- Font Awesome -->
\t<link href="/assets/fontawesome/css/fontawesome.css" rel="stylesheet">
\t<link href="/assets/fontawesome/css/solid.min.css" rel="stylesheet">

\t<!-- PWA support -->
\t<link rel="manifest" href="/manifest.webmanifest">
\t<link rel="apple-touch-icon" href="/images/icons/192.png">
\t<meta name="mobile-web-app-capable" content="yes">
\t<meta name="apple-mobile-web-app-capable" content="yes">
\t<meta name="apple-mobile-web-app-title" content="Carbon &amp; Place">
\t<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
\t<meta name="theme-color" content="#ac1a40">
\t<script src="/app.js" defer></script>

\t<!-- Google Analytics, loaded only after the visitor accepts cookies -->
\t<script src="/js/analytics.js"></script>

\t<script type="application/ld+json">
\t{collection_ld}
\t</script>
\t<script type="application/ld+json">
\t{breadcrumb_ld}
\t</script>

<style>
\tbody.content-page .page-lede {{ max-width: 760px; }}
\t.index-nav {{ margin: 0 0 22px; padding: 12px 16px; background-color: #f7f3f4; border: 1px solid #e6d9dd; border-radius: 10px; max-width: 760px; box-sizing: border-box; font-size: 14px; }}
\t/* inline-block so a long row of these wraps onto several lines on a phone
\t   instead of forcing the page wider than the viewport */
\t.index-nav a, .index-nav strong {{ display: inline-block; margin: 2px 14px 2px 0; }}
\t.index-nav strong {{ color: #ac1a40; }}
\t.area-note {{ margin: 12px 0 20px; font-size: 13px; line-height: 1.55; color: #555; border-left: 3px solid #ac1a40; padding-left: 10px; max-width: 760px; }}
\t.area-list {{ list-style: none; padding: 0; margin: 0 0 28px; columns: 260px 4; column-gap: 26px; }}
\t.area-list li {{ break-inside: avoid; margin: 0 0 5px; font-size: 14px; line-height: 1.45; }}
\t.area-group {{ margin: 26px 0 8px; font-size: 17px; padding-bottom: 4px; border-bottom: 1px solid #e6d9dd; }}
\t.area-code {{ color: #6f6367; font-size: 12px; }}
\t.pager {{ margin: 24px 0 8px; padding: 12px 16px; background-color: #f7f3f4; border: 1px solid #e6d9dd; border-radius: 10px; max-width: 760px; box-sizing: border-box; font-size: 14px; }}
\t.pager a, .pager strong {{ display: inline-block; margin: 2px 10px 2px 0; }}
</style>
</head>
<body class="content-page">


<!-- Menu -->
<nav>
\t<a href="/"><img src="/images/ui/logo.webp" alt="Carbon &amp; Place Logo" class="logo" /></a>
\t<a href="/about/">About</a>
\t<a href="/data/">Data</a>
\t<a href="/manual/">Manual</a>
\t<a href="/reports/">Reports</a>
\t<a href="#" id="expandtopnav" class="icon" aria-label="Expand menu"><i class="fa fa-bars"></i></a>
</nav>

<!-- Cookies Warning  -->
<div id="cookiewarning" class="cookiewarning">
\t<p>We use cookies to measure how you use our website so we can understand how you interact with it, which helps us to make improvements. <a href="/privacy/">Find out more.</a></p>
\t<p>
\t\t<button class="button buttonOK" value="1"><strong>OK</strong></button>
\t\t<button class="button buttonNO" value=""><strong>No</strong></button>
\t</p>
</div>

<main class="content">
<p><a href="/reports/">&#8592; All reports</a></p>
<h1>{heading}</h1>
<p class="page-lede">{lede}</p>

<div class="index-nav">{nav}</div>

{body}
</main>

<script type="text/javascript" src="/js/common-nonmap.js"></script>
</body>
</html>
"""


def nav_html(current):
    parts = []
    for href, label in SIBLINGS:
        if href == current:
            parts.append(u'<strong>%s</strong>' % escape(label))
        else:
            parts.append(u'<a href="%s">%s</a>' % (href, escape(label)))
    # Joined on a newline, not an empty string: adjacent inline elements with no
    # whitespace between them give the browser no break opportunity, so the row
    # cannot wrap and forces the page wider than a phone viewport.
    return u'\n'.join(parts)


def page(path, title, description, heading, lede, body, noindex=False):
    canonical = SITE + path
    collection = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': heading,
        'url': canonical,
        'description': description,
        'isPartOf': {'@type': 'WebSite', 'name': 'Carbon & Place', 'url': SITE + '/'},
        'publisher': {'@type': 'Organization', 'name': 'Carbon & Place', 'url': SITE + '/',
                      'logo': SITE + '/images/ui/logo.webp'},
    }
    breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE + '/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Area Reports', 'item': SITE + '/reports/'},
            {'@type': 'ListItem', 'position': 3, 'name': heading, 'item': canonical},
        ],
    }
    return SHELL.format(
        title=escape(title), description=escape(description), canonical=canonical,
        robots=u'\t<meta name="robots" content="noindex, follow">\n' if noindex else u'',
        collection_ld=json.dumps(collection, ensure_ascii=False),
        breadcrumb_ld=json.dumps(breadcrumb, ensure_ascii=False),
        heading=escape(heading), lede=escape(lede),
        nav=nav_html(path), body=body)


def link_list(rows, report_page, show_code=True):
    items = []
    for row in rows:
        code = u' <span class="area-code">%s</span>' % escape(row['id']) if show_code else u''
        items.append(u'\t<li><a href="/reports/%s.html?id=%s">%s</a>%s</li>'
                     % (report_page, escape(row['id']), escape(row['name']), code))
    return u'<ul class="area-list">\n%s\n</ul>' % u'\n'.join(items)


def grouped_list(rows, report_page, la_names):
    """Wards and parishes nest inside a local authority, so group by it."""
    groups = {}
    for row in rows:
        groups.setdefault(row.get('lad') or '', []).append(row)
    out = []
    for lad in sorted(groups, key=lambda c: (la_names.get(c, 'zzz Other').lower(), c)):
        name = la_names.get(lad)
        if name:
            heading = u'<a href="/reports/la.html?id=%s">%s</a>' % (escape(lad), escape(name))
        else:
            heading = u'Other areas'
        out.append(u'<h2 class="area-group">%s</h2>' % heading)
        out.append(link_list(sorted(groups[lad], key=lambda r: r['name'].lower()), report_page))
    return u'\n'.join(out)


# ---------------------------------------------------------------------------
# Build the pages
# ---------------------------------------------------------------------------

la = sorted(load('reports/la.json'), key=lambda r: r['name'].lower())
wards = load('reports/wards.json')
parishes = load('reports/parish.json')
constituencies = sorted(load('reports/westminster.json'), key=lambda r: r['name'].lower())
lsoa_codes = sorted(load('data/lsoa_centroids.json').keys())

la_names = {row['id']: row['name'] for row in la}
written = []

written.append(('reports/la/index.html', write('reports/la/index.html', page(
    '/reports/la/',
    'Local Authority Reports A-Z - Carbon & Place',
    'Every local authority in Great Britain with a Carbon & Place report, listing carbon footprint, transport and housing data for each council area.',
    'Local authority reports',
    'A report for every one of the %d local authorities in Great Britain. Authority figures are built up from neighbourhood (LSOA) data, and because neighbourhoods sit wholly inside council boundaries each one is counted once and in the right place, so these figures compare cleanly between councils.' % len(la),
    link_list(la, 'la')))))

written.append(('reports/constituencies/index.html', write('reports/constituencies/index.html', page(
    '/reports/constituencies/',
    'Constituency Reports A-Z - Carbon & Place',
    'Every Westminster parliamentary constituency in Great Britain with a Carbon & Place report on local carbon, transport and housing.',
    'Westminster constituency reports',
    'A report for every one of the %d Westminster parliamentary constituencies in Great Britain, on the 2024 boundaries. A constituency holds around seventy neighbourhoods (LSOAs), each counted whole in the constituency containing most of its residents.' % len(constituencies),
    link_list(constituencies, 'constituencies')))))

written.append(('reports/wards/index.html', write('reports/wards/index.html', page(
    '/reports/wards/',
    'Ward Reports by Local Authority - Carbon & Place',
    'Every electoral ward in Great Britain with a Carbon & Place report, grouped by local authority.',
    'Ward reports',
    'A report for every one of the %d electoral wards in Great Britain, grouped by the local authority they sit in. Wards are often smaller than a neighbourhood (LSOA), so each neighbourhood is divided between the wards it covers according to where its residents live. That split is a well-founded estimate rather than a measurement, so read figures for small wards with more caution.' % len(wards),
    grouped_list(wards, 'wards', la_names)))))

written.append(('reports/parishes/index.html', write('reports/parishes/index.html', page(
    '/reports/parishes/',
    'Parish Reports by Local Authority - Carbon & Place',
    'Every civil parish in England and Wales with a Carbon & Place report, grouped by local authority.',
    'Parish reports',
    'A report for every one of the %d civil parishes, grouped by the local authority they sit in. Parish figures carry the most uncertainty of any level on this site: a parish is frequently much smaller than a neighbourhood (LSOA), so several parishes may share one between them, and the figures for a small parish partly describe the wider area around it.' % len(parishes),
    grouped_list(parishes, 'parishes', la_names)))))

# --- Neighbourhoods --------------------------------------------------------
# There is no static LSOA name lookup on the site (the report reads its context
# from the lsoa_overview bin at runtime), so these can only be listed by code.
# Anyone browsing wants the postcode search; the listing exists so the reports
# are reachable by following links.
pages = [lsoa_codes[i:i + LSOA_PER_PAGE] for i in range(0, len(lsoa_codes), LSOA_PER_PAGE)]


def lsoa_path(n):
    return '/reports/lsoa/' if n == 1 else '/reports/lsoa/page-%d.html' % n


def pager(current):
    parts = []
    for n in range(1, len(pages) + 1):
        label = u'%s to %s' % (pages[n - 1][0], pages[n - 1][-1])
        if n == current:
            parts.append(u'<strong>%s</strong>' % escape(label))
        else:
            parts.append(u'<a href="%s">%s</a>' % (lsoa_path(n), escape(label)))
    return u'<div class="pager">%s</div>' % u'\n'.join(parts)


for n, chunk in enumerate(pages, start=1):
    items = u'\n'.join(u'\t<li><a href="/reports/lsoa.html?id=%s">%s</a></li>' % (c, c) for c in chunk)
    body = []
    if n == 1:
        body.append(u'<p class="area-note">Neighbourhood codes are the ONS 2021 LSOA codes in England and Wales '
                    u'and Data Zone codes in Scotland. If you know the place rather than the code, the '
                    u'<a href="/reports/">postcode search</a> on the reports page is the quicker way in.</p>')
    body.append(pager(n))
    body.append(u'<ul class="area-list">\n%s\n</ul>' % items)
    body.append(pager(n))
    rel = 'reports/lsoa/index.html' if n == 1 else 'reports/lsoa/page-%d.html' % n
    written.append((rel, write(rel, page(
        lsoa_path(n),
        ('Neighbourhood Reports A-Z - Carbon & Place' if n == 1
         else 'Neighbourhood Reports %s to %s - Carbon & Place' % (chunk[0], chunk[-1])),
        'Every neighbourhood (LSOA and Data Zone) in Great Britain with a Carbon & Place report on local carbon, transport and housing.',
        'Neighbourhood reports',
        'A report for every one of the %s neighbourhoods in Great Britain: Lower Layer Super Output Areas in England and Wales, and Data Zones in Scotland. Each covers roughly 1,500 to 3,000 residents. This page %s of %d listing them by code.'
        % ('{:,}'.format(len(lsoa_codes)), 'is part 1' if n == 1 else 'is part %d' % n, len(pages)),
        u'\n'.join(body)))))


# ---------------------------------------------------------------------------
# Sitemaps
# ---------------------------------------------------------------------------

# The site's fixed pages. Kept here so one script owns the whole sitemap set.
STATIC_PAGES = [
    ('/', '1.00'),
    ('/pbcc/', '0.90'), ('/transport/', '0.90'), ('/retrofit/', '0.90'),
    ('/landuse/', '0.90'), ('/landownership/', '0.90'),
    ('/reports/', '0.80'),
    ('/reports/la/', '0.70'), ('/reports/wards/', '0.60'),
    ('/reports/parishes/', '0.60'), ('/reports/constituencies/', '0.70'),
    ('/reports/lsoa/', '0.50'),
    ('/manual/', '0.80'), ('/data/', '0.80'),
    ('/about/', '0.70'), ('/about/faq/', '0.60'), ('/about/feedback/', '0.40'),
    ('/privacy/', '0.30'),
]
LEGACY_PAGES = [
    ('/legacy/', '0.10'), ('/legacy/about/', '0.10'), ('/legacy/data/', '0.10'),
    ('/legacy/la/', '0.10'), ('/legacy/privacy/', '0.10'),
]


def urlset(entries, lastmod=TODAY):
    out = [u'<?xml version="1.0" encoding="UTF-8"?>',
           u'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, priority in entries:
        out.append(u'<url><loc>%s%s</loc><lastmod>%s</lastmod><priority>%s</priority></url>'
                   % (SITE, loc, lastmod, priority))
    out.append(u'</urlset>')
    return u'\n'.join(out) + u'\n'


def area_entries(rows, report_page, priority):
    return [('/reports/%s.html?id=%s' % (report_page, r['id']), priority) for r in rows]


sitemaps = [
    ('sitemap-pages.xml', urlset(STATIC_PAGES + [(lsoa_path(n), '0.40') for n in range(2, len(pages) + 1)]
                                 + LEGACY_PAGES)),
    ('sitemap-la.xml', urlset(area_entries(la, 'la', '0.70'))),
    ('sitemap-constituencies.xml', urlset(area_entries(constituencies, 'constituencies', '0.60'))),
    ('sitemap-wards.xml', urlset(area_entries(wards, 'wards', '0.50'))),
    ('sitemap-parishes.xml', urlset(area_entries(parishes, 'parishes', '0.40'))),
    # 43,064 URLs. Comfortably inside the 50,000 per-file limit, but it is by far
    # the largest and lowest-yield set, so it is kept in its own file: drop the
    # entry from the index below if it proves to be soaking up crawl budget.
    ('sitemap-lsoa.xml', urlset([('/reports/lsoa.html?id=%s' % c, '0.30') for c in lsoa_codes])),
]

for name, text in sitemaps:
    written.append((name, write(name, text)))

index = [u'<?xml version="1.0" encoding="UTF-8"?>',
         u'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for name, _ in sitemaps:
    index.append(u'<sitemap><loc>%s/%s</loc><lastmod>%s</lastmod></sitemap>' % (SITE, name, TODAY))
index.append(u'</sitemapindex>')
written.append(('sitemap.xml', write('sitemap.xml', u'\n'.join(index) + u'\n')))

for rel, size in written:
    print('%-38s %9s bytes' % (rel, '{:,}'.format(size)))
print('\n%d local authorities, %d wards, %d parishes, %d constituencies, %s neighbourhoods'
      % (len(la), len(wards), len(parishes), len(constituencies), '{:,}'.format(len(lsoa_codes))))
