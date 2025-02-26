export interface TrafficData {
  month: string;
  inbound: number;
  outbound: number;
  total: number;
  year: number;
}

export interface TrafficStore {
  data: TrafficData[];
  selectedYear: number;
}