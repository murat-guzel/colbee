import React, { forwardRef } from 'react'
import type { ComponentPropsWithRef } from 'react'

interface InputProps extends ComponentPropsWithRef<'input'> {
    textArea?: boolean
    invalid?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', textArea, invalid, ...rest }, ref) => {
        const baseClass = `block w-full rounded-md border ${
            invalid ? 'border-red-500' : 'border-gray-300'
        } focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`

        if (textArea) {
            return (
                <textarea
                    ref={ref as React.RefObject<HTMLTextAreaElement>}
                    className={`${baseClass} ${className}`}
                    rows={4}
                    {...(rest as ComponentPropsWithRef<'textarea'>)}
                />
            )
        }

        return (
            <input
                ref={ref}
                className={`${baseClass} ${className}`}
                {...rest}
            />
        )
    }
)

Input.displayName = 'Input'

export default Input 