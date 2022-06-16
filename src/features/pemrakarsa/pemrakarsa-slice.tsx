import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBentukUsaha } from "../bentuk-usaha/bentuk-usaha-slice";

export interface IPemrakarsa {
    id: String;
    bentukUsaha: IBentukUsaha;
    
}