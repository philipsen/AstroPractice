import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { documentDirectory } from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { SQLiteDatabase } from "expo-sqlite";
import { Alert } from "react-native";
import { GroupEntity } from "../models/groupEntity";
import { ObservationEntity } from "../models/observationEntity";
export async function exportAllData(db: SQLiteDatabase) {
  try {
    // Get all groups
    const allGroups = await db.getAllAsync<GroupEntity>(
      "SELECT * FROM groups ORDER BY created DESC;",
      [],
    );

    // Get all observations
    const allObservations = await db.getAllAsync<ObservationEntity>(
      "SELECT * FROM observations ORDER BY created DESC;",
      [],
    );

    const exportData = {
      exportDate: new Date().toISOString(),
      version: "1.0",
      groups: allGroups,
      observations: allObservations,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    console.log("All data exported:", jsonString.length, "characters");

    // Check if sharing is available
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert("Error", "Sharing is not available on this platform");
      return;
    }

    // Write JSON data to a temporary file
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileUri = documentDirectory + `astro_export_${timestamp}.json`;
    await FileSystem.writeAsStringAsync(fileUri, jsonString);
    console.log("File written to:", fileUri);

    // Share the file
    await Sharing.shareAsync(fileUri, {
      mimeType: "application/json",
      dialogTitle: "Export All Astro Data",
      UTI: "public.json",
    });
  } catch (error) {
    console.error("Export error:", error);
    Alert.alert(
      "Export Error",
      `Failed to export data: ${getErrorMessage(error)}`,
    );
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
}

export async function importAllData(db: SQLiteDatabase) {
  try {
    // Pick a JSON file
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return;
    }

    // Read the file
    const fileContent = await FileSystem.readAsStringAsync(
      result.assets[0].uri,
    );
    const importData = JSON.parse(fileContent);

    // Validate the data structure
    if (!importData.groups || !importData.observations) {
      Alert.alert(
        "Invalid File",
        "The selected file does not contain valid Astro data.",
      );
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      "Import Data",
      `This will import ${importData.groups.length} groups and ${importData.observations.length} observations. Existing data will be preserved. Continue?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Import",
          onPress: async () => {
            try {
              await db.withExclusiveTransactionAsync(async () => {
                // Get the maximum existing group ID to avoid overlaps
                const maxGroupIdResult = await db.getFirstAsync<{
                  maxId: number;
                }>(`SELECT COALESCE(MAX(id), 0) as maxId FROM groups`);
                const maxObsIdResult = await db.getFirstAsync<{
                  maxId: number;
                }>(`SELECT COALESCE(MAX(id), 0) as maxId FROM observations`);

                let nextGroupId = (maxGroupIdResult?.maxId || 0) + 1;
                let nextObsId = (maxObsIdResult?.maxId || 0) + 1;

                // Create mapping from old group IDs to new group IDs
                const groupIdMapping: { [oldId: number]: number } = {};

                // Import groups with new IDs
                for (const group of importData.groups) {
                  const newGroupId = nextGroupId++;
                  groupIdMapping[group.id] = newGroupId;

                  await db.runAsync(
                    `INSERT INTO groups (id, name, description, created) VALUES (?, ?, ?, ?)`,
                    [newGroupId, group.name, group.description, group.created],
                  );
                }

                // Import observations with remapped group IDs and new observation IDs
                for (const obs of importData.observations) {
                  const newGroupId = groupIdMapping[obs.groupId];
                  if (newGroupId) {
                    // Only import if the group was successfully imported
                    await db.runAsync(
                      `INSERT INTO observations (id, groupId, created, angle, delay, indexError, observerAltitude, limbType, horizon, object, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                      [
                        nextObsId++,
                        newGroupId,
                        obs.created,
                        obs.angle,
                        obs.delay,
                        obs.indexError,
                        obs.observerAltitude,
                        obs.limbType,
                        obs.horizon,
                        obs.object,
                        obs.latitude,
                        obs.longitude,
                      ],
                    );
                  }
                }
              });

              //refetchItems();
              Alert.alert(
                "Success",
                "Data imported successfully with remapped IDs!",
              );
            } catch (error) {
              console.error("Import error:", error);
              Alert.alert(
                "Import Error",
                `Failed to import data: ${getErrorMessage(error)}`,
              );
            }
          },
        },
      ],
    );
  } catch (error) {
    console.error("Import error:", error);
    Alert.alert(
      "Import Error",
      `Failed to read file: ${getErrorMessage(error)}`,
    );
  }
}
