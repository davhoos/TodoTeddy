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
      Alert.alert('Chyba', 'Nepodařilo se načíst úkoly z paměti.');
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
        <TouchableOpacity style={styles.tlacitkoPridat} onPress={pridejUkol}>
          <Text style={styles.textTlacitka}>Pridat</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={ukoly}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.polozkaUkolu}>
            <Text style={styles.textUkolu}>{item.text}</Text>
            {/* Samostatné tlačítko pro smazání s křížkem */}
            <TouchableOpacity 
              style={styles.tlacitkoSmazat} 
              onPress={() => smazUkol(item.id)}
            >
              <Text style={styles.textKrizku}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  kontejner: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  nadpis: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
    flexDirection: 'row', // Seřadí text a křížek vedle sebe
    justifyContent: 'space-between', // Text vlevo, křížek vpravo
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
    flex: 1, // Text zabere maximum místa a neodtlačí křížek ven z obrazovky
    marginRight: 10,
  },
  tlacitkoSmazat: {
    padding: 5, // Větší dotyková plocha pro snadnější kliknutí
  },
  textKrizku: {
    fontSize: 16,
  },
});
