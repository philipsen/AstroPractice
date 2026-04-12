import {
  InitialiseBODY_DATA,
  PopulateBODY_DATA_WithBodyNames,
  PopulateBODY_DATA_WithStarData,
  PopulateBODY_NAMES,
} from "../legacyBridge";

export function initialiseCatalog(): void {
  InitialiseBODY_DATA();
  PopulateBODY_NAMES();
  PopulateBODY_DATA_WithBodyNames();
  PopulateBODY_DATA_WithStarData();
}
