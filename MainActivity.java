package com.fazil.ggvl;
import android.Manifest; import android.app.Activity; import android.os.Bundle;
import android.webkit.*; import java.io.InputStream; import java.util.Scanner;
/** GG GOD VAULT LOUDER - made by fazil. Discord web + audio engine (assets/gv.js). */
public class MainActivity extends Activity {
  WebView w; String js;
  @Override protected void onCreate(Bundle b) {
    super.onCreate(b);
    requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, 1);
    try (InputStream in = getAssets().open("gv.js"); Scanner s = new Scanner(in, "UTF-8").useDelimiter("\\A")) { js = s.next(); } catch (Exception e) { js = ""; }
    w = new WebView(this); setContentView(w);
    WebSettings s = w.getSettings();
    s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setMediaPlaybackRequiresUserGesture(false);
    s.setUserAgentString("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36");
    w.setWebChromeClient(new WebChromeClient() {
      @Override public void onPermissionRequest(final PermissionRequest r) { runOnUiThread(() -> r.grant(r.getResources())); }
    });
    w.setWebViewClient(new WebViewClient() {
      @Override public void onPageStarted(WebView v, String u, android.graphics.Bitmap f) { v.evaluateJavascript(js, null); }
      @Override public void onPageFinished(WebView v, String u) { v.evaluateJavascript(js, null); }
    });
    w.loadUrl("https://discord.com/app");
  }
  @Override public void onBackPressed() { if (w.canGoBack()) w.goBack(); else super.onBackPressed(); }
}
