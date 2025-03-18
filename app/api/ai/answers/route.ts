import {openai} from "@ai-sdk/openai";
import {generateText} from "ai";
import {NextResponse} from "next/server";

import handleError from "@/lib/handlers/error";
import {ValidationError} from "@/lib/http-errors";
import {AIAnswersSchema} from "@/lib/validation";
import {APIErrorResponse} from "@/types/global";


export async function POST(request: Request) {
    const body = await request.json()

    try {

        const validatedData = AIAnswersSchema.safeParse(body)

        if (!validatedData.success) {
            throw new ValidationError(validatedData.error.flatten().fieldErrors) // Validation Error
        }

        const {question, content} = validatedData.data

        const { text } = await generateText({
            model: openai("gpt-4-turbo"),
            prompt: `Generate a markdown-formatted response to the following question: ${question}. Base it on the provided content: ${content}`,
            system: 'You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., \'js\' for JavaScript, \'py\' for Python, \'ts\' for TypeScript, \'html\' for HTML, \'css\' for CSS, etc.).'
        })

        return NextResponse.json({success: true, data: text}, {status: 200})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }

}