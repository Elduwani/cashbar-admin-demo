import { differenceInDays, differenceInMonths, differenceInWeeks, format, formatRelative } from "date-fns";

export function metricPrefix(number: number) {
   if (invalidNumbers([number])) return '0.00'

   const num = Math.abs(number)
   //Must start from largest number so it doesn't return lower true condition
   if (num > 999999999) return (Math.sign(num) * (num / 1000000000)).toFixed(2) + 'B'
   if (num > 999999) return (Math.sign(num) * (num / 1000000)).toFixed(2) + 'M'
   if (num > 999) return parseInt(String(Math.sign(num) * (num / 1000))) + 'K'
   return String(Math.sign(num) * num)
}

export function byteSize(number: number) {
   if (!invalidNumbers([number])) {
      const num = Math.abs(number)
      //Must start from largest number so it doesn't return lower true condition
      if (num > 999999999) return (Math.sign(num) * (num / 1000000000)).toFixed(2) + 'GB'
      if (num > 999999) return (Math.sign(num) * (num / 1000000)).toFixed(1) + 'MB'
      if (num > 999) return parseInt(String(Math.sign(num) * (num / 1000))) + 'KB'
      return String(Math.sign(num) * num) + "B"
   }
   return String(number)
}

export function formatDate(date: string | Date, long = true, time = false) {
   //so every function uses the same date format to avoid differences
   try {
      const d = new Date(date)
      return format(d, `${!long ? "dd MMMM" : "MMM dd, yyyy"}${time ? " - hh:mm a" : ""}`)
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

export function formatNumber(num: number | string, currencySign = "", decimals?: boolean) {
   if (invalidNumbers([num]) || isNaN(+num)) return 0
   else {
      const parsed = toFixedDecimal(num)
      return `${currencySign}${intNumberFormat(decimals).format(+parsed)}`
   }
}

export function p(n: number | string) {
   return parseInt(String(n))
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

export function toSelectOptions(arr: any[], modifier?: (arg: any) => any) {
   return arr?.reduce?.((acc, curr) => {
      const value = modifier?.(curr) ?? curr
      !!curr && acc.push({ label: value, value })
      return acc
   }, [])
}

export function sanitizePayload(payload: _Object, stringToNumber?: boolean) {
   for (const key in payload) {
      if (!payload[key]) delete payload[key]
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
   // console.log(str, obj);
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

export function isModified(values: _Object, data: _Object) {
   let modified
   for (const key in values) {
      if (String(values[key]) !== String(data[key])) {
         modified = true
         break
      }
   }
   return modified
}

export function formatDataToCSV(data: any[], headers: _TableHeader[]) {
   const formattedHeaders = headers.map(h => (h.key ?? h.label).replace(/_/gi, " ").toUpperCase())
   const formattedData = data?.map(d => {
      return headers.map(h => {
         let value = d[h.key ?? h.label]
         if (!!h.label) {
            value = h.modifier?.(value) ?? value
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