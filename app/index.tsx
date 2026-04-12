import { useGroupsStore } from '@/src/state/useGroupsStore';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Button, FAB, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import { useAndroidNavBarFabOffset } from '@/src/hooks/useAndroidNavBarFabOffset';
import { SafeAreaView } from 'react-native-safe-area-context';
import InitAstron from '../src/helpers/astron/init';
import { importAllData } from '../src/helpers/ImportExport';
import { useNightMode } from '../src/state/NightModeContext';


export default function HomeScreen() {
    InitAstron();

    const { setNightMode } = useNightMode();
    const { colors, dark } = useTheme();
    const hydrate = useGroupsStore((s: any) => s.hydrate);
    const groups = useGroupsStore((s: any) => s.groups);
    const add = useGroupsStore((s: any) => s.add);
    const deleteGroup = useGroupsStore((s) => s.delete);
    const [name, setName] = useState("");
    const [description, setDescription] = useState('');
    const androidNavFabOffset = useAndroidNavBarFabOffset();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{ flex: 1, padding: 16 }}>
                {/* Night mode FAB moved to bottom left */}
                <TextInput
                    onChangeText={(name) => setName(name)}
                    onSubmitEditing={async () => {
                        const n = name.trim();
                        if (!n) return;
                        const g = await add(n, description);
                        setName("");
                    }}
                    label="name of group?"
                    value={name}
                    style={{ color: colors.onSurface, backgroundColor: colors.surface }}
                />
                <TextInput
                    onChangeText={(text) => setDescription(text)}
                    label="group location?"
                    value={description}
                    style={{ marginBottom: 10, color: colors.onSurface, backgroundColor: colors.surface }}
                />
                <FlatList
                    data={groups}
                    renderItem={({ item }) =>
                        <View>
                            <Surface style={{ elevation: 20, borderRadius: 12, margin: 4, padding: 8, backgroundColor: colors.surface }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Link href={`/group/${item.id}`}>
                                        <Text variant="headlineSmall" style={{ color: colors.primary }}>
                                            {item.name}
                                        </Text>
                                    </Link>
                                    <Text variant="bodyMedium" style={{ color: colors.onSurface }}>
                                        {new Date(item.created).toLocaleDateString()}
                                    </Text>
                                    <Button
                                        icon="delete"
                                        onPress={async () => {
                                            console.log("Delete group", item.id)
                                            await deleteGroup(item.id);
                                            //refetchItems();
                                        }}
                                        labelStyle={{ color: colors.onSurface }}
                                    >Delete</Button>
                                </View>
                                <Text style={{ color: colors.onSurface }}> {item.description} </Text>
                            </Surface>
                        </View>
                    }
                    keyExtractor={item => item.id.toString()}
                />
            </View>
            {/* <FAB
                icon="export"
                style={{ position: 'absolute', margin: 16, right: 10, bottom: 0, zIndex: 1000 }}
                onPress={() => exportAllData(db)}
                label="Export"
                size="small"
            /> */}
            <FAB
                icon={dark ? 'white-balance-sunny' : 'weather-night'}
                style={{ position: 'absolute', margin: 16, left: 10, bottom: androidNavFabOffset, zIndex: 1000, backgroundColor: colors.surface }}
                onPress={() => setNightMode(!dark)}
                color={colors.onSurface}
                accessibilityLabel={dark ? 'Switch to Light Mode' : 'Switch to Night Mode'}
                size="small"
            />
            <FAB
                icon="import"
                style={{ position: 'absolute', margin: 16, left: 80, bottom: androidNavFabOffset, zIndex: 1000, backgroundColor: colors.surface }}
                color={colors.onSurface}
                onPress={async () => {
                    await importAllData(() => {
                        hydrate(); // Reload groups after import is confirmed and completed
                    });
                }}
                size="small"
            />
            {!dark && (
                <FAB
                    icon="delete-sweep"
                    style={{ position: 'absolute', margin: 16, left: 170, bottom: androidNavFabOffset, zIndex: 1000 }}
                    onPress={async () => {
                        console.log('Clear All pressed');
                        const clear = useGroupsStore.getState().deleteAll;
                        await clear();
                        console.log('All groups cleared, hydrating...');
                        hydrate();
                    }}
                    size="small"
                />
            )}
        </SafeAreaView>
    );
}
