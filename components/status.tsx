export type EmptyPlaceholderProps = {
  text: string
  className?: string
  iconClassName?: string
  textClassName?: string
}

export function EmptyPlaceholder(props: EmptyPlaceholderProps) {
  return (
    <div className={classNames('rounded-2xl', props.className)}>
      <div className="flex items-center h-[150px] justify-center">
        <ISolarInboxLinear
          width={50}
          height={50}
          className={classNames('text-gray-200', props.iconClassName)}
        />
      </div>

      <h2
        className={classNames(
          'text-center text-sm text-gray-400',
          props.textClassName
        )}
      >
        {props.text}
      </h2>
    </div>
  )
}
