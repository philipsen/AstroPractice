import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Button, FAB, Surface, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import InitAstron from '../src/helpers/astron/init';
import { addGroupAsync, deleteGroupAsync } from '../src/helpers/GroupRepository';
import { exportAllData, importAllData } from '../src/helpers/ImportExport';
import { GroupEntity } from '../src/models/GroupEntity';


InitAstron();

export default function Groups() {
    const db = useSQLiteContext();

    const [groups, setGroups] = useState<GroupEntity[]>([]);
    const [text, setText] = useState('');
    const [description, setDescription] = useState('');

    const refetchItems = useCallback(() => {
        async function refetch() {
            const res = await db.withExclusiveTransactionAsync(async () => {
                const fetchedGroups = await db.getAllAsync<GroupEntity>(
                    'SELECT * FROM groups ORDER BY created DESC;',
                    []
                );
                setGroups(fetchedGroups);
            const mostRecentGroup = fetchedGroups.length > 0 ? fetchedGroups[0] : null; 
            setDescription(mostRecentGroup ? mostRecentGroup.description : '');
                return fetchedGroups; // Return the data from the transaction
            });
        }
        refetch();
    }, [db]);
    useFocusEffect(
        useCallback(() => {
            refetchItems();
        }, [refetchItems])
    );
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
                size="small"
            />
            <FAB
                icon="import"
                style={{ position: 'absolute', margin: 16, right: 130, bottom: 0, zIndex: 1000 }}
                onPress={async () => {
                    await importAllData(db);
                    await refetchItems();
                }}
                label="Import"
                size="small"
            />
        </SafeAreaView>
    );
}
