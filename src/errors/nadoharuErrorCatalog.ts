export const NadoharuErrorCatalog = {
    UNAUTHORIZED: {
        code: 'UNAUTHORIZED',
        defaultMessage: '로그인이 필요한 서비스입니다.'
    },
    DUPLICATED_FRIEND_REQUEST: {
        code: 'DUPLICATED_FRIEND_REQUEST',
        defaultMessage: '이미 친구신청을 요청한 대상입니다.'
    },
    FRIEND_REQUEST_TO_ME: {
        code: 'FRIEND_REQUEST_TO_ME',
        defaultMessage: '자기 자신에게 친구신청을 할 수 없습니다.'
    }
} as const;

export type NadoharuErrorType = keyof typeof NadoharuErrorCatalog;