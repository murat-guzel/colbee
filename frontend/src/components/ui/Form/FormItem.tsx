import { forwardRef } from 'react'
import type { ComponentPropsWithRef } from 'react'

interface FormItemProps extends ComponentPropsWithRef<'div'> {
    label?: string
    invalid?: boolean
    errorMessage?: string
}

const FormItem = forwardRef<HTMLDivElement, FormItemProps>((props, ref) => {
    const { children, label, invalid, errorMessage, className = '', ...rest } = props

    return (
        <div ref={ref} className={`mb-4 ${className}`} {...rest}>
            {label && (
                <label className="block mb-2 font-medium">
                    {label}
                </label>
            )}
            {children}
            {invalid && errorMessage && (
                <div className="text-red-500 mt-1 text-sm">
                    {errorMessage}
                </div>
            )}
        </div>
    )
})

FormItem.displayName = 'FormItem'

export default FormItem 