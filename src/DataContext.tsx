import React, { createContext, useContext, useState, useEffect } from 'react';
import { TrafficData, TrafficStore } from './types';
import * as XLSX from 'xlsx';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface DataContextType extends TrafficStore {
  addData: (data: Omit<TrafficData, 'total'>) => Promise<void>;
  setYear: (year: number) => void;
  exportToExcel: () => void;
  Charts: ChartData;
  setCharts: React.Dispatch<React.SetStateAction<ChartData>>;
}

interface ChartData {
  FLASH: string;
  EMERGENCY: string;
  OPIMMEDIATE: string;
  PRIORITY: string;
  ROUTINE: string;
  TOPSECRET: string;
  SECRET: string;
  CONFIDENTIAL: string;
  RESTRICTED: string;
  UNCLASSIFICATION: string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TrafficStore>({
    data: [],
    selectedYear: new Date().getFullYear()
  });

  const [Charts, setCharts] = useState<ChartData>(() => {
    const savedCharts = localStorage.getItem('chartsData');
    return savedCharts ? JSON.parse(savedCharts) : {
      FLASH: '0',
      EMERGENCY: '0',
      OPIMMEDIATE: '0',
      PRIORITY: '0',
      ROUTINE: '0',
      TOPSECRET: '0',
      SECRET: '0',
      CONFIDENTIAL: '0',
      RESTRICTED: '0',
      UNCLASSIFICATION: '0',
    };
  });

  useEffect(() => {
    fetchData();
  }, [state.selectedYear]);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/traffic/${state.selectedYear}`);
      setState(prev => ({ ...prev, data: response.data }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await axios.get(`${API_URL}/charts/latest`);
      console.log('Fetched Chart Data:', response.data);

      if (response.data && Object.keys(response.data).length > 0) {
        setCharts(response.data);
        localStorage.setItem('chartsData', JSON.stringify(response.data)); // Save to local storage
      } else {
        console.warn('No chart data found');
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const addData = async (newData: Omit<TrafficData, 'total'>) => {
    try {
      const response = await axios.post(`${API_URL}/traffic`, newData);
      if (response.status === 201) {
        await fetchData(); // Refresh data after successful addition
        return Promise.resolve();
      } else {
        throw new Error('Failed to add data');
      }
    } catch (error: any) {
      console.error('Error adding data:', error);
      return Promise.reject(error);
    }
  };

  const setYear = (year: number) => {
    setState(prev => ({ ...prev, selectedYear: year }));
  };

  const exportToExcel = () => {
    if (state.data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(state.data, {
      header: ["month", "inbound", "outbound", "total", "year"]
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Traffic Data");
    XLSX.writeFile(workbook, `traffic_data_${state.selectedYear}.xlsx`);
  };

  useEffect(() => {
    localStorage.setItem('chartsData', JSON.stringify(Charts));

    const saveChartData = async () => {
      if (Object.values(Charts).every(value => value === "0")) return; // Prevent saving empty data

      try {
        await axios.post(`${API_URL}/charts`, Charts);
        console.log('Chart data saved:', Charts);
      } catch (error) {
        console.error('Error saving chart data:', error);
      }
    };

    saveChartData();
  }, [Charts]);

  return (
    <DataContext.Provider value={{ ...state, addData, setYear, exportToExcel, Charts, setCharts }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
