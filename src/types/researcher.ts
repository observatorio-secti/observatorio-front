export interface Bolsista {
  modality_code: string;
}

export interface Researcher {
  id: string;
  lattes_id?: string;
  name: string;
  university: string;
  area: string;
  city: string;
  graduation: string;
  subsidy?: Bolsista[];
}

