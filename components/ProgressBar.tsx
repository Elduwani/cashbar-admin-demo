import { motion } from 'framer-motion';
import ProgressBar from 'react-customizable-progressbar';

interface Props {
   percent: number,
   text?: string,
   baseColor?: string,
   accentColor?: string,
   height?: number,
   className?: string
   maxColor?: string
   textColor?: string,
}
export default function LinearProgressBar({ baseColor = "bg-gray-300", accentColor = "bg-blue-500", height = 10, maxColor = accentColor, ...props }: Props) {
   return (
      <div style={{ height }} className={`relative overflow-hidden rounded-sm ${baseColor} ${props.className}`}>
         <motion.div
            initial={{ width: 0 }}
            animate={{ width: Math.min(100, props.percent) + "%" }}
            transition={{ type: 'tween', duration: 1 }}
            className={`h-full shadow ${props.percent > 75 ? maxColor : accentColor}`}
         ></motion.div>
         <p className={`absolute w-full h-full px-2 flex items-center left-0 top-0 text-xs ${props.textColor}`}>{props.text}</p>
      </div>
   )
}

export function CircularProgress({ radius = 80, progress = 0, strokeWidth = 4, accentColor = "rgb(59,130,246)", subtitle = "completion" }) {
   return (
      <ProgressBar
         radius={radius}
         progress={Math.min(progress, 100)}
         // cut={180}
         // rotate={180}
         strokeWidth={strokeWidth}
         strokeColor={accentColor}
         strokeLinecap="round"
         trackStrokeWidth={strokeWidth}
         trackStrokeColor="#eee"
         trackStrokeLinecap="round"
         initialAnimation={true}
         transition="2s ease 0.5s"
         trackTransition="0s ease"
         pointerFillColor="#eee"
         pointerStrokeColor={accentColor}
         pointerStrokeWidth={strokeWidth}
         pointerRadius={strokeWidth * 2}
         className=""
      >
         <div
            style={{ height: radius * 2, top: strokeWidth * 3 }}
            className="absolute w-full h-full mx-auto select-none"
         >
            <p className="h-full text-3xl flex flex-col items-center justify-center">
               <span className="">{parseInt(String(progress))}%</span>
               <span className="text-sm uppercase tracking-wider opacity-50">{subtitle}</span>
            </p>
         </div>
      </ProgressBar>
   )
}