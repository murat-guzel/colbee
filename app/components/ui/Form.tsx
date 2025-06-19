'use client'

import React from 'react'

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    children: React.ReactNode
}

export const Form: React.FC<FormProps> = ({
    children,
    className = '',
    ...props
}) => {
    return (
        <form className={className} {...props}>
            {children}
        </form>
    )
}

export default Form 