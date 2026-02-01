export interface ObservationEntity {
  id: number;
  groupId: number;
  created: Date;

  angle: number;
  delay: number;
  indexError: number;
  observerAltitude: number;
  limbType: number;
  horizon: number;
  object: string;
  latitude: number;
  longitude: number;
}