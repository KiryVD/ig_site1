// Alias
const vtkXMLImageDataReader = vtk.IO.XML.vtkXMLImageDataReader;
const vtkXMLPolyDataReader = vtk.IO.XML.vtkXMLPolyDataReader;

const vtkActor = vtk.Rendering.Core.vtkActor;
const vtkFullScreenRenderWindow = vtk.Rendering.Misc.vtkFullScreenRenderWindow;
const vtkMapper = vtk.Rendering.Core.vtkMapper;
const vtkTexture = vtk.Rendering.Core.vtkTexture;

// HTML elements
const map3d_elem = document.getElementById('map3d');
const head_elem = document.getElementById('header');
const foot_elem = document.getElementById('footer');

// Render Window
const render_view = vtkFullScreenRenderWindow.newInstance({
  rootContainer: map3d_elem,
  containerStyle: {height: '100%', width: '100%', position: 'relative', overflow: 'hidden'}});
const render_window = render_view.getRenderWindow();
  
// Renderer
const renderer = render_view.getRenderer();
renderer.setBackground(map3d_opts.scene.back_clr.r,
                       map3d_opts.scene.back_clr.g,
                       map3d_opts.scene.back_clr.b);
                       
const input_ids =
  [0,1,2];

for (let i = 0; i < input_ids.length; ++i) {

  // Data readers
  const polydata_reader = vtkXMLPolyDataReader.newInstance();
  const texture_reader = vtkXMLImageDataReader.newInstance();

  // Mapper
  const mapper = vtkMapper.newInstance();
  mapper.setScalarVisibility(false);
  mapper.setInputConnection(polydata_reader.getOutputPort());

  // Texture
  const texture = vtkTexture.newInstance();
  texture.setInterpolate(false);
  texture.setInputConnection(texture_reader.getOutputPort());

  // Actor
  const actor = vtkActor.newInstance();
  actor.getProperty().setColor(1, 1, 1);
  actor.getProperty().setLighting(false);
  actor.setScale(map3d_opts.scene.scale.x,
                 map3d_opts.scene.scale.y,
                 map3d_opts.scene.scale.z);
  actor.setMapper(mapper);

  // URLs
  const base_url = 'data/' + input_ids[i].toString()
  const polydata_url = base_url + '.vtp';
  const texture_url = base_url + '.vti';
 
  polydata_reader
    .setUrl(polydata_url)
    .then(() => {
      renderer.addActor(actor);
      renderer.resetCamera();
      render_window.render();
     
      texture_reader
        .setUrl(texture_url)
        .then(() => {
          actor.addTexture(texture);
          render_window.render();
        });
    });
}

// Resize Map3D
function init_map3d_size() {  
  const map_height = window.innerHeight - 
    head_elem.offsetHeight - foot_elem.offsetHeight - 1;
    
  map3d_elem.setAttribute('style', `height: ${map_height}px`);  
  render_view.resize();
}

window.addEventListener('load',
                        init_map3d_size);
window.addEventListener('resize',
                        init_map3d_size);
