import { useTableInstance } from '@tanstack/react-table';
import { toSelectOptions } from '@utils/index';
import { useEffect, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import Button from '@components/Button';
import Select from '../components/Select';

const options = [10, 20, 50, 100]
interface Props {
   total: number
   reset?: boolean
   className?: string
}
export default function usePagination(props: Props) {
   const [page, setPage] = useState(0)
   const [pageSize, setPageSize] = useState(options[0]) //Select will override this anyway

   const start = page * pageSize
   const end = Math.min((page + 1) * pageSize, props.total)
   const maxxed = end >= props.total

   useEffect(() => {
      if (props.reset) setPage(0)
   }, [props.reset])

   const controls = props.total < options[0] ? null : (
      <div className={`flex space-x-2 items-center justify-between ${props.className}`}>
         <div className='flex space-x-2 items-center'>
            <Select
               name=''
               setValue={setPageSize}
               initialOptions={toSelectOptions(options)}
               initialValue={options[0]}
               direction='up'
               align='left'
            />
            <p className='text-sm text-gray-600'>Per page</p>
         </div>
         <div className='flex space-x-2 items-center'>
            <div className="h-9 flex flex-col justify-center px-2 text-gray-600 text-sm">
               <span className=''>{start + 1} - {end} of {props.total}</span>
            </div>
            <Button
               onClick={() => setPage(i => Math.max(0, i - 1))}
               icon={HiChevronLeft}
               disabled={start <= 0}
               variant="outline"
               shrink
            />
            <Button
               onClick={() => !maxxed && setPage(i => i + 1)}
               icon={HiChevronRight}
               variant="outline"
               disabled={maxxed}
               shrink
            />
         </div>
      </div>
   )

   return { start, end, controls }
}

interface _Props {
   instance: ReturnType<typeof useTableInstance>
   dataCount: number
   className?: string
}
export function TablePagination(props: _Props) {

   if (props.dataCount < options[0]) return null

   return (
      <>
         <div className={`flex space-x-2 items-center justify-between ${props.className}`}>
            <div className='flex space-x-2 items-center'>
               <Button
                  onClick={() => props.instance.previousPage()}
                  disabled={!props.instance.getCanPreviousPage()}
                  icon={HiChevronLeft}
                  variant="outline"
                  shrink
               />
               <div className="h-9 flex flex-col justify-center px-2 text-gray-600 text-sm">
                  <span className=''>
                     {props.instance.getState().pagination.pageIndex + 1} of {props.instance.getPageCount()}
                  </span>
               </div>
               <Button
                  onClick={() => props.instance.nextPage()}
                  disabled={!props.instance.getCanNextPage()}
                  icon={HiChevronRight}
                  variant="outline"
                  shrink
               />
            </div>
            <div className='flex space-x-2 items-center'>
               <p className='text-sm text-gray-600'>Show</p>
               <Select
                  name=''
                  setValue={props.instance.setPageSize}
                  initialOptions={toSelectOptions(options)}
                  initialValue={options[0]}
                  direction='up'
                  align='right'
               />
            </div>
         </div>
      </>
   )
}