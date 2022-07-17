import { format, sub } from "date-fns"

export const dateFilterOptions = ["1 week", "1 month", "3 months", "6 months", "1 year"]

export function metricPrefix(number: number) {
   const num = Math.abs(number)
   //Must start from largest number so it doesn't return lower true condition
   if (num > 999999999) return Math.sign(num) * ((num / 1000000000).toFixed(2)) + 'B'
   if (num > 999999) return Math.sign(num) * ((num / 1000000).toFixed(2)) + 'M'
   if (num > 999) return Math.sign(num) * ((num / 1000).toFixed(2)) + 'k'
   if (num < 999) return Math.sign(num) * num
}

export function formatDate(date: string, long = true, time = false) {
   //so every function uses the same date format to avoid differences
   const d = new Date(date)
   return format(d, `dd MMM ${long ? "yyyy" : "yy"} ${time ? "- hh:mm a" : ""}`)
}

export function getTimeDifference(endDate: string, startDate: string) {
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

export function formatKobo(num: number, currency = "NGN") {
   //parseInt removes decimal places from the number. No longer need maximumFractionDigits...
   return `${currency} ${(parseInt(num / 100)).toLocaleString("en-GB", { maximumFractionDigits: 0 })}`
}

export function formatNumber(num: string, currency = "NGN") {
   return `${currency ?? ""}${num.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`
}

export function getPastDate(dateLabel?: string) {
   dateLabel = dateLabel ?? dateFilterOptions[0]
   let [count, modifier] = dateLabel.split(" ")
   let date = new Date()

   if (["week", "weeks"].includes(modifier)) {
      date = sub(date, { weeks: +count })
   }
   if (["month", "months"].includes(modifier)) {
      date = sub(date, { months: +count })
   }
   if (["year", "years"].includes(modifier)) {
      date = sub(date, { years: +count })
   }

   return {
      label: dateLabel,
      value: date.toISOString()
   }
}
