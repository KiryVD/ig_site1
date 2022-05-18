// Alias
const vtkXMLImageDataReader = vtk.IO.XML.vtkXMLImageDataReader;
const vtkXMLPolyDataReader = vtk.IO.XML.vtkXMLPolyDataReader;

const vtkActor = vtk.Rendering.Core.vtkActor;
const vtkFullScreenRenderWindow = vtk.Rendering.Misc.vtkFullScreenRenderWindow;
const vtkMapper = vtk.Rendering.Core.vtkMapper;
const vtkTexture = vtk.Rendering.Core.vtkTexture;

// Renderer
const full_screen_renderer = vtkFullScreenRenderWindow.newInstance();
const renderer = full_screen_renderer.getRenderer();
const render_window = full_screen_renderer.getRenderWindow();

var polydata_urls = ['data/rift.vtp', 'data/bitum.vtp', 'data/horiz.vtp'];
var texture_urls = ['data/rift.vti', 'data/bitum.vti', 'data/horiz.vti'];

for (let i = 0; i < polydata_urls.length; ++i) {

  // Data readers
  let polydata_reader = vtkXMLPolyDataReader.newInstance();
  let texture_reader = vtkXMLImageDataReader.newInstance();

  // Polydata Mapper
  let mapper = vtkMapper.newInstance();
  mapper.setScalarVisibility(false);
  mapper.setInputConnection(polydata_reader.getOutputPort());

  // Texture
  let texture = vtkTexture.newInstance();
  texture.setInterpolate(false);
  texture.setInputConnection(texture_reader.getOutputPort());

  // Actor
  let actor = vtkActor.newInstance();
  actor.getProperty().setColor(1, 1, 1);
  actor.getProperty().setLighting(false);
  actor.setScale(1, 1, 5);
  actor.setMapper(mapper);

  polydata_reader
    .setUrl(polydata_urls[i])
    .then(() => {
      renderer.addActor(actor);
      renderer.resetCamera();
      render_window.render();

      texture_reader
        .setUrl(texture_urls[i])
        .then(() => {
          actor.addTexture(texture);
          render_window.render();
        });
    });
}

// 
//global.source = reader;
//global.mapper = mapper;
//global.actor = actor;
//global.ctfun = ctfun;
//global.ofun = ofun;
//global.renderer = renderer;
//global.renderWindow = renderWindow;