import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const sheetSelectedSlice = createSlice({
        name: 'sheetSelected',
        initialState,
        reducers: {
          sheetSelectedTrue: (state) => {
            state.value = true
          },
          sheetSelectedFalse: (state) => {
            state.value = false
          },
        },
      })

// Action creators are generated for each case reducer function
export const { sheetSelectedTrue, sheetSelectedFalse } = sheetSelectedSlice.actions

export default sheetSelectedSlice.reducer