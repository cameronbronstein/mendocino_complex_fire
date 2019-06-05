// Mendocino Complex fire - view by landsat
// General Mendocino area geometry

// date composites
// var spring_before = ee.DateRange('2018-04-01', '2018-05-23') // spring before
// var before = ee.DateRange('2018-06-01', '2018-07-15') // June before
// var during = ee.DateRange('2018-07-27', '2018-09-17') // during
// var after = ee.DateRange('2018-09-18', '2018-10-30') // immediately after 
// var post_may = ee.DateRange('2019-04-01', '2019-05-22') // spring after

// Mendocino Complex fire - view by landsat
// General Mendocino area geometry
var collection = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR")
      .filterBounds(geometry)
      
// pre-fire date range - will take median value
var before = ee.DateRange('2018-06-01', '2018-07-15')

//post-fire date range - will take median value
var after = ee.DateRange('2018-09-18', '2018-10-30')

// ~ one year post-fire
var post_may = ee.DateRange('2019-04-22', '2019-05-22')

// Image is median values across the burn period
var pre_fire = collection.filterDate(before).median()
var post_fire = collection.filterDate(after).median()
var regen = collection.filterDate(post_may).median()

// Normalized Burn Ratio
var pre_nbr = pre_fire.normalizedDifference(['B5', 'B7'])
var post_nbr = post_fire.normalizedDifference(['B5', 'B7'])
var regen_nbr = regen.normalizedDifference(['B5', 'B7'])

// NDVI
var pre_ndvi = pre_fire.normalizedDifference(['B5', 'B4'])
var post_ndvi = post_fire.normalizedDifference(['B5', 'B4'])
var regen_ndvi = regen.normalizedDifference(['B5', 'B4'])

// true color
var vis_param = {bands: ['B4', 'B3', 'B2'], min: 0, max: 4000}
var burn_param = {bands: ['nd']}
var ndvi_param = {bands: ['nd']}

// True color layers
Map.addLayer(pre_fire, vis_param, 'Pre-Fire Color')
Map.addLayer(post_fire, vis_param, 'Post-Fire Color')
Map.addLayer(regen, vis_param, 'Spring 2019 regeneration')

// Burn ratio layers
Map.addLayer(pre_nbr, burn_param, 'Pre-Fire NBR')
Map.addLayer(post_nbr, burn_param, 'Post-Fire NBR')
Map.addLayer(regen_nbr, burn_param, 'Spring 2019 NBR')

// NDVI layers
Map.addLayer(pre_ndvi, ndvi_param, 'Pre-Fire NDVI')
Map.addLayer(post_ndvi, ndvi_param, 'Post-Fire NDVI')
Map.addLayer(regen_ndvi, ndvi_param, 'Spring 2019 NDVI')