import { useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "react-native-paper";

type Props = {
    value: 'N' | 'S' | 'E' | 'W';
    onChange: (value: 'N' | 'S' | 'E' | 'W') => void;
    nightMode?: boolean;
}

export default function NSChoice({ value, onChange, nightMode }: Props) {
    function toggle(v: string) {
        switch (v) {
            case 'N':
                return 'S';
            case 'S':
                return 'N';
            case 'W':
                return 'E';
            default:
                return 'W';
        }
    }
    const [val, setVal] = useState(value);
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 8, margin: 2, padding: 8, borderWidth: 1, borderRadius: 5, borderColor: nightMode ? 'red' : '#000' }}>
            <Pressable onPress={() => {
                setVal(toggle(val));
                onChange(toggle(val));
            }}>
                <Text style={{ color: nightMode ? 'red' : '#000' }}>{val}</Text>
            </Pressable>
        </View>
    );
}