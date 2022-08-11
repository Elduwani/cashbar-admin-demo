import { FiActivity, FiBarChart2, FiCheckCircle, FiDatabase, FiTrendingDown, FiUsers } from "react-icons/fi"
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
      icon: FiBarChart2
   },
   {
      name: "customers",
      path: `/customers`,
      icon: FiUsers
   },
   {
      name: "transactions",
      path: `/transactions`,
      icon: FiActivity
   },
   {
      name: "expenses",
      path: `/expenses`,
      icon: FiTrendingDown
   },
   {
      name: "plans",
      path: `/plans`,
      icon: FiDatabase,
   },
   {
      name: "approvals",
      path: `/approvals`,
      icon: FiCheckCircle,
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