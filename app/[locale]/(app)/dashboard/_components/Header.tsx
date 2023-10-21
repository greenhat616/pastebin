import React from 'react'

export default function Header({
  text,
  heading,
  children
}: {
  text?: React.ReactNode
  heading: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-2">
        <h1 className="font-heading font-bold text-3xl md:text-4xl">
          {heading}
        </h1>
        {text && <p className="text-lg text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  )
}
