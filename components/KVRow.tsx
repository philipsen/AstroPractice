import { Text, View } from "react-native";

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
    <View style={{ flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginVertical: 4 ,
    marginRight: 10,
    marginStart: 10,}}>
      <Text
      >
        {label}
      </Text>
      <Text
        >
        {value}
      </Text>
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
    <View style={{ flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginVertical: 4 ,
    marginRight: 10,
    marginStart: 10,}}>
      <Text
      >
        {label}
      </Text>
      <Text
      >
        {value}
      </Text>
      <Text>
        {" "}
      </Text>
    </View>
  );
}
export { KVRow, KVRow3 };
