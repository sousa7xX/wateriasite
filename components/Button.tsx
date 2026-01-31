import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false,
  ...props 
}) => {
  const baseStyles = "relative px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-cyan-500 hover:bg-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-400/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.7)]",
    secondary: "bg-slate-800/50 hover:bg-slate-700/50 text-cyan-100 border border-slate-700 hover:border-cyan-500/50 backdrop-blur-md",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30",
    ghost: "bg-transparent hover:bg-white/5 text-slate-300 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processando...
        </>
      ) : children}
      
      {/* Gloss effect overlay */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      )}
    </button>
  );
};