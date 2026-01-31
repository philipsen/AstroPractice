
import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  G,
  Line,
  Path,
  Rect,
  Text as SvgText
} from 'react-native-svg';
import { SetPosition } from '../helpers/astron/Astron';
import { Calc, GetGha, GetReductionCorrections, SetObservationData } from '../helpers/astron/init';
import { CalcAssumedPosition } from '../helpers/CalcAssumedPosition';
import { ObservationEntity } from '../models/observationEntity';

type Tick = { value: number; major?: boolean };

interface ObservationPlotProps {
  observations: ObservationEntity[]; // observation data
  size?: number;           // canvas size in px (square)
  radiusPct?: number;      // % of size used for circle radius (0..0.5)
}

const ObservationPlot: React.FC<ObservationPlotProps> = ({
  observations,
  size = 400,
  radiusPct = 0.45
}) => {
  const scale = 1;

  // observations.forEach((obs, i) => {
  //   console.log(`Observation ${i}: lat=${obs.latitude}, lon=${obs.longitude}`);
  // });
  const latitudes = observations.map((obs, i) => obs.latitude);
  const longitudes = observations.map((obs, i) => obs.longitude);
  const latAvg = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
  const lonAvg = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
  // console.log(" latitudes:", latitudes);
  // console.log(" longitudes:", longitudes);
  // console.log(" latAvg:", latAvg);
  // console.log(" lonAvg:", lonAvg);

  const latitude = Math.round(latAvg);
  const longitude = Math.round(lonAvg);
  const latitudeDeg = Math.abs(latitude);   // sample data
  const longitudeDeg = Math.abs(longitude);  // sample data
  const eorw = longitude >= 0 ? 'E' : 'W';
  const nons = latitude >= 0 ? 'N' : 'S';
  const verticalUpdate = latitude >= 0 ? 1 : -1;
  const horizontalUpdate = longitude >= 0 ? 1 : -1;
  // console.log("ObservationPlot: lat=", latitudeDeg, nons, " lon=", longitudeDeg, eorw);
  // console.log("observations:", observations);

  const latestObservation = observations.reduce((latest, current) =>
    new Date(current.created) > new Date(latest.created) ? current : latest,
    observations[0]
  );
  // if (latestObservation) {
  //   console.log("Latest observation:", (new Date(latestObservation.created)).toUTCString());
  // }
  // derived dimensions
  const r = size * radiusPct;     // circle radius
  const cx = size / 2;
  const cy = size / 2;

  // helpers
  const toX = (dx: number) => cx + dx;
  const toY = (dy: number) => cy + dy;

  const offset = (1 - 2 * radiusPct) * size / 2;
  const latToY = (lat: number) => {
    return ((lat - latitude - 1) * -1 * r) + offset;
  };
  const cosDeg = (d: number) => Math.cos(d * Math.PI / 180);

  const lonToX = (lon: number) => {
    return ((((lon - longitude) * cosDeg(latitude) + 1) * r) + offset);
  };

  // console.log("lonToX(", -62, ") = ", lonToX(-62));
  // console.log("lonToX(", -63, ") = ", lonToX(-63));
  // console.log("lonToX(", -64, ") = ", lonToX(-64));

  // console.log("latToY(", 22, ") = ", latToY(22));
  // console.log("latToY(", 21, ") = ", latToY(21));
  // console.log("latToY(", 20, ") = ", latToY(20));


  // ticks every 10 units, with major every 30
  const ticks: Tick[] = useMemo(
    () => Array.from({ length: 60 }, (_, i) => {
      const v = i * 6;  //-60 + i * 2; // -60, -50, ... 60
      return { value: v, major: v % 15 === 0 };
    }),
    []
  );

  // Arrow path from (x1,y1) to (x2,y2)
  const arrowPath = (x1: number, y1: number, x2: number, y2: number, head = 8) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    // two head points rotated ±30°
    const angle = Math.PI / 6;
    const hx1 = x2 - head * (ux * Math.cos(angle) - uy * Math.sin(angle));
    const hy1 = y2 - head * (uy * Math.cos(angle) + ux * Math.sin(angle));
    const hx2 = x2 - head * (ux * Math.cos(-angle) - uy * Math.sin(-angle));
    const hy2 = y2 - head * (uy * Math.cos(-angle) + ux * Math.sin(-angle));
    return `M ${x1} ${y1} L ${x2} ${y2} M ${hx1} ${hy1} L ${x2} ${y2} L ${hx2} ${hy2}`;
  };

  function move(assumedLat: number, assumedLong: number, azimuth: number, int: number) {
    const lat = assumedLat + int * Math.cos(azimuth * Math.PI / 180);
    const lon = assumedLong + (int * Math.sin(azimuth * Math.PI / 180)) / cosDeg(assumedLat);
    return [lat, lon];
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Svg 
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
>
        {/* Background */}
        {/* <Rect x={0} y={0} width={size} height={size} fill="#fff" /> */}

        {/* Outer circle */}
        <Circle cx={cx} cy={cy} r={r} stroke="#444" strokeWidth={1} fill="none" />

        {/* Axes */}
        <G stroke="#444">
          <Line x1={0} y1={cy} x2={size} y2={cy} strokeWidth={1} />
          <Line x1={cx} y1={toY(-r)} x2={cx} y2={toY(r)} strokeWidth={1} />

        </G>
        <G stroke="#888">
          <Line x1={lonToX(longitude - 1)} y1={offset} x2={lonToX(longitude - 1)} y2={size - offset} strokeWidth={0.8} />
          <Line x1={lonToX(longitude + 1)} y1={offset} x2={lonToX(longitude + 1)} y2={size - offset} strokeWidth={0.8} />
        </G>

        {/* Vertical tick ruler (center) */}
        <G stroke="#777">
          {ticks.map((t, i) => {
            const y = t.value + offset; // map -60..60 to -r..r
            const len = t.major ? 10 : 5;
            return (
              <G key={`vt-${i}`}>
                <Line x1={cx - len} y1={y} x2={cx + len} y2={y} strokeWidth={0.8} />
              </G>
            );
          })}
        </G>

        {/* Plotted observations (circles) */}
        {
          observations.map((obs, i) => {
            const x = lonToX(obs.longitude);
            const y = latToY(obs.latitude);
            const text = new Date(obs.created).toLocaleTimeString();
            // console.log(`Plotting obs ${i}: lat=${obs.latitude}, lon=${obs.longitude} => x=${x}, y=${y}`);

            SetObservationData(obs);
            const ghaReal = GetGha();

            const rdReal = GetReductionCorrections();
            const [assumedLat, assumedLong] = CalcAssumedPosition(ghaReal, obs.latitude, obs.longitude);
            SetPosition(assumedLat, assumedLong);
            Calc();
            const rdAssumed = GetReductionCorrections();

            // console.log("Observation", i);
            // console.log(".  assumed position: lat=", assumedLat, " lon=", assumedLong);
            const int = rdAssumed.hc - rdAssumed.hs
            // console.log(`.  rdAssumed: Z=${rdAssumed.azimuth.toFixed(1)} Int=${int.toFixed(2)}`);

            const apMoved = move(assumedLat, assumedLong, rdAssumed.azimuth, -int);
            // console.log(`.  moved AP to: lat=${Degs_f(apMoved[0])}, lon=${Degs_f(apMoved[1])}`);

            const arrowend1 = move(apMoved[0], apMoved[1], rdAssumed.azimuth + 90, 1);
            // console.log(`.  arrow end1: lat=${Degs_f(arrowend1[0])}, lon=${Degs_f(arrowend1[1])}`);
            const arrowend2 = move(apMoved[0], apMoved[1], rdAssumed.azimuth - 90, 1);
            // console.log(`.  arrow end2: lat=${Degs_f(arrowend2[0])}, lon=${Degs_f(arrowend2[1])}`);

            const dLat = obs.latitude - latestObservation.latitude;
            const dLon = obs.longitude - latestObservation.longitude;

            const apMovedLatDelta = apMoved[0] - dLat;
            const apMovedLonDelta = apMoved[1] - dLon;
            const arrowend1Delta = move(apMovedLatDelta, apMovedLonDelta, rdAssumed.azimuth + 90, 1);
            const arrowend2Delta = move(apMovedLatDelta, apMovedLonDelta, rdAssumed.azimuth - 90, 1);


            return (
              <G key={`obs-group-${i}`}>
                <Rect
                  key={`obs-rect-${i}`}
                  x={x-2}
                  y={y-2}
                  width={4}
                  height={4}
                  fill="black"
                ></Rect>
                <SvgText key={`obs-text-${i}`} x={x + 5} y={y} fill="rgba(100,0,0,0.7)">{text}</SvgText>

                <Rect
                  key={`obsa-${i}`}
                  x={lonToX(assumedLong) - 3}
                  y={latToY(assumedLat) - 3}
                  width={6}
                  height={6}
                  fill="black"
                />
                <SvgText
                  key={`obsat-${i}`}
                  x={lonToX(assumedLong) + 9}
                  y={latToY(assumedLat) - 5}
                  transform={`rotate(70 ${lonToX(assumedLong)} ${latToY(assumedLat) - 3})`}
                >AP{i}
                </SvgText>

                <Line
                  key={`line1-${i}`}
                  x1={lonToX(apMoved[1])}
                  y1={latToY(apMoved[0])}
                  x2={lonToX(assumedLong)}
                  y2={latToY(assumedLat)}
                  stroke="gray"
                  strokeWidth={0.5}
                />
                <Path
                  key={`path1-${i}`}
                  d={arrowPath(lonToX(apMoved[1]), latToY(apMoved[0]), lonToX(arrowend1[1]), latToY(arrowend1[0]), 8)}
                  stroke="gray"
                  fill="gray"
                  strokeWidth={1.}
                />
                <Path
                  key={`path2-${i}`}
                  d={arrowPath(lonToX(apMoved[1]), latToY(apMoved[0]), lonToX(arrowend2[1]), latToY(arrowend2[0]), 8)}
                  stroke="gray"
                  fill="gray"
                  strokeWidth={1.}
                />

                <Line
                  key={`line2-${i}`}
                  x1={lonToX(apMoved[1])}
                  y1={latToY(apMoved[0])}
                  x2={lonToX(apMovedLonDelta)}
                  y2={latToY(apMovedLatDelta)}
                  stroke="black"
                  strokeWidth={.3}
                />
                <Path
                  key={`path3-${i}`}
                  d={arrowPath(lonToX(apMovedLonDelta), latToY(apMovedLatDelta), lonToX(arrowend1Delta[1]), latToY(arrowend1Delta[0]), 8)}
                  stroke="black"
                  strokeWidth={1.5}
                />
                <Path
                  key={`path4-${i}`}
                  d={arrowPath(lonToX(apMovedLonDelta), latToY(apMovedLatDelta), lonToX(arrowend2Delta[1]), latToY(arrowend2Delta[0]), 8)}
                  stroke="black"
                  strokeWidth={1.5}
                />
              </G>
            );
          })
        }

        {/* Sample plotted points (squares) */}
        {/* <G>
          {[
            { x: -0.25 * r, y: 0.15 * r },
            { x: -0.05 * r, y: 0.18 * r },
            { x: 0.18 * r, y: 0.17 * r },
          ].map((p, i) => (
            <Rect
              key={`pt-${i}`}
              x={toX(p.x) - 3}
              y={toY(p.y) - 3}
              width={6}
              height={6}
              fill="#111"
            />
          ))}
        </G> */}

        {/* Sample arrows */}
        {/* <G stroke="#111">
          <Path
            d={arrowPath(toX(-0.6 * r), cy - 18, toX(0.6 * r), cy - 18, 9)}
            strokeWidth={1.5}
          />
          <Path
            d={arrowPath(toX(-0.5 * r), toY(0.35 * r), toX(0.2 * r), toY(-0.05 * r), 9)}
            strokeWidth={2}
          />
        </G> */}

        {/* Lat and long labels */}
        <G >
          <SvgText x={toX(r + 6) - 15} y={toY(2) - 10} >
            {latitudeDeg}°{nons}
          </SvgText>
          <SvgText x={toX(5)} y={18}>
            {longitudeDeg}°{eorw}
          </SvgText>
          <SvgText x={lonToX(longitude - 1)} y={18}>
            {longitudeDeg + 1}°{eorw}
          </SvgText>
          <SvgText x={lonToX(longitude + 1)} y={18}>
            {longitudeDeg - 1}°{eorw}
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

export default ObservationPlot;
