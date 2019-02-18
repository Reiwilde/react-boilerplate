import React, { ComponentType, Props } from 'react'

let id = -1
const rendered: Array<boolean> = []

const styles: Array<string> = []

export default styles

export function withStyles<P = Props<{}>> (Component: ComponentType<P>, css: string) {
  if (typeof window !== 'undefined') {
    return function WithStyles (props: P) {
      return <Component {...props} />
    }
  }

  ++id

  return function WithStyles (props: P) {
    if (!rendered[id]) {
      rendered[id] = true
      styles.push(css)
    }

    return <Component {...props} />
  }
}
