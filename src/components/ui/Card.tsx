import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'default' | 'bordered' | 'elevated' | 'success' | 'warning';
}

export function Card({ children, variant = 'default', className, ...props }: CardProps) {
    const variants = {
        default: 'bg-white border border-gray-200 shadow-sm',
        bordered: 'bg-white border-2 border-primary',
        elevated: 'bg-white shadow-lg',
        success: 'bg-white border-l-4 border-success shadow-sm',
        warning: 'bg-white border-l-4 border-warning shadow-sm',
    };

    return (
        <div
            className={cn(
                'rounded-lg p-6 transition-all duration-200',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
    return (
        <div className={cn('mb-4', className)} {...props}>
            {children}
        </div>
    );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}

export function CardTitle({ children, className, ...props }: CardTitleProps) {
    return (
        <h3 className={cn('text-xl font-semibold text-charcoal', className)} {...props}>
            {children}
        </h3>
    );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function CardContent({ children, className, ...props }: CardContentProps) {
    return (
        <div className={cn('text-charcoal/80', className)} {...props}>
            {children}
        </div>
    );
}
