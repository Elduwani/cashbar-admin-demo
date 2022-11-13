import {
   ColumnResizeMode, createTable,
   getCoreRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useTableInstance
} from '@tanstack/react-table'
import { TablePagination } from 'hooks/pagination'
import React, { useState } from "react"
import { FiSettings } from 'react-icons/fi'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'
import Button, { DownloadCSV } from './Button'
import Search from './Search'
import { TableFilter } from './ReactTableFilter'

interface Props<T = Record<string, any>> {
   columns: _TableColumn<any>[]
   data: T[]
   exportCSV?: string //filename
   headerStyles?: string
   rowStyles?: (arg: any) => string
   onClick?: (arg?: any) => any
   utilities?: React.ReactNode
   title?: string
   search?: [string[], string?]
   paginate?: boolean
   sort?: boolean
   className?: string
}

const table = createTable()

export default function ReactTable({ sort = true, ...props }: Props) {
   const [sorting, setSorting] = useState<SortingState>([])
   const [columnResizeMode] = useState<ColumnResizeMode>('onChange')
   const [columns] = useState(() => makeColumns(props.columns))
   const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
   const [searchResults, setSearchResults] = useState<typeof props.data | undefined>()

   const data = searchResults?.length ? searchResults : props.data

   const instance = useTableInstance(table, {
      data,
      columns,
      state: {
         pagination,
         sorting: sort ? sorting : undefined,
      },
      columnResizeMode,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: sort ? setSorting : undefined,
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      debugTable: true,
   })

   return (
      <div className={`${props.className}`}>
         {/* <pre>{JSON.stringify(instance.getState().globalFilter, null, 2)}</pre> */}
         {
            props.search || props.utilities ?
               //Utility buttons
               <div className="flex items-end space-x-2 justify-between mb-3">
                  {
                     props.search ?
                        <div className="w-full max-w-xs">
                           <Search
                              matchList={props.search[0]}
                              placeholder={props.search[1]}
                              callback={setSearchResults}
                              data={props.data}
                           />
                        </div>
                        : <span></span>
                  }
                  {
                     props.utilities &&
                     <div className='flex items-center space-x-2'>
                        {props.utilities}
                        {
                           props.exportCSV?.length && props.data?.length ?
                              <DownloadCSV
                                 data={props.data}
                                 filename={props.exportCSV}
                                 columns={props.columns}
                                 text="Export CSV"
                              />
                              : null
                        }
                        {
                           // <TableFilter
                           //    columns={props.columns}
                           //    table={instance as any}
                           // >
                           //    <Button variant='outline' icon={FiSettings} secondary shrink />
                           // </TableFilter>
                        }
                     </div>
                  }
               </div>
               : null
         }
         <div className="overflow-x-auto scrollbar rounded-xl bg-white border mb-3">
            <table
               className="border-collapse min-w-full"
               style={{
                  width: instance.getCenterTotalSize(),
               }}
            >
               <thead className={`h-12 ${props.headerStyles ?? ' text-blue-900/60'}`}>
                  {
                     instance.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                           {headerGroup.headers.map((header, i) => {
                              const hStyles = props.columns[i].headerStyle ?? {}
                              return (
                                 <th
                                    scope='col'
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    style={{ width: header.getSize(), ...hStyles }}
                                    className={`
                                       px-4 sm:px-6 text-left text-xs font-medium uppercase 
                                       tracking-wider relative border-r last-of-type:border-r-0 border-b
                                       ${sort && header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                                    `}
                                 >
                                    {
                                       header.isPlaceholder ? null :
                                          <div
                                             className='flex items-center space-x-1'
                                             onClick={header.column.getToggleSortingHandler()}
                                          >
                                             <span>{header.renderHeader()}</span>
                                             {{
                                                asc: <HiChevronUp className='text-xl' />,
                                                desc: <HiChevronDown className='text-xl' />,
                                             }[header.column.getIsSorted() as string] ?? null}
                                          </div>
                                    }
                                    {/* Resize handle */}
                                    <div
                                       {...{
                                          onMouseDown: header.getResizeHandler(),
                                          onTouchStart: header.getResizeHandler(),
                                          className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                                          style: {
                                             transform:
                                                columnResizeMode === 'onEnd' &&
                                                   header.column.getIsResizing()
                                                   ? `translateX(${instance.getState().columnSizingInfo.deltaOffset}px)`
                                                   : '',
                                          },
                                       }}
                                    />
                                 </th>
                              )
                           })}
                        </tr>
                     ))
                  }
               </thead>
               <tbody className="divide-y divide-gray-200">
                  {
                     instance.getRowModel().rows.map((row, index) => {
                        return (
                           <tr
                              key={row.id}
                              className={`bg-transparent hover:bg-gray-50 ${props.onClick && "cursor-pointer"}`}
                              onClick={() => props.onClick?.(row.original)}
                           >
                              {
                                 row.getVisibleCells().map(cell => {
                                    const { capitalize = true, cellStyle, modifier } = props.columns.find(el => el.key === cell.column.id)!
                                    const entry = row.original as _Object
                                    const rStyles = props.rowStyles?.(entry)
                                    const cStyle = cellStyle?.(entry)
                                    const value = modifier?.(entry, index)

                                    return (
                                       <td
                                          key={cell.id}
                                          className={`
                                             px-6 py-4 max-h-16 text-sm ${rStyles} ${cStyle}
                                             ${capitalize ? "capitalize" : ''}
                                          `}
                                       >{value ?? cell.renderCell()}</td>
                                    )
                                 })
                              }
                           </tr>
                        )
                     })
                  }
               </tbody>
            </table>
         </div>
         <TablePagination
            instance={instance as any}
            dataCount={data.length}
         />
      </div>
   )
}

function makeColumns(headers: _TableColumn<any>[]) {
   return headers.map((h) => {
      const options: Parameters<typeof table.createDataColumn>[1] = {
         header: h.label ?? h.key as string,
         id: h.key as string, //must be the key attribute,
      }
      if (h.cell) options['cell'] = h.cell
      //@ts-expect-error
      return table.createDataColumn(h.key, options)
   })
}