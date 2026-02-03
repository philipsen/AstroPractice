export function CalcAssumedPosition(
  gha: number,
  latitude: number,
  longitude: number,
): [number, number] {
  // Create an assumed position by rounding to nearest degree
  // This is a common practice in celestial navigation for sight reduction
  const assumedLatitude = Math.round(latitude);
  const lha = longitude + gha;
  const assumedLongitude = Math.round(lha) - gha;
  return [assumedLatitude, assumedLongitude];
}
