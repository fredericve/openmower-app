import * as utm from 'utm';

export type RelativePoint = {x: number; y: number};
export type AbsolutePoint = [longitude: number, latitude: number];
export type UtmPoint = ReturnType<typeof utm.fromLatLon>;

export function datumToRelative(absolute: AbsolutePoint): UtmPoint {
  return utm.fromLatLon(absolute[1], absolute[0]);
}

export function pointToAbsolute(point: RelativePoint, datum: UtmPoint): AbsolutePoint {
  const {latitude, longitude} = utm.toLatLon(
    datum.easting + point.x,
    datum.northing + point.y,
    datum.zoneNum,
    datum.zoneLetter,
  );
  return [longitude, latitude];
}

export function pointToRelative(point: AbsolutePoint, datum: UtmPoint): RelativePoint {
  const utmPoint = utm.fromLatLon(point[1], point[0], datum.zoneNum);
  return {x: utmPoint.easting - datum.easting, y: utmPoint.northing - datum.northing};
}

export function pointsToAbsolute(points: RelativePoint[], datum: UtmPoint): AbsolutePoint[] {
  return points.map((point) => pointToAbsolute(point, datum));
}

export function pointsToRelative(points: AbsolutePoint[], datum: UtmPoint): RelativePoint[] {
  return points.map((point) => pointToRelative(point, datum));
}
