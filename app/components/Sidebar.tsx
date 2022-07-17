import { FiActivity, FiBarChart2, FiCheckCircle, FiDatabase, FiTrendingDown, FiUsers } from "react-icons/fi"
import { Link, useMatch } from "react-router-dom"
// import { useModal } from "../../contexts/Modal.context"
import Button from "./Button"

export default function Sidebar() {
    // const { setModal } = useModal()
    const setModal = (e: any) => null

    let dashboardRoute = useMatch({ path: '/', end: true })
    let customersRoute = useMatch({ path: '/customer/*' })
    let revenuesRoute = useMatch({ path: '/transaction/*' })
    let expensesRoute = useMatch({ path: '/expense', end: true })
    let plansRoute = useMatch({ path: '/plan', end: true })
    let approvalsRoute = useMatch({ path: '/approval', end: true })

    const menuStyle = (state: ReturnType<typeof useMatch>) => `h-14 flex items-center pl-6 space-x-4 cursor-pointer outline-none relative 
        ${state ? "font-medium text-indigo-600 bg-white shadow border-r-4 border-indigo-600" : "text-gray-600"}`
    const iconStyle = "h-5 w-5 flex-shrink-0"

    return (
        <div className="bg-indigo-50 hidden lg:flex flex-col flex-shrink-0 w-60 border-r border-gray-300 items-center">
            <div className="h-32 w-full p-6 grid place-items-center">
                <Button
                    variant="blue"
                    onClick={() => setModal({ name: "addCustomer" })}
                >New Customer</Button>
            </div>

            <nav className="w-full">
                <Link to="/" className={`${menuStyle(dashboardRoute)}`}>
                    <FiBarChart2 className={iconStyle} /><span>Home</span>
                </Link>
                <Link to="/customer" className={`${menuStyle(customersRoute)}`}>
                    <FiUsers className={iconStyle} /><span>Customers</span>
                </Link>
                <Link to="/transaction" className={`${menuStyle(revenuesRoute)}`}>
                    <FiActivity className={iconStyle} /><span>Transactions</span>
                </Link>
                <Link to="/expense" className={`${menuStyle(expensesRoute)}`}>
                    <FiTrendingDown className={iconStyle} /><span>Expenses</span>
                </Link>
                <Link to="/plan" className={`${menuStyle(plansRoute)}`}>
                    <FiDatabase className={iconStyle} /><span>Plans</span>
                </Link>
                <Link to="/approval" className={`${menuStyle(approvalsRoute)}`}>
                    <FiCheckCircle className={iconStyle} />
                    <span>Approvals</span>
                    <div className="relative w-full">
                        <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-indigo-600 animate-ping"></div>
                        <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-indigo-600"></div>
                    </div>
                </Link>
            </nav>
            <p className="mt-auto text-xs text-gray-500 p-4 flex justify-between w-full">
                <span>Demo Version 1.0</span> <a
                    href="https://elduwani.dev"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-gray-500"
                >@elduwani</a>
            </p>
        </div>
    )
}