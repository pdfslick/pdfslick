type PinProps = {
    color: string;
};

export default function Pin({ color }: PinProps) {
    return (
        <div>
            <div
                style={{
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    background: color,
                }}
            />
        </div>
    );
}