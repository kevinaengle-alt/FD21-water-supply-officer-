
export interface Tender {
  id: string;
  station: string;
  tankCapacity: number;
  pumpGpm: number;
  quickDump: string;
  foldATank: boolean;
  foldATankSize: number | null;
}

export interface WaterSupplyUnit {
  id: string;
  unit: string;
  location: string;
  assignment: string;
}

export interface WaterSupply {
  id: string;
  type: string;
  location: string;
  turnAroundTime: string;
}
