export function calculateEta(
  busLat,
  busLng,
  destinationLat,
  destinationLng
) {
  const lat1 = Number(busLat);
  const lng1 = Number(busLng);
  const lat2 = Number(destinationLat);
  const lng2 = Number(destinationLng);

  if ([lat1, lng1, lat2, lng2].some(Number.isNaN)) {
    return null;
  }

  const toRadians = (value) => (value * Math.PI) / 180;

  const earthRadiusKm = 6371;

  const latitudeDifference = toRadians(lat2 - lat1);
  const longitudeDifference = toRadians(lng2 - lng1);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(longitudeDifference / 2) ** 2;

  const distanceKm =
    earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const averageSpeedKmPerHour = 22;
  const etaMinutes = Math.ceil(
    (distanceKm / averageSpeedKmPerHour) * 60
  );

  return Math.max(1, etaMinutes);
}