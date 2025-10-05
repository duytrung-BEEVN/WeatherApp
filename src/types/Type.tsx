export interface cityList {
  id: number;
  name: string;
  country: string;
  time: Date;
  temp_c: number;
  temp_f: number;
  maxtemp_c: number;
  mintemp_c: number;
  note: string;
}

export interface citySearchList {
  id: number;
  name: string;
  region: string;
  country: string;
}
