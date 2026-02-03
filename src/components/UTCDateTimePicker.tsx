import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import {
  Card,
  Divider,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';

export default function UTCDateTimePicker({ value, onChange }) {
  const [visible, setVisible] = useState(false);
  const [showNativePicker, setShowNativePicker] = useState(false);

  const initial = value ? new Date(value) : new Date();

  const [date, setDate] = useState(initial);
  const [hours, setHours] = useState(initial.getUTCHours());
  const [minutes, setMinutes] = useState(initial.getUTCMinutes());
  const [seconds, setSeconds] = useState(initial.getUTCSeconds());

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const onNativeChange = (event, selectedDate) => {
    setShowNativePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const confirm = () => {
    const utc = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes,
        seconds
      )
    );

    onChange && onChange(utc);
    close();
  };

  const pad = (n) => String(n).padStart(2, "0");

  const formatted = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate()
  )} ${pad(hours)}:${pad(minutes)}:${pad(seconds)} UTC`;

  return (
    <View>
      {/* PRESSABLE STRING */}
      <Pressable onPress={open}>
        <Text style={{ textDecorationLine: "underline" }}>
          {formatted}
        </Text>
      </Pressable>

      <Portal>
        <Modal visible={visible} onDismiss={close}>
          <Card style={{ margin: 20, padding: 20 }}>
            {/* DATE PICKER */}
            <Text variant="titleMedium">Select Date</Text>

            <Pressable onPress={() => setShowNativePicker(true)}>
              <Text style={{ marginTop: 10, textDecorationLine: "underline" }}>
                {date.toISOString().substring(0, 10)}
              </Text>
            </Pressable>

            {showNativePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="calendar"
                onChange={onNativeChange}
              />
            )}

            <Divider style={{ marginVertical: 20 }} />

            <Text variant="titleMedium">Select Time (24h)</Text>

            {/* HOURS */}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <Text style={{ width: 80 }}>Hours</Text>
              <IconButton icon="minus" onPress={() => setHours((h) => (h + 23) % 24)} />
              <TextInput
                value={hours.toString()}
                onChangeText={(text) => {
                  let h = parseInt(text, 10);
                  if (isNaN(h) || h < 0) h = 0;
                  if (h > 23) h = 23;
                  setHours(h);
                }}
                style={{ width: 50, height: 40, marginHorizontal: 10 }}
                keyboardType="numeric"
                dense={true}
              ></TextInput>
              <IconButton icon="plus" onPress={() => setHours((h) => (h + 1) % 24)} />
            </View>

            {/* MINUTES */}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <Text style={{ width: 80 }}>Minutes</Text>
              <IconButton icon="minus" onPress={() => setMinutes((m) => (m + 59) % 60)} />
              {/* <Text>{pad(minutes)}</Text> */}
              <TextInput
                value={minutes.toString()}
                onChangeText={(text) => {
                  let m = parseInt(text, 10);
                  if (isNaN(m) || m < 0) m = 0;
                  if (m > 59) m = 59;
                  setMinutes(m);
                }}
                style={{ width: 50, height: 40, marginHorizontal: 10 }}
                keyboardType="numeric"
                dense={true}
              ></TextInput>
              <IconButton icon="plus" onPress={() => setMinutes((m) => (m + 1) % 60)} />
            </View>

            {/* SECONDS */}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <Text style={{ width: 80 }}>Seconds</Text>
              <IconButton icon="minus" onPress={() => setSeconds((s) => (s + 59) % 60)} />
              <TextInput
                dense={true}
                value={seconds.toString()}
                onChangeText={(text) => {
                  let s = parseInt(text, 10);
                  if (isNaN(s) || s < 0) s = 0;
                  if (s > 59) s = 59;
                  setSeconds(s);
                }}
                style={{ width: 50, height: 40, marginHorizontal: 10 }}
                keyboardType="numeric"
              ></TextInput> 
              {/* <Text>{pad(seconds)}</Text> */}
              <IconButton icon="plus" onPress={() => setSeconds((s) => (s + 1) % 60)} />
            </View>

            <Divider style={{ marginVertical: 20 }} />

            <Pressable onPress={confirm}>
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                Confirm UTC
              </Text>
            </Pressable>
          </Card>
        </Modal>
      </Portal>
    </View>
  );
}
