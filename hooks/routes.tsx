import {
   HiOutlineGift as LoansIcon, HiShoppingCart as ExpensesIcon, HiTrendingUp as DepositsIcon, HiUsers as CustomersIcon, HiViewGridAdd as DashbaordIcon
} from "react-icons/hi"
import { IconType } from "react-icons/lib"

export type _Route = {
   name: string,
   icon?: IconType,
   children?: _Route[]
   path?: string
   enabled?: boolean
}
export const protectedRoutes: _Route[] = [
   {
      name: "home",
      path: `/`,
      icon: DashbaordIcon
   },
   {
      name: "customers",
      path: `/customers`,
      icon: CustomersIcon
   },
   {
      name: "transactions",
      path: `/transactions`,
      icon: LoansIcon
   },
   {
      name: "expenses",
      path: `/expenses`,
      icon: DepositsIcon
   },
   {
      name: "plans",
      path: `/plans`,
      icon: ExpensesIcon,
   }
]

export const publicRoutes = ['/login']

export function getStyle(active: boolean) {
   return `h-14 flex items-center pl-6 space-x-4 cursor-pointer outline-none relative 
        ${active ? "font-medium bg-gray-700 shadow border-red-600" : "text-gray-400"}
    `
}

export function isActivePath(basePath: string, path: string) {
   //Every route will match '/', return early if exact path
   if (basePath === path) {
      return true
   }

   if (!['', '/'].includes(path)) {
      //https://stackoverflow.com/a/54144410
      const regex = new RegExp(`${path}[^:]`, "i");
      // Negate empty strings which will match.
      if (!!path && basePath.match(regex)) {
         return true
      }
   }
}