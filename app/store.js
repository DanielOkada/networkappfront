"use client"
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import boolReducer from './slices/boolSlice'
import sheetReducer from './slices/sheetSelectedSlice'
import networkDataReducer from './slices/networkDataSlice'


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    completed: boolReducer,
    sheetSelected: sheetReducer,
    netWorkData: networkDataReducer,
  },
})