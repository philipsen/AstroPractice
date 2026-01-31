import { useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "react-native-paper";

type Props = {
    value: 'N' | 'S' | 'E' | 'W';
    onChange: (value: 'N' | 'S' | 'E' | 'W') => void;
}

export default function NSChoice({ value, onChange }: Props) {
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
        <View>
            <Pressable onPress={() => {
                setVal(toggle(val));
                onChange(toggle(val));
            }}>
                <Text>{val}</Text>
            </Pressable>
        </View>
    );
}