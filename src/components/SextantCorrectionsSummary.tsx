 

// SextantCorrectionsSummary.tsx
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { HoeCorr } from '../helpers/astron/init';
import { formatDeg, formatMinutesAsDegMin, minutesToDeg } from '../helpers/MinutesToDeg';
import { useNightMode } from '../state/NightModeContext';
import { ObservationEntity } from '../types/ObservationEntity';
import { KVRow, KVRow3 } from './KVRow';



export type SextantCorrectionsComputed = {
  refraction: number;
  sd: number;
  parallax: number;
};

export type CorrectionsInput = {
  observation: ObservationEntity;
  corrections: SextantCorrectionsComputed;
};

export type SextantCorrectionsSummaryProps = {
  data: CorrectionsInput;
  /** Optional title override */
  title?: string;
  labelWidth?: number;   // px, default 160
};

/** Sum helper */
function sum(...vals: number[]): number {
  return vals.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
}

/** Row component: label left, value right */



export default function SextantCorrectionsSummary({
  data,
  title = 'Sextant Corrections',
  labelWidth = 100,
}: SextantCorrectionsSummaryProps) {
  const { nightMode } = useNightMode();
  const sa = data.observation.angle; // deg (already decimal)
  const ieDeg = minutesToDeg(data.observation.indexError); // deg
  const dipDeg = minutesToDeg(HoeCorr(data.observation.observerAltitude));       // deg

  const refrDeg = (data.corrections.refraction); // deg
  const sdDeg = (data.corrections.sd);
  const parrDeg = (data.corrections.parallax);

  // Computed values
  const observed = useMemo(() => sum(sa, ieDeg), [sa, ieDeg]);
  const apparent = useMemo(() => sum(observed, dipDeg), [observed, dipDeg]);
  const trueAlt = useMemo(() => sum(apparent, refrDeg, sdDeg, parrDeg), [
    apparent,
    refrDeg,
    sdDeg,
    parrDeg,
  ]);

  const textColor = nightMode ? '#ff3333' : undefined;
  return (
    <View>
      <Text style={textColor ? { color: textColor, fontWeight: 'bold' } : { fontWeight: 'bold' }}>
        {title}
      </Text>

      {/* Sextant / Index Error */}
      <KVRow
        label="Sextant Altitude"
        value={formatDeg(sa)}
        labelWidth={labelWidth}
        nightMode={nightMode}
      />
      <KVRow
        label="Index Error"
        value={formatMinutesAsDegMin(data.observation.indexError)}
        labelWidth={labelWidth}
        nightMode={nightMode}
      />
      <Divider/>

      {/* Observed / Dip */}
      <KVRow
        label="Observed Altitude"
        value={formatDeg(observed)}
        labelWidth={labelWidth}
        bold
        nightMode={nightMode}
      />
      <KVRow
        label="Dip"
        value={formatMinutesAsDegMin(dipDeg * 60)}
        labelWidth={labelWidth}
        nightMode={nightMode}
      />
      <Divider/>

      {/* Apparent */}
      <KVRow
        label="Apparent Altitude"
        value={formatDeg(apparent)}
        labelWidth={labelWidth}
        bold
        nightMode={nightMode}
      />

      {/* Altitude Correction (group heading, subtle) */}
      <Text style={textColor ? { color: textColor } : undefined}>
        Altitude Correction
      </Text>

      {/* Corrections */}
      <KVRow3
        label="Refr"
        value={formatMinutesAsDegMin(data.corrections.refraction * 60)}
        labelWidth={labelWidth}
        nightMode={nightMode}
      />
      <KVRow3
        label="SD corr"
        value={formatMinutesAsDegMin(data.corrections.sd * 60)}
        labelWidth={labelWidth}
        nightMode={nightMode}
      />
      <KVRow3
        label="parr corr"
        value={formatMinutesAsDegMin(data.corrections.parallax * 60)}
        labelWidth={labelWidth}
        nightMode={nightMode}
      />
      <Divider/>

      {/* True Altitude */}
      <KVRow
        label="True Altitude"
        value={formatDeg(trueAlt)}
        labelWidth={labelWidth}
        bold
        nightMode={nightMode}
      />

    </View>
  );
}
