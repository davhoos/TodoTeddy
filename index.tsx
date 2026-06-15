import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  Alert,
  BackHandler,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  }, []);

  useEffect(() => {
    ulozUkoly(ukoly);
  }, [ukoly]);

  const nactiUkoly = async () => {
    try {
      const ulozeneUkoly = await AsyncStorage.getItem(STORAGE_KEY);
      if (ulozeneUkoly !== null) {
        setUkoly(JSON.parse(ulozeneUkoly));
      }
    } catch (chyba) {
      Alert.alert('Chyba', 'Nepodařilo se načíst z paměti.');
    }
  };

  const ulozUkoly = async (noveUkoly: Ukol[]) => {
    try {
      const jsonHodnota = JSON.stringify(noveUkoly);
      await AsyncStorage.setItem(STORAGE_KEY, jsonHodnota);
    } catch (chyba) {
      Alert.alert('Chyba', 'Nepodařilo se uložit úkoly.');
    }
  };

  const pridejUkol = () => {
    if (textUkolu.trim() === '') return;
    
    const novyUkol: Ukol = {
      id: Date.now().toString(),
      text: textUkolu,
    };

    setUkoly([...ukoly, novyUkol]);
    setTextUkolu('');
  };

  const smazUkol = (id: string) => {
    setUkoly(ukoly.filter(ukol => ukol.id !== id));
  };

  // Funkce pro zavření aplikace
  const zavritAplikaci = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else {
      Alert.alert(
        'Ukončení aplikace', 
        'Systém iOS nedovoluje aplikacím zavírat se X. Pro ukončení použijte gesto plochy - švih...'
      );
    }
  };

  return (
    <SafeAreaView style={styles.kontejner}>
      {/* Horní lišta s nadpisem a zavíracím křížkem */}
      <View style={styles.listaNahore}>
        <Text style={styles.nadpis}>Moje úkoly 📝 🧸</Text>
        <TouchableOpacity style={styles.tlacitkoZavritApp} onPress={zavritAplikaci}>
          <Text style={styles.textZavritApp}>✕</Text>
        </TouchableOpacity>
      </View>
      
      {/* Hlavní obsah pod lištou */}
      <View style={styles.obsah}>
        <View style={styles.formular}>
          <TextInput
            style={styles.vstup}
            placeholder="Napiš úkol..."
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
              <TouchableOpacity 
                style={styles.tlacitkoSmazat} 
                onPress={() => smazUkol(item.id)}
              >
                <Text style={styles.textKrizku}>❌</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  kontejner: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0, // Ošetření horního panelu u Androidu
  },
  listaNahore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Jemná linka pod lištou
    backgroundColor: '#fafafa', // Mírně šedé pozadí lišty
  },
  obsah: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tlacitkoZavritApp: {
    padding: 10, // Větší oblast pro kliknutí prstem
  },
  textZavritApp: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#8B0000', // Tmavě červená barva křížku
  },
  nadpis: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formular: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  vstup: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40,
  },
  tlacitkoPridat: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
    height: 40,
  },
  textTlacitka: {
    color: '#fff',
    fontWeight: 'bold',
  },
  polozkaUkolu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  textUkolu: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  tlacitkoSmazat: {
    padding: 5,
  },
  textKrizku: {
    fontSize: 18,
  },
});
