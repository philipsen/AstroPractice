import { getDb } from '@/src/db/db';
import { getCurrentLocation } from '@/src/helpers/location';
import { useGroupsStore } from '@/src/state/useGroupsStore';
import { ObservationEntity } from '@/src/types/ObservationEntity';
import * as Location from 'expo-location';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, View } from 'react-native';
import { FAB, IconButton, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import { useAndroidNavBarFabOffset } from '@/src/hooks/useAndroidNavBarFabOffset';
import { SafeAreaView } from "react-native-safe-area-context";
import { formatAngleDegreesMinutes } from "@/src/helpers/formatAngleDegreesMinutes";
import { deleteObservation, getLatestObservation, newObservation, updateLocation } from '../../src/helpers/ObservationRepository';
import { useNightMode } from '../../src/state/NightModeContext';

export default function Group() {
    const { setNightMode } = useNightMode();
    const { colors, dark } = useTheme();
    const groupId = Number(useLocalSearchParams().groupId);
    const select = useGroupsStore((s: any) => s.select);
    const getById = useGroupsStore((s: any) => s.getById);
    const updateGroup = useGroupsStore((s: any) => s.update);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    useEffect(() => {
        // hydrate();
        select(groupId);
        // setGroup(getById(groupId));
        const g = getById(groupId);

        console.log("selected: ", groupId, g);
        setName(g?.name || "");
        setDescription(g?.description || "");
    }, [groupId]);


    const [observations, setObservations] = useState<ObservationEntity[]>([]);

    const refetchItems = useCallback(async () => {
        const loc = await getCurrentLocation();
        if (loc) setLocation(loc);
        async function refetch() {
            console.log("Refetching observations for group", groupId);
            const db = await getDb();
            await db.withExclusiveTransactionAsync(async () => {
                setObservations(
                    await db.getAllAsync<ObservationEntity>(
                        'SELECT * FROM observations WHERE groupId = ? ORDER BY created DESC;',
                        [groupId]
                    )
                );
            });
        }
        refetch();
    }, [groupId]);

    useFocusEffect(
        useCallback(() => {
            refetchItems();
        }, [])
    );

    const router = useRouter();
    const androidNavFabOffset = useAndroidNavBarFabOffset();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{ margin: 16, gap: 8 }}>
                <Text variant="titleMedium" style={{ color: colors.onSurface }}>Group Name</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    placeholder="Enter group name"
                    onBlur={async () => {
                        updateGroup(groupId, name, description);
                    }}
                />

                <Text variant="titleMedium" style={{ color: colors.onSurface }}>Description</Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    placeholder="Enter group description"
                    onBlur={async () => {
                        updateGroup(groupId, name, description);
                    }}
                />
            </View>

            <FlatList
                data={observations}
                renderItem={({ item }) =>
                    <Surface style={{ elevation: 8, borderRadius: 12, margin: 6, padding: 8, backgroundColor: colors.surface }}>
                        <Pressable onPress={() => router.push(`/observation/${item.id}`)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ color: colors.onSurface }}> {item.object}, {formatAngleDegreesMinutes(item.angle)}</Text>
                                <Text style={{ color: colors.onSurface }}> {new Date(item.created).toLocaleString()} </Text>
                                <IconButton
                                    mode="contained"
                                    onPress={async () => {
                                        const db = await getDb();
                                        await deleteObservation(db, item.id)
                                        refetchItems();
                                    }}
                                    icon="delete"
                                    style={{ borderRadius: 20 }}
                                    iconColor={colors.onSurface}
                                />
                            </View>
                        </Pressable>
                    </Surface>
                }
                keyExtractor={item => item.id.toString()}
            />
            <FAB
                icon="map"
                size="small"
                style={{ position: 'absolute', margin: 16, right: 10, bottom: androidNavFabOffset, backgroundColor: colors.surface }}
                color={colors.onSurface}
                onPress={() => { router.push(`/chart/${groupId}`) }}
            />
            <FAB
                icon="plus"
                size="small"
                style={{ position: 'absolute', margin: 16, right: 60, bottom: androidNavFabOffset, backgroundColor: colors.surface }}
                color={colors.onSurface}
                onPress={async () => {
                    const observationId = await addObservation(location)
                    router.push(`/observation/${observationId}`)
                }}
            />
            <FAB
                icon="arrow-left"
                size="small"
                style={{ position: 'absolute', margin: 16, left: 10, bottom: androidNavFabOffset, backgroundColor: colors.surface }}
                color={colors.onSurface}
                onPress={() => router.back()}
            />
            <FAB
                icon={dark ? 'white-balance-sunny' : 'weather-night'}
                size="small"
                style={{ position: 'absolute', margin: 16, left: 70, bottom: androidNavFabOffset, backgroundColor: colors.surface }}
                color={colors.onSurface}
                onPress={() => setNightMode(!dark)}
                accessibilityLabel={dark ? 'Switch to Light Mode' : 'Switch to Night Mode'}
            />
        </SafeAreaView>
    );

    async function addObservation(location: Location.LocationObject | null): Promise<number> {
        // console.log("Add observation to group", groupId)
        const db = await getDb();
        const lastObservation = await getLatestObservation(db, groupId);
        const result = await newObservation(db, groupId, lastObservation);
        // console.log("Added observation with id:", result.lastInsertRowId, location?.coords.latitude, location?.coords.longitude);
        if (location) {
            await updateLocation(db, location, result);
        } else {
            console.log("No location data available to update observation");
        }
        refetchItems();
        return result.lastInsertRowId;
    }
}


