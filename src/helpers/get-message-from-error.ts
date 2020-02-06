import { httpStatusList } from './http-status-list';

export const getMessageFromError = (error): string => {
    if (typeof error === 'string') {
        return error;
    }
    let message = 'An unexpected error has occurred';
    const e = error.error || error;
    if (e) {
        if (e.message) {
            message = e.message;
        } else {
            const code = Number(e.code || e);
            if (httpStatusList.hasOwnProperty(code)) {
                message = httpStatusList[code];
            }
        }
    }
    return message;
};
