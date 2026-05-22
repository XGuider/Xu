/**
 * App Router 将 API 放在 `app/[locale]/api/...` 下时，浏览器请求需带上 locale 段。
 * 与站内 `fetch('/api/tools')` 并存：若未来统一改写路由，可只改此工具。
 */
export function intlApiPath(locale: string, apiPath: string): string {
  const path = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;
  return `/${locale}${path}`;
}
