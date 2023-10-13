import { readdir } from 'node:fs/promises'

export async function getDictionaries(path: string) {
  return (await readdir(path, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
}
