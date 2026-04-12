import { Text, View } from "react-native";
import { useTheme } from "react-native-paper";

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
}: {
  label: string;
  value: string;
  labelWidth: number;
  bold?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={rowStyle}>
      <Text style={{ color: colors.onSurface, fontWeight: bold ? 'bold' : undefined }}> {label} </Text>
      <Text style={{ color: colors.onSurface, fontWeight: bold ? 'bold' : undefined }}> {value} </Text>
    </View>
  );
}
function KVRow3({
  label,
  value,
  labelWidth,
  bold,
}: {
  label: string;
  value: string;
  labelWidth: number;
  bold?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={rowStyle}>
      <Text style={{ color: colors.onSurface, fontWeight: bold ? 'bold' : undefined }}>{label}</Text>
      <Text style={{ color: colors.onSurface, fontWeight: bold ? 'bold' : undefined }}>{value}</Text>
      <Text>{" "}</Text>
    </View>
  );
}

export { KVRow, KVRow3 };
