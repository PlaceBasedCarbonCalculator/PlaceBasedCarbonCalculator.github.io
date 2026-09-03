## About this manual

Carbon & Place is a family of free tools that show how carbon footprints, and the things that shape them, vary from neighbourhood to neighbourhood across Great Britain. It is developed at the [University of Leeds](https://www.leeds.ac.uk/) and funded by the [Energy Demand Research Centre](https://www.edrc.ac.uk/).

The manual is written for three groups of readers, and each tool's chapter is arranged so that you can stop at the level of detail you need:

* **Everyone**: each chapter opens with a plain-language account of the subject and of what the data can tell you about your own area. These sections assume no prior knowledge of carbon accounting, transport planning, or statistics.
* **Policymakers, planners, and community groups**: the middle of each chapter walks through the map layers and report cards, what the numbers can and cannot tell you, and links to the official datasets behind them.
* **Academics and technical users**: each chapter ends with methods sections describing how the analysis was carried out, the assumptions made, and the known limitations, with links to sources and further reading.

The manual is revised as the tools develop. You are welcome to suggest improvements or contribute directly via [GitHub](https://github.com/PlaceBasedCarbonCalculator/PlaceBasedCarbonCalculator.github.io/blob/dev/manual/index.md).

Carbon & Place is built in the open, and the analysis behind every map is published. The [Carbon & Place organisation on GitHub](https://github.com/PlaceBasedCarbonCalculator) holds the code, and the methods sections of this manual link to the specific repository for each analysis:

* **[build](https://github.com/PlaceBasedCarbonCalculator/build)**: the main analysis pipeline, written in R using [targets](https://books.ropensci.org/targets/). It assembles every dataset behind the Place-Based Carbon Calculator.
* **[EPC](https://github.com/PlaceBasedCarbonCalculator/EPC)**: parses, cleans, and harmonises Energy Performance Certificates for England, Wales, and Scotland, and matches them to addresses.
* **[PublicTransportAnalysis](https://github.com/PlaceBasedCarbonCalculator/PublicTransportAnalysis)**: measures scheduled public transport service for every neighbourhood in Great Britain, for each year from 2004.
* **[LandOwnership](https://github.com/PlaceBasedCarbonCalculator/LandOwnership)**: cleans the INSPIRE polygons and geocodes the Land Registry corporate ownership datasets.
* **[GBDEM](https://github.com/PlaceBasedCarbonCalculator/GBDEM)**: builds the high-resolution terrain and surface models of Great Britain.
* **[GBsolar](https://github.com/PlaceBasedCarbonCalculator/GBsolar)**: derives the national solar resource map from the surface model.
* **[inputdata](https://github.com/PlaceBasedCarbonCalculator/inputdata)** and **[outputdata](https://github.com/PlaceBasedCarbonCalculator/outputdata)**: the open inputs to, and outputs from, the pipeline.
* **[PlaceBasedCarbonCalculator.github.io](https://github.com/PlaceBasedCarbonCalculator/PlaceBasedCarbonCalculator.github.io)**: this website.

The pipeline is demanding to run: it is designed for a machine with more than 36 cores and 256&nbsp;GB of memory, takes several days, and produces over 70&nbsp;GB of output. Most people will find the [data downloads](/data/) more practical than rebuilding it. Some inputs are licensed in ways that prevent republication; where that is the case, the repository holds a placeholder describing the dataset and how to obtain it.

Short extracts of this manual can be read within the tools by clicking the <i class="fa fa-question-circle" aria-hidden="true" style="color: #a40125;"></i> help buttons.

## Getting Started

### Which tool do I need?

Carbon & Place is a collection of tools that share a common map interface. Each focuses on a different question:

* **[Place-Based Carbon Calculator](/pbcc/)**: What is the carbon footprint of my neighbourhood, what causes it, and how has it changed over time?
* **[Transport and Accessibility Explorer](/transport/)**: How good are public transport, walking, and cycling options here, and how car dependent is this area?
* **[Retrofit Explorer](/retrofit/)**: How energy efficient are the buildings in this area, what do they cost to heat, and where is the greatest need for insulation and low-carbon heating?
* **[Land Ownership Explorer](/landownership/)**: Who owns the land and property in this area, according to official Land Registry records?
* **[Land Use and Planning Explorer](/landuse/)**: What planning designations, environmental constraints, and protections apply to this area?
* **[Area Reports](/reports/)**: Ready-made summaries for local authorities, wards, parishes, and Westminster constituencies that draw together data from all the tools.

### Your first visit

If you are new to Carbon & Place, the following steps are the quickest way to begin:

1. **Search for your postcode** on the [homepage](/). This takes you to a report about your own neighbourhood, which is usually the easiest place to start because you can judge the data against your local knowledge.
2. **Open one of the map tools** and take the short guided tour when offered. The tour highlights the main controls one at a time and can be skipped or restarted at any point.
3. **Click on a neighbourhood** on the map. Most tools open a report card with charts, tables, and comparisons to local and national averages.
4. **Use the <i class="fa fa-question-circle" aria-hidden="true" style="color: #0b38e6;"></i> help buttons** next to any control or chart you are unsure about. They open the relevant section of this manual without leaving the tool.
5. **Share what you find.** As you explore, the web address updates to record your position, the layers you have turned on, and any open report. Copying the address lets someone else see exactly the same view.

### Making sense of the numbers

A few points will help you interpret everything else in the tools:

* **Carbon footprints are measured in kilograms of carbon dioxide equivalent (kgCO<sub>2</sub>e)**. Carbon dioxide is the main greenhouse gas, and other gases (such as methane) are converted into the amount of CO<sub>2</sub> that would cause the same warming, so that everything can be added together. A typical UK resident's footprint is measured in thousands of kilograms (tonnes) per year.
* **Values are usually per person per year**, so that large and small neighbourhoods can be compared fairly.
* **Grades (A+ to F-) are relative, not absolute.** An A+ neighbourhood has a low footprint compared with other British neighbourhoods, not a sustainable footprint in any absolute sense. The [Climate Change Act 2008](https://www.legislation.gov.uk/ukpga/2008/27/contents) commits the UK to net zero by 2050, which will require substantial reductions almost everywhere.
* **Neighbourhood statistics are averages.** Each area contains hundreds of households, and no single household is average. The data describes places, not individuals.
* **Many values are modelled estimates.** Where no measured data exists at neighbourhood level, the tools use models based on surveys and census data. Estimates are most reliable when comparing places or tracking trends, and least reliable when read as a precise value for one small area in one year. The *Methods and data* sections explain how each estimate is produced.

## Common User Interface

Most Carbon & Place tools are built around an interactive map, with map controls on the left and layer controls on the right. This section describes the features that appear in every tool.

### Accessing Carbon & Place

The easiest way to access Carbon & Place is through the website at [www.carbon.place](https://www.carbon.place).

Carbon & Place is also a [Progressive Web App](https://en.wikipedia.org/wiki/Progressive_web_app) that can be installed on many devices, including smartphones. The app provides the same features as the website, plus a home screen icon and full screen support.

If your device supports installing the app, an Install button appears on the [homepage](/).

![Install Button](/images/manual/install.webp)

*The install button appears on the homepage when your device supports installing apps.*

You may need to use your operating system's default browser to install the app:

* Android: Chrome
* iOS: Safari
* Windows 10 and 11: Microsoft Edge
* macOS: Safari

### Map Controls

![Map controls](/images/manual/map_controls.webp)

*The map is navigated using the controls at the top left of the screen.*

Carbon & Place provides a choice of basemaps. The example below shows the basemap options with the satellite basemap and 3D terrain enabled. Clicking the basemap button again hides the options.

![Basemap controls](/images/manual/basemap_controls.webp)

Basemaps include copyrighted material such as [Ordnance Survey](https://osdatahub.os.uk/downloads/open/OpenZoomstack) data and third party maps produced by the [National Library of Scotland](http://maps.nls.uk/projects/subscription-api/), [OpenStreetMap](https://www.openstreetmap.org/copyright), [Thunderforest](https://www.thunderforest.com/terms/), and [ESRI](https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9). Please check the copyright status of the basemap before reproducing screenshots from Carbon & Place. The default maps (OS greyscale, Outdoors, and Dark) are Open Data under the [Open Government Licence](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/) and are free to reuse with attribution.

The anti-alias option enables advanced rendering that makes the map look smoother and clearer, but it may reduce performance on low-end devices.

### Layer Controls

![Layer Controls](/images/manual/layer_controls.webp)

The layer controls on the right side of the map determine what information is shown. Tick a layer to display it, and use the drop-down menus to change which measure colours the map. The legend updates to match your selection, and section headings expand and collapse when clicked.

### Report Cards

In the Place-Based Carbon Calculator, Transport, and Retrofit tools, clicking a neighbourhood opens its report card: a set of tabs containing charts, tables, and comparisons for that area. Many charts are accompanied by three short explanations, which you can switch between depending on the level of detail you want:

* **Overview**: what the chart shows, in plain language.
* **Policy**: why the measure matters for local and national decision making.
* **Methods**: where the data comes from and how the values were calculated.

<!-- #data-warnings -->
#### Data warnings

Some neighbourhoods show one or more warnings in a coloured box at the top of the report card. A warning does not mean the figures are wrong, but it does flag something about the area, or about the data recorded for it, that is worth knowing before reading the charts. You can open this explanation at any time using the question mark beside a warning.

Most warnings concern boundaries. Carbon & Place reports every year of history on the neighbourhood boundaries in use today, so where a boundary has changed the older figures have had to be moved onto the new one. The [Office for National Statistics](https://www.ons.gov.uk/methodology/geography/ukgeographies/censusgeographies/census2021geographies) revises Lower layer Super Output Areas at each census, recording for every area whether it was left unchanged, split, merged, or redrawn in a more complicated way. The warnings below follow those categories. Where an area is affected, comparisons with the rest of the country remain sound, but changes over time within that one neighbourhood should be read with more caution than usual.

**The 2022 Census in Scotland changed Data Zone boundaries substantially; historical data has been adjusted onto the new boundaries**

Scotland held [its census](https://www.scotlandscensus.gov.uk/) in 2022, a year later than England and Wales, and the Data Zone boundaries were revised afterwards. Figures for years before the revision have been reallocated from the old Data Zones to the new ones. Totals for Scotland as a whole are unaffected, but a jump between one year and the next in this area may reflect the change of boundary rather than a real change on the ground.

**This LSOA had a complex boundary change between 2011 and 2021; historical data is taken from the closest matching earlier LSOA**

This neighbourhood was neither left alone nor cleanly split or merged: its boundary was redrawn in a way that exchanges land with several neighbours at once. There is no exact way to carry the older figures across such a change, so the historical values shown are those of the earlier neighbourhood that overlaps this one most closely. The recent years are unaffected, and the general level of the older values should be about right, but small year-to-year movements before the change may be an artefact of the matching.

**This LSOA was formed in 2021 by merging two LSOAs; their historical data has been added together**

Where a population falls far enough, the ONS combines two neighbourhoods into one. The historical figures for the two former areas have been added together, so counts such as total emissions or numbers of vehicles are consistent across the join. Values expressed per person or per household are also consistent, because both the totals and the populations were combined. The one thing lost is the difference between the two former areas, which may have been quite unlike each other.

**This LSOA was formed in 2021 by splitting an earlier LSOA; its historical data has been divided between the new areas**

Where a population grows far enough, typically through new housing, the ONS divides a neighbourhood into two or more. The historical figures for the former, larger area have been divided between the new ones in proportion to their populations. Per-person values are therefore reasonable, but the split assumes the new areas were alike before the division, which is often untrue when one part contains the new housing and the other does not. Treat the years before the split as an estimate for this neighbourhood rather than a measurement of it.

**In at least one year, no residents were recorded in this LSOA**

In at least one year no residents were recorded here. This usually means the area is not really residential, for example a business park, an airport, or a site cleared for redevelopment before new homes were occupied. Totals for the area remain valid, but anything measured per person cannot be calculated for a year with no residents, so those values are shown as missing or as zero rather than as a real figure.

**In some years this LSOA records an unusually large number of company cars**

Vehicles in the [vehicle licensing statistics](https://www.gov.uk/government/statistical-data-sets/vehicle-licensing-statistics-data-files) are counted at the address of the registered keeper. For a company car or a leased vehicle that address is the fleet operator's office, not the driver's home. A single leasing company or large employer can therefore place thousands of vehicles in one neighbourhood, none of which are driven by the people who live there. Where this happens, vehicle counts and the transport emissions derived from them are far too high for the residents of the area, and are best ignored.

**In some years this LSOA gives unreliable per-person figures because its recorded population is very low**

Most figures in Carbon & Place are divided by the population of the neighbourhood to give a value per person. When the recorded population is very small, that division becomes unstable: a handful of people, or a rounding adjustment applied by the statistical agencies to protect privacy, can swing the result dramatically. Very low populations usually occur where an area is largely non-residential, or in the years before new housing was occupied. The totals for the area are still sound; it is the per-person values, and any grade based on them, that should be discounted for the affected years.
<!-- /#data-warnings -->

### Key Concepts

<!-- #carbon-footprint -->
#### What is a carbon footprint?

A carbon footprint is the total amount of greenhouse gas released to the atmosphere as a result of an activity, a household, or a place. Carbon & Place uses a **consumption-based** footprint: emissions are allocated to the people who ultimately use goods and services, wherever in the world the emissions physically occurred. If a phone is manufactured abroad and bought in Britain, its manufacturing emissions count towards the buyer's footprint.

This differs from the **territorial** accounting used in official statistics such as the [UK greenhouse gas emissions statistics](https://www.gov.uk/government/collections/final-uk-greenhouse-gas-emissions-national-statistics), which count emissions physically released within the UK. The UK Government also publishes a national consumption-based estimate, [the UK's carbon footprint](https://www.gov.uk/government/statistics/uks-carbon-footprint), which is consistently higher than the territorial figure because the UK imports more emissions embodied in goods than it exports. Research shows that household consumption drives a large majority of global emissions, and that footprints vary substantially with income, housing, and location ([Ivanova et al. 2020](https://doi.org/10.1088/1748-9326/ab8589)).

Consumption-based accounting has one clear advantage: it prevents a country or a neighbourhood from appearing to decarbonise simply by moving its industry elsewhere. It also has a clear cost: because nobody records what every household buys, the consumption part of the footprint has to be modelled, and it is therefore the least certain part of the estimate.
<!-- /#carbon-footprint -->

#### Neighbourhood Statistics

The tools mostly present results as neighbourhood statistics, using the Lower layer Super Output Areas (LSOAs) created by the [Office for National Statistics](https://www.ons.gov.uk/methodology/geography/ukgeographies/censusgeographies/census2021geographies) for the census, or their Scottish equivalents (Data Zones).

LSOAs are small statistical areas designed to contain roughly the same number of people: between 1,000 and 3,000 residents, or 400 to 1,200 households, averaging about 1,700 people. Because population density varies, they vary greatly in size: in cities an LSOA may be a few streets, while in rural areas one can cover many square miles. The ONS created them for the 2001 Census and revised them for 2011 and 2021. Carbon & Place uses the 2021 boundaries but sometimes reports historical data collected on 2001 or 2011 boundaries. Most LSOAs are unchanged between censuses; where boundaries changed, values are interpolated, which can introduce minor errors.

LSOAs are the standard unit for publishing small-area statistics in Britain. Government and academic datasets on income, deprivation, energy, transport, and health are all available at this scale, which makes LSOAs a useful unit of comparison.

Although LSOAs are small, each still contains hundreds of households, so every statistic is an average of many people rather than a description of any individual. There is variation within every neighbourhood, and you may differ from your neighbours in important ways. Small-area statistics are nevertheless informative because neighbours tend to have much in common: similar homes, the same shops and services, the same schools and transport options. Many of the choices we make are shaped, at least in part, by where we live, so comparing places helps us understand problems that individual data cannot.

<!-- #dasymetric -->
#### Dasymetric Mapping

![Dasymetric](/images/manual/dasymetric-animation.webp)

*Dasymetric (left) and choropleth (right) mapping techniques*

By default, neighbourhood statistics are shown as a [dasymetric](https://en.wikipedia.org/wiki/Dasymetric_map) map, in which only the buildings within each zone are coloured. If you turn off dasymetric mode, a conventional [choropleth](https://en.wikipedia.org/wiki/Choropleth_map) map is shown instead, where the whole zone is coloured.

The same underlying data is shown in both modes; the difference is purely visual. Dasymetric maps avoid a common misreading of choropleth maps, in which large rural zones dominate the picture even though few people live in most of their area. By colouring only the built-up parts, dasymetric maps emphasise where people actually live.
<!-- /#dasymetric -->

<!-- #grades -->
#### Understanding the grades

Many values in the tools are given a grade from A+ to F- so that a neighbourhood can be compared quickly with the rest of the country. Grades are relative to the average neighbourhood: A+ to C- is better than average, D+ to F- is worse. Because most areas cluster near the average, the middle grade bands are wide (around 7% of neighbourhoods each), while the extreme bands are narrow, so only about 1% of neighbourhoods receive an A+ or an F-. Where data is missing or suppressed, an NA is shown instead.

A good grade means a neighbourhood performs well compared with the rest of Britain today. It does not mean the area is sustainable: reaching the UK's [net zero target](https://www.legislation.gov.uk/ukpga/2008/27/contents) will require reductions in most places, including many A-graded ones.

Grades are also not a judgement of the people who live somewhere. Much of what determines a footprint, including the age and construction of the housing, the availability of a bus service, and the distance to the nearest shop, is fixed long before any current resident arrives. A neighbourhood graded F for transport is usually one where driving is the only practical option, which is a statement about the place rather than about its residents.
<!-- /#grades -->

#### Digital Terrain Model and 3D buildings

Maps are traditionally flat, but our lives are not two dimensional. Terrain affects the weather, what and where we build, how we travel, and our sense of place. The Carbon & Place map therefore supports several 3D features:

* Hill shading: a pattern of light and shadow that indicates hills and valleys
* 3D terrain: the map can be tilted into a 3D view using the map controls
* 3D buildings: when zoomed in, building outlines are drawn with realistic heights

![Hill shading](/images/manual/hillshade.webp)

*An example of hill shading. In this area some terrain appears pixelated where missing data in the 2m dataset has been infilled with lower resolution 50m data.*

These features are driven by a high resolution [Digital Terrain Model](https://en.wikipedia.org/wiki/Digital_elevation_model) (DTM) and Digital Surface Model (DSM) of Great Britain. A DTM is essentially a large image in which every pixel records the elevation of the ground; a DSM also includes what sits on top of the ground, such as buildings and trees.

The DTM and DSM were created from [LIDAR](https://en.wikipedia.org/wiki/Lidar) surveys published by the [Environment Agency](https://www.data.gov.uk/dataset/f0db0249-f17b-4036-9e65-309148c97ce4/national-lidar-programme), the [Welsh Government](https://datamap.gov.wales/maps/lidar-viewer/), and the [Scottish Government](https://remotesensingdata.gov.scot/data#/list). Individual surveys flown between 2010 and the present were stitched into a single map with roughly 2m resolution. Coverage is not universal: over 95% in England, about 70% in Wales, and about 40% in Scotland (mostly southern and central), so gaps were infilled with [OS Terrain 50](https://www.ordnancesurvey.co.uk/products/os-terrain-50) data. Fortunately coverage is concentrated in the most populated places, so most people's neighbourhoods are covered even if some of the beauty of the Scottish and Welsh mountains is lost.

Building heights are calculated as the maximum difference between the DSM and DTM within each building footprint. This simple approach ignores sloping roofs and multi-level buildings, but its purpose is to distinguish building types (houses versus blocks of flats, for example) that may not be obvious on a 2D map, and approximate heights are sufficient for that.

![3D buildings](/images/manual/3dbuildings.webp)

*An example of 3D buildings in Leeds*

### Common Map Layers

Some map layers are available in every tool. The administrative boundary layers help with navigation and show where responsibility passes from one organisation to another, which is useful when deciding who could act on what the maps show.

<!-- #boundaries-la -->
##### Lower Tier Local Authority 2024

![Lower Tier Local Authority](/images/manual/la.webp)

Local authority districts are the building blocks of local government in England, Wales, and Scotland. They are responsible for services such as waste collection, housing, and planning applications, and many now publish local climate strategies. In England there are two main arrangements ([how councils work](https://www.gov.uk/understand-how-your-council-works)):

* **District, borough, or city councils** cover smaller areas within a county. They handle local services such as waste collection, planning applications, and Council Tax, while the county council provides education, social care, and transport.
* **Unitary authorities** (including London boroughs and metropolitan boroughs) provide all local government services through a single council. All councils in Scotland and Wales are unitary.

Local authorities matter for climate policy because they control planning, local transport (in upper tier and unitary areas), social housing, and building control. The Climate Change Committee has estimated that local authorities have influence over roughly a third of emissions in their areas ([Local Authorities and the Sixth Carbon Budget](https://www.theccc.org.uk/publication/local-authorities-and-the-sixth-carbon-budget/)).

[Original data source](https://geoportal.statistics.gov.uk/search?q=BDY_LAD%202024&sort=Title%7Ctitle%7Casc) (ONS Geoportal)
<!-- /#boundaries-la -->
<!-- #boundaries-wards -->
##### Wards 2024

![Ward](/images/manual/ward.webp)

Wards are the electoral districts used to elect local councillors, and are the smallest administrative areas with widely recognised local names. Each ward is represented by one or more councillors, who are often the first point of contact for residents raising local issues such as bus services, housing conditions, or planning.

Wards are useful for presenting statistics because people generally know which ward they live in, unlike statistical areas such as LSOAs. However, ward boundaries change relatively often as the [Local Government Boundary Commission](https://www.lgbce.org.uk/) reviews electoral arrangements, which complicates comparisons over time.

[Original data source](https://geoportal.statistics.gov.uk/search?q=BDY_WD%202024&sort=Title%7Ctitle%7Casc) (ONS Geoportal)
<!-- /#boundaries-wards -->
<!-- #boundaries-parish -->
##### Parish 2023

![Parish](/images/manual/parish.webp)

Civil parishes (called communities in Wales) are the lowest tier of local government in England. Parish, town, and community councils handle very local matters such as allotments, community centres, footpaths, and village greens, and they are statutory consultees on planning applications in their area. Some parts of England, particularly cities, are unparished, while other districts are entirely covered by parishes.

Although parish councils have few formal climate responsibilities, many lead practical local action such as community energy projects, tree planting, and neighbourhood plans ([National Association of Local Councils](https://www.nalc.gov.uk/)).

[Original data source](https://geoportal.statistics.gov.uk/search?q=BDY_PAR%202023&sort=Title%7Ctitle%7Casc) (ONS Geoportal)
<!-- /#boundaries-parish -->
<!-- #boundaries-westminster -->
##### Westminster Constituencies 2024

![Constituencies](/images/manual/constituency.webp)

A constituency is the geographical area represented by a Member of Parliament in the House of Commons. People who live in a constituency are the MP's constituents, and can raise issues with their MP regardless of how they voted. The boundaries shown are the [2023 review boundaries](https://boundarycommissionforengland.independent.gov.uk/2023-review/) first used at the 2024 general election.

Constituency-level statistics are useful for national policy debates because they attach local evidence to the people who vote on national legislation, including energy, transport, and planning policy.

[Original data source](https://geoportal.statistics.gov.uk/search?q=BDY_PCON&sort=Date%20Created%7Ccreated%7Cdesc) (ONS Geoportal)
<!-- /#boundaries-westminster -->

## Place-Based Carbon Calculator

The Place-Based Carbon Calculator (PBCC) estimates the consumption-based carbon footprint of every neighbourhood in Great Britain, breaks it down into housing, transport, and consumption, and tracks how it has changed since 2010.

### The case for local carbon data

The UK is legally committed to reaching [net zero greenhouse gas emissions by 2050](https://www.legislation.gov.uk/uksi/2019/1056/contents/made), and the [Climate Change Committee](https://www.theccc.org.uk/publication/sixth-carbon-budget/) has set out carbon budgets describing how quickly emissions must fall. National statistics tell us how the country as a whole is doing, but they hide enormous local variation. Neighbourhoods differ in their housing, their transport options, their incomes, and their spending, and as a result the highest-footprint neighbourhoods emit several times more per person than the lowest.

That variation matters for policy. A national campaign to promote public transport achieves little in a village with no bus service, and a heat pump subsidy works differently in a conservation area of solid-walled Victorian terraces than on a modern estate. The Climate Change Committee estimates that local authorities have influence over roughly a third of the emissions in their areas ([Local Authorities and the Sixth Carbon Budget](https://www.theccc.org.uk/publication/local-authorities-and-the-sixth-carbon-budget/)), but to use that influence well they need to know what drives emissions in each place. The PBCC is intended to supply that evidence.

### Using the calculator in your area

For any neighbourhood in Great Britain, the PBCC can show you:

* how your area's footprint compares with the local authority, the national average, and statistically similar neighbourhoods;
* which parts of the footprint (heating, electricity, driving, flying, food, goods and services) are large or small locally, and therefore where local action could make the most difference;
* whether emissions in your area have been falling, and how fast, since 2010;
* the demographic context (household types, incomes, housing) that helps explain why your area looks the way it does.

Community groups have used this kind of evidence to prioritise retrofit projects, make the case for better bus services, and hold local decision makers to account. Because every neighbourhood in Britain is covered, your area can always be compared with places that have done better.

### Using the carbon calculator

<!-- #pbcc-zones -->
#### Neighbourhoods {#pbccneighbourhoods}

![PBCC Neighbouhoods](/images/manual/pbcc-zones.webp)

The Neighbourhoods layer colours each Lower layer Super Output Area (LSOA), or Scottish Data Zone, by its carbon footprint and related indicators. Values are per person per year (kgCO<sub>2</sub>e) so that areas of different sizes can be compared. Use the drop-down menu to change which measure is shown; the map colours and legend update to match. The map shows 2022, the most recent year in the data. The available measures are:

* **Total Emissions**: the overall per-person footprint, graded from A+ (low) to F- (high) relative to the national distribution.
* **Decarbonisation progress**: how far the neighbourhood's per-person footprint has fallen between 2010 and 2022, graded against the rest of the country.
* **Gas**: emissions from domestic gas use, derived from metered consumption data.
* **Electricity**: emissions from domestic electricity use, derived from metered consumption data.
* **Car**: emissions from private car transport attributed to the neighbourhood's residents.
* **Van**: emissions from private van transport attributed to the neighbourhood's residents.
* **Consumption: Goods & Services**: embodied emissions from household purchases, estimated with a synthetic population model.
* **Flights**: air travel emissions allocated to neighbourhoods using the synthetic population model.
* **Area classification**: the Office for National Statistics [area classification](https://www.ons.gov.uk/methodology/geography/geographicalproducts/areaclassifications), which groups neighbourhoods with similar social and economic characteristics, for context rather than emissions.

The **Show layer** checkbox toggles the layer, and the **Dasymetric** switch changes between building-level shading and whole-zone colouring (see Dasymetric Mapping in the Key Concepts section). Clicking any neighbourhood opens its report card with a detailed breakdown.

Grades are relative: A+ to C- is better than the national average, D+ to F- is worse. NA appears where data is missing or suppressed.
<!-- /#pbcc-zones -->

### Carbon calculator report card

Clicking a neighbourhood opens its report card. The tabs are described below.

#### Overview

The Overview summarises the neighbourhood's footprint using the most recent year in the data, currently 2022; the year is stated next to the headline figure. Bear in mind that 2020 and 2021 were strongly affected by the COVID-19 pandemic, so 2019 remains the best year to compare against for a picture of normal conditions. The title bar gives the LSOA's ID, its ONS area classification, and its ward name (wards are larger than LSOAs but have recognisable local names).

The bar chart shows the total footprint per person for four groups: the selected neighbourhood, the average for its local authority, the national average, and the average for neighbourhoods with the same ONS area classification. The "similar areas" is often the most informative comparison, because it sets the area against places with similar populations and geography rather than the country as a whole.

The horizontal black line is a reference level, obtained by dividing the national emissions allowed under the Climate Change Committee's [Sixth Carbon Budget](https://www.theccc.org.uk/publication/sixth-carbon-budget/) for 2033 to 2037 by the UK population. It is not a target set for this neighbourhood: an equal per-person share takes no account of income, of the housing stock, or of whether the alternatives to driving exist locally. And it describes the middle of the 2030s, not 2050. It is included to indicate the scale of the change implied by the UK's legal commitment, and almost every neighbourhood in Britain currently sits well above it. Note also that the Climate Change Committee's budgets are territorial rather than consumption based (so imports are ignored), thus the CCC's budgets are a but lower than an consumption-based budget.

Below the chart, summary tables give a grade and a per-person value for each component of the footprint, and an explanation of how the grades are calculated.

#### Historical Emissions

This tab charts the neighbourhood's per-person footprint for every year since 2010, stacked by sector. It shows whether emissions are falling and which sectors are responsible for the change. Nationally, most of the reduction since 2010 has come from the decarbonisation of electricity generation as coal has left the grid ([DESNZ energy statistics](https://www.gov.uk/government/collections/uk-energy-in-brief)); reductions in transport and heating have been much slower. Comparing your neighbourhood's trend with that national story shows whether local change is genuine or simply reflects a cleaner electricity supply.

Year-to-year movements should be read with care: they can reflect data revisions and modelling noise as well as real change. Trends over several years are more reliable than single-year differences. To increase the amount of data available in the synthetic population it is built every other year (even years) using two years of data. I.e data from 2020 and 2021 is used to build a 2020 synthetic population, which is then used to produce carbon footprints for 2020 and 2021. This means for the parts of the carbon footprint that are modelled using the synthetic population (such as goods and services) the results for each pair of years are very similar and sudden shifts can occur every two years. 

#### Transport

The Transport tab covers emissions from residents' travel. Charts are shown for each component, with per-person values over time:

* **Car Emissions**: fuel burned by privately owned cars, estimated from local vehicle registrations and annual mileages recorded at MOT tests.
* **Van Emissions**: as for cars, but note that vans are often used for work rather than personal travel, and a company registering its fleet at a single address can inflate the figure for that neighbourhood.
* **Motorbikes, Company Vehicles, and other types**: other private road vehicles. Where a leasing company registers thousands of vehicles at one address, the affected values are suppressed from the total footprint.
* **Public Transport**: buses, coaches, trains, ferries, and other public transport, which are typically far lower carbon per passenger mile than driving ([UK government conversion factors](https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting)).
* **Flights Emissions**: air travel allocated to neighbourhoods via the synthetic population model. Flying is highly unequal: a small share of frequent flyers accounts for most flights, so neighbourhood averages conceal wide variation between households.
* **Vehicle Purchase**: the embodied emissions of manufacturing vehicles, spread across the neighbourhoods that buy them.
* **Vehicle maintenance & other**: indirect emissions from repair, maintenance, and other motoring costs.

For context on local transport options, follow the link to the Transport and Accessibility Explorer, which shows public transport frequency and accessibility for the same neighbourhood.

#### Housing

The Housing tab covers emissions from energy used in the home:

* **Gas**: from metered domestic gas consumption published by the Department for Energy Security and Net Zero ([sub-national gas consumption statistics](https://www.gov.uk/government/collections/sub-national-gas-consumption-data)).
* **Electricity**: from metered domestic electricity consumption ([sub-national electricity consumption statistics](https://www.gov.uk/government/collections/sub-national-electricity-consumption-data)).
* **Other Heating**: heating fuels beyond the gas grid (oil, coal, wood, bottled gas), modelled from census data on central heating types.
* **Housing Other**: remaining housing-related emissions (such as water supply and housing maintenance, actual and imputed rentals), modelled through the synthetic population consumption data.

Gas and electricity are converted to emissions using the [UK government greenhouse gas conversion factors](https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting) for the relevant year, so falling electricity emissions partly reflect the greening of the national grid rather than reduced consumption. For detail on the building stock behind these numbers, follow the link to the Retrofit Explorer.

<!-- #pbcc-consumption -->
#### Consumption Emissions

While some household emissions are produced at home (burning gas for heating or cooking) or on the road, much of the footprint consists of embodied emissions: the emissions released in making and delivering the goods and services we buy. A new phone, a restaurant meal, or an item of clothing each carries the emissions of mining, farming, manufacturing, and transport, often released abroad. In a consumption-based footprint, responsibility for those emissions is attributed to the end user rather than the producer, consistent with the approach used in [the UK's official carbon footprint statistics](https://www.gov.uk/government/statistics/uks-carbon-footprint).

Consumption footprints are difficult to estimate because no dataset records what every household in Britain buys. The values shown here therefore come from a model, built in two steps:

1. We use census data to create a synthetic population: a set of artificial households that collectively match the real demographics of each neighbourhood. A synthetic household might be described as "a couple with one child, living in a semi-detached home that they own with a mortgage, in a suburban area of a northern town, with one car and a pre-tax household income of around £45,000."
2. We match each synthetic household to a real household with similar characteristics in the Office for National Statistics [Living Costs and Food Survey](https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/incomeandwealth/methodologies/livingcostsandfoodsurvey), which records detailed spending diaries, and assume their spending patterns are similar. Spending is then converted to emissions using the carbon intensity of each category of goods and services.

For any single household this would be a rough guess, but repeating it across the hundreds of households in a neighbourhood smooths out the errors and gives a reasonable approximation of the area's spending, in the same way that a poll of hundreds of people can approximate public opinion. The Methods section of the manual explains synthetic populations in more detail.
<!-- /#pbcc-consumption -->

#### Demographics

The Demographics tab provides the population context that helps explain why neighbourhoods differ:

* **Community photo**: a pictorial summary of the most common household types in the neighbourhood (explained below).
* **Age chart**: population by age, and the number of households and dwellings over time.
* **LSOA characteristics**: headline facts such as which local authority the area belongs to.
* **ONS pen portrait**: the neighbourhood's description from the ONS [area classifications](https://www.ons.gov.uk/methodology/geography/geographicalproducts/areaclassifications).

Demographics strongly influence emissions. Higher-income households consume more of almost everything, larger and older homes need more heating, and dense urban neighbourhoods tend to have lower transport footprints than car-dependent suburbs ([Ivanova et al. 2020](https://doi.org/10.1088/1748-9326/ab8589)). Understanding who lives in an area is often the first step to understanding its footprint.

<!-- #pbcc-community-photo -->
##### Community Photo

The community photo gives a quick overview of who lives in a neighbourhood. Each photo is a grid of 48 household pictures, distributed in proportion to the household types recorded in the 2021 Census (2022 in Scotland). Household illustrations from [Freepik](https://www.freepik.com/).

The pictures are selected automatically from a set of around 200 household archetypes based on three census variables.

[Household composition](https://www.ons.gov.uk/census/census2021dictionary/variablesbytopic/demographyvariablescensus2021/householdcomposition/classifications) considers the number and age of people in a household and how they are related. There are 11 categories:

* ![family_photo](/images/ui/family_photos/higher_OnePersonOver66_White.webp) **OnePersonOver66**: One-person household: aged 66 years and over
* ![family_photo](/images/ui/family_photos/higher_OnePersonOther_White.webp) **OnePersonOther**: One-person household: aged 65 years or under
* ![family_photo](/images/ui/family_photos/higher_FamilyOver66_White.webp) **FamilyOver66**: Single family household: all aged 66 years and over
* ![family_photo](/images/ui/family_photos/higher_CoupleNoChildren_White.webp) **CoupleNoChildren**: Married, civil partnership, or cohabiting couple: no children
* ![family_photo](/images/ui/family_photos/higher_CoupleChildren_White.webp) **CoupleChildren**: Couple with dependent children
* ![family_photo](/images/ui/family_photos/higher_CoupleNonDepChildren_White.webp) **CoupleNonDepChildren**: Couple: all children non-dependent
* ![family_photo](/images/ui/family_photos/higher_LoneParent_White.webp) **LoneParent**: Lone parent with dependent children
* ![family_photo](/images/ui/family_photos/higher_LoneParentNonDepChildren_White.webp) **LoneParentNonDepChildren**: Lone parent: all children non-dependent
* ![family_photo](/images/ui/family_photos/higher_OtherNoChildren_White.webp) **OtherNoChildren**: Other household types: other family composition
* ![family_photo](/images/ui/family_photos/higher_OtherChildren_White.webp) **OtherChildren**: Other household types: with dependent children
* ![family_photo](/images/ui/family_photos/higher_OtherIncStudentOrOver66_White.webp) **OtherIncStudentOrOver66**: Other, including all full-time students and all aged 66 and over

A dependent child is aged 0 to 15, or 16 to 18 and in full-time education living with a parent or grandparent.

[Ethnicity](https://www.ons.gov.uk/peoplepopulationandcommunity/culturalidentity/ethnicity/bulletins/ethnicgroupenglandandwales/census2021) is shown in three broad categories:

* ![family_photo](/images/ui/family_photos/higher_CoupleChildren_White.webp) **White**: White (English, Welsh, Scottish, Northern Irish or British), Irish, Gypsy or Irish Traveller, Roma, Other White (81.7% of the population of England and Wales in 2021)
* ![family_photo](/images/ui/family_photos/higher_CoupleChildren_Black.webp) **Black**: Black, Black British, Black Welsh, Caribbean or African (4.0%)
* ![family_photo](/images/ui/family_photos/higher_CoupleChildren_Other.webp) **Other**: Asian, Asian British, Asian Welsh, Mixed, Multiple, or Other ethnic group (14.3%)

The [National Statistics Socio-economic Classification](https://www.ons.gov.uk/methodology/classificationsandstandards/otherclassifications/thenationalstatisticssocioeconomicclassificationnssecrebasedonsoc2010) (NS-SEC) classifies people by occupation, in six categories:

* ![family_photo](/images/ui/family_photos/higher_CoupleChildren_White.webp) **Higher**: Higher and lower managerial, administrative, and professional occupations
* ![family_photo](/images/ui/family_photos/intermediate_CoupleChildren_White.webp) **Intermediate**: Intermediate occupations and small employers and own-account workers
* ![family_photo](/images/ui/family_photos/routine_CoupleChildren_White.webp) **Routine**: Routine and manual occupations
* ![family_photo](/images/ui/family_photos/students_OtherIncStudentOrOver66_White.webp) **Students**: Full-time students, including students who also work
* ![family_photo](/images/ui/family_photos/unemployed_CoupleChildren_White.webp) **Unemployed**: Never worked and long-term unemployed
* ![family_photo](/images/ui/family_photos/DNA_OnePersonOther_White.webp) **Does Not Apply**: A small number of households that cannot be classified

The NS-SEC classification applies to the household reference person, usually the person who pays the rent or mortgage (the higher earner where contributions are joint). A household where one partner is a banker and the other a cleaner is therefore represented by the "Higher" category, with both figures drawn in higher occupational roles. Retired people are classified by their previous job.

###### Notable limitations

The community photo trades accuracy for legibility, and its main limitations follow from that trade-off:

**Not all households are represented.** Summarising hundreds of households in 48 pictures means unusual households are not shown. Typically around 90% of households are represented, and over 75% in almost all neighbourhoods, but in a few genuinely diverse places only the most common 65% of households appear.

**Some characteristics are not included.** Gender and sexuality are not part of the analysis, which produces some visible simplifications: the picture for a person living alone over 66 is always a woman, the picture for a person living alone under 65 is always a man, and there are no [same-sex couples](https://www.ons.gov.uk/census/maps/choropleth/population/living-arrangements/living-arrangements-11a/living-in-a-same-sex-couple-married-or-in-a-civil-partnership) in the photos. This is a practical constraint: each extra category multiplies the number of combinations, and the ONS does not publish tables detailed enough to identify individual households, so the analysis is limited to a few broad categories.

**Mixed-ethnicity households are not shown.** The input data does not describe the ethnic mix within households, so every household picture is a single ethnicity. A neighbourhood consisting entirely of couples between black women and white men would appear as 50% white couples and 50% black couples. Mixed-ethnicity partnerships are most common in London and the South East, where they make up as much as [20% of households in some areas](https://www.ons.gov.uk/census/maps/choropleth/identity/multiple-ethnic-groups-in-household/hh-multi-ethnic-group/ethnic-groups-differ-within-partnerships/).
<!-- /#pbcc-community-photo -->

#### Future Scenarios

As part of the [Energy Demand Research Centre Futures theme](https://www.edrc.ac.uk/research/futures/), we are downscaling the [Positive Low Energy Futures scenarios](https://low-energy.creds.ac.uk/) to give each neighbourhood a local decarbonisation pathway. This work is ongoing and will be added to the tool when complete.

<!-- #footprint-method -->
### How the footprints are calculated

The PBCC methodology is described in a peer-reviewed paper, which is the appropriate citation for academic use: [Morgan, M. (2026). Carbon & Place: Data and tools to understand the spatial variation in carbon footprints. *Environment and Planning B: Urban Analytics and City Science*, 53(3), 538&ndash;554](https://doi.org/10.1177/23998083251401613). This section summarises the approach.

The footprint combines three families of estimate:

* **Measured energy consumption.** Domestic gas and electricity use comes from the meter-level statistics published by the Department for Energy Security and Net Zero at LSOA level ([gas](https://www.gov.uk/government/collections/sub-national-gas-consumption-data), [electricity](https://www.gov.uk/government/collections/sub-national-electricity-consumption-data)), converted to emissions with the [UK government conversion factors](https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting) for each year. Heating fuels beyond the gas grid are modelled from census central heating data, since no metered equivalent exists.
* **Vehicle-based transport estimates.** Car and van emissions are built from the [vehicle licensing statistics](https://www.gov.uk/government/statistical-data-sets/vehicle-licensing-statistics-data-files) (which vehicles are registered where) combined with odometer readings from the [anonymised MOT test data](https://www.gov.uk/government/collections/mot-anonymised-results) (how far similar vehicles are driven). Using MOT records to study local car use is an established method in transport research ([Chatterton et al. 2015](https://doi.org/10.1016/j.trd.2015.06.003), which introduced the approach to the study of spatial and social variation in car use). Emissions per kilometre reflect the fuel type and efficiency of the local vehicle fleet.
* **Synthetic population consumption estimates.** Spending on goods, services, food, flights, and public transport is estimated by matching synthetic households (built from census tables) to respondents in the [Living Costs and Food Survey](https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/incomeandwealth/methodologies/livingcostsandfoodsurvey), then converting spending to emissions using category-specific carbon intensities consistent with the UK's [consumption-based accounts](https://www.gov.uk/government/statistics/uks-carbon-footprint). The synthetic population method is explained below, and the code is in the [`build`](https://github.com/PlaceBasedCarbonCalculator/build) repository.

The three differ in how much confidence they deserve, and it is worth carrying that distinction into any use of the results. Metered gas and electricity are the most reliable, because somebody read a meter. Vehicle emissions sit in the middle: the fleet and its mileage are observed, but attributed to the registered keeper's address rather than to where the driving happens. Consumption estimates are the least certain, because they rest on matching modelled households to a survey of a few thousand real ones. Unhelpfully, the least certain component is also among the largest.
<!-- /#footprint-method -->

#### Synthetic populations: a way to know the unknown

Here is a deceptively simple question: how many bananas do people on your street eat each year?

It is the kind of question you might be asked at a university interview to test your reasoning. You might respond with an assumption: every household buys a bunch of bananas each week, there are 100 households on my street, therefore around 5,200 bunches per year.

To do better than that, we need real data about what people actually buy. Fortunately, the UK has it. Every year the Office for National Statistics runs the [Living Costs and Food Survey](https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/incomeandwealth/methodologies/livingcostsandfoodsurvey) (LCFS), in which roughly five thousand households keep a detailed two-week spending diary and complete a questionnaire about regular bills and larger, less frequent purchases such as holidays and cars. The ONS categorises this spending using the international [Classification of Individual Consumption by Purpose](https://unstats.un.org/unsd/classifications/unsdclassifications/COICOP_2018_-_pre-edited_white_cover_version_-_2018-12-26.pdf) (COICOP). From this we can estimate how many bananas the average British household buys.

But is your street average? Almost certainly not. So we want to adjust the national estimate to reflect how your street differs from the rest of Britain.

Consider a different product: nappies. Households with small children buy a lot of nappies; everyone else buys almost none. This suggests the adjustment we need: if we know the demographics of the LCFS respondents, and we know the demographics of your street from the census, we can select the subset of survey households that resembles your street and use their spending instead of the national average.

**The obstacle is privacy.** Census results are published as aggregated tables: for any area you can learn how many households have one, two, three, or more people, and separately how many are couples, lone parents, or pensioners living alone. What you cannot get is a list of individual households with all their characteristics combined, because that would identify real people, which the ONS rightly prevents. Some combinations can be deduced (a pensioner living alone is a one-person household) but most cannot (a lone parent family might contain two, three, or more people).

**Synthetic populations solve this problem.** Using statistical techniques known as spatial microsimulation ([Lovelace and Dumont, 2016](https://spatial-microsim-book.robinlovelace.net/)), we construct a set of artificial households for each area that is consistent with all the published census tables at once. Carbon & Place builds its synthetic population from six characteristics:

* Household size
* Household composition
* Tenure
* Accommodation type
* Number of cars
* Output Area Classification (a place-based descriptor of the area)

The census does publish some multivariate tables (household size by composition, for example), which anchor the combinations, and the ONS deliberately adds small amounts of noise to published counts to protect privacy, which the method must tolerate. Synthetic populations are never perfect, but they are usually close to the real population, and they let us pair every synthetic household with a similar LCFS respondent. That matched subsample of the survey is what we use to estimate the spending, and therefore the consumption emissions, of every neighbourhood in Great Britain.

#### Further reading {#pbccfurtherreading}

Carbon & Place is one of several strands of UK work on place and energy demand, and it is intended as a starting point rather than a destination. You may be interested in:

* [Morgan, M. (2026). *Carbon & Place: Data and tools to understand the spatial variation in carbon footprints*](https://doi.org/10.1177/23998083251401613), the peer-reviewed account of this method.
* [Barrett et al. (2022), *Energy demand reduction options for meeting national zero-emission targets in the United Kingdom*](https://doi.org/10.1038/s41560-022-01057-y), a CREDS study finding that UK energy demand could be roughly halved by 2050.
* [CREDS, *Shifting the focus: energy demand in a net-zero carbon UK*](https://www.creds.ac.uk/publications/shifting-the-focus-energy-demand-in-a-net-zero-carbon-uk/), the flagship synthesis of the demand-side case.
* [Ivanova et al. (2020), *Quantifying the potential for climate change mitigation of consumption options*](https://doi.org/10.1088/1748-9326/ab8589), on which household consumption choices matter most.
* [CREDS, *Emissions savings from equitable energy demand reduction*](https://www.creds.ac.uk/publications/emissions-savings-from-equitable-energy-demand-reduction/), on the distributional questions this data raises.
* The [EDRC Place theme](https://www.edrc.ac.uk/research/place/), which funds this tool, and the [EDRC Equity theme](https://www.edrc.ac.uk/research/equity/).
* The [Climate Change Committee's advice to local authorities](https://www.theccc.org.uk/publication/local-authorities-and-the-sixth-carbon-budget/), for the policy framing.

#### Interpretation and limitations

* Consumption values are modelled, not measured. They are most reliable for comparing places and least reliable for small categories in single years, where the rotation of LCFS respondents can cause visible noise.
* Energy values are measured but incomplete: homes off the gas grid have modelled heating estimates, and data for small areas is sometimes suppressed for privacy.
* Vehicle emissions are attributed to the registered keeper's address, which misplaces company fleets and can inflate a few neighbourhoods; affected values are flagged or suppressed.
* Grades compare neighbourhoods with each other, not with a sustainable benchmark. Use the Sixth Carbon Budget line on the charts for the direction of travel.

## Transport and Accessibility Explorer

The Transport and Accessibility Explorer examines transport provision and access to services in detail: how frequent the buses and trains are, how that has changed over twenty years, how many vehicles people own, and what residents can actually reach.

### The case for local transport data

Transport is the largest source of greenhouse gas emissions in the UK, and it has decarbonised more slowly than any other major sector ([UK greenhouse gas emissions statistics](https://www.gov.uk/government/collections/final-uk-greenhouse-gas-emissions-national-statistics)). Most transport emissions come from cars, so cutting them means some combination of cleaner vehicles and fewer or shorter car journeys. Whether people can realistically drive less depends on where they live: on how close the shops, schools, and jobs are, and on whether walking, cycling, or public transport are genuine options.

Transport is also a fairness issue. Around a fifth of households have no car ([National Travel Survey](https://www.gov.uk/government/collections/national-travel-survey-statistics)), and where public transport is poor they are effectively cut off from opportunities. Car dependence is expensive for households and carries wider costs for society in congestion, road danger, air pollution, and land take ([Miner et al. 2024, *Car harm: a global review of automobility's harm to people and the environment*](https://doi.org/10.1016/j.jtrangeo.2024.103817)). Outside London, bus services have declined substantially since 2008 ([DfT bus statistics](https://www.gov.uk/government/collections/bus-statistics)), and this tool records that decline neighbourhood by neighbourhood.

### Using the transport data in your area

Among the questions the explorer can settle for a particular area:

* Has our bus service got better or worse since 2008, and how does it compare with similar places?
* Which neighbourhoods have frequent public transport all day, and which are only served at commuter peaks?
* How car dependent is our area, and how quickly are electric vehicles being adopted?
* What can residents actually reach by foot, bike, or public transport, and where are the gaps?

This evidence is directly relevant to local transport plans, bus service improvement plans, and planning decisions about where new homes should go. Places with frequent public transport and nearby services can support development with fewer cars; places without them will generate car traffic however good the intentions.

### Using the transport explorer

<!-- #transport-zones -->
#### Neighbourhoods {#transportneighbourhoods}

![Transport Zones](/images/manual/transport_zones.webp)

The Neighbourhoods layer uses Lower layer Super Output Areas (LSOAs) to report a range of transport statistics. Use the drop-down menu to change the measure:

**Change in buses/hour**: the change in bus frequency (daytime average trips per hour) for services stopping in or near each neighbourhood, measured from the best year in 2006 to 2008 up to 2025. This shows where services have been cut and where they have improved. The [Friends of the Earth analysis](https://policy.friendsoftheearth.uk/insight/how-britains-bus-services-have-drastically-declined) of bus service decline uses the same measure, ending in 2023.

**Bus/Tram/Subway/Rail/Ferry per hour (daytime average)**: the frequency of each type of public transport stopping in or near the neighbourhood. Not every mode exists everywhere; places with no timetabled service are shown in black.

The map shows 2025 only, to keep the tile size reasonable for a layer covering every neighbourhood in Great Britain. The full series back to 2004 is in the report card charts: click any neighbourhood.

**Percentage of Low Emission Vehicles**: four measures of low emission vehicle adoption. Battery Electric Vehicles (BEVs) are fully electric with no exhaust emissions. Ultra Low Emission Vehicles (ULEVs) are a broader official category that also includes plug-in hybrids and other low emission technologies.

* % Vehicles BEV (Private)
* % Vehicles ULEV (Private)
* % Vehicles BEV (Company)
* % Vehicles ULEV (Company)

Private vehicles are registered to an individual; company vehicles are registered to an organisation.

**Vehicles per Household**: an estimate of the number of private vehicles per household, a useful indicator of car dependence.

Clicking on any neighbourhood opens the report card with more detail.
<!-- /#transport-zones -->

<!-- #isochrones -->
#### Travel-time isochrones

![Travel-time isochrones](/images/manual/isochrones.webp)

An isochrone shows the area that can be reached from a starting point within a given travel time. Enable the **Travel-time isochrones** toggle in the Neighbourhoods panel, then click any neighbourhood to see how far a resident could travel from its centre.

The coloured areas represent different modes of travel:

* **Walk** (green): the area reachable on foot.
* **Bike** (blue): the area reachable by bicycle.
* **Transit** (purple): the area reachable using scheduled public transport, including walking to and from stops.
* **Bike + Transit** (red): the area reachable by combining cycling with public transport.

Isochrones illustrate how accessible a neighbourhood is and how much difference each mode makes. Clicking a different neighbourhood replaces the isochrone; turning the toggle off removes it. Isochrones are indicative, based on representative timetables and typical travel speeds.
<!-- /#isochrones -->

### Transport report card

Clicking on any neighbourhood opens the report card, which has three main sections.

#### Vehicle Ownership

This section provides an enhanced version of the [vehicle licensing statistics](https://www.gov.uk/government/statistical-data-sets/vehicle-licensing-statistics-data-files) published by the Department for Transport and the DVLA, which record every licensed vehicle in the country by the registered keeper's neighbourhood.

The official dataset suppresses small counts (1 to 4 vehicles) to protect privacy, which makes it awkward to analyse: sums do not add up and trends jump around. The version shown in Carbon & Place is the output of a model that infills the suppressed values with plausible estimates to create a complete, consistent dataset. It closely matches the official publication, but treat any value below 5 as indicative rather than exact.

With a complete dataset it becomes possible to calculate measures such as vehicles per household, a useful indicator of car dependence. The data divides vehicles by:

* **Body type**: car, motorbike, or other (mostly vans, plus specialist vehicles such as tractors and excavators)
* **Licence status**: licensed for road use, or declared off-road (SORN)
* **Fuel type**: battery electric, plug-in hybrid, and so on
* **Keepership**: private or company

The published tables do not provide every combination of these variables. For example, we can say how many battery electric vehicles an area has, but not how many are cars. Petrol and diesel counts are inferred by subtracting the other fuel types from the total, a simplification that ignores the small number of vehicles running on unusual fuels such as LPG.

Three limitations apply to every vehicle chart, and the first is much the most important. Vehicles are counted at the **registered keeper's address**, which for a company car or a leased vehicle is the fleet operator's office rather than the driver's home. A single leasing company can place thousands of vehicles in one neighbourhood, none of them driven by anybody who lives there. Where this happens the report card shows a warning, and the affected values are suppressed from the carbon footprint totals rather than allowed to distort them, but the raw counts on this tab still show them. Second, vehicles under a **Statutory Off Road Notification** are not being driven but remain registered, which is why licensed and SORN vehicles are shown separately. Third, a **registration address lags a house move**, so a small share of vehicles is attributed to a previous address.

<!-- #frequency -->
#### Public Transport Frequency

This section charts the frequency of public transport (trips per hour) serving the neighbourhood, by mode, time of day, and day of week, from 2004 to the present. Frequency matters because it determines how usable public transport really is:

1. **Shorter waits.** With a bus every 5 minutes, missing one hardly matters.
2. **Easier connections.** Journeys with a change are far more reliable when the next leg comes soon.
3. **Turn up and go.** When services are frequent, people stop consulting timetables and just travel, the way car journeys work.
4. **Resilience to delay.** One late bus per hour ruins the hour; one late bus every 10 minutes is barely noticed.

Frequency usually varies through the day, with more services at rush hour and fewer in evenings and weekends. When off-peak frequency drops too low, the service stops being useful for shift workers, hospital visits, or a night out, and a vicious cycle can begin: low frequency leads to low ridership, which justifies further cuts. Much of Britain outside London is somewhere in this cycle, as the charts for most neighbourhoods show.

One caution about what the chart counts. Frequencies are taken from published timetables, so they record the service that was scheduled rather than the service that ran. Cancellations, delays, and unreliability are invisible here, and in places where reliability is the main complaint the chart will look better than daily experience. The counts also cover services stopping in or near the neighbourhood, without regard to where those services go, so a frequent route that does not serve anywhere useful counts the same as one that does.
<!-- /#frequency -->

#### Accessibility & Proximity

Accessibility and proximity are two core concepts in sustainable transport planning. **Proximity** is a simple measure of how physically close people are to the things they need. **Accessibility** accounts for how long it actually takes to reach them using the available transport.

Accessibility can be improved either by bringing destinations closer (proximity) or by moving people faster (mobility). Improving proximity is generally considered more sustainable: when shops and services are nearby, people can walk, cycle, or take short bus trips, all of which are cheaper and less resource-intensive than driving. When services are distant, people default to cars, which are costly for households and [for society as a whole](https://doi.org/10.1016/j.jtrangeo.2024.103817), and the space cars require spreads places further apart, making the problem worse. This thinking underpins planning concepts such as the 20-minute neighbourhood ([TCPA guidance](https://www.tcpa.org.uk/resources/20-minute-neighbourhoods/)).

The Accessibility & Proximity analysis measures whether a neighbourhood has enough of the shops and services people need within a reasonable distance and travel time. The purpose of this analysis is to contrast with other accessability measures such as the [DfT's Connectivity Tool](https://www.gov.uk/guidance/connectivity-tool) which typically focus on a small selection of key destinations types such as jobs, schools, and hospitals. While these are important they miss the diversity of destinations that real people wish to travel to. So this analysis is intended to draw attention to those other types of places that also matter to people.

**Summary table**: lists 385 categories of destination from the [Ordnance Survey Points of Interest](https://www.ordnancesurvey.co.uk/products/points-of-interest) dataset. Each destination type gets four accessibility scores (the number reachable by public transport within 15, 30, 45, and 60 minutes) and four proximity scores (the number within 0.75, 1.5, 2.25, and 3 miles). Every score is expressed in [standard deviations](https://en.wikipedia.org/wiki/Standard_deviation) from the national average, on a scale truncated at -3 to +3. Scores above 0 (better than the national average) are highlighted green; scores below 0 are red.



**Summary chart**: plots the same information, with a proximity score on the x-axis and an accessibility score on the y-axis. The **Travel time and distance** drop-down above the chart chooses which band is shown: 15 minutes / 0.75 miles, 30 minutes / 1.5 miles (the default), 45 minutes / 2.25 miles, or 60 minutes / 3 miles. The two axes are always a matched pair, because the distance bands are those same travel times converted at a 3 mph walking speed; pairing a 30-minute isochrone with a 3-mile circle would set two different journeys against each other. Short bands suit everyday services such as a corner shop or a primary school; long bands suit rarer ones such as a hospital or a college. Click any dot to see the destination type. Points far above the diagonal are places where transport outperforms geography (good services despite distant destinations); points far below suggest nearby destinations that are hard to reach without a car.

Destinations types with no services are allocated to a value of -3 and other values are truncated to the -2.9 to +3 range. For some types of destination it is reasonable for there to be no local provision (e.g. theme parks) and others it is reasonable for there only to be local provision at the higher distance bands (e.g. tattoo artist) because there is not enough demand to provide a local service for everyone.

### Transport methods and data

#### Assembling twenty years of timetables

There is no single official archive of public transport timetables in the UK, so the historical analysis required assembling a patchwork of sources:

* the [National Public Transport Data Repository](https://www.data.gov.uk/dataset/d1f9e79f-d9db-44d0-b7b1-41c216fe5df6/national-public-transport-data-repository-nptdr) (NPTDR), an annual October snapshot of timetables from 2004 to 2011;
* the [Bus Archive](https://www.busarchive.org.uk/), which provided October bus timetables outside London from 2014 to 2017;
* an archive of the [Traveline National Dataset](https://www.data.gov.uk/dataset/0447f8d9-8f1b-4a68-bbc8-246981d02256/traveline-national-dataset) (TNDS) and the [Rail Delivery Group](https://data.atoc.org/) (formerly ATOC) national rail timetable from 2018 onwards, maintained by [Dr Malcolm Morgan](https://environment.leeds.ac.uk/transport/staff/964/dr-malcolm-morgan);
* the [Bus Open Data Service](https://www.bus-data.dft.gov.uk/) (BODS) coach dataset from 2024 onwards. TNDS stopped carrying the national coach network during this period, so from 2024 local bus is taken from TNDS and coach from BODS, and the two are counted separately to avoid double-counting the same journey.

To our knowledge this is the largest collection of digital, analysable timetables in the UK, covering most of the last twenty years, though it is patchy in places: there is no data for 2012 and 2013, rail data is missing from 2014 to 2017, and coverage in London is incomplete in several years.

The whole archive was reprocessed in 2026 with a substantially improved version of UK2GTFS. The frequencies shown are therefore not directly comparable with figures published from earlier versions of this analysis: the biggest single change is better detection of duplicate journeys in the older NPTDR files, which removed around a quarter of the counted stop calls in the mid-2000s and so makes the measured decline in bus service since 2008 shallower than previously reported, without changing its direction.

Each source stores timetables in a different format, so all were converted to the standard GTFS format using the [UK2GTFS](https://itsleeds.github.io/UK2GTFS/) R package ([source code](https://github.com/ITSLeeds/UK2GTFS)). The analysis that turns those timetables into neighbourhood statistics is published as [`PublicTransportAnalysis`](https://github.com/PlaceBasedCarbonCalculator/PublicTransportAnalysis). For each year, a one-month snapshot was produced, usually October, with other months used where October data was unavailable.

Because the collection is retrospective and contribution to the source datasets was voluntary, it is difficult to state exactly what proportion of services is captured in any year and place. It seems unlikely that an operator would deposit a partial timetable, so we treat any provided timetable as complete. Timetables generally arrive as one file per route, which makes missing data detectable as implausible year-to-year jumps: a bus that ran half-hourly in 2006, vanished in 2007-08, and returned identical in 2009 more likely reflects a missing file than a real withdrawal.

#### Counting trips near each neighbourhood

To produce the statistics, we count the public transport trips accessible from each LSOA or its immediate vicinity. Some small LSOAs contain no stops but have services just outside their boundary, so we take the union of the LSOA boundary and a 500m circle around its population-weighted centroid, buffered outward by a further 100m. The result measures the frequency of public transport within a short walk of each neighbourhood.

![Frequency Analysis Areas](/images/manual/transport_lsoa_buffer.webp)

*Example of the area used to count public transport trips*

#### Data quality

![Timetable missing data](/images/manual/transport_bus_data.webp)

*Summary of bus timetable data availability. Green: good coverage. Amber: possibly missing data. Red: definitely missing data. Grey: no data for 2012 and 2013. Blue: timetables severely reduced by COVID-19 lockdowns and may not be representative.*

Data from 2004 to 2007 is patchy in many places. The raw files, especially in early years, contain errors such as missing stops and vehicles travelling impossibly fast; UK2GTFS corrects many of these automatically, but it is impossible to guarantee every error has been removed.

#### Interpretation

At this very local scale, timetable data is complex and messy. A sudden drop in service for one place and year could be missing data, or a temporary diversion during roadworks, rather than a genuine cut. The results are most trustworthy where they show consistent trends over several years and across multiple neighbouring areas.

In most of the country, the weekday rush hour bus service is worse than a Sunday evening service in the London suburbs. Since 2008, bus services have declined significantly across the UK except in London, where they have remained roughly stable. This is consistent with the official [DfT bus statistics](https://www.gov.uk/government/collections/bus-statistics), which record the decline in vehicle miles outside London.

<!-- #accessibility -->
#### Accessibility analysis method

The accessibility and proximity plots are produced as follows. First, the [Ordnance Survey Points of Interest](https://www.ordnancesurvey.co.uk/products/points-of-interest) dataset provides 2,477,906 destinations in 385 categories, a much broader set than accessibility studies usually consider. Second, public transport isochrones (15, 30, 45, and 60 minutes) and circular buffers (0.75, 1.5, 2.25, and 3 miles, equivalent to walking at 3 mph) are generated around each centroid. Third, the number of each destination type within each isochrone and buffer is counted and divided by the resident population of the measured area to give a per-capita rate (for example, Great Britain has 6.46 restaurants per 10,000 people). Finally, scores are normalised to standard deviations from the national average; 89% of neighbourhoods fall within three standard deviations, and more extreme values are truncated to the -3 to +3 range.

This measure is relative to the England and Wales average, so the analysis tells you how an area compares with the country, not whether provision is adequate. And it counts destinations without judging them, so a small supermarket and a large one have the same affect on the score but may provide very different services.
<!-- /#accessibility -->

#### Further reading {#transportfurtherreading}

* [Mattioli et al. (2020), *The political economy of car dependence: a systems of provision approach*](https://doi.org/10.1016/j.erss.2020.101486), on why car dependence persists.
* [Miner et al. (2024), *Car harm: a global review of automobility's harm to people and the environment*](https://doi.org/10.1016/j.jtrangeo.2024.103817), a systematic account of the wider costs.
* [CREDS, *A disaggregate analysis of "excess" car travel and its role in decarbonisation*](https://www.creds.ac.uk/publications/a-disaggregate-analysis-of-excess-car-travel-and-its-role-in-decarbonisation/), on how much driving could realistically be avoided.
* [CREDS, *Reverse gear: the reality and implications of national transport emission reduction policies*](https://www.creds.ac.uk/publications/reverse-gear-the-reality-and-implications-of-national-transport-emission-reduction-policies/), a critical assessment of UK transport policy.
* [CREDS, *e-bikes could slash transport emissions*](https://www.creds.ac.uk/publications/e-bikes-could-slash-transport-emissions/) and [*Shared mobility: the case for fewer cars, more sharing*](https://www.creds.ac.uk/publications/shared-mobility-the-case-for-fewer-cars-more-sharing/).
* [EDRC, *Developing solutions to fuel and transport poverty challenges*](https://www.edrc.ac.uk/research/projects/developing-solutions-to-fuel-and-transport-poverty-challenges/).
* [TCPA guidance on 20-minute neighbourhoods](https://www.tcpa.org.uk/resources/20-minute-neighbourhoods/), for the planning concept behind the accessibility analysis.

#### Acknowledgement

We are grateful to Friends of the Earth, who funded part of this work and published their own [analysis of Britain's bus decline](https://policy.friendsoftheearth.uk/insight/how-britains-bus-services-have-drastically-declined) using it.

## Retrofit Explorer

The Retrofit Explorer focuses on buildings and the energy they use for heating and power. It maps energy efficiency, energy consumption, bills, and property characteristics from national datasets, down to the level of individual buildings.

### The case for local building data

Heating and powering homes accounts for around a fifth of the UK's greenhouse gas emissions, and the housing stock is among the oldest and least efficient in Europe ([Climate Change Committee, UK housing: Fit for the future?](https://www.theccc.org.uk/publication/uk-housing-fit-for-the-future/)). Reaching net zero requires insulating millions of homes and replacing gas boilers with low-carbon heating such as heat pumps ([Heat and Buildings Strategy](https://www.gov.uk/government/publications/heat-and-buildings-strategy)). Unlike a power station, the building stock cannot be decarbonised by a handful of national decisions: it means physical work on nearly every street in the country.

Energy efficiency is also a cost of living issue. Households in inefficient homes pay hundreds of pounds a year more for the same warmth, and cold homes damage health. Government statistics link fuel poverty directly to the energy efficiency of the dwelling ([fuel poverty statistics](https://www.gov.uk/government/collections/fuel-poverty-statistics)). Knowing which neighbourhoods have the leakiest, most expensive homes shows where retrofit investment would do the most good, for the climate and for the people who live there.

### Using the retrofit data in your area

For a given area, the explorer will answer questions of this kind:

* Which neighbourhoods have the least efficient homes, and what is making them inefficient (walls, roofs, heating, windows)?
* Where are energy bills high relative to incomes, putting households at risk of fuel poverty?
* What types and ages of buildings dominate an area, and what retrofit measures suit them?
* How does energy use vary street by street, and which areas are off the gas grid?

Local authorities can use this evidence to target schemes such as area-based insulation programmes, and community energy groups can use it to identify streets where a shared approach (for example, coordinated solid wall insulation on a Victorian terrace) makes sense.

### Using the retrofit explorer

<!-- #retrofit-zones -->
#### Neighbourhoods {#retrofitneighbourhoods}

![Retrofit Neighboughoods](/images/manual/retrofit-zones.webp)

The Neighbourhoods layer summarises the domestic Energy Performance Certificates (EPCs) registered in England, Wales, and Scotland, alongside property prices and energy consumption. For individual buildings, use the Domestic Properties layer instead.

The drop-down menu changes the visualised measure:

* Average EPC score
* Average floor area
* Building age (most common)
* Wall rating (most common)
* Roof rating (most common)
* Heating rating (most common)
* Windows rating (most common)
* Heating type (most common)
* Fuel type (most common)
* Floor type (most common)
* Building type (most common)
* Tenure at EPC issue (most common)
* % of homes with an EPC
* Average Property Price (2025)
* Property Price to Income Ratio
* Gas Use
* Electricity Use
* Energy bills vs Income

Note that the EPC-based layers summarise only the homes that have an EPC, not every home in the neighbourhood, and EPCs can be out of date. The "% of homes with an EPC" layer helps identify neighbourhoods where the EPC sample may be unrepresentative.

Clicking any neighbourhood opens its report card.

##### Property Price Data

House price data comes from the [Land Registry Price Paid data](https://www.gov.uk/guidance/about-the-price-paid-data) for England and Wales, so it is not available for Scotland. Prices for 2025 are estimated by taking the last sale price of each property and extrapolating forward using local price trends: if a terraced house sold for £100,000 in 2014 and terraced house prices in that local authority have since risen 50%, the property is estimated at £150,000. This simple model ignores small local variations and changes to the property itself, so it must not be used for personal financial decisions, but it is sufficient to show spatial patterns. Properties not sold since the dataset began in 1995 are excluded.

The Property Price to Income Ratio gives an indication of affordability, since households facing prices far above local incomes may struggle with rent or mortgage costs (compare the ONS [housing affordability statistics](https://www.ons.gov.uk/peoplepopulationandcommunity/housing/bulletins/housingaffordabilityinenglandandwales/latest)). Two caveats: the ratio ignores housing type, so an area of small London flats can show a similar ratio to an area of large northern houses; and areas with many non-domestic properties can show inflated prices, because the Price Paid data does not cleanly separate domestic from non-domestic sales.

##### Energy bills vs Income

![Energy bills vs Income](/images/manual/energy_income.webp)

The Energy bills vs Income map is a bivariate map: it uses colour to show two variables at once, household income and household energy bills. The legend shows how colours correspond to pairs of values:

* Purple: high income (top 20%) and high bills (top 20%)
* Green: high income (top 20%) and low bills (bottom 20%)
* Pink: low income (bottom 20%) and high bills (top 20%)
* Orange: low income (bottom 20%) and low bills (bottom 20%)
* White: average income and average bills (middle 20%)

Colour gradients between these extremes represent the intermediate 20% bands.

The map highlights affordability problems: pink areas combine low incomes with high bills, the combination that defines fuel poverty risk ([fuel poverty statistics](https://www.gov.uk/government/collections/fuel-poverty-statistics)). It also reflects housing type, since small flats need less heating than large houses and so tend to have lower bills at any income.

##### Data Sources {#retrofitneighbourhoodsdatasources}

* [EPCs for England and Wales](https://epc.opendatacommunities.org/)
* [EPCs for Scotland](https://www.scottishepcregister.org.uk/)
* [Land Registry Price Paid data](https://www.gov.uk/guidance/about-the-price-paid-data)
<!-- /#retrofit-zones -->

<!-- #retrofit-postcodes -->
#### Postcode Gas & Electric

![Retrofit Postcodes](/images/manual/retrofit-postcodes.webp)

This layer maps the [postcode-level domestic gas and electricity consumption data](https://www.gov.uk/government/publications/postcode-level-domestic-gas-and-electricity-consumption-about-the-data) published by the Department for Energy Security and Net Zero. It is the most geographically detailed public picture of domestic energy use in Great Britain.

The drop-down menu switches between:

* Combined Emissions: electricity plus gas (where available)
* Gas Emissions
* Electricity Emissions

Emissions are graded from A+ (lowest per-household emissions) to F- (highest).

*Note*: in many rural areas homes are not connected to the gas grid and heat with other fuels such as oil. In the combined view these areas can look misleadingly low, because their heating emissions are missing from the data.

The map has gaps where no data is available, either because all buildings in a postcode are non-domestic or because the postcode contains so few homes that the data is suppressed to protect privacy.

Clicking any postcode opens its report card. Postcode boundaries are copyright of Royal Mail, which is why the postcode data cannot be offered for download.

##### Data Sources {#retrofitpostcodeenergydatasources}

* [Postcode gas and electricity consumption](https://www.gov.uk/government/publications/postcode-level-domestic-gas-and-electricity-consumption-about-the-data)
* [Postcode boundaries](https://digimap.edina.ac.uk/) (academic use only)
<!-- /#retrofit-postcodes -->

<!-- #retrofit-epc-dom -->
#### Domestic Properties

![Domestic properties](/images/manual/domestic_properties.webp)

The Domestic Properties layer combines Energy Performance Certificates (England, Scotland, and Wales) with Land Registry price data (England and Wales only), for individual homes. The England and Wales certificates come from the 2026 Q1 extract; the Scottish certificates from the 2025 Q2 extract, which is the most recent Scotland publishes in this form. Where a property has multiple EPCs or sales records, only the most recent is shown.

The drop-down menu changes the visualised characteristic:

* Rating: energy efficiency rating (A best, G worst)
* Building Type
* Property Type
* Building Age: estimated period of construction
* Last Assessed: the year the most recent EPC was issued
* Floor Area: total floor area (m²)
* Floor / Hot Water / Windows / Walls / Roof / Heating / Controls / Lighting Rating: efficiency of each element (Very Good to Very Poor)
* Solar Thermal: has solar water heating (yes/no)
* Solar PV: has solar photovoltaic panels (yes/no)
* Price 2025 (Estimated): estimated value based on historical sales
* Freehold / Leasehold: tenure at the time of the last sale

Clicking any property shows a popup with details from the EPC (descriptions of the roof, walls, floor, heating, and controls) and the most recent Land Registry sale where available.

EPCs are a valuable but imperfect source: they are only created when a home is built, sold, or let, assessments contain errors, and older certificates may not reflect recent improvements ([Hardy & Glew 2019](https://doi.org/10.1016/j.enpol.2019.03.022) analyse errors in the register). A separate weakness matters for anyone using EPCs to predict energy use: modelled EPC energy intensity runs systematically higher than smart-metered consumption in gas-heated homes ([CREDS](https://www.creds.ac.uk/publications/the-over-prediction-of-primary-energy-use-intensity-by-epcs-in-great-britain-a-direct-comparison-of-epc-modelled-and-smart-metered-energy-use-in-gas-heated-homes/)), so an EPC band is a guide to a dwelling's fabric rather than a forecast of its bills. Treat individual certificates as indicative.

The processing behind these layers, including the cleaning of free-text fields, the matching to UPRNs, and the harmonisation of the Scottish and England and Wales registers, is published as [`EPC`](https://github.com/PlaceBasedCarbonCalculator/EPC).

The Scottish EPC register is separate from, and slightly different to, the England and Wales register. Carbon & Place harmonises the two, which can cause small inconsistencies in the Scottish data; for example, Scotland uses different building age bands, which are mapped to the closest England and Wales equivalent.

##### What the EPC caveats mean in practice

Every chart and layer in Carbon & Place that draws on EPCs carries the same three limitations. They are summarised on each chart's Methods tab; this is the fuller version.

**Coverage is partial, and not partial at random.** A certificate is required when a home is built, sold, or let, and lasts ten years. Homes that have changed hands or been rented recently therefore appear; homes owned by the same household for decades often do not. Because tenure and length of residence correlate with age, income, and dwelling type, the sample is biased rather than merely incomplete: rented properties are over-represented, and long-held owner-occupied homes under-represented. The **% of homes with an EPC** layer shows how large the gap is in each neighbourhood, and is the first thing to check before comparing areas. The Dwelling Stock tab, built from council tax records, covers every home and is the better basis for counting.

**Certificates age.** A certificate reflects the home as it was on the day of the assessment, which may be years ago. Improvements made since, including new insulation, a new boiler, or solar panels, are invisible until the next assessment. Retrofit is therefore systematically under-counted, and solar PV especially so, since people often improve a home shortly after buying it, which is exactly when its certificate was issued.

**Assessments contain errors, and the model behind them is not a predictor of energy use.** An audit of the register found at least one error in a majority of certificates ([Hardy & Glew 2019](https://doi.org/10.1016/j.enpol.2019.03.022)). Separately, and more fundamentally, the EPC band scores modelled energy *cost* per square metre under standard occupancy. It is not a measurement, and modelled EPC energy intensity runs systematically higher than smart-metered consumption in gas-heated homes ([CREDS](https://www.creds.ac.uk/publications/the-over-prediction-of-primary-energy-use-intensity-by-epcs-in-great-britain-a-direct-comparison-of-epc-modelled-and-smart-metered-energy-use-in-gas-heated-homes/)). Because the band follows cost rather than carbon, a home on an expensive but clean fuel can score below a leakier home burning gas.

None of this makes EPCs useless. They remain the only national dataset in which a trained assessor has visited the building and recorded what it is made of, which is why we use them. But an EPC-based figure for a neighbourhood is a statement about the certificated homes in that neighbourhood, not about all its homes, and it should be quoted that way.

##### Data Sources {#retrofitdomesticdatasources}

* [EPCs for England and Wales](https://epc.opendatacommunities.org/)
* [EPCs for Scotland](https://www.scottishepcregister.org.uk/)
<!-- /#retrofit-epc-dom -->

<!-- #retrofit-epc-nondom -->
#### Non-domestic Properties

![Non-domestic Properties](/images/manual/retrofit-epc-nondom.webp)

The Non-domestic Properties layer shows Energy Performance Certificates for commercial and public buildings (England, Scotland, and Wales) combined with Land Registry price data (England and Wales only). The England and Wales certificates come from the 2026 Q1 extract and the Scottish certificates from the 2025 Q2 extract, showing the most recent certificate and sale for each property.

The drop-down menu changes the visualised characteristic:

* Rating: energy efficiency rating (A best, G worst)
* Transaction: the type of transaction that triggered the EPC
* Floor Area: total floor area (m²)
* Last Assessed: the year the EPC was issued
* Price 2025 (Estimated): estimated value based on historical sales
* Freehold / Leasehold: tenure at the time of the last sale

Clicking any point shows a popup with more details.

As with domestic properties, the Scottish register is separate and slightly different, and harmonisation can introduce small inconsistencies.

##### Data Sources {#retrofitnondomesticdatasources}

* [EPCs for England and Wales](https://epc.opendatacommunities.org/)
* [EPCs for Scotland](https://www.scottishepcregister.org.uk/)
<!-- /#retrofit-epc-nondom -->

<!-- #retrofit-uprn-unknown -->
#### Unknown Properties

![Unknown Properties](/images/manual/retrofit-uprn-unknown.webp)

Every addressable location in Great Britain has a Unique Property Reference Number (UPRN), and the locations of UPRNs are [free open data](https://www.ordnancesurvey.co.uk/products/os-open-uprn). Richer information, such as addresses and property characteristics, is mostly commercial and not freely available.

This layer shows every UPRN that does not appear in the Domestic or Non-domestic Properties layers: places we know exist, but about which the public record says nothing, because they have no EPC and (in England and Wales) have not been sold since 1995. In Scotland there is no public record of property sales at all. The layer exists to make this gap visible: public knowledge of the building stock is substantial but far from complete.

Clicking a UPRN shows its ID number, whether the property currently exists, and whether the UPRN was added to the database recently (since 2020).

##### Data Sources {#retrofitunknownpropertiesdatasources}

* [OS Open UPRN](https://www.ordnancesurvey.co.uk/products/os-open-uprn)
<!-- /#retrofit-uprn-unknown -->

<!-- #retrofit-solar -->
#### Solar Potential

![Solar Potential](/images/manual/retrofit-solar.webp)

The Solar Potential layer maps how much solar energy reaches every 2 metre square of Great Britain over a year, measured in kilowatt hours per square metre per year (kWh/m²/year). For scale, a flat, unshaded site in Great Britain receives somewhere between about 750 and 1,100 kWh/m² a year, with more in the south than the north. It is a photograph of the resource, not a prediction of output: it shows how much sunlight arrives, before any assumptions about panel efficiency, orientation of the panel itself, or shading by anything not in the terrain model.

Because the model works from a surface model that includes buildings and trees, it resolves individual roof pitches. Zoom in far enough and a south-facing slope reads orange or red while the north-facing slope of the same roof reads blue, and the shadow a tall building casts over its neighbours is visible as a cool patch. Zoom out and the pattern is dominated by latitude and by terrain: south-facing valley sides are noticeably brighter than north-facing ones.

Colours run from dark blue (least sunlight) through green and yellow to dark red (most), using the Turbo colour scale. The scale is fixed from 0 to 2000 kWh/m²/year so that the colours mean the same thing every time the layer is rebuilt. A small number of surfaces, chiefly steep south-facing roofs, exceed 2000, so the darkest red should be read as "2000 or more" rather than as the maximum. The lowest part of the scale is also unused, because the lowest value anywhere in the data is close to 100, so the map in practice uses the middle of the colour range. Areas with no data, including the sea, are transparent.

The transparency slider fades the layer so that streets and buildings on the basemap can be seen through it. At 0% the solar map is solid; drag it up to see the map underneath.

Two limitations are worth keeping in mind. The layer is a visualisation, and the colour is compressed slightly when the tiles are stored, so it should be read to the nearest band rather than as an exact number. And it models sunlight reaching a surface, not electricity: converting to expected generation needs assumptions about panel type, efficiency, and how much of a roof is usable, none of which are applied here.

##### Data Sources {#retrofitsolardatasources}

* [Environment Agency National LIDAR Programme](https://www.data.gov.uk/dataset/f0db0249-f17b-4036-9e65-309148c97ce4/national-lidar-programme) (surface model, processed by the [GBDEM](https://github.com/PlaceBasedCarbonCalculator/GBDEM) and [GBsolar](https://github.com/PlaceBasedCarbonCalculator/GBsolar) analyses)
* [ECMWF ERA5](https://www.ecmwf.int/en/forecasts/dataset/ecmwf-reanalysis-v5) (cloud and radiation adjustment)
<!-- /#retrofit-solar -->

### Retrofit report card

#### Neighbourhoods {#retrofitcardneighbourhoods}

The neighbourhood report card summarises energy, EPCs, and prices for each area.

##### Energy Consumption

Historical data, from 2010 to 2024, on domestic gas and electricity consumption, shown three ways:

* Mean: total consumption divided by the number of homes
* Median: the middle home (half use more, half use less)
* Total: all homes added together

The mean and median together indicate how skewed consumption is: a mean well above the median suggests a minority of high-consuming homes pulling the average up.

The report also estimates the average household energy bill, combining local (LSOA) consumption with regional unit rates and standing charges. This gives a rough idea of spending but does not account for specialist tariffs, so it may overestimate bills in places with many electric vehicles or heat pumps, whose owners often use cheaper off-peak tariffs.

For households off the gas grid, consumption of other heating fuels (oil, wood, solid fuel) must be estimated, otherwise these mostly rural areas would appear to have implausibly low bills. No local measurements of these fuels exist, but the 2011 and 2021/22 censuses record how many households use each fuel in every area, and typical heating demand and prices are applied to produce an approximate estimate.

##### EPCs

Summary statistics for the domestic properties in the neighbourhood that have an EPC. Remember that homes without an EPC (typically those not built, sold, or let recently) are invisible here, and in some neighbourhoods they are the majority.

Each chart on this tab groups the certificate data twice over, and it is worth knowing that before reading a figure off one. Free-text fields such as the wall, roof, floor, heating, and hot water descriptions are first cleaned into a controlled vocabulary, which for heating alone runs to some 220 distinct systems. That vocabulary is then grouped again into the handful of categories a pie chart can show: six for roofs, seven for walls, nine for floors, eight for heating systems. A great deal of useful detail disappears at the second step, most obviously the depth of loft insulation, which is recorded on the certificate but reduced here to the single category *pitched*. Where you need that detail, the Domestic Properties layer keeps the full description for every individual home. The Methods tab beneath each chart sets out exactly how that chart's categories are built.

##### Prices

Summary statistics from the Land Registry Price Paid data for England and Wales, covering domestic and non-domestic sales.

#### Dwelling stock

The Dwelling Stock tab describes every home in the area, taken from the council tax registers rather than from EPCs. This is the complement to the EPCs tab: an EPC exists only for a home built, sold, or let since 2008, roughly two thirds of the stock, whereas every dwelling is banded for council tax.

**Council tax bands** counts dwellings in each band, year by year. The total is a complete count of homes, so its growth shows where building has happened, and the band mix is a rough indication of property size and value. Remember the bands rest on 1991 values in England and Scotland, and 2003 in Wales, so they have drifted a long way from current prices. Band I exists only in Wales.

**Dwelling type**, **Bedrooms**, and **Build period** break the same complete stock down by built form, size, and age. Build period is the most useful of the three for retrofit: it predicts wall construction, and therefore which insulation measures apply and what they cost.

These four charts have different coverage. Council tax bands are shown for the whole of Great Britain: the Valuation Office Agency publishes England and Wales, and the equivalent Scottish series from statistics.gov.scot is added on 2022 Data Zones. The type, bedroom, and build period breakdowns are published for England and Wales only, and no Scottish equivalent exists, so for a Scottish neighbourhood those three charts are replaced by a short note saying so.

#### Postcodes

The postcode report provides historical data (2015 to 2024) on domestic gas and electricity consumption, as mean, median, and total.

Electricity is further divided by meter type: all, standard, and Economy 7. Economy 7 meters are an older type charging two rates by time of day; they are becoming less common and are being replaced by smart meters (counted in the standard category).

To protect privacy, DESNZ removes data for postcodes with few properties, and may remove one meter type where it is rare, which causes gaps in the data. Postcodes are also not designed for statistics: unlike LSOAs, they change frequently to meet mail delivery needs. Carbon & Place shows data for current postcodes only, so historical data is missing in some places.

### Further reading {#retrofitfurtherreading}

* [Climate Change Committee, *UK housing: fit for the future?*](https://www.theccc.org.uk/publication/uk-housing-fit-for-the-future/), still the clearest statement of the scale of the task.
* [CREDS, *Decarbonisation of heat findings report*](https://www.creds.ac.uk/decarbonisation-of-heat/decarbonisation-of-heat-findings-report/), a synthesis of UK research on heat.
* [CREDS, *Existing and future technologies for retrofitting the UK housing stock*](https://www.creds.ac.uk/publications/existing-and-future-technologies-for-retrofitting-the-uk-housing-stock/).
* [CREDS, *The over-prediction of primary energy use intensity by EPCs in Great Britain*](https://www.creds.ac.uk/publications/the-over-prediction-of-primary-energy-use-intensity-by-epcs-in-great-britain-a-direct-comparison-of-epc-modelled-and-smart-metered-energy-use-in-gas-heated-homes/), essential background if you plan to use EPC bands to estimate energy use.
* [Hardy & Glew (2019), *An analysis of errors in the Energy Performance Certificate database*](https://doi.org/10.1016/j.enpol.2019.03.022).
* [EDRC, *Place-based Retrofit and Regeneration Models*](https://www.edrc.ac.uk/research/projects/place-based-retrofit-and-regeneration-models/), current work on how retrofit is delivered at neighbourhood scale.
* [Historic England, energy efficiency and historic buildings](https://historicengland.org.uk/advice/technical-advice/energy-efficiency-and-historic-buildings/), for conservation areas and listed homes.
* [Government fuel poverty statistics](https://www.gov.uk/government/collections/fuel-poverty-statistics), for the affordability side.

## Land Ownership Explorer

### The case for open ownership data

It is hard to discuss any issue of place without eventually reaching the question of who owns the land. Landowners, through action and inaction, shaped the country into what it is today: they influence where homes and jobs go, what is farmed, and what is left for nature. Land ownership in Britain is highly concentrated, and reliable public information about who owns what has historically been difficult to obtain, despite the existence of an official register.

Land ownership matters for climate and planning policy too. Delivering new housing, woodland creation, renewable energy, and flood management all require negotiating with landowners, and fragmented or opaque ownership can stall all of them. HM Land Registry publishes several open datasets about land ownership in England and Wales, but they are published as spreadsheets and polygons without a convenient public map. The Land Ownership Explorer makes these official datasets visible and explorable.

### Using the ownership data in your area

For a particular place, the explorer can address questions such as these:

* Who owns the large sites in and around our town, according to the Land Registry?
* Which local land is owned by companies, and which by overseas entities?
* Where are the large unbroken land holdings, and where is land fragmented into many small titles?

This can inform neighbourhood plans, community land purchases, campaigns for access or development, and journalism. For definitive information on any specific title, purchase the official record from [HM Land Registry](https://www.gov.uk/search-property-information-land-registry).

### Using the land ownership explorer

<!-- #landownership-inspire -->
#### INSPIRE Polygons

The INSPIRE polygons, named after the [EU INSPIRE Directive](https://use-land-property-data.service.gov.uk/datasets/inspire) that required their publication, are created by HM Land Registry and show the boundaries of registered freehold land in England and Wales. They are open data, but the Land Registry does not provide an easy way to view them; this layer fills that gap with a cleaned snapshot from 2026.

Land Registry maps are often digitised from old paper maps, so single holdings are frequently split along the grid lines where one paper map sheet met the next. An automated method was used to rejoin these split polygons and give a clearer picture of large landholdings. The process is imperfect: some grid-aligned titles remain, some polygons have been merged, and merged polygons carry only one of their original INSPIRE IDs, chosen effectively at random.

![Grid Detection](/images/manual/grid_detection.webp)
*An example of the cleaning process: polygon borders aligned with the map grid have been detected and highlighted in red. The INSPIRE data is very messy, and while the cleaning is not perfect, it makes large titles much clearer.*

Because the dataset is so large, not every title can be drawn at once. When zoomed out, only the largest polygons are shown; zoom in to see them all.

![INSPIRE zoomed out](/images/manual/inspire_out.webp)
*When zoomed out, only the largest polygons are shown*

![INSPIRE zoomed in](/images/manual/inspire_in.webp)
*Zoom in a little and all polygons appear*

Not all land is registered, so the map has genuine gaps. Registration only became compulsory in 1990, and then only when land changes hands, so around 14% of land in England and Wales remains unregistered; much of it has been held by the same families or institutions for generations.

Some polygons overlap, which happens when different interests exist in the same land. London Underground may own a tunnel while someone else owns the surface, and solar farm operators sometimes purchase air rights to stop neighbouring development shading their panels.

##### Colouring the parcels

By default the parcels are drawn as a plain wash, because the usual reason to turn the layer on is simply to see where the boundaries run. The drop-down offers two colourings.

**Properties on the parcel** counts how many current addresses sit inside each parcel, and sorts them into three groups:

* **One property**: the parcel is that property's plot. This is the common case, about seven in ten parcels.
* **No properties**: bare land. Fields, gardens, and access strips held on their own title, car parks, yards, and sites where the building has gone. Also, occasionally, a parcel whose address point happens to fall just outside the mapped boundary.
* **Several**: a block of flats, a terrace held on one title, a farm with several dwellings, or a large mixed site.

"Current" matters here. The count uses only addresses present in the latest Ordnance Survey release, not every address ever recorded, so a plot whose two flats were long ago knocked through into one house counts as one property rather than two.

**Price per square metre** divides a property's estimated 2025 value by the area of its parcel. It is shown **only** for the one-property parcels, and that restriction is the whole point: only when the parcel is a single property's plot does dividing its value by that area mean anything. For a block of flats the same sum would divide one flat's value by the whole building's footprint.

Treat the result as indicative. The value is a model estimate, extrapolated forward from the property's last recorded sale using local price trends, so it is least reliable for homes that have not changed hands recently and is unavailable for homes never sold since 1995. The area is the registered parcel, which is not always the same as the garden or the usable land. The measure is most informative compared between neighbouring parcels rather than read as a number.

Click any polygon to see its INSPIRE ID (which can be used to purchase the full title from the Land Registry), the local authority name, the area in square metres, how many properties are on it, and where applicable the estimated value and price per square metre.
<!-- /#landownership-inspire -->

<!-- #landownership-points -->
#### Property owned by UK and overseas companies

![Property owned by UK and overseas companies](/images/manual/landownership-points.webp)

HM Land Registry publishes two open datasets that explicitly name landowners: [UK companies that own property in England and Wales](https://use-land-property-data.service.gov.uk/datasets/ccod) (CCOD) and [Overseas companies that own property in England and Wales](https://use-land-property-data.service.gov.uk/datasets/ocod) (OCOD). Note that these cover organisations only; property owned by private individuals is not included.

The points are located by matching each title's address text to a known property address wherever possible, and only falling back to geocoding the raw text when no match can be found. The **Location confidence** colouring shows how much to trust each dot's position, from High (matched to a specific property) down through Street (the right street, but not the right building) to Guess. Colour by it before drawing conclusions from a cluster of points: a dense group of low-confidence dots may be one street's worth of titles all snapped to the same place.

These datasets are rich but hard to use because they are published as tables of text addresses, not as a map. The main purpose of this layer is to [geocode](https://en.wikipedia.org/wiki/Address_geocoding) those addresses, converting text into coordinates that can be plotted.

Some titles are simple, for example:

*5 West Park, Bristol (BS8 2LX)*

This geocodes cleanly: we cannot recover the exact property boundary, but we can place a point at the address.

Others are not. A single title can list hundreds of addresses:

*1-4 Crown Row, Bracknell (RG12 0TH), 3, 14, 17, 18, 21, 26, 29, 31, 45, 49, 50, 55-70, 74, 75, 77-81, 84, 85, 91-95, 101, 103, 104, 106, 110, 111 Dalcross, Bracknell (RG12 0UJ), 71-73, 76, 82, 83, 86, 87 Dalcross, Bracknell (RG12 0UL), ...*

A single dot cannot convey the extent of such a holding, but the text can be parsed into its component addresses: 233 of them in this case, and possibly more, since the record is truncated at 999 characters mid-postcode. Across the dataset, 9,034 freehold titles contain multiple postcodes, and parsing them yields 168,911 unique property addresses.

Around 1.77 million titles are simple addresses that pass straight through a geocoder. Titles of the form "address and associated land" become geocodable once the extra words are removed. Vaguer titles such as "land in front of address" are geocoded to the named address, and "land north of Somewhere Road" to the road itself. Around 1% of titles are too complex to geocode at all and are discarded.

The result is inherently imperfect: the data is unstructured, so there are errors and gaps. "The field behind 4 to 6 Privet Drive" is not the same as three points at 4, 5, and 6 Privet Drive, but that is how it will appear. Treat each point as *in the vicinity of* the correct location rather than exactly on it. Where the Land Registry's own address is ambiguous ("3 Church Lane, London" could be many places), the local authority name narrows it down, but some titles still appear in multiple candidate locations.

##### Layer Options

The points can be coloured by four variables:

1. **Organisation Type**: the type of organisation that owns the property (the dataset does not include property owned by private individuals).
2. **Geocoding Accuracy**: how precisely the point could be located. Address (green) means the full address was found; road, postcode, or region matches will be further from their true location.
3. **Country of Registration**: where the owning company is registered.
4. **Tenure**: whether the title is freehold or leasehold.

##### Popup

![Land owners popup](/images/manual/landowners_popup.webp)
*Click on any point to see more information*

* Title: the title number held by the Land Registry
* Tenure: freehold or leasehold
* Property Address: as recorded by the Land Registry (may contain multiple addresses)
* Company No: the company number registered with Companies House
* Country: country of registration
* Category: type of organisation
* Geocoded address: the address the point was placed at; it should match the Land Registry address, but may differ if the address was misinterpreted
* Geocode type: what kind of location was matched (address, road, postcode, or region)
* Proprietor: the owner's name as registered with the Land Registry
<!-- /#landownership-points -->

### Methods and further reading

The geocoding and polygon-cleaning pipeline described above was developed for Carbon & Place and is published as [`LandOwnership`](https://github.com/PlaceBasedCarbonCalculator/LandOwnership). For context on land ownership in Britain, see HM Land Registry's [open data portal](https://use-land-property-data.service.gov.uk/), and for the wider debate, the [House of Commons Library research on land value capture](https://commonslibrary.parliament.uk/research-briefings/sn06846/).

## Land Use and Planning Explorer

The Land Use and Planning Explorer maps the designations and constraints that shape what can be built where: flood zones, protected landscapes and habitats, heritage designations, green belt, and environmental hazards such as noise and historic landfill.

### The case for mapping designations together

Roughly half the land in England carries some form of designation that constrains development, from green belt to Sites of Special Scientific Interest. These designations exist for good reasons (protecting nature, heritage, and people from hazards such as flooding), but their combined effect determines where new homes, energy infrastructure, and industry can realistically go. Debates about housing supply, onshore wind, and nature recovery are, in large part, debates about these maps.

Most designations are recorded in separate datasets published by different agencies. Bringing them together on one map makes it easier to understand why development happens where it does, and to have informed discussions about the [National Planning Policy Framework](https://www.gov.uk/government/publications/national-planning-policy-framework--2) (NPPF), local plans, and individual planning applications.

### Using the designations in your area

Questions the explorer can help settle for a particular area include:

* Which parts of our area are protected, and by what (green belt, conservation areas, flood zones, protected habitats)?
* Where could development plausibly go, given the constraints?
* Which homes and streets are exposed to flood risk or high transport noise?
* What heritage assets exist locally, and what protection do they have?

This is useful background for responding to planning applications, contributing to a local plan or neighbourhood plan, and understanding the trade-offs in local development debates.

### Using the land use explorer

Each layer below can be toggled on the map. Click features for details. The layers are grouped into environmental hazards, landscape and nature designations, and heritage designations.

<!-- #landuse-floodzones -->
#### Flood Zones

![Flood Zones](/images/manual/landuse-floodzones.webp)

Flood zones are areas of England assessed by the [Environment Agency](https://www.gov.uk/check-long-term-flood-risk) as being at risk of flooding from rivers or the sea. They are used in planning to steer development away from the highest-risk land, following the [flood risk and coastal change planning guidance](https://www.gov.uk/guidance/flood-risk-and-coastal-change):

1. **Flood Zone 1 (low risk)**: land with less than a 0.1% chance of flooding in any year (less than 1 in 1,000). Development here faces no flood-related planning restriction in most cases.
2. **Flood Zone 2 (medium risk)**: land with between a 0.1% and 1% annual chance of river flooding (between 1 in 1,000 and 1 in 100), or between 0.1% and 0.5% from the sea. Planning applications here require a flood risk assessment.
3. **Flood Zone 3 (high risk)**: land with a 1% or greater annual chance of river flooding (1 in 100), or 0.5% or greater from the sea. The planning system applies a sequential test that directs development to lower-risk land first, and vulnerable uses such as housing require exception tests.

Two caveats are important. Flood zones show the risk *ignoring existing flood defences*, so defended land (much of central London, for example) appears as high risk even though defences reduce the day-to-day likelihood. And the zones cover river and sea flooding only; surface water flooding, which affects many more properties, is mapped separately by the Environment Agency. Zones are periodically revised as modelling improves and the climate changes, so check the [current official map](https://www.gov.uk/check-long-term-flood-risk) for any specific site.
<!-- /#landuse-floodzones -->

<!-- #landuse-railnoise -->
#### Railway noise

![Railway noise](/images/manual/landuse-railnoise.webp)

This layer shows modelled railway noise from [Defra's strategic noise mapping](https://www.gov.uk/government/publications/strategic-noise-mapping-2019), produced every five years for major railways under the Environmental Noise Regulations.

Railway noise comes from wheels on rails, engines, and infrastructure such as bridges and level crossings, and varies with train type, speed, and distance. Long-term exposure to high levels of transport noise is associated with sleep disturbance, annoyance, stress, and cardiovascular disease; the [World Health Organization](https://www.who.int/europe/publications/i/item/9789289053563) recommends keeping average railway noise below 54 dB Lden. Noise also affects wildlife by disturbing behaviour and fragmenting habitats.

Noise is a planning consideration: new homes near railways may require acoustic assessment and mitigation under the NPPF and the [Noise Policy Statement for England](https://www.gov.uk/government/publications/noise-policy-statement-for-england).
<!-- /#landuse-railnoise -->

<!-- #landuse-roadnoise -->
#### Road noise

![Road noise](/images/manual/landuse-roadnoise.webp)

This layer shows modelled road traffic noise from [Defra's strategic noise mapping](https://www.gov.uk/government/publications/strategic-noise-mapping-2019), produced every five years for major roads under the Environmental Noise Regulations.

Road noise comes from engines, exhausts, and tyres on the road surface, and rises with traffic volume and speed. It is the most widespread form of transport noise: far more people live near busy roads than near railways or airports. Long-term exposure is associated with sleep disturbance, annoyance, and cardiovascular disease; the [World Health Organization](https://www.who.int/europe/publications/i/item/9789289053563) recommends keeping average road traffic noise below 53 dB Lden.

Electric vehicles reduce engine noise but not tyre noise, which dominates above roughly 20 mph, so traffic noise will remain a planning issue even as the fleet electrifies.
<!-- /#landuse-roadnoise -->

<!-- #landuse-landfill -->
#### Historic landfills

![Historic landfills](/images/manual/landuse-landfill.webp)

Historic landfills are sites where waste was buried in the past, often before modern environmental regulation. The [Environment Agency's historic landfill dataset](https://environment.data.gov.uk/) records their known locations, though records for the oldest sites are incomplete.

Many were operational in the twentieth century, when waste was poorly documented, and were sited on land considered undesirable at the time: low-lying ground, old quarries, and river edges. Depending on what was buried, they can contain hazardous materials and can generate landfill gas (largely methane, a potent greenhouse gas) and polluting leachate for decades after closure.

Building on or near former landfill is possible but requires investigation and remediation under the contaminated land regime in [Part 2A of the Environmental Protection Act 1990](https://www.gov.uk/government/publications/contaminated-land-statutory-guidance), for which local authorities are the lead regulator. The layer is therefore relevant both to development siting and to understanding local environmental history.
<!-- /#landuse-landfill -->

<!-- #landuse-aonb -->
#### National Landscapes (Areas of Outstanding Natural Beauty)

![National Landscapes (Areas of Outstanding Natural Beauty)](/images/manual/landuse-aonb.webp)

Areas of Outstanding Natural Beauty (AONBs), [rebranded as National Landscapes in 2023](https://www.national-landscapes.org.uk/), are landscapes designated for their exceptional natural beauty in England, Wales, and Northern Ireland. The legal designation, under the [Countryside and Rights of Way Act 2000](https://www.gov.uk/guidance/areas-of-outstanding-natural-beauty-aonbs-designation-and-management), gives them the same level of landscape protection as national parks, though unlike national parks they have no dedicated planning authority.

There are 46 National Landscapes in the UK: 33 wholly in England, 4 in Wales, 1 straddling the border (the Wye Valley), and 8 in Northern Ireland. Together they cover around 14% of England and around a quarter of Wales and Northern Ireland. They range from the Cotswolds and Chilterns to coasts, moorland, and chalk downland.

Each is managed by a partnership of local authorities, landowners, and other interests, which must balance conservation with farming, tourism, and the needs of communities who live there. In planning terms, the NPPF gives "great weight" to conserving and enhancing their landscape and scenic beauty, and major development within them requires exceptional circumstances.
<!-- /#landuse-aonb -->

<!-- #landuse-ancientwoodland -->
#### Ancient woodlands

![Ancient woodlands](/images/manual/landuse-ancientwoodland.webp)

Ancient woodland is land that has been continuously wooded since at least 1600 AD in England and Wales. Centuries of undisturbed development make these woods uniquely rich habitats, with soils, fungi, and species communities that cannot be recreated by planting new trees; they are also historical documents, often preserving medieval boundary banks and coppice structures. Ancient woodland now covers only around 2.5% of England, recorded in Natural England's [Ancient Woodland Inventory](https://www.gov.uk/guidance/ancient-woodland-ancient-trees-and-veteran-trees-advice-for-making-planning-decisions).

The [National Planning Policy Framework](https://www.gov.uk/government/publications/national-planning-policy-framework--2) treats ancient woodland as an irreplaceable habitat: development that would cause its loss or deterioration should be refused unless there are wholly exceptional reasons. Despite this, ancient woods continue to be lost or degraded incrementally through development pressure, and many are damaged by plantation forestry, invasive species, and nitrogen deposition.

Restoration initiatives include the [Woodland Trust's](https://www.woodlandtrust.org.uk/protecting-trees-and-woods/ancient-woodland-restoration/) ancient woodland restoration programme, which works to restore ancient woods planted over with conifers.
<!-- /#landuse-ancientwoodland -->

<!-- #landuse-conservationareas -->
#### Conservation areas

![Conservation areas](/images/manual/landuse-conservationareas.webp)

Conservation areas are places of special architectural or historic interest whose character and appearance is protected by law. Local authorities designate them under the [Planning (Listed Buildings and Conservation Areas) Act 1990](https://www.legislation.gov.uk/ukpga/1990/9/contents), and there are around 10,000 in England, ranging from historic town centres to Victorian suburbs, model villages, and industrial areas ([Historic England guidance](https://historicengland.org.uk/listing/what-is-designation/local/conservation-areas/)).

Within a conservation area, extra planning controls apply: demolition generally requires consent, works to trees must be notified, and some permitted development rights are restricted. The local authority has a duty to preserve or enhance the area's character when making planning decisions.

Conservation areas matter for retrofit and decarbonisation because the controls can constrain measures such as external wall insulation, replacement windows, and solar panels. Balancing heritage protection with the need to decarbonise older buildings is an active policy question; see [Historic England's advice on energy efficiency in historic buildings](https://historicengland.org.uk/advice/technical-advice/energy-efficiency-and-historic-buildings/).
<!-- /#landuse-conservationareas -->

<!-- #landuse-greenbelt -->
#### Green Belt

![Green Belt](/images/manual/landuse-greenbelt.webp)

The green belt is a planning policy designed to prevent urban sprawl by keeping a belt of land around certain cities permanently open. It began with London in 1938 and became national policy in 1955; today 14 separate green belts cover around 12.6% of England ([official green belt statistics](https://www.gov.uk/government/collections/green-belt-statistics)).

The [NPPF](https://www.gov.uk/government/publications/national-planning-policy-framework--2) sets out five purposes: checking sprawl, preventing neighbouring towns from merging, safeguarding the countryside from encroachment, preserving the setting of historic towns, and encouraging urban regeneration by recycling derelict land. Within the green belt, most new building is "inappropriate development" permitted only in very special circumstances.

Contrary to a common assumption, green belt is a planning designation rather than an environmental one: much of it is intensive farmland with no public access or particular ecological value, and it is distinct from designations such as AONB or SSSI (though land can hold several designations at once). Critics argue that green belts push development to less sustainable locations beyond them and worsen housing affordability, while supporters credit them with containing sprawl and protecting the countryside; both effects are documented in the economics literature and in [House of Commons Library briefings on green belt](https://commonslibrary.parliament.uk/research-briefings/sn00934/).
<!-- /#landuse-greenbelt -->

<!-- #landuse-listedbuildings -->
#### Listed buildings

![Listed buildings](/images/manual/landuse-listedbuildings.webp)

Listed buildings are buildings of special architectural or historic interest included on the [National Heritage List for England](https://historicengland.org.uk/listing/the-list/), maintained by Historic England. Listing covers around 400,000 entries, from castles and cathedrals to cottages, telephone boxes, and post-war housing estates.

There are three grades: Grade I (exceptional interest, about 2.5% of listings), Grade II* (particularly important, about 5.8%), and Grade II (special interest, about 91.7%) ([Historic England](https://historicengland.org.uk/listing/what-is-designation/listed-buildings/)). Listing protects the whole building, inside and out, and often curtilage structures too; alterations that affect its special interest require listed building consent from the local planning authority, and unauthorised works are a criminal offence.

Like conservation areas, listing interacts with decarbonisation: listed homes are exempt from some energy efficiency requirements, and owners must navigate consent for measures such as secondary glazing or heat pumps. [Historic England's retrofit advice](https://historicengland.org.uk/advice/technical-advice/energy-efficiency-and-historic-buildings/) sets out what is usually achievable.
<!-- /#landuse-listedbuildings -->

<!-- #landuse-nationalparks -->
#### National parks

![National parks](/images/manual/landuse-nationalparks.webp)

National parks are extensive tracts of countryside protected for their natural beauty, wildlife, and cultural heritage, and for the opportunities they offer for open-air recreation. They were created by the [National Parks and Access to the Countryside Act 1949](https://www.legislation.gov.uk/ukpga/Geo6/12-13-14/97), a landmark of post-war reconstruction that followed decades of campaigning for public access to the countryside.

England has ten national parks, from the Lake District to the South Downs, covering around 10% of the country; the Broads has equivalent status under its own legislation ([National Parks](https://www.nationalparks.uk/)). Each is run by a national park authority, which is the planning authority for its area and has statutory purposes to conserve the landscape and promote its enjoyment, together with a duty to foster the economic and social wellbeing of local communities.

Unlike national parks in many other countries, English national parks are lived-in, farmed landscapes that are mostly privately owned. Balancing conservation, recreation, farming, housing affordability for residents, and (increasingly) nature recovery and carbon storage in peat and woodland is their central challenge ([Landscapes review, 2019](https://www.gov.uk/government/publications/designated-landscapes-national-parks-and-aonbs-2018-review)).
<!-- /#landuse-nationalparks -->

<!-- #landuse-naturereserves -->
#### Nature reserves

![Nature reserves](/images/manual/landuse-naturereserves.webp)

Nature reserves are areas managed primarily for the conservation of wildlife, habitats, and geology, and usually also for public enjoyment and education. This layer includes statutory reserves in England:

* **National Nature Reserves** (NNRs) are declared by [Natural England](https://www.gov.uk/government/collections/national-nature-reserves-in-england) and represent many of the finest wildlife and geological sites in the country. There are over 200, managed by Natural England, wildlife trusts, the National Trust, and other approved bodies.
* **Local Nature Reserves** (LNRs) are designated by local authorities under the National Parks and Access to the Countryside Act 1949. They are typically smaller and closer to where people live, and give communities access to nature nearby.

Management typically involves maintaining the habitats that make each site special: grazing, coppicing, controlling invasive species, and managing visitor pressure. Beyond their conservation role, reserves provide ecosystem services such as flood attenuation and carbon storage, and access to them supports health and wellbeing ([Natural England evidence on nature and health](https://www.gov.uk/government/publications/nature-and-wellbeing-evidence-briefing)).
<!-- /#landuse-naturereserves -->

<!-- #landuse-parksandgardens -->
#### Registered Parks and Gardens

![Registered Parks and Gardens](/images/manual/landuse-parksandgardens.webp)

The [Register of Historic Parks and Gardens](https://historicengland.org.uk/listing/what-is-designation/registered-parks-and-gardens/), maintained by Historic England, identifies designed landscapes of national importance in England: over 1,700 sites ranging from medieval deer parks and great country house landscapes to municipal parks, cemeteries, and post-war designed spaces.

Sites are graded I, II*, and II on the same basis as listed buildings, according to the quality and rarity of the design and its state of survival. Registration does not create a separate consent regime, but it is a material consideration in planning: harm to a registered landscape must be weighed in any planning decision, and Historic England is consulted on proposals affecting the most important sites.

Historic parks face distinctive pressures, including development on their edges, loss of features through under-maintenance, and climate change stressing veteran trees and historic planting schemes.
<!-- /#landuse-parksandgardens -->

<!-- #landuse-RAMSAR -->
#### Ramsar sites

![Ramsar sites](/images/manual/landuse-RAMSAR.webp)

Ramsar sites are wetlands of international importance designated under the [Ramsar Convention](https://www.ramsar.org/), an international treaty signed in 1971 in Ramsar, Iran. Wetlands qualify for their ecology, botany, zoology, limnology, or hydrology, and especially as habitat for waterbirds.

Wetlands are broadly defined, covering marsh, fen, peatland, and open water, whether natural or artificial, including marine water to a depth of six metres at low tide. The UK has around 175 Ramsar sites ([JNCC](https://jncc.gov.uk/our-work/ramsar-sites/)), including major estuaries, lakes, and peatlands; globally there are over 2,400 covering more than 250 million hectares.

In UK planning policy, Ramsar sites receive the same strict protection as the national site network of protected habitats: development likely to harm them faces a rigorous assessment, and alternatives must be considered first. Wetlands also store large amounts of carbon, so their protection contributes to climate goals as well as biodiversity.
<!-- /#landuse-RAMSAR -->

<!-- #landuse-SAC -->
#### Special Areas of Conservation

![Special Areas of Conservation](/images/manual/landuse-SAC.webp)

Special Areas of Conservation (SACs) protect the habitats and non-bird species considered most in need of conservation at a European scale: sites are selected using scientific criteria for features such as heathlands, blanket bog, estuaries, and species such as otters, bats, and freshwater pearl mussels. They were designated under the EU Habitats Directive, and since EU exit are protected in domestic law by the [Conservation of Habitats and Species Regulations 2017](https://www.legislation.gov.uk/uksi/2017/1012/contents), forming part of the UK's national site network with SPAs.

The UK has over 600 SACs ([JNCC overview](https://sac.jncc.gov.uk/)), covering woodlands, heathlands, grasslands, wetlands, and marine habitats such as reefs and sandbanks.

Protection is among the strongest in the planning system: any plan or project likely to significantly affect an SAC must undergo a habitats regulations assessment, and can only proceed if it will not harm the site's integrity, or under strictly limited derogations with compensation. This is the mechanism behind, for example, the "nutrient neutrality" requirements that have affected housebuilding in some catchments ([House of Commons Library briefing](https://commonslibrary.parliament.uk/research-briefings/cbp-9850/)).
<!-- /#landuse-SAC -->

<!-- #landuse-scheduledmonuments -->
#### Scheduled monuments

![Scheduled monuments](/images/manual/landuse-scheduledmonuments.webp)

Scheduled monuments are archaeological and historic sites of national importance protected under the [Ancient Monuments and Archaeological Areas Act 1979](https://www.legislation.gov.uk/ukpga/1979/46). England has nearly 20,000, managed through [Historic England](https://historicengland.org.uk/listing/what-is-designation/scheduled-monuments/); Cadw, Historic Environment Scotland, and the Northern Ireland Environment Agency maintain the equivalent schedules elsewhere in the UK.

Scheduling protects sites where the archaeology itself is the primary interest: prehistoric standing stones and burial mounds, hillforts, Roman remains, medieval castles and monasteries, and industrial sites. Any works affecting a scheduled monument, above or below ground, require scheduled monument consent, and unauthorised works or metal detecting are criminal offences.

Unlike listed buildings, scheduled monuments are often not buildings in use, and scheduling does not create any right of public access; many monuments sit on private land. Management focuses on preventing gradual harm from ploughing, erosion, burrowing animals, and vegetation, alongside conservation, research, and interpretation.
<!-- /#landuse-scheduledmonuments -->

<!-- #landuse-SPA -->
#### Special Protection Areas

![Special Protection Areas](/images/manual/landuse-SPA.webp)

Special Protection Areas (SPAs) protect the habitats of rare, threatened, and migratory birds: breeding colonies, wintering grounds, and the wetlands and coasts that support them. They were designated under the EU Birds Directive, and since EU exit are protected in domestic law by the [Conservation of Habitats and Species Regulations 2017](https://www.legislation.gov.uk/uksi/2017/1012/contents), forming part of the UK's national site network with SACs.

The UK has over 260 SPAs ([JNCC overview](https://jncc.gov.uk/our-work/special-protection-areas/)), concentrated on estuaries, coasts, wetlands, and uplands. Several are internationally significant, supporting large fractions of the world population of species such as gannets and pink-footed geese.

SPAs receive the same strict planning protection as SACs: plans and projects likely to affect them significantly require a habitats regulations assessment and can only proceed if the site's integrity is safeguarded. Around some SPAs this extends to buffer-zone measures, such as the mitigation requirements for new housing near the Thames Basin Heaths.
<!-- /#landuse-SPA -->

<!-- #landuse-SSSI -->
#### Sites of Special Scientific Interest

![Sites of Special Scientific Interest](/images/manual/landuse-SSSI.webp)

Sites of Special Scientific Interest (SSSIs) are the fundamental building block of nature conservation in Great Britain: areas notified for their special flora, fauna, or geological or physiographical features under the [Wildlife and Countryside Act 1981](https://www.legislation.gov.uk/ukpga/1981/69). They are designated by [Natural England](https://www.gov.uk/guidance/protected-areas-sites-of-special-scientific-interest), [NatureScot](https://www.nature.scot/professional-advice/protected-areas-and-species/protected-areas/national-designations/sites-special-scientific-interest-sssis), and [Natural Resources Wales](https://naturalresources.wales/guidance-and-advice/environmental-topics/land-management/protected-areas-of-land-and-seas/find-protected-areas-of-land-and-sea/?lang=en).

SSSIs cover habitats from heathland and ancient woodland to estuaries and upland bog, as well as important geological exposures. Most SACs, SPAs, and NNRs are underpinned by SSSI designation. Owners and occupiers must obtain consent before carrying out listed operations that could damage the special interest, and public bodies have a duty to further the sites' conservation. Planning authorities must take SSSIs into account in decisions.

Designation alone does not guarantee condition: a substantial share of SSSI area in England is currently assessed as unfavourable, which is why SSSI condition is a headline indicator in the government's [Environmental Improvement Plan](https://www.gov.uk/government/publications/environmental-improvement-plan).
<!-- /#landuse-SSSI -->

<!-- #landuse-worldheritagesite -->
#### World Heritage Sites

![World Heritage Sites](/images/manual/landuse-worldheritagesite.webp)

World Heritage Sites are places of outstanding universal value to humanity, inscribed by [UNESCO](https://whc.unesco.org/) under the 1972 World Heritage Convention. They include natural wonders, cultural landmarks, and cultural landscapes; globally there are over 1,100 sites in more than 160 countries.

The UK has [more than 30 sites](https://whc.unesco.org/en/statesparties/gb), including Stonehenge, the City of Bath, Ironbridge Gorge, the Lake District, and Saltaire. Inscription requires demonstrating outstanding universal value against UNESCO's criteria, together with adequate protection and management arrangements.

Inscription does not create a separate consent regime in England, but World Heritage Sites and their settings are protected through the planning system, and the NPPF treats them as assets of the highest significance. Status can be lost: Liverpool's Maritime Mercantile City was delisted in 2021 after UNESCO judged that development had eroded its universal value, one of only a handful of delistings worldwide.
<!-- /#landuse-worldheritagesite -->

<!-- #landuse-food_hygiene -->
#### Food Hygiene Ratings

![Food Hygiene Ratings](/images/manual/landuse-food_hygiene.webp)

A 2023 extract of the [Food Standards Agency food hygiene ratings](https://ratings.food.gov.uk/), which score food businesses from 0 (urgent improvement necessary) to 5 (very good) based on local authority inspections. Click on a dot to see the business name and type.

Beyond its practical use, this layer is a good proxy for where food businesses cluster, which complements the accessibility analysis in the Transport and Accessibility Explorer.
<!-- /#landuse-food_hygiene -->

## Feedback and contributing

Carbon & Place is developed in the open, and we welcome corrections. If something is unclear, wrong, or missing:

* Send us your thoughts through the [feedback form](/about/feedback/).
* Propose changes to this manual directly on [GitHub](https://github.com/PlaceBasedCarbonCalculator/PlaceBasedCarbonCalculator.github.io/blob/dev/manual/index.md).
* For academic use, cite [Morgan (2026)](https://doi.org/10.1177/23998083251401613), and see the [About page](/about/) for licensing and data reuse conditions.
