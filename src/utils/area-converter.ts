import type {Area, MapData} from '@/stores/schemas';
import {
  datumToRelative,
  pointsToAbsolute,
  pointToAbsolute,
  type RelativePoint,
  type UtmPoint,
} from '@/utils/coordinates';
import type {Feature, FeatureCollection, Point, Polygon} from 'geojson';

interface AreaProps {
  name: string;
  type: 'working_area' | 'navigation_area';
}

function areaToFeature(
  type: 'working_area' | 'navigation_area',
  area: Area,
  datum: UtmPoint,
): Feature<Polygon, AreaProps> {
  return {
    type: 'Feature',
    properties: {
      name: area.name,
      type: type,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [pointsToAbsolute(area.outline, datum)],
    },
  };
}

function pointToFeature(type: string, point: RelativePoint, datum: UtmPoint): Feature<Point> {
  return {
    type: 'Feature',
    properties: {
      type: type,
    },
    geometry: {
      type: 'Point',
      coordinates: pointToAbsolute(point, datum),
    },
  };
}

function convertDatum(map: MapData) {
  const {lat, long} = map.datum!;
  return datumToRelative([long, lat]);
}

export function mapToFeatures(map: MapData): FeatureCollection {
  if (!map.datum) {
    return {type: 'FeatureCollection', features: []};
  }
  const datum = convertDatum(map);
  return {
    type: 'FeatureCollection',
    features: [
      ...(map.docking_pose ? [pointToFeature('docking_pose', map.docking_pose, datum)] : []),
      ...(map.working_areas?.map((area) => areaToFeature('working_area', area, datum)) ?? []),
      ...(map.navigation_areas?.map((area) => areaToFeature('navigation_area', area, datum)) ?? []),
    ],
  };
}
