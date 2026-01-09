import { VscTrash } from "react-icons/vsc";

type PinDeleteButtonProps = {
    onDelete: () => void;
};

export default function PinDeleteButton({ onDelete }: PinDeleteButtonProps) {
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
                e.stopPropagation();
                onDelete();
            }}
        >
            <VscTrash style={{width: '30px', height: '30px', color: 'white'}} />
        </div>
    );
}