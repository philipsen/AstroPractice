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
  labelWidth,
  bold,
  nightMode,
}: {
  label: string;
  value: string;
  labelWidth: number;
  bold?: boolean;
  nightMode?: boolean;
}) {
  const textColor = nightMode ? '#ff3333' : undefined;
  return (
    <View style={rowStyle}>
      <Text style={textColor ? { color: textColor, fontWeight: bold ? 'bold' : undefined } : bold ? { fontWeight: 'bold' } : undefined}> {label} </Text>
      <Text style={textColor ? { color: textColor, fontWeight: bold ? 'bold' : undefined } : bold ? { fontWeight: 'bold' } : undefined}> {value} </Text>
    </View>
  );
}
function KVRow3({
  label,
  value,
  labelWidth,
  bold,
  nightMode,
}: {
  label: string;
  value: string;
  labelWidth: number;
  bold?: boolean;
  nightMode?: boolean;
}) {
  const textColor = nightMode ? '#ff3333' : undefined;
  return (
    <View style={rowStyle}>
      <Text style={textColor ? { color: textColor, fontWeight: bold ? 'bold' : undefined } : bold ? { fontWeight: 'bold' } : undefined}>{label}</Text>
      <Text style={textColor ? { color: textColor, fontWeight: bold ? 'bold' : undefined } : bold ? { fontWeight: 'bold' } : undefined}>{value}</Text>
      <Text>{" "}</Text>
    </View>
  );
}

export { KVRow, KVRow3 };
