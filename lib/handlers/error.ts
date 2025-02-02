import {NextResponse} from "next/server";
import {err} from "pino-std-serializers";
import {ZodError} from "zod";

import logger from "@/lib/handlers/logger";
import {RequestError, ValidationError} from "@/lib/http-errors";

export type Responsetype = 'api' | 'server'

const formatResponse = (
    responseType: Responsetype,
    status: number,
    message: string,
    errors?: Record<string, string[]>
) => {
    const responseContent = {
        success: false,
        error: {
            message,
            details: errors
        }
    }

    return responseType === 'api'
        ? NextResponse.json(responseContent, {status})
        : {status, ...responseContent}
}

const handleError = (
    error: unknown,
    responseType: Responsetype = 'server'
) => {
    if (error instanceof RequestError) {
        logger.error({err: error}, `${responseType.toUpperCase()} Error ${error.message}`)
        return formatResponse(
            responseType,
            error.statusCode,
            error.message,
            error.errors,
        )
    }

    if (error instanceof ZodError) {
        const validationError = new ValidationError(error.flatten().fieldErrors as Record<string, string[]>)
        logger.error({err: error}, `Validation error: ${validationError.message}`)
        return formatResponse(
            responseType,
            validationError.statusCode,
            validationError.message,
            validationError.errors
        )
    }

    if (error instanceof Error) {
        logger.error(error.message)
        return formatResponse(responseType, 500, error.message)
    }
    logger.error({err: error}, 'An unexpected error occurred')
    return formatResponse(responseType, 500, 'An unexpected error occurred')
}