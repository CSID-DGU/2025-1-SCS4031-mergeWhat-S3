import { View, TextInput, NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native';

type SearchBarProps = {
    value: string;
    onChangeText: (text: string) => void;
    onSearch?: () => void;
};

export default function SearchBar({ value, onChangeText, onSearch }: SearchBarProps) {
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
                value={value}
                onChangeText={onChangeText}
                returnKeyType="search"
                // TextInput 이 기대하는 서명: (e) => void
                onSubmitEditing={(
                    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
                ) => {
                    onSearch?.();
                }}
            />
        </View>
    );
}