## Middleware

### helmet

Helmet은 웹 애플리케이션의 보안을 강화하는 HTTP 헤더 설정 미들웨어. @fastify/helmet 플러그인 사용.

### 보안 헤더 설정

#### Clickjacking 방지 (X-Frame-Options)

| 기능                                | 설명                               |
| ----------------------------------- | ---------------------------------- |
| `X-Frame-Options: DENY`             | 모든 iframe 내 포함을 차단.        |
| `X-Frame-Options: SAMEORIGIN`       | 동일 출처(same-origin)에서만 허용. |
| `X-Frame-Options: ALLOW-FROM <URL>` | 특정 URL에서만 iframe 포함을 허용. |

#### MIME 스니핑 방지 (X-Content-Type-Options)

브라우저가 응답의 Content-Type을 무시하고 자동으로 MIME 타입을 추론하는 것을 방지.
| 기능 | 설명 |
| ----------------------------------- | ---------------------------------------- |
| `X-Content-Type-Options: nosniff` | 선언된 MIME 타입만 신뢰하도록 강제. |

#### MIME 스니핑 방지 (X-Content-Type-Options)

HTTPS를 강제하여 중간자 공격(MITM) 위험을 줄이고 보안을 강화합니다.

| 기능                                                             | 설명                                                                                                                      |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `Strict-Transport-Security: max-age=31536000; includeSubDomains` | 브라우저가 해당 도메인을 1년(31,536,000초) 동안 HTTPS만 강제. includeSubDomains 옵션을 추가하면 모든 서브도메인에도 적용. |
