/* Widgetify Universal Embed v1.0
 * Usage: <script async src="https://widgetify.lovable.app/embed.js" data-id="WIDGET_ID"></script>
 * Optionally: data-base="https://your-base" to override API base.
 * Multiple instances on the same page are supported.
 */
(function () {
  "use strict";
  if (window.__WIDGETIFY_LOADER__) {
    window.__WIDGETIFY_LOADER__.scan();
    return;
  }

  // ---- Configuration ----
  var DEFAULT_BASE = "https://pibinmzsiwzatfljqkiu.supabase.co/functions/v1";
  var APP_ORIGIN = "https://widgetify.lovable.app";

  // ---- Utilities ----
  function uid() {
    return "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  function getSessionId() {
    try {
      var k = "widgetify_sid";
      var v = localStorage.getItem(k);
      if (!v) { v = uid(); localStorage.setItem(k, v); }
      return v;
    } catch (e) { return uid(); }
  }
  function safeFetch(url, opts, retries) {
    retries = retries == null ? 1 : retries;
    return fetch(url, opts).then(function (r) {
      if (!r.ok && retries > 0 && r.status >= 500) {
        return new Promise(function (res) { setTimeout(res, 400); })
          .then(function () { return safeFetch(url, opts, retries - 1); });
      }
      return r;
    }).catch(function (err) {
      if (retries > 0) {
        return new Promise(function (res) { setTimeout(res, 400); })
          .then(function () { return safeFetch(url, opts, retries - 1); });
      }
      throw err;
    });
  }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "style" && typeof attrs[k] === "object") {
        for (var s in attrs[k]) n.style[s] = attrs[k][s];
      } else if (k.indexOf("on") === 0 && typeof attrs[k] === "function") {
        n.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      } else if (k === "html") {
        n.innerHTML = attrs[k];
      } else {
        n.setAttribute(k, attrs[k]);
      }
    }
    if (children) for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (c == null) continue;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return n;
  }
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // ---- Global event bus ----
  var Bus = {
    listeners: {},
    on: function (e, fn) { (this.listeners[e] = this.listeners[e] || []).push(fn); },
    emit: function (e, payload) {
      (this.listeners[e] || []).forEach(function (fn) { try { fn(payload); } catch (_) {} });
      try { window.dispatchEvent(new CustomEvent("widgetify:" + e, { detail: payload })); } catch (_) {}
    }
  };

  // ---- Tracking ----
  function track(widgetId, eventType, eventData, base) {
    try {
      Bus.emit(eventType, { widgetId: widgetId, data: eventData });
      var payload = JSON.stringify({
        widget_id: widgetId,
        event_type: eventType,
        event_data: eventData || {},
        session_id: getSessionId(),
        referrer: location.href.slice(0, 500),
      });
      var url = base + "/widget-interactions";
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
      } else {
        safeFetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }, 0)
          .catch(function () {});
      }
    } catch (_) {}
  }

  // ---- Shadow root host ----
  function makeHost(widgetId, mode, target) {
    var host = document.createElement("div");
    host.setAttribute("data-widgetify-id", widgetId);
    host.style.all = "initial";
    if (mode === "inline" && target) {
      host.style.position = "relative";
      host.style.display = "block";
      target.appendChild(host);
    } else {
      host.style.position = "fixed";
      host.style.zIndex = "2147483600";
      document.body.appendChild(host);
    }
    var shadow = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
    return { host: host, shadow: shadow };
  }
  function injectStyles(shadow, extra) {
    var style = document.createElement("style");
    style.textContent = [
      "*,*::before,*::after{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}",
      ".wf-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;animation:wf-fade .25s ease}",
      ".wf-card{background:#fff;color:#111827;border-radius:16px;padding:24px;max-width:420px;width:calc(100% - 32px);box-shadow:0 24px 60px rgba(0,0,0,.25);animation:wf-pop .3s cubic-bezier(.2,.8,.3,1.2);position:relative}",
      ".wf-close{position:absolute;top:10px;right:10px;border:0;background:transparent;font-size:22px;cursor:pointer;color:#6b7280;line-height:1;padding:6px}",
      ".wf-close:hover{color:#111}",
      ".wf-h{font-size:20px;font-weight:700;margin:0 0 8px}",
      ".wf-p{font-size:14px;line-height:1.5;color:#4b5563;margin:0 0 16px}",
      ".wf-btn{display:inline-block;background:#e79ca9;color:#fff;border:0;border-radius:10px;padding:10px 18px;font-weight:600;cursor:pointer;font-size:14px;text-decoration:none}",
      ".wf-btn:hover{filter:brightness(.95)}",
      ".wf-input{width:100%;padding:10px 12px;border:1px solid #e5e7eb;border-radius:10px;font-size:14px;margin-bottom:10px;outline:none}",
      ".wf-input:focus{border-color:#e79ca9;box-shadow:0 0 0 3px rgba(231,156,169,.2)}",
      ".wf-success{padding:14px;border-radius:10px;background:#ecfdf5;color:#065f46;font-size:14px;text-align:center}",
      ".wf-fab{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;background:#e79ca9;border:0;color:#fff;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.18);font-size:26px;display:flex;align-items:center;justify-content:center;transition:transform .2s}",
      ".wf-fab:hover{transform:scale(1.06)}",
      ".wf-chat{position:fixed;bottom:90px;right:20px;width:340px;max-width:calc(100% - 40px);height:480px;max-height:70vh;background:#fff;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,.22);display:flex;flex-direction:column;overflow:hidden;animation:wf-pop .25s ease}",
      ".wf-inline{position:relative !important;width:100%;max-width:100%;height:520px;bottom:auto;right:auto;border-radius:16px;box-shadow:0 4px 16px rgba(0,0,0,.08)}",
      ".wf-inline-card{position:relative;width:100%;max-width:100%;margin:0;animation:none}",
      ".wf-chat-h{padding:14px 16px;background:#e79ca9;color:#fff;font-weight:600;display:flex;justify-content:space-between;align-items:center}",
      ".wf-chat-body{flex:1;overflow-y:auto;padding:14px;background:#f9fafb;display:flex;flex-direction:column;gap:8px}",
      ".wf-msg{max-width:80%;padding:8px 12px;border-radius:12px;font-size:14px;line-height:1.4;word-wrap:break-word}",
      ".wf-msg.user{align-self:flex-end;background:#e79ca9;color:#fff;border-bottom-right-radius:4px}",
      ".wf-msg.bot{align-self:flex-start;background:#fff;color:#111;border:1px solid #e5e7eb;border-bottom-left-radius:4px}",
      ".wf-chat-form{display:flex;border-top:1px solid #e5e7eb;background:#fff}",
      ".wf-chat-form input{flex:1;border:0;padding:12px;font-size:14px;outline:none}",
      ".wf-chat-form button{border:0;background:#e79ca9;color:#fff;padding:0 16px;cursor:pointer;font-weight:600}",
      ".wf-typing{font-size:12px;color:#6b7280;padding:0 4px}",
      "@keyframes wf-fade{from{opacity:0}to{opacity:1}}",
      "@keyframes wf-pop{from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}",
      "@media (max-width:480px){.wf-chat:not(.wf-inline){right:10px;bottom:80px;width:calc(100% - 20px)}.wf-fab{bottom:14px;right:14px}}"
    ].join("");
    shadow.appendChild(style);
    if (extra) {
      var s2 = document.createElement("style");
      s2.textContent = extra;
      shadow.appendChild(s2);
    }
  }

  // Find inline mount target on host page
  function findInlineTarget(widgetId) {
    return document.querySelector('[data-widgetify-mount="' + widgetId + '"]')
      || document.querySelector('[data-widgetify-mount=""]')
      || document.querySelector('[data-widgetify-mount]');
  }

  // ---- Renderers ----
  var Renderers = {
    popup: function (widget, ctx) {
      var cfg = widget.config || {};
      var key = "wf_popup_seen_" + widget.id;
      var cooldownMin = Number(cfg.cooldownMinutes || 1440); // 24h default
      function cooled() {
        try {
          var t = Number(localStorage.getItem(key) || 0);
          return Date.now() - t > cooldownMin * 60 * 1000;
        } catch (_) { return true; }
      }
      function markSeen() { try { localStorage.setItem(key, String(Date.now())); } catch (_) {} }

      var shown = false;
      function show(triggerName) {
        if (shown || !cooled()) return;
        shown = true;
        markSeen();
        track(widget.id, "trigger_fired", { trigger: triggerName }, ctx.base);
        var inlineTarget = (cfg.display === "inline") ? findInlineTarget(widget.id) : null;
        var rendered = makeHost(widget.id, inlineTarget ? "inline" : "floating", inlineTarget);
        injectStyles(rendered.shadow, cfg.customCss);
        var overlay = el("div", { class: "wf-overlay" });
        var card = el("div", { class: "wf-card" });
        var close = el("button", { class: "wf-close", "aria-label": "Close", onClick: function () {
          rendered.host.remove();
          track(widget.id, "close", { trigger: triggerName }, ctx.base);
        } }, ["×"]);
        card.appendChild(close);
        card.appendChild(el("h3", { class: "wf-h" }, [String(cfg.title || "Hello!")]));
        if (cfg.description) card.appendChild(el("p", { class: "wf-p" }, [String(cfg.description)]));
        if (cfg.imageUrl) card.appendChild(el("img", { src: String(cfg.imageUrl), style: { maxWidth: "100%", borderRadius: "10px", marginBottom: "12px" } }));
        if (cfg.ctaText && cfg.ctaUrl) {
          var btn = el("a", { class: "wf-btn", href: String(cfg.ctaUrl), target: "_blank", rel: "noopener", onClick: function () {
            track(widget.id, "click", { cta: cfg.ctaText }, ctx.base);
          } }, [String(cfg.ctaText)]);
          card.appendChild(btn);
        }
        overlay.appendChild(card);
        overlay.addEventListener("click", function (e) { if (e.target === overlay) close.click(); });
        rendered.shadow.appendChild(overlay);
        track(widget.id, "view", { trigger: triggerName }, ctx.base);
      }

      var triggers = cfg.triggers || { timeDelay: 5 };
      // autoOpen forces immediate display, bypassing cooldown if set
      if (cfg.autoOpen) { setTimeout(function () { show("auto"); }, 50); return; }
      // time delay
      if (triggers.timeDelay) setTimeout(function () { show("time"); }, Number(triggers.timeDelay) * 1000);
      // exit intent (desktop)
      if (triggers.exitIntent) {
        var onLeave = function (e) {
          if (e.clientY <= 0) { show("exit"); document.removeEventListener("mouseout", onLeave); }
        };
        document.addEventListener("mouseout", onLeave);
      }
      // scroll percentage
      if (triggers.scrollPercent) {
        var pct = Number(triggers.scrollPercent);
        var onScroll = function () {
          var doc = document.documentElement;
          var scrolled = (window.scrollY + window.innerHeight) / doc.scrollHeight * 100;
          if (scrolled >= pct) { show("scroll"); window.removeEventListener("scroll", onScroll); }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
      }
    },

    "lead-form": function (widget, ctx) {
      var cfg = widget.config || {};
      var display = cfg.display || "floating";
      var inlineTarget = display === "inline" ? findInlineTarget(widget.id) : null;
      var rendered = makeHost(widget.id, inlineTarget ? "inline" : "floating", inlineTarget);
      injectStyles(rendered.shadow, cfg.customCss);

      function buildForm(container, isInline) {
        var card = el("div", { class: "wf-card" + (isInline ? " wf-inline-card" : "") });
        if (!isInline) card.appendChild(el("button", { class: "wf-close", onClick: function () { container.remove(); } }, ["×"]));
        card.appendChild(el("h3", { class: "wf-h" }, [String(cfg.title || "Get in touch")]));
        if (cfg.description) card.appendChild(el("p", { class: "wf-p" }, [String(cfg.description)]));

        var form = el("form", {});
        var nameI = el("input", { class: "wf-input", placeholder: "Your name", required: "true", maxlength: "100" });
        var emailI = el("input", { class: "wf-input", type: "email", placeholder: "Email", required: "true", maxlength: "255" });
        var phoneI = el("input", { class: "wf-input", type: "tel", placeholder: "Phone (optional)", maxlength: "32" });
        var submit = el("button", { class: "wf-btn", type: "submit" }, [String(cfg.submitText || "Submit")]);
        form.appendChild(nameI); form.appendChild(emailI); form.appendChild(phoneI); form.appendChild(submit);
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          submit.disabled = true;
          var payload = { name: nameI.value.trim(), email: emailI.value.trim(), phone: phoneI.value.trim() };
          track(widget.id, "submit", payload, ctx.base);
          card.innerHTML = "";
          card.appendChild(el("div", { class: "wf-success" }, [String(cfg.successMessage || "Thanks! We'll be in touch.")]));
          if (!isInline) setTimeout(function () { container.remove(); }, 2200);
        });
        card.appendChild(form);
        container.appendChild(card);
      }

      if (display === "inline") {
        buildForm(rendered.shadow, true);
        track(widget.id, "view", { display: "inline" }, ctx.base);
        return;
      }

      var fab = el("button", { class: "wf-fab", "aria-label": "Open form" }, ["✉"]);
      var openForm = function () {
        var overlay = el("div", { class: "wf-overlay" });
        overlay.addEventListener("click", function (e) { if (e.target === overlay) overlay.remove(); });
        buildForm(overlay, false);
        rendered.shadow.appendChild(overlay);
        track(widget.id, "open", {}, ctx.base);
      };
      fab.addEventListener("click", openForm);
      rendered.shadow.appendChild(fab);
      track(widget.id, "view", {}, ctx.base);
      if (cfg.autoOpen) setTimeout(openForm, Number(cfg.autoOpenDelay || 1) * 1000);
    },

    "ai-chat": function (widget, ctx) {
      var cfg = widget.config || {};
      var rendered = makeHost(widget.id);
      injectStyles(rendered.shadow, cfg.customCss);
      var sessionId = "chat_" + widget.id + "_" + getSessionId();
      var chat = null;

      var fab = el("button", { class: "wf-fab", "aria-label": "Open chat" }, ["💬"]);
      function appendMsg(body, who) {
        var m = el("div", { class: "wf-msg " + who });
        m.textContent = body;
        body_el.appendChild(m);
        body_el.scrollTop = body_el.scrollHeight;
      }
      var body_el;
      function openChat() {
        if (chat) return;
        chat = el("div", { class: "wf-chat" });
        var header = el("div", { class: "wf-chat-h" }, [
          String(cfg.title || "Chat with us"),
          el("button", { class: "wf-close", style: { color: "#fff" }, onClick: function () { chat.remove(); chat = null; track(widget.id, "close", {}, ctx.base); } }, ["×"])
        ]);
        body_el = el("div", { class: "wf-chat-body" });
        var welcome = String(cfg.welcomeMessage || "Hi! How can I help?");
        appendMsg(welcome, "bot");

        var typing = el("div", { class: "wf-typing", style: { display: "none" } }, ["Thinking…"]);

        var form = el("form", { class: "wf-chat-form" });
        var input = el("input", { placeholder: "Type a message…", maxlength: "1000", required: "true" });
        var send = el("button", { type: "submit" }, ["Send"]);
        form.appendChild(input); form.appendChild(send);
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var text = input.value.trim();
          if (!text) return;
          appendMsg(text, "user");
          input.value = "";
          send.disabled = true;
          typing.style.display = "block";
          track(widget.id, "chat_message", { role: "user", length: text.length }, ctx.base);
          safeFetch(ctx.base + "/widget-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ widget_id: widget.id, session_id: sessionId, message: text }),
          }, 1).then(function (r) { return r.json(); }).then(function (data) {
            typing.style.display = "none";
            send.disabled = false;
            var reply = (data && data.reply) || "Sorry, something went wrong.";
            appendMsg(reply, "bot");
            track(widget.id, "chat_message", { role: "assistant", length: reply.length }, ctx.base);
          }).catch(function () {
            typing.style.display = "none";
            send.disabled = false;
            appendMsg("Network error, please try again.", "bot");
          });
        });

        chat.appendChild(header);
        chat.appendChild(body_el);
        chat.appendChild(typing);
        chat.appendChild(form);
        rendered.shadow.appendChild(chat);
        track(widget.id, "open", {}, ctx.base);
      }
      fab.addEventListener("click", openChat);
      rendered.shadow.appendChild(fab);
      track(widget.id, "view", {}, ctx.base);
    },
  };

  // ---- Loader (singleton) ----
  var loaded = {};
  var Loader = {
    scan: function () {
      var scripts = document.querySelectorAll("script[data-widgetify-id], script[data-id][src*='embed.js']");
      scripts.forEach(function (s) {
        var id = s.getAttribute("data-widgetify-id") || s.getAttribute("data-id");
        if (!id || loaded[id]) return;
        var base = s.getAttribute("data-base") || DEFAULT_BASE;
        var token = s.getAttribute("data-token") || "";
        loaded[id] = true;
        Loader.load(id, base, token);
      });
    },
    load: function (widgetId, base, token) {
      var go = function () {
        var url = base + "/widgets-public?id=" + encodeURIComponent(widgetId);
        if (token) url += "&token=" + encodeURIComponent(token);
        safeFetch(url, { method: "GET" }, 1)
          .then(function (r) { if (!r.ok) throw new Error("404"); return r.json(); })
          .then(function (widget) {
            var renderer = Renderers[widget.widget_type];
            if (!renderer) return;
            renderer(widget, { base: base });
          })
          .catch(function () { /* silent */ });
      };
      if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 1500 });
      else setTimeout(go, 0);
    },
  };

  window.__WIDGETIFY_LOADER__ = Loader;
  window.Widgetify = { on: Bus.on.bind(Bus) };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { Loader.scan(); });
  } else {
    Loader.scan();
  }
})();
