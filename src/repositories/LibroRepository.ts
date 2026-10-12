import { supabase } from '../lib/supabase';
import { Libro } from "../models/Libro";

export class LibroRepository {
  private static instancia: LibroRepository;

  private constructor() {}

  public static getInstance(): LibroRepository {
    if (!LibroRepository.instancia) {
      LibroRepository.instancia = new LibroRepository();
    }
    return LibroRepository.instancia;
  }

  public async obtenerLibros(): Promise<Libro[]> {
    const { data, error } = await supabase
      .from('libros')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error al obtener libros:', error.message);
      throw error;
    }

    return (data || []).map(
      (item: any) => new Libro(item.id, item.titulo, item.autor, item.anio)
    );
  }

  // Recibe directamente una instancia de la clase Libro
  public async agregarLibro(libro: Libro): Promise<void> {
    const { error } = await supabase
      .from('libros')
      .insert([
        {
          titulo: libro.getTitulo(),
          autor: libro.getAutor(),
          anio: libro.getAnio(),
        },
      ]);

    if (error) {
      console.error('Error al agregar libro:', error.message);
      throw error;
    }
  }

  public async eliminarLibro(id: number): Promise<void> {
    const { error } = await supabase
      .from('libros')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar libro:', error.message);
      throw error;
    }
  }
}