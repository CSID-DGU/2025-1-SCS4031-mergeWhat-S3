import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Keyword = {id: number; text: string};

export default function useRecentKeywords() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);

  useEffect(() => {
    loadKeywords();
  }, []);

  const loadKeywords = async () => {
    const stored = await AsyncStorage.getItem('recentKeywords');
    if (stored) setKeywords(JSON.parse(stored));
  };

  const saveKeywords = async (newKeywords: Keyword[]) => {
    setKeywords(newKeywords);
    await AsyncStorage.setItem('recentKeywords', JSON.stringify(newKeywords));
  };

  const addKeyword = async (text: string) => {
    if (!text.trim()) return;
    const exists = keywords.find(k => k.text === text);
    if (exists) return;

    const newKeyword: Keyword = {id: Date.now(), text};
    const updated = [newKeyword, ...keywords].slice(0, 10); // 최대 10개 제한
    await saveKeywords(updated);
  };

  const removeKeyword = async (id: number) => {
    const updated = keywords.filter(k => k.id !== id);
    await saveKeywords(updated);
  };

  const clearKeywords = async () => {
    await saveKeywords([]);
  };

  return {keywords, addKeyword, removeKeyword, clearKeywords};
}
