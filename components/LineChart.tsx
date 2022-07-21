import { metricPrefix } from "@utils/index"
import { getChartData, niceNumbers, dateFilterOptions, getPastDate } from "@utils/chart.utils"
import { transform } from "framer-motion"
import { useRef, useState, useLayoutEffect } from "react"
import { GiPlainCircle } from "react-icons/gi"
import Spinner from "./Spinner"
import { ChartProps } from "./TransactionsChart"

export default function LineChart({ labels = true, height = 300, ...props }: ChartProps) {
   const containerRef = useRef<HTMLDivElement>(null)
   const [viewBox, setViewBox] = useState({ width: 960, height, padding: 20 })

   const chartData = props.dataSet.map(set => getChartData(set.data, props.period.value))
   const { yAxisNumbers, maxNumber } = niceNumbers(Math.max(...chartData.map(set => set.maxAmount + 2000), 5000), 5) //10k is fallback value when there are no transactions, otherwise renders empty
   const [canvasBox, setCanvasBox] = useState({ startX: 0, startY: 0, width: 100, height: 100, yAxisWidth: 40, xAxisHeight: 25 })
   //Calculate relative [x,y] coordinates of entries
   const vectors = chartData.map(set => getVectors(set.data))

   function getVectors(arr: [string, { total: number }][]) {
      return arr.reduce((acc: string[], curr, i) => {
         const [_, { total }] = curr
         const { height, startX, startY } = canvasBox
         const y = transform(total, [0, maxNumber], [height, startY])
         const x = transform(i, [0, arr.length - 1], [startX, viewBox.width - 25])

         acc.push(`${x},${y} `)
         return acc
      }, [])
   }

   function modToolTip(y: number) {
      let ry = y - 20 //move tooltip position up
      if (ry <= 0) ry = 40 //if out of top view bring position down
      return ry
   }

   useLayoutEffect(() => {
      //Set width of viewBox to the parent element's full width
      const compStyles = window.getComputedStyle(containerRef.current as any);
      // eslint-disable-next-line
      const width = Number(compStyles.getPropertyValue('width').replace(/[^\d.-]/g, ''))
      setViewBox(v => ({ ...v, width }))

      //Calculate the dimensions of the graph canvas area
      let { height } = viewBox,
         { yAxisWidth } = canvasBox,
         startX = yAxisWidth,
         startY = 10;

      setCanvasBox(v => ({
         ...v,
         startX,
         startY,
         width: width - startX,
         height: height - v.xAxisHeight - startY,
      }))

      // eslint-disable-next-line
   }, []);

   return (
      <div className="relative">
         {
            props.loading &&
            <div className="h-full w-full absolute top-0 left-0 grid place-content-center bg-white/50">
               <Spinner />
            </div>
         }
         <div className={`
            simple-chart py-4 md:px-6 md:bg-white md:border rounded-xl space-y-6 
            ${props.shadow && "md:shadow-lg"}
         `}>
            {
               labels ?
                  <div className="_header-container md:flex md:space-x-8 pt-2">
                     {props.title &&
                        <h3 className="text-xl text-gray-700 font-medium capitalize">
                           {props.title}
                        </h3>
                     }
                     <div className="_labels flex space-x-4">
                        {
                           props.dataSet.slice().reverse().map(({ label, color = "text-gray-500" }, i) =>
                              <div
                                 key={i}
                                 className="flex items-center space-x-2 h-8 capitalize text-xs md:text-base text-gray-600"
                              >
                                 <GiPlainCircle className={`text-xs fill-current ${color} opacity-70`} /> <span>{label}</span>
                              </div>
                           )
                        }
                     </div>
                  </div>
                  : null
            }
            <div className="flex space-x-2 md:space-x-8 justify-center">
               {
                  dateFilterOptions.map(dateRange => {
                     const selected = props.period.label === dateRange
                     return (
                        <div
                           key={dateRange}
                           className={`
                           uppercase text-xs md:text-sm px-4 py-1 tracking-wider cursor-pointer rounded 
                           ${selected ? "bg-indigo-600 text-white shadow-lg" : "bg-blue-50 text-indigo-600"}
                        `}
                           onClick={() => props.setPeriod?.(getPastDate(dateRange))}
                        >{dateRange.replace(/ /g, "").slice(0, 2)}</div>
                     )
                  })
               }
            </div>
            <div ref={containerRef}>
               <svg
                  viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
                  xmlns="http://www.w3.org/2000/svg"
                  id="simple-chart"
               >
                  <g id="layout-guides">
                     <rect
                        id="r"
                        width={canvasBox.yAxisWidth}
                        height={canvasBox.height}
                        x={0} y={canvasBox.startY}
                        fill="none"
                     />
                     <rect
                        id="g"
                        width={canvasBox.width}
                        height={canvasBox.height}
                        x={canvasBox.startX}
                        y={canvasBox.startY}
                        fill="none"
                     />
                     <rect
                        id="b"
                        width={canvasBox.width}
                        height={canvasBox.xAxisHeight}
                        x={canvasBox.startX}
                        y={canvasBox.height + canvasBox.startY}
                        fill="none"
                     />
                  </g>

                  {
                     //y-axis and horizontal lines
                     yAxisNumbers.reverse().map((val, i) => {
                        const { startX, width, startY, height } = canvasBox
                        const y = transform(i, [0, yAxisNumbers.length - 1], [startY, height])

                        return (
                           <g id="y-axis" key={i}>
                              <text x={0} y={y + 5}
                                 className="fill-current text-xs lg:text-xs text-gray-600"
                              >{metricPrefix(val)}</text>
                              <line
                                 x1={startX} y1={y}
                                 x2={width + startX} y2={y}
                                 className={`stroke-current text-indigo-100`}
                                 strokeDasharray={4}
                              />
                           </g>
                        )
                     })
                  }

                  {
                     //Draw the line
                     vectors.map((set, i) => {
                        const points = set.join("")
                        const color = props.dataSet[i].color ?? "text-gray-500"
                        return <polyline
                           key={i}
                           id={props.dataSet[i].color}
                           points={points}
                           className={`stroke-current ${color} opacity-70`}
                           fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                        />
                     })
                  }

                  {
                     //Draw dots and tooltips
                     vectors.map((set, i) => { //[set[vectors], set[vectors]]
                        const { color = "text-gray-500", circle, label } = props.dataSet[i]

                        return set.map((coord, j) => { //[vectors<"x,y">, vectors<"x,y">]
                           const { height } = canvasBox
                           const [x, y] = coord.split(",")
                           const { total } = chartData[i].data[j][1]
                           const tooltipY = modToolTip(+y)

                           return (
                              <g className={`point-group ${label}`} key={j}>
                                 {
                                    total > 0 ?
                                       <line
                                          x1={x} y1={height} x2={x} y2={y}
                                          className={`stroke-current text-indigo-200`}
                                          strokeDasharray={4}
                                       /> : null
                                 }
                                 {
                                    //Only if there's a transaction
                                    total > 0 ?
                                       <>
                                          {
                                             //Only if circle prop is true
                                             circle ?
                                                <circle
                                                   cx={x} cy={y} r="4"
                                                   stroke="white" strokeWidth={2}
                                                   className={`fill-current ${color}`}
                                                /> : null
                                          }
                                          <g id="tooltip" className="cursor-pointer">
                                             <rect
                                                x={+x - 25} y={tooltipY}
                                                width={50} height={25} rx={3} fill="white"
                                                className={`stroke-current ${color} opacity-90`}
                                             />
                                             <text
                                                x={x} y={tooltipY + 18} textAnchor="middle"
                                                className={`fill-current text-sm ${color}`}
                                             >{metricPrefix(total)}</text>
                                          </g>
                                       </> : null
                                 }
                              </g>
                           )
                        })
                     })
                  }

                  {
                     //x-axis
                     //since the number of days is calculated by period prop any of the dataSet would suffice
                     vectors[0].map((coord, i) => {
                        const { height } = canvasBox
                        const [x] = coord.split(",")
                        const [date] = chartData[0].data[i] //any one is fine. They all have the same date range. Date-string expected to be formatted "Jan 02, 2021"
                        // console.log(date)
                        //skip year if it's current year

                        const textNode = <text key={i} x={x} y={height + 30}
                           textAnchor="middle"
                           className="fill-current text-xs text-gray-400">{date}</text>

                        if (vectors[0].length > 7) {
                           //render every third date, but include the last one
                           return i % 3 === 0 ? textNode : null
                        }

                        return textNode
                     })
                  }

               </svg>
            </div>
         </div>
      </div>
   )
}