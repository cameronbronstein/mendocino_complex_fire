// Mendocino Complex fire - view by landsat

// create a cloud mask function
function cloudMask(image) {
    // Bits 3 and 5 are cloud shadow and cloud, respectively.
    var cloudShadowBitMask = (1 << 3);
    var cloudsBitMask = (1 << 5);
    // Get the pixel QA band.
    var qa = image.select('pixel_qa');
    // Both flags should be set to zero, indicating clear conditions.
    var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
                   .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
    return image.updateMask(mask);
  }
  
  // Pre- and Post-Fire image collections
  var pre_fire = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR")
        .filterBounds(geometry)
        .filterDate('2018-04-01', '2018-05-31')
        .map(cloudMask)
        .median();
  
  var regen = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR")
        .filterBounds(geometry)
        .filterDate('2019-04-01', '2019-05-31')
        .map(cloudMask)
        .median();
  
  // true color parameters
  var vis_param = {bands: ['B4', 'B3', 'B2'], 
                   min: 0, max: 2000};
                   
  // NDVI calculation
  var pre_ndvi = pre_fire.normalizedDifference(['B5', 'B4']);
  var regen_ndvi = regen.normalizedDifference(['B5', 'B4']);
  
  // ndvi color params
  var ndvi_param = {bands: ['nd'],
                    palette: ["blue", "white", "green"]};
  
  // NBR
  var pre_nbr = pre_fire.normalizedDifference(['B5', 'B7']);
  var regen_nbr = regen.normalizedDifference(['B5', 'B7']);
  var burnSeverity = pre_nbr.subtract(regen_nbr); 
  
  
  var burn_param = {bands: ['nd'], 
                    palette: ["red", "orange", "yellow", "green"]};
  
  // Pre-Fire layers
  Map.addLayer(pre_nbr.clip(geometry3), burn_param, 'Pre-Fire NBR');
  Map.addLayer(pre_ndvi.clip(geometry3), ndvi_param, 'Pre-Fire NDVI');
  Map.addLayer(pre_fire.clip(geometry3), vis_param, 'Pre-Fire Color');
  
  // creating the linked Map
  var linkedMap = ui.Map();
  
  // Linked Map layers
  linkedMap.addLayer(burnSeverity.clip(geometry3), {palette: ['white', 'black']}, 'Burn Severity Index');
  linkedMap.addLayer(regen_nbr.clip(geometry3), burn_param, 'Regen NBR');
  linkedMap.addLayer(regen_ndvi.clip(geometry3), ndvi_param, 'Regen NDVI');
  linkedMap.addLayer(regen.clip(geometry3), vis_param, 'Spring 2019 regeneration');
  
  // Link the default Map to the other map.
  var linker = ui.Map.Linker([ui.root.widgets().get(0), linkedMap]);
  
  // Create a SplitPanel which holds the linked maps side-by-side.
  var splitPanel = ui.SplitPanel({
    firstPanel: linker.get(0),
    secondPanel: linker.get(1),
    orientation: 'horizontal',
    wipe: true,
    style: {stretch: 'both'}
  });
  
  // Set the SplitPanel as the only thing in root.
  ui.root.widgets().reset([splitPanel]);
  Map.setCenter(-122.9139, 39.2046, 9.5);
  linkedMap.setCenter(-122.9139, 39.2046, 9.5);
  
  var title = 'Thanks for visiting my Mendocino Complex Fire Web-App. For best results, toggle and match up the composite layers for each panel. Layers are true color composite, NDVI, Normalized Burn Ratio, and Burn Severity Index (ΔNBR). To read more about the project, click the "More info" button!';
  var title_label = ui.Label(title);
  title_label.style().set(
    {position: "bottom-left",
     fontSize: "14px",
     padding: "10px",
     width: "190px"});
     
  var preFire_label = ui.Label('Pre-Fire Spring: April 1 - May 31, 2018');
  preFire_label.style().set(
    {position: "top-center",
     fontSize: "16px"});
  
  var postFire_label = ui.Label('Post-Fire Spring: April 1 - May 31, 2019');
  postFire_label.style().set(
    {position: "top-center",
     fontSize: "16px"});
  
  var moreInfo = ui.Label("More info...");
  moreInfo.style().set("position", "bottom-left");
  moreInfo.setUrl("https://medium.com/@cambostein/visualizing-the-mendocino-complex-fire-with-google-earth-engine-a5df0823e02c");
  
  // add the buttons to the Map
  Map.add(title_label);
  Map.add(moreInfo);
  Map.add(preFire_label);
  linkedMap.add(postFire_label);
  