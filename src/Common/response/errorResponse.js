export function notFoundException(message){
    throw new Error (message,{cause:{statusCode:404}})
}

export function conflictException(message){
    throw new Error (message,{cause:{statusCode:409}})
}

export function errorHandling(error, req, res, next) {
    const status = error.cause?.status || 500

    return res.status(status).json({
        success: false,
        message:
            status === 500 && process.env.NODE_ENV === "production"
                ? "Something went wrong"
                : error.message || "Something went wrong",
        stack:
            process.env.NODE_ENV === "development"
                ? error.stack
                : undefined
    })
}
export function unAuthorizedException(message){
    throw new Error (message,{cause:{statusCode:401}})
}

export function forbiddenException(message){
    throw new Error (message,{cause:{statusCode:403}})
}

export function badRequestException(message){
    throw new Error (message,{cause:{statusCode:400}})
}