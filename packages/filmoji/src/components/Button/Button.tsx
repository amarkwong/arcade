import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
	return (
		<button
			className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 px-4 py-2 font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition hover:brightness-110 disabled:opacity-60 ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
