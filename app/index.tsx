import { useGroupsStore } from '@/src/state/useGroupsStore';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Button, FAB, Surface, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import InitAstron from '../src/helpers/astron/init';
import { importAllData } from '../src/helpers/ImportExport';


InitAstron();

export default function Groups() {

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
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 16 }}>
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
                />
                <TextInput
                    onChangeText={(text) => setDescription(text)}
                    label="group location?"
                    value={description}
                    style={{ marginBottom: 10 }}
                />
                <FlatList
                    data={groups}
                    renderItem={({ item }) =>
                        <View>
                            <Surface style={{ elevation: 20, borderRadius: 12, margin: 4, padding: 8 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Link href={`/group/${item.id}`}>
                                        <Text variant="headlineSmall" style={{ color: 'blue' }}>
                                            {item.name}
                                        </Text>
                                    </Link>
                                    <Text variant="bodyMedium"
                                    > {new Date(item.created).toLocaleDateString()} </Text>
                                    <Button
                                        icon="delete"
                                        onPress={async () => {
                                            console.log("Delete group", item.id)
                                            await deleteGroup(item.id);
                                            //refetchItems();
                                        }}>Delete</Button>
                                </View>
                                <Text> {item.description} </Text>
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
                style={{ position: 'absolute', margin: 16, right: 130, bottom: 0, zIndex: 1000 }}
                onPress={async () => {
                    await importAllData();
                    hydrate();
                }}
                label="Import"
                size="small"
            />
            <FAB
                icon="delete-sweep"
                style={{ position: 'absolute', margin: 16, right: 250, bottom: 0, zIndex: 1000 }}
                onPress={async () => {
                    const clear = useGroupsStore.getState().deleteAll;
                    await clear();
                }}
                label="Clear All"
                size="small"
            />
        </SafeAreaView>
    );
}
