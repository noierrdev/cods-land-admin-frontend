import AppContext from "./AppContext";
import {BrowserRouter} from 'react-router-dom'
import AppRoutes from './routes'

import {createTheme,ThemeProvider} from '@mui/material/styles'

import {Provider} from 'react-redux'
import store from './store'

function App() {
  const theme=createTheme({
    palette:{
      mode:'light'
    }
  })
  return (
    <AppContext.Provider value={{}} >
      <Provider store={store} >
        <ThemeProvider theme={theme} >
          <BrowserRouter>
            <AppRoutes testprop={`kkk`} />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </AppContext.Provider>
  );
}

export default App;
