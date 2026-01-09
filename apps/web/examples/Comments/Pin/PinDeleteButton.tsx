import { VscTrash } from "react-icons/vsc";

type PinDeleteButtonProps = {
    handleDeletePin: (annotationId: string) => void;
    setSelectedPinId: (annotationId: string | null) => void;
    annotationId: string;
};

export default function PinDeleteButton({ handleDeletePin, setSelectedPinId, annotationId }: PinDeleteButtonProps) {
    return (
        <div
            style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                width: '30px',
                height: '30px',
                background: 'red',
                cursor: 'pointer'
            }}
            onClick={(e) => {
                e.stopPropagation(); // Prevent triggering pin selection again from parent div
                handleDeletePin(annotationId);
                setSelectedPinId(null);
            }}
        >
            <VscTrash style={{width: '30px', height: '30px', color: 'white'}} />
        </div>
    );
}