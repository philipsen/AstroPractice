import { View } from "react-native";
import { Divider, Switch, Text } from "react-native-paper";
import { Degs_f } from "../helpers/astron/Astron";
import { SightReductionData } from "../models/SightReductionData";
import { KVRow } from "./KVRow";

export default function ReductionSummary({ data }: { data: SightReductionData }) {

    const intercept = (-data.reduction.hs + data.reduction.hc) * 60;
    const interceptStr = intercept >= 0 ? `+ ${intercept.toFixed(1)}′` : `− ${Math.abs(intercept).toFixed(1)}′`;
    const awayToward = intercept >= 0 ? "away" : "toward";

    return (
        <View>
            <KVRow
                label="GMT"
                value={(new Date(data.observation.created)).toUTCString()}
                labelWidth={150}
            />
            <KVRow
                label={`GHA of ${data.observation.object}`}
                value={Degs_f(data.reduction.gha)}
                labelWidth={150}
            />
            <KVRow
                label="Chosen Longitude"
                value={Degs_f(data.reduction.chosenLongitude)}
                labelWidth={150}
            />
            <KVRow
                label={`Declination of ${data.observation.object}`}
                value={Degs_f(data.reduction.declination)}
                labelWidth={150}
            />
            <KVRow
                label="LHA"
                value={Degs_f(data.reduction.lha)}
                labelWidth={150}
            />

            <Divider bold={true} />
            <KVRow
                label="Computed Hc"
                value={Degs_f(data.reduction.hc)}
                labelWidth={150}
            />
            <KVRow
                label="Observed Altitude (Hs)"
                value={Degs_f(data.reduction.hs)}
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
            <View style={{ flexDirection: 'row', alignItems: "center", marginLeft: 10, marginTop: 10, marginRight: 10 }}>
                <Text style= {{marginRight: 10}} >Use real position</Text>
                <Switch
                    value={data.realPosition}
                    onValueChange={data.setRealPosition}
                />
            </View>
        </View>
    );
}