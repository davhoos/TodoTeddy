import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { TriggerType, RepeatFrequency, TimestampTrigger } from '@notifee/react-native';

interface Ukol {
  id: string;
  text: string;
}

const STORAGE_KEY = '@moje_ukoly';

export default function App() {
  const [textUkolu, setTextUkolu] = useState<string>('');
  const [ukoly, setUkoly] = useState<Ukol[]>([]);

  useEffect(() => {
    nactiUkoly();
    nastavNotifikace();
  }, []);

  useEffect(() => {
    ulozUkoly(ukoly);
  }, [ukoly]);

  // Načtení úkolů z AsyncStorage
  const nactiUkoly = async () => {
    try {
      const ulozeneUkoly = await AsyncStorage.getItem(STORAGE_KEY);
      if (ulozeneUkoly !== null) {
        setUkoly(JSON.parse(ulozeneUkoly));
      }
    } catch (e) {
      Alert.alert('Chyba', 'Nepodařilo se načíst úkoly.');
    }
  };

  // Uložení úkolů do AsyncStorage
  const ulozUkoly = async (noveUkoly: Ukol[]) => {
    try {
      const jsonValue = JSON.stringify(noveUkoly);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      Alert.alert('Chyba', 'Nepodařilo se uložit úkoly.');
    }
  };

  // Přidání nového úkolu
  const pridejUkol = () => {
    if (textUkolu.trim() === '') {
      Alert.alert('Chyba', 'Text úkolu nemůže být prázdný.');
      return;
    }

    const novyUkol: Ukol = {
      id: Date.now().toString(),
      text: textUkolu.trim(),
    };

    setUkoly([...ukoly, novyUkol]);
    setTextUkolu('');
  };

  // Smazání úkolu podle ID
  const smazUkol = (id: string) => {
    const filtrovaneUkoly = ukoly.filter(ukol => ukol.id !== id);
    setUkoly(filtrovaneUkoly);
  };

  // Žádost o oprávnění a naplánování dvou denních notifikací (8:30 a 14:00)
  const nastavNotifikace = async () => {
    try {
      await notifee.requestPermission();

      const channelId = await notifee.createChannel({
        id: 'denni-pripominky',
        name: 'Todo Teddy events',
        importance: 4,
      });

      // --- 1. Ranní notifikace (8:30) ---
      const casRano = new Date();
      casRano.setHours(8, 30, 0, 0);
      if (casRano.getTime() <= Date.now()) {
        casRano.setDate(casRano.getDate() + 1);
      }

      const triggerRano: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: casRano.getTime(),
        repeatFrequency: RepeatFrequency.DAILY,
        alarmManager: true,
      };

      await notifee.createTriggerNotification(
        {
          id: 'pripominka-rano', // Unikátní ID pro ranní notifikaci
          title: 'Dobré ráno! ☀️',
          body: 'Zkontrolujte své úkoly :) ',
          android: { channelId },
        },
        triggerRano
      );

      // --- 2. Odpolední notifikace (14:00) ---
      const casOdpoledne = new Date();
      casOdpoledne.setHours(14, 0, 0, 0);
      if (casOdpoledne.getTime() <= Date.now()) {
        casOdpoledne.setDate(casOdpoledne.getDate() + 1);
      }

      const triggerOdpoledne: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: casOdpoledne.getTime(),
        repeatFrequency: RepeatFrequency.DAILY,
        alarmManager: true,
      };

      await notifee.createTriggerNotification(
        {
          id: 'pripominka-odpoledne', // Unikátní ID pro odpolední notifikaci
          title: 'Odpolední kontrola 📝',
          body: 'Máte nějaké úkoly???',
          android: { channelId },
        },
        triggerOdpoledne
      );

    } catch (error) {
      console.log('Chyba při nastavení notifikací:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.hlavicka}>*** Moje úkoly 📝 🧸 ***</Text>
      
      <View style={styles.vstupniKontejner}>
        <TextInput
          style={styles.vstup}
          placeholder="Napiš nový úkol..."
          value={textUkolu}
          onChangeText={setTextUkolu}
        />
        <TouchableOpacity style={styles.tlacitkoPridat} onPress={pridejUkol}>
          <Text style={styles.textTlacitka}>Přidat</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={ukoly}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.polozkaUkolu}>
            <Text style={styles.textUkolu}>{item.text}</Text>
            <TouchableOpacity style={styles.tlacitkoSmazat} onPress={() => smazUkol(item.id)}>
              <Text style={styles.textSmazat}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  hlavicka: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  vstupniKontejner: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  vstup: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    fontSize: 16,
  },
  tlacitkoPridat: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 8,
  },
  textTlacitka: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  polozkaUkolu: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  textUkolu: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  tlacitkoSmazat: {
    padding: 5,
  },
  textSmazat: {
    fontSize: 18,
  },
});
