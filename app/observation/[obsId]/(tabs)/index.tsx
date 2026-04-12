
import { useRouter } from "expo-router";

import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { FAB, Text, TextInput, useTheme } from "react-native-paper";

import { BODY_NAMES } from "../../../../src/helpers/astron/Astron";

import CelestialBodyPicker from '@/src/components/CelestialBodyPicker';
import OptionSheetPicker from '@/src/components/OptionSheetPicker';
import NSChoice from "@/src/components/NSChoice";
import OutlinedObservationTextInput from '@/src/components/OutlinedObservationTextInput';
import UTCDateTimePicker from "@/src/components/UTCDateTimePicker";
import { useObservationStore } from "@/src/state/useObservationStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatDeg } from "../../../../src/helpers/MinutesToDeg";
import InitAstron, { GetBestFitObjects } from "../../../../src/helpers/astron/init";
import { useNightMode } from '../../../../src/state/NightModeContext';
export default function ObservationEdit() {
    const { setNightMode } = useNightMode();
    const { colors, dark } = useTheme();
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
    const [angleDegrees, setAngleDegrees] = useState<string>();
    const [angleMinutes, setAngleMinutes] = useState<string>();
    const [indexError, setIndexError] = useState<string>("");
    const [observerAltitude, setObserverAltitude] = useState<string>("");
    const limbTypeOptions = React.useMemo(() => [
        { label: 'Lower', value: 'lower' },
        { label: 'Center', value: 'center' },
        { label: 'Upper', value: 'upper' }
    ], []);

    const horizonOptions = React.useMemo(
        () => [
            { label: 'Natural', value: 'natural' },
            { label: 'Artificial', value: 'artificial' },
        ],
        []
    );

    const [limb, setLimb] = useState<string>("");
    const [artificialHorizon, setArtificialHorizon] = useState(false);
    const [body, setBody] = useState<number>(0);

    const [latitudeDegrees, setLatitudeDegrees] = useState<string>("") ;
    const [latitudeMinutes, setLatitudeMinutes] = useState<string>("") ;
    const [longitudeDegrees, setLongitudeDegrees] = useState<string>("") ;
    const [longitudeMinutes, setLongitudeMinutes] = useState<string>("") ;
    const [nors, setNors] = useState<'N' | 'S' | 'E' | 'W'>('N') ;
    const [eorw, setEorw] = useState<'N' | 'S' | 'E' | 'W'>('E') ;

    /** Bumps after InitAstron fills BODY_NAMES in place (mutation does not re-render by itself). */
    const [, setBodyListRevision] = useState(0);

    /** BODY_NAMES is filled at runtime by InitAstron — never snapshot it at module load. */
    const bodyNameOptions = BODY_NAMES.map((name) => String(name).toLowerCase());

    useEffect(() => {
        if (BODY_NAMES.length === 0) {
            InitAstron();
            setBodyListRevision((r) => r + 1);
        }
    }, []);

    useEffect(() => {
        console.log("observation changed, updating fields", observation);
        if (observation) {
            setDelay(observation.delay?.toString());
            setAngleDegrees(Math.floor(observation.angle).toString());
            setAngleMinutes((Math.round(60 * (observation.angle - Math.floor(observation.angle)) * 10) / 10).toString());
            setObserverAltitude(observation.observerAltitude?.toString());
            setBody(
                BODY_NAMES.map((n) => String(n).toLowerCase()).indexOf(
                    observation.object?.toLowerCase() ?? ''
                )
            )
            setIndexError(observation.indexError?.toString());
            setLimb(limbTypeOptions[observation.limbType ? observation.limbType : 0].value);
            setArtificialHorizon(observation.horizon ? observation.horizon === 1 : false);
            const latitude = observation.latitude;
            const longitude = observation.longitude;
            setLatitudeDegrees(Math.floor(Math.abs(latitude)).toString());
            setLatitudeMinutes((((60 * (Math.abs(latitude) - Math.floor(Math.abs(latitude))) * 10) / 10).toFixed(1)).toString());
            setLongitudeDegrees(Math.floor(Math.abs(longitude)).toString());
            setLongitudeMinutes((((60 * (Math.abs(longitude) - Math.floor(Math.abs(longitude))) * 10) / 10).toFixed(1)).toString());
            setNors(latitude > 0 ? 'N' : 'S');
            setEorw(longitude > 0 ? 'E' : 'W');
        }
    }, [observation, limbTypeOptions]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            {/* FAB row: back and night mode side by side at bottom left */}
            <View style={{ position: 'absolute', flexDirection: 'row', left: 10, bottom: 0, zIndex: 101 }}>
                <FAB
                    icon="arrow-left"
                    style={{ margin: 16, backgroundColor: colors.surface }}
                    color={colors.onSurface}
                    onPress={() => {
                        router.back();
                    }}
                    size="small"
                />
                <FAB
                    icon={dark ? 'white-balance-sunny' : 'weather-night'}
                    style={{ margin: 16, backgroundColor: colors.surface }}
                    onPress={() => setNightMode(!dark)}
                    color={colors.onSurface}
                    size="small"
                    accessibilityLabel={dark ? 'Switch to Light Mode' : 'Switch to Night Mode'}
                />
            </View>
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <UTCDateTimePicker
                        value={timeOfObservation}
                        onChange={(d: any) => setTimeOfObservation(d)}
                    />
                    <OutlinedObservationTextInput
                        style={{ width: 80, left: 30 }}
                        dense={true}
                        inputRef={refDelay}
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
                        right={<TextInput.Affix text="s" />}
                    />
                </View>

               <View style={{ flexDirection: 'row' }}>
                    <OutlinedObservationTextInput
                        inputRef={refAngleDegrees}
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
                    <OutlinedObservationTextInput
                        inputRef={refAngleMinutes}
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

                    <OutlinedObservationTextInput
                        inputRef={refIndexError}
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

                    <OutlinedObservationTextInput
                        inputRef={refHeight}
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
                    <View style={{ margin: 2, flex: 1 }}>
                        <OptionSheetPicker
                            label="limb"
                            placeholder="Select limb"
                            options={limbTypeOptions}
                            value={limb}
                            onSelect={(v) => {
                                setLimb(v);
                                const limbIndex = limbTypeOptions.findIndex((o) => o.value === v);
                                updateField('limbType', limbIndex);
                            }}
                        />
                    </View>
                    <View style={{ margin: 2, flex: 1.2 }}>
                        <CelestialBodyPicker
                            label="body"
                            placeholder="Select body"
                            selectedName={
                                body >= 0 && body < bodyNameOptions.length
                                    ? bodyNameOptions[body]
                                    : ''
                            }
                            options={bodyNameOptions}
                            onSelect={(name) => {
                                updateField('object', name);
                                setBody(bodyNameOptions.indexOf(name));
                            }}
                        />
                    </View>
                    <View style={{ margin: 2, flex: 1 }}>
                        <OptionSheetPicker
                            label="horizon"
                            placeholder="Select horizon"
                            options={horizonOptions}
                            value={artificialHorizon ? 'artificial' : 'natural'}
                            onSelect={(v) => {
                                updateField('horizon', v === 'artificial' ? 1 : 0);
                                setArtificialHorizon(v === 'artificial');
                            }}
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <OutlinedObservationTextInput
                        label="latitude"
                        onChangeText={text => setLatitudeDegrees(text)}
                        value={latitudeDegrees}
                        right={<TextInput.Affix text="°" />}
                        inputMode="decimal"
                        inputRef={refLatitudeDegrees}
                        onSubmitEditing={() => refLatitudeMinutes.current?.focus()}
                        selectTextOnFocus={latitudeDegreesGate.selectTextOnFocus}
                        onFocus={latitudeDegreesGate.onFocus}
                        onBlur={() => {
                            const latitude = (Number(latitudeDegrees) + Number(latitudeMinutes) / 60) * (nors === 'N' ? 1 : -1);
                            updateField('latitude', latitude);
                            latitudeDegreesGate.onBlur();
                        }}
                    />
                    <OutlinedObservationTextInput
                        label=" "
                        onChangeText={text => setLatitudeMinutes(text)}
                        value={latitudeMinutes}
                        right={<TextInput.Affix text="′" />}
                        inputMode="decimal"
                        inputRef={refLatitudeMinutes}
                        onSubmitEditing={() => refLongitudeDegrees.current?.focus()}
                        selectTextOnFocus={latitudeMinutesGate.selectTextOnFocus}
                        onFocus={latitudeMinutesGate.onFocus}
                        onBlur={() => {
                            const latitude = (Number(latitudeDegrees) + Number(latitudeMinutes) / 60) * (nors === 'N' ? 1 : -1);
                            updateField('latitude', latitude);
                            latitudeMinutesGate.onBlur();
                        }}
                    />
                    <NSChoice value={nors} onChange={value => {
                        setNors(value);
                        const latitude = (Number(latitudeDegrees) + Number(latitudeMinutes) / 60) * (value === 'N' ? 1 : -1);
                        updateField('latitude', latitude);
                    }} />

                </View>     
                <View style={{ flexDirection: 'row' }}>
                    <OutlinedObservationTextInput
                        label="longitude"
                        onChangeText={text => setLongitudeDegrees(text)}
                        value={longitudeDegrees}
                        right={<TextInput.Affix text="°" />}
                        inputMode="decimal"
                        inputRef={refLongitudeDegrees}
                        onSubmitEditing={() => refLongitudeMinutes.current?.focus()}
                        selectTextOnFocus={longitudeDegreesGate.selectTextOnFocus}
                        onFocus={longitudeDegreesGate.onFocus}
                        onBlur={() => {
                            const longitude = (Number(longitudeDegrees) + Number(longitudeMinutes) / 60) * (eorw === 'E' ? 1 : -1);
                            updateField('longitude', longitude);
                            longitudeDegreesGate.onBlur();
                        }}
                    />
                    <OutlinedObservationTextInput
                        label=" "
                        onChangeText={text => setLongitudeMinutes(text)}
                        value={longitudeMinutes}
                        right={<TextInput.Affix text="′" />}
                        inputMode="decimal"
                        inputRef={refLongitudeMinutes}
                        selectTextOnFocus={longitudeMinutesGate.selectTextOnFocus}
                        onFocus={longitudeMinutesGate.onFocus}
                        onBlur={() => {
                            const longitude = (Number(longitudeDegrees) + Number(longitudeMinutes) / 60) * (eorw === 'E' ? 1 : -1);
                            updateField('longitude', longitude);
                            longitudeMinutesGate.onBlur();
                        }}
                    />
                    <NSChoice value={eorw} onChange={value => {
                        setEorw(value);
                        const longitude = (Number(longitudeDegrees) + Number(longitudeMinutes) / 60) * (value === 'E' ? 1 : -1);
                        updateField('longitude', longitude);
                    }} />
                </View> 

                <View style={{ marginTop: 20, padding: 10, marginLeft: 55, marginRight: 55, borderWidth: 1, borderColor: colors.outline, borderRadius: 8 }}>
                    <Text variant="titleMedium" style={{ marginBottom: 10, color: colors.onSurface }}>Best Matching Objects</Text>
                    {/* Header Row */}
                    <View style={{ flexDirection: 'row', paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: colors.outline }}>
                        <Text style={{ flex: 2, fontWeight: 'bold', color: colors.onSurface }}>Object</Text>
                        <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'center', color: colors.onSurface }}>Difference</Text>
                        <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'center', color: colors.onSurface }}>Azimuth</Text>
                    </View>
                    {/* Data Rows */}
                    {GetBestFitObjects(5).map((obj, index) => (
                        <View key={index} style={{ flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: colors.outline }}>
                            <Text style={{ flex: 2, color: colors.onSurface }}>{obj.name}</Text>
                            <Text style={{ flex: 1, textAlign: 'center', color: colors.onSurface }}>{formatDeg(Number(obj.difference))}</Text>
                            <Text style={{ flex: 1, textAlign: 'center', color: colors.onSurface }}>{Number(obj.azimuth).toFixed(0)}°</Text>
                        </View>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
}
