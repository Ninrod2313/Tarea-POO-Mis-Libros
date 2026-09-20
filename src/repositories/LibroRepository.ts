import { Libro } from "../models/Libro";

export class LibroRepository {
  private static instancia: LibroRepository;

  private libros: Libro[] = [
    new Libro(1, "El Principito", "Antoine de Saint-Exupéry", 1943),
    new Libro(2, "Don Quijote", "Miguel de Cervantes", 1605)
  ];

  private constructor() {}

  public static getInstance(): LibroRepository {
    if (!LibroRepository.instancia) {
      LibroRepository.instancia = new LibroRepository();
    }

    return LibroRepository.instancia;
  }

  public obtenerLibros(): Libro[] {
    return this.libros;
  }

  public agregarLibro(libro: Libro): void {
    this.libros.push(libro);
  }

  public eliminarLibro(id: number): void {
    this.libros = this.libros.filter(
      libro => libro.getId() !== id
    );
  }
}