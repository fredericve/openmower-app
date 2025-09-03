export const mapStyles = {
  white: {
    version: 8 as const,
    name: 'White',
    sources: {},
    layers: [
      {
        id: 'background',
        type: 'background' as const,
        paint: {
          'background-color': '#121212',
        },
      },
    ],
  },
  satellite: {
    version: 8 as const,
    name: 'Satellite',
    sources: {
      'esri-satellite': {
        type: 'raster' as const,
        tiles: ['https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: 'Powered by Esri',
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: 'satellite-tiles',
        type: 'raster' as const,
        source: 'esri-satellite',
        paint: {
          'raster-fade-duration': 0,
        },
      },
    ],
  },
};
