import { sub, eachDayOfInterval, startOfWeek, isFirstDayOfMonth } from "date-fns"
import { formatDate } from "./index"

export const dateFilterOptions = ["1 week", "1 month", "3 months", "6 months", "1 year"]

export function getChartData(transactions, endDate) {
    /**
     * This function returns all calendar days that have elapsed 
     * between today (now) and any number of days to the past
     * Initial state is set here
    */
    const map = new Map()
    const intervalDays = eachDayOfInterval({ start: new Date(endDate), end: new Date() })

    function setMap(arr, mode) {
        //Use the last date in the array as key If only one items exists then that is also the last item.
        const date = arr[arr.length - 1]
        const [d, month, year] = date.split(" ") //date is formatted above in formateDate 
        const [, , thisYear] = formatDate(new Date(), false).split(" ")
        let key = `${month} ${d}`

        if (mode === "monthly") key = month
        if (year !== thisYear) key = `${d} ${month} '${year}`

        map.set(key, {
            total: 0,
            dates: arr, //this is very important. Transactions are aggregated based on this array of dates. 
        })
    }

    let days = intervalDays.length, tempArr = [], mode;

    if (days > 30 && days <= 90) mode = "weekly"
    else if (days > 90) mode = "monthly"
    else mode = "daily"

    for (let i = 0; i < intervalDays.length; i++) {
        const currentDate = intervalDays[i]
        const date = formatDate(currentDate, false)

        if (mode === "monthly") {
            /**
             * Please note, on the 1st of every month the tempArr is empty. It's very important to check if it's not empty.
             * Otherwise will send empty array on 1st of month and crash the app.
             * ...
             * Once we hit a new month save & reset <<tempArr>>
             * Initialise new arr with current date otherise it's lost by next loop
            */
            if (isFirstDayOfMonth(currentDate)) {
                if (tempArr.length) setMap(tempArr, mode)
                tempArr = [date]
                continue
            }
            // We're within same month
            tempArr.push(date)
        }

        else if (mode === "weekly") {
            if (startOfWeek(currentDate, { weekStartsOn: 0 })) {
                /**
                 * It's the beginning of a new week, save this week's data and skip further evaluation
                 * Also don't set undefined keys if there are no dates in this week
                */
                if (tempArr.length) setMap(tempArr)
                //Initialise new arr with current date otherise it's lost by next loop
                tempArr = [date]
                continue
            }

            //We're still within a week, save & skip further evaluation
            tempArr.push(date)
        }

        else setMap([date])// Default to daily
    }

    //Important: <<tempArr>> still holds values for most recent month from the final loop
    if (tempArr.length) {
        setMap(tempArr)
    }

    //Update the total transactions for each entry on the map. Map argument will be mutated
    const maxAmount = aggregateTotals(map, transactions)
    // console.log(map)
    return { data: [...map], maxAmount }
}

function aggregateTotals(map, transactions) {
    let maxAmount = 0
    map.forEach((value, key) => {
        transactions.forEach((trx) => {
            let { paid_at, amount, status } = trx
            let trxDate = formatDate(new Date(paid_at), false)
            let { dates } = value

            if (status === "success") {
                /**
                 * <<dates>> is an array of all the dates between 
                 * and also the two dates that are the keys
                */
                if (dates?.includes(trxDate) || trxDate === key) {
                    // Must use map.get() bcos this inner loop references stale data
                    const { total } = map.get(key)
                    map.set(key, { ...value, total: total + (amount / 100) })
                }
            }
        })

        //update maximum amount
        const { total } = map.get(key)
        if (total > maxAmount) {
            maxAmount = total
        }
    })

    return maxAmount
}

export function filterTransactions(transactions) {
    const { investment, liquidation } = transactions?.reduce((acc, trx) => {
        if (trx.type === "liquidation") acc.liquidation.push(trx)
        else acc.investment.push(trx)
        return acc
    }, { investment: [], liquidation: [] })

    return { investment, liquidation }
}

export function getPastDate(dateLabel) {
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

export function getPreviousCalenderDays(numOfDays = 30) {
    let dates = []
    for (let i = 0; i < numOfDays; i++) {
        const a = new Date()
        const d = a.setDate(a.getDate() - i); //returns difference in milliseconds 
        dates.push(formatDate(new Date(d)))
    }
    return dates.reverse()
}

export function niceNumbers(maxPoint, ticks) {
    let maxTicks = ticks || 8,
        minPoint,
        tickSpacing,
        range,
        // niceMin,
        niceMax;

    return niceScale(maxPoint)

    /**
     * Instantiates a new instance of the NiceScale class.
     *
     *  min the minimum data point on the axis
     *  max the maximum data point on the axis
     */
    function niceScale(max) {
        minPoint = 1;
        maxPoint = max;
        let yAxisNumbers = []
        calculate();

        for (let i = 0; i <= niceMax; i += tickSpacing) {
            yAxisNumbers.push(i)
        }
        // return { yAxisNumbers, max: niceMaximum, ticks: tickSpacing }
        return {
            yAxisNumbers,
            tickSpacing,
            maxNumber: niceMax
        };
    }

    /**
     * Calculate and update values for tick spacing and nice
     * minimum and maximum data points on the axis.
     */
    function calculate() {
        range = niceNum(maxPoint - minPoint, false);
        tickSpacing = niceNum(range / (maxTicks - 1), true);
        // niceMin = Math.floor(minPoint / tickSpacing) * tickSpacing;
        niceMax = Math.ceil(maxPoint / tickSpacing) * tickSpacing;
    }

    /**
     * Returns a "nice" number approximately equal to range Rounds
     * the number if round = true Takes the ceiling if round = false.
     *
     *  localRange the data range
     *  round whether to round the result
     *  a "nice" number to be used for the data range
     */
    function niceNum(localRange, round) {
        let exponent; /** exponent of localRange */
        let fraction; /** fractional part of localRange */
        let niceFraction; /** nice, rounded fraction */

        exponent = Math.floor(Math.log10(localRange));
        fraction = localRange / Math.pow(10, exponent);

        if (round) {
            if (fraction < 1.5)
                niceFraction = 1;
            else if (fraction < 3)
                niceFraction = 2;
            else if (fraction < 7)
                niceFraction = 5;
            else
                niceFraction = 10;
        } else {
            if (fraction <= 1)
                niceFraction = 1;
            else if (fraction <= 2)
                niceFraction = 2;
            else if (fraction <= 5)
                niceFraction = 5;
            else
                niceFraction = 10;
        }

        return niceFraction * Math.pow(10, exponent);
    }

    /**
     * Sets the minimum and maximum data points for the axis.
     *
     *  minPoint the minimum data point on the axis
     *  maxPoint the maximum data point on the axis
     */
    function setMinMaxPoints(localMinPoint, localMaxPoint) {
        minPoint = localMinPoint;
        maxPoint = localMaxPoint;
        calculate();
    }

    /**
     * Sets maximum number of tick marks we're comfortable with
     *
     *  maxTicks the maximum number of tick marks for the axis
     */
    function setMaxTicks(localMaxTicks) {
        maxTicks = localMaxTicks;
        calculate();
    }
}

function linearScale(yMin, yMax) {
    let ticks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
    let range = Math.abs(yMax - yMin);
    let step = range / ticks;

    if (ticks === Number.MAX_VALUE) {
        ticks = 10;
        step = 1;
    }

    let result = [];
    let v = yMin;

    while (ticks >= 0) {
        result.push(v);
        v = v + step;
        ticks -= 1;
    }

    return {
        result: result,
        niceMin: result[0],
        niceMax: result[result.length - 1]
    };
}
