import React from 'react'
import ReactSelect, { Props as ReactSelectProps } from 'react-select'

export interface SelectOption {
    label: string
    value: string | number
    [key: string]: any
}

interface SelectProps extends Omit<ReactSelectProps<SelectOption, boolean>, 'options'> {
    options: SelectOption[]
    invalid?: boolean
}

const Select = ({ className = '', invalid, ...props }: SelectProps) => {
    return (
        <ReactSelect
            className={`${className}`}
            classNames={{
                control: (state) =>
                    `!border ${
                        invalid
                            ? '!border-red-500'
                            : state.isFocused
                            ? '!border-indigo-500'
                            : '!border-gray-300'
                    } !shadow-none`,
                option: (state) =>
                    `${
                        state.isSelected
                            ? '!bg-indigo-500'
                            : state.isFocused
                            ? '!bg-indigo-50'
                            : 'bg-white'
                    }`,
            }}
            {...props}
        />
    )
}

export default Select 