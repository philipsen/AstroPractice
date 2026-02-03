
export interface ObservationEntity {
  id: number;
  groupId: number;
  created: Date;

  angle: number;
  delay: number;
  indexError: number;
  observerAltitude: number;
  limbType: number; // enum value, see constants/enums
  horizon: number;  // enum value, see constants/enums
  object: string;
  latitude: number;
  longitude: number;
}
