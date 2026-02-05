import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-8 py-3 transition-all duration-300 tracking-widest text-sm font-medium uppercase border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black";
  
  const variants = {
    primary: "bg-white text-black border-white hover:bg-neutral-200 focus:ring-white",
    secondary: "bg-gold-500 text-black border-gold-500 hover:bg-gold-400 focus:ring-gold-500",
    outline: "bg-transparent text-white border-white/30 hover:border-white hover:bg-white/5 focus:ring-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};