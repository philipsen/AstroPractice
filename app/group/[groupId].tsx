import { updateGroup } from '@/helpers/GroupRepository';
import { GroupEntity } from '@/models/GroupEntity';
import * as Location from 'expo-location';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, Pressable, View } from 'react-native';
import { FAB, IconButton, Surface, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { DegsFormat } from '../../helpers/astron/init';
import { deleteObservation, getLatestObservation, newObservation, updateLocation } from '../../helpers/ObservationRepository';
import { getErrorMessage } from '../../helpers/Utilities';
import { ObservationEntity } from '../../models/ObservationEntity';

export default function Group() {
    const groupId = Number(useLocalSearchParams().groupId);
    const db = useSQLiteContext();
    const [observations, setObservations] = useState<ObservationEntity[]>([]);
    const [group, setGroup] = useState<GroupEntity>();

    const getGroup = useCallback(async () => {
        const result = await db.getFirstAsync<GroupEntity>(
            'SELECT * FROM groups WHERE id = ?',
            [groupId]
        );
        if (result) {
            setGroup(result);
        }
    }, [db, groupId]);

    useFocusEffect(
        useCallback(() => {
            getGroup();
        }, [getGroup])
    );

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const refetchItems = useCallback(() => {
        // console.log("get location");
        async function getCurrentLocation() {
            try {
                // console.log("get permission");
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }

                const servicesEnabled = await Location.hasServicesEnabledAsync();
                if (!servicesEnabled) {
                    setErrorMsg('Location services are disabled. Please enable them in settings.');
                    return;
                }
                // console.log("service enabled");
                // console.log("get last known location");
                let loc = await Location.getLastKnownPositionAsync();
                if (!loc) {
                    console.log("getting current location");
                    loc = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced,
                        // timeout: 10000, // 10 second timeout
                        // maximumAge: 60000, // Accept location up to 1 minute old
                    });
                }
                // console.log('Location:', loc);
                setLocation(loc);
                setErrorMsg(null); // Clear any previous errors
            } catch (error) {
                console.error('Location error:', error);
                setErrorMsg(`Location unavailable: ${getErrorMessage(error)}`);
            }
        }
        getCurrentLocation();

        async function refetch() {
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
    }, [db, groupId]);

    useFocusEffect(
        useCallback(() => {
            refetchItems();
        }, [])
    );

    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ margin: 16, gap: 8 }}>
                <Text variant="titleMedium">Group Name</Text>
                <TextInput
                    value={group?.name || ''}
                    onChangeText={async (text) => await setGroup(prev => prev ? { ...prev, name: text } : undefined)}
                    mode="outlined"
                    placeholder="Enter group name"
                    onBlur={async () => {
                        if (group) {
                            await updateGroup(group, db);
                        }
                    }}
                />

                <Text variant="titleMedium">Description</Text>
                <TextInput
                    value={group?.description || ''}
                    onChangeText={async (text) => await setGroup(prev => prev ? { ...prev, description: text } : undefined)}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    placeholder="Enter group description"
                    onBlur={async () => {
                        if (group) {
                            await updateGroup(group, db);
                        }
                    }}
                />
            </View>

            <FlatList
                data={observations}
                renderItem={({ item }) =>
                    <Surface style={{ elevation: 8, borderRadius: 12, margin: 6, padding: 8 }}>
                        <Pressable onPress={() => router.push(`/observation/${item.id}`)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text> {item.object}, {DegsFormat(item.angle)}</Text>
                                <Text> {new Date(item.created).toLocaleString()} </Text>
                                <IconButton
                                    mode="contained"
                                    onPress={async () => {
                                        await deleteObservation(db, item.id)
                                        refetchItems();
                                    }}
                                    icon="delete"
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
                style={{ position: 'absolute', margin: 16, right: 10, bottom: 0 }}
                onPress={() => { router.push(`/chart/${groupId}`) }}
            />
            <FAB
                icon="plus"
                size="small"
                style={{ position: 'absolute', margin: 16, right: 60, bottom: 0 }}
                onPress={async () => {
                    const observationId = await addObservation(location)
                    router.push(`/observation/${observationId}`)
                }}
            />
            <FAB
                icon="arrow-left"
                size="small"
                style={{ position: 'absolute', margin: 16, left: 10, bottom: 0 }}
                onPress={() => router.back()}
            />    
        </SafeAreaView>
    );

    async function addObservation(location: Location.LocationObject | null): Promise<number> {
        console.log("Add observation to group", groupId)
        const lastObservation = await getLatestObservation(db, groupId);
        const result = await newObservation(db, groupId, lastObservation);
        console.log("Added observation with id:", result.lastInsertRowId, location?.coords.latitude, location?.coords.longitude);
        if (location) {
            await updateLocation(db, location, result);
        } else {
            console.log("No location data available to update observation");
        }
        refetchItems();
        return result.lastInsertRowId;
    }
}


