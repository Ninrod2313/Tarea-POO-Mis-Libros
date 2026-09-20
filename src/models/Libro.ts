export class Libro {
  private id: number;
  private titulo: string;
  private autor: string;
  private anio: number;

  constructor(id: number, titulo: string, autor: string, anio: number) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.anio = anio;
  }

  public getId(): number {
    return this.id;
  }

  public getTitulo(): string {
    return this.titulo;
  }

  public getAutor(): string {
    return this.autor;
  }

  public getAnio(): number {
    return this.anio;
  }

  public mostrarInformacion(): string {
    return `${this.titulo} - ${this.autor} (${this.anio})`;
  }
}