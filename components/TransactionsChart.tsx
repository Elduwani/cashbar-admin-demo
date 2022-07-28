import { getChartData } from '@utils/chart.utils'
import { useEffect, useState } from 'react'
import ClientOnly from './ClientOnly'
import LineChart from './LineChart'
import Spinner from './Spinner'

export interface DataSet {
   label: string
   data: any[]
   color?: `text-${string}`
   circle?: boolean
}
export interface ChartProps {
   dataSet: DataSet[]
   data: ReturnType<typeof getChartData>[]
   // setPeriod?(t: ReturnType<typeof getTimePeriodDate>): void
   // timePeriod: ReturnType<typeof getTimePeriodDate>
   timePeriodPicker?: React.ReactNode
   title?: string
   height?: number
   loading?: boolean
   shadow?: boolean
   labels?: boolean
}
export default function CustomChart(props: ChartProps) {
   const [key, setKey] = useState(1)
   const height = props.height ?? 300

   useEffect(() => {
      //force re-render of svg elements on resize to stop scale issues
      const handleResize = () => setKey(k => k + 0.2)
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
   }, []);

   const fallback = (
      <div className="bg-teal-50 border rounded-xl grid place-content-center" style={{ height }}>
         <Spinner />
      </div>
   )

   return (
      <ClientOnly fallback={fallback}>
         <LineChart key={key} {...props} height={height} />
      </ClientOnly>
   )
}