import React, { createContext, useContext, useState } from 'react';
import ProjectionViewer from "@components/ProjectionViewer";
import AddBlacklistModal from "@modals/AddBlacklist.modal";
import AddCustomerModal from "@modals/AddCustomer.modal";
import AddDepositModal from '@modals/AddDeposit.modal';
import AddLiquidation from '@modals/AddLiquidation.modal';
import AddLoanModal from "@modals/AddLoan.modal";
import AddRepaymentModal from "@modals/AddRepayment.modal";
import AddSurcharge from "@modals/AddSurcharge";
import Drawer from "@modals/Drawer.modal";
import EditDeposit from "@modals/EditDeposit";
import EditLiquidation from "@modals/EditLiquidation";
import EditLoan from "@modals/EditLoan";
import EditRepayment from "@modals/EditRepayment";
import Modal from "@modals/Modal";
import TopUpDeposit from "@modals/AddDepositTopup.modal";
import PDFViewer from "@components/PDFViewer";
import { AnimatePresence } from "framer-motion";
import ImageUploader from '@components/ImageUploader';
import EditBlacklist from '@modals/EditBlacklist.modal';
import PreviewDeposit from '@modals/PreviewDeposit.modal';
import PreviewLoan from '@modals/PreviewLoan.modal';
import EditDepositTopup from '@modals/EditDepositTopup';
import EditSurcharge from '@modals/EditSurcharge';
import AddExpense from '@modals/AddExpense.modal';
import EditExpense from '@modals/EditExpense.modal';

type Args = Parameters<ContextProps["openModal"]>
interface ContextProps {
    openModal: (name: _ModalState["name"], data?: any, title?: string) => void,
    closeModal(): void,
}

export const ModalContext = createContext({} as ContextProps)
export const useModal = () => useContext(ModalContext)

export const ModalProvider = (props: { children: React.ReactNode }) => {
    const emptyModalState: _ModalState = { name: undefined, data: undefined, title: undefined }
    const [modal, setModal] = useState<_ModalState>(emptyModalState)

    const closeModal = () => setModal(emptyModalState)
    const openModal = (...args: Args) => {
        setModal({ name: args[0], data: args[1], title: args[2] })
    }

    const open = (...args: Args) => {
        const [name, data, title] = args

        switch (name) {
            case "addCustomer":
                return (
                    <Drawer
                        isOpen={modal.name === name}
                        close={closeModal}
                    >
                        <AddCustomerModal />
                    </Drawer>
                )
            case "addLoan":
                return (
                    <Drawer
                        isOpen={modal.name === name}
                        close={closeModal}
                    ><AddLoanModal />
                    </Drawer>
                )
            case "addRepayment":
                return (
                    <Drawer
                        isOpen={modal.name === name}
                        close={closeModal}
                    ><AddRepaymentModal data={data} />
                    </Drawer>
                )
            case "addDeposit":
                return (
                    <Drawer
                        isOpen={modal.name === name}
                        close={closeModal}
                    ><AddDepositModal customer={data} />
                    </Drawer>
                )
            case "addLiquidation":
                return (
                    <Drawer
                        isOpen={modal.name === name}
                        close={closeModal}
                    ><AddLiquidation data={data} />
                    </Drawer>
                )
            case "addBlacklist":
                return (
                    <Drawer
                        isOpen={modal.name === name}
                        close={closeModal}
                    ><AddBlacklistModal />
                    </Drawer>
                )
            case "addExpense":
                return (
                    <Drawer
                        isOpen={modal.name === name}
                        close={closeModal}
                    ><AddExpense />
                    </Drawer>
                )
            case "projectionViewer":
                return (
                    <Modal
                        isOpen={modal.name === name}
                        close={closeModal}
                        title={title ?? ""}
                        maxWidth="max-w-2xl"
                    ><ProjectionViewer projection={data} />
                    </Modal>
                )
            case "pdfViewer":
                return (
                    <Modal
                        isOpen={modal.name === name}
                        close={closeModal}
                        title={title ?? ""}
                        maxWidth="max-w-7xl h-full"
                    >
                        <PDFViewer document={data} />
                    </Modal>
                )
            case "editLoan":
                return (
                    <Modal
                        close={closeModal}
                        isOpen={modal.name === name}
                        title={title ?? "Edit loan"}
                        maxWidth="max-w-lg"
                    >
                        <EditLoan loan={data} />
                    </Modal>
                )
            case "editSurcharge":
                return (
                    <Modal
                        close={closeModal}
                        isOpen={modal.name === name}
                        title={title ?? "Edit surcharge for loan"}
                        maxWidth="max-w-lg"
                    >
                        <EditSurcharge surcharge={data} />
                    </Modal>
                )
            case "editRepayment":
                return (
                    <Modal
                        close={closeModal}
                        isOpen={modal.name === name}
                        title={title ?? ""}
                        maxWidth="max-w-lg"
                    >
                        <EditRepayment repayment={data} />
                    </Modal>
                )
            case "editDepositTopup":
                return (
                    <Modal
                        close={closeModal}
                        isOpen={modal.name === name}
                        title={title ?? "Edit fixed deposit top-up"}
                        maxWidth="max-w-lg"
                    >
                        <EditDepositTopup depositTopup={data} />
                    </Modal>
                )
            case "editDeposit":
                return (
                    <Modal
                        close={closeModal}
                        isOpen={modal.name === name}
                        title={title ?? "Edit fixed deposit"}
                        maxWidth="max-w-lg"
                    >
                        <EditDeposit deposit={data} />
                    </Modal>
                )
            case "editExpense":
                return (
                    <Modal
                        close={closeModal}
                        isOpen={modal.name === name}
                        title={title ?? "Edit expense"}
                        maxWidth="max-w-lg"
                    >
                        <EditExpense expense={data} />
                    </Modal>
                )
            case "editBlacklist":
                return (
                    <Modal
                        close={closeModal}
                        isOpen={modal.name === name}
                        title={title ?? "Edititng blacklist record"}
                        maxWidth="max-w-lg"
                    >
                        <EditBlacklist blacklist={data} />
                    </Modal>
                )
            case "topUpDeposit":
                return (
                    <Drawer
                        isOpen={modal.name === name}
                        close={closeModal}
                    ><TopUpDeposit deposit={data} />
                    </Drawer>
                )
            case "previewDeposit":
                return (
                    <Drawer
                        isOpen={modal.name === name}
                        close={closeModal}
                    ><PreviewDeposit deposit={data} />
                    </Drawer>
                )
            case "previewLoan":
                return (
                    <Drawer
                        isOpen={modal.name === name}
                        close={closeModal}
                    ><PreviewLoan loan={data} />
                    </Drawer>
                )
            case "editLiquidation":
                return (
                    <Modal
                        close={closeModal}
                        isOpen={modal.name === name}
                        title={title ?? "Edit liquidation"}
                        maxWidth="max-w-lg"
                    >
                        <EditLiquidation liquidation={data} />
                    </Modal>
                )
            case "addSurcharge":
                return (
                    <Modal
                        close={closeModal}
                        isOpen={modal.name === name}
                        title={title ?? "Adding Surcharge"}
                        maxWidth="max-w-lg"
                    >
                        <AddSurcharge loan={data} />
                    </Modal>
                )
            case "imageUploader":
                return (
                    <Modal
                        close={closeModal}
                        isOpen={modal.name === name}
                        title={title ?? ""}
                        maxWidth="max-w-md"
                    >
                        <ImageUploader {...data} close={closeModal} />
                    </Modal>
                )

            default:
                return null;
        }
    }

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {
                <AnimatePresence>
                    {modal.name && open(modal.name, modal.data, modal.title)}
                </AnimatePresence>
            }
            {props.children}
        </ModalContext.Provider>
    );
}