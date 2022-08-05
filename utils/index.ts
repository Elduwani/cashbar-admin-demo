import { differenceInDays, differenceInMonths, differenceInWeeks, format, formatRelative } from "date-fns";
import { _SelectInputOption } from '@components/Select'
import { z } from 'zod'

export function metricPrefix(number: number, units?: [string, string, string, string]) {
   if (invalidNumbers([number])) return '0.00'

   const num = Math.abs(number)
   //Must start from largest number so it doesn't return lower true condition
   if (num > 999999999) return (Math.sign(num) * (num / 1000000000)).toFixed(1) + (units?.[0] ?? 'B')
   if (num > 999999) return (Math.sign(num) * (num / 1000000)).toFixed(1) + (units?.[1] ?? 'M')
   if (num > 999) return String(Math.sign(num) * (num / 1000)) + (units?.[2] ?? 'K')
   return String(Math.sign(num) * num) + (units?.[3] ?? "")
}

export function formatDate(date: string | Date, year = true, time = false) {
   //so every function uses the same date format to avoid differences
   try {
      const d = new Date(date)
      return format(d, `${!year ? "dd MMMM" : "dd MMM, yyyy"}${time ? " - hh:mm a" : ""}`)
   } catch (error) {
      return date as string
   }
}

export function formatSplitDate(date: string) {
   try {
      const d = new Date(date)
      return [format(d, `dd MMM`), format(d, `YYY`)]
   } catch (error) {
      console.log(error)
      return date
   }
}

export function getTimeDifference(endDate: string, startDate?: string) {
   if (endDate) {
      const now = startDate ? new Date(startDate) : new Date()
      const then = new Date(endDate)
      //Sat May 23 2020 23:51:52 GMT+0100 (West Africa Standard Time)

      const oneDay = 1000 * 60 * 60 * 24
      const elapsedMilliseconds = Math.abs(now.getTime() - then.getTime())
      const elapsedDays = Math.round(elapsedMilliseconds / oneDay)
      // const milliseconds = parseInt((now - then) / 1000)
      // const minutes = Math.round((elapsedMilliseconds / 1000) / 60)
      // const hours = Math.round(minutes / 60)
      // const days = Math.round(hours / 24)

      return elapsedDays
   }

   return 0
}

export function getDateDifference(_end: string, _start: string) {
   try {
      if (!_start || !_end) return [] //Important
      const [start, end] = [new Date(_start), new Date(_end)]
      const [monthsDiff, weeksDiff, daysDiff] = [
         differenceInMonths(new Date(end), new Date(start)),
         differenceInWeeks(new Date(end), new Date(start)),
         differenceInDays(new Date(end), new Date(start))
      ]
      return [monthsDiff, weeksDiff, daysDiff]
   } catch (error) {
      console.log(error)
      return []
   }
}

export function relativeDateDisplay(months: number, weeks: number, days: number) {
   if (Math.abs(days) < 7) return `${days} day${days !== 1 ? "s" : ""}`
   else if (Math.abs(weeks) < 4) return `${weeks} week${weeks !== 1 ? "s" : ""}`
   else return `${months} month${months !== 1 ? "s" : ""}`
}

export function formatRelativeDate(dateString: string) {
   return formatRelative(new Date(dateString), new Date())
}

export function formatNumber(num: number | string, currencySign?: string, decimals = false) {
   if (invalidNumbers([num]) || isNaN(+num)) return 0
   return `${currencySign ?? ''}${intNumberFormat(decimals).format(+num)}`
}

export function formatBaseCurrency(n: number, multiply = false) {
   return multiply ? n * 100 : n / 100
}

export function toFixedDecimal(num: number | string, decimal = 2) {
   if (decimal === 0) return parseInt(String(num))
   const dotIndex = String(num).indexOf('.')
   if (!invalidNumbers([num]) && dotIndex > 0) {
      return String(num).slice(0, dotIndex + decimal + 1)
   }
   return num
}

export function slugify(string: string) {
   return string
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, ' ') //replace all non alphanumeric characters with whitespace
      .split(' ') //convert to array, because there will be cases of multiple whitespaces
      .filter(t => !!t) //remove any item in the array that's empty (whitespace)
      .join("-") //join items together into a string with hyphen
}

export function toSelectOptions<T = any>(arr: T[], modifier?: (arg: any) => any): _SelectInputOption[] {
   return arr.reduce((acc, curr) => {
      const value = modifier?.(curr) ?? curr
      !!curr && acc.push({ label: value, value })
      return acc
   }, [] as _SelectInputOption[])
}

export function sanitizePayload(payload: _Object, stringToNumber?: boolean) {
   for (const key in payload) {
      if (payload[key] === undefined) delete payload[key]
      if (
         stringToNumber &&
         isFinite(payload[key]) &&
         !Number.isNaN(+payload[key]) &&
         !invalidNumbers([payload[key]])
      ) {
         payload[key] = parseFloat(payload[key])
      }
   }
   return payload
}

export function intNumberFormat(decimals = true) {
   return new Intl.NumberFormat("en-GB", {
      minimumFractionDigits: decimals ? 2 : 0,
      maximumFractionDigits: decimals ? 2 : 0
   })
}

export function getNestedValue(str: string, obj: _Object) {
   if (!str.length) return obj

   let value = obj
   if (typeof obj === 'object') {
      if (str.includes('.')) {
         const keys = str.split(".")
         for (const key of keys) {
            if (value === null || value === undefined) break
            value = value[key]
         }
      } else {
         value = obj[str]
      }
   }
   return value
}

export function getNestedKey(str: string) {
   if (!str.length) return str

   let nestedKey = ''
   const keys = str.split(".")
   for (const key of keys) {
      if (key?.length) nestedKey = key
   }
   return nestedKey
}

export function formatDataToCSV(data: any[], headers: _TableColumn[]) {
   const formattedHeaders = headers.map(h => (h.key ?? h.label).replace(/_/gi, " ").toUpperCase())
   const formattedData = data?.map(d => {
      return headers.map(h => {
         let value = d[h.key ?? h.label]
         if (!!h.label) {
            value = h.modifier?.(value, 0) ?? value
         }
         return value
      })
   })
   return { formattedData, formattedHeaders }
}

export function getDynamicPath(route: string, routeID: string, id: string) {
   return route.replace(routeID, id)
}

export function getFileExtension(filename: string) {
   if (filename.length) {
      for (let i = filename.length; i > 0; i--) {
         const char = filename[i]
         if (char === '.') {
            return filename.substring(i, filename.length)
         }
      }
   }
}

export function invalidNumbers(arr: any[]) {
   return arr.some((n: number | string) => parseNumber(n) instanceof Error)
}

function parseNumber(number: number | string) {
   if (Number.isNaN(number)) return new Error(number + " is not a number type")
   if (typeof number === "number" || isFinite(+number)) return number
   return new Error(number + " is not a number type")
}

export function queryStringFromObject(params: _Object) {
   let query = ''
   for (const key in params) {
      if (params[key]) {
         query += `${key}=${params[key]}&`
      }
   }
   return query.slice(0, -1) //remove the last '&' character
}

export function zodError(issues?: z.ZodIssue[]) {
   let errorString = ''
   if (Array.isArray(issues)) {
      for (const issue of issues) {
         if (issue.path && issue.message) {
            errorString += `>> ${issue.path[0]}: ${issue.message} \n`
         }
      }
   }

   return !!errorString ? errorString : undefined
}