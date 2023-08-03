import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null,
}

export const networkDataSlice = createSlice({
        name: 'networkData',
        initialState,
        reducers: {
          setData: (state, data) => {
            state.data = data
          },
        },
      })

// Action creators are generated for each case reducer function
export const { setData } = networkDataSlice.actions

export default networkDataSlice.reducer