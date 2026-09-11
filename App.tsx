import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";

import { Libro } from "./src/models/Libro";
import { LibroService } from "./src/services/LibroService";

const servicio = new LibroService();

export default function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [anio, setAnio] = useState("");
  const [libros, setLibros] = useState<Libro[]>([]);

  const agregarLibro = () => {
    if (titulo === "" || autor === "" || anio === "") {
      return;
    }

    const nuevoLibro = new Libro(
      Date.now(),
      titulo,
      autor,
      Number(anio)
    );

    servicio.agregarLibro(nuevoLibro);
    setLibros([...servicio.obtenerLibros()]);

    setTitulo("");
    setAutor("");
    setAnio("");
  };

  const eliminarLibro = (id: number) => {
    servicio.eliminarLibro(id);
    setLibros([...servicio.obtenerLibros()]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Libros</Text>

      <TextInput
        style={styles.input}
        placeholder="Título del libro"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={styles.input}
        placeholder="Autor"
        value={autor}
        onChangeText={setAutor}
      />

      <TextInput
        style={styles.input}
        placeholder="Año"
        value={anio}
        onChangeText={setAnio}
        keyboardType="numeric"
      />

      <Button
        title="Agregar libro"
        onPress={agregarLibro}
      />

      <FlatList
        data={libros}
        keyExtractor={(item) => item.getId().toString()}
        renderItem={({ item }) => (
          <View style={styles.libro}>
            <Text style={styles.nombre}>
              {item.getTitulo()}
            </Text>

            <Text>Autor: {item.getAutor()}</Text>
            <Text>Año: {item.getAnio()}</Text>

            <Button
              title="Eliminar"
              onPress={() => eliminarLibro(item.getId())}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f5f5f5",
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "white",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },

  libro: {
    backgroundColor: "white",
    padding: 15,
    marginTop: 15,
    borderRadius: 8,
  },

  nombre: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
});