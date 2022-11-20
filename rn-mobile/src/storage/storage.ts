import AsyncStorage from '@react-native-async-storage/async-storage';

type Key = 'token';

export const storeData = async (key: Key, value: unknown) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Don't know why fail
  }
};

export const getData = async (key: Key): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }

    return null;
  } catch {
    // Don't know why fail
    return null;
  }
};
