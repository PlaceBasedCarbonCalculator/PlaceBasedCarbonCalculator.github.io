# Carbon & Place Manual

Welcome to Carbon & Place a family of tools to help you understand how and why carbon footprints change from place to place and how we can reduce them. Funded by the Energy Demand Research Centre and developed by the University of Leeds it. It builds on the Place-Based Carbon Calculator.

## Accessing Carbon & Place


The easiest way to access Carbon & Place is via the website hosted at [www.carbon.place](http://www.carbon.place).

### Progressive Web App

The Carbon & Place is a Progressive Web App (PWA), which can be installed on many devices, including your smartphone. The App provides the same features as the website. Still, it includes additional benefits such as pining the App to your device’s home screen and full-screen support.

How to install the Carbon & Place App

#### Android

1.  Visit [www.carbon.place](http://www.carbon.place) using Google Chrome
2.  Click the “Add Carbon & Place to Home screen” and follow the instructions

If the “Add Carbon & Place to Home screen” option does not appear, you can also select the “Install app” option from the main chrome menu (…)

#### Windows 10 & 11

1.  Visit [www.carbon.place](http://www.carbon.place) using Microsoft Edge
2.  In the address bar, click the App install button
3.  Click install

#### iOS

1.  Visit [www.carbon.place](http://www.carbon.place) using Safari
2.  In the bottom menu bar, click the share button (middle button)
3.  Click “Add to Home Screen”
4.  Click “Add”

#### macOS

1.  Visit [www.carbon.place](http://www.carbon.place) using Safari
2.  In the address bar, click the App install button
3.  Click install


## Carbon & Place User Interface Guide

The Carbon & Place's user interface is intuitive, featuring map controls for easy navigation and layer controls to customize data visibility.

### Map Controls

![Map controls](/images/map_controls.png)

The map can be navigated using map controls on the top left of the screen.

The Carbon & Place provides different basemaps. The example below shows the basemap selection options with the satellite basemap with 3D terrain enabled. You can hide the basemap selection option by clicking the change basemap button again.

![Basemap controls](/images/basemaps.png)

The Anti-alias option enables advanced rendering options that make the map look smoother and clearer. However, performance on low-end devices may be impaired when using anti-aliasing.

### Layer Controls

![Layer Controls](/images/layer_controls.png)

The layer controls on the right side of the map control what information is shown on the map.

### General Concepts

#### Neighbouhood Statitics

The tools on site site often present their results in the form of neighbourhood statistics. We mostly use the Lower Super Output Areas (LSOA) created for the 2021 census, or their Scottish equivalents (Data Zones). 

LSOAs are small statical areas designed to have roughly the same population (1,500 - 3,000 people). As such they vary in shape and size. In urban areas they may be as small as a single street, while in rural areas they can be very large. They were originally created for the 2001 Census by the Office for National Statistics (ONS) and have be updated for the 2011, and 2021 Cenuses.

As well as being used by the ONS to publish Census statistics LSOAs are widely used in by Government and Academia to publish small area datasets. This means that information on a wide range of topics is available for LSOAs and they are a useful unit of comparison.

While LSOAs are small they still contain thousands of people, so any data about them is still an average of many people and not individually specific. There will still be a lot of variation within an LSOA, think about how different you are to your neighbours. Small area statics can be useful as neighbours often have a lot in common. They may live in similar homes, have access to the same shops and services, and send their children to the same schools. Many of the choices we make are, at least in part, affected by where we live. Thus studying the differences between people and places can help us understand some of the biggest and most complex issues of our times.

<!-- #dasymetric -->
#### Dasymetric Mapping

By default, the neighbourhood statistics are are shown as a dasymetric map. This means that the buildings within a zone are coloured to display information. If you turn off dasymetric mode, a simple choropleth map is shown where the whole neighbourhood is coloured. Note that the same underlying data is being visualised in both modes, and the differences between modes are merely aesthetic. However, dasymetric maps are intended to better represent the data by emphasising the true locations of people who are not uniformly distributed across the area. 

For some data types we have split the neighbourhoods into residential and non-residential areas. The original LSOAs created by the Office for National Statistics (ONS) are contiguous. In other words every part of the country is within an LSOA with no gaps. However for some neighbourhood statistics they only make sense to refer to the part of the LSOA that contains homes. For example consider LSOA E01002444 which contains Heathrow Airport. This LSOA has a population of about 2,230 people. But none of these people live in the airport, they live in the homes near the airport. So we split the LSOA into two; one that contains all the homes and will report statistics that are relevant to the residential population, and one that contains no homes and will report non-domestic statistics. This means you may see maps that have gaps or grey buildings.
<!-- /#dasymetric -->

#### Administrative Boundaries

<!-- #boundaries-la -->
##### Local Authority

Lower Tier Local Authority 2023
<!-- /#boundaries-la -->
<!-- #boundaries-wards -->
##### Wards

Wards 2023
<!-- /#boundaries-wards -->
<!-- #boundaries-parish -->
##### Parish

Parish 2023
<!-- /#boundaries-parish -->
<!-- #boundaries-westminster -->
##### Westminster Constituency

Westminster Constituency 2024
<!-- /#boundaries-westminster -->


## Place-Based Carbon Calcualtor

<!-- #purpose -->
Section
<!-- /#purpose -->

<!-- #pbcc-zones -->
Zones Help
<!-- /#pbcc-zones -->


## Transport and Accessibility Explorer

The Transport and Accessibility Explorer allows a deep dive on the issues related to transport and access to services.

### Map Layers
<!-- #transport-zones -->
#### Neighbouhoods

The Neighbourhoods layer uses the Lower Super Output Areas (LSOA) to report a range of transport statistics.

*Change in Bus Service (2008 - 2023)*

This layer shows the change in bus frequency (trips per hour) of bus services stopping in or near each neighbourhood.

*Tram / Subway / Rail / Bus / Ferry*

These layers show the frequency of service (trips per hour) for each type of transport stopping in or near each neighbourhood in 2023.

<!-- /#transport-zones -->

## Retrofit Explorer

## Land Use and Planning Explorer

### Map Layers

<!-- #landuse-floodzones -->
####Flood Zones
  Flood zones are areas of land in England that have been identified as being at risk of flooding from rivers, the sea, or other sources of water. The Environment Agency, which is responsible for managing flood risk in England, has divided these flood zones into three main categories:

<ol>
  <li>Flood Zone 1 (low risk): This zone includes areas that have a less than 0.1% chance of flooding in any given year (i.e., a "1 in 1,000" chance). These areas are not considered to be at significant risk of flooding and are generally not subject to flood risk management measures.</li>

    <li>Flood Zone 2 (medium risk): This zone includes areas that have between a 0.1% and 1% chance of flooding in any given year (i.e., a "1 in 100" to "1 in 1,000" chance). These areas are considered to be at moderate risk of flooding, and flood risk management measures may be required.</li>

    <li>Flood Zone 3 (high risk): This zone includes areas that have a greater than 1% chance of flooding in any given year (i.e., a greater than "1 in 100" chance). These areas are considered to be at significant risk of flooding and are subject to strict flood risk management measures, such as building restrictions and mandatory flood insurance requirements.</li>
</ol>

It's important to note that flood zones can change over time as new data and modeling are incorporated into flood risk assessments. It's also important for property owners and buyers to be aware of flood risk in their area and to take appropriate precautions to protect their property and themselves.
<!-- /#landuse-floodzones -->

<!-- #landuse-railnoise -->
####Railway noise
  Railway noise is a type of environmental noise pollution that is generated by the operation of trains and railways. It can be a significant issue for people living or working near railway lines, particularly if the railway operates during the night.

Railway noise is typically caused by a number of factors, including the movement of trains along the track, the vibrations generated by the trains, and the noise created by railway infrastructure such as bridges, tunnels, and level crossings. The noise can vary depending on the type of train, the speed of the train, and the proximity of the railway line to buildings and other structures.

Railway noise can have a range of negative impacts on human health and wellbeing, including sleep disturbance, annoyance, stress, and cognitive impairment. It can also have impacts on wildlife and the environment, such as disrupting animal behavior and causing habitat fragmentation.

To mitigate the impacts of railway noise, various measures can be taken, such as using quieter train technology, implementing noise barriers and sound insulation for nearby buildings, and adjusting train timetables to minimize noise during night hours. These measures are typically carried out by railway operators and local governments in collaboration with affected communities.
<!-- /#landuse-railnoise -->

<!-- #landuse-roadnoise -->
####Road noise
  Road noise is a type of environmental noise pollution that is generated by traffic on roads, highways, and other transportation infrastructure. It can be a significant issue for people living or working near busy roads, particularly if the road operates during the night.

Road noise is typically caused by a number of factors, including the movement of vehicles along the road, the vibrations generated by the vehicles, and the noise created by vehicle engines and exhaust systems. The noise can vary depending on the type of vehicle, the speed of the vehicle, and the proximity of the road to buildings and other structures.

Road noise can have a range of negative impacts on human health and wellbeing, including sleep disturbance, annoyance, stress, and cognitive impairment. It can also have impacts on wildlife and the environment, such as disrupting animal behaviour and causing habitat fragmentation.

To mitigate the impacts of road noise, various measures can be taken, such as using quieter road surfaces, implementing noise barriers and sound insulation for nearby buildings, and adjusting traffic flow and speed limits to minimize noise during night hours. These measures are typically carried out by transportation agencies and local governments in collaboration with affected communities.
<!-- /#landuse-roadnoise -->

<!-- #landuse-landfill -->
####Historic landfills
  Historic landfills in England are sites where waste was disposed of in the past, often before modern environmental regulations were in place. These sites are typically abandoned and may contain a variety of hazardous materials, such as heavy metals, organic pollutants, and asbestos.

Many historic landfills in England were operational during the 20th century, when waste management practices were not as regulated or sophisticated as they are today. These sites were often located in areas that were considered undesirable at the time, such as low-lying land, quarries, or areas with limited access.

Today, many historic landfills pose a risk to human health and the environment, particularly if they are not properly managed and monitored. They can contribute to soil and water pollution, as well as generate methane gas, which is a potent greenhouse gas that can contribute to climate change.

The UK government has established a framework for the management of historic landfills, which includes assessing the risks posed by these sites, implementing measures to mitigate those risks, and monitoring the sites over time. The management of historic landfills is typically the responsibility of local authorities, with support from national government agencies as needed.
<!-- /#landuse-landfill -->

<!-- #landuse-aonb -->
####Areas of Outstanding Natural Beauty
  Areas of Outstanding Natural Beauty (AONBs) are designated landscapes in England, Wales, and Northern Ireland that are considered to have exceptional natural beauty and significance. They are similar to national parks, but have a focus on protecting and enhancing the natural and cultural landscape, rather than on recreation and tourism.

AONBs are typically characterized by their unique and diverse landscapes, which can include rolling hills, coastline, forests, moorland, and other distinctive features. They are managed by local partnerships made up of local authorities, landowners, and other stakeholders, who work together to balance conservation and sustainable development in the area.

The first AONBs were designated in England and Wales in the 1940s, and today there are 46 AONBs in England, covering around 18% of the country's land area. In Northern Ireland, there are 8 AONBs, covering around 25% of the country's land area, while in Wales there are 5 AONBs, covering around 25% of the country's land area.

AONBs provide a range of benefits, including the conservation of biodiversity and cultural heritage, the promotion of sustainable land management practices, and the provision of recreational opportunities for visitors and local communities. They also play an important role in supporting the local economy, through tourism, agriculture, and other industries that rely on the natural resources and landscapes of the area.
<!-- /#landuse-aonb -->

<!-- #landuse-ancientwoodland -->
####Ancient woodlands
  Ancient woodlands in England are areas of woodland that have been continuously wooded since at least 1600 AD, and are therefore considered to be of significant ecological and historical value. They are often characterized by a complex and diverse ecosystem, with a variety of tree species, plant life, and wildlife.

Ancient woodlands in England can be found in a range of different landscapes, including lowland and upland areas, and can include broadleaved woodland, coniferous woodland, and mixed woodland. They may also contain features such as ponds, streams, and meadows.

Ancient woodlands in England are protected under national planning policy, which requires that they are given the highest level of protection from development, and that their biodiversity and historical significance are preserved. However, despite this protection, many ancient woodlands in England have been lost or damaged over time, through factors such as development, forestry, and agriculture.

To help protect and restore ancient woodlands in England, various initiatives have been established, such as the Woodland Trust's Ancient Woodland Restoration Project, which aims to restore and reconnect fragmented ancient woodlands, and the Forestry Commission's Woodland Creation Planning Grant, which provides funding to establish new woodland areas in England. These initiatives aim to help ensure that ancient woodlands in England continue to provide important ecological and historical benefits for future generations.
<!-- /#landuse-ancientwoodland -->

<!-- #landuse-conservationareas -->
####Conservation areas
  Conservation areas in England are designated areas with significant historical or architectural value, where special planning regulations and controls are put in place to protect the character and appearance of the area. They are typically made up of historic buildings, streets, and other features that contribute to the unique character and identity of the area.

Conservation areas in England can be designated by local authorities, based on a range of factors such as the historical significance of the area, the architectural merit of the buildings, and the contribution of the area to the wider community. Once designated, the local authority has a duty to preserve and enhance the character and appearance of the area, and to ensure that any development or changes are consistent with the special planning regulations and controls.

The regulations and controls in conservation areas can include restrictions on the demolition, alteration, or extension of buildings, as well as controls on the use of materials and the design of new buildings. Local authorities can also provide grants and other incentives to encourage the repair and maintenance of historic buildings and structures.

Conservation areas can provide a range of benefits, including the preservation of important cultural and historical heritage, the enhancement of the local environment, and the promotion of sustainable development and tourism. They also provide opportunities for local communities to engage in the planning and management of their local area, and to contribute to the preservation and enhancement of their local heritage.
<!-- /#landuse-conservationareas -->

<!-- #landuse-greenbelt -->
####Greenbelt
  The greenbelt is a planning policy in England that aims to prevent urban sprawl and protect the countryside and other open spaces around cities and towns. It is a zone of land surrounding urban areas where new development is restricted, with the aim of preserving the natural environment and promoting sustainable development.

The greenbelt was first established in England in the 1950s, in response to concerns about the impact of rapid urbanisation and the loss of green spaces and agricultural land. Today, the greenbelt covers around 13% of the land area in England, and is designated by local authorities through the planning system.

The policy of the greenbelt places restrictions on development within the designated areas, and seeks to protect the countryside and other open spaces from urbanisation. This means that new development is generally not permitted, with some exceptions for certain types of development, such as agricultural use, public utilities, and infrastructure.

The greenbelt has a number of benefits, including the preservation of the natural environment, the protection of biodiversity and wildlife, and the provision of recreational opportunities for local communities. It also helps to maintain the character and identity of urban areas, by preventing the spread of urbanisation into surrounding areas.

However, there are also some criticisms of the greenbelt policy, including concerns about the impact on housing affordability, as well as arguments that the policy is too rigid and inflexible, and may prevent the development of much-needed infrastructure and other essential services.
<!-- /#landuse-greenbelt -->

<!-- #landuse-listedbuildings -->
####Listed buildings
  Listed buildings in England are buildings or structures that are deemed to be of special architectural or historic interest, and are therefore included on a national register called the National Heritage List for England. This register is maintained by Historic England, which is the government's official heritage agency.

Buildings and structures can be listed for a variety of reasons, such as their historical significance, their architectural merit, or their contribution to the local community or landscape. Once listed, a building or structure is legally protected, and any alterations or changes to the building must be approved by the local planning authority and comply with strict regulations.

Listed buildings in England are graded into three categories: Grade I, Grade II Star, and Grade II. Grade I buildings are considered to be of exceptional interest, while Grade II Star and Grade II buildings are of lesser interest but still considered to be of special significance.

There are currently around 500,000 listed buildings in England, ranging from castles and stately homes to more humble structures such as cottages and farmhouses. Listed buildings can be found in both urban and rural areas, and are often seen as important landmarks and part of the country's cultural heritage.

Listing a building or structure can provide a range of benefits, including the preservation of historic and architectural features, the protection of cultural heritage, and the promotion of tourism and education. However, it can also place restrictions on the use and development of the building, and may require additional costs for maintenance and repair.
<!-- /#landuse-listedbuildings -->

<!-- #landuse-nationalparks -->
####National parks
  National parks are large areas of land in England that are protected for their natural beauty, wildlife, and cultural heritage. They are designated by the government under the National Parks and Access to the Countryside Act 1949, with the aim of preserving the landscape and promoting public enjoyment of the countryside.

There are currently 10 national parks in England, covering approximately 9% of the country's land area. Each park has its own unique character and landscape, ranging from the rugged peaks of the Lake District to the rolling hills of the South Downs.

National parks are managed by local authorities and other organizations, such as the National Trust and the Forestry Commission, in collaboration with local communities and stakeholders. The management of each park aims to balance the protection of the natural environment and cultural heritage with the needs of local communities and visitors.

Activities in national parks can include hiking, cycling, horseback riding, fishing, and wildlife watching. The parks also provide opportunities for education and research, and support sustainable tourism and economic development in the surrounding areas.

National parks in England are important for their cultural and historical significance, as well as their ecological and recreational value. They provide important habitats for wildlife, protect important landscapes and geological features, and contribute to the health and well-being of local communities and visitors.
<!-- /#landuse-nationalparks -->

<!-- #landuse-naturereserves -->
####Nature reserves
  Nature reserves are areas of land and/or water that are managed for the purpose of conserving and protecting the natural environment, including plant and animal species, habitats, and ecosystems. They are established by governments, non-governmental organizations, or private individuals or groups, and are generally open to the public for education, research, and recreation.

Nature reserves may be established to protect areas of special ecological, scientific, or cultural importance, or to restore and conserve habitats that have been damaged or degraded by human activities. They can be found in a variety of settings, including forests, wetlands, grasslands, and coastal areas.

Management of nature reserves typically involves monitoring and controlling human activities such as hunting, fishing, logging, and development, as well as managing invasive species and restoring degraded habitats. Nature reserves may also offer educational programs, guided tours, and interpretive displays to help visitors learn about the local ecology and natural history.

Nature reserves play an important role in protecting biodiversity and ecosystem services, such as water and air quality, soil health, and carbon storage. They also provide important recreational opportunities and contribute to local economies through tourism and outdoor recreation.
<!-- /#landuse-naturereserves -->

<!-- #landuse-parksandgardens -->
####Registered Parks and Gardens
  Registered Parks and Gardens are historic designed landscapes that are of national importance in England. They are designated by Historic England, which is responsible for identifying, protecting, and promoting England's historic environment.

These landscapes can range from small urban gardens to large country estates, and are valued for their historic, cultural, and ecological significance. They often contain a variety of features, such as ornamental buildings, fountains, ponds, statues, and woodland areas, and can provide important habitats for wildlife.

The designation of a Registered Park or Garden is based on a number of factors, including the quality of the design, the rarity of the features, the level of survival of the historic fabric, and the degree of historical and cultural significance. Once a site is designated, it is recorded on the National Heritage List for England and is protected by law against damage or destruction.

Owners and managers of Registered Parks and Gardens have a duty to manage them in a way that preserves their historic character and significance. Historic England provides guidance and advice on the management and conservation of these sites, and may also provide grants for conservation work.

Registered Parks and Gardens are an important part of England's heritage and provide opportunities for public enjoyment and education. Many sites are open to the public and offer a range of activities and events, such as guided tours, exhibitions, and educational programs.
<!-- /#landuse-parksandgardens -->

<!-- #landuse-RAMSAR -->
####RAMSAR
  RAMSAR sites are wetlands that are designated under the Ramsar Convention, an international treaty that was established in 1971 to protect wetlands of international importance. The Ramsar Convention is named after the city of Ramsar in Iran, where the treaty was signed.

Wetlands are defined as areas of marsh, fen, peatland or water, whether natural or artificial, permanent or temporary, with water that is static or flowing, fresh, brackish or salt, including areas of marine water the depth of which at low tide does not exceed six meters.

The main goal of the Ramsar Convention is to conserve wetlands and their resources, and to promote their wise use for the benefit of present and future generations. The convention is designed to ensure that wetlands are managed in a sustainable way, balancing human needs with the protection of the natural environment.

As of 2021, there are over 2,400 Ramsar sites designated worldwide, covering a total area of over 252 million hectares. In the UK, there are currently 177 Ramsar sites, covering a wide range of wetland habitats including rivers, estuaries, lakes, and marshes.

Designation as a Ramsar site can provide various benefits, including international recognition of the site's importance, increased protection, and access to funding for conservation and management efforts. RAMSAR sites are also considered part of the wider protected area network, and can contribute to the achievement of international conservation targets such as the Aichi Biodiversity Targets and the Sustainable Development Goals.
<!-- /#landuse-RAMSAR -->

<!-- #landuse-SAC -->
####Special Areas of Conservation
  Special Areas of Conservation (SACs) are protected areas designated under the European Union's Habitats Directive, with the aim of conserving important habitats and species of European importance. SACs are part of a wider network of protected areas known as Natura 2000, which includes both SACs and Special Protection Areas (SPAs) for birds.

SACs are designated based on scientific criteria, such as the presence of rare or threatened habitats or species, and their designation requires member states to take measures to conserve and manage these areas effectively. The Habitats Directive requires that SACs are managed in a way that maintains or restores their natural habitats and species, and that any plans or projects that may have an impact on these areas are subject to a rigorous assessment of their potential environmental impact.

In the UK, there are currently over 600 SACs, covering a variety of habitats such as woodlands, heathlands, grasslands, and wetlands, as well as marine habitats such as reefs, sandbanks, and estuaries. These sites are home to a wide range of rare and threatened species, such as otters, water voles, dormice, bats, birds of prey, and a variety of invertebrates, plants and fungi.

The management of SACs in the UK is carried out by a range of organizations, including government bodies, conservation organizations, landowners, and local communities. Management measures may include habitat restoration, monitoring and research, access management, and control of invasive species and other threats to biodiversity.
<!-- /#landuse-SAC -->

<!-- #landuse-scheduledmonuments -->
####Scheduled monuments
  Scheduled monuments are archaeological or historic sites that are of national importance and are protected by law in the UK. They are designated under the Ancient Monuments and Archaeological Areas Act 1979 and are managed by Historic England, Cadw, Historic Environment Scotland, or the Northern Ireland Environment Agency.

The designation of scheduled monuments is based on the archaeological or historical significance of the site, and their inclusion on the schedule affords them legal protection against damage, destruction or inappropriate development. The sites may include prehistoric standing stones, burial mounds, hillforts, Roman forts and villas, medieval castles, churches and monasteries, and industrial sites.

The designation of a scheduled monument provides for public access to the site, subject to any restrictions necessary for the protection of the monument. Scheduled monuments are also subject to controls on any works or development that may affect the monument, and a consent process is required before any works can be undertaken.

The management of scheduled monuments is the responsibility of the relevant heritage agency, who work with owners and other stakeholders to ensure that the monument is protected, conserved and interpreted for the benefit of future generations. Management measures may include conservation work, research, and interpretation, as well as education and community engagement programs.
<!-- /#landuse-scheduledmonuments -->

<!-- #landuse-SPA -->
####SPA
  Special Protection Areas (SPAs) are areas designated under the European Union's Birds Directive, with the aim of protecting and conserving important habitats for birds. SPAs are part of a wider network of protected areas known as Natura 2000, which includes both SPAs and Special Areas of Conservation (SACs) for other habitats and species.

SPAs are designated based on scientific criteria, such as the presence of rare or threatened bird species or important breeding or wintering habitats. The designation requires member states to take measures to protect these areas and ensure that any plans or projects that may have an impact on them are subject to a rigorous assessment of their potential environmental impact.

In the UK, there are currently over 260 SPAs, covering a variety of habitats such as coastal and estuarine areas, wetlands, and uplands. These sites are home to a wide range of bird species, such as seabirds, waders, wildfowl, and raptors, and some sites are of international importance, supporting populations of rare or threatened species.

The management of SPAs in the UK is carried out by a range of organizations, including government bodies, conservation organizations, landowners, and local communities. Management measures may include habitat restoration, monitoring and research, access management, and control of disturbance and other threats to bird populations.
<!-- /#landuse-SPA -->

<!-- #landuse-SSSI -->
####SSSI
  Sites of Special Scientific Interest (SSSIs) are areas designated under UK legislation as being of special interest due to their unique flora, fauna, or geological features. They are designated by the relevant nature conservation body in each country, such as Natural England, Scottish Natural Heritage, or the Countryside Council for Wales.

SSSIs cover a range of habitats, including heathland, grassland, woodland, coastal habitats, and wetlands. They may be important for a particular species or group of species, or for their geology, landform or soils. Many sites are also designated for their ecological or geological processes, such as sand dune formation, peat accumulation, or the geological history of an area.

The designation of an SSSI provides legal protection for the site and its features, and requires landowners and managers to manage the site in a way that protects its special interest. Planning authorities must also take into account the conservation of SSSIs when making planning decisions.

The management of SSSIs is the responsibility of the relevant nature conservation body, who work with landowners and other stakeholders to ensure that the site is conserved and managed appropriately. Management measures may include habitat restoration, monitoring and research, access management, and control of invasive species and other threats to the site.

SSSIs are an important part of the UK's natural heritage, providing habitats for a wide range of species and contributing to the wider ecological and environmental health of the country. Many sites are also important for their recreational and educational value, and are open to the public for enjoyment and learning.
<!-- /#landuse-SSSI -->

<!-- #landuse-worldheritagesite -->
####World Heritage Sites
  World Heritage Sites are places of significant cultural, historical, or natural importance that are recognized by the United Nations Educational, Scientific and Cultural Organization (UNESCO) as being of universal value to humanity. They are considered to be among the most important and irreplaceable sites on the planet and are protected by international treaties.

There are currently over 1,100 World Heritage Sites in more than 160 countries, which are chosen for their outstanding universal value, authenticity, and integrity. These sites include natural wonders, cultural landmarks, and historic monuments.

To be considered for World Heritage status, a site must meet one or more of the ten criteria established by UNESCO, which include cultural and natural significance, as well as aesthetic and historical value. Sites must also have adequate protection and management plans in place to ensure their preservation.

Once a site is designated as a World Heritage Site, it becomes part of a global network of protected areas and is eligible for funding and support from UNESCO and other international organizations. The management and conservation of World Heritage Sites is typically the responsibility of the government or other authority in charge of the site.

World Heritage Sites are an important part of the world's cultural and natural heritage, and are recognized as being of universal value to all humanity. They serve as a reminder of the achievements of past civilizations, the wonders of nature, and the need to protect and preserve our shared cultural and natural heritage for future generations.
<!-- /#landuse-worldheritagesite -->

<!-- #landuse-food_hygiene -->
#### Food Hygiene Ratings

A 2023 extract of the [Food Standards Agency hygiene ratings](https://ratings.food.gov.uk/). Click on a dot to see the business name and type.
<!-- /#landuse-food_hygiene -->

## Land Ownership Explorer

### Introduction
It is hard to discuss issues around place without eventually coming to the topic of land ownership. Land owners through a combination of action and inaction sculpted the country into what it is today, ultimately they decide where the homes and jobs are, what it farmland and where is left for nature. Despite their enormous power, land ownership is not democratically allocated, a small elite own a large proportion of the land in the UK, and data about who owns what is often hard to come by.

The Land Ownership Explorer is intended to cast a little light onto the issue of land ownership by providing a more accessible form of official Land Registry datasets.

### Map Layers

<!-- #landownership-inspire -->
#### INSPIRE Polygons

The INSPIRE polygons area created by the Land Registry for England and Wales show all the freehold land in England and Wales. They are published as Open Data with a few conditions. Unfortunately the Land Registry do not provide a easy service to view the INSPIRE data.

This layer shows a cleaned 2022 snapshot of the INSPRIRE Polygons. Land registry maps are often digitised versions of old paper maps. Therefore the titles are often split into grids where a property crosses the boundary of one paper map to another. An automated method was used to rejoin split polygons to give a clearer overview of large landowners. The process is not perfect and some square titles remain. Also some polygons have been merged, some INSPIRE IDs are missing. For merged polygons they have been given one of the INSPIRE IDs from the unmerged polygons, but which one they get is essentially random.

![Grid Detection](/images/manual/grid_detection.JPG)
*An example of the cleaning process: Polygon boarders aligned with the grid have been detected and highlighted in red.
While this is not perfect, the INSPIRE Polygon data is very messy, it does help clean up the data and make it clearer where large titles are.*

Due to the large side of the dataset it is not possible to show every land title in the country simultaneously. Thus only the large polygons are shown when zoomed out.

![INSPIRE zoomed out](/images/manual/inspire_out.JPG)
*When zoomed out only the largest polygons are shown*

![INSPIRE zoomed in](/images/manual/inspire_in.JPG)
*Zoom in a little and you can see all the polygons*

Note that not all land is registered so there are gaps in the map. Registration became compulsory in 1990 and is only required when land is sold, so around 14% of land in England and Wales is still unregistered.

You can also click on the polygons so see the INSPIRE ID which can be used to purchase the full title the Local Authority name and the area in square metres.
<!-- /#landownership-inspire -->

<!-- #landownership-points -->
#### Property ownend by UK and overseas companies

The Land Registry publishes two open datasets that explicitly name the owners of the land. The [UK companies that own property in England and Wales](https://use-land-property-data.service.gov.uk/datasets/ccod) and the [Overseas companies that own property in England and Wales](https://use-land-property-data.service.gov.uk/datasets/ocod). 

*The data in this tool is based on a 2022 snapshot of the published data and may be out of date.*

These datasets provide a lot of information about land ownership, but the format is difficult to understand. Mainly because it is not provided on a map. The main purpose of the Land Ownership Explorer is to map these two datasets by geocoding the addresses. Geocoding is the process of turning text addresses into latitude/longitude coordinates that can be plotted on a map. 

Some of the land registry titles are very simple, e.g.

*5 West Park, Bristol (BS8 2LX)*

This can easily be geocoded and plotted on a map. While we can't find the exact boundaries of the property we can at least put a point in the map a the address.

But consider another example:

*1-4 Crown Row, Bracknell (RG12 0TH), 3, 14, 17, 18, 21, 26, 29, 31, 45, 49, 50, 55-70, 74, 75, 77-81, 84, 85, 91-95, 101, 103, 104, 106, 110, 111 Dalcross, Bracknell (RG12 0UJ), 71-73, 76, 82, 83, 86, 87 Dalcross, Bracknell (RG12 0UL), 1, 6, 9, 11 Fencote, Bracknell (RG12 0TD), 6, 8, 9, 12, 19, 22, 25, 47, 50 Garswood, Bracknell (RG12 0TY), 52, 60, 61, 65, 67, 80 Garswood, Bracknell (RG12 0TZ), 2, 10, 14, 16, 18, 36, 40, 42-44, 58-60, 72, 76, 79, 80 Helmsdale, Bracknell (RG12 0TA), 12, 13, 15, 45, 64-67, 82, 86, 87, 96, 97-99, 108, 112-115, 118, 126, 129, 138 Helmsdale, Bracknell (RG12 0TB), 1, 6, 11, 15, 23, 24, 28, 32, 33, 42-51, 67, 68, 72, 79, 80 Keepers Coombe, Bracknell (RG12 0TW, 10, 12-14, 21, 22, 25-27, 29-31, 34-36, 41 Keepers Coombe, Bracknell (RG12 0TN), 1-9, 21, 22, 26, 27, 31, 32 Kimmeridge, Bracknell (RG12 0UD), 86, 89-93(odd), 94, 100, 102, 107, 122, 125 Leaves Green, Bracknell, (RG12 0TE), 1-6, 8-10, 13-26, 33, 34, 48-50, 54, 58, 59, 63-80 Leaves Green, Bracknell (RG1*


In this case a single dot on the map does not clearly convey the extent of this land ownership. But it is possible to parse this into 233 unique addresses that the text refers to. In this case, I expect that the title covers even more addresses as there are several titles that cut off mid-postcode at 999 characters, which suggests they have been truncated at some point. Nevertheless identifying the knowable 233 addresses helps improve our understanding of land ownership even if it is incomplete.

While this kind of text parsing is never 100% successful, it is worth doing. For example, 9,034 freehold titles that contained multiple postcodes. But when they were broken up, they actually held 168,911 unique property addresses. 

Some titles are easier to work with than others. There were 1.77 million simple addresses are easy to pass through a geocoder. More complex titles came in the form of `address and associated land` in these cases removing the "and associated land" yields a simple geocodable address.

In the most complex cases, there are a lot of locations that are `land in front/behind address`. While we can't geocode the exact location easily, we can at least extract the address and geocode that. In the worst cases, we get something in the form of `land north of somewhere road` again, we can't geocode this exactly, but we should at least be able to find the relevant road. Around 1% of titles have been discarded a too complex to geocode. 

This is an imperfect process and the data is unstructured and complex, so there will be errors and missing data. The points may not be in the correct locations. For example, "the field behind 4 to 6 Privet Drive" is not the same as "4 Privet Drive, 5 Privet Drive, and 6 Privet Drive" but we can't geocode "the field behind" so the code will detect three addresses and create three points one for each house. Therefore it to best to think of the points as in the vicinity of the correct address rather than an exact location.

Other problems occur when the information the Land Registry provides is vague. For example "3 Church lane, London" there are many Church lanes in London, so it is hard to locate the correct address. The Land Registry also prove the Local Authority name so that can narrow it down a bit, but in some cases the same title will appear in multiple places on the map due to the ambiguous nature of the address.

##### Layer Options

The land ownership points can be coloured on four variables:

1. Organisation Type: The type of organisation, not that the dataset does not contain privately owned property
2. Geocoding Accuracy: The precision of the point on the map the most common option is Address (Green) which means the full address has been located but in some cases only the road, postcode, or region could be identified. These points will be futher from their correct location.
3. Country of Registration: Which country is the property owner based in.
4. Tenure: Is the property title for the freehold or leasehold?

##### Popup

![Land owners popup](/images/manual/landowners_popup.JPG)
*Click on any point to see more information*

* Title: The title number held by the Land Registry
* Tenure: Freehold or	Leasehold
* Property Address: As recorded by the Land Registry (may be multiple addresses)
* Company No: Company Number resisted with Companies House
* Country: Country of Registration
* Category: Type of organisation
* Geocoded address:	Address of the geocoded point, should match address with Land Registry but may differ if and error has occurred and the address has been misinterpreted. 
* Geocode type: The type of location that has been geocoded, e.g. Address, Road, Postcode, Region
* Proprietor: The owner as resisted with the Land Registry

<!-- /#landownership-points -->