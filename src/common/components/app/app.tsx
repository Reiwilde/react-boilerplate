
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

import store from '@common/store'
import Shell from '@components/shell'

export default function App () {
  useEffect(() => {
    const jss = document.getElementById('jss-ssr')

    if (jss && jss.parentNode) {
      jss.parentNode.removeChild(jss)
    }
  })

  // Create a sheetsManager instance.
  const sheetsManager = new Map()

  // Create a theme instance.
  const theme = createMuiTheme({
    typography: {
      useNextVariants: true
    }
  })

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
        <Shell />
      </MuiThemeProvider>
    </Provider>
  )
}
