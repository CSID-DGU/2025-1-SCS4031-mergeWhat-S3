import { View, Text } from 'react-native';

export default function MapPlaceholder() {
    return (
        <View style={{ flex: 1, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#555' }}>지도 영역 (카카오맵)</Text>
        </View>
    );
}