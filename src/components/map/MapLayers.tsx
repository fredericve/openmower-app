import type {Theme} from '@mui/material';
import {RLayer} from 'maplibre-react-components';

export default function MapLayers({theme}: {theme: Theme}) {
  return (
    <>
      <RLayer
        id="working-areas-fill"
        type="fill"
        source="features"
        paint={{
          'fill-color': theme.palette.success.main,
          'fill-opacity': 0.3,
        }}
        filter={['==', ['get', 'type'], 'working_area']}
      />
      <RLayer
        id="working-areas-stroke"
        type="line"
        source="features"
        paint={{
          'line-color': theme.palette.success.main,
          'line-width': 2,
        }}
        filter={['==', ['get', 'type'], 'working_area']}
      />
      <RLayer
        id="navigation-areas-fill"
        type="fill"
        source="features"
        paint={{
          'fill-color': theme.palette.info.main,
          'fill-opacity': 0.2,
        }}
        filter={['==', ['get', 'type'], 'navigation_area']}
      />
      <RLayer
        id="navigation-areas-stroke"
        type="line"
        source="features"
        paint={{
          'line-color': theme.palette.info.main,
          'line-width': 1,
          'line-dasharray': [2, 2],
        }}
        filter={['==', ['get', 'type'], 'navigation_area']}
      />
    </>
  );
}
