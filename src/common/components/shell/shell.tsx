import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'

import { withStyles } from '@libs/webpack-utils/style-loader'

import styles from './shell.css'

function Shell () {
  return (
    <Fragment>
      <Route path='/' exact component={() => <div>ROOT</div>} />
      <Route path='/test' component={() => <div>TEST</div>} />
    </Fragment>
  )
}

export default withStyles(Shell, styles.css)
