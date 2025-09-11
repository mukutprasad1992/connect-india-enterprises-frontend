import { SvgIcon, SvgIconProps } from "@mui/material";

export function InProgressStepIcon(props: SvgIconProps) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            {/* Outline Circle */}
            <circle
                cx="12"
                cy="12"
                r="11"
                fill="none"
                stroke="#4caf50"
                strokeWidth="2"
            />

            {/* Bottom half filled green */}
            <path
                d="M1 12a11 11 0 0 0 22 0H1z"
                fill="#4caf50"
            />
        </SvgIcon>
    )
}

export function CompleteStepIcon(props: SvgIconProps) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            {/* ✅ Green filled circle */}
            <circle cx="12" cy="12" r="12" fill="#4caf50" />

            {/* ✅ White checkmark */}
            <path
                d="M7.5 12.5l3 3 6-6"
                stroke="#fff"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    )
}
export default function InCompleteStepIcon(props: SvgIconProps) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#2196f3" /> {/* Material Blue 500 */}
        </SvgIcon>
    );
}