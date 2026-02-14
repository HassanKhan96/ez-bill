
export const COLORS = {
    primary: "#4F46E5", // Indigo 600
    secondary: "#10B981", // Emerald 500
    background: "#F3F4F6", // Gray 100
    card: "#FFFFFF",
    text: "#1F2937", // Gray 800
    textLight: "#6B7280", // Gray 500
    border: "#E5E7EB", // Gray 200
    error: "#EF4444", // Red 500
    success: "#10B981", // Emerald 500
    warning: "#F59E0B", // Amber 500
    white: "#FFFFFF",
    black: "#000000",
    overlay: "rgba(0,0,0,0.5)",
};

export const SIZES = {
    base: 8,
    small: 12,
    font: 14,
    medium: 16,
    large: 18,
    extraLarge: 24,
    radius: 12,
    padding: 24,
};

export const SHADOWS = {
    light: {
        shadowColor: COLORS.text,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    medium: {
        shadowColor: COLORS.text,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    dark: {
        shadowColor: COLORS.text,
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
    },
};
