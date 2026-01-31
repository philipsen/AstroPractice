
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Button, FAB, Surface, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import InitAstron from '../helpers/astron/init';
import { addGroupAsync, deleteGroupAsync } from '../helpers/groupRepository';
import { exportAllData, importAllData } from '../helpers/importExport';
import { GroupEntity } from '../models/groupEntity';


InitAstron();

export default function Groups() {
    const db = useSQLiteContext();

    const [groups, setGroups] = useState<GroupEntity[]>([]);
    const [text, setText] = useState('');
    const [description, setDescription] = useState('');

    const refetchItems = useCallback(() => {
        async function refetch() {
            await db.withExclusiveTransactionAsync(async () => {
                setGroups(
                    await db.getAllAsync<GroupEntity>(
                        'SELECT * FROM groups ORDER BY created DESC;',
                        []
                    )
                );
            });
        }
        refetch();
    }, [db]);

    useEffect(() => {
        refetchItems();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={{ flex: 1, padding: 16 }}>
                <TextInput
                    onChangeText={(text) => setText(text)}
                    onSubmitEditing={async () => {
                        await addGroupAsync(db, text, description);
                        await refetchItems();
                        setText('');
                    }}
                    label="name of group?"
                    value={text}
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
                                    {/* <Link href={`/group/${item.id}`}>
                                        <Text variant="headlineSmall" style={{ color: 'blue' }}>
                                            {item.name}
                                        </Text>
                                    </Link> */}
                                    <Text variant="bodyMedium"
                                    > {new Date(item.created).toLocaleDateString()} </Text>
                                    <Button
                                        icon="delete"
                                        onPress={async () => {
                                            console.log("Delete group", item.id)
                                            await deleteGroupAsync(db, item.id);
                                            refetchItems();
                                        }}>Delete</Button>
                                </View>
                                <Text> {item.description} </Text>
                            </Surface>
                        </View>
                    }
                    keyExtractor={item => item.id.toString()}
                />
            </View>
            <FAB
                icon="export"
                style={{ position: 'absolute', margin: 16, right: 10, bottom: 0, zIndex: 1000 }}
                onPress={() => exportAllData(db)}
                label="Export"
            />
            <FAB
                icon="import"
                style={{ position: 'absolute', margin: 16, right: 130, bottom: 0, zIndex: 1000 }}
                onPress={async () => {
                    await importAllData(db);
                    await refetchItems();
                }}
                label="Import"
            />
        </SafeAreaView>
    );
}
