import {
   FiActivity as TransactionsIcon, FiBarChart2 as DashboardIcon, FiBell as NotifyIcon, FiCheckCircle as ApprovalsIcon, FiDatabase as PlansIcon,
   FiLogOut as LogoutIcon,
   FiSettings as SettingsIcon, FiTrendingDown as ExpensesIcon, FiUsers as UsersIcon
} from "react-icons/fi";
import BrandLogo from "./BrandLogo";
import Dropdown, { Notifications } from "./Dropdown";
import { SwingIndicator } from "./Spinner";

const url = "https://tinyfac.es/data/avatars/344CFC24-61FB-426C-B3D1-CAD5BCBD3209-200w.jpeg"

export default function Header() {

   const menuListAll = [
      { label: "Dashboard", link: "dashboard", icon: <DashboardIcon /> },
      { label: "Customers", link: "customer", icon: <UsersIcon /> },
      { label: "Transactions", link: "transaction", icon: <TransactionsIcon /> },
      { label: "Expenses", link: "expense", icon: <ExpensesIcon /> },
      { label: "Plans", link: "plan", icon: <PlansIcon /> },
      { label: "Approvals", link: "approval", icon: <ApprovalsIcon /> },
      { label: "Settings", icon: <SettingsIcon />, borderTop: true },
      { label: "Sign out", icon: <LogoutIcon />, callback: () => null }
   ]
   const menuList = [
      { label: "Sign out", icon: <LogoutIcon />, callback: () => null }
   ]

   const emailDisplay = <div className="px-4 py-3">
      <p className="text-sm leading-5">Signed in as <b>Admin</b></p>
   </div>

   return (
      <header className="header-wrapper h-16 bg-white relative flex items-center justify-between px-4 sm:px-6 border-gray-300 shadow z-10">
         <div className="grid place-items-center select-none"><BrandLogo /></div>

         <div className="h-full flex items-center space-x-1">
            <Notifications>
               <div className="w-10 h-10 grid place-items-center relative">
                  <NotifyIcon className="text-2xl text-gray-600" />
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 animate-ping"></div>
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600"></div>
               </div>
            </Notifications>
            <Dropdown menuList={menuList} header={emailDisplay}>
               <div className="w-10 h-10 ml-2 rounded-full border-2 p-1 border-indigo-600">
                  <div
                     className="w-full h-full rounded-full"
                     style={{
                        backgroundImage: `url(${url})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        backgroundAttachment: "scroll"
                     }}
                  ></div>
               </div>
            </Dropdown>
         </div>
         {
            true ? <SwingIndicator /> : null
         }
      </header>
   );
}