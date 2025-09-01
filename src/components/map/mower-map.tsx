'use client';

import type {MapData, State} from '@/stores/schemas';
import {mapToFeatures} from '@/utils/area-converter';
import MapboxDraw, {type MapboxDrawOptions} from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import {CenterFocusStrong as FitBoundsIcon, Layers as LayersIcon} from '@mui/icons-material';
import {Box, useTheme} from '@mui/material';
import bbox from '@turf/bbox';
import type {ControlPosition} from 'maplibre-gl';
import {Map} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {RFullscreenControl, RMap, RSource, useControl, useMap, useRControl} from 'maplibre-react-components';
import {useCallback, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import MapLayers from './MapLayers';
import {mapStyles} from './mapStyles';

type BBox = [minLng: number, minLat: number, maxLng: number, maxLat: number];

interface MowerMapProps {
  mapData: MapData;
  mowerState: State;
  width?: string | number;
  height?: string | number;
}

// Map style configurations

export function MowerMap({mapData, mowerState, width = '100%', height = '400px'}: MowerMapProps) {
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

  function FitToBoundsControl({position = 'top-right', bounds}: {position?: ControlPosition; bounds: BBox}) {
    const {container} = useRControl({position});
    const map = useMap();
    const onClick = useCallback(() => {
      map.fitBounds(bounds, {padding: 10});
    }, [bounds, map]);
    return createPortal(
      <button type="button" aria-hidden="true" onClick={onClick}>
        <FitBoundsIcon />
      </button>,
      container,
    );
  }

  function DrawControl({position = 'top-left', ...props}: MapboxDrawOptions & {position?: ControlPosition}) {
    const constants = MapboxDraw.constants.classes as Record<string, string>;
    constants.CONTROL_BASE = 'maplibregl-ctrl';
    constants.CONTROL_PREFIX = 'maplibregl-ctrl-';
    constants.CONTROL_GROUP = 'maplibregl-ctrl-group';
    useControl({
      position,
      factory: () => new MapboxDraw(props),
    });
    return null;
  }

  function ToggleMapStyleControl({position = 'top-right'}: {position?: ControlPosition}) {
    const {container} = useRControl({position});
    return createPortal(
      <button type="button" aria-hidden="true" onClick={toggleMapStyle}>
        <LayersIcon />
      </button>,
      container,
    );
  }

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
        <ToggleMapStyleControl />
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
