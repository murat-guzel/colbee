import React, { forwardRef } from 'react'
import type { ComponentPropsWithRef } from 'react'

interface FormProps extends ComponentPropsWithRef<'form'> {
    children?: React.ReactNode
    className?: string
}

export const Form = forwardRef<HTMLFormElement, FormProps>(
    ({ children, className = '', ...rest }, ref) => {
        return (
            <form ref={ref} className={`space-y-6 ${className}`} {...rest}>
                {children}
            </form>
        )
    }
)

Form.displayName = 'Form'

interface FormItemProps {
    children?: React.ReactNode
    label?: string
    invalid?: boolean
    errorMessage?: string
    className?: string
}

export const FormItem = ({ children, label, invalid, errorMessage, className = '' }: FormItemProps) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className={`block text-sm font-medium ${invalid ? 'text-red-500' : 'text-gray-700'}`}>
                    {label}
                </label>
            )}
            {children}
            {invalid && errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
            )}
        </div>
    )
}

FormItem.displayName = 'FormItem'

export default Form 