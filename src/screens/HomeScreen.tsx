import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LibroRepository } from '../repositories/LibroRepository';
import { Libro } from '../models/Libro';
import { AuthService } from '../services/AuthService';

export default function HomeScreen() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [anio, setAnio] = useState('');

  const libroRepo = LibroRepository.getInstance();

  const cargarLibros = async () => {
    try {
      const data = await libroRepo.obtenerLibros();
      setLibros(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los libros.');
    }
  };

  useEffect(() => {
    cargarLibros();
  }, []);

  const handleAgregar = async () => {
    if (!titulo || !autor || !anio) {
      Alert.alert('Campos vacíos', 'Por favor completa todos los campos del libro.');
      return;
    }

    try {
      // Instancia de la clase Libro con ID 0 para que Supabase lo autogenere
      const nuevoLibro = new Libro(0, titulo, autor, parseInt(anio, 10));
      await libroRepo.agregarLibro(nuevoLibro);
      
      setTitulo('');
      setAutor('');
      setAnio('');
      cargarLibros();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el libro.');
    }
  };

  const handleEliminar = async (id?: number) => {
    if (!id) return;
    try {
      await libroRepo.eliminarLibro(id);
      cargarLibros();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el libro.');
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.cerrarSesion();
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Libros</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder="Título" 
          placeholderTextColor="#888" 
          value={titulo} 
          onChangeText={setTitulo} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Autor" 
          placeholderTextColor="#888" 
          value={autor} 
          onChangeText={setAutor} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Año" 
          placeholderTextColor="#888" 
          value={anio} 
          onChangeText={setAnio} 
          keyboardType="numeric" 
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAgregar}>
          <Text style={styles.addButtonText}>Agregar Libro</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={libros}
        keyExtractor={(item) => item.getId().toString()}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <View>
              <Text style={styles.bookTitle}>{item.getTitulo()}</Text>
              <Text style={styles.bookAuthor}>{item.getAutor()} ({item.getAnio()})</Text>
            </View>
            <TouchableOpacity onPress={() => handleEliminar(item.getId())}>
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  logoutButton: { backgroundColor: '#ff3b30', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  form: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  input: { backgroundColor: '#f9f9f9', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 6, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  addButton: { backgroundColor: '#34c759', padding: 12, borderRadius: 6, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bookItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  bookAuthor: { fontSize: 14, color: '#666', marginTop: 2 },
  deleteText: { color: '#ff3b30', fontWeight: 'bold' },
});