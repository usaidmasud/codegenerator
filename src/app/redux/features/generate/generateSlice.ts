import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type TData = {
  kode: string;
  nama: string;
  jenis: string;
};

const tempData: TData[] = [
  {
    kode: "",
    nama: "nama barang satu",
    jenis: "jenis",
  },
  {
    kode: "",
    nama: "nama barang dua",
    jenis: "jenis",
  },
  {
    kode: "",
    nama: "nama test 3",
    jenis: "Laptop",
  },
  {
    kode: "",
    nama: "nama barang dua",
    jenis: "Komputer",
  },
  {
    kode: "",
    nama: "nama waduh le",
    jenis: "jenis",
  },
  {
    kode: "",
    nama: "nama waduh le",
    jenis: "jenis",
  },
  {
    kode: "",
    nama: "nama waduh le",
    jenis: "jenis",
  },
  {
    kode: "",
    nama: "nama waduh le",
    jenis: "jenis",
  },
  {
    kode: "",
    nama: "nama waduh le",
    jenis: "jenis",
  },
];
// Define a type for the slice state
interface GenereateState {
  value: number;
  loading: boolean;
  rowsOriginal: TData[];
  rowsGenerated: TData[];
}

// Define the initial state using that type
const initialState: GenereateState = {
  value: 0,
  loading: false,
  rowsGenerated: [],
  rowsOriginal: [],
};

export const generateSlice = createSlice({
  name: "generate",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setGeneratedData: (state, action: PayloadAction<TData[]>) => {
      state.rowsGenerated = action.payload;
    },
    setOriginalData: (state, action: PayloadAction<TData[]>) => {
      state.rowsOriginal = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
  setGeneratedData,
  setOriginalData,
  setLoading,
} = generateSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.generate.value;

export default generateSlice.reducer;
