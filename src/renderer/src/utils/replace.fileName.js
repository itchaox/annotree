import dayjs from 'dayjs'
import { placeholdersUtilDay } from './replace.util.day'

export function placeholders ({ now } = {}) {
  return [
    ...placeholdersUtilDay({ now })
  ]
}

export function replace (userString) {
  let result = userString
  placeholders({ now: dayjs() }).forEach(placeholder => {
    result = result.replace(RegExp('{' + placeholder.name + '}', 'g'), placeholder.function())
  })
  return result
}
