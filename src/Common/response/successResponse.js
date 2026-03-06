export function successResponse(res, statusCode=200,data){
    res.status(statusCode).json({message:"Operation completed successfully", data})
}