// Minimal, dependency-free Hawk syntax highlighter for the documentation site.
// Escapes HTML first, then classifies tokens in a single pass.
(function () {
  "use strict";

  var KEYWORDS = {
    fn: 1, let: 1, var: 1, owned: 1, const: 1, struct: 1, enum: 1, impl: 1,
    if: 1, else: 1, while: 1, for: 1, in: 1, return: 1, break: 1,
    continue: 1, match: 1, region: 1, use: 1, true: 1, false: 1, self: 1,
    comp: 1, as: 1
  };

  var TYPES = {
    bool: 1, str: 1, void: 1,
    i8: 1, i16: 1, i32: 1, i64: 1, u8: 1, u16: 1, u32: 1, u64: 1,
    f32: 1, f64: 1,
    List: 1, Map: 1, Span: 1, Option: 1, Result: 1, String: 1, File: 1,
    Ok: 1, Err: 1, Some: 1, None: 1
  };

  var BUILTINS = {
    print: 1, println: 1, eprintln: 1, len: 1, panic: 1, assert: 1,
    promote: 1, alloc: 1, mem: 1, math: 1, fmt: 1, str: 1, list: 1,
    map: 1, span: 1, os: 1, fs: 1, output: 1, input: 1
  };

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function span(cls, text) {
    return '<span class="tok-' + cls + '">' + text + "</span>";
  }

  function highlight(source) {
    var out = "";
    var re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|`[^`]*`|'(?:\\.|[^'\\])*')|(\b\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([\s\S])/g;
    var m;
    while ((m = re.exec(source)) !== null) {
      if (m[1]) {
        out += span("c", esc(m[1]));
      } else if (m[2]) {
        out += span("s", esc(m[2]));
      } else if (m[3]) {
        out += span("n", esc(m[3]));
      } else if (m[4]) {
        var word = m[4];
        var rest = source.slice(re.lastIndex);
        if (KEYWORDS[word]) {
          out += span("k", word);
        } else if (TYPES[word]) {
          out += span("t", word);
        } else if (BUILTINS[word]) {
          out += span("f", word);
        } else if (/^\s*\(/.test(rest) && /^[a-z_]/.test(word)) {
          out += span("f", word);
        } else if (/^[A-Z]/.test(word)) {
          out += span("t", word);
        } else {
          out += span("p", word);
        }
      } else {
        out += esc(m[5] || "");
      }
    }
    return out;
  }

  function enhance() {
    var blocks = document.querySelectorAll("pre code.hawk, pre code[data-lang='hawk']");
    for (var i = 0; i < blocks.length; i++) {
      var el = blocks[i];
      if (el.dataset.highlighted) continue;
      el.innerHTML = highlight(el.textContent);
      el.dataset.highlighted = "1";
    }
    var windows = document.querySelectorAll(".code");
    for (var j = 0; j < windows.length; j++) {
      addCopyButton(windows[j]);
    }
  }

  function addCopyButton(win) {
    var head = win.querySelector(".code-head");
    var code = win.querySelector("code");
    if (!head || !code || head.querySelector(".copy")) return;
    var btn = document.createElement("button");
    btn.className = "copy";
    btn.type = "button";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      var text = code.textContent;
      var done = function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy"; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var area = document.createElement("textarea");
        area.value = text;
        document.body.appendChild(area);
        area.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(area);
        done();
      }
    });
    head.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhance);
  } else {
    enhance();
  }
})();
