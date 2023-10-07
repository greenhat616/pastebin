export function classNames(
  ...input: Array<string | null | undefined | false>
): string {
  input = input.filter(Boolean) as string[]
  return input.join(' ')
}
