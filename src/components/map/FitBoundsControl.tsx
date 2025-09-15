import {FocusIcon} from 'lucide-react';
import type {ControlPosition} from 'maplibre-gl';
import {useMap, useRControl} from 'maplibre-react-components';
import {useCallback} from 'react';
import {createPortal} from 'react-dom';
import type {BBox} from './types';

export function FitToBoundsControl({
  position = 'top-right',
  bounds,
  extraRightPadding = 0,
}: {
  position?: ControlPosition;
  bounds: BBox;
  extraRightPadding?: number;
}) {
  const {container} = useRControl({position});
  const map = useMap();
  const onClick = useCallback(() => {
    map.fitBounds(bounds, {padding: {top: 10, right: 10 + extraRightPadding, bottom: 10, left: 10}, duration: 1000});
  }, [bounds, map, extraRightPadding]);
  return createPortal(
    <button type="button" aria-hidden="true" onClick={onClick}>
      <FocusIcon />
    </button>,
    container,
  );
}
