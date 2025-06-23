'use client'

import { useMemo, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { Form, FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { countryList } from '@/constants/countries.constant'
import { components } from 'react-select'
import type { ControlProps, OptionProps } from 'react-select'
import { apiGetUserProfile, apiUpdateUserProfile, apiUploadProfilePhoto, apiDeleteProfilePhoto, getProfilePhotoUrl } from '@/services/ProfileService'
import sleep from '@/utils/sleep'
import useSWR from 'swr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { HiOutlineUser } from 'react-icons/hi'
import { TbPlus } from 'react-icons/tb'
import type { ZodType } from 'zod'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

type ProfileSchema = {
    firstName: string
    lastName: string
    email: string
    dialCode?: string
    phoneNumber?: string
    img: string
    country?: string
    address?: string
    postcode?: string
    city?: string
}

type CountryOption = {
    label: string
    dialCode: string
    value: string
}

type UserProfile = {
    id: string
    firstName: string
    lastName: string
    email: string
    dialCode: string
    phoneNumber: string
    profilePhotoUrl?: string
    country: string
    address: string
    postcode: string
    city: string
}

const { Control } = components

const validationSchema: ZodType<ProfileSchema> = z.object({
    firstName: z.string().min(1, { message: 'First name required' }),
    lastName: z.string().min(1, { message: 'Last name required' }),
    email: z
        .string()
        .min(1, { message: 'Email required' })
        .email({ message: 'Invalid email' }),
    dialCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    country: z.string().optional(),
    address: z.string().optional(),
    postcode: z.string().optional(),
    city: z.string().optional(),
    img: z.string(),
})

const CustomSelectOption = (
    props: OptionProps<CountryOption> & { variant: 'country' | 'phone' },
) => {
    return (
        <DefaultOption<CountryOption>
            {...props}
            customLabel={(data, label) => (
                <span className="flex items-center gap-2">
                    <Avatar
                        shape="circle"
                        size={20}
                        src={`/img/countries/${data.value}.png`}
                    />
                    {props.variant === 'country' && <span>{label}</span>}
                    {props.variant === 'phone' && <span>{data.dialCode}</span>}
                </span>
            )}
        />
    )
}

const CustomControl = ({ children, ...props }: ControlProps<CountryOption>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Avatar
                    className="ltr:ml-4 rtl:mr-4"
                    shape="circle"
                    size={20}
                    src={`/img/countries/${selected.value}.png`}
                />
            )}
            {children}
        </Control>
    )
}

const SettingsProfile = () => {
    const { session } = useCurrentSession();
    const userId = session?.user?.id;
    const [uploading, setUploading] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const { data, mutate } = useSWR<UserProfile>(
        userId ? `/api/profile/${userId}` : null,
        userId ? () => apiGetUserProfile(userId) : null,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    const dialCodeList = useMemo(() => {
        const newCountryList: Array<CountryOption> = JSON.parse(
            JSON.stringify(countryList),
        )

        return newCountryList.map((country) => {
            country.label = country.dialCode
            return country
        })
    }, [])

    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true

        const allowedFileType = ['image/jpeg', 'image/png']
        if (files) {
            const fileArray = Array.from(files)
            for (const file of fileArray) {
                if (!allowedFileType.includes(file.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }
            }
        }

        return valid
    }

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
        setValue,
    } = useForm<ProfileSchema>({
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (data) {
            // Map the backend data to the form structure
            reset({
                firstName: data?.firstName || '',
                lastName: data?.lastName || '',
                email: data?.email || '',
                dialCode: data?.dialCode || '',
                phoneNumber: data?.phoneNumber || '',
                img: data?.profilePhotoUrl || '',
                country: data?.country || '',
                address: data?.address || '',
                postcode: data?.postcode || '',
                city: data?.city || '',
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const onSubmit = async (values: ProfileSchema) => {
        if (!userId) return;
        try {
            await apiUpdateUserProfile(userId, {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                dialCode: values.dialCode,
                phoneNumber: values.phoneNumber,
                country: values.country,
                address: values.address,
                postcode: values.postcode,
                city: values.city,
            })
            
            // Update the local data
            if (data) {
                mutate({ ...data, ...values }, false)
            }
            // Başarıyla kaydedildiğinde toast göster
            toast.push(
                <Notification type="success" title="Kaydedildi">
                    Bilgileriniz başarıyla kaydedildi.
                </Notification>
            )
        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    const handlePhotoUpload = async (fileList: File[], _fileListAll: File[]) => {
        if (!userId || !fileList || fileList.length === 0) return

        setUploading(true)
        try {
            const file = fileList[0]
            const response = await apiUploadProfilePhoto(userId, file) as { photoUrl: string }
            
            // Update the form with the new photo URL
            setValue('img', response.photoUrl)
            
            // Update the local data
            if (data) {
                mutate({ ...data, profilePhotoUrl: response.photoUrl }, false)
            }
        } catch (error) {
            console.error('Error uploading photo:', error)
        } finally {
            setUploading(false)
        }
    }

    const handlePhotoDelete = async () => {
        if (!userId) return;
        setDeleting(true)
        try {
            await apiDeleteProfilePhoto(userId)
            
            // Clear the photo URL
            setValue('img', '')
            
            // Update the local data
            if (data) {
                mutate({ ...data, profilePhotoUrl: '' }, false)
            }
        } catch (error) {
            console.error('Error deleting photo:', error)
        } finally {
            setDeleting(false)
        }
    }

    const getPhotoUrl = () => {
        if (!data?.profilePhotoUrl) return ''
        
        // If it's already a full URL, return as is
        if (data.profilePhotoUrl.startsWith('http')) {
            return data.profilePhotoUrl
        }
        
        // If it's a relative path, construct the full URL
        return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${data.profilePhotoUrl}`
    }

    return (
        <>
            <h4 className="mb-8">Personal information</h4>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-8">
                    <Controller
                        name="img"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-4">
                                <Avatar
                                    size={90}
                                    className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                                    icon={<HiOutlineUser />}
                                    src={getPhotoUrl()}
                                />
                                <div className="flex items-center gap-2">
                                    <Upload
                                        showList={false}
                                        uploadLimit={1}
                                        beforeUpload={beforeUpload}
                                        onChange={handlePhotoUpload}
                                        disabled={uploading}
                                    >
                                        <Button
                                            variant="solid"
                                            size="sm"
                                            type="button"
                                            icon={<TbPlus />}
                                            loading={uploading}
                                        >
                                            Upload Image
                                        </Button>
                                    </Upload>
                                    <Button
                                        size="sm"
                                        type="button"
                                        onClick={handlePhotoDelete}
                                        loading={deleting}
                                        disabled={!data?.profilePhotoUrl}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        )}
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormItem
                        label="First name"
                        invalid={Boolean(errors.firstName)}
                        errorMessage={errors.firstName?.message}
                    >
                        <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="First Name"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="User name"
                        invalid={Boolean(errors.lastName)}
                        errorMessage={errors.lastName?.message}
                    >
                        <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Last Name"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <FormItem
                    label="Email"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                autoComplete="off"
                                placeholder="Email"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <div className="flex items-end gap-4 w-full mb-6">
                    <FormItem
                        invalid={
                            Boolean(errors.phoneNumber) ||
                            Boolean(errors.dialCode)
                        }
                    >
                        <label className="form-label mb-2">Phone number</label>
                        <Controller
                            name="dialCode"
                            control={control}
                            render={({ field }) => (
                                <Select<CountryOption>
                                    instanceId="dial-code"
                                    options={dialCodeList}
                                    {...field}
                                    className="w-[150px]"
                                    components={{
                                        Option: (props) => (
                                            <CustomSelectOption
                                                variant="phone"
                                                {...(props as OptionProps<CountryOption>)}
                                            />
                                        ),
                                        Control: CustomControl,
                                    }}
                                    placeholder=""
                                    value={dialCodeList.filter(
                                        (option) =>
                                            option.dialCode === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.dialCode)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        className="w-full"
                        invalid={
                            Boolean(errors.phoneNumber) ||
                            Boolean(errors.dialCode)
                        }
                        errorMessage={errors.phoneNumber?.message}
                    >
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    autoComplete="off"
                                    placeholder="Phone Number"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <h4 className="mb-6">Address information</h4>
                <FormItem
                    label="Country"
                    invalid={Boolean(errors.country)}
                    errorMessage={errors.country?.message}
                >
                    <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                            <Select<CountryOption>
                                instanceId="country"
                                options={countryList}
                                {...field}
                                components={{
                                    Option: (props) => (
                                        <CustomSelectOption
                                            variant="country"
                                            {...(props as OptionProps<CountryOption>)}
                                        />
                                    ),
                                    Control: CustomControl,
                                }}
                                placeholder=""
                                value={countryList.filter(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Address"
                    invalid={Boolean(errors.address)}
                    errorMessage={errors.address?.message}
                >
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Address"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                        label="City"
                        invalid={Boolean(errors.city)}
                        errorMessage={errors.city?.message}
                    >
                        <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="City"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Postal Code"
                        invalid={Boolean(errors.postcode)}
                        errorMessage={errors.postcode?.message}
                    >
                        <Controller
                            name="postcode"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Postal Code"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <div className="flex justify-end">
                    <Button
                        variant="solid"
                        type="submit"
                        loading={isSubmitting}
                    >
                        Save
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default SettingsProfile
