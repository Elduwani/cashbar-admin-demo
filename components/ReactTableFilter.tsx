import { useTableInstance } from "@tanstack/react-table";
import PopOver from "@components/PopOver";

interface Props {
   columns: _TableHeader[],
   table: ReturnType<typeof useTableInstance>
   children: React.ReactNode
}
export function TableFilter(props: Props) {
   return (
      <PopOver
         button={props.children}
         maxWidth={300}
         className="right-0"
      >
         <div className="divide-y">
            {
               props.table.getAllLeafColumns().map(column => {
                  if (column.id === "_") return null
                  const xColumn = props.columns.find(c => c.key === column.id)
                  return (
                     <div key={column.id} className="px-1">
                        <label
                           htmlFor={column.id}
                           className={`
                                        px-4 py-3 flex items-center space-x-4 capitalize cursor-pointer select-none
                                        ${true ? 'bg-white' : 'bg-transparent'}
                                    `}
                        >
                           <input
                              type={'checkbox'}
                              checked={column.getIsVisible()}
                              onChange={column.getToggleVisibilityHandler()}
                              name={column.id}
                           />
                           <span>{xColumn?.label ?? column.id}</span>
                        </label>
                     </div>
                  )
               })
            }
         </div>
      </PopOver>
   )
}