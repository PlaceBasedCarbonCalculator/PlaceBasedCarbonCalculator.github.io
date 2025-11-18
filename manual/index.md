# Manual

Carbon & Place is a family of tools to help you understand how and why carbon footprints change from place to place and how we can reduce them. Carbon & Place is funded by the [Energy Demand Research Centre](https://www.edrc.ac.uk/) and developed by the [University of Leeds](https://www.leeds.ac.uk/).

This manual is a living document that will be updated over time. You are welcome to contribute the documentation via [GitHub](https://github.com/PlaceBasedCarbonCalculator/PlaceBasedCarbonCalculator.github.io/blob/dev/manual/index.md)

Short extracts of this manual can be accessed throughout the tools via the <i class="fa fa-question-circle" aria-hidden="true" style="color: #0b38e6;"></i> buttons.

## Common User Interface

Most of Carbon & Place's tools are map-based, with map controls for easy navigation and layer controls to customise data visibility. This section describes features that appear in multiple tools. 

### Accessing Carbon & Place

The easiest way to access Carbon & Place is via the website hosted at [www.carbon.place](http://www.carbon.place).

Carbon & Place is also a [Progressive Web App](https://en.wikipedia.org/wiki/Progressive_web_app) that can be installed on many devices, including your smartphone. The app provides the same features as the website. Still, it includes additional benefits such as pinning it to your device’s home screen and full-screen support.

If your device supports installing the app, you will see the Install button on the [homepage](/).

![Install Button](/images/manual/install.webp)

*The install button appears on the homepage when your device supports installing apps.*

You may have to use your operating system's default browser to install the app.

* Android -  Chrome
* iOS - Safari
* Windows 10 & 11 - Microsoft Edge
* macOS - Safari

### Map Controls

![Map controls](/images/manual/map_controls.webp)

*The map can be navigated using map controls on the top left of the screen.*

The Carbon & Place provides different basemaps. The example below shows the basemap selection options with the satellite basemap with 3D terrain enabled. You can hide the basemap selection option by clicking the change basemap button again.

![Basemap controls](/images/manual/basemap_controls.webp)

Basemaps include copyrighted material such as [Ordnance Survey](https://osdatahub.os.uk/downloads/open/OpenZoomstack) data, and third party maps produced by [National Library of Scotland](http://maps.nls.uk/projects/subscription-api/), [OpenStreetMap](https://www.openstreetmap.org/copyright), [Thunderforest](https://www.thunderforest.com/terms/), and [ESRI](https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9) satellite map. Please check the copyright status of the base map before reproducing screenshots from Carbon & Place. The default maps (OS greyscale, Outdoors, and Dark) are Open Data under the Open Government Licence and so are free to reuse.

The Anti-alias option enables advanced rendering options that make the map look smoother and clearer. However, performance on low-end devices may be impaired when using anti-aliasing.

### Layer Controls

![Layer Controls](/images/manual/layer_controls.webp)

The layer controls on the right side of the map control what information is shown on the map.

### Key Concepts

#### Neighbourhood Statistics

The tools often present their results as neighbourhood statistics. We mostly use the Lower Super Output Areas (LSOA) created for the 2021 census or their Scottish equivalents (Data Zones). 

LSOAs are small statistical areas designed to have roughly the same population (1,500 - 3,000 people). As such, they vary in shape and size. In urban areas, they may be as small as a single street, while in rural areas, they can be very large. The Office for National Statistics (ONS) originally created them for the 2001 Census and have been updated for the 2011 and 2021 Censuses. Carbon & Place uses the 2021 boundaries but sometimes reports historical data based on 2001 or 2011 boundaries. In most places, the LSOAs are the same each decade. Where there has been a change, we have to interpolate across borders, which can result in minor errors.

In addition to being used by the ONS to publish Census statistics, LSOAs are widely used by the Government and Academia to publish small-area datasets. This means that information on a wide range of topics is available for LSOAs, and they are a valuable unit of comparison.

While LSOAs are small, they still contain thousands of people. Hence, any data about them is still an average of many people rather than individually specific. There will still be much variation within an LSOA, so consider how different you are from your neighbours. Small area statistics can be useful as neighbours often have much in common. They may live in similar homes, access the same shops and services, and send their children to the same schools. Many of the choices we make are, at least in part, affected by where we live. Thus, studying the differences between people and places can help us understand some of our time's most significant and most complex issues.

<!-- #dasymetric -->
#### Dasymetric Mapping

![Dasymetric](/images/manual/dasymetric.webp)

*Dasymetric (left) and Choropleth (right) mapping techniques*

By default, the neighbourhood statistics are shown as a [dasymetric](https://en.wikipedia.org/wiki/Dasymetric_map) map. This means that the buildings within a zone are coloured to display information. If you turn off dasymetric mode, a simple [choropleth](https://en.wikipedia.org/wiki/Choropleth_map) map is shown where the whole neighbourhood is coloured. Note that the same underlying data is visualised in both modes, and the differences between modes are aesthetic. However, dasymetric maps are intended to better represent the data by emphasising the true locations of people who are not uniformly distributed across the area. 
<!-- /#dasymetric -->

#### Digital Terrain Map and 3D buildings

Maps are traditionally flat, but our lives are not 2D. Terrain affects the weather, what and where we build, travel choices, and our sense of place. Interactive maps need not be limited to two dimensions, so the Carbon & Place map supports some 3D features. These include:

* Hill shading: A pattern of light and dark areas is used on the map to indicate hills and valleys
* 3D terrain: The map can be switched between a 2D (default) and 3D mode using the map controls. 
* 3D buildings: when zoomed in, building outlines have realistic heights.

![Hill shading](/images/manual/hillshade.webp)

*An example of hill shading used to show terrain. In this area, some of the terrain appears pixilated as missing data in the high resolution 2m data has been in-filled with lower quality 50m resolution data.*

The underlying data that enables 3D features in Carbon & Place is a high-resolution [Digital Terrain Model](https://en.wikipedia.org/wiki/Digital_elevation_model) (DTM) and Digital Surface Model (DSM) of Great Britain. A DTM is basically a big picture where every pixel contains the elevation of the ground. The difference between a DTM and a DSM is that DTMs measure ground level while the DSM includes things on top of the ground, such as buildings and trees.
 
The DTM and DSM are created from [LIDAR](https://en.wikipedia.org/wiki/Lidar) data published by the [Environment Agency](https://www.data.gov.uk/dataset/f0db0249-f17b-4036-9e65-309148c97ce4/national-lidar-programme), [Welsh](https://datamap.gov.wales/maps/lidar-viewer/), and [Scottish](https://remotesensingdata.gov.scot/data#/list) Governments. Individual datasets from between 2010 and the present have been stitched together into a single map with about a 2m x 2m pixel resolution. Unfortunately, the coverage of the new DTM is not universal. In England, coverage is over 95%. However, in Wales, it is about 70%. In Scotland, only about 40% (mostly in southern and central Scotland), so we had to infill with [50m data](https://www.ordnancesurvey.co.uk/products/os-terrain-50) in places. Fortunately, the coverage is concentrated in the most populated places, so a higher proportion of people are covered even if the beauty of the Scottish and Welsh mountains is slightly lost.

Building heights are calculated by comparing the difference between the DTM and the DSM. Each building footprint is given a single height based on the maximum difference between the two datasets. This simple approach does not account for buildings with sloping roofs or multiple levels. However, the purpose of the 3D buildings in Carbon & Place is to visually distinguish different building types (e.g., houses, and blocks of flats) that may not be clear on a 2D map. For this purpose, the approximate height of the buildings is sufficient. 

![3D buildings](/images/manual/3dbuildings.webp)

*An example of 3D buildings in Leeds*

### Common Map Layers

Some map layers are available in all tools.

#### Administrative Boundaries

Several types of administrative boundaries can be added to the map. These help with navigating and understanding when responsibilities transfer between organisations. 

<!-- #boundaries-la -->
##### Lower Tier Local Authority 2024

![Lower Tier Local Authority](/images/manual/la.webp)

A local authority district (abbreviated as LAD) is a subnational division for local government purposes. These districts provide local services such as rubbish collection, housing, and planning applications. There are two main types of local authority districts in England:

District, Borough, or City Councils: These councils cover smaller areas than county councils and offer more localised services. They handle tasks like rubbish collection, recycling, and Council Tax collection.

Unitary Authorities: In some areas, a single tier of local government provides all the services mentioned above. Additionally, there are parish, community, and town councils that operate at a level below district and borough councils, addressing local issues like allotments, public clocks, and community centres.

[Original Data Source](https://geoportal.statistics.gov.uk/search?q=BDY_LAD%202024&sort=Title%7Ctitle%7Casc)
<!-- /#boundaries-la -->
<!-- #boundaries-wards -->
##### Wards 2024

![Ward](/images/manual/ward.webp)

Wards in the United Kingdom are electoral districts at the sub-national level, represented by one or more councillors.

[Original Data Source](https://geoportal.statistics.gov.uk/search?q=BDY_WD%202024&sort=Title%7Ctitle%7Casc)
<!-- /#boundaries-wards -->
<!-- #boundaries-parish -->
##### Parish 2023

![Parish](/images/manual/parish.webp)

In the United Kingdom, parishes serve as important administrative and territorial units. They are the lowest tier of local government in England, below districts and counties. Some districts are entirely unparished, and other districts are entirely parished, handling various local responsibilities.

[Original Data Source](https://geoportal.statistics.gov.uk/search?q=BDY_PAR%202023&sort=Title%7Ctitle%7Casc)

<!-- /#boundaries-parish -->
<!-- #boundaries-westminster -->
##### Westminster Constituencies 2024

![Constituencies](/images/manual/constituency.webp)

A constituency is the specific geographical area each MP represents in the House of Commons.

People who live in an MP's constituency are known as their constituents.

[Original Data Source](https://geoportal.statistics.gov.uk/search?q=BDY_PCON&sort=Date%20Created%7Ccreated%7Cdesc)
<!-- /#boundaries-westminster -->

## Transport and Accessibility Explorer

The Transport and Accessibility Explorer allows a deep dive into the issues related to transport and access to services.

### Map Layers
<!-- #transport-zones -->
#### Neighbourhoods

The Neighbourhoods layer uses the Lower Super Output Areas (LSOA) to report a range of transport statistics.

**Change in buses/hour (2008 - 2023)**

This layer shows the change in bus frequency (trips per hour daytime average) of bus services stopping in or near each neighbourhood between 2008 and 2023. 

**Bus/Tram/Subway/Rail/Ferry per hour (daytime average)**

These layers show the frequency of service (trips per hour) for each type of transport stopping in or near each neighbourhood in 2023. Note that not all types of transport are available in every neighbourhood. Places with no timetabled services are shown in black.

Clicking on any neighbourhood brings up the report card that provides more information.

<!-- /#transport-zones -->

### Report Card

Clicking on any neighbourhood in the map opens the report card.

#### Accessibility & Proximity 

Accessibility and proximity are two core concepts of sustainable transport planning. Proximity is a simple measure of how far away people are from the things they need. Accessibility is a more complex concept that accounts for real-world travel times, costs, and other factors that affect people's ability to get where they need to be. 

Accessibility can be improved by improving proximity (bringing people closer to the things they need) or mobility (enabling people to move further and faster),  but enhancing proximity is usually considered more sustainable and desirable. This is because people can walk, cycle, or take public transport when shops and services are nearby. All of these options are cheaper and less resource-intensive. But when services are far away, people are more likely to use cars, which are expensive to own and run and [very costly for society as a whole](https://doi.org/10.1016/j.jtrangeo.2024.103817). Cars and their infrastructure also occupy a lot of space, further spreading out towns and cities, reducing proximity and increasing car dependency.

The Accessibility-Proximity analysis attempts to capture whether a neighbourhood has enough of the shops and services that people need within a reasonable distance.


##### Method

The creation of these plots is straightforward.  

First, the [Ordnance Survey Points of Interest](https://www.ordnancesurvey.co.uk/products/points-of-interest) (POI) have been selected as a list of destinations people may wish to access. The POI data includes a broader set of destinations than is usually considered in accessibility metrics. In total, 2,477,906 locations are divided into 385 different categories. Second, the 34,753 2011 Lower Super Output Area population-weighted centroids are used as origins to measure accessibility. Third, public transport isochrones and circular buffers are produced around each centroid. In this case, the 15, 30, 45, and 60-minute isochrones are paired with 0.75, 1.5, 2.25, and 3-mile buffers implying a 3-mph walking speed. Fourth, the number of each type of POI is counted for each time and distance band. This is divided by the resident population within the measured area to provide a per capita measure. For example, in Great Britain, there are 6.46 restaurants for 10,000 people. Finally, the results are presented as a scatter plot with the proximity (distance) count on the x-axis and accessibility (time) count on the y-axis. For both axes, the scale is normalised to show the number of standard deviations from the national average, so the average location would appear in the centre of the graph.

##### Accessibility & Proximity Summary Table

The table lists 385 types of destinations listed in the [Ordnance Survey Points of Interest](https://www.ordnancesurvey.co.uk/products/points-of-interest). For each destination, eight scores are shown. The four accessibility scores are based on the number of destinations that can be reached by public transport in 15, 30, 45, and 60 minutes. At the same time, the four proximity scores are based on the number of destinations that are within 0.75, 1.5, 2.25, and 3 miles. Each score is on a scale from -3 to +3, which describes how many [standard deviations](https://en.wikipedia.org/wiki/Standard_deviation) the neighbourhood is from the national average. 89% of neighbourhoods are within three standard deviations of the average, while values greater than +3 or less than -3 are truncated to that range. 

Scores greater than 0 (better than the national average) are highlighted in green, and scores less than 0 (worse than the national average) are shown in red.

##### Accessibility & Proximity Summary Chart

The interactive chart shows the same information in the table more visually. The 30-minute / 1.5-mile data is plotted on the graph, with the 1.5-mile proximity score on the x-axis and the 30-minute accessibility score on the y-axis. Click on any dot to see the name of the destination. 


#### Public Transport Frequency

The public transport frequency analysis attempts to capture the frequency (trips per hour) of public transport, which varies across the country over time. Frequency is an essential concept in public transport as high-frequency services have several benefits:

1. **Reduced waiting times**. If there is a bus every 5 minutes you don't have to wait long if you miss one.
2. **Reduced connection times**. If your journey involves multiple steps, a frequency service means you won't be waiting long to make a connection. It also reduces the impact of missing a connection, as the next option will be along soon.
3. **Turn up and go service**. When public transport is frequent, people don't need to plan their journeys or consult the timetable. They can arrive at a stop and be confident that the next service will be along soon.
4. **Reduced impact of delays**. If the service is frequent it can mitigate the effect of disruptions. E.g. It is frustrating if there is one bus per hour and it is 10 minutes late. But if there was one bus every 10 minutes and they are all 10 minutes late would you even notice?

Frequency often varies throughout the day. It is common for there to be more services during rush hour and fewer in the evening and at weekends. While this makes sense, the service can become inconvenient if frequency in off-peak times drops too low. In many places across the UK, public transport only serves 9-5 commuters and is poor in the evenings and weekends, which makes public transport unusable for shift workers, leisure trips, etc. This can create a vicious cycle where a low frequency of service leads to low ridership, so the frequency is further reduced to save money.

##### Data Collection

To analyse how public transport varies, it was necessary to gather historical timetables. There is no single official repository of timetable data in the UK. So, it was necessary to assemble a patchwork of different datasets. Three sources were identified. Firstly, the [National Public Transport Data Repository](https://www.data.gov.uk/dataset/d1f9e79f-d9db-44d0-b7b1-41c216fe5df6/national-public-transport-data-repository-nptdr) (NPTDR) gathered an annual snapshot of timetables in October for each year between 2004 and 2011. Secondly, the [Bus Archive](https://www.busarchive.org.uk/) provided October bus timetables outside London from 2014 to 2017. Thirdly, [Dr Malcolm Morgan](https://environment.leeds.ac.uk/transport/staff/964/dr-malcolm-morgan) maintains an archive of the [Traveline National Dataset](https://www.data.gov.uk/dataset/0447f8d9-8f1b-4a68-bbc8-246981d02256/traveline-national-dataset) (TNDS) and the [Association of Train Operating Companies](https://data.atoc.org/) (ATOC) (now called the Rail Delivery Group) national rail timetable from 2018 to the present. While this collection of timetables is patchy in some places and times, notably missing data for 2012/13 and missing data for many years in London. To our knowledge, it represents the largest collection of digital and analysable timetables in the UK, covering most of the last twenty years.


Each of these data sources provided the timetables in different formats. So, they were converted into a standardised format using the [UK2GTFS](https://itsleeds.github.io/UK2GTFS/) package. 


Due to the retrospective nature of the data collection, it is difficult to say with certainty what proportion of the timetables have been gathered in any given year or place. For most of these datasets, contributing was voluntary, and in specific locations, it is clear that data is missing. However, it seems unlikely that transport companies would volunteer a partial timetable, so we have proceeded on the basis that if a timetable is provided, it is complete. In most cases, the timetables are provided on a one-file-per-route basis. Thus, missing data is often detectable by rapid changes in services from year to year. For example, a bus service that ran every half-hour in 2006, was missing in 2007/8, and returned in 2009 is more likely to reflect missing data rather than an abrupt change in service patterns.

Each of these data sources provided the timetables in different formats. So they were converted into a standardised format using the [UK2GTFS](https://itsleeds.github.io/UK2GTFS/) package. For each year a one month snapshot of the timetable was produced. This month is usually October but in some year other months had to be used due to a lack of data.

To produce the statistics shown in the tool, we counted the number of trips accessible from each LSOA or its immediate vicinity. Some small LSOAs do not have any public transport within them but may have stops just outside. We used a combination of the LSOA boundaries and a 500m circle around the population-weighted centroid of the LSOA. This was then further buffered out by another 100m. Thus, we are measuring the frequency of public transport within a short walk of each LSOA. 

![Frequency Analysis Areas](/images/manual/transport_lsoa_buffer.webp)

*Example of the area used to count public transport trips*

##### Missing Data / Data Quality

The national timetables have been assembled from a patchwork of different datasets, and there are some known gaps. Data from 2004 to 2007 is patchy in many places, and there is no data at all for 2012 and 2013. Rail data from 2014 to 2017 is also missing. The table below shows an overview of the bus data quality.

![Timetable missing data](/images/manual/transport_bus_data.webp)

*Summary of bus timetable data availability. Green - good data coverage, Amber - possibly data missing. Red - data is definitely missing. Grey - no data for the years 2012 and 2013. Blue - timetables severely reduced by COVID-19 pandemic lockdowns may not be representative*

The raw data (especially in the earlier years) contains errors such as missing stops and vehicles travelling impossibly fast. The UK2GTFS package automatically corrected many of these errors. Still, it is impossible to say with complete certainty that all errors have been removed.

##### Interpretation

At this very local scale, timetable data is complex and messy. A sudden drop in service could be due to missing data or reflect a short-term effect, e.g., a bus being redirected during road works. So, the results for any specific place and time should be treated with care. This data is useful when it shows consistent trends over time and across multiple areas. 

One of the strongest patterns to emerge from the data is that in most of the country, the weekday rush hour bus service is worse than the service in the London suburbs on a Sunday night. Since 2008, bus services have declined significantly across the UK except in London, where they have remained roughly the same.


##### Acknowledgement

We are grateful to Friends of the Earth UK, who funded part of this work. They have published their own [tools and analysis](https://policy.friendsoftheearth.uk/insight/how-britains-bus-services-have-drastically-declined).

## Land Ownership Explorer

### Introduction
It is hard to discuss issues around place without eventually coming to the topic of land ownership. Landowners, through a combination of action and inaction, sculpted the country into what it is today. Ultimately, they decide where the homes and jobs are, what is farmland, and what is left for nature. Despite their enormous power, land ownership is not democratically allocated. A small elite owns a large proportion of the land in the UK, and data about who owns what is often hard to come by.

The Land Ownership Explorer is intended to cast a little light on the issue of land ownership by providing a more accessible form of official Land Registry datasets.

### Map Layers

<!-- #landownership-inspire -->
#### INSPIRE Polygons

The INSPIRE polygons area created by the Land Registry for England and Wales shows all the freehold land in England and Wales. They are published as Open Data with a few conditions. Unfortunately, the Land Registry does not provide an easy service to view the INSPIRE data.

This layer shows a cleaned 2022 snapshot of the INSPRIRE Polygons. Land registry maps are often digitised versions of old paper maps. Therefore, the titles are often split into grids, where a property crosses the boundary of one paper map and another. An automated method was used to rejoin split polygons to give a more straightforward overview of large landowners. The process is not perfect, and some square titles remain. Also, some polygons have been merged, and some INSPIRE IDs are missing. For merged polygons, they have been given one of the INSPIRE IDs from the unmerged polygons, but which one they get is essentially random.

![Grid Detection](/images/manual/grid_detection.webp)
*An example of the cleaning process: Polygon boarders aligned with the grid have been detected and highlighted in red.
While this is not perfect, the INSPIRE Polygon data is very messy. It helps clean up the data and clarifies where large titles are.*

Due to the large dataset size, it is impossible to show every land title in the country simultaneously. Thus, when zoomed out, only the large polygons are shown.

![INSPIRE zoomed out](/images/manual/inspire_out.webp)
*When zoomed out, only the largest polygons are shown*

![INSPIRE zoomed in](/images/manual/inspire_in.webp)
*Zoom in a little, and you can see all the polygons*

Not all land is registered, so there are gaps on the map. Registration became compulsory in 1990 and is only required when land is sold, so around 14% of land in England and Wales is still unregistered.

Some polygons overlap, which can happen when more than one owner exists. For example, the London Underground may own the tunnel, but another person owns the land on the surface. Solar power companies sometimes purchase air rights above the ground to prevent buildings from casting shadows on rooftop panels.

You can also click on the polygons to see the INSPIRE ID, which you can use to purchase the full title, the Local Authority name, and the area in square metres.
<!-- /#landownership-inspire -->

<!-- #landownership-points -->
#### Property owned by UK and overseas companies

The Land Registry publishes two open datasets that explicitly name the land owners: the [UK companies that own property in England and Wales](https://use-land-property-data.service.gov.uk/datasets/ccod) and the [Overseas companies that own property in England and Wales](https://use-land-property-data.service.gov.uk/datasets/ocod). 

*The data in this tool is based on a 2022 snapshot of the published data and may be outdated.*

These datasets provide much information about land ownership, but the format could be clearer mainly because it is not provided on a map. The main purpose of the Land Ownership Explorer is to map these two datasets by geocoding the addresses. [Geocoding](https://en.wikipedia.org/wiki/Address_geocoding) turns text addresses into latitude/longitude coordinates that can be plotted on a map. 

Some of the land registry titles are very simple, e.g.

*5 West Park, Bristol (BS8 2LX)*

This can easily be geocoded and plotted on a map. While we can't find the exact boundaries of the property, we can at least put a point on the map at the address.

But consider another example:

*1-4 Crown Row, Bracknell (RG12 0TH), 3, 14, 17, 18, 21, 26, 29, 31, 45, 49, 50, 55-70, 74, 75, 77-81, 84, 85, 91-95, 101, 103, 104, 106, 110, 111 Dalcross, Bracknell (RG12 0UJ), 71-73, 76, 82, 83, 86, 87 Dalcross, Bracknell (RG12 0UL), 1, 6, 9, 11 Fencote, Bracknell (RG12 0TD), 6, 8, 9, 12, 19, 22, 25, 47, 50 Garswood, Bracknell (RG12 0TY), 52, 60, 61, 65, 67, 80 Garswood, Bracknell (RG12 0TZ), 2, 10, 14, 16, 18, 36, 40, 42-44, 58-60, 72, 76, 79, 80 Helmsdale, Bracknell (RG12 0TA), 12, 13, 15, 45, 64-67, 82, 86, 87, 96, 97-99, 108, 112-115, 118, 126, 129, 138 Helmsdale, Bracknell (RG12 0TB), 1, 6, 11, 15, 23, 24, 28, 32, 33, 42-51, 67, 68, 72, 79, 80 Keepers Coombe, Bracknell (RG12 0TW, 10, 12-14, 21, 22, 25-27, 29-31, 34-36, 41 Keepers Coombe, Bracknell (RG12 0TN), 1-9, 21, 22, 26, 27, 31, 32 Kimmeridge, Bracknell (RG12 0UD), 86, 89-93(odd), 94, 100, 102, 107, 122, 125 Leaves Green, Bracknell, (RG12 0TE), 1-6, 8-10, 13-26, 33, 34, 48-50, 54, 58, 59, 63-80 Leaves Green, Bracknell (RG1*


In this case, a single dot on the map does not clearly convey the extent of this land ownership. However, it is possible to parse this into 233 unique addresses that the text refers to. The title may have even more addresses as it has been cut off mid-postcode at 999 characters, which suggests it has been truncated. Nevertheless, identifying the knowable 233 addresses helps improve our understanding of land ownership, even if it is incomplete.

While this kind of text parsing is never 100% successful, it is worth doing. For example, 9,034 freehold titles contain multiple postcodes. When they are broken up, they actually refer to 168,911 unique property addresses. 

Some titles are easier to work with than others. There were 1.77 million simple addresses are easy to pass through a geocoder. More complex titles came in the form of `address and associated land` in these cases removing the "and associated land" yields a simple geocodable address.

In the most complex cases, there are many locations that are `land in front/behind address`. While we can't geocode the exact location easily, we can at least extract the address and geocode that. In the worst cases, we get something in the form of `land north of somewhere road`. Again, we can't geocode this exactly, but we should at least be able to find the relevant road. Around 1% of titles have been discarded because they are too complex to geocode. 

This is an imperfect process; the data is unstructured and complex, so there will be errors and missing data. The points may not be in the correct locations. For example, "the field behind 4 to 6 Privet Drive" is not the same as "4 Privet Drive, 5 Privet Drive, and 6 Privet Drive", but we can't geocode "the field behind" so the code will detect three addresses and create three points one for each house. Therefore, it is best to think of the points as in the vicinity of the correct address rather than an exact location.

Other problems occur when the information the Land Registry provides is vague. For example, "3 Church Lane, London", there are many Church lanes in London, so it is hard to locate the correct address. The Land Registry also provides the Local Authority name so that it can be narrowed down a bit, but in some cases, the same title will appear in multiple places on the map due to the ambiguous nature of the address.

##### Layer Options

The land ownership points can be coloured on four variables:

1. Organisation Type: The type of organisation, not that the dataset does not contain privately owned property
2. Geocoding Accuracy: The precision of the point on the map. The most common option is Address (Green), which means the full address has been located. However, in some cases, only the road, postcode, or region could be identified. These points will be further from their correct location.
3. Country of Registration: Where is the property owner based?
4. Tenure: Is the property title for the freehold or leasehold?

##### Popup

![Land owners popup](/images/manual/landowners_popup.webp)
*Click on any point to see more information*

* Title: The title number held by the Land Registry
* Tenure: Freehold or	Leasehold
* Property Address: As recorded by the Land Registry (maybe multiple addresses)
* Company No: Company Number resisted with Companies House
* Country: Country of Registration
* Category: Type of organisation
* Geocoded address:	The address of the geocoded point should match the address with the Land Registry but may differ if an error has occurred and the address has been misinterpreted. 
* Geocode type: The type of location that has been geocoded, e.g. Address, Road, Postcode, Region
* Proprietor: The owner's name as resisted with the Land Registry

<!-- /#landownership-points -->



## Retrofit Explorer

The retrofit explorer tool focuses on buildings and their energy consumption from heating and electricity. It provides access to detailed information on buildings and energy and how that leads to carbon emissions.

### Map Layers

<!-- #retrofit-zones -->
#### Neighbourhoods

![Retrofit Neighboughoods](/images/manual/retrofit-zones.webp)

The Neighbourhoods layer summarises data from the domestic Energy Performance Certificates (EPCs) registered in England, Wales, and Scotland. Note that you should use the Domestic EPC layer for data about individual buildings.

Clicking on any neighbourhood will display the report card for that neighbourhood with more details.

The drop-down menu enables you to change the visualised characteristics.

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
* % of homes with an EPC

Note that this data summarises the homes with an EPC rather than every home in the neighbourhood and that EPCs can be outdated. The percentage of homes with an EPC layer helps to identify neighbourhoods where EPC data may be unrepresentative.  

##### Data Sources

[England and Wales](https://epc.opendatacommunities.org/)

[Scotland](https://www.scottishepcregister.org.uk/)


<!-- /#retrofit-zones -->

<!-- #retrofit-postcodes -->
#### Postcode Gas & Electric

![Retrofit Postcodes](/images/manual/retrofit-postcodes.webp)

This layer provides a map of the postcode gas and electricity consumption data published by the Department of Energy Security and Net Zero.

It provides the most geographically detailed picture of domestic gas and electricity consumption.

The drop-down menu enables you to change the visualised characteristics.

* Combined Emissions: Electricity emissions + Gas (when available)
* Gas Emissions
* Electricity Emissions

Emissions are graded from A+ (lowest per household emissions) to F- (highest per household emissions.)

*Note* that homes are not on the gas grid in many rural areas and use other fuels (e.g. oil) for heating. This can give a confusing picture of emissions in the combined emissions view, as some areas have their heating emissions missing.

Clicking on any postcode will display the report card for that postcode with more details.

*Note* Postcode boundaries are copyright of Royal Mail so we cannot provide data download of the postcode data. 

The map has gaps where no data is available. This can be because all the buildings within the postcode are non-domestic or because there are only a few domestic properties within the postcode, and so data has been suppressed to protect privacy.

##### Data Sources

[Postcode gas and electricity consumption](https://www.gov.uk/government/publications/postcode-level-domestic-gas-and-electricity-consumption-about-the-data)

[Postcode boundaries](https://digimap.edina.ac.uk/) (Academic use only)

<!-- /#retrofit-postcodes -->

<!-- #retrofit-epc-dom -->
#### Domestic EPC

The Domestic EPC layer shows homes with domestic Energy Performance Certificates. The map is based on a national extract from June 2024. Only the most recent one is shown when a building has more than one EPC.

The drop-down menu enables you to change the visualised characteristics.

* Rating: Energy efficiency rating (A best, G worst)
* Building Type
* Property Type 
* Building Age: Estimated time of construction
* Last Assessed: The year the most recent EPC was issued
* Floor Area: Total floor area m2
* Floor Rating: Energy efficiency rating (Very Good to Very Poor)
* Hot Water Rating: Energy efficiency rating (Very Good to Very Poor)
* Windows Rating: Energy efficiency rating (Very Good to Very Poor)
* Walls Rating: Energy efficiency rating (Very Good to Very Poor)
* Roof Rating: Energy efficiency rating (Very Good to Very Poor)
* Heating Rating: Energy efficiency rating (Very Good to Very Poor)
* Controls Rating: Energy efficiency rating (Very Good to Very Poor)
* Lighting Rating: Energy efficiency rating (Very Good to Very Poor)
* Solar Thermal: Has solar thermal heating (Yes/No)

Clicking on any EPC will display a popup with more details.

Please note that the Scotland EPC register is separate and slightly different to the England and Wales register. In Carbon & Place we have harmonised the datasets and this can results in slight inconstancies with the Scottish data. For example Scotland uses slightly different age bands, and these have been mapped to the closest equivalent used in England and Wales.

##### Data Sources

[England and Wales](https://epc.opendatacommunities.org/)

[Scotland](https://www.scottishepcregister.org.uk/)



<!-- /#retrofit-epc-dom -->

<!-- #retrofit-epc-nondom -->
#### Non-domestic EPC

The Non-domestic EPC layer shows buildings with non-domestic Energy Performance Certificates. The map is based on a national extract from June 2024. Only the most recent one is shown when a building has more than one EPC.

The drop-down menu enables you to change the visualised characteristics.

* Rating: Energy efficiency rating (A best, G worst)
* Transaction: The type of transaction that caused an EPC to be issued
* Floor Area: Total floor area (m2)
* Last Assessed: Year that the EPC was issued

Clicking on any EPC will display a popup with more details.

Please note that the Scotland EPC register is separate and slightly different to the England and Wales register. In Carbon & Place we have harmonised the datasets and this can results in slight inconstancies with the Scottish data. For example Scotland uses slightly different age bands, and these have been mapped to the closest equivalent used in England and Wales.

##### Data Sources

[England and Wales](https://epc.opendatacommunities.org/)

[Scotland](https://www.scottishepcregister.org.uk/)



<!-- /#retrofit-epc-nondom -->


### Report Card

#### Neighbourhoods

The neighbourhood report card summarises the domestic EPCs in each neighbourhood.  


#### Postcodes

The report card provides historical data (2015 - 2022) about domestic gas and electricity consumption.

For each postcode, data is provided as follows:

* Mean: Average values (i.e. total divided by number of homes)
* Median: Middle values (i.e. half of homes are above and half of homes are below)
* Total: All homes added together

Electricity consumption is further divided by meter type (all, standard, economy 7). Economy 7 meters are an old type of meter that could charge two different rates based on time of day. These are less common now and are being replaced by smart meters (included in the standard category).

To protect privacy, DESNZ removes data for postcodes that only cover a small number of properties or may remove a particular type of meter if it is uncommon (e.g., Economy 7). This can result in gaps in the data.

Postcodes, unlike the LSOAs used in the rest of Carbon & Place, are not designed for data reporting and change fairly often to meet mail delivery needs. This can be a challenge for presenting historical data. So, in Carbon & Place, we only show data for the current postcode areas; this means historical data is missing in some locations.


## Place-Based Carbon Calculator

### Map Layers

<!-- #pbcc-zones -->
#### Neighbourhoods

![PBCC Neighbouhoods](/images/manual/pbcc-zones.webp)


The Neighbourhoods layer shows neighbourhood-level carbon footprints and related indicators for each Lower Super Output Area (LSOA) or equivalent Data Zone. Values are presented per person (kgCO2e) and are intended to help compare places and identify opportunities for local decarbonisation.

What the layer shows

- **Total Emissions**: Overall per-person footprint for the neighbourhood. Graded from A+ (low) to F- (high) relative to the national distribution.
- **Decarbonisation progress**: A measure of how much progress the neighbourhood has made toward recent decarbonisation trends (relative change and progress bands).
- **Housing: Gas & Electricity**: Domestic heating and electricity emissions per person, derived from energy consumption and EPC-based models.
- **Transport: Car & Van**: Tailpipe and lifecycle transport emissions attributed to the neighbourhood.
- **Consumption: Goods & Services**: Embodied emissions from household consumption (modelled using synthetic households and spending profiles).
- **Flights**: Air travel emissions allocated to neighbourhoods using the synthetic population model.
- **Area classification**: The ONS area classification code for contextual comparison with similar neighbourhoods.

Controls and behaviour

- Use the drop-down menu to change which variable is visualised. The map colours and legend update to reflect the selected field.
- The **Show layer** checkbox toggles neighbourhood visibility.
- The **Dasymetric** toggle switches between dasymetric (building-level shading) and choropleth (whole-zone) rendering. Dasymetric mode paints built-up areas within an LSOA to better represent where people live; choropleth colours the entire LSOA area.
- Clicking a neighbourhood opens the report card with a detailed breakdown (Overview, Historical, Housing, Transport, Consumption, Demographics, Future Scenarios). The report card contains charts, grades, and data tables.

Interpreting grades and colours

- Grades are relative to the national distribution and are intended as an easy visual cue — A+ to C- indicates better-than-average performance, D+ to F- indicates worse-than-average performance. Some areas may show `NA` when data is missing or suppressed.
- Legends and contextual notes appear beneath the layer controls to explain colour bands and any data caveats.

<!-- /#pbcc-zones -->

### Report Card

#### Overview

The report card summarises what we know about a neighbourhood's carbon footprint and related context. It brings together multiple data sources and modelled estimates into a compact, interactive view so you can quickly see where emissions come from, how they have changed, and which local characteristics help explain them.

Key elements you will see in the Overview:

- **Headline grade and score**: A per-person grade (A+ to F-) and numeric value that places the neighbourhood relative to the national distribution.
- **Sector breakdown**: A small chart showing the share of emissions from Housing, Transport, Consumption, and Flights.
- **Contextual indicators**: Population, area classification (ONS), and a short summary of important drivers such as car ownership, average dwelling age, and income proxies.

Use the Overview to get a quick sense of whether a neighbourhood is above or below the national average, and what the main drivers appear to be. Click any portion of the sector chart or the tabs at the top to open the more detailed panels (Historical, Housing, Transport, Consumption, Demographics, Future Scenarios).

Note on interpretation: Grades are comparative, not absolute. Two places with the same grade may have very different absolute emission levels if the national distribution changes. Where data are missing or suppressed for privacy, you will see `NA` and explanatory notes.

**Sources:**

- Project overview and methodology: `README.md` (site documentation)
- ONS area classifications and population statistics: https://www.ons.gov.uk/
#### Historical Emissions

This panel shows how the neighbourhood's footprint has changed over time and how that change compares to regional and national trends. The main visual is a time-series chart (usually annual) of per‑person emissions with shaded bands showing sector contributions.

What to look for:

- **Trend shape**: Steady declines may indicate effective decarbonisation of heat, electricity, or transport; plateaus or increases highlight potential problem areas.
- **Sector timing**: Different sectors decarbonise at different rates. For example, electricity emissions fall quickly as the grid decarbonises, while housing (heating) declines more slowly unless retrofit rates are high.
- **Comparators**: Use the regional and national comparator lines to see whether local change follows or diverges from broader trends.

Method and caveats:

- Historical estimates combine measured consumption where available (e.g. energy statistics) with modelled allocations (e.g. consumption and transport models). Year-to-year changes may reflect actual policy or service shifts, but can also be affected by data revisions or coverage changes. We annotate known data gaps and periods with unusual events (for example, COVID-19 disruption) so you can judge the signal strength.

**Sources:**

- National and regional emissions statistics: https://www.gov.uk/government/collections/uk-local-authority-and-regional-carbon-dioxide-emissions-national-statistics
- National greenhouse gas statistics and inventories: https://www.gov.uk/government/collections/uk-greenhouse-gas-emissions-statistics
- Notes on transport timetable datasets used for trend annotation: NPTDR (National Public Transport Data Repository), Bus Archive, Traveline archives (see Transport panel sources)
#### Housing Emissions

This panel explains emissions from domestic energy use: the heating and electricity associated with homes in the neighbourhood. It presents totals and per-person metrics plus a breakdown by fuel type, dwelling type and building efficiency where data allow.

Main components shown:

- **Total housing emissions (kgCO2e per person)** and **per-household** equivalents.
- **Fuel split**: Gas vs electricity (and other heating fuels where present). Electricity emissions reflect grid intensity in each year.
- **Building attributes**: Average EPC band, typical dwelling age, floor area and common heating systems; these are used to explain variation between places.

How the numbers are derived:

- We combine postcode-level consumption (where available), EPC-derived energy models, and building stock characteristics to produce neighbourhood-level estimates. Domestic gas and electricity datasets, EPC registers, and modelled heat loss estimates are used together to estimate both current emissions and potential savings from retrofit.

Interpretation and limitations:

- EPC coverage is incomplete and biased (not all homes have an EPC). Where EPC coverage is low we flag the neighbourhood and caution against over-interpreting fine-grained results.
- Emissions attributed here are operational (energy used in the home). They do not include embodied emissions from building materials — those are considered elsewhere where modelled.

**Sources:**

- England & Wales EPC register: https://epc.opendatacommunities.org/
- Scottish EPC register: https://www.scottishepcregister.org.uk/
- Postcode-level gas & electricity consumption (DESNZ): https://www.gov.uk/government/publications/postcode-level-domestic-gas-and-electricity-consumption-about-the-data
- EPC methodology and building stock modelling references: project documentation and EPC registers
#### Transport Emissions

The Transport panel covers emissions from local travel attributable to residents: cars, vans, buses, trains, motorcycles and an allocation of longer-distance travel (including flights). The visualisation typically includes a modal split, tailpipe vs lifecycle components, and per-person totals.

What you will see:

- **Per-person transport emissions** and **per-household** equivalents.
- **Modal breakdown**: Cars & vans, public transport, active modes (walking/cycling as activity proxies), and an allocated share of flights and freight-related passenger consumption where relevant.
- **Drivers**: Local car ownership, typical commute distances, and public transport frequency indicators help explain differences between places.

Method notes and caveats:

- Car and van emissions are estimated from local vehicle ownership, census travel-to-work patterns, and modelled average trip distances. Public transport emissions use timetable-based frequency data combined with access buffers around neighbourhood centroids (see Transport Explorer documentation).
- Long-distance trips and flights are allocated using the synthetic population model; this gives reasonable neighbourhood-level estimates but cannot capture idiosyncratic travellers. Seasonal effects and one-off changes (e.g., lockdowns) are annotated in the historical panel.

Use this panel to identify opportunities (e.g., where modal shift or car replacement could deliver large savings) but treat localised absolute values as modelled estimates rather than exact measured totals.

**Sources:**

- National Public Transport Data Repository (NPTDR): https://www.data.gov.uk/dataset/d1f9e79f-d9db-44d0-b7b1-41c216fe5df6/national-public-transport-data-repository-nptdr
- Bus Archive: https://www.busarchive.org.uk/
- Traveline National Dataset: https://itsleeds.github.io/UK2GTFS/ (UK2GTFS conversion docs) and Traveline dataset archives: https://www.data.gov.uk/dataset/0447f8d9-8f1b-4a68-bbc8-246981d02256/traveline-national-dataset
- Rail timetable / ATOC archives: https://data.atoc.org/
- Methods for allocating long-distance travel (synthetic population / LCFS): Living Costs and Food Survey (LCFS): https://www.gov.uk/government/collections/living-costs-and-food-survey
<!-- #pbcc-consumption -->
#### Consumption Emissions
While some household carbon emissions are produced in the home (e.g. when we burn gas for heating or cooking) much of the household carbon footprint comes from embodied emissions, the emissions that came from making the goods and services we use, for example, when we buy a product there are emissions associated with mining the resources, processing, manufacturing and transporting the product to us. Much of these emissions may have been produced abroad, but in a consumption-based carbon footprint (like the PBCC), we attribute responsibility for those emissions to the end user of the product.

Thus, the things we buy and do can have a big impact on our overall carbon footprint. Unfortunately, consumption carbon footprints are difficult to calculate because you need a detailed understanding of what people buy, how and where it is made, and such data does not exist for every neighbourhood in Britain. Therefore, the data presented here is based on a model. But the key points are easy to understand.

1. We take real data about the neighbourhood’s population, and create synthetic households to represent every household in the neighbourhood. These synthetic households reveal some basic characteristics. For instance, a household might be described as “a couple with one child, living in a semi-detached home that they own with a mortgage in a suburban area of a northern town, they have one car and an annual pre-tax household income around £45,000.”

2. We take real data about the household spending of British households from the Living Costs and Food Survey (LCFS) and pair up each synthetic household with a real household from the LCFS.

In short, to estimate your family’s spending habits, we select from the tens of thousands of families who have responded to the LCFS the one that most closely resembles yours and assume their spending habits are similar. For an individual household, this might not be a very good estimate, but doing it hundreds of times for all the households in a neighbourhood tends to smooth out the errors and give a good approximation of a neighbourhood's spending patterns.
<!-- /#pbcc-consumption -->

#### Demographics

The Demographics panel provides the population and household context that helps explain why neighbourhoods differ in their footprints. It includes the community photo, age structure, household composition, socio-economic classification, and a small set of indicators such as average household size, car ownership rate, and income proxies.

Key items:

- **Community photo**: A compact, pictorial summary of common household types in the neighbourhood (see the Community Photo section earlier in this manual). This gives a quick visual cue to the household mix.
- **Age & household composition**: Charts showing the proportion of children, working‑age adults and older adults, and common household types (e.g., lone pensioners, couples with children).
- **NS‑SEC and economic proxies**: The neighbourhood's dominant socio‑economic class and simple income proxies used to explain consumption patterns and vehicle ownership.

Why this matters:

- Demographics strongly influence emissions — larger households and higher incomes typically consume more, while dense, younger, urban neighbourhoods often show lower transport emissions per person. Use the Demographics panel to interpret whether high emissions are driven by population structure, housing stock, or behaviour.

Limitations and responsible use:

- All demographic summaries are aggregated and designed to avoid disclosure. They are best used for contextual interpretation and policy direction rather than identifying or judging individuals. See the community photo limitations described earlier for further detail.

**Sources:**

- Census 2021 household composition and classifications: https://www.ons.gov.uk/census/census2021
- Ethnicity statistics (Census 2021): https://www.ons.gov.uk/peoplepopulationandcommunity/culturalidentity/ethnicity
- National Statistics Socio‑Economic Classification (NS‑SEC): https://www.ons.gov.uk/methodology/classificationsandstandards/otherclassifications/thenationalstatisticssocioeconomicclassificationnssecrebasedonsoc2010


<!-- #pbcc-community-photo -->
##### Community Photo

The community photo is intended to give an at-a-glance overview of the demographics of each neighbourhood. Each neighbourhood's photo is made up of 48 household photos distributed in proportion to their occurrence in the 2021/22 census. 

The appropriate household photos are automatically selected from a set of about 200 household architypes based on three variables.

[Household composition](https://www.ons.gov.uk/census/census2021dictionary/variablesbytopic/demographyvariablescensus2021/householdcomposition/classifications) 

Household composition considers the number and age of people in a household and how people are related to each other. The are 11 categories of household composition.

* ![family_photo](/images/ui/family_photos/higher_OnePersonOver66_White.webp) **OnePersonOver66**: One-person household: Aged 66 years and over 
* ![family_photo](/images/ui/family_photos/higher_OnePersonOther_White.webp) **OnePersonOther**: One-person household: Aged 65 years or under 
* ![family_photo](/images/ui/family_photos/higher_FamilyOver66_White.webp) **FamilyOver66**: Single family household: All aged 66 years and over 
* ![family_photo](/images/ui/family_photos/higher_CoupleNoChildren_White.webp) **CoupleNoChildren**: Single-family household: Married, civil partnership, or cohabiting couple: No children 
* ![family_photo](/images/ui/family_photos/higher_CoupleChildren_White.webp) **CoupleChildren**: Single-family household: Married, civil partnership, or cohabiting couple: Dependent children 
* ![family_photo](/images/ui/family_photos/higher_CoupleNonDepChildren_White.webp) **CoupleNonDepChildren**: Single-family household: Married, civil partnership, or cohabiting couple: All children non-dependent 
* ![family_photo](/images/ui/family_photos/higher_LoneParent_White.webp) **LoneParent**: Single-family household: Lone parent family: With dependent children 
* ![family_photo](/images/ui/family_photos/higher_LoneParentNonDepChildren_White.webp) **LoneParentNonDepChildren**: Single-family household: Lone parent family: All children non-dependent 
* ![family_photo](/images/ui/family_photos/higher_OtherNoChildren_White.webp) **OtherNoChildren**: Other household types: Other related household: Other family composition 
* ![family_photo](/images/ui/family_photos/higher_OtherChildren_White.webp) **OtherChildren**: Other household types: With dependent children 
* ![family_photo](/images/ui/family_photos/higher_OtherIncStudentOrOver66_White.webp) **OtherIncStudentOrOver66**: Other household types: Other, including all full-time students and all aged 66 years and over. 

A dependent child is a person aged 0 to 15 years in a household, or a person aged 16 to 18 years who is in full-time education and lives in a family with their parent, parents, grandparent or grandparents.

[National Statistics Socio-Economic Classification (NS-SEC) of the household reference person](https://www.ons.gov.uk/methodology/classificationsandstandards/otherclassifications/thenationalstatisticssocioeconomicclassificationnssecrebasedonsoc2010)

NS-SEC classifies people based on their jobs, there are six categories.

* ![family_photo](/images/ui/family_photos/higher_CoupleChildren_White.webp) **Higher**: Higher managerial, administrative, and professional occupations
* ![family_photo](/images/ui/family_photos/intermediate_CoupleChildren_White.webp) **Intermediate**: Intermediate occupations 
* ![family_photo](/images/ui/family_photos/routine_CoupleChildren_White.webp) **Routine**: Routine and manual occupations 
* ![family_photo](/images/ui/family_photos/students_OtherIncStudentOrOver66_White.webp) **Students**: Full time students including students that also work
* ![family_photo](/images/ui/family_photos/unemployed_CoupleChildren_White.webp) **Unemployed**: Never worked and long-term unemployed
* ![family_photo](/images/ui/family_photos/DNA_OnePersonOther_White.webp) **Does Not Apply**: A small number of households that cannot be classified.

Note that the NS-SEC classification apply to the household reference person. This is usually the person who pays the rent/mortgage. In the case of joint contributions, the higher earner is chosen. This means that only the NS-SEC of the highest earner is depicted in the family photo. For example, in a couple where one person was a banker and the other a cleaner, the household would be represented by the “Higher” category and show two people in higher roles.

Retired people's NS-SEC classification is based on their previous job. 

[Ethnicity](https://www.ons.gov.uk/peoplepopulationandcommunity/culturalidentity/ethnicity/bulletins/ethnicgroupenglandandwales/census2021)

The family photos include three ethnic categories. 

* ![family_photo](/images/ui/family_photos/higher_CoupleChildren_White.webp) **White**: White, (English, Welsh, Scottish, Northern Irish or British),  Irish, Gypsy or Irish Traveller, Roma, Other White (74.4% of population)
* ![family_photo](/images/ui/family_photos/higher_CoupleChildren_Black.webp) **Black**: Black, Black British, Black Welsh, Caribbean or African (4.0% of population)
* ![family_photo](/images/ui/family_photos/higher_CoupleChildren_Other.webp) **Other**: Asian, Asian British, Asian Welsh, Mixed, Multiple, or Other ethnic group (14.3% of population)

###### Notable limitations

There are a few limitations to the family photo method that should be understood. Mostly, these come from the trade-off between accuracy and an easy-to-understand summary of a complex population. 

**Not all households are represented**: As hundreds of households are summarised into 48 pictures, unusual households are not shown. Typically, around 90% of households are represented and representation is above 75% in almost all neighbourhoods. But only the most common 65% of households are represented in a few truly diverse locations.

**Some characteristics are not included**: For example, gender and sexuality are not included in the analysis. This leads to some obvious simplifications, such as the picture for a person living alone over 66 is always a woman, and the picture for someone living alone under 65 is always a man. There are also no [same-sex couples](https://www.ons.gov.uk/census/maps/choropleth/population/living-arrangements/living-arrangements-11a/living-in-a-same-sex-couple-married-or-in-a-civil-partnership) in the family photos. This is due to a practical limitation of the data. The more categories you add to the analysis, the more likely it is that you identify individual households. The ONS prevents the publication of disclosive datasets, so we have to constrain our analysis to a few broad categories. 

**Mixed ethnicity households are not shown**: A limitation of the input data is that we can’t tell the ethnic composition within households. Therefore, all of the family pictures are a single ethnicity. For example, if there was a neighbourhood made up of exclusive black women and white men, the community photo would be 50% white couples and 50% black couples. In practice mixed ethnicity couples are only common in London and the South East, where they make up as much as [20% of households in some areas](https://www.ons.gov.uk/census/maps/choropleth/identity/multiple-ethnic-groups-in-household/hh-multi-ethnic-group/ethnic-groups-differ-within-partnerships/) .

<!-- /#pbcc-community-photo -->

## Land Use and Planning Explorer

### Map Layers

<!-- #landuse-floodzones -->
####Flood Zones
  Flood zones are areas of land in England that have been identified as being at risk of flooding from rivers, the sea, or other water sources. The Environment Agency, which is responsible for managing flood risk in England, has divided these flood zones into three main categories:

<ol>
    <li>Flood Zone 1 (low risk): This zone includes areas that have a less than 0.1% chance of flooding in any given year (i.e., a "1 in 1,000" chance). These areas are not considered at significant risk of flooding and are generally not subject to flood risk management measures.</li>

    <li>Flood Zone 2 (medium risk): This zone includes areas that have between a 0.1% and 1% chance of flooding in any given year (i.e., a "1 in 100" to "1 in 1,000" chance). These areas are considered at moderate risk of flooding, and flood risk management measures may be required.</li>

    <li>Flood Zone 3 (high risk): This zone includes areas that have a greater than 1% chance of flooding in any given year (i.e., a greater than "1 in 100" chance). These areas are considered at significant risk of flooding. They are subject to strict flood risk management measures, such as building restrictions and mandatory flood insurance requirements.</li>
</ol>

It's important to note that flood zones can change over time as new data and modelling are incorporated into flood risk assessments. Property owners and buyers should be aware of flood risk in their area and take appropriate precautions to protect their property and themselves.
<!-- /#landuse-floodzones -->

<!-- #landuse-railnoise -->
#### Railway noise
Railway noise is a type of environmental noise pollution generated by the operation of trains and railways. It can be a significant issue for people living or working near railway lines, particularly if the railway operates at night.

Railway noise is typically caused by several factors, including the movement of trains along the track, the vibrations generated by the trains, and the noise created by railway infrastructure such as bridges, tunnels, and level crossings. The noise can vary depending on the type of train, its speed, and the proximity of the railway line to buildings and other structures.

Railway noise can negatively impact human health and wellbeing, including sleep disturbance, annoyance, stress, and cognitive impairment. It can also have impacts on wildlife and the environment, such as disrupting animal behavior and causing habitat fragmentation.
<!-- /#landuse-railnoise -->

<!-- #landuse-roadnoise -->
####Road noise
Road noise is a type of environmental noise pollution generated by traffic on roads, highways, and other transportation infrastructure. It can be a significant issue for people living or working near busy roads, particularly if the road operates at night.

Road noise is typically caused by several factors, including vehicle movement along the road, vehicle vibrations, and engine and exhaust noise. The noise can vary depending on the type of vehicle, its speed, and the proximity of the road to buildings and other structures.

Road noise can negatively impact human health and wellbeing, including sleep disturbance, annoyance, stress, and cognitive impairment. It can also impact wildlife and the environment by disrupting animal behaviour and causing habitat fragmentation.
<!-- /#landuse-roadnoise -->

<!-- #landuse-landfill -->
#### Historic landfills
Historic landfills in England are sites where waste was disposed of in the past, often before modern environmental regulations were in place. These sites are typically abandoned and may contain various hazardous materials, such as heavy metals, organic pollutants, and asbestos.

Many historic landfills in England were operational during the 20th century when waste management practices were not as regulated as they are today. These sites were often located in areas considered undesirable at the time, such as low-lying land, quarries, or areas with limited access.

Today, many historic landfills pose a risk to human health and the environment, mainly if they are not adequately managed and monitored. They can contribute to soil and water pollution and generate methane gas, a potent greenhouse gas that can contribute to climate change.

The UK government has established a framework for managing historic landfills, which includes assessing the risks posed by these sites, implementing measures to mitigate those risks, and monitoring the sites over time. The management of historic landfills is typically the responsibility of local authorities, with support from national government agencies as needed.
<!-- /#landuse-landfill -->

<!-- #landuse-aonb -->
#### Areas of Outstanding Natural Beauty
Areas of Outstanding Natural Beauty (AONBs) are designated landscapes in England, Wales, and Northern Ireland that have exceptional natural beauty and significance. Similar to national parks, they focus on protecting and enhancing the natural and cultural landscape rather than on recreation and tourism.

AONBs are typically characterised by their unique and diverse landscapes, including rolling hills, coastlines, forests, moorland, and other distinctive features. They are managed by local partnerships made up of local authorities, landowners, and other stakeholders, who work together to balance conservation and sustainable development in the area.

The first AONBs were designated in England and Wales in the 1940s, and today, there are 46 AONBs in England, covering around 18% of the country's land area. In Northern Ireland, there are 8 AONBs, covering around 25% of the country's land area, while in Wales, there are 5 AONBs, covering around 25% of the country's land area.

AONBs provide a range of benefits, including conserving biodiversity and cultural heritage, promoting sustainable land management practices, and providing recreational opportunities for visitors and local communities. They also play an important role in supporting the local economy through tourism, agriculture, and other industries that rely on the area's natural resources and landscapes.
<!-- /#landuse-aonb -->

<!-- #landuse-ancientwoodland -->
#### Ancient woodlands
Ancient woodlands in England are areas of woodland that have been continuously wooded since at least 1600 AD and are therefore considered to be of significant ecological and historical value. They are often characterised by a complex and diverse ecosystem, with a variety of tree species, plant life, and wildlife.

Ancient woodlands in England can be found in a range of different landscapes, including lowland and upland areas. They can include broadleaved woodland, coniferous woodland, and mixed woodland. They may also contain features such as ponds, streams, and meadows.

Ancient woodlands in England are protected under a national planning policy, which requires that they are given the highest level of protection from development and that their biodiversity and historical significance are preserved. However, despite this protection, many ancient woodlands in England have been lost or damaged over time, through factors such as development, forestry, and agriculture.

To help protect and restore ancient woodlands in England, various initiatives have been established, such as the Woodland Trust's Ancient Woodland Restoration Project, which aims to restore and reconnect fragmented ancient woodlands, and the Forestry Commission's Woodland Creation Planning Grant, which provides funding to establish new woodland areas in England. These initiatives aim to help ensure that ancient woodlands in England continue to provide important ecological and historical benefits for future generations.
<!-- /#landuse-ancientwoodland -->

<!-- #landuse-conservationareas -->
#### Conservation areas
Conservation areas in England are designated areas with significant historical or architectural value, where special planning regulations and controls are put in place to protect the character and appearance of the area. They are typically made up of historic buildings, streets, and other features that contribute to the unique character and identity of the area.

Local authorities can designate conservation areas in England based on a range of factors, such as the area's historical significance, the architectural merit of the buildings, and the area's contribution to the wider community. Once designated, the local authority must preserve and enhance the area's character and appearance and ensure that any development or changes are consistent with the special planning regulations and controls.

Regulations and controls in conservation areas can include restrictions on building demolition, alteration, or extension, as well as controls on the use of materials and the design of new buildings. Local authorities can also provide grants and other incentives to encourage the repair and maintenance of historic buildings and structures.

Conservation areas can provide a range of benefits, including the preservation of important cultural and historical heritage, the enhancement of the local environment, and the promotion of sustainable development and tourism. They also provide opportunities for local communities to engage in the planning and management of their local area and to contribute to the preservation and enhancement of their local heritage.
<!-- /#landuse-conservationareas -->

<!-- #landuse-greenbelt -->
#### Greenbelt
The Greenbelt is a planning policy in England that aims to prevent urban sprawl and protect the countryside and other open spaces around cities and towns. It is a zone of land surrounding urban areas where new development is restricted, aiming to preserve the natural environment and promote sustainable development.

The Greenbelt was first established in England in the 1950s in response to concerns about the impact of rapid urbanisation and the loss of green spaces and agricultural land. Today, the Greenbelt covers around 13% of the land area in England, and is designated by local authorities through the planning system.

The Greenbelt policy restricts development within the designated areas and seeks to protect the countryside and other open spaces from urbanisation. This means that new development is generally not permitted, with some exceptions for certain types of development, such as agricultural use, public utilities, and infrastructure.

The Greenbelt has several benefits, including preserving the natural environment, protecting biodiversity and wildlife, and providing recreational opportunities for local communities. It also helps maintain the character and identity of urban areas by preventing the spread of urbanisation into surrounding areas.

However, there are also some criticisms of the Greenbelt policy, including concerns about its impact on housing affordability and arguments that it is too rigid and inflexible and may prevent the development of much-needed infrastructure and other essential services.
<!-- /#landuse-greenbelt -->

<!-- #landuse-listedbuildings -->
#### Listed buildings
Listed buildings in England are buildings or structures that are deemed to be of special architectural or historic interest and are, therefore, included on a national register called the National Heritage List for England. This register is maintained by Historic England, the government's official heritage agency.

Buildings and structures can be listed for various reasons, such as their historical significance, architectural merit, or contribution to the local community or landscape. Once listed, a building or structure is legally protected, and any alterations or changes to the building must be approved by the local planning authority and comply with strict regulations.

Listed buildings in England are graded into three categories: Grade I, Grade II Star, and Grade II. Grade I buildings are considered to be of exceptional interest, while Grade II Star and Grade II buildings are of lesser interest but still considered to be of special significance.

England has around 500,000 listed buildings, ranging from castles and stately homes to more humble structures such as cottages and farmhouses. Listed buildings can be found in both urban and rural areas and are often seen as important landmarks and part of the country's cultural heritage.

Listing a building or structure can provide a range of benefits, including the preservation of historic and architectural features, the protection of cultural heritage, and the promotion of tourism and education. However, it can also place restrictions on the use and development of the building, and may require additional costs for maintenance and repair.
<!-- /#landuse-listedbuildings -->

<!-- #landuse-nationalparks -->
#### National parks
National parks are large areas of land in England that are protected for their natural beauty, wildlife, and cultural heritage. The government designated them under the National Parks and Access to the Countryside Act 1949 to preserve the landscape and promote public enjoyment of the countryside.

There are currently ten national parks in England, covering approximately 9% of the country's land area. Each park has its own unique character and landscape, ranging from the rugged peaks of the Lake District to the rolling hills of the South Downs.

National parks are managed by local authorities and other organisations, such as the National Trust and the Forestry Commission, in collaboration with local communities and stakeholders. Each park's management aims to balance the protection of the natural environment and cultural heritage with the needs of local communities and visitors.
<!-- /#landuse-nationalparks -->

<!-- #landuse-naturereserves -->
#### Nature reserves
Nature reserves are areas of land and/or water managed to conserve and protect the natural environment, including plant and animal species, habitats, and ecosystems. They are established by governments, non-governmental organisations, or private individuals or groups and are generally open to the public for education, research, and recreation.

Nature reserves may be established to protect areas of special ecological, scientific, or cultural importance, or to restore and conserve habitats damaged or degraded by human activities. They can be found in various settings, including forests, wetlands, grasslands, and coastal areas.

Management of nature reserves typically involves monitoring and controlling human activities such as hunting, fishing, logging, and development, as well as managing invasive species and restoring degraded habitats. Nature reserves may also offer educational programs, guided tours, and interpretive displays to help visitors learn about the local ecology and natural history.

Nature reserves are important in protecting biodiversity and ecosystem services, such as water and air quality, soil health, and carbon storage. They also provide significant recreational opportunities and contribute to local economies through tourism and outdoor recreation.
<!-- /#landuse-naturereserves -->

<!-- #landuse-parksandgardens -->
#### Registered Parks and Gardens
Registered Parks and Gardens are historically designed landscapes of national importance in England. Historic England designates them and is responsible for identifying, protecting, and promoting England's historic environment.

These landscapes can range from small urban gardens to large country estates and are valued for their historical, cultural, and ecological significance. They often contain various features, such as ornamental buildings, fountains, ponds, statues, and woodland areas, and can provide important habitats for wildlife.

The designation of a Registered Park or Garden is based on several factors, including the design quality, the features' rarity, the level of survival of the historic fabric, and the degree of historical and cultural significance. Once a site is designated, it is recorded on the National Heritage List for England. It is protected by law against damage or destruction.

Owners and managers of Registered Parks and Gardens must manage them in a way that preserves their historic character and significance. Historic England provides guidance and advice on the management and conservation of these sites and may also provide grants for conservation work.

Registered Parks and Gardens are an important part of England's heritage and provide public enjoyment and education opportunities. Many sites are open to the public and offer a range of activities and events, such as guided tours, exhibitions, and educational programs.
<!-- /#landuse-parksandgardens -->

<!-- #landuse-RAMSAR -->
#### RAMSAR
RAMSAR sites are wetlands designated under the Ramsar Convention, an international treaty established in 1971 to protect wetlands of international importance. The treaty is named after the city of Ramsar in Iran, where it was signed.

Wetlands are defined as areas of marsh, fen, peatland, or water, whether natural or artificial, permanent or temporary, with water that is static or flowing, fresh, brackish, or salt. They include areas of marine water, the depth of which at low tide does not exceed six meters.

The main goal of the Ramsar Convention is to conserve wetlands and their resources and to promote their wise use for the benefit of present and future generations. The convention is designed to ensure that wetlands are managed sustainably, balancing human needs with the protection of the natural environment.

As of 2021, over 2,400 Ramsar sites are designated worldwide, covering a total area of over 252 million hectares. In the UK, there are currently 177 Ramsar sites, covering a wide range of wetland habitats, including rivers, estuaries, lakes, and marshes.

Designation as a Ramsar site can provide various benefits, including international recognition of the site's importance, increased protection, and access to funding for conservation and management efforts. RAMSAR sites are also considered part of the wider protected area network. They can contribute to achieving international conservation targets such as the Aichi Biodiversity Targets and the Sustainable Development Goals.
<!-- /#landuse-RAMSAR -->

<!-- #landuse-SAC -->
#### Special Areas of Conservation
Special Areas of Conservation (SACs) are protected areas designated under the European Union's Habitats Directive to conserve important habitats and species of European importance. SACs are part of a wider network of protected areas known as Natura 2000, which includes both SACs and Special Protection Areas (SPAs) for birds.

SACs are designated based on scientific criteria, such as the presence of rare or threatened habitats or species, and their designation requires member states to take measures to conserve and manage these areas effectively. The Habitats Directive requires that SACs be managed in a way that maintains or restores their natural habitats and species and that any plans or projects that may impact these areas are subject to a rigorous assessment of their potential environmental impact.

In the UK, there are currently over 600 SACs, covering a variety of habitats such as woodlands, heathlands, grasslands, and wetlands, as well as marine habitats such as reefs, sandbanks, and estuaries. These sites are home to many rare and threatened species, such as otters, water voles, dormice, bats, birds of prey, and various invertebrates, plants and fungi.

The management of SACs in the UK is carried out by a range of organisations, including government bodies, conservation organisations, landowners, and local communities. Management measures may include habitat restoration, monitoring and research, access management, and control of invasive species and other threats to biodiversity.
<!-- /#landuse-SAC -->

<!-- #landuse-scheduledmonuments -->
#### Scheduled monuments
Scheduled monuments are archaeological or historic sites of national importance that are protected by law in the UK. They are designated under the Ancient Monuments and Archaeological Areas Act 1979 and managed by Historic England, Cadw, Historic Environment Scotland, or the Northern Ireland Environment Agency.

The designation of scheduled monuments is based on the archaeological or historical significance of the site, and their inclusion on the schedule affords them legal protection against damage, destruction or inappropriate development. The sites may include prehistoric standing stones, burial mounds, hillforts, Roman forts and villas, medieval castles, churches and monasteries, and industrial sites.

The designation of a scheduled monument provides for public access to the site, subject to any restrictions necessary for its protection. Scheduled monuments are also subject to controls on any works or development that may affect them, and a consent process is required before any works can be undertaken.

The relevant heritage agency is responsible for managing scheduled monuments. It works with owners and other stakeholders to ensure that the monument is protected, conserved, and interpreted for the benefit of future generations. Management measures may include conservation work, research, interpretation, and education and community engagement programs.
<!-- /#landuse-scheduledmonuments -->

<!-- #landuse-SPA -->
#### SPA
Special Protection Areas (SPAs) are areas designated under the European Union's Birds Directive to protect and conserve important bird habitats. SPAs are part of a wider network of protected areas known as Natura 2000, including SPAs and Special Areas of Conservation (SACs) for other habitats and species.

SPAs are designated based on scientific criteria, such as the presence of rare or threatened bird species or important breeding or wintering habitats. The designation requires member states to take measures to protect these areas and ensure that any plans or projects that may impact them are subject to a rigorous assessment of their potential environmental impact.

In the UK, there are currently over 260 SPAs, covering a variety of habitats such as coastal and estuarine areas, wetlands, and uplands. These sites are home to a wide range of bird species, such as seabirds, waders, wildfowl, and raptors, and some sites are of international importance, supporting populations of rare or threatened species.

SPAs in the UK are managed by various organisations, including government bodies, conservation organisations, landowners, and local communities. Management measures may include habitat restoration, monitoring and research, access management, and control of disturbance and other threats to bird populations.
<!-- /#landuse-SPA -->

<!-- #landuse-SSSI -->
#### SSSI
Sites of Special Scientific Interest (SSSIs) are areas designated under UK legislation as being of particular interest due to their unique flora, fauna, or geological features. They are defined by each country's relevant nature conservation body, such as Natural England, Scottish Natural Heritage, or the Countryside Council for Wales.

SSSIs cover a range of habitats, including heathland, grassland, woodland, coastal habitats, and wetlands. They may be important for a particular species or group of species or for their geology, landform or soils. Many sites are also designated for their ecological or geological processes, such as sand dune formation, peat accumulation, or the geological history of an area.

The designation of an SSSI provides legal protection for the site and its features, and requires landowners and managers to manage the site in a way that protects its special interest. Planning authorities must also take into account the conservation of SSSIs when making planning decisions.

The relevant nature conservation body is responsible for managing SSSIs. They work with landowners and other stakeholders to ensure that the site is conserved and managed appropriately. Management measures may include habitat restoration, monitoring and research, access management, and control of invasive species and other threats to the site.

SSSIs are an important part of the UK's natural heritage, providing habitats for a wide range of species and contributing to the wider ecological and environmental health of the country. Many sites are also important for their recreational and educational value, and are open to the public for enjoyment and learning.
<!-- /#landuse-SSSI -->

<!-- #landuse-worldheritagesite -->
#### World Heritage Sites
World Heritage Sites are places of significant cultural, historical, or natural importance recognised by the United Nations Educational, Scientific and Cultural Organization (UNESCO) as being of universal value to humanity. They are considered among the most important and irreplaceable sites on the planet and are protected by international treaties.

There are currently over 1,100 World Heritage Sites in more than 160 countries. These sites are chosen for their outstanding universal value, authenticity, and integrity. They include natural wonders, cultural landmarks, and historic monuments.

To be considered for World Heritage status, a site must meet one or more of the ten criteria established by UNESCO, including cultural and natural significance and aesthetic and historical value. Sites must also have adequate protection and management plans to ensure their preservation.

Once a site is designated as a World Heritage Site, it becomes part of a global network of protected areas and is eligible for funding and support from UNESCO and other international organisations. The management and conservation of World Heritage Sites is typically the responsibility of the government or other authority in charge of the site.

World Heritage Sites are an important part of the world's cultural and natural heritage. They are recognised as having universal value to all humanity. They remind us of the achievements of past civilisations, the wonders of nature, and the need to protect and preserve our shared cultural and natural heritage for future generations.
<!-- /#landuse-worldheritagesite -->

<!-- #landuse-food_hygiene -->
#### Food Hygiene Ratings

A 2023 extract of the [Food Standards Agency hygiene ratings](https://ratings.food.gov.uk/). Click on a dot to see the business name and type.
<!-- /#landuse-food_hygiene -->