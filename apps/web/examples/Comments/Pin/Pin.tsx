import { IoMdPin } from "react-icons/io";

type PinProps = {
    color: string;
};

export default function Pin({ color }: PinProps) {
    return (
        <div>
            <IoMdPin style={{ fontSize: '24px', color: color, filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.25))' }} />
        </div>
    );
}