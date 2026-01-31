
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { getObservation } from '../../../../helpers/ObservationRepository';

import { useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { FAB, Text, TextInput } from "react-native-paper";
import { BODY_NAMES } from "../../../../helpers/astron/Astron";

import { Dropdown } from 'react-native-paper-dropdown';
import { SafeAreaView } from "react-native-safe-area-context";
import NSChoice from "../../../../components/NSChoice";
import UTCDateTimePicker from "../../../../components/UTCDateTimePicker";
import { GetBestFitObjects } from "../../../../helpers/astron/init";
import { formatDeg } from "../../../../helpers/MinutesToDeg";

const bodyNames = BODY_NAMES;


export default function ObservationEdit() {
    const id = Number(useLocalSearchParams().obsId);
    console.log("ObservationEdit render id =", id);

    const db = useSQLiteContext();
    const obs = useMemo(() => getObservation(db, Number(id)), [db, id]);
    const router = useRouter();

    const [delay, setDelay] = useState<string>(obs.delay ? obs.delay.toString() : "0");
    const [angle, setAngle] = useState<number>(obs.angle ? obs.angle : 0);


    const [angleDegrees, setAngleDegrees] = useState<string>(Math.floor(angle).toString());
    const [angleMinutes, setAngleMinutes] = useState<string>((Math.round(60 * (angle - Number(angleDegrees)) * 10) / 10).toString());

    const [indexError, setIndexError] = useState<number>(obs.indexError ? obs.indexError : 0);
    const [observerAltitude, setObserverAltitude] = useState<number>(obs.observerAltitude ? obs.observerAltitude : 0);
    const limbTypeOptions = [{ label: 'Lower', value: 'lower' },{ label: 'Center', value: 'center' }, { label: 'Upper', value: 'upper' }];


    const [limb, setLimb] = useState<string>(limbTypeOptions[obs.limbType ? obs.limbType : 0].value);
    const [artificialHorizon, setArtificialHorizon] = useState(obs.horizon ? obs.horizon === 1 : false);
    const [body, setBody] = useState<number>(obs.object ? bodyNames.indexOf(obs.object) : 0);


    const latitude = obs.latitude ? obs.latitude : 0;
    const longitude = obs.longitude ? obs.longitude : 0;
    const [latitudeDegrees, setLatitudeDegrees] = useState<string>(Math.floor(Math.abs(latitude)).toString());
    const [latitudeMinutes, setLatitudeMinutes] = useState<string>(((60 * (Math.abs(latitude) - Number(latitudeDegrees)) * 10) / 10).toFixed(1));
    const [longitudeDegrees, setLongitudeDegrees] = useState<string>(Math.floor(Math.abs(longitude)).toString());
    const [longitudeMinutes, setLongitudeMinutes] = useState<string>(((60 * (Math.abs(longitude) - Number(longitudeDegrees)) * 10) / 10).toFixed(1));
    const [nors, setNors] = useState<'N' | 'S' | 'E' | 'W'>(obs.latitude > 0 ? 'N' : 'S');
    const [eorw, setEorw] = useState<'N' | 'S' | 'E' | 'W'>(obs.longitude > 0 ? 'E' : 'W');

    const refDelay = useRef<any>(null);
    const refAngleDegrees = useRef<any>(null);
    const refAngleMinutes = useRef<any>(null);
    const refIndexError = useRef<any>(null);
    const refHeight = useRef<any>(null);
    const refLatitudeDegrees = useRef<any>(null);
    const refLatitudeMinutes = useRef<any>(null);
    const refLongitudeDegrees = useRef<any>(null);
    const refLongitudeMinutes = useRef<any>(null);

    function useGateSelectOnFocus() {
        const [enabled, setEnabled] = useState(true);
        return {
            selectTextOnFocus: enabled,
            onFocus: () => enabled && setEnabled(false),
            onBlur: () => setEnabled(true),
        };
    }

    const delayGate = useGateSelectOnFocus();
    const angleDegreesGate = useGateSelectOnFocus();
    const angleMinutesGate = useGateSelectOnFocus();
    const indexErrorGate = useGateSelectOnFocus();
    const heightGate = useGateSelectOnFocus();

    const latitudeDegreesGate = useGateSelectOnFocus();
    const latitudeMinutesGate = useGateSelectOnFocus();
    const longitudeDegreesGate = useGateSelectOnFocus();
    const longitudeMinutesGate = useGateSelectOnFocus();

    const [myDate, setMyDate] = useState<Date | undefined>(new Date(obs.created));

    // useFocusEffect(
    //     useCallback(() => {
    //         console.log("ObservationEdit focus effect for id =", id);
    //         return () => {
    //             console.log("ObservationEdit cleanup for id =", id, myDate);
    //             // updateObservation();
    //         }
    //     }, [myDate, id])
    // );

    // const hs = useMemo(() => GetHs(), []);
    // console.log(" hs =", hs);
    // const objects = useMemo(() => GetBestFitObjects(), []);
    // console.log(" objects =", objects);
    // for (const obj of objects) {
    //     console.log(`  ${obj.name}: \thc = ${formatDeg(Number(obj.hc))}, \tdiff = ${formatDeg(Number(obj.difference))}, azm = ${Number(obj.azimuth).toFixed(0)}°`);
    // }
    

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FAB
                icon="arrow-left"
                style={{ position: 'absolute', margin: 16, left: 10, bottom: 0 }}
                onPress={() => {
                    router.back();
                }}
            />
            <FAB
                icon="content-save"
                style={{ position: 'absolute', margin: 16, right: 10, bottom: 0 }}
                onPress={() => {
                    updateObservation();
                    router.back();
                }}
            />
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <UTCDateTimePicker
                        value={myDate}
                        onChange={(d: any) => setMyDate(d)}
                    />
                    <TextInput
                        mode="outlined"
                        theme={{
                            roundness: 5
                        }}
                        style={{ margin: 2, width: 80 }}
                        dense={true}
                        ref={refDelay}
                        label="Delay"
                        onChangeText={setDelay}
                        value={delay}
                        returnKeyType="next"
                        inputMode="decimal"
                        autoFocus
                        onSubmitEditing={() => refAngleDegrees.current?.focus()}
                        selectTextOnFocus={delayGate.selectTextOnFocus}
                        onFocus={delayGate.onFocus}
                        onBlur={delayGate.onBlur}
                        right={
                            <TextInput.Affix text="s" />
                        } />
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        mode="outlined"
                        theme={{ roundness: 5 }}
                        style={{ margin: 2 }}
                        ref={refAngleDegrees}
                        label="deg"
                        onChangeText={text => setAngleDegrees((text))}
                        value={angleDegrees}
                        returnKeyType="next"
                        onSubmitEditing={() => refAngleMinutes.current?.focus()}
                        inputMode="decimal"
                        selectTextOnFocus={angleDegreesGate.selectTextOnFocus}
                        onFocus={angleDegreesGate.onFocus}
                        onBlur={angleDegreesGate.onBlur}
                    />
                    <TextInput
                        mode="outlined"
                        theme={{ roundness: 5 }}
                        style={{ margin: 2 }}
                        ref={refAngleMinutes}
                        label="min"
                        onChangeText={text => setAngleMinutes((text))}
                        value={angleMinutes}
                        returnKeyType="next"
                        onSubmitEditing={() => refIndexError.current?.focus()}
                        selectTextOnFocus={angleMinutesGate.selectTextOnFocus}
                        onFocus={angleMinutesGate.onFocus}
                        onBlur={angleMinutesGate.onBlur}
                        inputMode="decimal"
                    />

                    <TextInput
                        mode="outlined"
                        theme={{ roundness: 5 }}
                        style={{ margin: 2 }}
                        ref={refIndexError}
                        label="idx err"
                        onChangeText={text => setIndexError(Number(text))}
                        value={indexError.toString()}
                        returnKeyType="next"
                        onSubmitEditing={() => refHeight.current?.focus()}
                        selectTextOnFocus={indexErrorGate.selectTextOnFocus}
                        onFocus={indexErrorGate.onFocus}
                        onBlur={indexErrorGate.onBlur}
                        inputMode="decimal"
                    />

                    <TextInput
                        mode="outlined"
                        theme={{ roundness: 5 }}
                        style={{ margin: 2 }}
                        ref={refHeight}
                        label="height"
                        onChangeText={text => setObserverAltitude(Number(text))}
                        value={observerAltitude.toString()}
                        returnKeyType="next"
                        inputMode="decimal"
                        onSubmitEditing={() => refLatitudeDegrees.current?.focus()}
                        selectTextOnFocus={heightGate.selectTextOnFocus}
                        onFocus={heightGate.onFocus}
                        onBlur={heightGate.onBlur}
                    />

                </View>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ margin: 5 }}>
                        <Dropdown
                            mode="outlined"
                            label="limb"
                            placeholder="Select limb"
                            options={limbTypeOptions}
                            value={limb.toString()}
                            onSelect={limb => setLimb(limb ?? "lower")}
                        />
                    </View>
                    <View style={{ margin: 5 }}>
                        <Dropdown
                            mode="outlined"
                            label="body"
                            placeholder="Select body"
                            options={bodyNames.map((name, index) => ({ label: name, value: name }))}
                            value={bodyNames[body]}
                            onSelect={(value) => {
                                console.log("Selected body =", value);
                                setBody(bodyNames.indexOf(value));
                            }}
                        />
                    </View>
                    <View style={{ margin: 5 }}>
                        <Dropdown
                            mode="outlined"
                            label="horizon"
                            placeholder="Select horizon"
                            options={[{ label: 'Natural', value: 'natural' }, { label: 'Artificial', value: 'artificial' }]}
                            value={artificialHorizon ? 'artificial' : 'natural'}
                            onSelect={(value) => {
                                console.log("Selected horizon =", value);
                                setArtificialHorizon(value === 'artificial');
                            }}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        label="lat"
                        onChangeText={text => setLatitudeDegrees(text)}
                        value={latitudeDegrees}
                        right={
                            <TextInput.Affix text="°" />
                        }
                        inputMode="decimal"
                        ref={refLatitudeDegrees}
                        onSubmitEditing={() => refLatitudeMinutes.current?.focus()}
                        selectTextOnFocus={latitudeDegreesGate.selectTextOnFocus}
                        onFocus={latitudeDegreesGate.onFocus}
                        onBlur={latitudeDegreesGate.onBlur}
                    />
                    <TextInput
                        label=" "
                        onChangeText={text => setLatitudeMinutes(text)}
                        value={latitudeMinutes}
                        right={
                            <TextInput.Affix text="′" />
                        }
                        inputMode="decimal"
                        ref={refLatitudeMinutes}
                        onSubmitEditing={() => refLongitudeDegrees.current?.focus()}
                        selectTextOnFocus={latitudeMinutesGate.selectTextOnFocus}
                        onFocus={latitudeMinutesGate.onFocus}
                        onBlur={latitudeMinutesGate.onBlur}
                    />
                    <NSChoice value={nors} onChange={setNors} />

                    <TextInput
                        label="longitude"
                        onChangeText={text => setLongitudeDegrees(text)}
                        value={longitudeDegrees}
                        right={
                            <TextInput.Affix text="°" />
                        }
                        inputMode="decimal"
                        ref={refLongitudeDegrees}
                        onSubmitEditing={() => { refLongitudeMinutes.current?.focus() }}
                        selectTextOnFocus={longitudeDegreesGate.selectTextOnFocus}
                        onFocus={longitudeDegreesGate.onFocus}
                        onBlur={longitudeDegreesGate.onBlur}
                    />
                    <TextInput
                        label=" "
                        onChangeText={text => setLongitudeMinutes(text)}
                        value={longitudeMinutes}
                        right={
                            <TextInput.Affix text="'" />
                        }
                        inputMode="decimal"
                        ref={refLongitudeMinutes}
                        selectTextOnFocus={longitudeMinutesGate.selectTextOnFocus}
                        onFocus={longitudeMinutesGate.onFocus}
                        onBlur={longitudeMinutesGate.onBlur}
                    />
                    <NSChoice value={eorw} onChange={setEorw} />
                </View>

                <View style={{ marginTop: 20, padding: 10, marginLeft: 55, marginRight: 55, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}>
                    <Text variant="titleMedium" style={{ marginBottom: 10 }}>Best Matching Objects</Text>
                    
                    {/* Header Row */}
                    <View style={{ flexDirection: 'row', paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                        <Text style={{ flex: 2, fontWeight: 'bold' }}>Object</Text>
                        <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'center' }}>Difference</Text>
                        <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'center' }}>Azimuth</Text>
                    </View>
                    
                    {/* Data Rows */}
                    {GetBestFitObjects(5).map((obj, index) => (
                        <View key={index} style={{ flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: '#eee' }}>
                            <Text style={{ flex: 2 }}>{obj.name}</Text>
                            <Text style={{ flex: 1, textAlign: 'center' }}>{formatDeg(Number(obj.difference))}</Text>
                            <Text style={{ flex: 1, textAlign: 'center' }}>{Number(obj.azimuth).toFixed(0)}°</Text>
                        </View>
                    ))}
                </View>
                
                {/* <IconButton
                    mode="contained"
                    icon="content-save"
                    onPress={() => {
                        updateObservation();
                        router.back();
                    }} /> */}



            </View>
        </SafeAreaView>
    );

    async function updateObservation() {
        const dt2 = myDate; //new Date(dt);
        console.log("updateObservation called", dt2);
        // console.log(longitudeDegrees, longitudeMinutes, latitudeDegrees, latitudeMinutes);
        const angle = Number(angleDegrees) + Number(angleMinutes) / 60;
        const longitude2 = (eorw === 'E' ? 1 : -1) * (Number(longitudeDegrees) + Number(longitudeMinutes) / 60);
        const latitude2 = (nors === 'N' ? 1 : -1) * (Number(latitudeDegrees) + Number(latitudeMinutes) / 60);

        await db.runAsync(
            `UPDATE observations SET
                angle = ?,
                observerAltitude = ?,
                indexError = ?,
                object = ?,
                latitude = ?,
                longitude = ?,
                delay = ?,
                limbType = ?,
                horizon = ?,
                created = ?
            WHERE id = ?;`,
            [
                angle.toString(),
                observerAltitude.toString(),
                indexError.toString(),
                bodyNames[body],
                latitude2,
                longitude2,
                delay,
                limbTypeOptions.findIndex(lt => lt.value === limb),
                artificialHorizon ? 1 : 0,
                dt2 ? dt2.toISOString() : null,
                id
            ]
        );
        const obs = getObservation(db, Number(id));
        console.log("obs = ", obs);
        // router.back();
    }

}

