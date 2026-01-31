import { Text, View } from "react-native";

const rowStyle = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
  marginVertical: 4,
  marginRight: 10,
  marginStart: 10,
};

function KVRow({
  label,
  value,
}: {
  label: string;
  value: string;
  labelWidth: number;
  bold?: boolean;
}) {
  return (
    <View style={rowStyle}>
      <Text> {label} </Text>
      <Text> {value} </Text>
    </View>
  );
}
function KVRow3({
  label,
  value,
}: {
  label: string;
  value: string;
  labelWidth: number;
  bold?: boolean;
}) {
  return (
    <View style={rowStyle}>
      <Text>{label}</Text>
      <Text>{value}</Text>
      <Text>{" "}</Text>
    </View>
  );
}

export { KVRow, KVRow3 };
