import { useId } from 'react'

/**
 * Four-point "AI" sparkle used across the app.
 * variant="gradient" fills it with the brand gradient; variant="solid" uses currentColor.
 */
const Sparkle = ({ size = 20, variant = 'gradient', className = '' }) => {
    const gradientId = useId()
    const fill = variant === 'gradient' ? `url(#${gradientId})` : 'currentColor'

    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            {variant === 'gradient' && (
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#2f80fe" />
                        <stop offset="1" stopColor="#28f1ca" />
                    </linearGradient>
                </defs>
            )}
            <path fill={fill} d="M10 6Q11.2 12.8 18 14Q11.2 15.2 10 22Q8.8 15.2 2 14Q8.8 12.8 10 6Z" />
            <path fill={fill} d="M19 1.5Q19.5 4.5 22.5 5Q19.5 5.5 19 8.5Q18.5 5.5 15.5 5Q18.5 4.5 19 1.5Z" />
        </svg>
    )
}

export default Sparkle
