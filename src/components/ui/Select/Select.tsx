import React from 'react'
import ReactSelect, { Props as ReactSelectProps } from 'react-select'

export interface SelectOption {
    label: string
    value: string
    [key: string]: any
}

interface SelectProps<T extends SelectOption, IsMulti extends boolean = false> extends Omit<ReactSelectProps<T, IsMulti>, 'options'> {
    options: T[]
}

const Select = <T extends SelectOption, IsMulti extends boolean = false>({ 
    className = '',
    ...props
}: SelectProps<T, IsMulti>) => {
    return (
        <ReactSelect
            className={`react-select ${className}`}
            classNamePrefix="react-select"
            {...props}
        />
    )
}

export default Select 