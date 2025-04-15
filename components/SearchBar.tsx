import { View, TextInput } from 'react-native';

export default function SearchBar() {
    return (
        <View style={{ padding: 10 }}>
            <TextInput
                placeholder="시장 및 상점 검색"
                style={{
                    backgroundColor: '#f0f0f0',
                    borderRadius: 10,
                    paddingHorizontal: 15,
                    height: 40,
                }}
            />
        </View>
    );
}