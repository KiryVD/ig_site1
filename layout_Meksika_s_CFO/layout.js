const extent = [-5.84588, -1.485, 26.8984, 31.2593];
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



