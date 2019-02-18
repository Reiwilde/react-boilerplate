import React from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from '@common/components/app'

const client = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

hydrate(client, document.getElementById('app'), () => console.log('App rendered.'))
