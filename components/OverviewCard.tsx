import { formatDate, formatNumber } from "@utils/index"
import { useRouter } from "next/router"
import { FiArrowUp } from "react-icons/fi"

export default function OverviewCard({ updatedAt, amount, title, selected, size, trend, startDate, linkTo }) {
    const router = useRouter()
    const displayAmount = () => amount ? formatNumber(amount, "N") : "..."

    return (
        <div
            onClick={() => router.push(linkTo)}
            className={`overview-card ${selected ? "selected" : ""} ${size}`}>
            <div className="title">{title}</div>
            <div className="amount">{displayAmount()}</div>
            <div className="info auto-bottom">
                {startDate && amount ? `Started ${formatDate(startDate)[0]}` : null}
                {
                    trend &&
                    <>
                        <FiArrowUp />
                        <span className="trend-percentage">{trend}</span>
                    </>
                }
            </div>
        </div>
    )
}