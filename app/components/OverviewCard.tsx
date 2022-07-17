import { formatDate, formatNumber } from "@utils/index"
import { FiArrowUp } from "react-icons/fi"
import { useNavigate } from 'react-router-dom'

export default function OverviewCard({ updatedAt, amount, title, selected, size, trend, startDate, linkTo }) {

    const navigate = useNavigate()

    const displayAmount = () => amount ? formatNumber(amount, "N") : "..."


    return (
        <div
            onClick={() => navigate(linkTo)}
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