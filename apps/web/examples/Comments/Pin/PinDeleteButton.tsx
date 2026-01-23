import { VscTrash } from "react-icons/vsc";

type PinDeleteButtonProps = {
    onDelete: () => void;
};

export default function PinDeleteButton({ onDelete }: PinDeleteButtonProps) {
    return (
        <div
            style={{
                position: 'absolute',
                bottom: '15px',
                left: '15px',
                width: '30px',
                height: '30px',
                background: '',
                cursor: 'pointer'
            }}
            onClick={(e) => {
                e.stopPropagation();
                onDelete();
            }}
        >
            <VscTrash style={{width: '25px', height: '25px', color: '#6b7e98', background: '#e3e6eb', borderRadius: '5%', border: '1px solid #6b7e98', padding: '5px', justifyContent: 'center', alignItems: 'center'}} />
        </div>
    );
}