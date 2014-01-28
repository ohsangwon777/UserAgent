#UserAgent.js


>For cross browsing, client enviroments controll.

## Cross browse css controll

```
.some-element {
  /* basic style */
}

.ie8 .some-element {
  /* some style */
}

.chrome .some-element {
  /* some style */
}

.iphone .some-element {
  /* some style */
}
```

##Javascript browser detection

```
 UserAgent = {
                os: {
                        name: '',
                        platform: '' //TODO
                },

                //renderer
                renderer: {
                        name: '',
                        version: '',
                        isGecko: false,
                        isIe: false,
                        isOpera: false,
                        isWebkit: false
                },

                //browser
                product: {
                        name: '', //browser name
                        version: '', //browser version
                },

                version: undefined,

                isAndroid : false,
                isCamino : false,
                isChrome : false,
                isFirefox : false,
                isIe : false,
                isIpad : false,
                isIphone : false,
                isOpera : false,
                isSafari : false,
                isMobile: false,

                isLinux: false,
                isWindows: false,
                isMac: false,
                isX11: false,

                documnetMode: undefined //IE
        }

```
