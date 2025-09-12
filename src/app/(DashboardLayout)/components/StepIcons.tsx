import { SvgIcon, SvgIconProps } from "@mui/material";
import { useState } from "react";

type LiquidFillProps = SvgIconProps & {
    fillColor: string;
    defaultFill: number;
    children?: React.ReactNode;
};

function LiquidFillIcon({
    children,
    fillColor,
    defaultFill,
    ...props
}: LiquidFillProps) {
    const [fill, setFill] = useState(defaultFill);

    const runAnimation = () => {
        setFill(0);
        setTimeout(() => {
            setFill(defaultFill);
        }, 600);
    };

    return (
        <SvgIcon
            {...props}
            viewBox="0 0 24 24"
            onMouseEnter={runAnimation}
            style={{ cursor: "pointer" }}
        >
            <defs>
                <clipPath id="clipCircle">
                    <circle cx="12" cy="12" r="12" />
                </clipPath>
            </defs>
            <circle
                cx="12"
                cy="12"
                r="11"
                stroke={fillColor}
                strokeWidth="2"
                fill="none"
            />
            <rect
                x="0"
                y={24 - fill}
                width="24"
                height={fill}
                fill={fillColor}
                clipPath="url(#clipCircle)"
                style={{ transition: "all 0.6s ease-in-out" }}
            />

            {children}
        </SvgIcon>
    );
}
export function InProgressStepIcon(props: SvgIconProps) {
    return <LiquidFillIcon {...props} fillColor="#4caf50" defaultFill={12} />;
}

export function CompleteStepIcon(props: SvgIconProps) {
    return (
        <LiquidFillIcon {...props} fillColor="#4caf50" defaultFill={24}>
            <path
                d="M7.5 12.5l3 3 6-6"
                stroke="#ffffffff"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </LiquidFillIcon>
    );
}
export default function InCompleteStepIcon(props: SvgIconProps) {
    return <LiquidFillIcon {...props} fillColor="#2196f3" defaultFill={24} />;
}
