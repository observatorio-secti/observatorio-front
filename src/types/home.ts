export interface VisaoPrograma {
  article: number;
  book: number;
  book_chapter: number;
  brand: number;
  patent: number;
  researcher: number;
  software: number;
  work_in_event: number;
}

export interface ScholarshipMetrics {
  modality_code: string;
  category_level_code: string;
  count: number;
}

export interface HomeQuantData {
  visaoPrograma: VisaoPrograma | null;
  scholarships: ScholarshipMetrics[] | null;
}

export interface SecondWordItem {
  word: string;
  freq: number;
}
