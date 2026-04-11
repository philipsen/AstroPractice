import { useGroupsStore } from '@/src/state/useGroupsStore';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Button, FAB, Surface, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import InitAstron from '../src/helpers/astron/init';
import { importAllData } from '../src/helpers/ImportExport';
import { useNightMode } from '../src/state/NightModeContext';


export default function HomeScreen() {
    InitAstron();

    const { nightMode, setNightMode } = useNightMode();
    const hydrate = useGroupsStore((s: any) => s.hydrate);
    const groups = useGroupsStore((s: any) => s.groups);
    const add = useGroupsStore((s: any) => s.add);
    const deleteGroup = useGroupsStore((s) => s.delete);
    const [name, setName] = useState("");
    const [description, setDescription] = useState('');

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: nightMode ? '#000' : '#fff' }}>
            <View style={{ flex: 1, padding: 16 }}>
                <Button
                    icon={nightMode ? 'weather-night' : 'white-balance-sunny'}
                    mode="contained"
                    style={{ marginBottom: 16, backgroundColor: nightMode ? '#111' : '#eee' }}
                    labelStyle={{ color: nightMode ? 'red' : '#000' }}
                    onPress={() => setNightMode(!nightMode)}
                >
                    {nightMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
                </Button>
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
                    style={{ color: nightMode ? 'red' : '#000', backgroundColor: nightMode ? '#111' : '#fff' }}
                    theme={{
                        colors: {
                            onSurface: nightMode ? 'red' : '#000',
                            primary: nightMode ? 'red' : '#000',
                            background: nightMode ? '#181818' : '#fff',
                            placeholder: nightMode ? 'red' : '#888'
                        }
                    }}
                />
                <TextInput
                    onChangeText={(text) => setDescription(text)}
                    label="group location?"
                    value={description}
                    style={{ marginBottom: 10, color: nightMode ? 'red' : '#000', backgroundColor: nightMode ? '#111' : '#fff' }}
                    theme={{
                        colors: {
                            onSurface: nightMode ? 'red' : '#000',
                            primary: nightMode ? 'red' : '#000',
                            background: nightMode ? '#181818' : '#fff',
                            placeholder: nightMode ? 'red' : '#888'
                        }
                    }}
                />
                <FlatList
                    data={groups}
                    renderItem={({ item }) =>
                        <View>
                            <Surface style={{ elevation: 20, borderRadius: 12, margin: 4, padding: 8, backgroundColor: nightMode ? '#111' : '#fff' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Link href={`/group/${item.id}`}>
                                        <Text variant="headlineSmall" style={{ color: nightMode ? 'red' : 'blue' }}>
                                            {item.name}
                                        </Text>
                                    </Link>
                                    <Text variant="bodyMedium" style={{ color: nightMode ? 'red' : '#000' }}>
                                        {new Date(item.created).toLocaleDateString()}
                                    </Text>
                                    <Button
                                        icon="delete"
                                        onPress={async () => {
                                            console.log("Delete group", item.id)
                                            await deleteGroup(item.id);
                                            //refetchItems();
                                        }}
                                        labelStyle={{ color: nightMode ? 'red' : '#000' }}
                                    >Delete</Button>
                                </View>
                                <Text style={{ color: nightMode ? 'red' : '#000' }}> {item.description} </Text>
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
                icon="import"
                style={{ position: 'absolute', margin: 16, right: 13, bottom: 0, zIndex: 1000 }}
                onPress={async () => {
                    await importAllData(() => {
                        hydrate(); // Reload groups after import is confirmed and completed
                    });
                }}
                label="Import"
                size="small"
            />
            <FAB
                icon="delete-sweep"
                style={{ position: 'absolute', margin: 16, left: 10, bottom: 0, zIndex: 1000 }}
                onPress={async () => {
                    console.log('Clear All pressed');
                    const clear = useGroupsStore.getState().deleteAll;
                    await clear();
                    console.log('All groups cleared, hydrating...');
                    hydrate();
                }}
                label="Clear All"
                size="small"
            />
        </SafeAreaView>
    );
}
