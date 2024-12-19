function w3_side_bar_open() 
{
  document.getElementById("main_form").style.marginRight = "50%";
  document.getElementById("side_bar").style.width = "50%";
  document.getElementById("side_bar").style.display = "block";
  document.getElementById("open_side_bar").style.display = 'none';
}
function w3_side_bar_close() 
{
  document.getElementById("main_form").style.marginRight = "0%";
  document.getElementById("side_bar").style.display = "none";
  document.getElementById("open_side_bar").style.display = "inline-block";
}
function w3_open_tab_page(page_name) 
{
  var i;
  var x = document.getElementsByClassName("tab_pages");
  for (i = 0; i < x.length; i++) 
  {
    x[i].style.display = "none";
  }
  document.getElementById(page_name).style.display = "block";
}

const extent = {$EXTENT$};
const projection = new ol.proj.Projection({
  code: 'integro-image',
  units: 'pixels',
  extent: extent,
});

var tileIgSource = new ol.source.XYZ(
{
  url: './{z}/{x}/{y}.png',
  maxZoom: 8,
  tileSize: 256,
  projection: projection,
});


const map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: tileIgSource,
    }),
  ],
  target: 'map',
  view: new ol.View({
    projection: projection,
    center: ol.extent.getCenter(extent),
    zoom: 2,
    maxZoom: 8,
  }),
});

const geomPgn = 0;
const geomPln = 1;
const geomPnt = 2;

const jsonLayerFilePgn = './pgn.geojson';
const jsonLayerFilePln = './pln.geojson';
const jsonLayerFilePnt = './pnt.geojson';

var jsonLayerFile = [jsonLayerFilePgn,
                     jsonLayerFilePln,
                     jsonLayerFilePnt];

var styleEmpty = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 6,
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 255, 0.0)',
    }),
  }),
  fill: new ol.style.Fill({
    color: 'rgba(255, 255, 255, 0.0)',
  }),
  stroke: new ol.style.Stroke({
    color: 'rgba(0, 255, 0, 0.01)',
    width: 3,
  }),
/*
  text: new ol.style.Text({
    font: '12px Calibri,sans-serif',
    fill: new ol.style.Fill({
      color: '#000',
    }),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 3,
    }),
  }),
*/
});

var stylePnt = styleEmpty;
var stylePln = styleEmpty;
var stylePgn = styleEmpty;

var styles = [stylePgn,
              stylePln,
              stylePnt];

function MakeLayer(geomType)
{
  var geo_obj = null;
  switch (geomType)
  {
    case geomPgn:
      if (typeof pgn_objs != "undefined")
        geo_obj = pgn_objs;
    break;  
    case geomPln:
      if (typeof pln_objs != "undefined")
        geo_obj = pln_objs;
    break;  
    case geomPnt:
      if (typeof pnt_objs != "undefined")
        geo_obj = pnt_objs;
    break;  
  }
  var jsonSource = null;
  if (!geo_obj)
  { 
    jsonSource = new ol.source.Vector({
      url: jsonLayerFile[geomType],
      format: new ol.format.GeoJSON(),
      projection: projection,
    });
  }
  else
  {
    jsonSource = new ol.source.Vector({
      features: new ol.format.GeoJSON().readFeatures(geo_obj),
      projection: projection,
    });
  } 
  var jsonLayer = new ol.layer.Vector({
    source: jsonSource,
    style: function (feature) {
      var name = feature.get('WP_NAME');
      if (!name)
        name = '';
      var txt = styles[geomType].getText();
      if (txt)
        txt.setText(name.trim());
      return styles[geomType];
    }
  });
  map.getLayers().push(jsonLayer);
  return jsonLayer;
}

var jsonLayerPgn = MakeLayer(geomPgn);
var jsonLayerPln = MakeLayer(geomPln);
var jsonLayerPnt = MakeLayer(geomPnt);

var highlightStylePnt = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 7,
    fill: new ol.style.Fill({
      color: 'rgba(255, 0, 0, 1.0)',
    }),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 2,
    }),
  }),
  text: new ol.style.Text({
    font: '12px Calibri,sans-serif',
    fill: new ol.style.Fill({
      color: '#000',
    }),
    stroke: new ol.style.Stroke({
      color: '#f00',
      width: 3,
    }),
    offsetY: -10,
  }),
});


var highlightStylePln = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: '#f00',
    width: 4,
  }),
  text: new ol.style.Text({
    font: '12px Calibri,sans-serif',
    fill: new ol.style.Fill({
      color: '#000',
    }),
    stroke: new ol.style.Stroke({
      color: '#f00',
      width: 3,
    }),
  }),
});

var highlightStylePgn = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 7,
    fill: new ol.style.Fill({
      color: 'rgba(255, 0, 0, 1.0)',
    }),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 2,
    }),
  }),
  stroke: new ol.style.Stroke({
    color: '#f00',
    width: 2,
  }),
  fill: new ol.style.Fill({
    color: 'rgba(255,0,0,0.2)',
  }),
  text: new ol.style.Text({
    font: '12px Calibri,sans-serif',
    fill: new ol.style.Fill({
      color: '#000',
    }),
    stroke: new ol.style.Stroke({
      color: '#f00',
      width: 3,
    }),
  }),
});

var featureOverlay = new ol.layer.Vector({
  source: new ol.source.Vector(),
  map: map,
  style: function (feature) {
    var highlightStyle = highlightStylePgn;
    var featureGeomType = feature.getGeometry().getType();
    if ((featureGeomType == 'Point') || 
        (featureGeomType == 'MultiPoint')) {
      highlightStyle = highlightStylePnt;
    }     
    if ((featureGeomType == 'LineString') ||
        (featureGeomType == 'MultiLineString')) {
      highlightStyle = highlightStylePln;
    }
    if ((featureGeomType == 'LinearRing') ||  
        (featureGeomType == 'Polygon') || 
        (featureGeomType == 'Circle') ||  
        (featureGeomType == 'MultiPolygon') |
        (featureGeomType == 'GeometryCollection'))
    {     
      highlightStyle = highlightStylePgn;
    } // if
    if (highlightStyle)
    {
      var name = feature.get('WP_NAME');
      if (!name)
        name = '';
      var txt = highlightStyle.getText();
      if (txt)
        txt.setText(name.trim());
    }
    return highlightStyle;
  },
});

function layerFilterPnt(layer) {
  return (layer === jsonLayerPnt);
}
function layerFilterPln(layer) {
  return (layer === jsonLayerPln);
}
function layerFilterPgn(layer) {
  return (layer === jsonLayerPgn);
}
function openInNewTab(feature) {
  var web_ref = feature.get('WP_HTML');
  if (web_ref)
  {
    web_ref.trim();
    var win = window.open(web_ref, '_blank');
    win.focus();
  } 
}
function retFeature(feature)
{
  return feature;
}

function featureToTable(feature)
{
  var s = '&nbsp;';
  if (feature)
  {
    s = '';
    s += '<table class="w3-table-all w3-small">';
    var keys = feature.getProperties();
    for(var key in keys)
    {
      if (key == 'geometry')
        continue;
      s += '<tr>';
      s += '<td>';
      s += key;
      s += '</td>';
      s += '<td>';
      if (key == 'WP_HTML') {
        var val = feature.get(key);
        var s_add = '<a href="' + val + '" target="_blank">' + val + '</a>';
        s += s_add;
      } else {
        s += feature.get(key);
      }
      s += '</td>';
      s += '</tr>';
    }    
    s += '</table>';
  }
  return s;
}


var highlight;
function displayFeatureInfo(pixel, clicked) {
  var feature = null;
  if (!feature)
    feature = map.forEachFeatureAtPixel(pixel, retFeature, {layerFilter : layerFilterPnt});
  if (!feature) 
    feature = map.forEachFeatureAtPixel(pixel, retFeature, {layerFilter : layerFilterPln});
  if (!feature) 
    feature = map.forEachFeatureAtPixel(pixel, retFeature, {layerFilter : layerFilterPgn});
  if (feature !== highlight) {
    if (highlight) {
      featureOverlay.getSource().removeFeature(highlight);
    }
    if (feature) {
      featureOverlay.getSource().addFeature(feature);
    }
    highlight = feature;
  }

  const info = document.getElementById('obj_info');
  info.innerHTML = featureToTable(feature);
  
  if (clicked)
  {
    if (feature) {
//      openInNewTab(feature);
      const info_modal = document.getElementById('obj_modal_info');
      info_modal.innerHTML = featureToTable(feature);
      document.getElementById('obj_modal_form').style.display='block';
    } 
  }
 
};

map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel, false);
});

map.on('click', function (evt) {
  displayFeatureInfo(evt.pixel, true);
});



