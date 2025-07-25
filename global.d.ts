declare const __COMFYUI_FRONTEND_VERSION__: string
declare const __ALGOLIA_APP_ID__: string
declare const __ALGOLIA_API_KEY__: string
declare const __USE_PROD_CONFIG__: boolean

interface Navigator {
  /**
   * Used by the electron API.  This is a WICG non-standard API, but is guaranteed to exist in Electron.
   * It is `undefined` in Firefox and older browsers.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/windowControlsOverlay
   */
  windowControlsOverlay?: {
    /** When `true`, the window is using custom window style. */
    visible: boolean
  }
}
