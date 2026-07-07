const Modal = ({
    isOpen,
    onClose,
    title,
    children,
}) => {

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

            <div className="bg-white rounded-xl w-full max-w-lg shadow-lg">

                {/* Header */}

                <div className="flex justify-between items-center border-b p-4">

                    <h2>{title}</h2>

                    <button onClick={onClose}>
                        ✕
                    </button>

                </div>

                {/* Body */}

                <div className="p-6">

                    {children}

                </div>

            </div>

        </div>

    );

};

export default Modal;