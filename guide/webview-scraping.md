# Headless Scraping & JS Injection

AnimeTV gathers anime details and stream links via runtime scraping using a headless WebView.

## Architecture Flow

Unlike standard REST APIs, the third-party providers do not offer public endpoints. Data fetching follows this pattern:

```
Android Client (Cronet) ──> Loads Page ──> Injects JS ──> Intercepts Requests/JSON ──> Maps to Clean Domain Entities
```

## WebView Script Injection

When a page finishes loading inside the headless WebView, the Android app injects custom scraping scripts via the interface namespace `Android`:

```typescript
// Sample target scraper script injected into WebView context
(function() {
  const titles = Array.from(document.querySelectorAll('.anime-card .title')).map(el => el.textContent.trim());
  const links = Array.from(document.querySelectorAll('.anime-card a')).map(el => el.href);
  
  const payload = JSON.stringify({ titles, links });
  
  // Send data back to native Android container
  if (window.Android && window.Android.onDataScraped) {
    window.Android.onDataScraped(payload);
  }
})();
```

On the Android client side, this namespace is exposed as an interface:

```java
public class WebAppInterface {
    @JavascriptInterface
    public void onDataScraped(String jsonPayload) {
        // Parse payload and update application state
    }
}
```

## Network Interception and QUIC

Many streaming backends throttle connections or enforce HTTP/3 (QUIC) requirements.

### Cronet Engine Implementation
AnimeTV includes Google's **Cronet Engine** wrapper instead of native Android `HttpURLConnection` to improve HTTP/3 support and connection pooling:

```java
CronetEngine.Builder builder = new CronetEngine.Builder(context);
builder.enableHttp2(true)
       .enableQuic(true)
       .setStoragePath(context.getCacheDir().getAbsolutePath())
       .enableHttpCache(CronetEngine.Builder.HTTP_CACHE_DISK, 10 * 1024 * 1024);
CronetEngine cronetEngine = builder.build();
```

### Request Headers Bypasses
CDNs protect stream video links using security headers. Request interceptors must append mandatory headers:
- `Referer`: Set matching the exact parent page.
- `User-Agent`: Mimic standard Android browser or Windows Electron user agents.
- `Origin`: Set matching the stream source provider's host.