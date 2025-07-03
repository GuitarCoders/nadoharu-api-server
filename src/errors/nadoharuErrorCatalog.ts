export const NadoharuErrorCatalog = {
    UNAUTHORIZED: {
        code: 'UNAUTHORIZED',
        defaultMessage: '로그인이 필요한 서비스입니다.'
    },
    FRIEND_REQUEST_DUPLICATED: {
        code: 'FRIEND_REQUEST_DUPLICATED',
        defaultMessage: '이미 친구신청을 요청한 대상입니다.'
    },
    FRIEND_REQUEST_TO_ME: {
        code: 'FRIEND_REQUEST_TO_ME',
        defaultMessage: '자기 자신에게 친구신청을 할 수 없습니다.'
    },
    FRIEND_REQUEST_NOT_OWNED: {
        code: 'FRIEND_REQUEST_NOT_OWNED',
        defaultMessage: '해당 친구신청에 접근할 권한이 없습니다.'
    },
    FRIEND_REQUEST_NOT_EXIST: {
        code: 'FRIEND_REQUEST_NOT_EXIST',
        defaultMessage: '해당 친구신청이 존재하지 않습니다.'
    },
    FRIEND_REQUEST_NOT_RECEIVED: {
        code: 'FRIEND_REQUEST_NOT_RECEIVED',
        defaultMessage: '받지 않은 친구신청을 승낙할 수 없습니다.'
    },
    INVALID_USER_CREDENTIALS: {
        code: 'INVALID_LOGIN_CREDENTIALS',
        defaultMessage: '사용자 인증 정보가 일치하지 않습니다.'
    },
    ALREADY_NADOED_POST: {
        code: 'ALREADY_NADOED_POST',
        defaultMessage: '이미 nado를 누른 글입니다.'
    },
    
} as const;

export type NadoharuErrorType = keyof typeof NadoharuErrorCatalog;