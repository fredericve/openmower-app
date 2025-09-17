'use client';

import {useMapboxDraw, useMapContext, useMapSelection} from '@/contexts/MapContext';
import {MapData, type AreaProps} from '@/stores/schemas';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import {Box, Dialog, useMediaQuery, useTheme, type SxProps} from '@mui/material';
import bbox from '@turf/bbox';
import type {Feature, Polygon} from 'geojson';
import {
  CircleXIcon,
  LayoutListIcon,
  PencilIcon,
  PencilLineIcon,
  SaveIcon,
  ScissorsLineDashedIcon,
  Settings2Icon,
  SquaresIntersectIcon,
  SquaresSubtractIcon,
  SquaresUniteIcon,
  Trash2Icon,
} from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {RFullscreenControl, RMap} from 'maplibre-react-components';
import {useMemo, useState} from 'react';
import {AreaSettingsDialog} from './AreaSettingsDialog';
import AreasList from './AreasList';
import ControlButton from './ControlButton';
import {DrawControl} from './DrawControl';
import {drawStyles} from './drawStyles';
import {FitToBoundsControl} from './FitBoundsControl';
import {mapStyles} from './mapStyles';
import {ToggleStyleControl} from './ToggleStyleControl';
import type {BBox} from './types';

interface MowerMapProps {
  mapData: MapData;
  sx: SxProps;
}

export function MowerMap({mapData, sx}: MowerMapProps) {
  const {id, editMode, setEditMode, features, drawMode, trashEnabled} = useMapContext();
  const draw = useMapboxDraw();
  const selectedIds = useMapSelection();
  const isDrawing = drawMode === MapboxDraw.constants.modes.DRAW_POLYGON;
  const areas = useMemo(
    () => features.features.filter((feature) => feature.geometry.type === 'Polygon') as Feature<Polygon, AreaProps>[],
    [features],
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showAreaList, setShowAreaList] = useState(!isMobile);
  const [showSettings, setShowSettings] = useState(false);
  const [styleName, setStyleName] = useState<keyof typeof mapStyles>('white');
  const style = mapStyles[styleName];
  const toggleStyle = () => {
    setStyleName((prev) => (prev === 'white' ? 'satellite' : 'white'));
  };

  const bounds = useMemo(() => {
    if (features.features.length > 0) {
      return bbox(features) as BBox;
    } else {
      const {long, lat} = mapData.datum ?? {lat: 48.0, long: 11.0};
      return [long, lat, long, lat] as BBox;
    }
  }, [features, mapData.datum]);

  return (
    <Box sx={{...sx, overflow: 'hidden', position: 'relative'}}>
      <RMap
        key={id}
        // key={id + JSON.stringify(drawStyles)}
        id={id}
        style={{width: '100%', height: '100%'}}
        mapStyle={style}
        initialAttributionControl={false}
        maxZoom={24}
        initialBounds={bounds}
      >
        <RFullscreenControl />
        <FitToBoundsControl bounds={bounds} extraRightPadding={!isMobile && showAreaList ? 460 : 0} />
        <ToggleStyleControl onClick={toggleStyle} />
        <DrawControl
          displayControlsDefault={false}
          styles={drawStyles}
          modes={{
            ...MapboxDraw.modes,
            static: StaticMode,
          }}
          // styles={[...splitPolygonDrawStyles(MapboxDraw.lib.theme)]}
          defaultMode={editMode ? 'simple_select' : 'static'}
          userProperties={true}
          onFeaturesCreated={() => setShowSettings(true)}
        />
        {editMode ? (
          <>
            <ControlButton
              position="top-left"
              icon={SaveIcon}
              title="Save"
              style={{color: theme.palette.success.main}}
              onClick={() => setEditMode(false)}
            />
            <ControlButton
              position="top-left"
              icon={CircleXIcon}
              title="Cancel"
              style={{color: theme.palette.error.main}}
              onClick={() => setEditMode(false)}
            />
            <ControlButton
              position="top-left"
              icon={Settings2Icon}
              title="Settings"
              active={showSettings}
              disabled={selectedIds.length != 1}
              onClick={() => setShowSettings(true)}
              spaced={true}
            />
            <ControlButton
              position="top-left"
              icon={Trash2Icon}
              title="Delete"
              disabled={!trashEnabled || isDrawing}
              onClick={() => {
                draw?.trash();
              }}
            />
            <ControlButton
              position="top-left"
              icon={PencilLineIcon}
              title="Draw new area"
              active={isDrawing}
              onClick={() => {
                if (isDrawing) {
                  draw?.trash();
                } else {
                  draw?.changeMode(MapboxDraw.constants.modes.DRAW_POLYGON);
                }
              }}
            />
            <ControlButton spaced={true} position="top-left" icon={SquaresUniteIcon} title="Merge" onClick={() => {}} />
            <ControlButton position="top-left" icon={SquaresSubtractIcon} title="Call Split" onClick={() => {}} />
            <ControlButton
              position="top-left"
              icon={SquaresIntersectIcon}
              title="Remove overlapping areas"
              onClick={() => {}}
            />
            <ControlButton position="top-left" icon={ScissorsLineDashedIcon} title="Split area" onClick={() => {}} />{' '}
          </>
        ) : (
          <>
            <ControlButton position="top-left" icon={PencilIcon} title="Edit mode" onClick={() => setEditMode(true)} />
          </>
        )}
        <ControlButton
          position="top-right"
          icon={LayoutListIcon}
          title="Show area list"
          active={showAreaList}
          onClick={() => setShowAreaList(!showAreaList)}
        />
        {!isMobile && showAreaList && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 60,
              bottom: 10,
              width: '400px',
            }}
          >
            <AreasList areas={areas} />
          </Box>
        )}
        {isMobile && (
          <Dialog
            open={showAreaList}
            onClose={() => setShowAreaList(false)}
            disablePortal
            slotProps={{
              paper: {
                sx: {
                  margin: 0,
                  width: 'calc(100% - 3rem)',
                  height: 'calc(100% - 3rem)',
                  maxWidth: 'none',
                  maxHeight: 'none',
                },
              },
            }}
          >
            <AreasList areas={areas} />
          </Dialog>
        )}
        <AreaSettingsDialog open={showSettings} onClose={() => setShowSettings(false)} />
      </RMap>
    </Box>
  );
}
