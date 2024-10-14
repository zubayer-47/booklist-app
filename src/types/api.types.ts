interface Person {
  birth_year: number | null;
  death_year: number | null;
  name: string;
}

interface Format {
  [key: string]: string; // MIME-type as key, URL as value
}

export interface Book {
  id: number;
  title: string;
  subjects: string[];
  authors: Person[];
  translators: Person[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean | null;
  media_type: string;
  formats: Format;
  download_count: number;

  // custom
  wishlisted?: boolean;
}
