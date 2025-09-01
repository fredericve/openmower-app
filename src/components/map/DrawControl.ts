import type {MapboxDrawOptions} from '@mapbox/mapbox-gl-draw';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type {ControlPosition} from 'maplibre-gl';
import {useControl} from 'maplibre-react-components';

export function DrawControl({position = 'top-left', ...props}: MapboxDrawOptions & {position?: ControlPosition}) {
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
