import { Libro } from "../models/Libro";

export class LibroService {
  private libros: Libro[] = [];

  public agregarLibro(libro: Libro): void {
    this.libros.push(libro);
  }

  public eliminarLibro(id: number): void {
    this.libros = this.libros.filter((libro) => libro.getId() !== id);
  }

  public obtenerLibros(): Libro[] {
    return this.libros;
  }
}
