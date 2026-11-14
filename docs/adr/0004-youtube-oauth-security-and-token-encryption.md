# 0004. YouTube OAuth 2.0 Security, Token Encryption at Rest, and CSRF Protection

## Context

Integrating the YouTube Data API v3 requires offline authorization to upload video assets and manipulate course playlists without recurring user intervention. Storing raw tokens in the database or utilizing static OAuth parameters exposes the platform to Cross-Site Request Forgery (CSRF), token leakage, and unauthorized perpetual channel access if database backups or logs are compromised.

## Decision

We enforce strict defense-in-depth security guidelines for Google OAuth 2.0 and YouTube Data API v3:

1. **Cryptographic CSRF Defense via Dynamic State Parameter**:
   - Every authorization URL generation creates a high-entropy, session-bound `state` token (`yt_` prefix + 32-character random hex).
   - Stored in a secure cache with a 15-minute TTL mapped to the requesting administrator.
   - Strictly validated upon callback arrival in constant time and immediately purged (`Cache::forget`) to prevent replay attacks.
2. **Authenticated Encryption at Rest**:
   - OAuth Refresh Tokens are encrypted before storage in `platform_settings` using authenticated AES-256-GCM via Laravel's `Crypt::encryptString()`.
   - Raw database queries, SQL dumps, or replica leaks expose only encrypted ciphertext.
   - Transparent in-memory decryption occurs only within `YouTubeService::getAuthenticatedClient()`, with automatic migration of legacy plaintext tokens.
3. **Upstream Token Revocation on Disconnection**:
   - Disconnecting a channel does not merely delete local database rows.
   - It performs an explicit upstream HTTP revocation call (`$client->revokeToken($refreshToken)`) against Google's authorization servers (`https://oauth2.googleapis.com/revoke`), ensuring revoked tokens cannot be abused externally.
4. **Least-Privilege Scoping & Quota Resilience**:
   - Requests granular scopes (`youtube.upload`, `youtube`) matching operational necessities.
   - Media streaming is chunked in exact multiples of 256 KB (2 MB segments via `MediaFileUpload`) compliant with Google's Resumable Upload protocol.
