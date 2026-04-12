
import { View } from "react-native";
import { Divider, Switch, Text, useTheme } from "react-native-paper";
import { effectiveObservationDateUtc } from "../helpers/astron/init";
import { formatAngleDegreesMinutes } from "../helpers/formatAngleDegreesMinutes";
import { SightReductionData } from "../models/SightReductionData";
import { KVRow } from "./KVRow";

export default function ReductionSummary({ data }: { data: SightReductionData }) {
    const { colors } = useTheme();

    const intercept = (-data.reduction.hs + data.reduction.hc) * 60;
    const interceptStr = intercept >= 0 ? `+ ${intercept.toFixed(1)}′` : `− ${Math.abs(intercept).toFixed(1)}′`;
    const awayToward = intercept >= 0 ? "away" : "toward";
    return (
        <View>
            <KVRow
                label="GMT"
                value={effectiveObservationDateUtc(data.observation).toUTCString()}
                labelWidth={150}
            />
            <KVRow
                label={`GHA of ${data.observation.object}`}
                value={formatAngleDegreesMinutes(data.reduction.gha)}
                labelWidth={150}
            />
            <KVRow
                label="Chosen Longitude"
                value={formatAngleDegreesMinutes(data.reduction.chosenLongitude)}
                labelWidth={150}
            />
            <KVRow
                label={`Declination of ${data.observation.object}`}
                value={formatAngleDegreesMinutes(data.reduction.declination)}
                labelWidth={150}
            />
            <KVRow
                label="LHA"
                value={formatAngleDegreesMinutes(data.reduction.lha)}
                labelWidth={150}
            />

            <Divider bold={true} />
            <KVRow
                label="Computed Hc"
                value={formatAngleDegreesMinutes(data.reduction.hc)}
                labelWidth={150}
            />
            <KVRow
                label="Observed Altitude (Hs)"
                value={formatAngleDegreesMinutes(data.reduction.hs)}
                labelWidth={150}
            />
            <Divider bold={true} />
            <KVRow
                label="intercept"
                value={interceptStr}
                labelWidth={150}
            />
            <KVRow
                label="Z"
                value={data.reduction.azimuth.toFixed(1) + "°" + " " + awayToward}
                labelWidth={150}
            />
            <Divider bold={true} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: colors.onSurface }}>Use real position</Text>
                <Switch
                    value={data.realPosition}
                    onValueChange={data.setRealPosition}
                />
            </View>
        </View>
    );
}