import React, { forwardRef, useEffect, useState } from 'react'
import type { ComponentPropsWithRef } from 'react'

interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'onChange'> {
    defaultChecked?: boolean
    onChange?: (checked: boolean) => void
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className = '', defaultChecked = false, onChange, children, ...rest }, ref) => {
        const [checked, setChecked] = useState(defaultChecked)

        useEffect(() => {
            setChecked(defaultChecked)
        }, [defaultChecked])

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newChecked = e.target.checked
            setChecked(newChecked)
            onChange?.(newChecked)
        }

        return (
            <label className={`inline-flex items-center ${className}`}>
                <input
                    ref={ref}
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={checked}
                    onChange={handleChange}
                    {...rest}
                />
                {children && <span className="ml-2">{children}</span>}
            </label>
        )
    }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox 