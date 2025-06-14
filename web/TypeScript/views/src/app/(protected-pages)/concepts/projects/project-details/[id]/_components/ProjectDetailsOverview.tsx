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
    const { content = '', client = {}, schedule = {} } = props
    const editorRef = useRef<any>(null)
    const monacoRef = useRef<any>(null)
    const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
    const [selectedLine, setSelectedLine] = useState<number | null>(null)
    const [isEditorMounted, setIsEditorMounted] = useState(false)

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

    const onSubmitComment = (data: CommentFormData) => {
        if (selectedLine && editorRef.current) {
            const model = editorRef.current.getModel()
            const lineContent = model.getLineContent(selectedLine)
            const indent = lineContent.match(/^\s*/)?.[0] || ''
            model.pushEditOperations(
                [],
                [{
                    range: new (window as any).monaco.Range(selectedLine, 1, selectedLine, 1),
                    text: `${indent}// ${data.comment}\n`
                }],
                () => null
            )
        }
        setIsCommentDialogOpen(false)
        reset()
    }

    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor
        monacoRef.current = monaco

        let currentLine: number | null = null;
        let pencilIcon: HTMLDivElement | null = null;
        let isPencilHovered = false;
        let hideTimeout: NodeJS.Timeout | null = null;

        // SVG for pencil icon
        const pencilSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 2 21l1.5-5L16.5 3.5z"/></svg>`;

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
                pencilIcon.style.border = '2px solid #38bdf8';
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
            pencilIcon.style.left = `${pos.left + editorRect.left - containerRect.left + pos.width + 8}px`;
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
                {!props.isContentEdit && (
                    <div className="prose max-w-full mb-6">{ReactHtmlParser(content)}</div>
                )}
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
                width={600}
            >
                <div className="pt-6">
                    <Form onSubmit={handleSubmit(onSubmitComment)}>
                        <FormItem>
                            <Controller
                                name="comment"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        size="lg"
                                        rows={8}
                                        placeholder="Enter your comment"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                variant="plain"
                                onClick={() => {
                                    setIsCommentDialogOpen(false)
                                    reset()
                                }}
                            >
                                Cancel
                            </Button>
                            <Button variant="solid" type="submit">
                                Add Comment
                            </Button>
                        </div>
                    </Form>
                </div>
            </Dialog>
        </div>
    )
}

export default ProjectDetailsOverview
