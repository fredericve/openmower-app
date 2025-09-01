'use client';

import type {MapData} from '@/stores/schemas';
import {mapToFeatures} from '@/utils/area-converter';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import {Box, useTheme} from '@mui/material';
import bbox from '@turf/bbox';
import 'maplibre-gl/dist/maplibre-gl.css';
import {RFullscreenControl, RMap, RSource} from 'maplibre-react-components';
import {useMemo, useState} from 'react';
import {DrawControl} from './DrawControl';
import {FitToBoundsControl} from './FitBoundsControl';
import MapLayers from './MapLayers';
import {mapStyles} from './mapStyles';
import {ToggleStyleControl} from './ToggleStyleControl';
import type {BBox} from './types';

interface MowerMapProps {
  mapData: MapData;
  width?: string | number;
  height?: string | number;
}

export function MowerMap({mapData, width = '100%', height = '400px'}: MowerMapProps) {
  const theme = useTheme();

  const [styleName, setStyleName] = useState<keyof typeof mapStyles>('white');
  const style = mapStyles[styleName];
  const toggleStyle = () => {
    setStyleName((prev) => (prev === 'white' ? 'satellite' : 'white'));
  };

  const features = useMemo(() => mapToFeatures(mapData), [mapData]);
  const bounds = useMemo(() => {
    if (features.features.length > 0) {
      return bbox(features) as BBox;
    } else {
      const {long, lat} = mapData.datum ?? {lat: 48.0, long: 11.0};
      return [long, lat, long, lat] as BBox;
    }
  }, [features, mapData.datum]);

  return (
    <Box sx={{width, height, borderRadius: 3, overflow: 'hidden', position: 'relative'}}>
      <RMap
        id="map"
        style={{width: '100%', height: '100%'}}
        mapStyle={style}
        initialAttributionControl={false}
        maxZoom={24}
        initialBounds={bounds}
      >
        <RFullscreenControl />
        <FitToBoundsControl bounds={bounds} />
        <ToggleStyleControl onClick={toggleStyle} />
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
