
import type { Tender } from './types';

export const KEY_POINTS: string[] = [
  "Flow rates above 500 GPM should consider a Folda-Tank operation.",
  "Attempt 2 Folda-Tanks during high GPM emergencies.",
  "Remember to time the first tender's Turnaround Time.",
  "Manifolds should be used at fill sites.",
  "Clearly mark supply corridors."
];

export const GPM_QUICK_GLANCE_DATA: { time: string; gpm: string }[] = [
  { time: "10Min", gpm: "300GPM" },
  { time: "15min", gpm: "200GPM" },
  { time: "20min", gpm: "150GPM" },
  { time: "25min", gpm: "120GPM" },
  { time: "30min", gpm: "100GPM" },
  { time: "35min", gpm: "85GPM" },
  { time: "40min", gpm: "75GPM" },
  { time: "45min", gpm: "65GPM" },
  { time: "50min", gpm: "60GPM" },
  { time: "60min", gpm: "50GPM" },
];

export const TENDER_DATA: Tender[] = [
  { id: "T-37", station: "D25", tankCapacity: 3000, pumpGpm: 1000, quickDump: "YES - REAR", foldATank: true, foldATankSize: 2500 },
  { id: "T-37A", station: "D25", tankCapacity: 4500, pumpGpm: 750, quickDump: "YES - REAR", foldATank: false, foldATankSize: null },
  { id: "T38", station: "D24", tankCapacity: 1500, pumpGpm: 1000, quickDump: "YES - REAR", foldATank: false, foldATankSize: null },
  { id: "T39", station: "D24", tankCapacity: 2500, pumpGpm: 500, quickDump: "YES - REAR", foldATank: true, foldATankSize: 3000 },
  { id: "T49", station: "D21", tankCapacity: 3000, pumpGpm: 500, quickDump: "REAR - JET SYPHON", foldATank: false, foldATankSize: null },
  { id: "TE50", station: "D21", tankCapacity: 2850, pumpGpm: 1000, quickDump: "YES - REAR", foldATank: true, foldATankSize: 3000 },
  { id: "T60", station: "D15", tankCapacity: 3000, pumpGpm: 1000, quickDump: "YES - S/R", foldATank: true, foldATankSize: 3500 },
  { id: "T65", station: "Marys.", tankCapacity: 3500, pumpGpm: 1000, quickDump: "YES - REAR", foldATank: false, foldATankSize: null },
  { id: "T68", station: "D22", tankCapacity: 2500, pumpGpm: 1000, quickDump: "YES - S/R", foldATank: true, foldATankSize: 3500 },
  { id: "T85", station: "D16", tankCapacity: 2800, pumpGpm: 500, quickDump: "YES - REAR", foldATank: true, foldATankSize: 3000 },
  { id: "T87", station: "D17", tankCapacity: 3000, pumpGpm: 1250, quickDump: "YES - S/R", foldATank: true, foldATankSize: 3000 },
  { id: "T90", station: "NCRFA", tankCapacity: 2850, pumpGpm: 500, quickDump: "YES - REAR", foldATank: true, foldATankSize: 3000 },
  { id: "T94", station: "D19", tankCapacity: 3000, pumpGpm: 1250, quickDump: "YES - S/R", foldATank: true, foldATankSize: 3500 },
  { id: "T95", station: "D19", tankCapacity: 2500, pumpGpm: 500, quickDump: "YES - REAR", foldATank: true, foldATankSize: 3000 },
  { id: "T96", station: "NCRFA", tankCapacity: 2800, pumpGpm: 1000, quickDump: "YES - REAR", foldATank: true, foldATankSize: 3000 },
  { id: "T97", station: "NCRFA", tankCapacity: 2800, pumpGpm: 1000, quickDump: "YES - REAR", foldATank: true, foldATankSize: 3000 },
  { id: "T1-2", station: "Camano", tankCapacity: 2750, pumpGpm: 1250, quickDump: "YES - S/R", foldATank: true, foldATankSize: 3000 },
  { id: "T1-3", station: "Camano", tankCapacity: 2800, pumpGpm: 750, quickDump: "YES - S/R", foldATank: true, foldATankSize: 3000 },
  { id: "T1-4", station: "Camano", tankCapacity: 2800, pumpGpm: 750, quickDump: "YES - SIDE", foldATank: true, foldATankSize: 2900 },
  { id: "T1-5", station: "Camano", tankCapacity: 2750, pumpGpm: 1250, quickDump: "YES - S/R", foldATank: true, foldATankSize: 3000 },
  { id: "T312", station: "Conway", tankCapacity: 2500, pumpGpm: 1250, quickDump: "YES - REAR", foldATank: false, foldATankSize: null },
  { id: "T316", station: "Conway", tankCapacity: 3500, pumpGpm: 500, quickDump: "YES - REAR", foldATank: true, foldATankSize: 3500 },
];
