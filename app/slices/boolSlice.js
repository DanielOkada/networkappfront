import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const boolSlice = createSlice({
        name: 'completed',
        initialState,
        reducers: {
          setTrue: (state) => {
            state.value = true
          },
          setFalse: (state) => {
            state.value = false
          },
        },
      })

// Action creators are generated for each case reducer function
export const { setTrue, setFalse } = boolSlice.actions

export default boolSlice.reducer