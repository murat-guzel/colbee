'use client'

import React, { useState } from 'react'
import Dialog from '../../../../../../../components/ui/Dialog'
import Button from '../../../../../../../components/ui/Button'
import Input from '../../../../../../../components/ui/Input'
import Form from '../../../../../../../components/ui/Form'
import { TbX } from 'react-icons/tb'

interface CommentDialogProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (comment: string) => void
}

const CommentDialog = ({ isOpen, onClose, onSubmit }: CommentDialogProps) => {
    const [email, setEmail] = useState('')

    const handleSubmit = () => {
        onSubmit(email)
        setEmail('')
        onClose()
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={800}
            className="rounded-none"
        >
            <div className="relative p-6">
                {/* Close button */}
                <button
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    <TbX size={20} />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h4 className="text-lg font-semibold mb-2">Check out now & recieve</h4>
                    <div className="text-4xl font-bold text-primary mb-1">10% OFF</div>
                    <p className="text-gray-500">your first order</p>
                </div>

                {/* Form */}
                <Form onSubmit={handleSubmit} className="mt-8">
                    <div className="mb-4">
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email address"
                            type="email"
                            autoFocus
                            className="w-full"
                        />
                    </div>
                    <Button
                        variant="solid"
                        onClick={handleSubmit}
                        className="w-full"
                    >
                        Get my 10% off!
                    </Button>
                </Form>
            </div>
        </Dialog>
    )
}

export default CommentDialog 