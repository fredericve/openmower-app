'use client';

import type {MapData, State} from '@/stores/schemas';
import {mapToFeatures} from '@/utils/area-converter';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import {Box, useTheme} from '@mui/material';
import bbox from '@turf/bbox';
import {Map} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {RFullscreenControl, RMap, RSource} from 'maplibre-react-components';
import {useMemo, useRef, useState} from 'react';
import {DrawControl} from './DrawControl';
import {FitToBoundsControl} from './FitBoundsControl';
import MapLayers from './MapLayers';
import {mapStyles} from './mapStyles';
import {ToggleMapStyleControl} from './ToggleMapStyleControl';
import type {BBox} from './types';

interface MowerMapProps {
  mapData: MapData;
  mowerState: State;
  width?: string | number;
  height?: string | number;
}

export function MowerMap({mapData, width = '100%', height = '400px'}: MowerMapProps) {
  const theme = useTheme();
  const mapRef = useRef<Map>(null);

  const features = useMemo(() => mapToFeatures(mapData), [mapData]);
  const bounds = useMemo(() => bbox(features) as BBox, [features]);

  const [mapStyle, setMapStyle] = useState('white');

  const getCurrentMapStyle = () => {
    return mapStyle === 'white' ? mapStyles.white : mapStyles[mapStyle as keyof typeof mapStyles];
  };

  const toggleMapStyle = () => {
    setMapStyle((prev) => {
      switch (prev) {
        case 'white':
          return 'satellite';
        case 'satellite':
          return 'white';
        default:
          return 'white';
      }
    });
  };

  return (
    <Box sx={{width, height, borderRadius: 3, overflow: 'hidden', position: 'relative'}}>
      <RMap
        ref={mapRef}
        style={{width: '100%', height: '100%'}}
        mapStyle={getCurrentMapStyle()}
        initialAttributionControl={false}
        maxZoom={24}
      >
        <RFullscreenControl />
        <FitToBoundsControl bounds={bounds} />
        <ToggleMapStyleControl onClick={toggleMapStyle} />
        <DrawControl
          position="top-left"
          displayControlsDefault={true}
          controls={{
            polygon: true,
            trash: true,
            uncombine_features: true,
            combine_features: true,
          }}
          // modes={{
          //   ...SelectFeatureMode(MapboxDraw.modes),
          //   ...SplitPolygonMode(MapboxDraw.modes),
          // }}
          // styles={[...splitPolygonDrawStyles(MapboxDraw.lib.theme), ...selectFeatureDrawStyles(MapboxDraw.lib.theme)]}
          defaultMode="draw_polygon"
          // onCreate={onUpdate}
          // onUpdate={onUpdate}
          // onDelete={onDelete}
          userProperties={true}
          selectHighlightColor="red"
        />
        <RSource id="features" type="geojson" data={features} />
        <MapLayers theme={theme} />
      </RMap>
    </Box>
  );
}
