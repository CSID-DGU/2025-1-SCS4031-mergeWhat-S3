import { View, Text, FlatList } from 'react-native';

const dummyData = [
    { id: '1', name: '광장시장 맛집' },
    { id: '2', name: '시장 근처 주차장' },
];

export default function NearbyList() {
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={dummyData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{
                        padding: 10,
                        borderBottomWidth: 1,
                        borderColor: '#eee',
                        backgroundColor: 'white',
                    }}>
                        <Text style={{ fontSize: 16 }}>{item.name}</Text>
                    </View>
                )}
            />
        </View>
    );
}