import { notifications } from "@utils/dummyData"
import { FiCornerDownRight } from "react-icons/fi"

interface Props {
    title?: string
    reverse?: boolean
}
export default function Activities(props: Props) {
    const data = props.reverse ? notifications.slice().reverse() : notifications

    return (
        <div className={`w-full py-3 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md`}>
            <h2 className="px-5 py-3 text-xl text-gray-600">{props.title ?? "Activities"}</h2>
            {
                data.map((item, i) => {
                    const { userID, message, timestamp } = item
                    const [first_name, last_name] = ['John', 'Doe']
                    const interval = i % 2 === 0
                    return (
                        <div key={i}>
                            <div className={`flex px-4 py-2.5 text-sm leading-5 text-left space-x-3 cursor-pointer bg-white hover:bg-blue-50`}>
                                <div className={`rounded-full grid flex-shrink-0 w-6 h-6 place-items-center text-gray-600`}>
                                    {interval ? <FiCornerDownRight className="text-lg text-gray-400" /> : null}
                                </div>
                                <p className={interval ? "text-indigo-900" : "text-gray-500"}>
                                    {userID ? `${first_name} ${last_name} ${message}` : message}
                                    <span className={"block mt-1 text-gray-400 text-xs"}>{timestamp}</span>
                                </p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}