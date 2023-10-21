import React from 'react'

export default function CodePreviewLayout(props: {
  children: React.ReactNode
  code: React.ReactNode
}) {
  return (
    <>
      {props.children}
      {props.code}
    </>
  )
}
