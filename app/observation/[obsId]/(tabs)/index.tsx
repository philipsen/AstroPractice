
import { useRouter } from "expo-router";

import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { FAB, Text, TextInput } from "react-native-paper";

import { BODY_NAMES } from "../../../../src/helpers/astron/Astron";

import NSChoice from "@/src/components/NSChoice";
import UTCDateTimePicker from "@/src/components/UTCDateTimePicker";
import { useObservationStore } from "@/src/state/useObservationStore";
import { Dropdown } from 'react-native-paper-dropdown';
import { SafeAreaView } from "react-native-safe-area-context";
import { GetBestFitObjects } from "../../../../src/helpers/astron/init";
import { formatDeg } from "../../../../src/helpers/MinutesToDeg";
const bodyNames = BODY_NAMES.map(name => name.toLowerCase());



export default function ObservationEdit() {
    const observation = useObservationStore((s) => s.observation);
    const updateField = useObservationStore((s) => s.updateField);
    const router = useRouter();

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

    console.log("Rendering observation edit, observation:", observation?.id);
    const delayGate = useGateSelectOnFocus();
    const angleDegreesGate = useGateSelectOnFocus();
    const angleMinutesGate = useGateSelectOnFocus();
    const indexErrorGate = useGateSelectOnFocus();
    const heightGate = useGateSelectOnFocus();

    const latitudeDegreesGate = useGateSelectOnFocus();
    const latitudeMinutesGate = useGateSelectOnFocus();
    const longitudeDegreesGate = useGateSelectOnFocus();
    const longitudeMinutesGate = useGateSelectOnFocus();


    const [timeOfObservation, setTimeOfObservation] = useState<Date | undefined>(observation ? new Date(observation.created) : undefined);
    const [delay, setDelay] = useState<string>("");
    const [angleDegrees, setAngleDegrees] = useState<string>(); //Math.floor(angle).toString());
    const [angleMinutes, setAngleMinutes] = useState<string>(); //(Math.round(60 * (angle - Number(angleDegrees)) * 10) / 10).toString());
    const [indexError, setIndexError] = useState<string>("");
    const [observerAltitude, setObserverAltitude] = useState<string>("");
    const limbTypeOptions = [{ label: 'Lower', value: 'lower' },{ label: 'Center', value: 'center' }, { label: 'Upper', value: 'upper' }];

    const [limb, setLimb] = useState<string>(""); //limbTypeOptions[obs.limbType ? obs.limbType : 0].value);
    const [artificialHorizon, setArtificialHorizon] = useState(false); //obs.horizon ? obs.horizon === 1 : false);
    const [body, setBody] = useState<number>(0);

    const [latitudeDegrees, setLatitudeDegrees] = useState<string>("") ; //(Math.floor(Math.abs(latitude)).toString());
    const [latitudeMinutes, setLatitudeMinutes] = useState<string>("") ; //(((60 * (Math.abs(latitude) - Number(latitudeDegrees)) * 10) / 10).toFixed(1));
    const [longitudeDegrees, setLongitudeDegrees] = useState<string>("") ; //(Math.floor(Math.abs(longitude)).toString());
    const [longitudeMinutes, setLongitudeMinutes] = useState<string>("") ; //(((60 * (Math.abs(longitude) - Number(longitudeDegrees)) * 10) / 10).toFixed(1));
    const [nors, setNors] = useState<'N' | 'S' | 'E' | 'W'>('N') ; //(obs.latitude > 0 ? 'N' : 'S');
    const [eorw, setEorw] = useState<'N' | 'S' | 'E' | 'W'>('E') ; //(obs.longitude > 0 ? 'E' : 'W');

    useEffect(() => {
        console.log("observation changed, updating fields", observation);
        if (observation) {
            setDelay(observation.delay?.toString());
            setAngleDegrees(Math.floor(observation.angle).toString());
            setAngleMinutes((Math.round(60 * (observation.angle - Math.floor(observation.angle)) * 10) / 10).toString());
            setObserverAltitude(observation.observerAltitude?.toString());
            setBody(bodyNames.indexOf(observation.object?.toLowerCase()))
            setIndexError(observation.indexError?.toString());
            setLimb(limbTypeOptions[observation.limbType ? observation.limbType : 0].value);
             setArtificialHorizon(observation.horizon ? observation.horizon === 1 : false);
            const latitude = observation.latitude;
            const longitude = observation.longitude;
            // console.log("Parsed latitude and longitude", latitude, longitude);
            setLatitudeDegrees(Math.floor(Math.abs(latitude)).toString());
            // console.log("Latitude degrees: ", latitudeDegrees);
            setLatitudeMinutes((((60 * (Math.abs(latitude) - Math.floor(Math.abs(latitude))) * 10) / 10).toFixed(1)).toString());
            // console.log("Latitude minutes: ", latitudeMinutes);
            setLongitudeDegrees(Math.floor(Math.abs(longitude)).toString());
            setLongitudeMinutes((((60 * (Math.abs(longitude) - Math.floor(Math.abs(longitude))) * 10) / 10).toFixed(1)).toString());
            setNors(latitude > 0 ? 'N' : 'S');
            setEorw(longitude > 0 ? 'E' : 'W');
        }
    }, [observation?.id]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FAB
                icon="arrow-left"
                style={{ position: 'absolute', margin: 16, left: 10, bottom: 0 }}
                onPress={() => {
                    router.back();
                }}
                size="small"
            />
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <UTCDateTimePicker
                        value={timeOfObservation}
                        onChange={(d: any) => setTimeOfObservation(d)}
                    />
                    <Text>x{delay}x`</Text>
                    <TextInput
                        mode="outlined"
                        theme={{ roundness: 5 }}
                        style={{ margin: 2, width: 80, left: 30 }}
                        dense={true}
                        ref={refDelay}
                        label="Delay"
                        onChangeText={setDelay}                             
                        value={delay ? delay.toString() : "0"}
                        returnKeyType="next"
                        inputMode="decimal"
                        autoFocus
                        onSubmitEditing={() => refAngleDegrees.current?.focus()}
                        selectTextOnFocus={delayGate.selectTextOnFocus}
                        onFocus={delayGate.onFocus}
                        onBlur={() => {
                            updateField('delay', Number(delay));
                            delayGate.onBlur();
                        }}
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
                        onBlur={() => {
                            angleDegreesGate.onBlur();
                            const angle = Number(angleDegrees) + Number(angleMinutes) / 60;
                            updateField('angle', angle);
                        }}
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
                        onBlur={() => {
                            const angle = Number(angleDegrees) + Number(angleMinutes) / 60;
                            updateField('angle', angle);
                            angleMinutesGate.onBlur();
                        }}
                        inputMode="decimal"
                    />

                    <TextInput
                        mode="outlined"
                        theme={{ roundness: 5 }}
                        style={{ margin: 2 }}
                        ref={refIndexError}
                        label="idx err"
                        onChangeText={text => setIndexError(text)}
                        value={indexError ? indexError.toString() : "0"}
                        returnKeyType="next"
                        onSubmitEditing={() => refHeight.current?.focus()}
                        selectTextOnFocus={indexErrorGate.selectTextOnFocus}
                        onFocus={indexErrorGate.onFocus}
                        onBlur={() => {
                            updateField('indexError', Number(indexError));
                            indexErrorGate.onBlur();
                        }}
                        inputMode="decimal"
                    />

                    <TextInput
                        mode="outlined"
                        theme={{ roundness: 5 }}
                        style={{ margin: 2 }}
                        ref={refHeight}
                        label="height"
                        onChangeText={text => setObserverAltitude(text)}
                        value={observerAltitude ? observerAltitude.toString() : "0"}
                        returnKeyType="next"
                        inputMode="decimal"
                        onSubmitEditing={() => refLatitudeDegrees.current?.focus()}
                        selectTextOnFocus={heightGate.selectTextOnFocus}
                        onFocus={heightGate.onFocus}
                        onBlur={() => {
                            updateField('observerAltitude', Number(observerAltitude));
                            heightGate.onBlur();
                        }}              
                    />
                </View> 
 
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ margin: 2 }}>
                        <Dropdown
                            mode="outlined"
                            label="limb"
                            placeholder="Select limb"
                            options={limbTypeOptions}
                            value={limb.toString()}
                            onSelect={limb => {
                                setLimb(limb ?? "lower");
                                const limbIndex = limbTypeOptions.findIndex(option => option.value === limb);
                                updateField('limbType', limbIndex);
                            }}
                        />
                    </View>
                    <View style={{ margin: 2, flex: .7 }}>
                        <Dropdown
                            mode="outlined"
                            label="body"
                            placeholder="Select body"
                            options={bodyNames.map((name, index) => ({ label: name, value: name }))}
                            value={bodyNames[body]}
                            onSelect={(value) => {
                                if (value) {
                                    updateField('object', value);
                                    setBody(bodyNames.indexOf(value));
                                }
                            }}
                        />
                    </View>
                    <View style={{ margin: 2, flex: .7 }}>
                        <Dropdown
                            mode="outlined"
                            label="horizon"
                            placeholder="Select horizon"
                            options={[{ label: 'Natural', value: 'natural' }, { label: 'Artificial', value: 'artificial' }]}
                            value={artificialHorizon ? 'artificial' : 'natural'}
                            onSelect={(value) => {
                                updateField('horizon', value === 'artificial' ? 1 : 0);
                                setArtificialHorizon(value === 'artificial');
                            }}
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        label="latitude"
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
                        onBlur={() => {
                            const latitude = (Number(latitudeDegrees) + Number(latitudeMinutes) / 60) * (nors === 'N' ? 1 : -1);
                            updateField('latitude', latitude);
                            latitudeDegreesGate.onBlur();
                        }}
                        mode="outlined"
                        theme={{ roundness: 5 }}
                        style={{ margin: 2 }}
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
                        onBlur={() => {
                            const latitude = (Number(latitudeDegrees) + Number(latitudeMinutes) / 60) * (nors === 'N' ? 1 : -1);
                            updateField('latitude', latitude);
                            latitudeMinutesGate.onBlur();
                        }}
                        mode="outlined"
                        theme={{ roundness: 5 }}
                        style={{ margin: 2 }}
                    />
                    <NSChoice value={nors} onChange={value => {
                        setNors(value);
                        const latitude = (Number(latitudeDegrees) + Number(latitudeMinutes) / 60) * (value === 'N' ? 1 : -1);
                        updateField('latitude', latitude);
                    }} />

                </View>     
                <View style={{ flexDirection: 'row' }}>
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
                        onBlur={() => {
                            const longitude = (Number(longitudeDegrees) + Number(longitudeMinutes) / 60) * (eorw === 'E' ? 1 : -1);
                            updateField('longitude', longitude);
                            longitudeDegreesGate.onBlur();
                        }}
                        mode="outlined"
                        theme={{ roundness: 5 }}
                    />  
                    <TextInput
                        label=" "
                        onChangeText={text => setLongitudeMinutes(text)}
                        value={longitudeMinutes}
                        right={
                            <TextInput.Affix text="′" />
                        }
                        inputMode="decimal"
                        ref={refLongitudeMinutes}
                        selectTextOnFocus={longitudeMinutesGate.selectTextOnFocus}
                        onFocus={longitudeMinutesGate.onFocus}
                        onBlur={() => {
                            const longitude = (Number(longitudeDegrees) + Number(longitudeMinutes) / 60) * (eorw === 'E' ? 1 : -1);
                            updateField('longitude', longitude);
                            longitudeMinutesGate.onBlur();
                        }}
                        mode="outlined"
                        theme={{ roundness: 5 }}
                    />
                    <NSChoice value={eorw} onChange={value => {
                        setEorw(value);
                        const longitude = (Number(longitudeDegrees) + Number(longitudeMinutes) / 60) * (value === 'E' ? 1 : -1);
                        updateField('longitude', longitude);
                    }} />
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
            </View>
        </SafeAreaView>
    );
}
