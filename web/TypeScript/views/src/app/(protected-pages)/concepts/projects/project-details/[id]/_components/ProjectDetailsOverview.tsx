import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Progress from '@/components/ui/Progress'
import Tag from '@/components/ui/Tag'
import ReactHtmlParser from 'html-react-parser'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui'
import { Form, FormItem } from '@/components/ui/Form'
import { Input } from '@/components/ui'
import { useForm, Controller } from 'react-hook-form'
import { Dialog } from '@/components/ui'
import MacWindowHeader from '@/components/MacWindowHeader'
import { useParams } from 'next/navigation'

const MonacoEditor = dynamic(
    () => import('@monaco-editor/react').then((mod) => mod.Editor),
    { 
        ssr: false,
        loading: () => (
            <div className="h-[400px] border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">Loading editor...</div>
            </div>
        )
    }
)

type ProjectDetailsOverviewProps = {
    content: string
    isContentEdit: boolean
    onContentChange: (content: string) => void
    setIsContentEdit: (isEdit: boolean) => void
    projectName: string
    client: Partial<{
        clientName: string
        skateHolder: {
            name: string
            img: string
        }
        projectManager: {
            name: string
            img: string
        }
    }>
    schedule: Partial<{
        startDate: number
        dueDate: number
        status: string
        completion: number
    }>
}

type CommentFormData = {
    comment: string
}

const ProjectDetailsOverview = (props: ProjectDetailsOverviewProps) => {
    const { content = '', client = {}, schedule = {}, projectName } = props
    const editorRef = useRef<any>(null)
    const monacoRef = useRef<any>(null)
    const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
    const [selectedLine, setSelectedLine] = useState<number | null>(null)
    const [isEditorMounted, setIsEditorMounted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
    const params = useParams()

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const projectId = params.id as string
                const response = await fetch(`/api/projects/${projectId}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch project details')
                }
                const projectDetails = await response.json()
                // alert(JSON.stringify(projectDetails, null, 2))
            } catch (error) {
                console.error('Error fetching project details:', error)
                // alert('Error fetching project details')
            }
        }

        fetchProjectDetails()
    }, [params.id])

    const { handleSubmit, control, reset } = useForm<CommentFormData>({
        defaultValues: {
            comment: ''
        }
    })

    const handleEditorChange = (value: string | undefined) => {
        if (value) {
            try {
                // Validate JSON
                JSON.parse(value)
                props.onContentChange(value)
            } catch (e) {
                // Invalid JSON, don't update
                console.error('Invalid JSON:', e)
            }
        }
    }

    const onSubmitComment = async (data: CommentFormData) => {
        if (!selectedLine || !params.id) {
            console.error('No line selected or project ID missing')
            return
        }

        setIsSubmitting(true)
        
        try {
            console.log('Submitting comment:', {
                projectId: params.id,
                projectName: projectName,
                lineNumber: selectedLine,
                content: data.comment
            })

            // Save comment to MongoDB
            const response = await fetch(`/api/projects/${params.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: data.comment,
                    lineNumber: selectedLine,
                    author: 'User', // You can make this dynamic based on logged-in user
                    projectName: projectName,
                    projectId: params.id
                })
            })

            console.log('Response status:', response.status)

            if (!response.ok) {
                const errorData = await response.json()
                console.error('Error response:', errorData)
                throw new Error(`Failed to save comment: ${response.status} - ${errorData.error || 'Unknown error'}`)
            }

            const savedComment = await response.json()
            console.log('Comment saved successfully:', savedComment)

            setIsCommentDialogOpen(false)
            setIsSuccessDialogOpen(true)
            reset()
        } catch (error) {
            console.error('Error saving comment:', error)
            alert(`Failed to save comment: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor
        monacoRef.current = monaco

        let currentLine: number | null = null;
        let pencilIcon: HTMLDivElement | null = null;
        let isPencilHovered = false;
        let hideTimeout: NodeJS.Timeout | null = null;

        // SVG for pencil icon
        const pencilSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M8 9h8"/>
            <path d="M8 13h6"/>
        </svg>`;

        function showPencilIconAtLineEnd(lineNumber: number) {
            const model = editor.getModel();
            const lineLength = model.getLineLength(lineNumber);
            const pos = editor.getScrolledVisiblePosition({ lineNumber, column: lineLength + 1 });
            if (!pos) return;
            if (!pencilIcon) {
                pencilIcon = document.createElement('div');
                pencilIcon.innerHTML = pencilSVG;
                pencilIcon.style.position = 'absolute';
                pencilIcon.style.width = '28px';
                pencilIcon.style.height = '28px';
                pencilIcon.style.display = 'flex';
                pencilIcon.style.alignItems = 'center';
                pencilIcon.style.justifyContent = 'center';
                pencilIcon.style.background = 'rgba(30,41,59,0.95)';
                pencilIcon.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
                pencilIcon.style.borderRadius = '4px';
                pencilIcon.style.cursor = 'pointer';
                pencilIcon.style.opacity = '0.9';
                pencilIcon.style.transition = 'opacity 0.2s';
                pencilIcon.onmouseenter = () => {
                    isPencilHovered = true;
                    if (hideTimeout) clearTimeout(hideTimeout);
                    pencilIcon!.style.opacity = '1';
                };
                pencilIcon.onmouseleave = () => {
                    isPencilHovered = false;
                    pencilIcon!.style.opacity = '0.9';
                    hideTimeout = setTimeout(() => {
                        if (!isPencilHovered) hidePencilIcon();
                    }, 150);
                };
                pencilIcon.onclick = () => {
                    setSelectedLine(lineNumber);
                    setIsCommentDialogOpen(true);
                };
                editor.getContainerDomNode().appendChild(pencilIcon);
            }
            const containerRect = editor.getContainerDomNode().getBoundingClientRect();
            const editorRect = editor.getDomNode().getBoundingClientRect();
            pencilIcon.style.left = `${pos.left + editorRect.left - containerRect.left}px`;
            pencilIcon.style.top = `${pos.top + editorRect.top - containerRect.top - 4}px`;
            pencilIcon.style.right = '';
            pencilIcon.style.zIndex = '2000';
        }

        function hidePencilIcon() {
            if (pencilIcon) {
                pencilIcon.remove();
                pencilIcon = null;
            }
        }

        const mouseMoveDisposable = editor.onMouseMove((e: any) => {
            if (
                e.target.position &&
                e.target.type === monaco.editor.MouseTargetType.CONTENT_TEXT
            ) {
                const lineNumber = e.target.position.lineNumber;
                const column = e.target.position.column;
                const model = editor.getModel();
                const lineContent = model.getLineContent(lineNumber);
                const leadingWhitespace = lineContent.match(/^\s*/)?.[0].length || 0;
                // Show icon if hovering over any non-whitespace part of the line
                if (column > leadingWhitespace && lineContent.trim() !== '') {
                    showPencilIconAtLineEnd(lineNumber);
                    currentLine = lineNumber;
                    if (hideTimeout) clearTimeout(hideTimeout);
                } else {
                    hidePencilIcon();
                    currentLine = null;
                }
            } else {
                hideTimeout = setTimeout(() => {
                    if (!isPencilHovered) hidePencilIcon();
                }, 150);
                currentLine = null;
            }
        });

        const mouseLeaveDisposable = editor.onMouseLeave(() => {
            hideTimeout = setTimeout(() => {
                if (!isPencilHovered) hidePencilIcon();
            }, 150);
            currentLine = null;
        });

        // Cleanup on unmount
        editor.onDidDispose(() => {
            mouseMoveDisposable.dispose();
            mouseLeaveDisposable.dispose();
            hidePencilIcon();
        });
    }

    return (
        <div className="flex flex-col lg:flex-row flex-auto gap-12">
            <div className="flex-1">
                <Card className="mt-6">
                    <div style={{ borderRadius: 10, overflow: 'hidden', background: '#e5e7eb' }}>
                        <MacWindowHeader />
                        <div className="h-[400px] border border-gray-200 dark:border-gray-700 relative" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, background: '#e5e7eb' }}>
                            <MonacoEditor
                                height="100%"
                                defaultLanguage="json"
                                defaultValue={JSON.stringify({ client, schedule }, null, 2)}
                                onChange={handleEditorChange}
                                onMount={handleEditorDidMount}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    wordWrap: 'on',
                                    lineNumbers: 'on',
                                    folding: true,
                                    formatOnPaste: true,
                                    formatOnType: true,
                                    quickSuggestions: true,
                                    suggestOnTriggerCharacters: true,
                                    acceptSuggestionOnEnter: 'on',
                                    tabCompletion: 'on',
                                    wordBasedSuggestions: 'allDocuments',
                                    parameterHints: {
                                        enabled: true
                                    },
                                    glyphMargin: true
                                }}
                                theme="vs-dark"
                            />
                        </div>
                    </div>
                </Card>
            </div>
            <div className="lg:min-w-[320px] lg:w-[350px]">
                <Card
                    bordered={false}
                    className="bg-gray-100 dark:bg-gray-800 shadow-none"
                >
                    <h5>Client information</h5>
                    <div className="flex flex-col gap-5 mt-6">
                        <div>
                            <span className="font-semibold heading-text">
                                Client:
                            </span>
                            <span className="font-semibold">
                                {' '}
                                {client.clientName}
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="font-semibold heading-text">
                                Skate holder:
                            </div>
                            <div className="flex items-center gap-2">
                                <Avatar
                                    size={25}
                                    src={client.skateHolder?.img}
                                    alt=""
                                />
                                <span className="font-semibold">
                                    {client.skateHolder?.name}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="font-semibold heading-text">
                                Project manager:
                            </div>
                            <div className="flex items-center gap-2">
                                <Avatar
                                    size={25}
                                    src={client.projectManager?.img}
                                    alt=""
                                />
                                <span className="font-semibold">
                                    {client.projectManager?.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card
                    bordered={false}
                    className="bg-gray-100 dark:bg-gray-800 shadow-none mt-6"
                >
                    <h5>Schedule</h5>
                    <div className="flex flex-col gap-5 mt-6">
                        <div>
                            <span className="font-semibold heading-text">
                                Start date:
                            </span>
                            <span className="font-semibold">
                                {' '}
                                {dayjs
                                    .unix(schedule.startDate as number)
                                    .format('ddd, DD MMM YYYY')}
                            </span>
                        </div>
                        <div>
                            <span className="font-semibold heading-text">
                                Due date:
                            </span>
                            <span className="font-semibold">
                                {' '}
                                {dayjs
                                    .unix(schedule.dueDate as number)
                                    .format('ddd, DD MMM YYYY')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold heading-text">
                                Status:
                            </span>
                            <Tag className="border-2 bg-transparent text-green-600 border-green-600 dark:bg-transparent dark:text-green-600 dark:border-green-600 rounded-full">
                                {schedule.status}
                            </Tag>
                        </div>

                        <div className="flex flex-col gap-3">
                            <span className="font-semibold heading-text">
                                Completion:
                            </span>
                            <Progress
                                percent={schedule.completion}
                                trailClass="bg-gray-200 dark:bg-gray-600"
                                size="sm"
                            />
                        </div>
                    </div>
                </Card>
            </div>

            <Dialog
                isOpen={isCommentDialogOpen}
                onClose={() => {
                    setIsCommentDialogOpen(false)
                    reset()
                }}
                width={500}
                className="rounded-2xl shadow-xl"
            >
                <div className="p-8 flex flex-col items-center">
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-center mb-2 w-full">Would you like to add a comment to this line?</h2>
                    {/* Subtitle */}
                    <p className="text-gray-500 text-center mb-8 w-full">Your comments help make the JSON data easier to read and understand.</p>
                    {/* Comment textarea */}
                    <Form onSubmit={handleSubmit(onSubmitComment)} className="w-full">
                        <FormItem>
                            <Controller
                                name="comment"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        size="lg"
                                        rows={5}
                                        placeholder="Add a Comment..."
                                        className="w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <div className="flex justify-center mt-8">
                            <Button
                                variant="solid"
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md hover:from-green-500 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Saving...' : 'Submit Now'}
                            </Button>
                        </div>
                    </Form>
                </div>
            </Dialog>

            <Dialog
                isOpen={isSuccessDialogOpen}
                onClose={() => setIsSuccessDialogOpen(false)}
                width={420}
                className="rounded-2xl shadow-xl"
            >
                <div className="p-8 flex flex-col items-center">
                    <div className="bg-blue-100 rounded-full p-4 mb-4 flex items-center justify-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" fill="#2563eb" opacity="0.1" />
                            <polyline points="9 12 12 15 17 10" stroke="#2563eb" strokeWidth="2.5" fill="none" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-2 w-full">Yorumunuz kaydedildi</h2>
                    <p className="text-gray-500 text-center mb-8 w-full">Yorumunuz başarıyla kaydedildi. Detayları e-posta ile de alacaksınız.</p>
                    <div className="flex gap-4 w-full">
                        <Button
                            variant="default"
                            className="w-1/2 border-blue-600 text-blue-600"
                            onClick={() => setIsSuccessDialogOpen(false)}
                        >
                            Yorumu Görüntüle
                        </Button>
                        <Button
                            variant="solid"
                            className="w-1/2 bg-blue-600 text-white"
                            onClick={() => setIsSuccessDialogOpen(false)}
                        >
                            Kapat
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default ProjectDetailsOverview
