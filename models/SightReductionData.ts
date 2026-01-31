import { ObservationEntity } from "./ObservationEntity";
import { ReductionCorrections } from "./ReductionCorrections";

export interface SightReductionData {
  observation: ObservationEntity;
  reduction: ReductionCorrections;

  realPosition: boolean;
  setRealPosition: (value: boolean) => void;
}
