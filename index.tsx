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
// Importujeme knihovnu pro ukládání dat
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Ukol {
  id: string;
  text: string;
}

// Klíč, pod kterým budou úkoly uložené v paměti Samsungu
const STORAGE_KEY = '@moje_ukoly';

export default function App() {
  const [textUkolu, setTextUkolu] = useState<string>('');
  const [ukoly, setUkoly] = useState<Ukol[]>([]);

  // 1. Načtení úkolů při spuštění aplikace
  useEffect(() => {
    nactiUkoly();
  }, []);

  // 2. Uložení úkolů pokaždé, když se seznam úkolů změní
  useEffect(() => {
    ulozUkoly(ukoly);
  }, [ukoly]);

  // Funkce pro načtení z paměti telefonu
  const nactiUkoly = async () => {
    try {
      const ulozeneUkoly = await AsyncStorage.getItem(STORAGE_KEY);
      if (ulozeneUkoly !== null) {
        setUkoly(JSON.parse(ulozeneUkoly));
      }
    } catch (chyba) {
      Alert.alert('Chyba', 'Nepodařilo se načíst úkoly z paměti.');
    }
  };

  // Funkce pro uložení do paměti telefonu
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

  return (
    <SafeAreaView style={styles.kontejner}>
      <Text style={styles.nadpis}>*** Moje Úkoly 📝 ***</Text>
      
      <View style={styles.formular}>
        <TextInput 
          style={styles.vstup} 
          placeholder="Napiš úkol..." 
          value={textUkolu}
          onChangeText={setTextUkolu}
        />
        <TouchableOpacity style={styles.tlacitko} onPress={pridejUkol}>
          <Text style={styles.textTlacitka}>Přidat</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={ukoly}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => smazUkol(item.id)}>
            <View style={styles.polozkaUkolu}>
              <Text style={styles.textUkolu}>{item.text}</Text>
              <Text style={styles.ikonaSmazat}>❌</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  kontejner: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  nadpis: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formular: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  vstup: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tlacitko: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  textTlacitka: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  polozkaUkolu: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  textUkolu: {
    fontSize: 16,
    flex: 1,
  },
  ikonaSmazat: {
    fontSize: 16,
  },
});
