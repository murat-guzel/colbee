import { NextResponse, NextRequest } from 'next/server'

const API_BASE_URL = 'http://localhost:3001'

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const projectId = (await params).id

    try {
        const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/comments`)
        
        if (!response.ok) {
            throw new Error('Failed to fetch comments')
        }

        const comments = await response.json()
        return NextResponse.json(comments)
    } catch (error) {
        console.error('Error fetching comments:', error)
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const projectId = (await params).id

    try {
        const body = await request.json()
        
        console.log('Creating comment with data:', {
            projectId,
            content: body.content,
            lineNumber: body.lineNumber,
            author: body.author,
            projectName: body.projectName
        })
        
        const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: body.content,
                lineNumber: body.lineNumber,
                author: body.author || 'Anonymous',
                projectName: body.projectName,
                projectId: body.projectId
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Backend error response:', errorText)
            throw new Error(`Failed to create comment: ${response.status} ${errorText}`)
        }

        const comment = await response.json()
        console.log('Comment created successfully:', comment)
        return NextResponse.json(comment, { status: 201 })
    } catch (error) {
        console.error('Error creating comment:', error)
        return NextResponse.json({ 
            error: 'Failed to create comment',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
} 