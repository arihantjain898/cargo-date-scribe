
export interface AllFilesRecord {
  id: string;
  customer: string;
  file: 'ES' | 'IS' | 'DT' | 'EA' | 'IA' | 'ET' | string;
  number: string;
  originPort: string;
  originState: string;
  destinationPort: string;
  destinationCountry: string;
  container20: string;
  container40: string;
  roro: string;
  lcl: string;
  air: string;
  truck: string;
  ssl: string;
  nvo: string;
  comments: string;
  salesContact: string;
  archived?: boolean | string;
  userId?: string;
}
