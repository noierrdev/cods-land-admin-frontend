import { configureStore } from '@reduxjs/toolkit'
import testReducer from './reducers/test.reducer'
export default configureStore({
  reducer: {
    testReducer
  }
})