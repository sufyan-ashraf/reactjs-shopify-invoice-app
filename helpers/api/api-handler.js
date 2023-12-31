import { errorHandler, jwtMiddleware } from './index';

function apiHandler(handler) {
    return async (req, res) => {
        try {
            // global middleware
            await jwtMiddleware(req, res);

            // route handler
            await handler(req, res);
        } catch (err) {
            // global error handler
            errorHandler(err, res);
        }
    }
}

export { apiHandler };