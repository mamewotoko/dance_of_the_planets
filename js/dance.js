(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var Bytes = require("./bytes.js");
var Curry = require("./curry.js");
var $$String = require("./string.js");
var Caml_bytes = require("./caml_bytes.js");
var Pervasives = require("./pervasives.js");
var Caml_string = require("./caml_string.js");

function create(n) {
  var n$1 = n < 1 ? 1 : n;
  var s = Caml_bytes.caml_create_bytes(n$1);
  return {
          buffer: s,
          position: 0,
          length: n$1,
          initial_buffer: s
        };
}

function contents(b) {
  return Bytes.sub_string(b.buffer, 0, b.position);
}

function to_bytes(b) {
  return Bytes.sub(b.buffer, 0, b.position);
}

function sub(b, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (b.position - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Buffer.sub",
          Error: new Error()
        };
  }
  return Bytes.sub_string(b.buffer, ofs, len);
}

function blit(src, srcoff, dst, dstoff, len) {
  if (len < 0 || srcoff < 0 || srcoff > (src.position - len | 0) || dstoff < 0 || dstoff > (dst.length - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Buffer.blit",
          Error: new Error()
        };
  }
  return Caml_bytes.caml_blit_bytes(src.buffer, srcoff, dst, dstoff, len);
}

function nth(b, ofs) {
  if (ofs < 0 || ofs >= b.position) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Buffer.nth",
          Error: new Error()
        };
  }
  return b.buffer[ofs];
}

function length(b) {
  return b.position;
}

function clear(b) {
  b.position = 0;
  
}

function reset(b) {
  b.position = 0;
  b.buffer = b.initial_buffer;
  b.length = b.buffer.length;
  
}

function resize(b, more) {
  var len = b.length;
  var new_len = len;
  while((b.position + more | 0) > new_len) {
    new_len = (new_len << 1);
  };
  var new_buffer = Caml_bytes.caml_create_bytes(new_len);
  Bytes.blit(b.buffer, 0, new_buffer, 0, b.position);
  b.buffer = new_buffer;
  b.length = new_len;
  
}

function add_char(b, c) {
  var pos = b.position;
  if (pos >= b.length) {
    resize(b, 1);
  }
  b.buffer[pos] = c;
  b.position = pos + 1 | 0;
  
}

function add_utf_8_uchar(b, u) {
  var u$1 = u;
  if (u$1 < 0) {
    throw {
          RE_EXN_ID: "Assert_failure",
          _1: [
            "buffer.ml",
            90,
            19
          ],
          Error: new Error()
        };
  }
  if (u$1 <= 127) {
    return add_char(b, u$1);
  }
  if (u$1 <= 2047) {
    var pos = b.position;
    if ((pos + 2 | 0) > b.length) {
      resize(b, 2);
    }
    b.buffer[pos] = 192 | (u$1 >>> 6);
    b.buffer[pos + 1 | 0] = 128 | u$1 & 63;
    b.position = pos + 2 | 0;
    return ;
  }
  if (u$1 <= 65535) {
    var pos$1 = b.position;
    if ((pos$1 + 3 | 0) > b.length) {
      resize(b, 3);
    }
    b.buffer[pos$1] = 224 | (u$1 >>> 12);
    b.buffer[pos$1 + 1 | 0] = 128 | (u$1 >>> 6) & 63;
    b.buffer[pos$1 + 2 | 0] = 128 | u$1 & 63;
    b.position = pos$1 + 3 | 0;
    return ;
  }
  if (u$1 <= 1114111) {
    var pos$2 = b.position;
    if ((pos$2 + 4 | 0) > b.length) {
      resize(b, 4);
    }
    b.buffer[pos$2] = 240 | (u$1 >>> 18);
    b.buffer[pos$2 + 1 | 0] = 128 | (u$1 >>> 12) & 63;
    b.buffer[pos$2 + 2 | 0] = 128 | (u$1 >>> 6) & 63;
    b.buffer[pos$2 + 3 | 0] = 128 | u$1 & 63;
    b.position = pos$2 + 4 | 0;
    return ;
  }
  throw {
        RE_EXN_ID: "Assert_failure",
        _1: [
          "buffer.ml",
          123,
          8
        ],
        Error: new Error()
      };
}

function add_utf_16be_uchar(b, u) {
  var u$1 = u;
  if (u$1 < 0) {
    throw {
          RE_EXN_ID: "Assert_failure",
          _1: [
            "buffer.ml",
            126,
            19
          ],
          Error: new Error()
        };
  }
  if (u$1 <= 65535) {
    var pos = b.position;
    if ((pos + 2 | 0) > b.length) {
      resize(b, 2);
    }
    b.buffer[pos] = (u$1 >>> 8);
    b.buffer[pos + 1 | 0] = u$1 & 255;
    b.position = pos + 2 | 0;
    return ;
  }
  if (u$1 <= 1114111) {
    var u$prime = u$1 - 65536 | 0;
    var hi = 55296 | (u$prime >>> 10);
    var lo = 56320 | u$prime & 1023;
    var pos$1 = b.position;
    if ((pos$1 + 4 | 0) > b.length) {
      resize(b, 4);
    }
    b.buffer[pos$1] = (hi >>> 8);
    b.buffer[pos$1 + 1 | 0] = hi & 255;
    b.buffer[pos$1 + 2 | 0] = (lo >>> 8);
    b.buffer[pos$1 + 3 | 0] = lo & 255;
    b.position = pos$1 + 4 | 0;
    return ;
  }
  throw {
        RE_EXN_ID: "Assert_failure",
        _1: [
          "buffer.ml",
          144,
          8
        ],
        Error: new Error()
      };
}

function add_utf_16le_uchar(b, u) {
  var u$1 = u;
  if (u$1 < 0) {
    throw {
          RE_EXN_ID: "Assert_failure",
          _1: [
            "buffer.ml",
            147,
            19
          ],
          Error: new Error()
        };
  }
  if (u$1 <= 65535) {
    var pos = b.position;
    if ((pos + 2 | 0) > b.length) {
      resize(b, 2);
    }
    b.buffer[pos] = u$1 & 255;
    b.buffer[pos + 1 | 0] = (u$1 >>> 8);
    b.position = pos + 2 | 0;
    return ;
  }
  if (u$1 <= 1114111) {
    var u$prime = u$1 - 65536 | 0;
    var hi = 55296 | (u$prime >>> 10);
    var lo = 56320 | u$prime & 1023;
    var pos$1 = b.position;
    if ((pos$1 + 4 | 0) > b.length) {
      resize(b, 4);
    }
    b.buffer[pos$1] = hi & 255;
    b.buffer[pos$1 + 1 | 0] = (hi >>> 8);
    b.buffer[pos$1 + 2 | 0] = lo & 255;
    b.buffer[pos$1 + 3 | 0] = (lo >>> 8);
    b.position = pos$1 + 4 | 0;
    return ;
  }
  throw {
        RE_EXN_ID: "Assert_failure",
        _1: [
          "buffer.ml",
          165,
          8
        ],
        Error: new Error()
      };
}

function add_substring(b, s, offset, len) {
  if (offset < 0 || len < 0 || offset > (s.length - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Buffer.add_substring/add_subbytes",
          Error: new Error()
        };
  }
  var new_position = b.position + len | 0;
  if (new_position > b.length) {
    resize(b, len);
  }
  Bytes.blit_string(s, offset, b.buffer, b.position, len);
  b.position = new_position;
  
}

function add_subbytes(b, s, offset, len) {
  return add_substring(b, Caml_bytes.bytes_to_string(s), offset, len);
}

function add_string(b, s) {
  var len = s.length;
  var new_position = b.position + len | 0;
  if (new_position > b.length) {
    resize(b, len);
  }
  Bytes.blit_string(s, 0, b.buffer, b.position, len);
  b.position = new_position;
  
}

function add_bytes(b, s) {
  return add_string(b, Caml_bytes.bytes_to_string(s));
}

function add_buffer(b, bs) {
  return add_subbytes(b, bs.buffer, 0, bs.position);
}

function add_channel(b, ic, len) {
  if (len < 0) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Buffer.add_channel",
          Error: new Error()
        };
  }
  if ((b.position + len | 0) > b.length) {
    resize(b, len);
  }
  var _len = len;
  while(true) {
    var len$1 = _len;
    if (len$1 <= 0) {
      return ;
    }
    var n = Pervasives.input(ic, b.buffer, b.position, len$1);
    b.position = b.position + n | 0;
    if (n === 0) {
      throw {
            RE_EXN_ID: "End_of_file",
            Error: new Error()
          };
    }
    _len = len$1 - n | 0;
    continue ;
  };
}

function output_buffer(oc, b) {
  return Pervasives.output(oc, b.buffer, 0, b.position);
}

function closing(param) {
  if (param === 40) {
    return /* ')' */41;
  }
  if (param === 123) {
    return /* '}' */125;
  }
  throw {
        RE_EXN_ID: "Assert_failure",
        _1: [
          "buffer.ml",
          216,
          9
        ],
        Error: new Error()
      };
}

function advance_to_closing(opening, closing, k, s, start) {
  var _k = k;
  var _i = start;
  var lim = s.length;
  while(true) {
    var i = _i;
    var k$1 = _k;
    if (i >= lim) {
      throw {
            RE_EXN_ID: "Not_found",
            Error: new Error()
          };
    }
    if (Caml_string.get(s, i) === opening) {
      _i = i + 1 | 0;
      _k = k$1 + 1 | 0;
      continue ;
    }
    if (Caml_string.get(s, i) === closing) {
      if (k$1 === 0) {
        return i;
      }
      _i = i + 1 | 0;
      _k = k$1 - 1 | 0;
      continue ;
    }
    _i = i + 1 | 0;
    continue ;
  };
}

function advance_to_non_alpha(s, start) {
  var _i = start;
  var lim = s.length;
  while(true) {
    var i = _i;
    if (i >= lim) {
      return lim;
    }
    var match = Caml_string.get(s, i);
    if (match >= 91) {
      if (match >= 97) {
        if (match >= 123) {
          return i;
        }
        
      } else if (match !== 95) {
        return i;
      }
      
    } else if (match >= 58) {
      if (match < 65) {
        return i;
      }
      
    } else if (match < 48) {
      return i;
    }
    _i = i + 1 | 0;
    continue ;
  };
}

function find_ident(s, start, lim) {
  if (start >= lim) {
    throw {
          RE_EXN_ID: "Not_found",
          Error: new Error()
        };
  }
  var c = Caml_string.get(s, start);
  if (c !== 40 && c !== 123) {
    var stop = advance_to_non_alpha(s, start + 1 | 0);
    return [
            $$String.sub(s, start, stop - start | 0),
            stop
          ];
  }
  var new_start = start + 1 | 0;
  var stop$1 = advance_to_closing(c, closing(c), 0, s, new_start);
  return [
          $$String.sub(s, new_start, (stop$1 - start | 0) - 1 | 0),
          stop$1 + 1 | 0
        ];
}

function add_substitute(b, f, s) {
  var lim = s.length;
  var _previous = /* ' ' */32;
  var _i = 0;
  while(true) {
    var i = _i;
    var previous = _previous;
    if (i >= lim) {
      if (previous === /* '\\' */92) {
        return add_char(b, previous);
      } else {
        return ;
      }
    }
    var current = Caml_string.get(s, i);
    if (current !== 36) {
      if (previous === /* '\\' */92) {
        add_char(b, /* '\\' */92);
        add_char(b, current);
        _i = i + 1 | 0;
        _previous = /* ' ' */32;
        continue ;
      }
      if (current !== 92) {
        add_char(b, current);
        _i = i + 1 | 0;
        _previous = current;
        continue ;
      }
      _i = i + 1 | 0;
      _previous = current;
      continue ;
    }
    if (previous === /* '\\' */92) {
      add_char(b, current);
      _i = i + 1 | 0;
      _previous = /* ' ' */32;
      continue ;
    }
    var j = i + 1 | 0;
    var match = find_ident(s, j, lim);
    add_string(b, Curry._1(f, match[0]));
    _i = match[1];
    _previous = /* ' ' */32;
    continue ;
  };
}

function truncate(b, len) {
  if (len < 0 || len > b.position) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Buffer.truncate",
          Error: new Error()
        };
  }
  b.position = len;
  
}

exports.create = create;
exports.contents = contents;
exports.to_bytes = to_bytes;
exports.sub = sub;
exports.blit = blit;
exports.nth = nth;
exports.length = length;
exports.clear = clear;
exports.reset = reset;
exports.add_char = add_char;
exports.add_utf_8_uchar = add_utf_8_uchar;
exports.add_utf_16le_uchar = add_utf_16le_uchar;
exports.add_utf_16be_uchar = add_utf_16be_uchar;
exports.add_string = add_string;
exports.add_bytes = add_bytes;
exports.add_substring = add_substring;
exports.add_subbytes = add_subbytes;
exports.add_substitute = add_substitute;
exports.add_buffer = add_buffer;
exports.add_channel = add_channel;
exports.output_buffer = output_buffer;
exports.truncate = truncate;
/* No side effect */

},{"./bytes.js":2,"./caml_bytes.js":4,"./caml_string.js":14,"./curry.js":19,"./pervasives.js":20,"./string.js":22}],2:[function(require,module,exports){
'use strict';

var Char = require("./char.js");
var Curry = require("./curry.js");
var Caml_bytes = require("./caml_bytes.js");
var Caml_primitive = require("./caml_primitive.js");
var Caml_js_exceptions = require("./caml_js_exceptions.js");

function make(n, c) {
  var s = Caml_bytes.caml_create_bytes(n);
  Caml_bytes.caml_fill_bytes(s, 0, n, c);
  return s;
}

function init(n, f) {
  var s = Caml_bytes.caml_create_bytes(n);
  for(var i = 0; i < n; ++i){
    s[i] = Curry._1(f, i);
  }
  return s;
}

var empty = [];

function copy(s) {
  var len = s.length;
  var r = Caml_bytes.caml_create_bytes(len);
  Caml_bytes.caml_blit_bytes(s, 0, r, 0, len);
  return r;
}

function to_string(b) {
  return Caml_bytes.bytes_to_string(copy(b));
}

function of_string(s) {
  return copy(Caml_bytes.bytes_of_string(s));
}

function sub(s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.sub / Bytes.sub",
          Error: new Error()
        };
  }
  var r = Caml_bytes.caml_create_bytes(len);
  Caml_bytes.caml_blit_bytes(s, ofs, r, 0, len);
  return r;
}

function sub_string(b, ofs, len) {
  return Caml_bytes.bytes_to_string(sub(b, ofs, len));
}

function $plus$plus(a, b) {
  var c = a + b | 0;
  var match = a < 0;
  var match$1 = b < 0;
  var match$2 = c < 0;
  if (match) {
    if (!match$1) {
      return c;
    }
    if (match$2) {
      return c;
    }
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Bytes.extend",
          Error: new Error()
        };
  }
  if (match$1) {
    return c;
  }
  if (match$2) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Bytes.extend",
          Error: new Error()
        };
  }
  return c;
}

function extend(s, left, right) {
  var len = $plus$plus($plus$plus(s.length, left), right);
  var r = Caml_bytes.caml_create_bytes(len);
  var match = left < 0 ? [
      -left | 0,
      0
    ] : [
      0,
      left
    ];
  var dstoff = match[1];
  var srcoff = match[0];
  var cpylen = Caml_primitive.caml_int_min(s.length - srcoff | 0, len - dstoff | 0);
  if (cpylen > 0) {
    Caml_bytes.caml_blit_bytes(s, srcoff, r, dstoff, cpylen);
  }
  return r;
}

function fill(s, ofs, len, c) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.fill / Bytes.fill",
          Error: new Error()
        };
  }
  return Caml_bytes.caml_fill_bytes(s, ofs, len, c);
}

function blit(s1, ofs1, s2, ofs2, len) {
  if (len < 0 || ofs1 < 0 || ofs1 > (s1.length - len | 0) || ofs2 < 0 || ofs2 > (s2.length - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Bytes.blit",
          Error: new Error()
        };
  }
  return Caml_bytes.caml_blit_bytes(s1, ofs1, s2, ofs2, len);
}

function blit_string(s1, ofs1, s2, ofs2, len) {
  if (len < 0 || ofs1 < 0 || ofs1 > (s1.length - len | 0) || ofs2 < 0 || ofs2 > (s2.length - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.blit / Bytes.blit_string",
          Error: new Error()
        };
  }
  return Caml_bytes.caml_blit_string(s1, ofs1, s2, ofs2, len);
}

function iter(f, a) {
  for(var i = 0 ,i_finish = a.length; i < i_finish; ++i){
    Curry._1(f, a[i]);
  }
  
}

function iteri(f, a) {
  for(var i = 0 ,i_finish = a.length; i < i_finish; ++i){
    Curry._2(f, i, a[i]);
  }
  
}

function ensure_ge(x, y) {
  if (x >= y) {
    return x;
  }
  throw {
        RE_EXN_ID: "Invalid_argument",
        _1: "Bytes.concat",
        Error: new Error()
      };
}

function sum_lengths(_acc, seplen, _param) {
  while(true) {
    var param = _param;
    var acc = _acc;
    if (!param) {
      return acc;
    }
    var tl = param.tl;
    var hd = param.hd;
    if (!tl) {
      return hd.length + acc | 0;
    }
    _param = tl;
    _acc = ensure_ge((hd.length + seplen | 0) + acc | 0, acc);
    continue ;
  };
}

function concat(sep, l) {
  if (!l) {
    return empty;
  }
  var seplen = sep.length;
  var dst = Caml_bytes.caml_create_bytes(sum_lengths(0, seplen, l));
  var _pos = 0;
  var _param = l;
  while(true) {
    var param = _param;
    var pos = _pos;
    if (!param) {
      return dst;
    }
    var tl = param.tl;
    var hd = param.hd;
    if (tl) {
      Caml_bytes.caml_blit_bytes(hd, 0, dst, pos, hd.length);
      Caml_bytes.caml_blit_bytes(sep, 0, dst, pos + hd.length | 0, seplen);
      _param = tl;
      _pos = (pos + hd.length | 0) + seplen | 0;
      continue ;
    }
    Caml_bytes.caml_blit_bytes(hd, 0, dst, pos, hd.length);
    return dst;
  };
}

function cat(s1, s2) {
  var l1 = s1.length;
  var l2 = s2.length;
  var r = Caml_bytes.caml_create_bytes(l1 + l2 | 0);
  Caml_bytes.caml_blit_bytes(s1, 0, r, 0, l1);
  Caml_bytes.caml_blit_bytes(s2, 0, r, l1, l2);
  return r;
}

function is_space(param) {
  if (param > 13 || param < 9) {
    return param === 32;
  } else {
    return param !== 11;
  }
}

function trim(s) {
  var len = s.length;
  var i = 0;
  while(i < len && is_space(s[i])) {
    i = i + 1 | 0;
  };
  var j = len - 1 | 0;
  while(j >= i && is_space(s[j])) {
    j = j - 1 | 0;
  };
  if (j >= i) {
    return sub(s, i, (j - i | 0) + 1 | 0);
  } else {
    return empty;
  }
}

function escaped(s) {
  var n = 0;
  for(var i = 0 ,i_finish = s.length; i < i_finish; ++i){
    var match = s[i];
    n = n + (
      match >= 32 ? (
          match > 92 || match < 34 ? (
              match >= 127 ? 4 : 1
            ) : (
              match > 91 || match < 35 ? 2 : 1
            )
        ) : (
          match >= 11 ? (
              match !== 13 ? 4 : 2
            ) : (
              match >= 8 ? 2 : 4
            )
        )
    ) | 0;
  }
  if (n === s.length) {
    return copy(s);
  }
  var s$prime = Caml_bytes.caml_create_bytes(n);
  n = 0;
  for(var i$1 = 0 ,i_finish$1 = s.length; i$1 < i_finish$1; ++i$1){
    var c = s[i$1];
    var exit = 0;
    if (c >= 35) {
      if (c !== 92) {
        if (c >= 127) {
          exit = 1;
        } else {
          s$prime[n] = c;
        }
      } else {
        exit = 2;
      }
    } else if (c >= 32) {
      if (c >= 34) {
        exit = 2;
      } else {
        s$prime[n] = c;
      }
    } else if (c >= 14) {
      exit = 1;
    } else {
      switch (c) {
        case 8 :
            s$prime[n] = /* '\\' */92;
            n = n + 1 | 0;
            s$prime[n] = /* 'b' */98;
            break;
        case 9 :
            s$prime[n] = /* '\\' */92;
            n = n + 1 | 0;
            s$prime[n] = /* 't' */116;
            break;
        case 10 :
            s$prime[n] = /* '\\' */92;
            n = n + 1 | 0;
            s$prime[n] = /* 'n' */110;
            break;
        case 0 :
        case 1 :
        case 2 :
        case 3 :
        case 4 :
        case 5 :
        case 6 :
        case 7 :
        case 11 :
        case 12 :
            exit = 1;
            break;
        case 13 :
            s$prime[n] = /* '\\' */92;
            n = n + 1 | 0;
            s$prime[n] = /* 'r' */114;
            break;
        
      }
    }
    switch (exit) {
      case 1 :
          s$prime[n] = /* '\\' */92;
          n = n + 1 | 0;
          s$prime[n] = 48 + (c / 100 | 0) | 0;
          n = n + 1 | 0;
          s$prime[n] = 48 + (c / 10 | 0) % 10 | 0;
          n = n + 1 | 0;
          s$prime[n] = 48 + c % 10 | 0;
          break;
      case 2 :
          s$prime[n] = /* '\\' */92;
          n = n + 1 | 0;
          s$prime[n] = c;
          break;
      
    }
    n = n + 1 | 0;
  }
  return s$prime;
}

function map(f, s) {
  var l = s.length;
  if (l === 0) {
    return s;
  }
  var r = Caml_bytes.caml_create_bytes(l);
  for(var i = 0; i < l; ++i){
    r[i] = Curry._1(f, s[i]);
  }
  return r;
}

function mapi(f, s) {
  var l = s.length;
  if (l === 0) {
    return s;
  }
  var r = Caml_bytes.caml_create_bytes(l);
  for(var i = 0; i < l; ++i){
    r[i] = Curry._2(f, i, s[i]);
  }
  return r;
}

function uppercase_ascii(s) {
  return map(Char.uppercase_ascii, s);
}

function lowercase_ascii(s) {
  return map(Char.lowercase_ascii, s);
}

function apply1(f, s) {
  if (s.length === 0) {
    return s;
  }
  var r = copy(s);
  r[0] = Curry._1(f, s[0]);
  return r;
}

function capitalize_ascii(s) {
  return apply1(Char.uppercase_ascii, s);
}

function uncapitalize_ascii(s) {
  return apply1(Char.lowercase_ascii, s);
}

function index_rec(s, lim, _i, c) {
  while(true) {
    var i = _i;
    if (i >= lim) {
      throw {
            RE_EXN_ID: "Not_found",
            Error: new Error()
          };
    }
    if (s[i] === c) {
      return i;
    }
    _i = i + 1 | 0;
    continue ;
  };
}

function index(s, c) {
  return index_rec(s, s.length, 0, c);
}

function index_rec_opt(s, lim, _i, c) {
  while(true) {
    var i = _i;
    if (i >= lim) {
      return ;
    }
    if (s[i] === c) {
      return i;
    }
    _i = i + 1 | 0;
    continue ;
  };
}

function index_opt(s, c) {
  return index_rec_opt(s, s.length, 0, c);
}

function index_from(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.index_from / Bytes.index_from",
          Error: new Error()
        };
  }
  return index_rec(s, l, i, c);
}

function index_from_opt(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.index_from_opt / Bytes.index_from_opt",
          Error: new Error()
        };
  }
  return index_rec_opt(s, l, i, c);
}

function rindex_rec(s, _i, c) {
  while(true) {
    var i = _i;
    if (i < 0) {
      throw {
            RE_EXN_ID: "Not_found",
            Error: new Error()
          };
    }
    if (s[i] === c) {
      return i;
    }
    _i = i - 1 | 0;
    continue ;
  };
}

function rindex(s, c) {
  return rindex_rec(s, s.length - 1 | 0, c);
}

function rindex_from(s, i, c) {
  if (i < -1 || i >= s.length) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.rindex_from / Bytes.rindex_from",
          Error: new Error()
        };
  }
  return rindex_rec(s, i, c);
}

function rindex_rec_opt(s, _i, c) {
  while(true) {
    var i = _i;
    if (i < 0) {
      return ;
    }
    if (s[i] === c) {
      return i;
    }
    _i = i - 1 | 0;
    continue ;
  };
}

function rindex_opt(s, c) {
  return rindex_rec_opt(s, s.length - 1 | 0, c);
}

function rindex_from_opt(s, i, c) {
  if (i < -1 || i >= s.length) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.rindex_from_opt / Bytes.rindex_from_opt",
          Error: new Error()
        };
  }
  return rindex_rec_opt(s, i, c);
}

function contains_from(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.contains_from / Bytes.contains_from",
          Error: new Error()
        };
  }
  try {
    index_rec(s, l, i, c);
    return true;
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === "Not_found") {
      return false;
    }
    throw exn;
  }
}

function contains(s, c) {
  return contains_from(s, 0, c);
}

function rcontains_from(s, i, c) {
  if (i < 0 || i >= s.length) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.rcontains_from / Bytes.rcontains_from",
          Error: new Error()
        };
  }
  try {
    rindex_rec(s, i, c);
    return true;
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === "Not_found") {
      return false;
    }
    throw exn;
  }
}

var compare = Caml_bytes.caml_bytes_compare;

function uppercase(s) {
  return map(Char.uppercase, s);
}

function lowercase(s) {
  return map(Char.lowercase, s);
}

function capitalize(s) {
  return apply1(Char.uppercase, s);
}

function uncapitalize(s) {
  return apply1(Char.lowercase, s);
}

var equal = Caml_bytes.caml_bytes_equal;

var unsafe_to_string = Caml_bytes.bytes_to_string;

var unsafe_of_string = Caml_bytes.bytes_of_string;

exports.make = make;
exports.init = init;
exports.empty = empty;
exports.copy = copy;
exports.of_string = of_string;
exports.to_string = to_string;
exports.sub = sub;
exports.sub_string = sub_string;
exports.extend = extend;
exports.fill = fill;
exports.blit = blit;
exports.blit_string = blit_string;
exports.concat = concat;
exports.cat = cat;
exports.iter = iter;
exports.iteri = iteri;
exports.map = map;
exports.mapi = mapi;
exports.trim = trim;
exports.escaped = escaped;
exports.index = index;
exports.index_opt = index_opt;
exports.rindex = rindex;
exports.rindex_opt = rindex_opt;
exports.index_from = index_from;
exports.index_from_opt = index_from_opt;
exports.rindex_from = rindex_from;
exports.rindex_from_opt = rindex_from_opt;
exports.contains = contains;
exports.contains_from = contains_from;
exports.rcontains_from = rcontains_from;
exports.uppercase = uppercase;
exports.lowercase = lowercase;
exports.capitalize = capitalize;
exports.uncapitalize = uncapitalize;
exports.uppercase_ascii = uppercase_ascii;
exports.lowercase_ascii = lowercase_ascii;
exports.capitalize_ascii = capitalize_ascii;
exports.uncapitalize_ascii = uncapitalize_ascii;
exports.compare = compare;
exports.equal = equal;
exports.unsafe_to_string = unsafe_to_string;
exports.unsafe_of_string = unsafe_of_string;
/* No side effect */

},{"./caml_bytes.js":4,"./caml_js_exceptions.js":10,"./caml_primitive.js":13,"./char.js":18,"./curry.js":19}],3:[function(require,module,exports){
'use strict';


function caml_array_sub(x, offset, len) {
  var result = new Array(len);
  var j = 0;
  var i = offset;
  while(j < len) {
    result[j] = x[i];
    j = j + 1 | 0;
    i = i + 1 | 0;
  };
  return result;
}

function len(_acc, _l) {
  while(true) {
    var l = _l;
    var acc = _acc;
    if (!l) {
      return acc;
    }
    _l = l.tl;
    _acc = l.hd.length + acc | 0;
    continue ;
  };
}

function fill(arr, _i, _l) {
  while(true) {
    var l = _l;
    var i = _i;
    if (!l) {
      return ;
    }
    var x = l.hd;
    var l$1 = x.length;
    var k = i;
    var j = 0;
    while(j < l$1) {
      arr[k] = x[j];
      k = k + 1 | 0;
      j = j + 1 | 0;
    };
    _l = l.tl;
    _i = k;
    continue ;
  };
}

function caml_array_concat(l) {
  var v = len(0, l);
  var result = new Array(v);
  fill(result, 0, l);
  return result;
}

function set(xs, index, newval) {
  if (index < 0 || index >= xs.length) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "index out of bounds",
          Error: new Error()
        };
  }
  xs[index] = newval;
  
}

function get(xs, index) {
  if (index < 0 || index >= xs.length) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "index out of bounds",
          Error: new Error()
        };
  }
  return xs[index];
}

function caml_make_vect(len, init) {
  var b = new Array(len);
  for(var i = 0; i < len; ++i){
    b[i] = init;
  }
  return b;
}

function caml_make_float_vect(len) {
  var b = new Array(len);
  for(var i = 0; i < len; ++i){
    b[i] = 0;
  }
  return b;
}

function caml_array_blit(a1, i1, a2, i2, len) {
  if (i2 <= i1) {
    for(var j = 0; j < len; ++j){
      a2[j + i2 | 0] = a1[j + i1 | 0];
    }
    return ;
  }
  for(var j$1 = len - 1 | 0; j$1 >= 0; --j$1){
    a2[j$1 + i2 | 0] = a1[j$1 + i1 | 0];
  }
  
}

function caml_array_dup(prim) {
  return prim.slice(0);
}

exports.caml_array_dup = caml_array_dup;
exports.caml_array_sub = caml_array_sub;
exports.caml_array_concat = caml_array_concat;
exports.caml_make_vect = caml_make_vect;
exports.caml_make_float_vect = caml_make_float_vect;
exports.caml_array_blit = caml_array_blit;
exports.get = get;
exports.set = set;
/* No side effect */

},{}],4:[function(require,module,exports){
'use strict';


function set(s, i, ch) {
  if (i < 0 || i >= s.length) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "index out of bounds",
          Error: new Error()
        };
  }
  s[i] = ch;
  
}

function get(s, i) {
  if (i < 0 || i >= s.length) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "index out of bounds",
          Error: new Error()
        };
  }
  return s[i];
}

function caml_fill_bytes(s, i, l, c) {
  if (l <= 0) {
    return ;
  }
  for(var k = i ,k_finish = l + i | 0; k < k_finish; ++k){
    s[k] = c;
  }
  
}

function caml_create_bytes(len) {
  if (len < 0) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.create",
          Error: new Error()
        };
  }
  var result = new Array(len);
  for(var i = 0; i < len; ++i){
    result[i] = /* '\000' */0;
  }
  return result;
}

function caml_blit_bytes(s1, i1, s2, i2, len) {
  if (len <= 0) {
    return ;
  }
  if (s1 === s2) {
    if (i1 < i2) {
      var range_a = (s1.length - i2 | 0) - 1 | 0;
      var range_b = len - 1 | 0;
      var range = range_a > range_b ? range_b : range_a;
      for(var j = range; j >= 0; --j){
        s1[i2 + j | 0] = s1[i1 + j | 0];
      }
      return ;
    }
    if (i1 <= i2) {
      return ;
    }
    var range_a$1 = (s1.length - i1 | 0) - 1 | 0;
    var range_b$1 = len - 1 | 0;
    var range$1 = range_a$1 > range_b$1 ? range_b$1 : range_a$1;
    for(var k = 0; k <= range$1; ++k){
      s1[i2 + k | 0] = s1[i1 + k | 0];
    }
    return ;
  }
  var off1 = s1.length - i1 | 0;
  if (len <= off1) {
    for(var i = 0; i < len; ++i){
      s2[i2 + i | 0] = s1[i1 + i | 0];
    }
    return ;
  }
  for(var i$1 = 0; i$1 < off1; ++i$1){
    s2[i2 + i$1 | 0] = s1[i1 + i$1 | 0];
  }
  for(var i$2 = off1; i$2 < len; ++i$2){
    s2[i2 + i$2 | 0] = /* '\000' */0;
  }
  
}

function bytes_to_string(a) {
  var i = 0;
  var len = a.length;
  var s = "";
  var s_len = len;
  if (i === 0 && len <= 4096 && len === a.length) {
    return String.fromCharCode.apply(null, a);
  }
  var offset = 0;
  while(s_len > 0) {
    var next = s_len < 1024 ? s_len : 1024;
    var tmp_bytes = new Array(next);
    for(var k = 0; k < next; ++k){
      tmp_bytes[k] = a[k + offset | 0];
    }
    s = s + String.fromCharCode.apply(null, tmp_bytes);
    s_len = s_len - next | 0;
    offset = offset + next | 0;
  };
  return s;
}

function caml_blit_string(s1, i1, s2, i2, len) {
  if (len <= 0) {
    return ;
  }
  var off1 = s1.length - i1 | 0;
  if (len <= off1) {
    for(var i = 0; i < len; ++i){
      s2[i2 + i | 0] = s1.charCodeAt(i1 + i | 0);
    }
    return ;
  }
  for(var i$1 = 0; i$1 < off1; ++i$1){
    s2[i2 + i$1 | 0] = s1.charCodeAt(i1 + i$1 | 0);
  }
  for(var i$2 = off1; i$2 < len; ++i$2){
    s2[i2 + i$2 | 0] = /* '\000' */0;
  }
  
}

function bytes_of_string(s) {
  var len = s.length;
  var res = new Array(len);
  for(var i = 0; i < len; ++i){
    res[i] = s.charCodeAt(i);
  }
  return res;
}

function caml_bytes_compare_aux(s1, s2, _off, len, def) {
  while(true) {
    var off = _off;
    if (off >= len) {
      return def;
    }
    var a = s1[off];
    var b = s2[off];
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    _off = off + 1 | 0;
    continue ;
  };
}

function caml_bytes_compare(s1, s2) {
  var len1 = s1.length;
  var len2 = s2.length;
  if (len1 === len2) {
    return caml_bytes_compare_aux(s1, s2, 0, len1, 0);
  } else if (len1 < len2) {
    return caml_bytes_compare_aux(s1, s2, 0, len1, -1);
  } else {
    return caml_bytes_compare_aux(s1, s2, 0, len2, 1);
  }
}

function caml_bytes_equal(s1, s2) {
  var len1 = s1.length;
  var len2 = s2.length;
  if (len1 === len2) {
    var _off = 0;
    while(true) {
      var off = _off;
      if (off === len1) {
        return true;
      }
      var a = s1[off];
      var b = s2[off];
      if (a !== b) {
        return false;
      }
      _off = off + 1 | 0;
      continue ;
    };
  } else {
    return false;
  }
}

function caml_bytes_greaterthan(s1, s2) {
  return caml_bytes_compare(s1, s2) > 0;
}

function caml_bytes_greaterequal(s1, s2) {
  return caml_bytes_compare(s1, s2) >= 0;
}

function caml_bytes_lessthan(s1, s2) {
  return caml_bytes_compare(s1, s2) < 0;
}

function caml_bytes_lessequal(s1, s2) {
  return caml_bytes_compare(s1, s2) <= 0;
}

exports.caml_create_bytes = caml_create_bytes;
exports.caml_fill_bytes = caml_fill_bytes;
exports.get = get;
exports.set = set;
exports.bytes_to_string = bytes_to_string;
exports.caml_blit_bytes = caml_blit_bytes;
exports.caml_blit_string = caml_blit_string;
exports.bytes_of_string = bytes_of_string;
exports.caml_bytes_compare = caml_bytes_compare;
exports.caml_bytes_greaterthan = caml_bytes_greaterthan;
exports.caml_bytes_greaterequal = caml_bytes_greaterequal;
exports.caml_bytes_lessthan = caml_bytes_lessthan;
exports.caml_bytes_lessequal = caml_bytes_lessequal;
exports.caml_bytes_equal = caml_bytes_equal;
/* No side effect */

},{}],5:[function(require,module,exports){
'use strict';


var id = {
  contents: 0
};

function create(str) {
  id.contents = id.contents + 1 | 0;
  return str + ("/" + id.contents);
}

function caml_is_extension(e) {
  if (e == null) {
    return false;
  } else {
    return typeof e.RE_EXN_ID === "string";
  }
}

function caml_exn_slot_name(x) {
  return x.RE_EXN_ID;
}

exports.id = id;
exports.create = create;
exports.caml_is_extension = caml_is_extension;
exports.caml_exn_slot_name = caml_exn_slot_name;
/* No side effect */

},{}],6:[function(require,module,exports){
(function (global){(function (){
'use strict';


var getGlobalThis = (function(){
  if (typeof globalThis !== 'undefined') return globalThis;
	if (typeof self !== 'undefined') return self;
	if (typeof window !== 'undefined') return window;
	if (typeof global !== 'undefined') return global;
	if (typeof this !== 'undefined') return this;
	throw new Error('Unable to locate global `this`');
});

var resolve = (function(s){
  var myGlobal = getGlobalThis();
  if (myGlobal[s] === undefined){
    throw new Error(s + " not polyfilled by BuckleScript yet\n")
  }
  return myGlobal[s]
});

var register = (function(s,fn){
  var myGlobal = getGlobalThis();
  myGlobal[s] = fn 
  return 0
});

exports.getGlobalThis = getGlobalThis;
exports.resolve = resolve;
exports.register = register;
/* No side effect */

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
'use strict';

var Caml_int64 = require("./caml_int64.js");

function parse_digit(c) {
  if (c >= 65) {
    if (c >= 97) {
      if (c >= 123) {
        return -1;
      } else {
        return c - 87 | 0;
      }
    } else if (c >= 91) {
      return -1;
    } else {
      return c - 55 | 0;
    }
  } else if (c > 57 || c < 48) {
    return -1;
  } else {
    return c - /* '0' */48 | 0;
  }
}

function int_of_string_base(param) {
  switch (param) {
    case /* Oct */0 :
        return 8;
    case /* Hex */1 :
        return 16;
    case /* Dec */2 :
        return 10;
    case /* Bin */3 :
        return 2;
    
  }
}

function parse_sign_and_base(s) {
  var sign = 1;
  var base = /* Dec */2;
  var i = 0;
  var match = s.charCodeAt(i);
  switch (match) {
    case 43 :
        i = i + 1 | 0;
        break;
    case 44 :
        break;
    case 45 :
        sign = -1;
        i = i + 1 | 0;
        break;
    default:
      
  }
  if (s[i] === "0") {
    var match$1 = s.charCodeAt(i + 1 | 0);
    if (match$1 >= 89) {
      if (match$1 >= 111) {
        if (match$1 < 121) {
          switch (match$1) {
            case 111 :
                base = /* Oct */0;
                i = i + 2 | 0;
                break;
            case 117 :
                i = i + 2 | 0;
                break;
            case 112 :
            case 113 :
            case 114 :
            case 115 :
            case 116 :
            case 118 :
            case 119 :
                break;
            case 120 :
                base = /* Hex */1;
                i = i + 2 | 0;
                break;
            
          }
        }
        
      } else if (match$1 === 98) {
        base = /* Bin */3;
        i = i + 2 | 0;
      }
      
    } else if (match$1 !== 66) {
      if (match$1 >= 79) {
        switch (match$1) {
          case 79 :
              base = /* Oct */0;
              i = i + 2 | 0;
              break;
          case 85 :
              i = i + 2 | 0;
              break;
          case 80 :
          case 81 :
          case 82 :
          case 83 :
          case 84 :
          case 86 :
          case 87 :
              break;
          case 88 :
              base = /* Hex */1;
              i = i + 2 | 0;
              break;
          
        }
      }
      
    } else {
      base = /* Bin */3;
      i = i + 2 | 0;
    }
  }
  return [
          i,
          sign,
          base
        ];
}

function caml_int_of_string(s) {
  var match = parse_sign_and_base(s);
  var i = match[0];
  var base = int_of_string_base(match[2]);
  var threshold = 4294967295;
  var len = s.length;
  var c = i < len ? s.charCodeAt(i) : /* '\000' */0;
  var d = parse_digit(c);
  if (d < 0 || d >= base) {
    throw {
          RE_EXN_ID: "Failure",
          _1: "int_of_string",
          Error: new Error()
        };
  }
  var aux = function (_acc, _k) {
    while(true) {
      var k = _k;
      var acc = _acc;
      if (k === len) {
        return acc;
      }
      var a = s.charCodeAt(k);
      if (a === /* '_' */95) {
        _k = k + 1 | 0;
        continue ;
      }
      var v = parse_digit(a);
      if (v < 0 || v >= base) {
        throw {
              RE_EXN_ID: "Failure",
              _1: "int_of_string",
              Error: new Error()
            };
      }
      var acc$1 = base * acc + v;
      if (acc$1 > threshold) {
        throw {
              RE_EXN_ID: "Failure",
              _1: "int_of_string",
              Error: new Error()
            };
      }
      _k = k + 1 | 0;
      _acc = acc$1;
      continue ;
    };
  };
  var res = match[1] * aux(d, i + 1 | 0);
  var or_res = res | 0;
  if (base === 10 && res !== or_res) {
    throw {
          RE_EXN_ID: "Failure",
          _1: "int_of_string",
          Error: new Error()
        };
  }
  return or_res;
}

function caml_int64_of_string(s) {
  var match = parse_sign_and_base(s);
  var hbase = match[2];
  var i = match[0];
  var base = Caml_int64.of_int32(int_of_string_base(hbase));
  var sign = Caml_int64.of_int32(match[1]);
  var threshold;
  switch (hbase) {
    case /* Oct */0 :
        threshold = /* @__PURE__ */Caml_int64.mk(-1, 536870911);
        break;
    case /* Hex */1 :
        threshold = /* @__PURE__ */Caml_int64.mk(-1, 268435455);
        break;
    case /* Dec */2 :
        threshold = /* @__PURE__ */Caml_int64.mk(-1717986919, 429496729);
        break;
    case /* Bin */3 :
        threshold = Caml_int64.max_int;
        break;
    
  }
  var len = s.length;
  var c = i < len ? s.charCodeAt(i) : /* '\000' */0;
  var d = Caml_int64.of_int32(parse_digit(c));
  if (Caml_int64.lt(d, Caml_int64.zero) || Caml_int64.ge(d, base)) {
    throw {
          RE_EXN_ID: "Failure",
          _1: "int64_of_string",
          Error: new Error()
        };
  }
  var aux = function (_acc, _k) {
    while(true) {
      var k = _k;
      var acc = _acc;
      if (k === len) {
        return acc;
      }
      var a = s.charCodeAt(k);
      if (a === /* '_' */95) {
        _k = k + 1 | 0;
        continue ;
      }
      var v = Caml_int64.of_int32(parse_digit(a));
      if (Caml_int64.lt(v, Caml_int64.zero) || Caml_int64.ge(v, base) || Caml_int64.gt(acc, threshold)) {
        throw {
              RE_EXN_ID: "Failure",
              _1: "int64_of_string",
              Error: new Error()
            };
      }
      var acc$1 = Caml_int64.add(Caml_int64.mul(base, acc), v);
      _k = k + 1 | 0;
      _acc = acc$1;
      continue ;
    };
  };
  var res = Caml_int64.mul(sign, aux(d, i + 1 | 0));
  var or_res = Caml_int64.or_(res, Caml_int64.zero);
  if (Caml_int64.eq(base, /* @__PURE__ */Caml_int64.mk(10, 0)) && Caml_int64.neq(res, or_res)) {
    throw {
          RE_EXN_ID: "Failure",
          _1: "int64_of_string",
          Error: new Error()
        };
  }
  return or_res;
}

function int_of_base(param) {
  switch (param) {
    case /* Oct */0 :
        return 8;
    case /* Hex */1 :
        return 16;
    case /* Dec */2 :
        return 10;
    
  }
}

function lowercase(c) {
  if (c >= /* 'A' */65 && c <= /* 'Z' */90 || c >= /* '\192' */192 && c <= /* '\214' */214 || c >= /* '\216' */216 && c <= /* '\222' */222) {
    return c + 32 | 0;
  } else {
    return c;
  }
}

function parse_format(fmt) {
  var len = fmt.length;
  if (len > 31) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "format_int: format too long",
          Error: new Error()
        };
  }
  var f = {
    justify: "+",
    signstyle: "-",
    filter: " ",
    alternate: false,
    base: /* Dec */2,
    signedconv: false,
    width: 0,
    uppercase: false,
    sign: 1,
    prec: -1,
    conv: "f"
  };
  var _i = 0;
  while(true) {
    var i = _i;
    if (i >= len) {
      return f;
    }
    var c = fmt.charCodeAt(i);
    var exit = 0;
    if (c >= 69) {
      if (c >= 88) {
        if (c >= 121) {
          exit = 1;
        } else {
          switch (c) {
            case 88 :
                f.base = /* Hex */1;
                f.uppercase = true;
                _i = i + 1 | 0;
                continue ;
            case 101 :
            case 102 :
            case 103 :
                exit = 5;
                break;
            case 100 :
            case 105 :
                exit = 4;
                break;
            case 111 :
                f.base = /* Oct */0;
                _i = i + 1 | 0;
                continue ;
            case 117 :
                f.base = /* Dec */2;
                _i = i + 1 | 0;
                continue ;
            case 89 :
            case 90 :
            case 91 :
            case 92 :
            case 93 :
            case 94 :
            case 95 :
            case 96 :
            case 97 :
            case 98 :
            case 99 :
            case 104 :
            case 106 :
            case 107 :
            case 108 :
            case 109 :
            case 110 :
            case 112 :
            case 113 :
            case 114 :
            case 115 :
            case 116 :
            case 118 :
            case 119 :
                exit = 1;
                break;
            case 120 :
                f.base = /* Hex */1;
                _i = i + 1 | 0;
                continue ;
            
          }
        }
      } else if (c >= 72) {
        exit = 1;
      } else {
        f.signedconv = true;
        f.uppercase = true;
        f.conv = String.fromCharCode(lowercase(c));
        _i = i + 1 | 0;
        continue ;
      }
    } else {
      switch (c) {
        case 35 :
            f.alternate = true;
            _i = i + 1 | 0;
            continue ;
        case 32 :
        case 43 :
            exit = 2;
            break;
        case 45 :
            f.justify = "-";
            _i = i + 1 | 0;
            continue ;
        case 46 :
            f.prec = 0;
            var j = i + 1 | 0;
            while((function(j){
                return function () {
                  var w = fmt.charCodeAt(j) - /* '0' */48 | 0;
                  return w >= 0 && w <= 9;
                }
                }(j))()) {
              f.prec = (Math.imul(f.prec, 10) + fmt.charCodeAt(j) | 0) - /* '0' */48 | 0;
              j = j + 1 | 0;
            };
            _i = j;
            continue ;
        case 33 :
        case 34 :
        case 36 :
        case 37 :
        case 38 :
        case 39 :
        case 40 :
        case 41 :
        case 42 :
        case 44 :
        case 47 :
            exit = 1;
            break;
        case 48 :
            f.filter = "0";
            _i = i + 1 | 0;
            continue ;
        case 49 :
        case 50 :
        case 51 :
        case 52 :
        case 53 :
        case 54 :
        case 55 :
        case 56 :
        case 57 :
            exit = 3;
            break;
        default:
          exit = 1;
      }
    }
    switch (exit) {
      case 1 :
          _i = i + 1 | 0;
          continue ;
      case 2 :
          f.signstyle = String.fromCharCode(c);
          _i = i + 1 | 0;
          continue ;
      case 3 :
          f.width = 0;
          var j$1 = i;
          while((function(j$1){
              return function () {
                var w = fmt.charCodeAt(j$1) - /* '0' */48 | 0;
                return w >= 0 && w <= 9;
              }
              }(j$1))()) {
            f.width = (Math.imul(f.width, 10) + fmt.charCodeAt(j$1) | 0) - /* '0' */48 | 0;
            j$1 = j$1 + 1 | 0;
          };
          _i = j$1;
          continue ;
      case 4 :
          f.signedconv = true;
          f.base = /* Dec */2;
          _i = i + 1 | 0;
          continue ;
      case 5 :
          f.signedconv = true;
          f.conv = String.fromCharCode(c);
          _i = i + 1 | 0;
          continue ;
      
    }
  };
}

function finish_formatting(config, rawbuffer) {
  var justify = config.justify;
  var signstyle = config.signstyle;
  var filter = config.filter;
  var alternate = config.alternate;
  var base = config.base;
  var signedconv = config.signedconv;
  var width = config.width;
  var uppercase = config.uppercase;
  var sign = config.sign;
  var len = rawbuffer.length;
  if (signedconv && (sign < 0 || signstyle !== "-")) {
    len = len + 1 | 0;
  }
  if (alternate) {
    if (base === /* Oct */0) {
      len = len + 1 | 0;
    } else if (base === /* Hex */1) {
      len = len + 2 | 0;
    }
    
  }
  var buffer = "";
  if (justify === "+" && filter === " ") {
    for(var _for = len; _for < width; ++_for){
      buffer = buffer + filter;
    }
  }
  if (signedconv) {
    if (sign < 0) {
      buffer = buffer + "-";
    } else if (signstyle !== "-") {
      buffer = buffer + signstyle;
    }
    
  }
  if (alternate && base === /* Oct */0) {
    buffer = buffer + "0";
  }
  if (alternate && base === /* Hex */1) {
    buffer = buffer + "0x";
  }
  if (justify === "+" && filter === "0") {
    for(var _for$1 = len; _for$1 < width; ++_for$1){
      buffer = buffer + filter;
    }
  }
  buffer = uppercase ? buffer + rawbuffer.toUpperCase() : buffer + rawbuffer;
  if (justify === "-") {
    for(var _for$2 = len; _for$2 < width; ++_for$2){
      buffer = buffer + " ";
    }
  }
  return buffer;
}

function caml_format_int(fmt, i) {
  if (fmt === "%d") {
    return String(i);
  }
  var f = parse_format(fmt);
  var i$1 = i < 0 ? (
      f.signedconv ? (f.sign = -1, (-i >>> 0)) : (i >>> 0)
    ) : i;
  var s = i$1.toString(int_of_base(f.base));
  if (f.prec >= 0) {
    f.filter = " ";
    var n = f.prec - s.length | 0;
    if (n > 0) {
      s = "0".repeat(n) + s;
    }
    
  }
  return finish_formatting(f, s);
}

function dec_of_pos_int64(x) {
  if (!Caml_int64.lt(x, Caml_int64.zero)) {
    return Caml_int64.to_string(x);
  }
  var wbase = /* @__PURE__ */Caml_int64.mk(10, 0);
  var y = Caml_int64.discard_sign(x);
  var match = Caml_int64.div_mod(y, wbase);
  var match$1 = Caml_int64.div_mod(Caml_int64.add(/* @__PURE__ */Caml_int64.mk(8, 0), match[1]), wbase);
  var quotient = Caml_int64.add(Caml_int64.add(/* @__PURE__ */Caml_int64.mk(-858993460, 214748364), match[0]), match$1[0]);
  return Caml_int64.to_string(quotient) + "0123456789"[Caml_int64.to_int32(match$1[1])];
}

function oct_of_int64(x) {
  var s = "";
  var wbase = /* @__PURE__ */Caml_int64.mk(8, 0);
  var cvtbl = "01234567";
  if (Caml_int64.lt(x, Caml_int64.zero)) {
    var y = Caml_int64.discard_sign(x);
    var match = Caml_int64.div_mod(y, wbase);
    var quotient = Caml_int64.add(/* @__PURE__ */Caml_int64.mk(0, 268435456), match[0]);
    var modulus = match[1];
    s = cvtbl[Caml_int64.to_int32(modulus)] + s;
    while(Caml_int64.neq(quotient, Caml_int64.zero)) {
      var match$1 = Caml_int64.div_mod(quotient, wbase);
      quotient = match$1[0];
      modulus = match$1[1];
      s = cvtbl[Caml_int64.to_int32(modulus)] + s;
    };
  } else {
    var match$2 = Caml_int64.div_mod(x, wbase);
    var quotient$1 = match$2[0];
    var modulus$1 = match$2[1];
    s = cvtbl[Caml_int64.to_int32(modulus$1)] + s;
    while(Caml_int64.neq(quotient$1, Caml_int64.zero)) {
      var match$3 = Caml_int64.div_mod(quotient$1, wbase);
      quotient$1 = match$3[0];
      modulus$1 = match$3[1];
      s = cvtbl[Caml_int64.to_int32(modulus$1)] + s;
    };
  }
  return s;
}

function caml_int64_format(fmt, x) {
  if (fmt === "%d") {
    return Caml_int64.to_string(x);
  }
  var f = parse_format(fmt);
  var x$1 = f.signedconv && Caml_int64.lt(x, Caml_int64.zero) ? (f.sign = -1, Caml_int64.neg(x)) : x;
  var match = f.base;
  var s;
  switch (match) {
    case /* Oct */0 :
        s = oct_of_int64(x$1);
        break;
    case /* Hex */1 :
        s = Caml_int64.to_hex(x$1);
        break;
    case /* Dec */2 :
        s = dec_of_pos_int64(x$1);
        break;
    
  }
  var fill_s;
  if (f.prec >= 0) {
    f.filter = " ";
    var n = f.prec - s.length | 0;
    fill_s = n > 0 ? "0".repeat(n) + s : s;
  } else {
    fill_s = s;
  }
  return finish_formatting(f, fill_s);
}

function caml_format_float(fmt, x) {
  var f = parse_format(fmt);
  var prec = f.prec < 0 ? 6 : f.prec;
  var x$1 = x < 0 ? (f.sign = -1, -x) : x;
  var s = "";
  if (isNaN(x$1)) {
    s = "nan";
    f.filter = " ";
  } else if (isFinite(x$1)) {
    var match = f.conv;
    switch (match) {
      case "e" :
          s = x$1.toExponential(prec);
          var i = s.length;
          if (s[i - 3 | 0] === "e") {
            s = s.slice(0, i - 1 | 0) + ("0" + s.slice(i - 1 | 0));
          }
          break;
      case "f" :
          s = x$1.toFixed(prec);
          break;
      case "g" :
          var prec$1 = prec !== 0 ? prec : 1;
          s = x$1.toExponential(prec$1 - 1 | 0);
          var j = s.indexOf("e");
          var exp = Number(s.slice(j + 1 | 0)) | 0;
          if (exp < -4 || x$1 >= 1e21 || x$1.toFixed().length > prec$1) {
            var i$1 = j - 1 | 0;
            while(s[i$1] === "0") {
              i$1 = i$1 - 1 | 0;
            };
            if (s[i$1] === ".") {
              i$1 = i$1 - 1 | 0;
            }
            s = s.slice(0, i$1 + 1 | 0) + s.slice(j);
            var i$2 = s.length;
            if (s[i$2 - 3 | 0] === "e") {
              s = s.slice(0, i$2 - 1 | 0) + ("0" + s.slice(i$2 - 1 | 0));
            }
            
          } else {
            var p = prec$1;
            if (exp < 0) {
              p = p - (exp + 1 | 0) | 0;
              s = x$1.toFixed(p);
            } else {
              while((function () {
                      s = x$1.toFixed(p);
                      return s.length > (prec$1 + 1 | 0);
                    })()) {
                p = p - 1 | 0;
              };
            }
            if (p !== 0) {
              var k = s.length - 1 | 0;
              while(s[k] === "0") {
                k = k - 1 | 0;
              };
              if (s[k] === ".") {
                k = k - 1 | 0;
              }
              s = s.slice(0, k + 1 | 0);
            }
            
          }
          break;
      default:
        
    }
  } else {
    s = "inf";
    f.filter = " ";
  }
  return finish_formatting(f, s);
}

var caml_hexstring_of_float = (function(x,prec,style){
  if (!isFinite(x)) {
    if (isNaN(x)) return "nan";
    return x > 0 ? "infinity":"-infinity";
  }
  var sign = (x==0 && 1/x == -Infinity)?1:(x>=0)?0:1;
  if(sign) x = -x;
  var exp = 0;
  if (x == 0) { }
  else if (x < 1) {
    while (x < 1 && exp > -1022)  { x *= 2; exp-- }
  } else {
    while (x >= 2) { x /= 2; exp++ }
  }
  var exp_sign = exp < 0 ? '' : '+';
  var sign_str = '';
  if (sign) sign_str = '-'
  else {
    switch(style){
    case 43 /* '+' */: sign_str = '+'; break;
    case 32 /* ' ' */: sign_str = ' '; break;
    default: break;
    }
  }
  if (prec >= 0 && prec < 13) {
    /* If a precision is given, and is small, round mantissa accordingly */
      var cst = Math.pow(2,prec * 4);
      x = Math.round(x * cst) / cst;
  }
  var x_str = x.toString(16);
  if(prec >= 0){
      var idx = x_str.indexOf('.');
    if(idx<0) {
      x_str += '.' +  '0'.repeat(prec);
    }
    else {
      var size = idx+1+prec;
      if(x_str.length < size)
        x_str += '0'.repeat(size - x_str.length);
      else
        x_str = x_str.substr(0,size);
    }
  }
  return  (sign_str + '0x' + x_str + 'p' + exp_sign + exp.toString(10));
});

var float_of_string = (function(s,exn){

    var res = +s;
    if ((s.length > 0) && (res === res))
        return res;
    s = s.replace(/_/g, "");
    res = +s;
    if (((s.length > 0) && (res === res)) || /^[+-]?nan$/i.test(s)) {
        return res;
    };
    var m = /^ *([+-]?)0x([0-9a-f]+)\.?([0-9a-f]*)p([+-]?[0-9]+)/i.exec(s);
    //            1        2             3           4
    if(m){
        var m3 = m[3].replace(/0+$/,'');
        var mantissa = parseInt(m[1] + m[2] + m3, 16);
        var exponent = (m[4]|0) - 4*m3.length;
        res = mantissa * Math.pow(2, exponent);
        return res;
    }
    if (/^\+?inf(inity)?$/i.test(s))
        return Infinity;
    if (/^-inf(inity)?$/i.test(s))
        return -Infinity;
    throw exn;
});

function caml_float_of_string(s) {
  return float_of_string(s, {
              RE_EXN_ID: "Failure",
              _1: "float_of_string"
            });
}

var caml_nativeint_format = caml_format_int;

var caml_int32_format = caml_format_int;

var caml_int32_of_string = caml_int_of_string;

var caml_nativeint_of_string = caml_int_of_string;

exports.caml_format_float = caml_format_float;
exports.caml_hexstring_of_float = caml_hexstring_of_float;
exports.caml_format_int = caml_format_int;
exports.caml_nativeint_format = caml_nativeint_format;
exports.caml_int32_format = caml_int32_format;
exports.caml_float_of_string = caml_float_of_string;
exports.caml_int64_format = caml_int64_format;
exports.caml_int_of_string = caml_int_of_string;
exports.caml_int32_of_string = caml_int32_of_string;
exports.caml_int64_of_string = caml_int64_of_string;
exports.caml_nativeint_of_string = caml_nativeint_of_string;
/* No side effect */

},{"./caml_int64.js":8}],8:[function(require,module,exports){
'use strict';


function mk(lo, hi) {
  return [
          hi,
          (lo >>> 0)
        ];
}

var min_int = [
  -2147483648,
  0
];

var max_int = [
  2147483647,
  4294967295
];

var one = [
  0,
  1
];

var zero = [
  0,
  0
];

var neg_one = [
  -1,
  4294967295
];

function neg_signed(x) {
  return (x & -2147483648) !== 0;
}

function non_neg_signed(x) {
  return (x & -2147483648) === 0;
}

function succ(param) {
  var x_lo = param[1];
  var x_hi = param[0];
  var lo = x_lo + 1 | 0;
  return [
          x_hi + (
            lo === 0 ? 1 : 0
          ) | 0,
          (lo >>> 0)
        ];
}

function neg(param) {
  var other_lo = (param[1] ^ -1) + 1 | 0;
  return [
          (param[0] ^ -1) + (
            other_lo === 0 ? 1 : 0
          ) | 0,
          (other_lo >>> 0)
        ];
}

function add_aux(param, y_lo, y_hi) {
  var x_lo = param[1];
  var lo = x_lo + y_lo | 0;
  var overflow = neg_signed(x_lo) && (neg_signed(y_lo) || non_neg_signed(lo)) || neg_signed(y_lo) && non_neg_signed(lo) ? 1 : 0;
  return [
          param[0] + y_hi + overflow | 0,
          (lo >>> 0)
        ];
}

function add(self, param) {
  return add_aux(self, param[1], param[0]);
}

function eq(x, y) {
  if (x[0] === y[0]) {
    return x[1] === y[1];
  } else {
    return false;
  }
}

function equal_null(x, y) {
  if (y !== null) {
    return eq(x, y);
  } else {
    return false;
  }
}

function equal_undefined(x, y) {
  if (y !== undefined) {
    return eq(x, y);
  } else {
    return false;
  }
}

function equal_nullable(x, y) {
  if (y == null) {
    return false;
  } else {
    return eq(x, y);
  }
}

function sub_aux(x, lo, hi) {
  var y_lo = ((lo ^ -1) + 1 >>> 0);
  var y_hi = (hi ^ -1) + (
    y_lo === 0 ? 1 : 0
  ) | 0;
  return add_aux(x, y_lo, y_hi);
}

function sub(self, param) {
  return sub_aux(self, param[1], param[0]);
}

function lsl_(x, numBits) {
  if (numBits === 0) {
    return x;
  }
  var lo = x[1];
  if (numBits >= 32) {
    return [
            (lo << (numBits - 32 | 0)),
            0
          ];
  } else {
    return [
            (lo >>> (32 - numBits | 0)) | (x[0] << numBits),
            ((lo << numBits) >>> 0)
          ];
  }
}

function lsr_(x, numBits) {
  if (numBits === 0) {
    return x;
  }
  var hi = x[0];
  var offset = numBits - 32 | 0;
  if (offset === 0) {
    return [
            0,
            (hi >>> 0)
          ];
  } else if (offset > 0) {
    return [
            0,
            (hi >>> offset)
          ];
  } else {
    return [
            (hi >>> numBits),
            (((hi << (-offset | 0)) | (x[1] >>> numBits)) >>> 0)
          ];
  }
}

function asr_(x, numBits) {
  if (numBits === 0) {
    return x;
  }
  var hi = x[0];
  if (numBits < 32) {
    return [
            (hi >> numBits),
            (((hi << (32 - numBits | 0)) | (x[1] >>> numBits)) >>> 0)
          ];
  } else {
    return [
            hi >= 0 ? 0 : -1,
            ((hi >> (numBits - 32 | 0)) >>> 0)
          ];
  }
}

function is_zero(param) {
  if (param[0] !== 0) {
    return false;
  } else {
    return param[1] === 0;
  }
}

function mul(_this, _other) {
  while(true) {
    var other = _other;
    var $$this = _this;
    var lo;
    var this_hi = $$this[0];
    var exit = 0;
    var exit$1 = 0;
    var exit$2 = 0;
    if (this_hi !== 0) {
      exit$2 = 4;
    } else {
      if ($$this[1] === 0) {
        return zero;
      }
      exit$2 = 4;
    }
    if (exit$2 === 4) {
      if (other[0] !== 0) {
        exit$1 = 3;
      } else {
        if (other[1] === 0) {
          return zero;
        }
        exit$1 = 3;
      }
    }
    if (exit$1 === 3) {
      if (this_hi !== -2147483648 || $$this[1] !== 0) {
        exit = 2;
      } else {
        lo = other[1];
      }
    }
    if (exit === 2) {
      var other_hi = other[0];
      var lo$1 = $$this[1];
      var exit$3 = 0;
      if (other_hi !== -2147483648 || other[1] !== 0) {
        exit$3 = 3;
      } else {
        lo = lo$1;
      }
      if (exit$3 === 3) {
        var other_lo = other[1];
        if (this_hi < 0) {
          if (other_hi >= 0) {
            return neg(mul(neg($$this), other));
          }
          _other = neg(other);
          _this = neg($$this);
          continue ;
        }
        if (other_hi < 0) {
          return neg(mul($$this, neg(other)));
        }
        var a48 = (this_hi >>> 16);
        var a32 = this_hi & 65535;
        var a16 = (lo$1 >>> 16);
        var a00 = lo$1 & 65535;
        var b48 = (other_hi >>> 16);
        var b32 = other_hi & 65535;
        var b16 = (other_lo >>> 16);
        var b00 = other_lo & 65535;
        var c48 = 0;
        var c32 = 0;
        var c16 = 0;
        var c00 = a00 * b00;
        c16 = (c00 >>> 16) + a16 * b00;
        c32 = (c16 >>> 16);
        c16 = (c16 & 65535) + a00 * b16;
        c32 = c32 + (c16 >>> 16) + a32 * b00;
        c48 = (c32 >>> 16);
        c32 = (c32 & 65535) + a16 * b16;
        c48 = c48 + (c32 >>> 16);
        c32 = (c32 & 65535) + a00 * b32;
        c48 = c48 + (c32 >>> 16);
        c32 = c32 & 65535;
        c48 = c48 + (a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48) & 65535;
        return [
                c32 | (c48 << 16),
                ((c00 & 65535 | ((c16 & 65535) << 16)) >>> 0)
              ];
      }
      
    }
    if ((lo & 1) === 0) {
      return zero;
    } else {
      return min_int;
    }
  };
}

function xor(param, param$1) {
  return [
          param[0] ^ param$1[0],
          ((param[1] ^ param$1[1]) >>> 0)
        ];
}

function or_(param, param$1) {
  return [
          param[0] | param$1[0],
          ((param[1] | param$1[1]) >>> 0)
        ];
}

function and_(param, param$1) {
  return [
          param[0] & param$1[0],
          ((param[1] & param$1[1]) >>> 0)
        ];
}

function ge(param, param$1) {
  var other_hi = param$1[0];
  var hi = param[0];
  if (hi > other_hi) {
    return true;
  } else if (hi < other_hi) {
    return false;
  } else {
    return param[1] >= param$1[1];
  }
}

function neq(x, y) {
  return !eq(x, y);
}

function lt(x, y) {
  return !ge(x, y);
}

function gt(x, y) {
  if (x[0] > y[0]) {
    return true;
  } else if (x[0] < y[0]) {
    return false;
  } else {
    return x[1] > y[1];
  }
}

function le(x, y) {
  return !gt(x, y);
}

function min(x, y) {
  if (ge(x, y)) {
    return y;
  } else {
    return x;
  }
}

function max(x, y) {
  if (gt(x, y)) {
    return x;
  } else {
    return y;
  }
}

function to_float(param) {
  return param[0] * 0x100000000 + param[1];
}

function of_float(x) {
  if (isNaN(x) || !isFinite(x)) {
    return zero;
  }
  if (x <= -9.22337203685477581e+18) {
    return min_int;
  }
  if (x + 1 >= 9.22337203685477581e+18) {
    return max_int;
  }
  if (x < 0) {
    return neg(of_float(-x));
  }
  var hi = x / 4294967296 | 0;
  var lo = x % 4294967296 | 0;
  return [
          hi,
          (lo >>> 0)
        ];
}

function isSafeInteger(param) {
  var hi = param[0];
  var top11Bits = (hi >> 21);
  if (top11Bits === 0) {
    return true;
  } else if (top11Bits === -1) {
    return !(param[1] === 0 && hi === -2097152);
  } else {
    return false;
  }
}

function to_string(self) {
  if (isSafeInteger(self)) {
    return String(to_float(self));
  }
  if (self[0] < 0) {
    if (eq(self, min_int)) {
      return "-9223372036854775808";
    } else {
      return "-" + to_string(neg(self));
    }
  }
  var approx_div1 = of_float(Math.floor(to_float(self) / 10));
  var lo = approx_div1[1];
  var hi = approx_div1[0];
  var match = sub_aux(sub_aux(self, (lo << 3), (lo >>> 29) | (hi << 3)), (lo << 1), (lo >>> 31) | (hi << 1));
  var rem_lo = match[1];
  var rem_hi = match[0];
  if (rem_lo === 0 && rem_hi === 0) {
    return to_string(approx_div1) + "0";
  }
  if (rem_hi < 0) {
    var rem_lo$1 = ((rem_lo ^ -1) + 1 >>> 0);
    var delta = Math.ceil(rem_lo$1 / 10);
    var remainder = 10 * delta - rem_lo$1;
    return to_string(sub_aux(approx_div1, delta | 0, 0)) + String(remainder | 0);
  }
  var delta$1 = Math.floor(rem_lo / 10);
  var remainder$1 = rem_lo - 10 * delta$1;
  return to_string(add_aux(approx_div1, delta$1 | 0, 0)) + String(remainder$1 | 0);
}

function div(_self, _other) {
  while(true) {
    var other = _other;
    var self = _self;
    var self_hi = self[0];
    var exit = 0;
    var exit$1 = 0;
    if (other[0] !== 0 || other[1] !== 0) {
      exit$1 = 2;
    } else {
      throw {
            RE_EXN_ID: "Division_by_zero",
            Error: new Error()
          };
    }
    if (exit$1 === 2) {
      if (self_hi !== -2147483648) {
        if (self_hi !== 0) {
          exit = 1;
        } else {
          if (self[1] === 0) {
            return zero;
          }
          exit = 1;
        }
      } else if (self[1] !== 0) {
        exit = 1;
      } else {
        if (eq(other, one) || eq(other, neg_one)) {
          return self;
        }
        if (eq(other, min_int)) {
          return one;
        }
        var half_this = asr_(self, 1);
        var approx = lsl_(div(half_this, other), 1);
        var exit$2 = 0;
        if (approx[0] !== 0) {
          exit$2 = 3;
        } else {
          if (approx[1] === 0) {
            if (other[0] < 0) {
              return one;
            } else {
              return neg(one);
            }
          }
          exit$2 = 3;
        }
        if (exit$2 === 3) {
          var rem = sub(self, mul(other, approx));
          return add(approx, div(rem, other));
        }
        
      }
    }
    if (exit === 1) {
      var other_hi = other[0];
      var exit$3 = 0;
      if (other_hi !== -2147483648) {
        exit$3 = 2;
      } else {
        if (other[1] === 0) {
          return zero;
        }
        exit$3 = 2;
      }
      if (exit$3 === 2) {
        if (self_hi < 0) {
          if (other_hi >= 0) {
            return neg(div(neg(self), other));
          }
          _other = neg(other);
          _self = neg(self);
          continue ;
        }
        if (other_hi < 0) {
          return neg(div(self, neg(other)));
        }
        var res = zero;
        var rem$1 = self;
        while(ge(rem$1, other)) {
          var b = Math.floor(to_float(rem$1) / to_float(other));
          var approx$1 = 1 > b ? 1 : b;
          var log2 = Math.ceil(Math.log(approx$1) / Math.LN2);
          var delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48);
          var approxRes = of_float(approx$1);
          var approxRem = mul(approxRes, other);
          while(approxRem[0] < 0 || gt(approxRem, rem$1)) {
            approx$1 = approx$1 - delta;
            approxRes = of_float(approx$1);
            approxRem = mul(approxRes, other);
          };
          if (is_zero(approxRes)) {
            approxRes = one;
          }
          res = add(res, approxRes);
          rem$1 = sub(rem$1, approxRem);
        };
        return res;
      }
      
    }
    
  };
}

function mod_(self, other) {
  return sub(self, mul(div(self, other), other));
}

function div_mod(self, other) {
  var quotient = div(self, other);
  return [
          quotient,
          sub(self, mul(quotient, other))
        ];
}

function compare(self, other) {
  var y = other[0];
  var x = self[0];
  var v = x < y ? -1 : (
      x === y ? 0 : 1
    );
  if (v !== 0) {
    return v;
  }
  var y$1 = other[1];
  var x$1 = self[1];
  if (x$1 < y$1) {
    return -1;
  } else if (x$1 === y$1) {
    return 0;
  } else {
    return 1;
  }
}

function of_int32(lo) {
  return [
          lo < 0 ? -1 : 0,
          (lo >>> 0)
        ];
}

function to_int32(x) {
  return x[1] | 0;
}

function to_hex(x) {
  var x_lo = x[1];
  var x_hi = x[0];
  var aux = function (v) {
    return (v >>> 0).toString(16);
  };
  if (x_hi === 0 && x_lo === 0) {
    return "0";
  }
  if (x_lo === 0) {
    return aux(x_hi) + "00000000";
  }
  if (x_hi === 0) {
    return aux(x_lo);
  }
  var lo = aux(x_lo);
  var pad = 8 - lo.length | 0;
  if (pad <= 0) {
    return aux(x_hi) + lo;
  } else {
    return aux(x_hi) + ("0".repeat(pad) + lo);
  }
}

function discard_sign(x) {
  return [
          2147483647 & x[0],
          x[1]
        ];
}

function float_of_bits(x) {
  return (function(lo,hi){ return (new Float64Array(new Int32Array([lo,hi]).buffer))[0]})(x[1], x[0]);
}

function bits_of_float(x) {
  var match = (function(x){return new Int32Array(new Float64Array([x]).buffer)})(x);
  return [
          match[1],
          (match[0] >>> 0)
        ];
}

exports.mk = mk;
exports.succ = succ;
exports.min_int = min_int;
exports.max_int = max_int;
exports.one = one;
exports.zero = zero;
exports.neg_one = neg_one;
exports.of_int32 = of_int32;
exports.to_int32 = to_int32;
exports.add = add;
exports.neg = neg;
exports.sub = sub;
exports.lsl_ = lsl_;
exports.lsr_ = lsr_;
exports.asr_ = asr_;
exports.is_zero = is_zero;
exports.mul = mul;
exports.xor = xor;
exports.or_ = or_;
exports.and_ = and_;
exports.ge = ge;
exports.eq = eq;
exports.neq = neq;
exports.lt = lt;
exports.gt = gt;
exports.le = le;
exports.equal_null = equal_null;
exports.equal_undefined = equal_undefined;
exports.equal_nullable = equal_nullable;
exports.min = min;
exports.max = max;
exports.to_float = to_float;
exports.of_float = of_float;
exports.div = div;
exports.mod_ = mod_;
exports.compare = compare;
exports.float_of_bits = float_of_bits;
exports.bits_of_float = bits_of_float;
exports.div_mod = div_mod;
exports.to_hex = to_hex;
exports.discard_sign = discard_sign;
exports.to_string = to_string;
/* No side effect */

},{}],9:[function(require,module,exports){
(function (process){(function (){
'use strict';


var stdout = {
  buffer: "",
  output: (function (param, s) {
      var v = s.length - 1 | 0;
      if (((typeof process !== "undefined") && process.stdout && process.stdout.write)) {
        return process.stdout.write(s);
      } else {
        if (s[v] === "\n") {
          console.log(s.slice(0, v));
        } else {
          console.log(s);
        }
        return ;
      }
    })
};

var stderr = {
  buffer: "",
  output: (function (param, s) {
      var v = s.length - 1 | 0;
      if (s[v] === "\n") {
        console.log(s.slice(0, v));
      } else {
        console.log(s);
      }
      
    })
};

function caml_ml_flush(oc) {
  if (oc.buffer !== "") {
    oc.output(oc, oc.buffer);
    oc.buffer = "";
    return ;
  }
  
}

function caml_ml_output(oc, str, offset, len) {
  var str$1 = offset === 0 && len === str.length ? str : str.slice(offset, len);
  if (((typeof process !== "undefined") && process.stdout && process.stdout.write) && oc === stdout) {
    return process.stdout.write(str$1);
  }
  var id = str$1.lastIndexOf("\n");
  if (id < 0) {
    oc.buffer = oc.buffer + str$1;
  } else {
    oc.buffer = oc.buffer + str$1.slice(0, id + 1 | 0);
    caml_ml_flush(oc);
    oc.buffer = oc.buffer + str$1.slice(id + 1 | 0);
  }
  
}

function caml_ml_output_char(oc, $$char) {
  return caml_ml_output(oc, String.fromCharCode($$char), 0, 1);
}

function caml_ml_out_channels_list(param) {
  return {
          hd: stdout,
          tl: {
            hd: stderr,
            tl: /* [] */0
          }
        };
}

var stdin;

exports.stdin = stdin;
exports.stdout = stdout;
exports.stderr = stderr;
exports.caml_ml_flush = caml_ml_flush;
exports.caml_ml_output = caml_ml_output;
exports.caml_ml_output_char = caml_ml_output_char;
exports.caml_ml_out_channels_list = caml_ml_out_channels_list;
/* No side effect */

}).call(this)}).call(this,require('_process'))
},{"_process":24}],10:[function(require,module,exports){
'use strict';

var Caml_option = require("./caml_option.js");
var Caml_exceptions = require("./caml_exceptions.js");

var $$Error = /* @__PURE__ */Caml_exceptions.create("Caml_js_exceptions.Error");

function internalToOCamlException(e) {
  if (Caml_exceptions.caml_is_extension(e)) {
    return e;
  } else {
    return {
            RE_EXN_ID: $$Error,
            _1: e
          };
  }
}

function caml_as_js_exn(exn) {
  if (exn.RE_EXN_ID === $$Error) {
    return Caml_option.some(exn._1);
  }
  
}

exports.$$Error = $$Error;
exports.internalToOCamlException = internalToOCamlException;
exports.caml_as_js_exn = caml_as_js_exn;
/* No side effect */

},{"./caml_exceptions.js":5,"./caml_option.js":12}],11:[function(require,module,exports){
'use strict';

var Caml_primitive = require("./caml_primitive.js");

var for_in = (function(o,foo){
        for (var x in o) { foo(x) }});

var caml_obj_dup = (function(x){
  if(Array.isArray(x)){
    var len = x.length  
    var v = new Array(len)
    for(var i = 0 ; i < len ; ++i){
      v[i] = x[i]
    }
    if(x.TAG !== undefined){
      v.TAG = x.TAG // TODO this can be removed eventually
    }  
    return v 
  } 
  return Object.assign({},x)    
});

var update_dummy = (function(x,y){
  var k  
  if(Array.isArray(y)){
    for(k = 0; k < y.length ; ++k){
      x[k] = y[k]
    }
    if(y.TAG !== undefined){
      x.TAG = y.TAG
    }
  } else {
    for (var k in y){
      x[k] = y[k]
    }
  }
});

function caml_compare(a, b) {
  if (a === b) {
    return 0;
  }
  var a_type = typeof a;
  var b_type = typeof b;
  switch (a_type) {
    case "boolean" :
        if (b_type === "boolean") {
          return Caml_primitive.caml_bool_compare(a, b);
        }
        break;
    case "function" :
        if (b_type === "function") {
          throw {
                RE_EXN_ID: "Invalid_argument",
                _1: "compare: functional value",
                Error: new Error()
              };
        }
        break;
    case "number" :
        if (b_type === "number") {
          return Caml_primitive.caml_int_compare(a, b);
        }
        break;
    case "string" :
        if (b_type === "string") {
          return Caml_primitive.caml_string_compare(a, b);
        } else {
          return 1;
        }
    case "undefined" :
        return -1;
    default:
      
  }
  switch (b_type) {
    case "string" :
        return -1;
    case "undefined" :
        return 1;
    default:
      if (a_type === "boolean") {
        return 1;
      }
      if (b_type === "boolean") {
        return -1;
      }
      if (a_type === "function") {
        return 1;
      }
      if (b_type === "function") {
        return -1;
      }
      if (a_type === "number") {
        if (b === null || b.BS_PRIVATE_NESTED_SOME_NONE !== undefined) {
          return 1;
        } else {
          return -1;
        }
      }
      if (b_type === "number") {
        if (a === null || a.BS_PRIVATE_NESTED_SOME_NONE !== undefined) {
          return -1;
        } else {
          return 1;
        }
      }
      if (a === null) {
        if (b.BS_PRIVATE_NESTED_SOME_NONE !== undefined) {
          return 1;
        } else {
          return -1;
        }
      }
      if (b === null) {
        if (a.BS_PRIVATE_NESTED_SOME_NONE !== undefined) {
          return -1;
        } else {
          return 1;
        }
      }
      if (a.BS_PRIVATE_NESTED_SOME_NONE !== undefined) {
        if (b.BS_PRIVATE_NESTED_SOME_NONE !== undefined) {
          return aux_obj_compare(a, b);
        } else {
          return -1;
        }
      }
      var tag_a = a.TAG | 0;
      var tag_b = b.TAG | 0;
      if (tag_a === 248) {
        return Caml_primitive.caml_int_compare(a[1], b[1]);
      }
      if (tag_a === 251) {
        throw {
              RE_EXN_ID: "Invalid_argument",
              _1: "equal: abstract value",
              Error: new Error()
            };
      }
      if (tag_a !== tag_b) {
        if (tag_a < tag_b) {
          return -1;
        } else {
          return 1;
        }
      }
      var len_a = a.length | 0;
      var len_b = b.length | 0;
      if (len_a === len_b) {
        if (Array.isArray(a)) {
          var _i = 0;
          while(true) {
            var i = _i;
            if (i === len_a) {
              return 0;
            }
            var res = caml_compare(a[i], b[i]);
            if (res !== 0) {
              return res;
            }
            _i = i + 1 | 0;
            continue ;
          };
        } else if ((a instanceof Date && b instanceof Date)) {
          return (a - b);
        } else {
          return aux_obj_compare(a, b);
        }
      } else if (len_a < len_b) {
        var _i$1 = 0;
        while(true) {
          var i$1 = _i$1;
          if (i$1 === len_a) {
            return -1;
          }
          var res$1 = caml_compare(a[i$1], b[i$1]);
          if (res$1 !== 0) {
            return res$1;
          }
          _i$1 = i$1 + 1 | 0;
          continue ;
        };
      } else {
        var _i$2 = 0;
        while(true) {
          var i$2 = _i$2;
          if (i$2 === len_b) {
            return 1;
          }
          var res$2 = caml_compare(a[i$2], b[i$2]);
          if (res$2 !== 0) {
            return res$2;
          }
          _i$2 = i$2 + 1 | 0;
          continue ;
        };
      }
  }
}

function aux_obj_compare(a, b) {
  var min_key_lhs = {
    contents: undefined
  };
  var min_key_rhs = {
    contents: undefined
  };
  var do_key = function (param, key) {
    var min_key = param[2];
    var b = param[1];
    if (!(!b.hasOwnProperty(key) || caml_compare(param[0][key], b[key]) > 0)) {
      return ;
    }
    var mk = min_key.contents;
    if (mk !== undefined && key >= mk) {
      return ;
    } else {
      min_key.contents = key;
      return ;
    }
  };
  var partial_arg = [
    a,
    b,
    min_key_rhs
  ];
  var do_key_a = function (param) {
    return do_key(partial_arg, param);
  };
  var partial_arg$1 = [
    b,
    a,
    min_key_lhs
  ];
  var do_key_b = function (param) {
    return do_key(partial_arg$1, param);
  };
  for_in(a, do_key_a);
  for_in(b, do_key_b);
  var match = min_key_lhs.contents;
  var match$1 = min_key_rhs.contents;
  if (match !== undefined) {
    if (match$1 !== undefined) {
      return Caml_primitive.caml_string_compare(match, match$1);
    } else {
      return -1;
    }
  } else if (match$1 !== undefined) {
    return 1;
  } else {
    return 0;
  }
}

function caml_equal(a, b) {
  if (a === b) {
    return true;
  }
  var a_type = typeof a;
  if (a_type === "string" || a_type === "number" || a_type === "boolean" || a_type === "undefined" || a === null) {
    return false;
  }
  var b_type = typeof b;
  if (a_type === "function" || b_type === "function") {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "equal: functional value",
          Error: new Error()
        };
  }
  if (b_type === "number" || b_type === "undefined" || b === null) {
    return false;
  }
  var tag_a = a.TAG | 0;
  var tag_b = b.TAG | 0;
  if (tag_a === 248) {
    return a[1] === b[1];
  }
  if (tag_a === 251) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "equal: abstract value",
          Error: new Error()
        };
  }
  if (tag_a !== tag_b) {
    return false;
  }
  var len_a = a.length | 0;
  var len_b = b.length | 0;
  if (len_a === len_b) {
    if (Array.isArray(a)) {
      var _i = 0;
      while(true) {
        var i = _i;
        if (i === len_a) {
          return true;
        }
        if (!caml_equal(a[i], b[i])) {
          return false;
        }
        _i = i + 1 | 0;
        continue ;
      };
    } else if ((a instanceof Date && b instanceof Date)) {
      return !(a > b || a < b);
    } else {
      var result = {
        contents: true
      };
      var do_key_a = function (key) {
        if (!b.hasOwnProperty(key)) {
          result.contents = false;
          return ;
        }
        
      };
      var do_key_b = function (key) {
        if (!a.hasOwnProperty(key) || !caml_equal(b[key], a[key])) {
          result.contents = false;
          return ;
        }
        
      };
      for_in(a, do_key_a);
      if (result.contents) {
        for_in(b, do_key_b);
      }
      return result.contents;
    }
  } else {
    return false;
  }
}

function caml_equal_null(x, y) {
  if (y !== null) {
    return caml_equal(x, y);
  } else {
    return x === y;
  }
}

function caml_equal_undefined(x, y) {
  if (y !== undefined) {
    return caml_equal(x, y);
  } else {
    return x === y;
  }
}

function caml_equal_nullable(x, y) {
  if (y == null) {
    return x === y;
  } else {
    return caml_equal(x, y);
  }
}

function caml_notequal(a, b) {
  return !caml_equal(a, b);
}

function caml_greaterequal(a, b) {
  return caml_compare(a, b) >= 0;
}

function caml_greaterthan(a, b) {
  return caml_compare(a, b) > 0;
}

function caml_lessequal(a, b) {
  return caml_compare(a, b) <= 0;
}

function caml_lessthan(a, b) {
  return caml_compare(a, b) < 0;
}

function caml_min(x, y) {
  if (caml_compare(x, y) <= 0) {
    return x;
  } else {
    return y;
  }
}

function caml_max(x, y) {
  if (caml_compare(x, y) >= 0) {
    return x;
  } else {
    return y;
  }
}

exports.caml_obj_dup = caml_obj_dup;
exports.update_dummy = update_dummy;
exports.caml_compare = caml_compare;
exports.caml_equal = caml_equal;
exports.caml_equal_null = caml_equal_null;
exports.caml_equal_undefined = caml_equal_undefined;
exports.caml_equal_nullable = caml_equal_nullable;
exports.caml_notequal = caml_notequal;
exports.caml_greaterequal = caml_greaterequal;
exports.caml_greaterthan = caml_greaterthan;
exports.caml_lessthan = caml_lessthan;
exports.caml_lessequal = caml_lessequal;
exports.caml_min = caml_min;
exports.caml_max = caml_max;
/* No side effect */

},{"./caml_primitive.js":13}],12:[function(require,module,exports){
'use strict';


function isNested(x) {
  return x.BS_PRIVATE_NESTED_SOME_NONE !== undefined;
}

function some(x) {
  if (x === undefined) {
    return {
            BS_PRIVATE_NESTED_SOME_NONE: 0
          };
  } else if (x !== null && x.BS_PRIVATE_NESTED_SOME_NONE !== undefined) {
    return {
            BS_PRIVATE_NESTED_SOME_NONE: x.BS_PRIVATE_NESTED_SOME_NONE + 1 | 0
          };
  } else {
    return x;
  }
}

function nullable_to_opt(x) {
  if (x == null) {
    return ;
  } else {
    return some(x);
  }
}

function undefined_to_opt(x) {
  if (x === undefined) {
    return ;
  } else {
    return some(x);
  }
}

function null_to_opt(x) {
  if (x === null) {
    return ;
  } else {
    return some(x);
  }
}

function valFromOption(x) {
  if (!(x !== null && x.BS_PRIVATE_NESTED_SOME_NONE !== undefined)) {
    return x;
  }
  var depth = x.BS_PRIVATE_NESTED_SOME_NONE;
  if (depth === 0) {
    return ;
  } else {
    return {
            BS_PRIVATE_NESTED_SOME_NONE: depth - 1 | 0
          };
  }
}

function option_get(x) {
  if (x === undefined) {
    return ;
  } else {
    return valFromOption(x);
  }
}

function option_unwrap(x) {
  if (x !== undefined) {
    return x.VAL;
  } else {
    return x;
  }
}

exports.nullable_to_opt = nullable_to_opt;
exports.undefined_to_opt = undefined_to_opt;
exports.null_to_opt = null_to_opt;
exports.valFromOption = valFromOption;
exports.some = some;
exports.isNested = isNested;
exports.option_get = option_get;
exports.option_unwrap = option_unwrap;
/* No side effect */

},{}],13:[function(require,module,exports){
'use strict';


function caml_int_compare(x, y) {
  if (x < y) {
    return -1;
  } else if (x === y) {
    return 0;
  } else {
    return 1;
  }
}

function caml_bool_compare(x, y) {
  if (x) {
    if (y) {
      return 0;
    } else {
      return 1;
    }
  } else if (y) {
    return -1;
  } else {
    return 0;
  }
}

function caml_float_compare(x, y) {
  if (x === y) {
    return 0;
  } else if (x < y) {
    return -1;
  } else if (x > y || x === x) {
    return 1;
  } else if (y === y) {
    return -1;
  } else {
    return 0;
  }
}

function caml_string_compare(s1, s2) {
  if (s1 === s2) {
    return 0;
  } else if (s1 < s2) {
    return -1;
  } else {
    return 1;
  }
}

function caml_bool_min(x, y) {
  if (x) {
    return y;
  } else {
    return x;
  }
}

function caml_int_min(x, y) {
  if (x < y) {
    return x;
  } else {
    return y;
  }
}

function caml_float_min(x, y) {
  if (x < y) {
    return x;
  } else {
    return y;
  }
}

function caml_string_min(x, y) {
  if (x < y) {
    return x;
  } else {
    return y;
  }
}

function caml_int32_min(x, y) {
  if (x < y) {
    return x;
  } else {
    return y;
  }
}

function caml_bool_max(x, y) {
  if (x) {
    return x;
  } else {
    return y;
  }
}

function caml_int_max(x, y) {
  if (x > y) {
    return x;
  } else {
    return y;
  }
}

function caml_float_max(x, y) {
  if (x > y) {
    return x;
  } else {
    return y;
  }
}

function caml_string_max(x, y) {
  if (x > y) {
    return x;
  } else {
    return y;
  }
}

function caml_int32_max(x, y) {
  if (x > y) {
    return x;
  } else {
    return y;
  }
}

var caml_int32_compare = caml_int_compare;

exports.caml_int_compare = caml_int_compare;
exports.caml_bool_compare = caml_bool_compare;
exports.caml_float_compare = caml_float_compare;
exports.caml_string_compare = caml_string_compare;
exports.caml_int32_compare = caml_int32_compare;
exports.caml_bool_min = caml_bool_min;
exports.caml_int_min = caml_int_min;
exports.caml_float_min = caml_float_min;
exports.caml_string_min = caml_string_min;
exports.caml_int32_min = caml_int32_min;
exports.caml_bool_max = caml_bool_max;
exports.caml_int_max = caml_int_max;
exports.caml_float_max = caml_float_max;
exports.caml_string_max = caml_string_max;
exports.caml_int32_max = caml_int32_max;
/* No side effect */

},{}],14:[function(require,module,exports){
'use strict';


function get(s, i) {
  if (i >= s.length || i < 0) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "index out of bounds",
          Error: new Error()
        };
  }
  return s.charCodeAt(i);
}

function make(n, ch) {
  return String.fromCharCode(ch).repeat(n);
}

exports.get = get;
exports.make = make;
/* No side effect */

},{}],15:[function(require,module,exports){
(function (process){(function (){
'use strict';


function caml_sys_getenv(s) {
  if (typeof process === "undefined" || process.env === undefined) {
    throw {
          RE_EXN_ID: "Not_found",
          Error: new Error()
        };
  }
  var x = process.env[s];
  if (x !== undefined) {
    return x;
  }
  throw {
        RE_EXN_ID: "Not_found",
        Error: new Error()
      };
}

var os_type = (function(_){
  if(typeof process !== 'undefined' && process.platform === 'win32'){
        return "Win32"    
  }
  else {
    return "Unix"
  }
});

function caml_sys_time(param) {
  if (typeof process === "undefined" || process.uptime === undefined) {
    return -1;
  } else {
    return process.uptime();
  }
}

function caml_sys_system_command(_cmd) {
  return 127;
}

var caml_sys_getcwd = (function(param){
    if (typeof process === "undefined" || process.cwd === undefined){
      return "/"  
    }
    return process.cwd()
  });

function caml_sys_get_argv(param) {
  if (typeof process === "undefined") {
    return [
            "",
            [""]
          ];
  }
  var argv = process.argv;
  if (argv == null) {
    return [
            "",
            [""]
          ];
  } else {
    return [
            argv[0],
            argv
          ];
  }
}

function caml_sys_exit(exit_code) {
  if (typeof process !== "undefined") {
    return process.exit(exit_code);
  }
  
}

function caml_sys_is_directory(_s) {
  throw {
        RE_EXN_ID: "Failure",
        _1: "caml_sys_is_directory not implemented",
        Error: new Error()
      };
}

function caml_sys_file_exists(_s) {
  throw {
        RE_EXN_ID: "Failure",
        _1: "caml_sys_file_exists not implemented",
        Error: new Error()
      };
}

exports.caml_sys_getenv = caml_sys_getenv;
exports.caml_sys_time = caml_sys_time;
exports.os_type = os_type;
exports.caml_sys_system_command = caml_sys_system_command;
exports.caml_sys_getcwd = caml_sys_getcwd;
exports.caml_sys_get_argv = caml_sys_get_argv;
exports.caml_sys_exit = caml_sys_exit;
exports.caml_sys_is_directory = caml_sys_is_directory;
exports.caml_sys_file_exists = caml_sys_file_exists;
/* No side effect */

}).call(this)}).call(this,require('_process'))
},{"_process":24}],16:[function(require,module,exports){
'use strict';

var Char = require("./char.js");
var Bytes = require("./bytes.js");
var Curry = require("./curry.js");
var $$Buffer = require("./buffer.js");
var $$String = require("./string.js");
var Caml_io = require("./caml_io.js");
var Caml_obj = require("./caml_obj.js");
var Caml_bytes = require("./caml_bytes.js");
var Pervasives = require("./pervasives.js");
var Caml_format = require("./caml_format.js");
var Caml_string = require("./caml_string.js");
var Caml_primitive = require("./caml_primitive.js");
var Caml_exceptions = require("./caml_exceptions.js");
var Caml_js_exceptions = require("./caml_js_exceptions.js");
var CamlinternalFormatBasics = require("./camlinternalFormatBasics.js");

function create_char_set(param) {
  return Bytes.make(32, /* '\000' */0);
}

function add_in_char_set(char_set, c) {
  var str_ind = (c >>> 3);
  var mask = (1 << (c & 7));
  return Caml_bytes.set(char_set, str_ind, Pervasives.char_of_int(Caml_bytes.get(char_set, str_ind) | mask));
}

var freeze_char_set = Bytes.to_string;

function rev_char_set(char_set) {
  var char_set$prime = Bytes.make(32, /* '\000' */0);
  for(var i = 0; i <= 31; ++i){
    Caml_bytes.set(char_set$prime, i, Pervasives.char_of_int(Caml_string.get(char_set, i) ^ 255));
  }
  return Caml_bytes.bytes_to_string(char_set$prime);
}

function is_in_char_set(char_set, c) {
  var str_ind = (c >>> 3);
  var mask = (1 << (c & 7));
  return (Caml_string.get(char_set, str_ind) & mask) !== 0;
}

function pad_of_pad_opt(pad_opt) {
  if (pad_opt !== undefined) {
    return {
            TAG: /* Lit_padding */0,
            _0: /* Right */1,
            _1: pad_opt
          };
  } else {
    return /* No_padding */0;
  }
}

function prec_of_prec_opt(prec_opt) {
  if (prec_opt !== undefined) {
    return /* Lit_precision */{
            _0: prec_opt
          };
  } else {
    return /* No_precision */0;
  }
}

function param_format_of_ignored_format(ign, fmt) {
  if (typeof ign === "number") {
    switch (ign) {
      case /* Ignored_char */0 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* Char */0,
                    _0: fmt
                  }
                };
      case /* Ignored_caml_char */1 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* Caml_char */1,
                    _0: fmt
                  }
                };
      case /* Ignored_reader */2 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* Reader */19,
                    _0: fmt
                  }
                };
      case /* Ignored_scan_next_char */3 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* Scan_next_char */22,
                    _0: fmt
                  }
                };
      
    }
  } else {
    switch (ign.TAG | 0) {
      case /* Ignored_string */0 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* String */2,
                    _0: pad_of_pad_opt(ign._0),
                    _1: fmt
                  }
                };
      case /* Ignored_caml_string */1 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* Caml_string */3,
                    _0: pad_of_pad_opt(ign._0),
                    _1: fmt
                  }
                };
      case /* Ignored_int */2 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* Int */4,
                    _0: ign._0,
                    _1: pad_of_pad_opt(ign._1),
                    _2: /* No_precision */0,
                    _3: fmt
                  }
                };
      case /* Ignored_int32 */3 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* Int32 */5,
                    _0: ign._0,
                    _1: pad_of_pad_opt(ign._1),
                    _2: /* No_precision */0,
                    _3: fmt
                  }
                };
      case /* Ignored_nativeint */4 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* Nativeint */6,
                    _0: ign._0,
                    _1: pad_of_pad_opt(ign._1),
                    _2: /* No_precision */0,
                    _3: fmt
                  }
                };
      case /* Ignored_int64 */5 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* Int64 */7,
                    _0: ign._0,
                    _1: pad_of_pad_opt(ign._1),
                    _2: /* No_precision */0,
                    _3: fmt
                  }
                };
      case /* Ignored_float */6 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* Float */8,
                    _0: /* Float_f */0,
                    _1: pad_of_pad_opt(ign._0),
                    _2: prec_of_prec_opt(ign._1),
                    _3: fmt
                  }
                };
      case /* Ignored_bool */7 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* Bool */9,
                    _0: pad_of_pad_opt(ign._0),
                    _1: fmt
                  }
                };
      case /* Ignored_format_arg */8 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* Format_arg */13,
                    _0: ign._0,
                    _1: ign._1,
                    _2: fmt
                  }
                };
      case /* Ignored_format_subst */9 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* Format_subst */14,
                    _0: ign._0,
                    _1: ign._1,
                    _2: fmt
                  }
                };
      case /* Ignored_scan_char_set */10 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* Scan_char_set */20,
                    _0: ign._0,
                    _1: ign._1,
                    _2: fmt
                  }
                };
      case /* Ignored_scan_get_counter */11 :
          return /* Param_format_EBB */{
                  _0: {
                    TAG: /* Scan_get_counter */21,
                    _0: ign._0,
                    _1: fmt
                  }
                };
      
    }
  }
}

function buffer_check_size(buf, overhead) {
  var len = buf.bytes.length;
  var min_len = buf.ind + overhead | 0;
  if (min_len <= len) {
    return ;
  }
  var new_len = Caml_primitive.caml_int_max((len << 1), min_len);
  var new_str = Caml_bytes.caml_create_bytes(new_len);
  Bytes.blit(buf.bytes, 0, new_str, 0, len);
  buf.bytes = new_str;
  
}

function buffer_add_char(buf, c) {
  buffer_check_size(buf, 1);
  Caml_bytes.set(buf.bytes, buf.ind, c);
  buf.ind = buf.ind + 1 | 0;
  
}

function buffer_add_string(buf, s) {
  var str_len = s.length;
  buffer_check_size(buf, str_len);
  $$String.blit(s, 0, buf.bytes, buf.ind, str_len);
  buf.ind = buf.ind + str_len | 0;
  
}

function buffer_contents(buf) {
  return Bytes.sub_string(buf.bytes, 0, buf.ind);
}

function char_of_iconv(iconv) {
  switch (iconv) {
    case /* Int_d */0 :
    case /* Int_pd */1 :
    case /* Int_sd */2 :
        return /* 'd' */100;
    case /* Int_i */3 :
    case /* Int_pi */4 :
    case /* Int_si */5 :
        return /* 'i' */105;
    case /* Int_x */6 :
    case /* Int_Cx */7 :
        return /* 'x' */120;
    case /* Int_X */8 :
    case /* Int_CX */9 :
        return /* 'X' */88;
    case /* Int_o */10 :
    case /* Int_Co */11 :
        return /* 'o' */111;
    case /* Int_u */12 :
        return /* 'u' */117;
    
  }
}

function char_of_fconv(fconv) {
  switch (fconv) {
    case /* Float_f */0 :
    case /* Float_pf */1 :
    case /* Float_sf */2 :
        return /* 'f' */102;
    case /* Float_e */3 :
    case /* Float_pe */4 :
    case /* Float_se */5 :
        return /* 'e' */101;
    case /* Float_E */6 :
    case /* Float_pE */7 :
    case /* Float_sE */8 :
        return /* 'E' */69;
    case /* Float_g */9 :
    case /* Float_pg */10 :
    case /* Float_sg */11 :
        return /* 'g' */103;
    case /* Float_G */12 :
    case /* Float_pG */13 :
    case /* Float_sG */14 :
        return /* 'G' */71;
    case /* Float_F */15 :
        return /* 'F' */70;
    case /* Float_h */16 :
    case /* Float_ph */17 :
    case /* Float_sh */18 :
        return /* 'h' */104;
    case /* Float_H */19 :
    case /* Float_pH */20 :
    case /* Float_sH */21 :
        return /* 'H' */72;
    
  }
}

function char_of_counter(counter) {
  switch (counter) {
    case /* Line_counter */0 :
        return /* 'l' */108;
    case /* Char_counter */1 :
        return /* 'n' */110;
    case /* Token_counter */2 :
        return /* 'N' */78;
    
  }
}

function bprint_char_set(buf, char_set) {
  var print_char = function (buf, i) {
    var c = Pervasives.char_of_int(i);
    if (c !== 37) {
      if (c !== 64) {
        return buffer_add_char(buf, c);
      } else {
        buffer_add_char(buf, /* '%' */37);
        return buffer_add_char(buf, /* '@' */64);
      }
    } else {
      buffer_add_char(buf, /* '%' */37);
      return buffer_add_char(buf, /* '%' */37);
    }
  };
  var print_out = function (set, _i) {
    while(true) {
      var i = _i;
      if (i >= 256) {
        return ;
      }
      if (is_in_char_set(set, Pervasives.char_of_int(i))) {
        var match = Pervasives.char_of_int(i);
        if (match > 93 || match < 45) {
          if (match >= 255) {
            return print_char(buf, 255);
          } else {
            return print_second(set, i + 1 | 0);
          }
        } else if (match > 92 || match < 46) {
          return print_out(set, i + 1 | 0);
        } else {
          return print_second(set, i + 1 | 0);
        }
      }
      _i = i + 1 | 0;
      continue ;
    };
  };
  var print_second = function (set, i) {
    if (is_in_char_set(set, Pervasives.char_of_int(i))) {
      var match = Pervasives.char_of_int(i);
      if (match > 93 || match < 45) {
        if (match >= 255) {
          print_char(buf, 254);
          return print_char(buf, 255);
        }
        
      } else if ((match > 92 || match < 46) && !is_in_char_set(set, Pervasives.char_of_int(i + 1 | 0))) {
        print_char(buf, i - 1 | 0);
        return print_out(set, i + 1 | 0);
      }
      if (is_in_char_set(set, Pervasives.char_of_int(i + 1 | 0))) {
        var i$1 = i - 1 | 0;
        var _j = i + 2 | 0;
        while(true) {
          var j = _j;
          if (j === 256 || !is_in_char_set(set, Pervasives.char_of_int(j))) {
            print_char(buf, i$1);
            print_char(buf, /* '-' */45);
            print_char(buf, j - 1 | 0);
            if (j < 256) {
              return print_out(set, j + 1 | 0);
            } else {
              return ;
            }
          }
          _j = j + 1 | 0;
          continue ;
        };
      } else {
        print_char(buf, i - 1 | 0);
        print_char(buf, i);
        return print_out(set, i + 2 | 0);
      }
    }
    print_char(buf, i - 1 | 0);
    return print_out(set, i + 1 | 0);
  };
  var print_start = function (set) {
    var is_alone = function (c) {
      var before = Char.chr(c - 1 | 0);
      var after = Char.chr(c + 1 | 0);
      if (is_in_char_set(set, c)) {
        return !(is_in_char_set(set, before) && is_in_char_set(set, after));
      } else {
        return false;
      }
    };
    if (is_alone(/* ']' */93)) {
      buffer_add_char(buf, /* ']' */93);
    }
    print_out(set, 1);
    if (is_alone(/* '-' */45)) {
      return buffer_add_char(buf, /* '-' */45);
    }
    
  };
  buffer_add_char(buf, /* '[' */91);
  print_start(is_in_char_set(char_set, /* '\000' */0) ? (buffer_add_char(buf, /* '^' */94), rev_char_set(char_set)) : char_set);
  return buffer_add_char(buf, /* ']' */93);
}

function bprint_padty(buf, padty) {
  switch (padty) {
    case /* Left */0 :
        return buffer_add_char(buf, /* '-' */45);
    case /* Right */1 :
        return ;
    case /* Zeros */2 :
        return buffer_add_char(buf, /* '0' */48);
    
  }
}

function bprint_ignored_flag(buf, ign_flag) {
  if (ign_flag) {
    return buffer_add_char(buf, /* '_' */95);
  }
  
}

function bprint_pad_opt(buf, pad_opt) {
  if (pad_opt !== undefined) {
    return buffer_add_string(buf, String(pad_opt));
  }
  
}

function bprint_padding(buf, pad) {
  if (typeof pad === "number") {
    return ;
  }
  if (pad.TAG === /* Lit_padding */0) {
    bprint_padty(buf, pad._0);
    return buffer_add_string(buf, String(pad._1));
  }
  bprint_padty(buf, pad._0);
  return buffer_add_char(buf, /* '*' */42);
}

function bprint_precision(buf, prec) {
  if (typeof prec === "number") {
    if (prec !== 0) {
      return buffer_add_string(buf, ".*");
    } else {
      return ;
    }
  } else {
    buffer_add_char(buf, /* '.' */46);
    return buffer_add_string(buf, String(prec._0));
  }
}

function bprint_iconv_flag(buf, iconv) {
  switch (iconv) {
    case /* Int_pd */1 :
    case /* Int_pi */4 :
        return buffer_add_char(buf, /* '+' */43);
    case /* Int_sd */2 :
    case /* Int_si */5 :
        return buffer_add_char(buf, /* ' ' */32);
    case /* Int_Cx */7 :
    case /* Int_CX */9 :
    case /* Int_Co */11 :
        return buffer_add_char(buf, /* '#' */35);
    case /* Int_d */0 :
    case /* Int_i */3 :
    case /* Int_x */6 :
    case /* Int_X */8 :
    case /* Int_o */10 :
    case /* Int_u */12 :
        return ;
    
  }
}

function bprint_int_fmt(buf, ign_flag, iconv, pad, prec) {
  buffer_add_char(buf, /* '%' */37);
  bprint_ignored_flag(buf, ign_flag);
  bprint_iconv_flag(buf, iconv);
  bprint_padding(buf, pad);
  bprint_precision(buf, prec);
  return buffer_add_char(buf, char_of_iconv(iconv));
}

function bprint_altint_fmt(buf, ign_flag, iconv, pad, prec, c) {
  buffer_add_char(buf, /* '%' */37);
  bprint_ignored_flag(buf, ign_flag);
  bprint_iconv_flag(buf, iconv);
  bprint_padding(buf, pad);
  bprint_precision(buf, prec);
  buffer_add_char(buf, c);
  return buffer_add_char(buf, char_of_iconv(iconv));
}

function bprint_fconv_flag(buf, fconv) {
  switch (fconv) {
    case /* Float_f */0 :
    case /* Float_e */3 :
    case /* Float_E */6 :
    case /* Float_g */9 :
    case /* Float_G */12 :
    case /* Float_F */15 :
    case /* Float_h */16 :
    case /* Float_H */19 :
        return ;
    case /* Float_pf */1 :
    case /* Float_pe */4 :
    case /* Float_pE */7 :
    case /* Float_pg */10 :
    case /* Float_pG */13 :
    case /* Float_ph */17 :
    case /* Float_pH */20 :
        return buffer_add_char(buf, /* '+' */43);
    case /* Float_sf */2 :
    case /* Float_se */5 :
    case /* Float_sE */8 :
    case /* Float_sg */11 :
    case /* Float_sG */14 :
    case /* Float_sh */18 :
    case /* Float_sH */21 :
        return buffer_add_char(buf, /* ' ' */32);
    
  }
}

function bprint_float_fmt(buf, ign_flag, fconv, pad, prec) {
  buffer_add_char(buf, /* '%' */37);
  bprint_ignored_flag(buf, ign_flag);
  bprint_fconv_flag(buf, fconv);
  bprint_padding(buf, pad);
  bprint_precision(buf, prec);
  return buffer_add_char(buf, char_of_fconv(fconv));
}

function string_of_formatting_lit(formatting_lit) {
  if (typeof formatting_lit === "number") {
    switch (formatting_lit) {
      case /* Close_box */0 :
          return "@]";
      case /* Close_tag */1 :
          return "@}";
      case /* FFlush */2 :
          return "@?";
      case /* Force_newline */3 :
          return "@\n";
      case /* Flush_newline */4 :
          return "@.";
      case /* Escaped_at */5 :
          return "@@";
      case /* Escaped_percent */6 :
          return "@%";
      
    }
  } else {
    switch (formatting_lit.TAG | 0) {
      case /* Break */0 :
      case /* Magic_size */1 :
          return formatting_lit._0;
      case /* Scan_indic */2 :
          return "@" + Caml_string.make(1, formatting_lit._0);
      
    }
  }
}

function string_of_formatting_gen(formatting_gen) {
  return formatting_gen._0._1;
}

function bprint_char_literal(buf, chr) {
  if (chr !== 37) {
    return buffer_add_char(buf, chr);
  } else {
    return buffer_add_string(buf, "%%");
  }
}

function bprint_string_literal(buf, str) {
  for(var i = 0 ,i_finish = str.length; i < i_finish; ++i){
    bprint_char_literal(buf, Caml_string.get(str, i));
  }
  
}

function bprint_fmtty(buf, _fmtty) {
  while(true) {
    var fmtty = _fmtty;
    if (typeof fmtty === "number") {
      return ;
    }
    switch (fmtty.TAG | 0) {
      case /* Char_ty */0 :
          buffer_add_string(buf, "%c");
          _fmtty = fmtty._0;
          continue ;
      case /* String_ty */1 :
          buffer_add_string(buf, "%s");
          _fmtty = fmtty._0;
          continue ;
      case /* Int_ty */2 :
          buffer_add_string(buf, "%i");
          _fmtty = fmtty._0;
          continue ;
      case /* Int32_ty */3 :
          buffer_add_string(buf, "%li");
          _fmtty = fmtty._0;
          continue ;
      case /* Nativeint_ty */4 :
          buffer_add_string(buf, "%ni");
          _fmtty = fmtty._0;
          continue ;
      case /* Int64_ty */5 :
          buffer_add_string(buf, "%Li");
          _fmtty = fmtty._0;
          continue ;
      case /* Float_ty */6 :
          buffer_add_string(buf, "%f");
          _fmtty = fmtty._0;
          continue ;
      case /* Bool_ty */7 :
          buffer_add_string(buf, "%B");
          _fmtty = fmtty._0;
          continue ;
      case /* Format_arg_ty */8 :
          buffer_add_string(buf, "%{");
          bprint_fmtty(buf, fmtty._0);
          buffer_add_string(buf, "%}");
          _fmtty = fmtty._1;
          continue ;
      case /* Format_subst_ty */9 :
          buffer_add_string(buf, "%(");
          bprint_fmtty(buf, fmtty._0);
          buffer_add_string(buf, "%)");
          _fmtty = fmtty._2;
          continue ;
      case /* Alpha_ty */10 :
          buffer_add_string(buf, "%a");
          _fmtty = fmtty._0;
          continue ;
      case /* Theta_ty */11 :
          buffer_add_string(buf, "%t");
          _fmtty = fmtty._0;
          continue ;
      case /* Any_ty */12 :
          buffer_add_string(buf, "%?");
          _fmtty = fmtty._0;
          continue ;
      case /* Reader_ty */13 :
          buffer_add_string(buf, "%r");
          _fmtty = fmtty._0;
          continue ;
      case /* Ignored_reader_ty */14 :
          buffer_add_string(buf, "%_r");
          _fmtty = fmtty._0;
          continue ;
      
    }
  };
}

function int_of_custom_arity(x) {
  if (x) {
    return 1 + int_of_custom_arity(x._0) | 0;
  } else {
    return 0;
  }
}

function bprint_fmt(buf, fmt) {
  var _fmt = fmt;
  var _ign_flag = false;
  while(true) {
    var ign_flag = _ign_flag;
    var fmt$1 = _fmt;
    if (typeof fmt$1 === "number") {
      return ;
    }
    switch (fmt$1.TAG | 0) {
      case /* Char */0 :
          buffer_add_char(buf, /* '%' */37);
          bprint_ignored_flag(buf, ign_flag);
          buffer_add_char(buf, /* 'c' */99);
          _ign_flag = false;
          _fmt = fmt$1._0;
          continue ;
      case /* Caml_char */1 :
          buffer_add_char(buf, /* '%' */37);
          bprint_ignored_flag(buf, ign_flag);
          buffer_add_char(buf, /* 'C' */67);
          _ign_flag = false;
          _fmt = fmt$1._0;
          continue ;
      case /* String */2 :
          buffer_add_char(buf, /* '%' */37);
          bprint_ignored_flag(buf, ign_flag);
          bprint_padding(buf, fmt$1._0);
          buffer_add_char(buf, /* 's' */115);
          _ign_flag = false;
          _fmt = fmt$1._1;
          continue ;
      case /* Caml_string */3 :
          buffer_add_char(buf, /* '%' */37);
          bprint_ignored_flag(buf, ign_flag);
          bprint_padding(buf, fmt$1._0);
          buffer_add_char(buf, /* 'S' */83);
          _ign_flag = false;
          _fmt = fmt$1._1;
          continue ;
      case /* Int */4 :
          bprint_int_fmt(buf, ign_flag, fmt$1._0, fmt$1._1, fmt$1._2);
          _ign_flag = false;
          _fmt = fmt$1._3;
          continue ;
      case /* Int32 */5 :
          bprint_altint_fmt(buf, ign_flag, fmt$1._0, fmt$1._1, fmt$1._2, /* 'l' */108);
          _ign_flag = false;
          _fmt = fmt$1._3;
          continue ;
      case /* Nativeint */6 :
          bprint_altint_fmt(buf, ign_flag, fmt$1._0, fmt$1._1, fmt$1._2, /* 'n' */110);
          _ign_flag = false;
          _fmt = fmt$1._3;
          continue ;
      case /* Int64 */7 :
          bprint_altint_fmt(buf, ign_flag, fmt$1._0, fmt$1._1, fmt$1._2, /* 'L' */76);
          _ign_flag = false;
          _fmt = fmt$1._3;
          continue ;
      case /* Float */8 :
          bprint_float_fmt(buf, ign_flag, fmt$1._0, fmt$1._1, fmt$1._2);
          _ign_flag = false;
          _fmt = fmt$1._3;
          continue ;
      case /* Bool */9 :
          buffer_add_char(buf, /* '%' */37);
          bprint_ignored_flag(buf, ign_flag);
          bprint_padding(buf, fmt$1._0);
          buffer_add_char(buf, /* 'B' */66);
          _ign_flag = false;
          _fmt = fmt$1._1;
          continue ;
      case /* Flush */10 :
          buffer_add_string(buf, "%!");
          _fmt = fmt$1._0;
          continue ;
      case /* String_literal */11 :
          bprint_string_literal(buf, fmt$1._0);
          _fmt = fmt$1._1;
          continue ;
      case /* Char_literal */12 :
          bprint_char_literal(buf, fmt$1._0);
          _fmt = fmt$1._1;
          continue ;
      case /* Format_arg */13 :
          buffer_add_char(buf, /* '%' */37);
          bprint_ignored_flag(buf, ign_flag);
          bprint_pad_opt(buf, fmt$1._0);
          buffer_add_char(buf, /* '{' */123);
          bprint_fmtty(buf, fmt$1._1);
          buffer_add_char(buf, /* '%' */37);
          buffer_add_char(buf, /* '}' */125);
          _ign_flag = false;
          _fmt = fmt$1._2;
          continue ;
      case /* Format_subst */14 :
          buffer_add_char(buf, /* '%' */37);
          bprint_ignored_flag(buf, ign_flag);
          bprint_pad_opt(buf, fmt$1._0);
          buffer_add_char(buf, /* '(' */40);
          bprint_fmtty(buf, fmt$1._1);
          buffer_add_char(buf, /* '%' */37);
          buffer_add_char(buf, /* ')' */41);
          _ign_flag = false;
          _fmt = fmt$1._2;
          continue ;
      case /* Alpha */15 :
          buffer_add_char(buf, /* '%' */37);
          bprint_ignored_flag(buf, ign_flag);
          buffer_add_char(buf, /* 'a' */97);
          _ign_flag = false;
          _fmt = fmt$1._0;
          continue ;
      case /* Theta */16 :
          buffer_add_char(buf, /* '%' */37);
          bprint_ignored_flag(buf, ign_flag);
          buffer_add_char(buf, /* 't' */116);
          _ign_flag = false;
          _fmt = fmt$1._0;
          continue ;
      case /* Formatting_lit */17 :
          bprint_string_literal(buf, string_of_formatting_lit(fmt$1._0));
          _fmt = fmt$1._1;
          continue ;
      case /* Formatting_gen */18 :
          bprint_string_literal(buf, "@{");
          bprint_string_literal(buf, string_of_formatting_gen(fmt$1._0));
          _fmt = fmt$1._1;
          continue ;
      case /* Reader */19 :
          buffer_add_char(buf, /* '%' */37);
          bprint_ignored_flag(buf, ign_flag);
          buffer_add_char(buf, /* 'r' */114);
          _ign_flag = false;
          _fmt = fmt$1._0;
          continue ;
      case /* Scan_char_set */20 :
          buffer_add_char(buf, /* '%' */37);
          bprint_ignored_flag(buf, ign_flag);
          bprint_pad_opt(buf, fmt$1._0);
          bprint_char_set(buf, fmt$1._1);
          _ign_flag = false;
          _fmt = fmt$1._2;
          continue ;
      case /* Scan_get_counter */21 :
          buffer_add_char(buf, /* '%' */37);
          bprint_ignored_flag(buf, ign_flag);
          buffer_add_char(buf, char_of_counter(fmt$1._0));
          _ign_flag = false;
          _fmt = fmt$1._1;
          continue ;
      case /* Scan_next_char */22 :
          buffer_add_char(buf, /* '%' */37);
          bprint_ignored_flag(buf, ign_flag);
          bprint_string_literal(buf, "0c");
          _ign_flag = false;
          _fmt = fmt$1._0;
          continue ;
      case /* Ignored_param */23 :
          var fmt$prime = param_format_of_ignored_format(fmt$1._0, fmt$1._1);
          _ign_flag = true;
          _fmt = fmt$prime._0;
          continue ;
      case /* Custom */24 :
          for(var _i = 1 ,_i_finish = int_of_custom_arity(fmt$1._0); _i <= _i_finish; ++_i){
            buffer_add_char(buf, /* '%' */37);
            bprint_ignored_flag(buf, ign_flag);
            buffer_add_char(buf, /* '?' */63);
          }
          _ign_flag = false;
          _fmt = fmt$1._2;
          continue ;
      
    }
  };
}

function string_of_fmt(fmt) {
  var buf = {
    ind: 0,
    bytes: Caml_bytes.caml_create_bytes(16)
  };
  bprint_fmt(buf, fmt);
  return buffer_contents(buf);
}

function symm(rest) {
  if (typeof rest === "number") {
    return /* End_of_fmtty */0;
  }
  switch (rest.TAG | 0) {
    case /* Char_ty */0 :
        return {
                TAG: /* Char_ty */0,
                _0: symm(rest._0)
              };
    case /* String_ty */1 :
        return {
                TAG: /* String_ty */1,
                _0: symm(rest._0)
              };
    case /* Int_ty */2 :
        return {
                TAG: /* Int_ty */2,
                _0: symm(rest._0)
              };
    case /* Int32_ty */3 :
        return {
                TAG: /* Int32_ty */3,
                _0: symm(rest._0)
              };
    case /* Nativeint_ty */4 :
        return {
                TAG: /* Nativeint_ty */4,
                _0: symm(rest._0)
              };
    case /* Int64_ty */5 :
        return {
                TAG: /* Int64_ty */5,
                _0: symm(rest._0)
              };
    case /* Float_ty */6 :
        return {
                TAG: /* Float_ty */6,
                _0: symm(rest._0)
              };
    case /* Bool_ty */7 :
        return {
                TAG: /* Bool_ty */7,
                _0: symm(rest._0)
              };
    case /* Format_arg_ty */8 :
        return {
                TAG: /* Format_arg_ty */8,
                _0: rest._0,
                _1: symm(rest._1)
              };
    case /* Format_subst_ty */9 :
        return {
                TAG: /* Format_subst_ty */9,
                _0: rest._1,
                _1: rest._0,
                _2: symm(rest._2)
              };
    case /* Alpha_ty */10 :
        return {
                TAG: /* Alpha_ty */10,
                _0: symm(rest._0)
              };
    case /* Theta_ty */11 :
        return {
                TAG: /* Theta_ty */11,
                _0: symm(rest._0)
              };
    case /* Any_ty */12 :
        return {
                TAG: /* Any_ty */12,
                _0: symm(rest._0)
              };
    case /* Reader_ty */13 :
        return {
                TAG: /* Reader_ty */13,
                _0: symm(rest._0)
              };
    case /* Ignored_reader_ty */14 :
        return {
                TAG: /* Ignored_reader_ty */14,
                _0: symm(rest._0)
              };
    
  }
}

function fmtty_rel_det(rest) {
  if (typeof rest === "number") {
    return [
            (function (param) {
                return /* Refl */0;
              }),
            (function (param) {
                return /* Refl */0;
              }),
            (function (param) {
                return /* Refl */0;
              }),
            (function (param) {
                return /* Refl */0;
              })
          ];
  }
  switch (rest.TAG | 0) {
    case /* Char_ty */0 :
        var match = fmtty_rel_det(rest._0);
        var af = match[1];
        var fa = match[0];
        return [
                (function (param) {
                    Curry._1(fa, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(af, /* Refl */0);
                    return /* Refl */0;
                  }),
                match[2],
                match[3]
              ];
    case /* String_ty */1 :
        var match$1 = fmtty_rel_det(rest._0);
        var af$1 = match$1[1];
        var fa$1 = match$1[0];
        return [
                (function (param) {
                    Curry._1(fa$1, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(af$1, /* Refl */0);
                    return /* Refl */0;
                  }),
                match$1[2],
                match$1[3]
              ];
    case /* Int_ty */2 :
        var match$2 = fmtty_rel_det(rest._0);
        var af$2 = match$2[1];
        var fa$2 = match$2[0];
        return [
                (function (param) {
                    Curry._1(fa$2, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(af$2, /* Refl */0);
                    return /* Refl */0;
                  }),
                match$2[2],
                match$2[3]
              ];
    case /* Int32_ty */3 :
        var match$3 = fmtty_rel_det(rest._0);
        var af$3 = match$3[1];
        var fa$3 = match$3[0];
        return [
                (function (param) {
                    Curry._1(fa$3, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(af$3, /* Refl */0);
                    return /* Refl */0;
                  }),
                match$3[2],
                match$3[3]
              ];
    case /* Nativeint_ty */4 :
        var match$4 = fmtty_rel_det(rest._0);
        var af$4 = match$4[1];
        var fa$4 = match$4[0];
        return [
                (function (param) {
                    Curry._1(fa$4, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(af$4, /* Refl */0);
                    return /* Refl */0;
                  }),
                match$4[2],
                match$4[3]
              ];
    case /* Int64_ty */5 :
        var match$5 = fmtty_rel_det(rest._0);
        var af$5 = match$5[1];
        var fa$5 = match$5[0];
        return [
                (function (param) {
                    Curry._1(fa$5, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(af$5, /* Refl */0);
                    return /* Refl */0;
                  }),
                match$5[2],
                match$5[3]
              ];
    case /* Float_ty */6 :
        var match$6 = fmtty_rel_det(rest._0);
        var af$6 = match$6[1];
        var fa$6 = match$6[0];
        return [
                (function (param) {
                    Curry._1(fa$6, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(af$6, /* Refl */0);
                    return /* Refl */0;
                  }),
                match$6[2],
                match$6[3]
              ];
    case /* Bool_ty */7 :
        var match$7 = fmtty_rel_det(rest._0);
        var af$7 = match$7[1];
        var fa$7 = match$7[0];
        return [
                (function (param) {
                    Curry._1(fa$7, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(af$7, /* Refl */0);
                    return /* Refl */0;
                  }),
                match$7[2],
                match$7[3]
              ];
    case /* Format_arg_ty */8 :
        var match$8 = fmtty_rel_det(rest._1);
        var af$8 = match$8[1];
        var fa$8 = match$8[0];
        return [
                (function (param) {
                    Curry._1(fa$8, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(af$8, /* Refl */0);
                    return /* Refl */0;
                  }),
                match$8[2],
                match$8[3]
              ];
    case /* Format_subst_ty */9 :
        var match$9 = fmtty_rel_det(rest._2);
        var de = match$9[3];
        var ed = match$9[2];
        var af$9 = match$9[1];
        var fa$9 = match$9[0];
        var ty = trans(symm(rest._0), rest._1);
        var match$10 = fmtty_rel_det(ty);
        var jd = match$10[3];
        var dj = match$10[2];
        var ga = match$10[1];
        var ag = match$10[0];
        return [
                (function (param) {
                    Curry._1(fa$9, /* Refl */0);
                    Curry._1(ag, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(ga, /* Refl */0);
                    Curry._1(af$9, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(ed, /* Refl */0);
                    Curry._1(dj, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(jd, /* Refl */0);
                    Curry._1(de, /* Refl */0);
                    return /* Refl */0;
                  })
              ];
    case /* Alpha_ty */10 :
        var match$11 = fmtty_rel_det(rest._0);
        var af$10 = match$11[1];
        var fa$10 = match$11[0];
        return [
                (function (param) {
                    Curry._1(fa$10, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(af$10, /* Refl */0);
                    return /* Refl */0;
                  }),
                match$11[2],
                match$11[3]
              ];
    case /* Theta_ty */11 :
        var match$12 = fmtty_rel_det(rest._0);
        var af$11 = match$12[1];
        var fa$11 = match$12[0];
        return [
                (function (param) {
                    Curry._1(fa$11, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(af$11, /* Refl */0);
                    return /* Refl */0;
                  }),
                match$12[2],
                match$12[3]
              ];
    case /* Any_ty */12 :
        var match$13 = fmtty_rel_det(rest._0);
        var af$12 = match$13[1];
        var fa$12 = match$13[0];
        return [
                (function (param) {
                    Curry._1(fa$12, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(af$12, /* Refl */0);
                    return /* Refl */0;
                  }),
                match$13[2],
                match$13[3]
              ];
    case /* Reader_ty */13 :
        var match$14 = fmtty_rel_det(rest._0);
        var de$1 = match$14[3];
        var ed$1 = match$14[2];
        var af$13 = match$14[1];
        var fa$13 = match$14[0];
        return [
                (function (param) {
                    Curry._1(fa$13, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(af$13, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(ed$1, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(de$1, /* Refl */0);
                    return /* Refl */0;
                  })
              ];
    case /* Ignored_reader_ty */14 :
        var match$15 = fmtty_rel_det(rest._0);
        var de$2 = match$15[3];
        var ed$2 = match$15[2];
        var af$14 = match$15[1];
        var fa$14 = match$15[0];
        return [
                (function (param) {
                    Curry._1(fa$14, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(af$14, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(ed$2, /* Refl */0);
                    return /* Refl */0;
                  }),
                (function (param) {
                    Curry._1(de$2, /* Refl */0);
                    return /* Refl */0;
                  })
              ];
    
  }
}

function trans(ty1, ty2) {
  var exit = 0;
  if (typeof ty1 === "number") {
    if (typeof ty2 === "number") {
      return /* End_of_fmtty */0;
    }
    switch (ty2.TAG | 0) {
      case /* Format_arg_ty */8 :
          exit = 6;
          break;
      case /* Format_subst_ty */9 :
          exit = 7;
          break;
      case /* Alpha_ty */10 :
          exit = 1;
          break;
      case /* Theta_ty */11 :
          exit = 2;
          break;
      case /* Any_ty */12 :
          exit = 3;
          break;
      case /* Reader_ty */13 :
          exit = 4;
          break;
      case /* Ignored_reader_ty */14 :
          exit = 5;
          break;
      default:
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "camlinternalFormat.ml",
                846,
                23
              ],
              Error: new Error()
            };
    }
  } else {
    switch (ty1.TAG | 0) {
      case /* Char_ty */0 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.TAG | 0) {
              case /* Char_ty */0 :
                  return {
                          TAG: /* Char_ty */0,
                          _0: trans(ty1._0, ty2._0)
                        };
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* String_ty */1 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.TAG | 0) {
              case /* String_ty */1 :
                  return {
                          TAG: /* String_ty */1,
                          _0: trans(ty1._0, ty2._0)
                        };
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* Int_ty */2 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.TAG | 0) {
              case /* Int_ty */2 :
                  return {
                          TAG: /* Int_ty */2,
                          _0: trans(ty1._0, ty2._0)
                        };
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* Int32_ty */3 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.TAG | 0) {
              case /* Int32_ty */3 :
                  return {
                          TAG: /* Int32_ty */3,
                          _0: trans(ty1._0, ty2._0)
                        };
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* Nativeint_ty */4 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.TAG | 0) {
              case /* Nativeint_ty */4 :
                  return {
                          TAG: /* Nativeint_ty */4,
                          _0: trans(ty1._0, ty2._0)
                        };
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* Int64_ty */5 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.TAG | 0) {
              case /* Int64_ty */5 :
                  return {
                          TAG: /* Int64_ty */5,
                          _0: trans(ty1._0, ty2._0)
                        };
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* Float_ty */6 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.TAG | 0) {
              case /* Float_ty */6 :
                  return {
                          TAG: /* Float_ty */6,
                          _0: trans(ty1._0, ty2._0)
                        };
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* Bool_ty */7 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.TAG | 0) {
              case /* Bool_ty */7 :
                  return {
                          TAG: /* Bool_ty */7,
                          _0: trans(ty1._0, ty2._0)
                        };
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* Format_arg_ty */8 :
          if (typeof ty2 === "number") {
            throw {
                  RE_EXN_ID: "Assert_failure",
                  _1: [
                    "camlinternalFormat.ml",
                    832,
                    26
                  ],
                  Error: new Error()
                };
          }
          switch (ty2.TAG | 0) {
            case /* Format_arg_ty */8 :
                return {
                        TAG: /* Format_arg_ty */8,
                        _0: trans(ty1._0, ty2._0),
                        _1: trans(ty1._1, ty2._1)
                      };
            case /* Alpha_ty */10 :
                exit = 1;
                break;
            case /* Theta_ty */11 :
                exit = 2;
                break;
            case /* Any_ty */12 :
                exit = 3;
                break;
            case /* Reader_ty */13 :
                exit = 4;
                break;
            case /* Ignored_reader_ty */14 :
                exit = 5;
                break;
            default:
              throw {
                    RE_EXN_ID: "Assert_failure",
                    _1: [
                      "camlinternalFormat.ml",
                      832,
                      26
                    ],
                    Error: new Error()
                  };
          }
          break;
      case /* Format_subst_ty */9 :
          if (typeof ty2 === "number") {
            throw {
                  RE_EXN_ID: "Assert_failure",
                  _1: [
                    "camlinternalFormat.ml",
                    842,
                    28
                  ],
                  Error: new Error()
                };
          }
          switch (ty2.TAG | 0) {
            case /* Format_arg_ty */8 :
                exit = 6;
                break;
            case /* Format_subst_ty */9 :
                var ty = trans(symm(ty1._1), ty2._0);
                var match = fmtty_rel_det(ty);
                Curry._1(match[1], /* Refl */0);
                Curry._1(match[3], /* Refl */0);
                return {
                        TAG: /* Format_subst_ty */9,
                        _0: ty1._0,
                        _1: ty2._1,
                        _2: trans(ty1._2, ty2._2)
                      };
            case /* Alpha_ty */10 :
                exit = 1;
                break;
            case /* Theta_ty */11 :
                exit = 2;
                break;
            case /* Any_ty */12 :
                exit = 3;
                break;
            case /* Reader_ty */13 :
                exit = 4;
                break;
            case /* Ignored_reader_ty */14 :
                exit = 5;
                break;
            default:
              throw {
                    RE_EXN_ID: "Assert_failure",
                    _1: [
                      "camlinternalFormat.ml",
                      842,
                      28
                    ],
                    Error: new Error()
                  };
          }
          break;
      case /* Alpha_ty */10 :
          if (typeof ty2 === "number") {
            throw {
                  RE_EXN_ID: "Assert_failure",
                  _1: [
                    "camlinternalFormat.ml",
                    810,
                    21
                  ],
                  Error: new Error()
                };
          }
          if (ty2.TAG === /* Alpha_ty */10) {
            return {
                    TAG: /* Alpha_ty */10,
                    _0: trans(ty1._0, ty2._0)
                  };
          }
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "camlinternalFormat.ml",
                  810,
                  21
                ],
                Error: new Error()
              };
      case /* Theta_ty */11 :
          if (typeof ty2 === "number") {
            throw {
                  RE_EXN_ID: "Assert_failure",
                  _1: [
                    "camlinternalFormat.ml",
                    814,
                    21
                  ],
                  Error: new Error()
                };
          }
          switch (ty2.TAG | 0) {
            case /* Alpha_ty */10 :
                exit = 1;
                break;
            case /* Theta_ty */11 :
                return {
                        TAG: /* Theta_ty */11,
                        _0: trans(ty1._0, ty2._0)
                      };
            default:
              throw {
                    RE_EXN_ID: "Assert_failure",
                    _1: [
                      "camlinternalFormat.ml",
                      814,
                      21
                    ],
                    Error: new Error()
                  };
          }
          break;
      case /* Any_ty */12 :
          if (typeof ty2 === "number") {
            throw {
                  RE_EXN_ID: "Assert_failure",
                  _1: [
                    "camlinternalFormat.ml",
                    818,
                    19
                  ],
                  Error: new Error()
                };
          }
          switch (ty2.TAG | 0) {
            case /* Alpha_ty */10 :
                exit = 1;
                break;
            case /* Theta_ty */11 :
                exit = 2;
                break;
            case /* Any_ty */12 :
                return {
                        TAG: /* Any_ty */12,
                        _0: trans(ty1._0, ty2._0)
                      };
            default:
              throw {
                    RE_EXN_ID: "Assert_failure",
                    _1: [
                      "camlinternalFormat.ml",
                      818,
                      19
                    ],
                    Error: new Error()
                  };
          }
          break;
      case /* Reader_ty */13 :
          if (typeof ty2 === "number") {
            throw {
                  RE_EXN_ID: "Assert_failure",
                  _1: [
                    "camlinternalFormat.ml",
                    822,
                    22
                  ],
                  Error: new Error()
                };
          }
          switch (ty2.TAG | 0) {
            case /* Alpha_ty */10 :
                exit = 1;
                break;
            case /* Theta_ty */11 :
                exit = 2;
                break;
            case /* Any_ty */12 :
                exit = 3;
                break;
            case /* Reader_ty */13 :
                return {
                        TAG: /* Reader_ty */13,
                        _0: trans(ty1._0, ty2._0)
                      };
            default:
              throw {
                    RE_EXN_ID: "Assert_failure",
                    _1: [
                      "camlinternalFormat.ml",
                      822,
                      22
                    ],
                    Error: new Error()
                  };
          }
          break;
      case /* Ignored_reader_ty */14 :
          if (typeof ty2 === "number") {
            throw {
                  RE_EXN_ID: "Assert_failure",
                  _1: [
                    "camlinternalFormat.ml",
                    827,
                    30
                  ],
                  Error: new Error()
                };
          }
          switch (ty2.TAG | 0) {
            case /* Alpha_ty */10 :
                exit = 1;
                break;
            case /* Theta_ty */11 :
                exit = 2;
                break;
            case /* Any_ty */12 :
                exit = 3;
                break;
            case /* Reader_ty */13 :
                exit = 4;
                break;
            case /* Ignored_reader_ty */14 :
                return {
                        TAG: /* Ignored_reader_ty */14,
                        _0: trans(ty1._0, ty2._0)
                      };
            default:
              throw {
                    RE_EXN_ID: "Assert_failure",
                    _1: [
                      "camlinternalFormat.ml",
                      827,
                      30
                    ],
                    Error: new Error()
                  };
          }
          break;
      
    }
  }
  switch (exit) {
    case 1 :
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "camlinternalFormat.ml",
                811,
                21
              ],
              Error: new Error()
            };
    case 2 :
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "camlinternalFormat.ml",
                815,
                21
              ],
              Error: new Error()
            };
    case 3 :
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "camlinternalFormat.ml",
                819,
                19
              ],
              Error: new Error()
            };
    case 4 :
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "camlinternalFormat.ml",
                823,
                22
              ],
              Error: new Error()
            };
    case 5 :
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "camlinternalFormat.ml",
                828,
                30
              ],
              Error: new Error()
            };
    case 6 :
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "camlinternalFormat.ml",
                833,
                26
              ],
              Error: new Error()
            };
    case 7 :
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "camlinternalFormat.ml",
                843,
                28
              ],
              Error: new Error()
            };
    case 8 :
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "camlinternalFormat.ml",
                847,
                23
              ],
              Error: new Error()
            };
    
  }
}

function fmtty_of_formatting_gen(formatting_gen) {
  return fmtty_of_fmt(formatting_gen._0._0);
}

function fmtty_of_fmt(_fmtty) {
  while(true) {
    var fmtty = _fmtty;
    if (typeof fmtty === "number") {
      return /* End_of_fmtty */0;
    }
    switch (fmtty.TAG | 0) {
      case /* String */2 :
      case /* Caml_string */3 :
          break;
      case /* Int */4 :
          var ty_rest = fmtty_of_fmt(fmtty._3);
          var prec_ty = fmtty_of_precision_fmtty(fmtty._2, {
                TAG: /* Int_ty */2,
                _0: ty_rest
              });
          return fmtty_of_padding_fmtty(fmtty._1, prec_ty);
      case /* Int32 */5 :
          var ty_rest$1 = fmtty_of_fmt(fmtty._3);
          var prec_ty$1 = fmtty_of_precision_fmtty(fmtty._2, {
                TAG: /* Int32_ty */3,
                _0: ty_rest$1
              });
          return fmtty_of_padding_fmtty(fmtty._1, prec_ty$1);
      case /* Nativeint */6 :
          var ty_rest$2 = fmtty_of_fmt(fmtty._3);
          var prec_ty$2 = fmtty_of_precision_fmtty(fmtty._2, {
                TAG: /* Nativeint_ty */4,
                _0: ty_rest$2
              });
          return fmtty_of_padding_fmtty(fmtty._1, prec_ty$2);
      case /* Int64 */7 :
          var ty_rest$3 = fmtty_of_fmt(fmtty._3);
          var prec_ty$3 = fmtty_of_precision_fmtty(fmtty._2, {
                TAG: /* Int64_ty */5,
                _0: ty_rest$3
              });
          return fmtty_of_padding_fmtty(fmtty._1, prec_ty$3);
      case /* Float */8 :
          var ty_rest$4 = fmtty_of_fmt(fmtty._3);
          var prec_ty$4 = fmtty_of_precision_fmtty(fmtty._2, {
                TAG: /* Float_ty */6,
                _0: ty_rest$4
              });
          return fmtty_of_padding_fmtty(fmtty._1, prec_ty$4);
      case /* Bool */9 :
          return fmtty_of_padding_fmtty(fmtty._0, {
                      TAG: /* Bool_ty */7,
                      _0: fmtty_of_fmt(fmtty._1)
                    });
      case /* Flush */10 :
          _fmtty = fmtty._0;
          continue ;
      case /* Format_arg */13 :
          return {
                  TAG: /* Format_arg_ty */8,
                  _0: fmtty._1,
                  _1: fmtty_of_fmt(fmtty._2)
                };
      case /* Format_subst */14 :
          var ty = fmtty._1;
          return {
                  TAG: /* Format_subst_ty */9,
                  _0: ty,
                  _1: ty,
                  _2: fmtty_of_fmt(fmtty._2)
                };
      case /* Alpha */15 :
          return {
                  TAG: /* Alpha_ty */10,
                  _0: fmtty_of_fmt(fmtty._0)
                };
      case /* Theta */16 :
          return {
                  TAG: /* Theta_ty */11,
                  _0: fmtty_of_fmt(fmtty._0)
                };
      case /* String_literal */11 :
      case /* Char_literal */12 :
      case /* Formatting_lit */17 :
          _fmtty = fmtty._1;
          continue ;
      case /* Formatting_gen */18 :
          return CamlinternalFormatBasics.concat_fmtty(fmtty_of_formatting_gen(fmtty._0), fmtty_of_fmt(fmtty._1));
      case /* Reader */19 :
          return {
                  TAG: /* Reader_ty */13,
                  _0: fmtty_of_fmt(fmtty._0)
                };
      case /* Scan_char_set */20 :
          return {
                  TAG: /* String_ty */1,
                  _0: fmtty_of_fmt(fmtty._2)
                };
      case /* Scan_get_counter */21 :
          return {
                  TAG: /* Int_ty */2,
                  _0: fmtty_of_fmt(fmtty._1)
                };
      case /* Ignored_param */23 :
          var ign = fmtty._0;
          var fmt = fmtty._1;
          if (typeof ign === "number") {
            if (ign === /* Ignored_reader */2) {
              return {
                      TAG: /* Ignored_reader_ty */14,
                      _0: fmtty_of_fmt(fmt)
                    };
            } else {
              return fmtty_of_fmt(fmt);
            }
          } else if (ign.TAG === /* Ignored_format_subst */9) {
            return CamlinternalFormatBasics.concat_fmtty(ign._1, fmtty_of_fmt(fmt));
          } else {
            return fmtty_of_fmt(fmt);
          }
      case /* Custom */24 :
          return fmtty_of_custom(fmtty._0, fmtty_of_fmt(fmtty._2));
      default:
        return {
                TAG: /* Char_ty */0,
                _0: fmtty_of_fmt(fmtty._0)
              };
    }
    return fmtty_of_padding_fmtty(fmtty._0, {
                TAG: /* String_ty */1,
                _0: fmtty_of_fmt(fmtty._1)
              });
  };
}

function fmtty_of_custom(arity, fmtty) {
  if (arity) {
    return {
            TAG: /* Any_ty */12,
            _0: fmtty_of_custom(arity._0, fmtty)
          };
  } else {
    return fmtty;
  }
}

function fmtty_of_padding_fmtty(pad, fmtty) {
  if (typeof pad === "number" || pad.TAG === /* Lit_padding */0) {
    return fmtty;
  } else {
    return {
            TAG: /* Int_ty */2,
            _0: fmtty
          };
  }
}

function fmtty_of_precision_fmtty(prec, fmtty) {
  if (typeof prec === "number" && prec !== 0) {
    return {
            TAG: /* Int_ty */2,
            _0: fmtty
          };
  } else {
    return fmtty;
  }
}

var Type_mismatch = /* @__PURE__ */Caml_exceptions.create("CamlinternalFormat.Type_mismatch");

function type_padding(pad, fmtty) {
  if (typeof pad === "number") {
    return /* Padding_fmtty_EBB */{
            _0: /* No_padding */0,
            _1: fmtty
          };
  }
  if (pad.TAG === /* Lit_padding */0) {
    return /* Padding_fmtty_EBB */{
            _0: {
              TAG: /* Lit_padding */0,
              _0: pad._0,
              _1: pad._1
            },
            _1: fmtty
          };
  }
  if (typeof fmtty === "number") {
    throw {
          RE_EXN_ID: Type_mismatch,
          Error: new Error()
        };
  }
  if (fmtty.TAG === /* Int_ty */2) {
    return /* Padding_fmtty_EBB */{
            _0: {
              TAG: /* Arg_padding */1,
              _0: pad._0
            },
            _1: fmtty._0
          };
  }
  throw {
        RE_EXN_ID: Type_mismatch,
        Error: new Error()
      };
}

function type_padprec(pad, prec, fmtty) {
  var match = type_padding(pad, fmtty);
  if (typeof prec !== "number") {
    return /* Padprec_fmtty_EBB */{
            _0: match._0,
            _1: /* Lit_precision */{
              _0: prec._0
            },
            _2: match._1
          };
  }
  if (prec === 0) {
    return /* Padprec_fmtty_EBB */{
            _0: match._0,
            _1: /* No_precision */0,
            _2: match._1
          };
  }
  var rest = match._1;
  if (typeof rest === "number") {
    throw {
          RE_EXN_ID: Type_mismatch,
          Error: new Error()
        };
  }
  if (rest.TAG === /* Int_ty */2) {
    return /* Padprec_fmtty_EBB */{
            _0: match._0,
            _1: /* Arg_precision */1,
            _2: rest._0
          };
  }
  throw {
        RE_EXN_ID: Type_mismatch,
        Error: new Error()
      };
}

function type_ignored_format_substitution(sub_fmtty, fmt, fmtty) {
  if (typeof sub_fmtty === "number") {
    return /* Fmtty_fmt_EBB */{
            _0: /* End_of_fmtty */0,
            _1: type_format_gen(fmt, fmtty)
          };
  }
  switch (sub_fmtty.TAG | 0) {
    case /* Char_ty */0 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Char_ty */0) {
          var match = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
          return /* Fmtty_fmt_EBB */{
                  _0: {
                    TAG: /* Char_ty */0,
                    _0: match._0
                  },
                  _1: match._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* String_ty */1 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* String_ty */1) {
          var match$1 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
          return /* Fmtty_fmt_EBB */{
                  _0: {
                    TAG: /* String_ty */1,
                    _0: match$1._0
                  },
                  _1: match$1._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Int_ty */2 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Int_ty */2) {
          var match$2 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
          return /* Fmtty_fmt_EBB */{
                  _0: {
                    TAG: /* Int_ty */2,
                    _0: match$2._0
                  },
                  _1: match$2._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Int32_ty */3 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Int32_ty */3) {
          var match$3 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
          return /* Fmtty_fmt_EBB */{
                  _0: {
                    TAG: /* Int32_ty */3,
                    _0: match$3._0
                  },
                  _1: match$3._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Nativeint_ty */4 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Nativeint_ty */4) {
          var match$4 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
          return /* Fmtty_fmt_EBB */{
                  _0: {
                    TAG: /* Nativeint_ty */4,
                    _0: match$4._0
                  },
                  _1: match$4._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Int64_ty */5 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Int64_ty */5) {
          var match$5 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
          return /* Fmtty_fmt_EBB */{
                  _0: {
                    TAG: /* Int64_ty */5,
                    _0: match$5._0
                  },
                  _1: match$5._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Float_ty */6 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Float_ty */6) {
          var match$6 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
          return /* Fmtty_fmt_EBB */{
                  _0: {
                    TAG: /* Float_ty */6,
                    _0: match$6._0
                  },
                  _1: match$6._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Bool_ty */7 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Bool_ty */7) {
          var match$7 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
          return /* Fmtty_fmt_EBB */{
                  _0: {
                    TAG: /* Bool_ty */7,
                    _0: match$7._0
                  },
                  _1: match$7._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Format_arg_ty */8 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Format_arg_ty */8) {
          var sub2_fmtty$prime = fmtty._0;
          if (Caml_obj.caml_notequal(/* Fmtty_EBB */{
                  _0: sub_fmtty._0
                }, /* Fmtty_EBB */{
                  _0: sub2_fmtty$prime
                })) {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          var match$8 = type_ignored_format_substitution(sub_fmtty._1, fmt, fmtty._1);
          return /* Fmtty_fmt_EBB */{
                  _0: {
                    TAG: /* Format_arg_ty */8,
                    _0: sub2_fmtty$prime,
                    _1: match$8._0
                  },
                  _1: match$8._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Format_subst_ty */9 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Format_subst_ty */9) {
          var sub2_fmtty$prime$1 = fmtty._1;
          var sub1_fmtty$prime = fmtty._0;
          if (Caml_obj.caml_notequal(/* Fmtty_EBB */{
                  _0: CamlinternalFormatBasics.erase_rel(sub_fmtty._0)
                }, /* Fmtty_EBB */{
                  _0: CamlinternalFormatBasics.erase_rel(sub1_fmtty$prime)
                })) {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (Caml_obj.caml_notequal(/* Fmtty_EBB */{
                  _0: CamlinternalFormatBasics.erase_rel(sub_fmtty._1)
                }, /* Fmtty_EBB */{
                  _0: CamlinternalFormatBasics.erase_rel(sub2_fmtty$prime$1)
                })) {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          var sub_fmtty$prime = trans(symm(sub1_fmtty$prime), sub2_fmtty$prime$1);
          var match$9 = fmtty_rel_det(sub_fmtty$prime);
          Curry._1(match$9[1], /* Refl */0);
          Curry._1(match$9[3], /* Refl */0);
          var match$10 = type_ignored_format_substitution(CamlinternalFormatBasics.erase_rel(sub_fmtty._2), fmt, fmtty._2);
          return /* Fmtty_fmt_EBB */{
                  _0: {
                    TAG: /* Format_subst_ty */9,
                    _0: sub1_fmtty$prime,
                    _1: sub2_fmtty$prime$1,
                    _2: symm(match$10._0)
                  },
                  _1: match$10._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Alpha_ty */10 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Alpha_ty */10) {
          var match$11 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
          return /* Fmtty_fmt_EBB */{
                  _0: {
                    TAG: /* Alpha_ty */10,
                    _0: match$11._0
                  },
                  _1: match$11._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Theta_ty */11 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Theta_ty */11) {
          var match$12 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
          return /* Fmtty_fmt_EBB */{
                  _0: {
                    TAG: /* Theta_ty */11,
                    _0: match$12._0
                  },
                  _1: match$12._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Any_ty */12 :
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Reader_ty */13 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Reader_ty */13) {
          var match$13 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
          return /* Fmtty_fmt_EBB */{
                  _0: {
                    TAG: /* Reader_ty */13,
                    _0: match$13._0
                  },
                  _1: match$13._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Ignored_reader_ty */14 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Ignored_reader_ty */14) {
          var match$14 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
          return /* Fmtty_fmt_EBB */{
                  _0: {
                    TAG: /* Ignored_reader_ty */14,
                    _0: match$14._0
                  },
                  _1: match$14._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    
  }
}

function type_format_gen(fmt, fmtty) {
  if (typeof fmt === "number") {
    return /* Fmt_fmtty_EBB */{
            _0: /* End_of_format */0,
            _1: fmtty
          };
  }
  switch (fmt.TAG | 0) {
    case /* Char */0 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Char_ty */0) {
          var match = type_format_gen(fmt._0, fmtty._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Char */0,
                    _0: match._0
                  },
                  _1: match._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Caml_char */1 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Char_ty */0) {
          var match$1 = type_format_gen(fmt._0, fmtty._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Caml_char */1,
                    _0: match$1._0
                  },
                  _1: match$1._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* String */2 :
        var match$2 = type_padding(fmt._0, fmtty);
        var fmtty_rest = match$2._1;
        if (typeof fmtty_rest === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty_rest.TAG === /* String_ty */1) {
          var match$3 = type_format_gen(fmt._1, fmtty_rest._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* String */2,
                    _0: match$2._0,
                    _1: match$3._0
                  },
                  _1: match$3._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Caml_string */3 :
        var match$4 = type_padding(fmt._0, fmtty);
        var fmtty_rest$1 = match$4._1;
        if (typeof fmtty_rest$1 === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty_rest$1.TAG === /* String_ty */1) {
          var match$5 = type_format_gen(fmt._1, fmtty_rest$1._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Caml_string */3,
                    _0: match$4._0,
                    _1: match$5._0
                  },
                  _1: match$5._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Int */4 :
        var match$6 = type_padprec(fmt._1, fmt._2, fmtty);
        var fmtty_rest$2 = match$6._2;
        if (typeof fmtty_rest$2 === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty_rest$2.TAG === /* Int_ty */2) {
          var match$7 = type_format_gen(fmt._3, fmtty_rest$2._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Int */4,
                    _0: fmt._0,
                    _1: match$6._0,
                    _2: match$6._1,
                    _3: match$7._0
                  },
                  _1: match$7._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Int32 */5 :
        var match$8 = type_padprec(fmt._1, fmt._2, fmtty);
        var fmtty_rest$3 = match$8._2;
        if (typeof fmtty_rest$3 === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty_rest$3.TAG === /* Int32_ty */3) {
          var match$9 = type_format_gen(fmt._3, fmtty_rest$3._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Int32 */5,
                    _0: fmt._0,
                    _1: match$8._0,
                    _2: match$8._1,
                    _3: match$9._0
                  },
                  _1: match$9._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Nativeint */6 :
        var match$10 = type_padprec(fmt._1, fmt._2, fmtty);
        var fmtty_rest$4 = match$10._2;
        if (typeof fmtty_rest$4 === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty_rest$4.TAG === /* Nativeint_ty */4) {
          var match$11 = type_format_gen(fmt._3, fmtty_rest$4._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Nativeint */6,
                    _0: fmt._0,
                    _1: match$10._0,
                    _2: match$10._1,
                    _3: match$11._0
                  },
                  _1: match$11._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Int64 */7 :
        var match$12 = type_padprec(fmt._1, fmt._2, fmtty);
        var fmtty_rest$5 = match$12._2;
        if (typeof fmtty_rest$5 === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty_rest$5.TAG === /* Int64_ty */5) {
          var match$13 = type_format_gen(fmt._3, fmtty_rest$5._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Int64 */7,
                    _0: fmt._0,
                    _1: match$12._0,
                    _2: match$12._1,
                    _3: match$13._0
                  },
                  _1: match$13._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Float */8 :
        var match$14 = type_padprec(fmt._1, fmt._2, fmtty);
        var fmtty_rest$6 = match$14._2;
        if (typeof fmtty_rest$6 === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty_rest$6.TAG === /* Float_ty */6) {
          var match$15 = type_format_gen(fmt._3, fmtty_rest$6._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Float */8,
                    _0: fmt._0,
                    _1: match$14._0,
                    _2: match$14._1,
                    _3: match$15._0
                  },
                  _1: match$15._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Bool */9 :
        var match$16 = type_padding(fmt._0, fmtty);
        var fmtty_rest$7 = match$16._1;
        if (typeof fmtty_rest$7 === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty_rest$7.TAG === /* Bool_ty */7) {
          var match$17 = type_format_gen(fmt._1, fmtty_rest$7._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Bool */9,
                    _0: match$16._0,
                    _1: match$17._0
                  },
                  _1: match$17._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Flush */10 :
        var match$18 = type_format_gen(fmt._0, fmtty);
        return /* Fmt_fmtty_EBB */{
                _0: {
                  TAG: /* Flush */10,
                  _0: match$18._0
                },
                _1: match$18._1
              };
    case /* String_literal */11 :
        var match$19 = type_format_gen(fmt._1, fmtty);
        return /* Fmt_fmtty_EBB */{
                _0: {
                  TAG: /* String_literal */11,
                  _0: fmt._0,
                  _1: match$19._0
                },
                _1: match$19._1
              };
    case /* Char_literal */12 :
        var match$20 = type_format_gen(fmt._1, fmtty);
        return /* Fmt_fmtty_EBB */{
                _0: {
                  TAG: /* Char_literal */12,
                  _0: fmt._0,
                  _1: match$20._0
                },
                _1: match$20._1
              };
    case /* Format_arg */13 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Format_arg_ty */8) {
          var sub_fmtty$prime = fmtty._0;
          if (Caml_obj.caml_notequal(/* Fmtty_EBB */{
                  _0: fmt._1
                }, /* Fmtty_EBB */{
                  _0: sub_fmtty$prime
                })) {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          var match$21 = type_format_gen(fmt._2, fmtty._1);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Format_arg */13,
                    _0: fmt._0,
                    _1: sub_fmtty$prime,
                    _2: match$21._0
                  },
                  _1: match$21._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Format_subst */14 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Format_subst_ty */9) {
          var sub_fmtty1 = fmtty._0;
          if (Caml_obj.caml_notequal(/* Fmtty_EBB */{
                  _0: CamlinternalFormatBasics.erase_rel(fmt._1)
                }, /* Fmtty_EBB */{
                  _0: CamlinternalFormatBasics.erase_rel(sub_fmtty1)
                })) {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          var match$22 = type_format_gen(fmt._2, CamlinternalFormatBasics.erase_rel(fmtty._2));
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Format_subst */14,
                    _0: fmt._0,
                    _1: sub_fmtty1,
                    _2: match$22._0
                  },
                  _1: match$22._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Alpha */15 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Alpha_ty */10) {
          var match$23 = type_format_gen(fmt._0, fmtty._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Alpha */15,
                    _0: match$23._0
                  },
                  _1: match$23._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Theta */16 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Theta_ty */11) {
          var match$24 = type_format_gen(fmt._0, fmtty._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Theta */16,
                    _0: match$24._0
                  },
                  _1: match$24._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Formatting_lit */17 :
        var match$25 = type_format_gen(fmt._1, fmtty);
        return /* Fmt_fmtty_EBB */{
                _0: {
                  TAG: /* Formatting_lit */17,
                  _0: fmt._0,
                  _1: match$25._0
                },
                _1: match$25._1
              };
    case /* Formatting_gen */18 :
        var formatting_gen = fmt._0;
        var fmt0 = fmt._1;
        if (formatting_gen.TAG === /* Open_tag */0) {
          var match$26 = formatting_gen._0;
          var match$27 = type_format_gen(match$26._0, fmtty);
          var match$28 = type_format_gen(fmt0, match$27._1);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Formatting_gen */18,
                    _0: {
                      TAG: /* Open_tag */0,
                      _0: /* Format */{
                        _0: match$27._0,
                        _1: match$26._1
                      }
                    },
                    _1: match$28._0
                  },
                  _1: match$28._1
                };
        }
        var match$29 = formatting_gen._0;
        var match$30 = type_format_gen(match$29._0, fmtty);
        var match$31 = type_format_gen(fmt0, match$30._1);
        return /* Fmt_fmtty_EBB */{
                _0: {
                  TAG: /* Formatting_gen */18,
                  _0: {
                    TAG: /* Open_box */1,
                    _0: /* Format */{
                      _0: match$30._0,
                      _1: match$29._1
                    }
                  },
                  _1: match$31._0
                },
                _1: match$31._1
              };
    case /* Reader */19 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Reader_ty */13) {
          var match$32 = type_format_gen(fmt._0, fmtty._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Reader */19,
                    _0: match$32._0
                  },
                  _1: match$32._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Scan_char_set */20 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* String_ty */1) {
          var match$33 = type_format_gen(fmt._2, fmtty._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Scan_char_set */20,
                    _0: fmt._0,
                    _1: fmt._1,
                    _2: match$33._0
                  },
                  _1: match$33._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Scan_get_counter */21 :
        if (typeof fmtty === "number") {
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        }
        if (fmtty.TAG === /* Int_ty */2) {
          var match$34 = type_format_gen(fmt._1, fmtty._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Scan_get_counter */21,
                    _0: fmt._0,
                    _1: match$34._0
                  },
                  _1: match$34._1
                };
        }
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    case /* Ignored_param */23 :
        var ign = fmt._0;
        var fmt$1 = fmt._1;
        if (typeof ign === "number") {
          if (ign !== /* Ignored_reader */2) {
            return type_ignored_param_one(ign, fmt$1, fmtty);
          }
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Ignored_reader_ty */14) {
            var match$35 = type_format_gen(fmt$1, fmtty._0);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Ignored_param */23,
                      _0: /* Ignored_reader */2,
                      _1: match$35._0
                    },
                    _1: match$35._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
        } else {
          switch (ign.TAG | 0) {
            case /* Ignored_format_arg */8 :
                return type_ignored_param_one({
                            TAG: /* Ignored_format_arg */8,
                            _0: ign._0,
                            _1: ign._1
                          }, fmt$1, fmtty);
            case /* Ignored_format_subst */9 :
                var match$36 = type_ignored_format_substitution(ign._1, fmt$1, fmtty);
                var match$37 = match$36._1;
                return /* Fmt_fmtty_EBB */{
                        _0: {
                          TAG: /* Ignored_param */23,
                          _0: {
                            TAG: /* Ignored_format_subst */9,
                            _0: ign._0,
                            _1: match$36._0
                          },
                          _1: match$37._0
                        },
                        _1: match$37._1
                      };
            default:
              return type_ignored_param_one(ign, fmt$1, fmtty);
          }
        }
    case /* Scan_next_char */22 :
    case /* Custom */24 :
        throw {
              RE_EXN_ID: Type_mismatch,
              Error: new Error()
            };
    
  }
}

function type_ignored_param_one(ign, fmt, fmtty) {
  var match = type_format_gen(fmt, fmtty);
  return /* Fmt_fmtty_EBB */{
          _0: {
            TAG: /* Ignored_param */23,
            _0: ign,
            _1: match._0
          },
          _1: match._1
        };
}

function type_format(fmt, fmtty) {
  var match = type_format_gen(fmt, fmtty);
  if (typeof match._1 === "number") {
    return match._0;
  }
  throw {
        RE_EXN_ID: Type_mismatch,
        Error: new Error()
      };
}

function recast(fmt, fmtty) {
  return type_format(fmt, CamlinternalFormatBasics.erase_rel(symm(fmtty)));
}

function fix_padding(padty, width, str) {
  var len = str.length;
  var width$1 = Pervasives.abs(width);
  var padty$1 = width < 0 ? /* Left */0 : padty;
  if (width$1 <= len) {
    return str;
  }
  var res = Bytes.make(width$1, padty$1 === /* Zeros */2 ? /* '0' */48 : /* ' ' */32);
  switch (padty$1) {
    case /* Left */0 :
        $$String.blit(str, 0, res, 0, len);
        break;
    case /* Right */1 :
        $$String.blit(str, 0, res, width$1 - len | 0, len);
        break;
    case /* Zeros */2 :
        if (len > 0 && (Caml_string.get(str, 0) === /* '+' */43 || Caml_string.get(str, 0) === /* '-' */45 || Caml_string.get(str, 0) === /* ' ' */32)) {
          Caml_bytes.set(res, 0, Caml_string.get(str, 0));
          $$String.blit(str, 1, res, (width$1 - len | 0) + 1 | 0, len - 1 | 0);
        } else if (len > 1 && Caml_string.get(str, 0) === /* '0' */48 && (Caml_string.get(str, 1) === /* 'x' */120 || Caml_string.get(str, 1) === /* 'X' */88)) {
          Caml_bytes.set(res, 1, Caml_string.get(str, 1));
          $$String.blit(str, 2, res, (width$1 - len | 0) + 2 | 0, len - 2 | 0);
        } else {
          $$String.blit(str, 0, res, width$1 - len | 0, len);
        }
        break;
    
  }
  return Caml_bytes.bytes_to_string(res);
}

function fix_int_precision(prec, str) {
  var prec$1 = Pervasives.abs(prec);
  var len = str.length;
  var c = Caml_string.get(str, 0);
  var exit = 0;
  if (c >= 58) {
    if (c >= 71) {
      if (c > 102 || c < 97) {
        return str;
      }
      exit = 2;
    } else {
      if (c < 65) {
        return str;
      }
      exit = 2;
    }
  } else if (c !== 32) {
    if (c < 43) {
      return str;
    }
    switch (c) {
      case 43 :
      case 45 :
          exit = 1;
          break;
      case 44 :
      case 46 :
      case 47 :
          return str;
      case 48 :
          if ((prec$1 + 2 | 0) > len && len > 1 && (Caml_string.get(str, 1) === /* 'x' */120 || Caml_string.get(str, 1) === /* 'X' */88)) {
            var res = Bytes.make(prec$1 + 2 | 0, /* '0' */48);
            Caml_bytes.set(res, 1, Caml_string.get(str, 1));
            $$String.blit(str, 2, res, (prec$1 - len | 0) + 4 | 0, len - 2 | 0);
            return Caml_bytes.bytes_to_string(res);
          }
          exit = 2;
          break;
      case 49 :
      case 50 :
      case 51 :
      case 52 :
      case 53 :
      case 54 :
      case 55 :
      case 56 :
      case 57 :
          exit = 2;
          break;
      
    }
  } else {
    exit = 1;
  }
  switch (exit) {
    case 1 :
        if ((prec$1 + 1 | 0) <= len) {
          return str;
        }
        var res$1 = Bytes.make(prec$1 + 1 | 0, /* '0' */48);
        Caml_bytes.set(res$1, 0, c);
        $$String.blit(str, 1, res$1, (prec$1 - len | 0) + 2 | 0, len - 1 | 0);
        return Caml_bytes.bytes_to_string(res$1);
    case 2 :
        if (prec$1 <= len) {
          return str;
        }
        var res$2 = Bytes.make(prec$1, /* '0' */48);
        $$String.blit(str, 0, res$2, prec$1 - len | 0, len);
        return Caml_bytes.bytes_to_string(res$2);
    
  }
}

function string_to_caml_string(str) {
  var str$1 = $$String.escaped(str);
  var l = str$1.length;
  var res = Bytes.make(l + 2 | 0, /* '"' */34);
  Caml_bytes.caml_blit_string(str$1, 0, res, 1, l);
  return Caml_bytes.bytes_to_string(res);
}

function format_of_iconv(param) {
  switch (param) {
    case /* Int_d */0 :
        return "%d";
    case /* Int_pd */1 :
        return "%+d";
    case /* Int_sd */2 :
        return "% d";
    case /* Int_i */3 :
        return "%i";
    case /* Int_pi */4 :
        return "%+i";
    case /* Int_si */5 :
        return "% i";
    case /* Int_x */6 :
        return "%x";
    case /* Int_Cx */7 :
        return "%#x";
    case /* Int_X */8 :
        return "%X";
    case /* Int_CX */9 :
        return "%#X";
    case /* Int_o */10 :
        return "%o";
    case /* Int_Co */11 :
        return "%#o";
    case /* Int_u */12 :
        return "%u";
    
  }
}

function format_of_iconvL(param) {
  switch (param) {
    case /* Int_d */0 :
        return "%Ld";
    case /* Int_pd */1 :
        return "%+Ld";
    case /* Int_sd */2 :
        return "% Ld";
    case /* Int_i */3 :
        return "%Li";
    case /* Int_pi */4 :
        return "%+Li";
    case /* Int_si */5 :
        return "% Li";
    case /* Int_x */6 :
        return "%Lx";
    case /* Int_Cx */7 :
        return "%#Lx";
    case /* Int_X */8 :
        return "%LX";
    case /* Int_CX */9 :
        return "%#LX";
    case /* Int_o */10 :
        return "%Lo";
    case /* Int_Co */11 :
        return "%#Lo";
    case /* Int_u */12 :
        return "%Lu";
    
  }
}

function format_of_iconvl(param) {
  switch (param) {
    case /* Int_d */0 :
        return "%ld";
    case /* Int_pd */1 :
        return "%+ld";
    case /* Int_sd */2 :
        return "% ld";
    case /* Int_i */3 :
        return "%li";
    case /* Int_pi */4 :
        return "%+li";
    case /* Int_si */5 :
        return "% li";
    case /* Int_x */6 :
        return "%lx";
    case /* Int_Cx */7 :
        return "%#lx";
    case /* Int_X */8 :
        return "%lX";
    case /* Int_CX */9 :
        return "%#lX";
    case /* Int_o */10 :
        return "%lo";
    case /* Int_Co */11 :
        return "%#lo";
    case /* Int_u */12 :
        return "%lu";
    
  }
}

function format_of_iconvn(param) {
  switch (param) {
    case /* Int_d */0 :
        return "%nd";
    case /* Int_pd */1 :
        return "%+nd";
    case /* Int_sd */2 :
        return "% nd";
    case /* Int_i */3 :
        return "%ni";
    case /* Int_pi */4 :
        return "%+ni";
    case /* Int_si */5 :
        return "% ni";
    case /* Int_x */6 :
        return "%nx";
    case /* Int_Cx */7 :
        return "%#nx";
    case /* Int_X */8 :
        return "%nX";
    case /* Int_CX */9 :
        return "%#nX";
    case /* Int_o */10 :
        return "%no";
    case /* Int_Co */11 :
        return "%#no";
    case /* Int_u */12 :
        return "%nu";
    
  }
}

function format_of_fconv(fconv, prec) {
  if (fconv === /* Float_F */15) {
    return "%.12g";
  }
  var prec$1 = Pervasives.abs(prec);
  var symb = char_of_fconv(fconv);
  var buf = {
    ind: 0,
    bytes: Caml_bytes.caml_create_bytes(16)
  };
  buffer_add_char(buf, /* '%' */37);
  bprint_fconv_flag(buf, fconv);
  buffer_add_char(buf, /* '.' */46);
  buffer_add_string(buf, String(prec$1));
  buffer_add_char(buf, symb);
  return buffer_contents(buf);
}

function convert_int(iconv, n) {
  return Caml_format.caml_format_int(format_of_iconv(iconv), n);
}

function convert_int32(iconv, n) {
  return Caml_format.caml_int32_format(format_of_iconvl(iconv), n);
}

function convert_nativeint(iconv, n) {
  return Caml_format.caml_nativeint_format(format_of_iconvn(iconv), n);
}

function convert_int64(iconv, n) {
  return Caml_format.caml_int64_format(format_of_iconvL(iconv), n);
}

function convert_float(fconv, prec, x) {
  if (fconv >= 16) {
    var sign;
    if (fconv >= 17) {
      switch (fconv) {
        case /* Float_H */19 :
            sign = /* '-' */45;
            break;
        case /* Float_ph */17 :
        case /* Float_pH */20 :
            sign = /* '+' */43;
            break;
        case /* Float_sh */18 :
        case /* Float_sH */21 :
            sign = /* ' ' */32;
            break;
        
      }
    } else {
      sign = /* '-' */45;
    }
    var str = Caml_format.caml_hexstring_of_float(x, prec, sign);
    if (fconv >= 19) {
      return Caml_bytes.bytes_to_string(Bytes.uppercase_ascii(Caml_bytes.bytes_of_string(str)));
    } else {
      return str;
    }
  }
  var str$1 = Caml_format.caml_format_float(format_of_fconv(fconv, prec), x);
  if (fconv !== /* Float_F */15) {
    return str$1;
  }
  var len = str$1.length;
  var is_valid = function (_i) {
    while(true) {
      var i = _i;
      if (i === len) {
        return false;
      }
      var match = Caml_string.get(str$1, i);
      if (match > 69 || match < 46) {
        if (match === 101) {
          return true;
        }
        _i = i + 1 | 0;
        continue ;
      }
      if (match > 68 || match < 47) {
        return true;
      }
      _i = i + 1 | 0;
      continue ;
    };
  };
  var match = Pervasives.classify_float(x);
  if (match !== 3) {
    if (match >= 4) {
      return "nan";
    } else if (is_valid(0)) {
      return str$1;
    } else {
      return str$1 + ".";
    }
  } else if (x < 0.0) {
    return "neg_infinity";
  } else {
    return "infinity";
  }
}

function format_caml_char(c) {
  var str = Char.escaped(c);
  var l = str.length;
  var res = Bytes.make(l + 2 | 0, /* '\'' */39);
  Caml_bytes.caml_blit_string(str, 0, res, 1, l);
  return Caml_bytes.bytes_to_string(res);
}

function string_of_fmtty(fmtty) {
  var buf = {
    ind: 0,
    bytes: Caml_bytes.caml_create_bytes(16)
  };
  bprint_fmtty(buf, fmtty);
  return buffer_contents(buf);
}

function make_printf(_k, o, _acc, _fmt) {
  while(true) {
    var fmt = _fmt;
    var acc = _acc;
    var k = _k;
    if (typeof fmt === "number") {
      return Curry._2(k, o, acc);
    }
    switch (fmt.TAG | 0) {
      case /* Char */0 :
          var rest = fmt._0;
          return (function(k,acc,rest){
          return function (c) {
            var new_acc = {
              TAG: /* Acc_data_char */5,
              _0: acc,
              _1: c
            };
            return make_printf(k, o, new_acc, rest);
          }
          }(k,acc,rest));
      case /* Caml_char */1 :
          var rest$1 = fmt._0;
          return (function(k,acc,rest$1){
          return function (c) {
            var new_acc_1 = format_caml_char(c);
            var new_acc = {
              TAG: /* Acc_data_string */4,
              _0: acc,
              _1: new_acc_1
            };
            return make_printf(k, o, new_acc, rest$1);
          }
          }(k,acc,rest$1));
      case /* String */2 :
          return make_padding(k, o, acc, fmt._1, fmt._0, (function (str) {
                        return str;
                      }));
      case /* Caml_string */3 :
          return make_padding(k, o, acc, fmt._1, fmt._0, string_to_caml_string);
      case /* Int */4 :
          return make_int_padding_precision(k, o, acc, fmt._3, fmt._1, fmt._2, convert_int, fmt._0);
      case /* Int32 */5 :
          return make_int_padding_precision(k, o, acc, fmt._3, fmt._1, fmt._2, convert_int32, fmt._0);
      case /* Nativeint */6 :
          return make_int_padding_precision(k, o, acc, fmt._3, fmt._1, fmt._2, convert_nativeint, fmt._0);
      case /* Int64 */7 :
          return make_int_padding_precision(k, o, acc, fmt._3, fmt._1, fmt._2, convert_int64, fmt._0);
      case /* Float */8 :
          var fmt$1 = fmt._3;
          var pad = fmt._1;
          var prec = fmt._2;
          var fconv = fmt._0;
          if (typeof pad === "number") {
            if (typeof prec === "number") {
              if (prec !== 0) {
                return (function(k,acc,fmt$1,fconv){
                return function (p, x) {
                  var str = convert_float(fconv, p, x);
                  return make_printf(k, o, {
                              TAG: /* Acc_data_string */4,
                              _0: acc,
                              _1: str
                            }, fmt$1);
                }
                }(k,acc,fmt$1,fconv));
              } else {
                return (function(k,acc,fmt$1,fconv){
                return function (x) {
                  var str = convert_float(fconv, -6, x);
                  return make_printf(k, o, {
                              TAG: /* Acc_data_string */4,
                              _0: acc,
                              _1: str
                            }, fmt$1);
                }
                }(k,acc,fmt$1,fconv));
              }
            }
            var p = prec._0;
            return (function(k,acc,fmt$1,fconv,p){
            return function (x) {
              var str = convert_float(fconv, p, x);
              return make_printf(k, o, {
                          TAG: /* Acc_data_string */4,
                          _0: acc,
                          _1: str
                        }, fmt$1);
            }
            }(k,acc,fmt$1,fconv,p));
          }
          if (pad.TAG === /* Lit_padding */0) {
            var w = pad._1;
            var padty = pad._0;
            if (typeof prec === "number") {
              if (prec !== 0) {
                return (function(k,acc,fmt$1,fconv,padty,w){
                return function (p, x) {
                  var str = fix_padding(padty, w, convert_float(fconv, p, x));
                  return make_printf(k, o, {
                              TAG: /* Acc_data_string */4,
                              _0: acc,
                              _1: str
                            }, fmt$1);
                }
                }(k,acc,fmt$1,fconv,padty,w));
              } else {
                return (function(k,acc,fmt$1,fconv,padty,w){
                return function (x) {
                  var str = convert_float(fconv, -6, x);
                  var str$prime = fix_padding(padty, w, str);
                  return make_printf(k, o, {
                              TAG: /* Acc_data_string */4,
                              _0: acc,
                              _1: str$prime
                            }, fmt$1);
                }
                }(k,acc,fmt$1,fconv,padty,w));
              }
            }
            var p$1 = prec._0;
            return (function(k,acc,fmt$1,fconv,padty,w,p$1){
            return function (x) {
              var str = fix_padding(padty, w, convert_float(fconv, p$1, x));
              return make_printf(k, o, {
                          TAG: /* Acc_data_string */4,
                          _0: acc,
                          _1: str
                        }, fmt$1);
            }
            }(k,acc,fmt$1,fconv,padty,w,p$1));
          }
          var padty$1 = pad._0;
          if (typeof prec === "number") {
            if (prec !== 0) {
              return (function(k,acc,fmt$1,fconv,padty$1){
              return function (w, p, x) {
                var str = fix_padding(padty$1, w, convert_float(fconv, p, x));
                return make_printf(k, o, {
                            TAG: /* Acc_data_string */4,
                            _0: acc,
                            _1: str
                          }, fmt$1);
              }
              }(k,acc,fmt$1,fconv,padty$1));
            } else {
              return (function(k,acc,fmt$1,fconv,padty$1){
              return function (w, x) {
                var str = convert_float(fconv, -6, x);
                var str$prime = fix_padding(padty$1, w, str);
                return make_printf(k, o, {
                            TAG: /* Acc_data_string */4,
                            _0: acc,
                            _1: str$prime
                          }, fmt$1);
              }
              }(k,acc,fmt$1,fconv,padty$1));
            }
          }
          var p$2 = prec._0;
          return (function(k,acc,fmt$1,fconv,padty$1,p$2){
          return function (w, x) {
            var str = fix_padding(padty$1, w, convert_float(fconv, p$2, x));
            return make_printf(k, o, {
                        TAG: /* Acc_data_string */4,
                        _0: acc,
                        _1: str
                      }, fmt$1);
          }
          }(k,acc,fmt$1,fconv,padty$1,p$2));
      case /* Bool */9 :
          return make_padding(k, o, acc, fmt._1, fmt._0, Pervasives.string_of_bool);
      case /* Flush */10 :
          _fmt = fmt._0;
          _acc = {
            TAG: /* Acc_flush */7,
            _0: acc
          };
          continue ;
      case /* String_literal */11 :
          _fmt = fmt._1;
          _acc = {
            TAG: /* Acc_string_literal */2,
            _0: acc,
            _1: fmt._0
          };
          continue ;
      case /* Char_literal */12 :
          _fmt = fmt._1;
          _acc = {
            TAG: /* Acc_char_literal */3,
            _0: acc,
            _1: fmt._0
          };
          continue ;
      case /* Format_arg */13 :
          var rest$2 = fmt._2;
          var ty = string_of_fmtty(fmt._1);
          return (function(k,acc,rest$2,ty){
          return function (str) {
            return make_printf(k, o, {
                        TAG: /* Acc_data_string */4,
                        _0: acc,
                        _1: ty
                      }, rest$2);
          }
          }(k,acc,rest$2,ty));
      case /* Format_subst */14 :
          var rest$3 = fmt._2;
          var fmtty = fmt._1;
          return (function(k,acc,fmtty,rest$3){
          return function (param) {
            return make_printf(k, o, acc, CamlinternalFormatBasics.concat_fmt(recast(param._0, fmtty), rest$3));
          }
          }(k,acc,fmtty,rest$3));
      case /* Alpha */15 :
          var rest$4 = fmt._0;
          return (function(k,acc,rest$4){
          return function (f, x) {
            return make_printf(k, o, {
                        TAG: /* Acc_delay */6,
                        _0: acc,
                        _1: (function (o) {
                            return Curry._2(f, o, x);
                          })
                      }, rest$4);
          }
          }(k,acc,rest$4));
      case /* Theta */16 :
          var rest$5 = fmt._0;
          return (function(k,acc,rest$5){
          return function (f) {
            return make_printf(k, o, {
                        TAG: /* Acc_delay */6,
                        _0: acc,
                        _1: f
                      }, rest$5);
          }
          }(k,acc,rest$5));
      case /* Formatting_lit */17 :
          _fmt = fmt._1;
          _acc = {
            TAG: /* Acc_formatting_lit */0,
            _0: acc,
            _1: fmt._0
          };
          continue ;
      case /* Formatting_gen */18 :
          var match = fmt._0;
          if (match.TAG === /* Open_tag */0) {
            var rest$6 = fmt._1;
            var k$prime = (function(k,acc,rest$6){
            return function k$prime(koc, kacc) {
              return make_printf(k, koc, {
                          TAG: /* Acc_formatting_gen */1,
                          _0: acc,
                          _1: {
                            TAG: /* Acc_open_tag */0,
                            _0: kacc
                          }
                        }, rest$6);
            }
            }(k,acc,rest$6));
            _fmt = match._0._0;
            _acc = /* End_of_acc */0;
            _k = k$prime;
            continue ;
          }
          var rest$7 = fmt._1;
          var k$prime$1 = (function(k,acc,rest$7){
          return function k$prime$1(koc, kacc) {
            return make_printf(k, koc, {
                        TAG: /* Acc_formatting_gen */1,
                        _0: acc,
                        _1: {
                          TAG: /* Acc_open_box */1,
                          _0: kacc
                        }
                      }, rest$7);
          }
          }(k,acc,rest$7));
          _fmt = match._0._0;
          _acc = /* End_of_acc */0;
          _k = k$prime$1;
          continue ;
      case /* Reader */19 :
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "camlinternalFormat.ml",
                  1525,
                  4
                ],
                Error: new Error()
              };
      case /* Scan_char_set */20 :
          var rest$8 = fmt._2;
          var new_acc = {
            TAG: /* Acc_invalid_arg */8,
            _0: acc,
            _1: "Printf: bad conversion %["
          };
          return (function(k,rest$8,new_acc){
          return function (param) {
            return make_printf(k, o, new_acc, rest$8);
          }
          }(k,rest$8,new_acc));
      case /* Scan_get_counter */21 :
          var rest$9 = fmt._1;
          return (function(k,acc,rest$9){
          return function (n) {
            var new_acc_1 = Caml_format.caml_format_int("%u", n);
            var new_acc = {
              TAG: /* Acc_data_string */4,
              _0: acc,
              _1: new_acc_1
            };
            return make_printf(k, o, new_acc, rest$9);
          }
          }(k,acc,rest$9));
      case /* Scan_next_char */22 :
          var rest$10 = fmt._0;
          return (function(k,acc,rest$10){
          return function (c) {
            var new_acc = {
              TAG: /* Acc_data_char */5,
              _0: acc,
              _1: c
            };
            return make_printf(k, o, new_acc, rest$10);
          }
          }(k,acc,rest$10));
      case /* Ignored_param */23 :
          return make_ignored_param(k, o, acc, fmt._0, fmt._1);
      case /* Custom */24 :
          return make_custom(k, o, acc, fmt._2, fmt._0, Curry._1(fmt._1, undefined));
      
    }
  };
}

function make_ignored_param(k, o, acc, ign, fmt) {
  if (typeof ign !== "number") {
    if (ign.TAG === /* Ignored_format_subst */9) {
      return make_from_fmtty(k, o, acc, ign._1, fmt);
    } else {
      return make_invalid_arg(k, o, acc, fmt);
    }
  }
  if (ign !== /* Ignored_reader */2) {
    return make_invalid_arg(k, o, acc, fmt);
  }
  throw {
        RE_EXN_ID: "Assert_failure",
        _1: [
          "camlinternalFormat.ml",
          1593,
          39
        ],
        Error: new Error()
      };
}

function make_from_fmtty(k, o, acc, fmtty, fmt) {
  if (typeof fmtty === "number") {
    return make_invalid_arg(k, o, acc, fmt);
  }
  switch (fmtty.TAG | 0) {
    case /* Char_ty */0 :
        var rest = fmtty._0;
        return function (param) {
          return make_from_fmtty(k, o, acc, rest, fmt);
        };
    case /* String_ty */1 :
        var rest$1 = fmtty._0;
        return function (param) {
          return make_from_fmtty(k, o, acc, rest$1, fmt);
        };
    case /* Int_ty */2 :
        var rest$2 = fmtty._0;
        return function (param) {
          return make_from_fmtty(k, o, acc, rest$2, fmt);
        };
    case /* Int32_ty */3 :
        var rest$3 = fmtty._0;
        return function (param) {
          return make_from_fmtty(k, o, acc, rest$3, fmt);
        };
    case /* Nativeint_ty */4 :
        var rest$4 = fmtty._0;
        return function (param) {
          return make_from_fmtty(k, o, acc, rest$4, fmt);
        };
    case /* Int64_ty */5 :
        var rest$5 = fmtty._0;
        return function (param) {
          return make_from_fmtty(k, o, acc, rest$5, fmt);
        };
    case /* Float_ty */6 :
        var rest$6 = fmtty._0;
        return function (param) {
          return make_from_fmtty(k, o, acc, rest$6, fmt);
        };
    case /* Bool_ty */7 :
        var rest$7 = fmtty._0;
        return function (param) {
          return make_from_fmtty(k, o, acc, rest$7, fmt);
        };
    case /* Format_arg_ty */8 :
        var rest$8 = fmtty._1;
        return function (param) {
          return make_from_fmtty(k, o, acc, rest$8, fmt);
        };
    case /* Format_subst_ty */9 :
        var rest$9 = fmtty._2;
        var ty = trans(symm(fmtty._0), fmtty._1);
        return function (param) {
          return make_from_fmtty(k, o, acc, CamlinternalFormatBasics.concat_fmtty(ty, rest$9), fmt);
        };
    case /* Alpha_ty */10 :
        var rest$10 = fmtty._0;
        return function (param, param$1) {
          return make_from_fmtty(k, o, acc, rest$10, fmt);
        };
    case /* Theta_ty */11 :
        var rest$11 = fmtty._0;
        return function (param) {
          return make_from_fmtty(k, o, acc, rest$11, fmt);
        };
    case /* Any_ty */12 :
        var rest$12 = fmtty._0;
        return function (param) {
          return make_from_fmtty(k, o, acc, rest$12, fmt);
        };
    case /* Reader_ty */13 :
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "camlinternalFormat.ml",
                1616,
                31
              ],
              Error: new Error()
            };
    case /* Ignored_reader_ty */14 :
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "camlinternalFormat.ml",
                1617,
                31
              ],
              Error: new Error()
            };
    
  }
}

function make_invalid_arg(k, o, acc, fmt) {
  return make_printf(k, o, {
              TAG: /* Acc_invalid_arg */8,
              _0: acc,
              _1: "Printf: bad conversion %_"
            }, fmt);
}

function make_padding(k, o, acc, fmt, pad, trans) {
  if (typeof pad === "number") {
    return function (x) {
      var new_acc_1 = Curry._1(trans, x);
      var new_acc = {
        TAG: /* Acc_data_string */4,
        _0: acc,
        _1: new_acc_1
      };
      return make_printf(k, o, new_acc, fmt);
    };
  }
  if (pad.TAG === /* Lit_padding */0) {
    var width = pad._1;
    var padty = pad._0;
    return function (x) {
      var new_acc_1 = fix_padding(padty, width, Curry._1(trans, x));
      var new_acc = {
        TAG: /* Acc_data_string */4,
        _0: acc,
        _1: new_acc_1
      };
      return make_printf(k, o, new_acc, fmt);
    };
  }
  var padty$1 = pad._0;
  return function (w, x) {
    var new_acc_1 = fix_padding(padty$1, w, Curry._1(trans, x));
    var new_acc = {
      TAG: /* Acc_data_string */4,
      _0: acc,
      _1: new_acc_1
    };
    return make_printf(k, o, new_acc, fmt);
  };
}

function make_int_padding_precision(k, o, acc, fmt, pad, prec, trans, iconv) {
  if (typeof pad === "number") {
    if (typeof prec === "number") {
      if (prec !== 0) {
        return function (p, x) {
          var str = fix_int_precision(p, Curry._2(trans, iconv, x));
          return make_printf(k, o, {
                      TAG: /* Acc_data_string */4,
                      _0: acc,
                      _1: str
                    }, fmt);
        };
      } else {
        return function (x) {
          var str = Curry._2(trans, iconv, x);
          return make_printf(k, o, {
                      TAG: /* Acc_data_string */4,
                      _0: acc,
                      _1: str
                    }, fmt);
        };
      }
    }
    var p = prec._0;
    return function (x) {
      var str = fix_int_precision(p, Curry._2(trans, iconv, x));
      return make_printf(k, o, {
                  TAG: /* Acc_data_string */4,
                  _0: acc,
                  _1: str
                }, fmt);
    };
  }
  if (pad.TAG === /* Lit_padding */0) {
    var w = pad._1;
    var padty = pad._0;
    if (typeof prec === "number") {
      if (prec !== 0) {
        return function (p, x) {
          var str = fix_padding(padty, w, fix_int_precision(p, Curry._2(trans, iconv, x)));
          return make_printf(k, o, {
                      TAG: /* Acc_data_string */4,
                      _0: acc,
                      _1: str
                    }, fmt);
        };
      } else {
        return function (x) {
          var str = fix_padding(padty, w, Curry._2(trans, iconv, x));
          return make_printf(k, o, {
                      TAG: /* Acc_data_string */4,
                      _0: acc,
                      _1: str
                    }, fmt);
        };
      }
    }
    var p$1 = prec._0;
    return function (x) {
      var str = fix_padding(padty, w, fix_int_precision(p$1, Curry._2(trans, iconv, x)));
      return make_printf(k, o, {
                  TAG: /* Acc_data_string */4,
                  _0: acc,
                  _1: str
                }, fmt);
    };
  }
  var padty$1 = pad._0;
  if (typeof prec === "number") {
    if (prec !== 0) {
      return function (w, p, x) {
        var str = fix_padding(padty$1, w, fix_int_precision(p, Curry._2(trans, iconv, x)));
        return make_printf(k, o, {
                    TAG: /* Acc_data_string */4,
                    _0: acc,
                    _1: str
                  }, fmt);
      };
    } else {
      return function (w, x) {
        var str = fix_padding(padty$1, w, Curry._2(trans, iconv, x));
        return make_printf(k, o, {
                    TAG: /* Acc_data_string */4,
                    _0: acc,
                    _1: str
                  }, fmt);
      };
    }
  }
  var p$2 = prec._0;
  return function (w, x) {
    var str = fix_padding(padty$1, w, fix_int_precision(p$2, Curry._2(trans, iconv, x)));
    return make_printf(k, o, {
                TAG: /* Acc_data_string */4,
                _0: acc,
                _1: str
              }, fmt);
  };
}

function make_custom(k, o, acc, rest, arity, f) {
  if (!arity) {
    return make_printf(k, o, {
                TAG: /* Acc_data_string */4,
                _0: acc,
                _1: f
              }, rest);
  }
  var arity$1 = arity._0;
  return function (x) {
    return make_custom(k, o, acc, rest, arity$1, Curry._1(f, x));
  };
}

function make_iprintf(_k, o, _fmt) {
  while(true) {
    var fmt = _fmt;
    var k = _k;
    var exit = 0;
    if (typeof fmt === "number") {
      return Curry._1(k, o);
    }
    switch (fmt.TAG | 0) {
      case /* String */2 :
          var exit$1 = 0;
          var tmp = fmt._0;
          if (typeof tmp === "number" || tmp.TAG === /* Lit_padding */0) {
            exit$1 = 4;
          } else {
            var partial_arg = make_iprintf(k, o, fmt._1);
            var partial_arg$1 = (function(partial_arg){
            return function partial_arg$1(param) {
              return partial_arg;
            }
            }(partial_arg));
            return function (param) {
              return partial_arg$1;
            };
          }
          if (exit$1 === 4) {
            var partial_arg$2 = make_iprintf(k, o, fmt._1);
            return (function(partial_arg$2){
            return function (param) {
              return partial_arg$2;
            }
            }(partial_arg$2));
          }
          break;
      case /* Caml_string */3 :
          var exit$2 = 0;
          var tmp$1 = fmt._0;
          if (typeof tmp$1 === "number" || tmp$1.TAG === /* Lit_padding */0) {
            exit$2 = 4;
          } else {
            var partial_arg$3 = make_iprintf(k, o, fmt._1);
            var partial_arg$4 = (function(partial_arg$3){
            return function partial_arg$4(param) {
              return partial_arg$3;
            }
            }(partial_arg$3));
            return function (param) {
              return partial_arg$4;
            };
          }
          if (exit$2 === 4) {
            var partial_arg$5 = make_iprintf(k, o, fmt._1);
            return (function(partial_arg$5){
            return function (param) {
              return partial_arg$5;
            }
            }(partial_arg$5));
          }
          break;
      case /* Bool */9 :
          var exit$3 = 0;
          var tmp$2 = fmt._0;
          if (typeof tmp$2 === "number" || tmp$2.TAG === /* Lit_padding */0) {
            exit$3 = 4;
          } else {
            var partial_arg$6 = make_iprintf(k, o, fmt._1);
            var partial_arg$7 = (function(partial_arg$6){
            return function partial_arg$7(param) {
              return partial_arg$6;
            }
            }(partial_arg$6));
            return function (param) {
              return partial_arg$7;
            };
          }
          if (exit$3 === 4) {
            var partial_arg$8 = make_iprintf(k, o, fmt._1);
            return (function(partial_arg$8){
            return function (param) {
              return partial_arg$8;
            }
            }(partial_arg$8));
          }
          break;
      case /* Flush */10 :
          _fmt = fmt._0;
          continue ;
      case /* Format_subst */14 :
          var rest = fmt._2;
          var fmtty = fmt._1;
          return (function(k,fmtty,rest){
          return function (param) {
            return make_iprintf(k, o, CamlinternalFormatBasics.concat_fmt(recast(param._0, fmtty), rest));
          }
          }(k,fmtty,rest));
      case /* Alpha */15 :
          var partial_arg$9 = make_iprintf(k, o, fmt._0);
          var partial_arg$10 = (function(partial_arg$9){
          return function partial_arg$10(param) {
            return partial_arg$9;
          }
          }(partial_arg$9));
          return function (param) {
            return partial_arg$10;
          };
      case /* String_literal */11 :
      case /* Char_literal */12 :
      case /* Formatting_lit */17 :
          exit = 2;
          break;
      case /* Formatting_gen */18 :
          var match = fmt._0;
          if (match.TAG === /* Open_tag */0) {
            var rest$1 = fmt._1;
            _fmt = match._0._0;
            _k = (function(k,rest$1){
            return function (koc) {
              return make_iprintf(k, koc, rest$1);
            }
            }(k,rest$1));
            continue ;
          }
          var rest$2 = fmt._1;
          _fmt = match._0._0;
          _k = (function(k,rest$2){
          return function (koc) {
            return make_iprintf(k, koc, rest$2);
          }
          }(k,rest$2));
          continue ;
      case /* Reader */19 :
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "camlinternalFormat.ml",
                  1797,
                  8
                ],
                Error: new Error()
              };
      case /* Format_arg */13 :
      case /* Scan_char_set */20 :
          exit = 3;
          break;
      case /* Scan_get_counter */21 :
          var partial_arg$11 = make_iprintf(k, o, fmt._1);
          return (function(partial_arg$11){
          return function (param) {
            return partial_arg$11;
          }
          }(partial_arg$11));
      case /* Char */0 :
      case /* Caml_char */1 :
      case /* Theta */16 :
      case /* Scan_next_char */22 :
          exit = 1;
          break;
      case /* Ignored_param */23 :
          return make_ignored_param((function(k){
                    return function (x, param) {
                      return Curry._1(k, x);
                    }
                    }(k)), o, /* End_of_acc */0, fmt._0, fmt._1);
      case /* Custom */24 :
          return fn_of_custom_arity(k, o, fmt._2, fmt._0);
      default:
        var fmt$1 = fmt._3;
        var pad = fmt._1;
        var prec = fmt._2;
        if (typeof pad === "number") {
          if (typeof prec === "number") {
            if (prec !== 0) {
              var partial_arg$12 = make_iprintf(k, o, fmt$1);
              var partial_arg$13 = (function(partial_arg$12){
              return function partial_arg$13(param) {
                return partial_arg$12;
              }
              }(partial_arg$12));
              return function (param) {
                return partial_arg$13;
              };
            }
            var partial_arg$14 = make_iprintf(k, o, fmt$1);
            return (function(partial_arg$14){
            return function (param) {
              return partial_arg$14;
            }
            }(partial_arg$14));
          }
          var partial_arg$15 = make_iprintf(k, o, fmt$1);
          return (function(partial_arg$15){
          return function (param) {
            return partial_arg$15;
          }
          }(partial_arg$15));
        }
        if (pad.TAG === /* Lit_padding */0) {
          if (typeof prec === "number") {
            if (prec !== 0) {
              var partial_arg$16 = make_iprintf(k, o, fmt$1);
              var partial_arg$17 = (function(partial_arg$16){
              return function partial_arg$17(param) {
                return partial_arg$16;
              }
              }(partial_arg$16));
              return function (param) {
                return partial_arg$17;
              };
            }
            var partial_arg$18 = make_iprintf(k, o, fmt$1);
            return (function(partial_arg$18){
            return function (param) {
              return partial_arg$18;
            }
            }(partial_arg$18));
          }
          var partial_arg$19 = make_iprintf(k, o, fmt$1);
          return (function(partial_arg$19){
          return function (param) {
            return partial_arg$19;
          }
          }(partial_arg$19));
        }
        if (typeof prec === "number") {
          if (prec !== 0) {
            var partial_arg$20 = make_iprintf(k, o, fmt$1);
            var partial_arg$21 = (function(partial_arg$20){
            return function partial_arg$21(param) {
              return partial_arg$20;
            }
            }(partial_arg$20));
            var partial_arg$22 = function (param) {
              return partial_arg$21;
            };
            return function (param) {
              return partial_arg$22;
            };
          }
          var partial_arg$23 = make_iprintf(k, o, fmt$1);
          var partial_arg$24 = (function(partial_arg$23){
          return function partial_arg$24(param) {
            return partial_arg$23;
          }
          }(partial_arg$23));
          return function (param) {
            return partial_arg$24;
          };
        }
        var partial_arg$25 = make_iprintf(k, o, fmt$1);
        var partial_arg$26 = (function(partial_arg$25){
        return function partial_arg$26(param) {
          return partial_arg$25;
        }
        }(partial_arg$25));
        return function (param) {
          return partial_arg$26;
        };
    }
    switch (exit) {
      case 1 :
          var partial_arg$27 = make_iprintf(k, o, fmt._0);
          return (function(partial_arg$27){
          return function (param) {
            return partial_arg$27;
          }
          }(partial_arg$27));
      case 2 :
          _fmt = fmt._1;
          continue ;
      case 3 :
          var partial_arg$28 = make_iprintf(k, o, fmt._2);
          return (function(partial_arg$28){
          return function (param) {
            return partial_arg$28;
          }
          }(partial_arg$28));
      
    }
  };
}

function fn_of_custom_arity(k, o, fmt, arity) {
  if (!arity) {
    return make_iprintf(k, o, fmt);
  }
  var partial_arg = fn_of_custom_arity(k, o, fmt, arity._0);
  return function (param) {
    return partial_arg;
  };
}

function output_acc(o, _acc) {
  while(true) {
    var acc = _acc;
    var exit = 0;
    if (typeof acc === "number") {
      return ;
    }
    switch (acc.TAG | 0) {
      case /* Acc_formatting_lit */0 :
          var s = string_of_formatting_lit(acc._1);
          output_acc(o, acc._0);
          return Pervasives.output_string(o, s);
      case /* Acc_formatting_gen */1 :
          var acc$prime = acc._1;
          var p = acc._0;
          if (acc$prime.TAG === /* Acc_open_tag */0) {
            output_acc(o, p);
            Pervasives.output_string(o, "@{");
            _acc = acc$prime._0;
            continue ;
          }
          output_acc(o, p);
          Pervasives.output_string(o, "@[");
          _acc = acc$prime._0;
          continue ;
      case /* Acc_string_literal */2 :
      case /* Acc_data_string */4 :
          exit = 1;
          break;
      case /* Acc_char_literal */3 :
      case /* Acc_data_char */5 :
          exit = 2;
          break;
      case /* Acc_delay */6 :
          output_acc(o, acc._0);
          return Curry._1(acc._1, o);
      case /* Acc_flush */7 :
          output_acc(o, acc._0);
          return Caml_io.caml_ml_flush(o);
      case /* Acc_invalid_arg */8 :
          output_acc(o, acc._0);
          throw {
                RE_EXN_ID: "Invalid_argument",
                _1: acc._1,
                Error: new Error()
              };
      
    }
    switch (exit) {
      case 1 :
          output_acc(o, acc._0);
          return Pervasives.output_string(o, acc._1);
      case 2 :
          output_acc(o, acc._0);
          return Caml_io.caml_ml_output_char(o, acc._1);
      
    }
  };
}

function bufput_acc(b, _acc) {
  while(true) {
    var acc = _acc;
    var exit = 0;
    if (typeof acc === "number") {
      return ;
    }
    switch (acc.TAG | 0) {
      case /* Acc_formatting_lit */0 :
          var s = string_of_formatting_lit(acc._1);
          bufput_acc(b, acc._0);
          return $$Buffer.add_string(b, s);
      case /* Acc_formatting_gen */1 :
          var acc$prime = acc._1;
          var p = acc._0;
          if (acc$prime.TAG === /* Acc_open_tag */0) {
            bufput_acc(b, p);
            $$Buffer.add_string(b, "@{");
            _acc = acc$prime._0;
            continue ;
          }
          bufput_acc(b, p);
          $$Buffer.add_string(b, "@[");
          _acc = acc$prime._0;
          continue ;
      case /* Acc_string_literal */2 :
      case /* Acc_data_string */4 :
          exit = 1;
          break;
      case /* Acc_char_literal */3 :
      case /* Acc_data_char */5 :
          exit = 2;
          break;
      case /* Acc_delay */6 :
          bufput_acc(b, acc._0);
          return Curry._1(acc._1, b);
      case /* Acc_flush */7 :
          _acc = acc._0;
          continue ;
      case /* Acc_invalid_arg */8 :
          bufput_acc(b, acc._0);
          throw {
                RE_EXN_ID: "Invalid_argument",
                _1: acc._1,
                Error: new Error()
              };
      
    }
    switch (exit) {
      case 1 :
          bufput_acc(b, acc._0);
          return $$Buffer.add_string(b, acc._1);
      case 2 :
          bufput_acc(b, acc._0);
          return $$Buffer.add_char(b, acc._1);
      
    }
  };
}

function strput_acc(b, _acc) {
  while(true) {
    var acc = _acc;
    var exit = 0;
    if (typeof acc === "number") {
      return ;
    }
    switch (acc.TAG | 0) {
      case /* Acc_formatting_lit */0 :
          var s = string_of_formatting_lit(acc._1);
          strput_acc(b, acc._0);
          return $$Buffer.add_string(b, s);
      case /* Acc_formatting_gen */1 :
          var acc$prime = acc._1;
          var p = acc._0;
          if (acc$prime.TAG === /* Acc_open_tag */0) {
            strput_acc(b, p);
            $$Buffer.add_string(b, "@{");
            _acc = acc$prime._0;
            continue ;
          }
          strput_acc(b, p);
          $$Buffer.add_string(b, "@[");
          _acc = acc$prime._0;
          continue ;
      case /* Acc_string_literal */2 :
      case /* Acc_data_string */4 :
          exit = 1;
          break;
      case /* Acc_char_literal */3 :
      case /* Acc_data_char */5 :
          exit = 2;
          break;
      case /* Acc_delay */6 :
          strput_acc(b, acc._0);
          return $$Buffer.add_string(b, Curry._1(acc._1, undefined));
      case /* Acc_flush */7 :
          _acc = acc._0;
          continue ;
      case /* Acc_invalid_arg */8 :
          strput_acc(b, acc._0);
          throw {
                RE_EXN_ID: "Invalid_argument",
                _1: acc._1,
                Error: new Error()
              };
      
    }
    switch (exit) {
      case 1 :
          strput_acc(b, acc._0);
          return $$Buffer.add_string(b, acc._1);
      case 2 :
          strput_acc(b, acc._0);
          return $$Buffer.add_char(b, acc._1);
      
    }
  };
}

function failwith_message(param) {
  var buf = $$Buffer.create(256);
  var k = function (param, acc) {
    strput_acc(buf, acc);
    var s = $$Buffer.contents(buf);
    throw {
          RE_EXN_ID: "Failure",
          _1: s,
          Error: new Error()
        };
  };
  return make_printf(k, undefined, /* End_of_acc */0, param._0);
}

function open_box_of_string(str) {
  if (str === "") {
    return [
            0,
            /* Pp_box */4
          ];
  }
  var len = str.length;
  var invalid_box = function (param) {
    return Curry._1(failwith_message(/* Format */{
                    _0: {
                      TAG: /* String_literal */11,
                      _0: "invalid box description ",
                      _1: {
                        TAG: /* Caml_string */3,
                        _0: /* No_padding */0,
                        _1: /* End_of_format */0
                      }
                    },
                    _1: "invalid box description %S"
                  }), str);
  };
  var parse_spaces = function (_i) {
    while(true) {
      var i = _i;
      if (i === len) {
        return i;
      }
      var match = Caml_string.get(str, i);
      if (match !== 9) {
        if (match !== 32) {
          return i;
        }
        _i = i + 1 | 0;
        continue ;
      }
      _i = i + 1 | 0;
      continue ;
    };
  };
  var parse_lword = function (i, _j) {
    while(true) {
      var j = _j;
      if (j === len) {
        return j;
      }
      var match = Caml_string.get(str, j);
      if (match > 122 || match < 97) {
        return j;
      }
      _j = j + 1 | 0;
      continue ;
    };
  };
  var parse_int = function (i, _j) {
    while(true) {
      var j = _j;
      if (j === len) {
        return j;
      }
      var match = Caml_string.get(str, j);
      if (match >= 48) {
        if (match >= 58) {
          return j;
        }
        _j = j + 1 | 0;
        continue ;
      }
      if (match !== 45) {
        return j;
      }
      _j = j + 1 | 0;
      continue ;
    };
  };
  var wstart = parse_spaces(0);
  var wend = parse_lword(wstart, wstart);
  var box_name = $$String.sub(str, wstart, wend - wstart | 0);
  var nstart = parse_spaces(wend);
  var nend = parse_int(nstart, nstart);
  var indent;
  if (nstart === nend) {
    indent = 0;
  } else {
    try {
      indent = Caml_format.caml_int_of_string($$String.sub(str, nstart, nend - nstart | 0));
    }
    catch (raw_exn){
      var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
      if (exn.RE_EXN_ID === "Failure") {
        indent = invalid_box(undefined);
      } else {
        throw exn;
      }
    }
  }
  var exp_end = parse_spaces(nend);
  if (exp_end !== len) {
    invalid_box(undefined);
  }
  var box_type;
  switch (box_name) {
    case "" :
    case "b" :
        box_type = /* Pp_box */4;
        break;
    case "h" :
        box_type = /* Pp_hbox */0;
        break;
    case "hov" :
        box_type = /* Pp_hovbox */3;
        break;
    case "hv" :
        box_type = /* Pp_hvbox */2;
        break;
    case "v" :
        box_type = /* Pp_vbox */1;
        break;
    default:
      box_type = invalid_box(undefined);
  }
  return [
          indent,
          box_type
        ];
}

function make_padding_fmt_ebb(pad, fmt) {
  if (typeof pad === "number") {
    return /* Padding_fmt_EBB */{
            _0: /* No_padding */0,
            _1: fmt
          };
  } else if (pad.TAG === /* Lit_padding */0) {
    return /* Padding_fmt_EBB */{
            _0: {
              TAG: /* Lit_padding */0,
              _0: pad._0,
              _1: pad._1
            },
            _1: fmt
          };
  } else {
    return /* Padding_fmt_EBB */{
            _0: {
              TAG: /* Arg_padding */1,
              _0: pad._0
            },
            _1: fmt
          };
  }
}

function make_precision_fmt_ebb(prec, fmt) {
  if (typeof prec === "number") {
    if (prec !== 0) {
      return /* Precision_fmt_EBB */{
              _0: /* Arg_precision */1,
              _1: fmt
            };
    } else {
      return /* Precision_fmt_EBB */{
              _0: /* No_precision */0,
              _1: fmt
            };
    }
  } else {
    return /* Precision_fmt_EBB */{
            _0: /* Lit_precision */{
              _0: prec._0
            },
            _1: fmt
          };
  }
}

function make_padprec_fmt_ebb(pad, prec, fmt) {
  var match = make_precision_fmt_ebb(prec, fmt);
  var fmt$prime = match._1;
  var prec$1 = match._0;
  if (typeof pad === "number") {
    return /* Padprec_fmt_EBB */{
            _0: /* No_padding */0,
            _1: prec$1,
            _2: fmt$prime
          };
  } else if (pad.TAG === /* Lit_padding */0) {
    return /* Padprec_fmt_EBB */{
            _0: {
              TAG: /* Lit_padding */0,
              _0: pad._0,
              _1: pad._1
            },
            _1: prec$1,
            _2: fmt$prime
          };
  } else {
    return /* Padprec_fmt_EBB */{
            _0: {
              TAG: /* Arg_padding */1,
              _0: pad._0
            },
            _1: prec$1,
            _2: fmt$prime
          };
  }
}

function fmt_ebb_of_string(legacy_behavior, str) {
  var legacy_behavior$1 = legacy_behavior !== undefined ? legacy_behavior : true;
  var invalid_format_message = function (str_ind, msg) {
    return Curry._3(failwith_message(/* Format */{
                    _0: {
                      TAG: /* String_literal */11,
                      _0: "invalid format ",
                      _1: {
                        TAG: /* Caml_string */3,
                        _0: /* No_padding */0,
                        _1: {
                          TAG: /* String_literal */11,
                          _0: ": at character number ",
                          _1: {
                            TAG: /* Int */4,
                            _0: /* Int_d */0,
                            _1: /* No_padding */0,
                            _2: /* No_precision */0,
                            _3: {
                              TAG: /* String_literal */11,
                              _0: ", ",
                              _1: {
                                TAG: /* String */2,
                                _0: /* No_padding */0,
                                _1: /* End_of_format */0
                              }
                            }
                          }
                        }
                      }
                    },
                    _1: "invalid format %S: at character number %d, %s"
                  }), str, str_ind, msg);
  };
  var invalid_format_without = function (str_ind, c, s) {
    return Curry._4(failwith_message(/* Format */{
                    _0: {
                      TAG: /* String_literal */11,
                      _0: "invalid format ",
                      _1: {
                        TAG: /* Caml_string */3,
                        _0: /* No_padding */0,
                        _1: {
                          TAG: /* String_literal */11,
                          _0: ": at character number ",
                          _1: {
                            TAG: /* Int */4,
                            _0: /* Int_d */0,
                            _1: /* No_padding */0,
                            _2: /* No_precision */0,
                            _3: {
                              TAG: /* String_literal */11,
                              _0: ", '",
                              _1: {
                                TAG: /* Char */0,
                                _0: {
                                  TAG: /* String_literal */11,
                                  _0: "' without ",
                                  _1: {
                                    TAG: /* String */2,
                                    _0: /* No_padding */0,
                                    _1: /* End_of_format */0
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    _1: "invalid format %S: at character number %d, '%c' without %s"
                  }), str, str_ind, c, s);
  };
  var expected_character = function (str_ind, expected, read) {
    return Curry._4(failwith_message(/* Format */{
                    _0: {
                      TAG: /* String_literal */11,
                      _0: "invalid format ",
                      _1: {
                        TAG: /* Caml_string */3,
                        _0: /* No_padding */0,
                        _1: {
                          TAG: /* String_literal */11,
                          _0: ": at character number ",
                          _1: {
                            TAG: /* Int */4,
                            _0: /* Int_d */0,
                            _1: /* No_padding */0,
                            _2: /* No_precision */0,
                            _3: {
                              TAG: /* String_literal */11,
                              _0: ", ",
                              _1: {
                                TAG: /* String */2,
                                _0: /* No_padding */0,
                                _1: {
                                  TAG: /* String_literal */11,
                                  _0: " expected, read ",
                                  _1: {
                                    TAG: /* Caml_char */1,
                                    _0: /* End_of_format */0
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    _1: "invalid format %S: at character number %d, %s expected, read %C"
                  }), str, str_ind, expected, read);
  };
  var incompatible_flag = function (pct_ind, str_ind, symb, option) {
    var subfmt = $$String.sub(str, pct_ind, str_ind - pct_ind | 0);
    return Curry._5(failwith_message(/* Format */{
                    _0: {
                      TAG: /* String_literal */11,
                      _0: "invalid format ",
                      _1: {
                        TAG: /* Caml_string */3,
                        _0: /* No_padding */0,
                        _1: {
                          TAG: /* String_literal */11,
                          _0: ": at character number ",
                          _1: {
                            TAG: /* Int */4,
                            _0: /* Int_d */0,
                            _1: /* No_padding */0,
                            _2: /* No_precision */0,
                            _3: {
                              TAG: /* String_literal */11,
                              _0: ", ",
                              _1: {
                                TAG: /* String */2,
                                _0: /* No_padding */0,
                                _1: {
                                  TAG: /* String_literal */11,
                                  _0: " is incompatible with '",
                                  _1: {
                                    TAG: /* Char */0,
                                    _0: {
                                      TAG: /* String_literal */11,
                                      _0: "' in sub-format ",
                                      _1: {
                                        TAG: /* Caml_string */3,
                                        _0: /* No_padding */0,
                                        _1: /* End_of_format */0
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    _1: "invalid format %S: at character number %d, %s is incompatible with '%c' in sub-format %S"
                  }), str, pct_ind, option, symb, subfmt);
  };
  var parse_positive = function (_str_ind, end_ind, _acc) {
    while(true) {
      var acc = _acc;
      var str_ind = _str_ind;
      if (str_ind === end_ind) {
        invalid_format_message(end_ind, "unexpected end of format");
      }
      var c = Caml_string.get(str, str_ind);
      if (c > 57 || c < 48) {
        return [
                str_ind,
                acc
              ];
      }
      var new_acc = Math.imul(acc, 10) + (c - /* '0' */48 | 0) | 0;
      _acc = new_acc;
      _str_ind = str_ind + 1 | 0;
      continue ;
    };
  };
  var parse_after_padding = function (pct_ind, str_ind, end_ind, minus, plus, hash, space, ign, pad) {
    if (str_ind === end_ind) {
      invalid_format_message(end_ind, "unexpected end of format");
    }
    var symb = Caml_string.get(str, str_ind);
    if (symb !== 46) {
      return parse_conversion(pct_ind, str_ind + 1 | 0, end_ind, plus, hash, space, ign, pad, /* No_precision */0, pad, symb);
    } else {
      var str_ind$1 = str_ind + 1 | 0;
      if (str_ind$1 === end_ind) {
        invalid_format_message(end_ind, "unexpected end of format");
      }
      var parse_literal = function (minus, str_ind) {
        var match = parse_positive(str_ind, end_ind, 0);
        return parse_after_precision(pct_ind, match[0], end_ind, minus, plus, hash, space, ign, pad, /* Lit_precision */{
                    _0: match[1]
                  });
      };
      var symb$1 = Caml_string.get(str, str_ind$1);
      var exit = 0;
      if (symb$1 >= 48) {
        if (symb$1 < 58) {
          return parse_literal(minus, str_ind$1);
        }
        
      } else if (symb$1 >= 42) {
        switch (symb$1) {
          case 42 :
              return parse_after_precision(pct_ind, str_ind$1 + 1 | 0, end_ind, minus, plus, hash, space, ign, pad, /* Arg_precision */1);
          case 43 :
          case 45 :
              exit = 2;
              break;
          case 44 :
          case 46 :
          case 47 :
              break;
          
        }
      }
      if (exit === 2 && legacy_behavior$1) {
        return parse_literal(minus || symb$1 === /* '-' */45, str_ind$1 + 1 | 0);
      }
      if (legacy_behavior$1) {
        return parse_after_precision(pct_ind, str_ind$1, end_ind, minus, plus, hash, space, ign, pad, /* Lit_precision */{
                    _0: 0
                  });
      } else {
        return invalid_format_without(str_ind$1 - 1 | 0, /* '.' */46, "precision");
      }
    }
  };
  var parse_spaces = function (_str_ind, end_ind) {
    while(true) {
      var str_ind = _str_ind;
      if (str_ind === end_ind) {
        invalid_format_message(end_ind, "unexpected end of format");
      }
      if (Caml_string.get(str, str_ind) !== /* ' ' */32) {
        return str_ind;
      }
      _str_ind = str_ind + 1 | 0;
      continue ;
    };
  };
  var search_subformat_end = function (_str_ind, end_ind, c) {
    while(true) {
      var str_ind = _str_ind;
      if (str_ind === end_ind) {
        Curry._3(failwith_message(/* Format */{
                  _0: {
                    TAG: /* String_literal */11,
                    _0: "invalid format ",
                    _1: {
                      TAG: /* Caml_string */3,
                      _0: /* No_padding */0,
                      _1: {
                        TAG: /* String_literal */11,
                        _0: ": unclosed sub-format, expected \"",
                        _1: {
                          TAG: /* Char_literal */12,
                          _0: /* '%' */37,
                          _1: {
                            TAG: /* Char */0,
                            _0: {
                              TAG: /* String_literal */11,
                              _0: "\" at character number ",
                              _1: {
                                TAG: /* Int */4,
                                _0: /* Int_d */0,
                                _1: /* No_padding */0,
                                _2: /* No_precision */0,
                                _3: /* End_of_format */0
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  _1: "invalid format %S: unclosed sub-format, expected \"%%%c\" at character number %d"
                }), str, c, end_ind);
      }
      var match = Caml_string.get(str, str_ind);
      if (match !== 37) {
        _str_ind = str_ind + 1 | 0;
        continue ;
      }
      if ((str_ind + 1 | 0) === end_ind) {
        invalid_format_message(end_ind, "unexpected end of format");
      }
      if (Caml_string.get(str, str_ind + 1 | 0) === c) {
        return str_ind;
      }
      var match$1 = Caml_string.get(str, str_ind + 1 | 0);
      if (match$1 >= 95) {
        if (match$1 >= 123) {
          if (match$1 < 126) {
            switch (match$1) {
              case 123 :
                  var sub_end = search_subformat_end(str_ind + 2 | 0, end_ind, /* '}' */125);
                  _str_ind = sub_end + 2 | 0;
                  continue ;
              case 124 :
                  break;
              case 125 :
                  return expected_character(str_ind + 1 | 0, "character ')'", /* '}' */125);
              
            }
          }
          
        } else if (match$1 < 96) {
          if ((str_ind + 2 | 0) === end_ind) {
            invalid_format_message(end_ind, "unexpected end of format");
          }
          var match$2 = Caml_string.get(str, str_ind + 2 | 0);
          if (match$2 !== 40) {
            if (match$2 !== 123) {
              _str_ind = str_ind + 3 | 0;
              continue ;
            }
            var sub_end$1 = search_subformat_end(str_ind + 3 | 0, end_ind, /* '}' */125);
            _str_ind = sub_end$1 + 2 | 0;
            continue ;
          }
          var sub_end$2 = search_subformat_end(str_ind + 3 | 0, end_ind, /* ')' */41);
          _str_ind = sub_end$2 + 2 | 0;
          continue ;
        }
        
      } else if (match$1 !== 40) {
        if (match$1 === 41) {
          return expected_character(str_ind + 1 | 0, "character '}'", /* ')' */41);
        }
        
      } else {
        var sub_end$3 = search_subformat_end(str_ind + 2 | 0, end_ind, /* ')' */41);
        _str_ind = sub_end$3 + 2 | 0;
        continue ;
      }
      _str_ind = str_ind + 2 | 0;
      continue ;
    };
  };
  var compute_int_conv = function (pct_ind, str_ind, _plus, _hash, _space, symb) {
    while(true) {
      var space = _space;
      var hash = _hash;
      var plus = _plus;
      var exit = 0;
      if (plus) {
        if (hash) {
          exit = 2;
        } else if (!space) {
          if (symb === 100) {
            return /* Int_pd */1;
          }
          if (symb === 105) {
            return /* Int_pi */4;
          }
          
        }
        
      } else if (hash) {
        if (space) {
          exit = 2;
        } else {
          if (symb === 88) {
            return /* Int_CX */9;
          }
          if (symb === 111) {
            return /* Int_Co */11;
          }
          if (symb === 120) {
            return /* Int_Cx */7;
          }
          exit = 2;
        }
      } else if (space) {
        if (symb === 100) {
          return /* Int_sd */2;
        }
        if (symb === 105) {
          return /* Int_si */5;
        }
        
      } else {
        switch (symb) {
          case 88 :
              return /* Int_X */8;
          case 100 :
              return /* Int_d */0;
          case 105 :
              return /* Int_i */3;
          case 111 :
              return /* Int_o */10;
          case 117 :
              return /* Int_u */12;
          case 89 :
          case 90 :
          case 91 :
          case 92 :
          case 93 :
          case 94 :
          case 95 :
          case 96 :
          case 97 :
          case 98 :
          case 99 :
          case 101 :
          case 102 :
          case 103 :
          case 104 :
          case 106 :
          case 107 :
          case 108 :
          case 109 :
          case 110 :
          case 112 :
          case 113 :
          case 114 :
          case 115 :
          case 116 :
          case 118 :
          case 119 :
              break;
          case 120 :
              return /* Int_x */6;
          default:
            
        }
      }
      if (exit === 2) {
        var exit$1 = 0;
        switch (symb) {
          case 88 :
              if (legacy_behavior$1) {
                return /* Int_CX */9;
              }
              break;
          case 111 :
              if (legacy_behavior$1) {
                return /* Int_Co */11;
              }
              break;
          case 100 :
          case 105 :
          case 117 :
              exit$1 = 3;
              break;
          case 89 :
          case 90 :
          case 91 :
          case 92 :
          case 93 :
          case 94 :
          case 95 :
          case 96 :
          case 97 :
          case 98 :
          case 99 :
          case 101 :
          case 102 :
          case 103 :
          case 104 :
          case 106 :
          case 107 :
          case 108 :
          case 109 :
          case 110 :
          case 112 :
          case 113 :
          case 114 :
          case 115 :
          case 116 :
          case 118 :
          case 119 :
              break;
          case 120 :
              if (legacy_behavior$1) {
                return /* Int_Cx */7;
              }
              break;
          default:
            
        }
        if (exit$1 === 3) {
          if (!legacy_behavior$1) {
            return incompatible_flag(pct_ind, str_ind, symb, "'#'");
          }
          _hash = false;
          continue ;
        }
        
      }
      if (plus) {
        if (space) {
          if (!legacy_behavior$1) {
            return incompatible_flag(pct_ind, str_ind, /* ' ' */32, "'+'");
          }
          _space = false;
          continue ;
        }
        if (!legacy_behavior$1) {
          return incompatible_flag(pct_ind, str_ind, symb, "'+'");
        }
        _plus = false;
        continue ;
      }
      if (space) {
        if (!legacy_behavior$1) {
          return incompatible_flag(pct_ind, str_ind, symb, "' '");
        }
        _space = false;
        continue ;
      }
      throw {
            RE_EXN_ID: "Assert_failure",
            _1: [
              "camlinternalFormat.ml",
              2909,
              28
            ],
            Error: new Error()
          };
    };
  };
  var parse_literal = function (lit_start, _str_ind, end_ind) {
    while(true) {
      var str_ind = _str_ind;
      if (str_ind === end_ind) {
        return add_literal(lit_start, str_ind, /* End_of_format */0);
      }
      var match = Caml_string.get(str, str_ind);
      if (match !== 37) {
        if (match !== 64) {
          _str_ind = str_ind + 1 | 0;
          continue ;
        }
        var fmt_rest = parse_after_at(str_ind + 1 | 0, end_ind);
        return add_literal(lit_start, str_ind, fmt_rest._0);
      }
      var fmt_rest$1 = parse_format(str_ind, end_ind);
      return add_literal(lit_start, str_ind, fmt_rest$1._0);
    };
  };
  var parse_integer = function (str_ind, end_ind) {
    if (str_ind === end_ind) {
      invalid_format_message(end_ind, "unexpected end of format");
    }
    var match = Caml_string.get(str, str_ind);
    if (match >= 48) {
      if (match >= 58) {
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "camlinternalFormat.ml",
                2814,
                11
              ],
              Error: new Error()
            };
      }
      return parse_positive(str_ind, end_ind, 0);
    }
    if (match !== 45) {
      throw {
            RE_EXN_ID: "Assert_failure",
            _1: [
              "camlinternalFormat.ml",
              2814,
              11
            ],
            Error: new Error()
          };
    }
    if ((str_ind + 1 | 0) === end_ind) {
      invalid_format_message(end_ind, "unexpected end of format");
    }
    var c = Caml_string.get(str, str_ind + 1 | 0);
    if (c > 57 || c < 48) {
      return expected_character(str_ind + 1 | 0, "digit", c);
    }
    var match$1 = parse_positive(str_ind + 1 | 0, end_ind, 0);
    return [
            match$1[0],
            -match$1[1] | 0
          ];
  };
  var parse_after_precision = function (pct_ind, str_ind, end_ind, minus, plus, hash, space, ign, pad, prec) {
    if (str_ind === end_ind) {
      invalid_format_message(end_ind, "unexpected end of format");
    }
    var parse_conv = function (padprec) {
      return parse_conversion(pct_ind, str_ind + 1 | 0, end_ind, plus, hash, space, ign, pad, prec, padprec, Caml_string.get(str, str_ind));
    };
    if (typeof pad === "number") {
      if (prec === 0) {
        return parse_conv(/* No_padding */0);
      } else if (minus) {
        if (typeof prec === "number") {
          return parse_conv({
                      TAG: /* Arg_padding */1,
                      _0: /* Left */0
                    });
        } else {
          return parse_conv({
                      TAG: /* Lit_padding */0,
                      _0: /* Left */0,
                      _1: prec._0
                    });
        }
      } else if (typeof prec === "number") {
        return parse_conv({
                    TAG: /* Arg_padding */1,
                    _0: /* Right */1
                  });
      } else {
        return parse_conv({
                    TAG: /* Lit_padding */0,
                    _0: /* Right */1,
                    _1: prec._0
                  });
      }
    } else {
      return parse_conv(pad);
    }
  };
  var parse_flags = function (pct_ind, str_ind, end_ind, ign) {
    var zero = {
      contents: false
    };
    var minus = {
      contents: false
    };
    var plus = {
      contents: false
    };
    var space = {
      contents: false
    };
    var hash = {
      contents: false
    };
    var set_flag = function (str_ind, flag) {
      if (flag.contents && !legacy_behavior$1) {
        Curry._3(failwith_message(/* Format */{
                  _0: {
                    TAG: /* String_literal */11,
                    _0: "invalid format ",
                    _1: {
                      TAG: /* Caml_string */3,
                      _0: /* No_padding */0,
                      _1: {
                        TAG: /* String_literal */11,
                        _0: ": at character number ",
                        _1: {
                          TAG: /* Int */4,
                          _0: /* Int_d */0,
                          _1: /* No_padding */0,
                          _2: /* No_precision */0,
                          _3: {
                            TAG: /* String_literal */11,
                            _0: ", duplicate flag ",
                            _1: {
                              TAG: /* Caml_char */1,
                              _0: /* End_of_format */0
                            }
                          }
                        }
                      }
                    }
                  },
                  _1: "invalid format %S: at character number %d, duplicate flag %C"
                }), str, str_ind, Caml_string.get(str, str_ind));
      }
      flag.contents = true;
      
    };
    var _str_ind = str_ind;
    while(true) {
      var str_ind$1 = _str_ind;
      if (str_ind$1 === end_ind) {
        invalid_format_message(end_ind, "unexpected end of format");
      }
      var match = Caml_string.get(str, str_ind$1);
      switch (match) {
        case 32 :
            set_flag(str_ind$1, space);
            _str_ind = str_ind$1 + 1 | 0;
            continue ;
        case 35 :
            set_flag(str_ind$1, hash);
            _str_ind = str_ind$1 + 1 | 0;
            continue ;
        case 43 :
            set_flag(str_ind$1, plus);
            _str_ind = str_ind$1 + 1 | 0;
            continue ;
        case 45 :
            set_flag(str_ind$1, minus);
            _str_ind = str_ind$1 + 1 | 0;
            continue ;
        case 33 :
        case 34 :
        case 36 :
        case 37 :
        case 38 :
        case 39 :
        case 40 :
        case 41 :
        case 42 :
        case 44 :
        case 46 :
        case 47 :
            break;
        case 48 :
            set_flag(str_ind$1, zero);
            _str_ind = str_ind$1 + 1 | 0;
            continue ;
        default:
          
      }
      var zero$1 = zero.contents;
      var minus$1 = minus.contents;
      var plus$1 = plus.contents;
      var hash$1 = hash.contents;
      var space$1 = space.contents;
      if (str_ind$1 === end_ind) {
        invalid_format_message(end_ind, "unexpected end of format");
      }
      var padty = zero$1 ? (
          minus$1 ? (
              legacy_behavior$1 ? /* Left */0 : incompatible_flag(pct_ind, str_ind$1, /* '-' */45, "0")
            ) : /* Zeros */2
        ) : (
          minus$1 ? /* Left */0 : /* Right */1
        );
      var match$1 = Caml_string.get(str, str_ind$1);
      if (match$1 >= 48) {
        if (match$1 < 58) {
          var match$2 = parse_positive(str_ind$1, end_ind, 0);
          return parse_after_padding(pct_ind, match$2[0], end_ind, minus$1, plus$1, hash$1, space$1, ign, {
                      TAG: /* Lit_padding */0,
                      _0: padty,
                      _1: match$2[1]
                    });
        }
        
      } else if (match$1 === 42) {
        return parse_after_padding(pct_ind, str_ind$1 + 1 | 0, end_ind, minus$1, plus$1, hash$1, space$1, ign, {
                    TAG: /* Arg_padding */1,
                    _0: padty
                  });
      }
      switch (padty) {
        case /* Left */0 :
            if (!legacy_behavior$1) {
              invalid_format_without(str_ind$1 - 1 | 0, /* '-' */45, "padding");
            }
            return parse_after_padding(pct_ind, str_ind$1, end_ind, minus$1, plus$1, hash$1, space$1, ign, /* No_padding */0);
        case /* Right */1 :
            return parse_after_padding(pct_ind, str_ind$1, end_ind, minus$1, plus$1, hash$1, space$1, ign, /* No_padding */0);
        case /* Zeros */2 :
            return parse_after_padding(pct_ind, str_ind$1, end_ind, minus$1, plus$1, hash$1, space$1, ign, {
                        TAG: /* Lit_padding */0,
                        _0: /* Right */1,
                        _1: 0
                      });
        
      }
    };
  };
  var parse_conversion = function (pct_ind, str_ind, end_ind, plus, hash, space, ign, pad, prec, padprec, symb) {
    var plus_used = false;
    var hash_used = false;
    var space_used = false;
    var ign_used = {
      contents: false
    };
    var pad_used = {
      contents: false
    };
    var prec_used = {
      contents: false
    };
    var get_int_pad = function (param) {
      pad_used.contents = true;
      prec_used.contents = true;
      if (prec === 0) {
        return pad;
      } else if (typeof pad === "number") {
        return /* No_padding */0;
      } else if (pad.TAG === /* Lit_padding */0) {
        if (pad._0 >= 2) {
          if (legacy_behavior$1) {
            return {
                    TAG: /* Lit_padding */0,
                    _0: /* Right */1,
                    _1: pad._1
                  };
          } else {
            return incompatible_flag(pct_ind, str_ind, /* '0' */48, "precision");
          }
        } else {
          return pad;
        }
      } else if (pad._0 >= 2) {
        if (legacy_behavior$1) {
          return {
                  TAG: /* Arg_padding */1,
                  _0: /* Right */1
                };
        } else {
          return incompatible_flag(pct_ind, str_ind, /* '0' */48, "precision");
        }
      } else {
        return pad;
      }
    };
    var check_no_0 = function (symb, pad) {
      if (typeof pad === "number") {
        return pad;
      } else if (pad.TAG === /* Lit_padding */0) {
        if (pad._0 >= 2) {
          if (legacy_behavior$1) {
            return {
                    TAG: /* Lit_padding */0,
                    _0: /* Right */1,
                    _1: pad._1
                  };
          } else {
            return incompatible_flag(pct_ind, str_ind, symb, "0");
          }
        } else {
          return pad;
        }
      } else if (pad._0 >= 2) {
        if (legacy_behavior$1) {
          return {
                  TAG: /* Arg_padding */1,
                  _0: /* Right */1
                };
        } else {
          return incompatible_flag(pct_ind, str_ind, symb, "0");
        }
      } else {
        return pad;
      }
    };
    var opt_of_pad = function (c, pad) {
      if (typeof pad === "number") {
        return ;
      }
      if (pad.TAG !== /* Lit_padding */0) {
        return incompatible_flag(pct_ind, str_ind, c, "'*'");
      }
      switch (pad._0) {
        case /* Left */0 :
            if (legacy_behavior$1) {
              return pad._1;
            } else {
              return incompatible_flag(pct_ind, str_ind, c, "'-'");
            }
        case /* Right */1 :
            return pad._1;
        case /* Zeros */2 :
            if (legacy_behavior$1) {
              return pad._1;
            } else {
              return incompatible_flag(pct_ind, str_ind, c, "'0'");
            }
        
      }
    };
    var get_prec_opt = function (param) {
      prec_used.contents = true;
      if (typeof prec === "number") {
        if (prec !== 0) {
          return incompatible_flag(pct_ind, str_ind, /* '_' */95, "'*'");
        } else {
          return ;
        }
      } else {
        return prec._0;
      }
    };
    var fmt_result;
    var exit = 0;
    var exit$1 = 0;
    var exit$2 = 0;
    if (symb >= 124) {
      exit$1 = 6;
    } else {
      switch (symb) {
        case 33 :
            var fmt_rest = parse_literal(str_ind, str_ind, end_ind);
            fmt_result = /* Fmt_EBB */{
              _0: {
                TAG: /* Flush */10,
                _0: fmt_rest._0
              }
            };
            break;
        case 40 :
            var sub_end = search_subformat_end(str_ind, end_ind, /* ')' */41);
            var beg_ind = sub_end + 2 | 0;
            var fmt_rest$1 = parse_literal(beg_ind, beg_ind, end_ind);
            var fmt_rest$2 = fmt_rest$1._0;
            var sub_fmt = parse_literal(str_ind, str_ind, sub_end);
            var sub_fmtty = fmtty_of_fmt(sub_fmt._0);
            if (ign_used.contents = true, ign) {
              var ignored_0 = opt_of_pad(/* '_' */95, (pad_used.contents = true, pad));
              var ignored = {
                TAG: /* Ignored_format_subst */9,
                _0: ignored_0,
                _1: sub_fmtty
              };
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* Ignored_param */23,
                  _0: ignored,
                  _1: fmt_rest$2
                }
              };
            } else {
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* Format_subst */14,
                  _0: opt_of_pad(/* '(' */40, (pad_used.contents = true, pad)),
                  _1: sub_fmtty,
                  _2: fmt_rest$2
                }
              };
            }
            break;
        case 44 :
            fmt_result = parse_literal(str_ind, str_ind, end_ind);
            break;
        case 37 :
        case 64 :
            exit$1 = 4;
            break;
        case 67 :
            var fmt_rest$3 = parse_literal(str_ind, str_ind, end_ind);
            var fmt_rest$4 = fmt_rest$3._0;
            fmt_result = (ign_used.contents = true, ign) ? /* Fmt_EBB */({
                  _0: {
                    TAG: /* Ignored_param */23,
                    _0: /* Ignored_caml_char */1,
                    _1: fmt_rest$4
                  }
                }) : /* Fmt_EBB */({
                  _0: {
                    TAG: /* Caml_char */1,
                    _0: fmt_rest$4
                  }
                });
            break;
        case 78 :
            var fmt_rest$5 = parse_literal(str_ind, str_ind, end_ind);
            var fmt_rest$6 = fmt_rest$5._0;
            if (ign_used.contents = true, ign) {
              var ignored$1 = {
                TAG: /* Ignored_scan_get_counter */11,
                _0: /* Token_counter */2
              };
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* Ignored_param */23,
                  _0: ignored$1,
                  _1: fmt_rest$6
                }
              };
            } else {
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* Scan_get_counter */21,
                  _0: /* Token_counter */2,
                  _1: fmt_rest$6
                }
              };
            }
            break;
        case 83 :
            var pad$1 = check_no_0(symb, (pad_used.contents = true, padprec));
            var fmt_rest$7 = parse_literal(str_ind, str_ind, end_ind);
            var fmt_rest$8 = fmt_rest$7._0;
            if (ign_used.contents = true, ign) {
              var ignored$2 = {
                TAG: /* Ignored_caml_string */1,
                _0: opt_of_pad(/* '_' */95, (pad_used.contents = true, padprec))
              };
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* Ignored_param */23,
                  _0: ignored$2,
                  _1: fmt_rest$8
                }
              };
            } else {
              var match = make_padding_fmt_ebb(pad$1, fmt_rest$8);
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* Caml_string */3,
                  _0: match._0,
                  _1: match._1
                }
              };
            }
            break;
        case 91 :
            var match$1 = parse_char_set(str_ind, end_ind);
            var char_set = match$1[1];
            var next_ind = match$1[0];
            var fmt_rest$9 = parse_literal(next_ind, next_ind, end_ind);
            var fmt_rest$10 = fmt_rest$9._0;
            if (ign_used.contents = true, ign) {
              var ignored_0$1 = opt_of_pad(/* '_' */95, (pad_used.contents = true, pad));
              var ignored$3 = {
                TAG: /* Ignored_scan_char_set */10,
                _0: ignored_0$1,
                _1: char_set
              };
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* Ignored_param */23,
                  _0: ignored$3,
                  _1: fmt_rest$10
                }
              };
            } else {
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* Scan_char_set */20,
                  _0: opt_of_pad(/* '[' */91, (pad_used.contents = true, pad)),
                  _1: char_set,
                  _2: fmt_rest$10
                }
              };
            }
            break;
        case 32 :
        case 35 :
        case 43 :
        case 45 :
        case 95 :
            exit$1 = 5;
            break;
        case 97 :
            var fmt_rest$11 = parse_literal(str_ind, str_ind, end_ind);
            fmt_result = /* Fmt_EBB */{
              _0: {
                TAG: /* Alpha */15,
                _0: fmt_rest$11._0
              }
            };
            break;
        case 66 :
        case 98 :
            exit$1 = 3;
            break;
        case 99 :
            var char_format = function (fmt_rest) {
              if (ign_used.contents = true, ign) {
                return /* Fmt_EBB */{
                        _0: {
                          TAG: /* Ignored_param */23,
                          _0: /* Ignored_char */0,
                          _1: fmt_rest
                        }
                      };
              } else {
                return /* Fmt_EBB */{
                        _0: {
                          TAG: /* Char */0,
                          _0: fmt_rest
                        }
                      };
              }
            };
            var scan_format = function (fmt_rest) {
              if (ign_used.contents = true, ign) {
                return /* Fmt_EBB */{
                        _0: {
                          TAG: /* Ignored_param */23,
                          _0: /* Ignored_scan_next_char */3,
                          _1: fmt_rest
                        }
                      };
              } else {
                return /* Fmt_EBB */{
                        _0: {
                          TAG: /* Scan_next_char */22,
                          _0: fmt_rest
                        }
                      };
              }
            };
            var fmt_rest$12 = parse_literal(str_ind, str_ind, end_ind);
            var fmt_rest$13 = fmt_rest$12._0;
            var _n = opt_of_pad(/* 'c' */99, (pad_used.contents = true, pad));
            fmt_result = _n !== undefined ? (
                _n !== 0 ? (
                    legacy_behavior$1 ? char_format(fmt_rest$13) : invalid_format_message(str_ind, "non-zero widths are unsupported for %c conversions")
                  ) : scan_format(fmt_rest$13)
              ) : char_format(fmt_rest$13);
            break;
        case 69 :
        case 70 :
        case 71 :
        case 72 :
        case 101 :
        case 102 :
        case 103 :
        case 104 :
            exit$1 = 2;
            break;
        case 76 :
        case 108 :
        case 110 :
            exit$2 = 8;
            break;
        case 114 :
            var fmt_rest$14 = parse_literal(str_ind, str_ind, end_ind);
            var fmt_rest$15 = fmt_rest$14._0;
            fmt_result = (ign_used.contents = true, ign) ? /* Fmt_EBB */({
                  _0: {
                    TAG: /* Ignored_param */23,
                    _0: /* Ignored_reader */2,
                    _1: fmt_rest$15
                  }
                }) : /* Fmt_EBB */({
                  _0: {
                    TAG: /* Reader */19,
                    _0: fmt_rest$15
                  }
                });
            break;
        case 115 :
            var pad$2 = check_no_0(symb, (pad_used.contents = true, padprec));
            var fmt_rest$16 = parse_literal(str_ind, str_ind, end_ind);
            var fmt_rest$17 = fmt_rest$16._0;
            if (ign_used.contents = true, ign) {
              var ignored$4 = {
                TAG: /* Ignored_string */0,
                _0: opt_of_pad(/* '_' */95, (pad_used.contents = true, padprec))
              };
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* Ignored_param */23,
                  _0: ignored$4,
                  _1: fmt_rest$17
                }
              };
            } else {
              var match$2 = make_padding_fmt_ebb(pad$2, fmt_rest$17);
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* String */2,
                  _0: match$2._0,
                  _1: match$2._1
                }
              };
            }
            break;
        case 116 :
            var fmt_rest$18 = parse_literal(str_ind, str_ind, end_ind);
            fmt_result = /* Fmt_EBB */{
              _0: {
                TAG: /* Theta */16,
                _0: fmt_rest$18._0
              }
            };
            break;
        case 88 :
        case 100 :
        case 105 :
        case 111 :
        case 117 :
        case 120 :
            exit$2 = 7;
            break;
        case 0 :
        case 1 :
        case 2 :
        case 3 :
        case 4 :
        case 5 :
        case 6 :
        case 7 :
        case 8 :
        case 9 :
        case 10 :
        case 11 :
        case 12 :
        case 13 :
        case 14 :
        case 15 :
        case 16 :
        case 17 :
        case 18 :
        case 19 :
        case 20 :
        case 21 :
        case 22 :
        case 23 :
        case 24 :
        case 25 :
        case 26 :
        case 27 :
        case 28 :
        case 29 :
        case 30 :
        case 31 :
        case 34 :
        case 36 :
        case 38 :
        case 39 :
        case 41 :
        case 42 :
        case 46 :
        case 47 :
        case 48 :
        case 49 :
        case 50 :
        case 51 :
        case 52 :
        case 53 :
        case 54 :
        case 55 :
        case 56 :
        case 57 :
        case 58 :
        case 59 :
        case 60 :
        case 61 :
        case 62 :
        case 63 :
        case 65 :
        case 68 :
        case 73 :
        case 74 :
        case 75 :
        case 77 :
        case 79 :
        case 80 :
        case 81 :
        case 82 :
        case 84 :
        case 85 :
        case 86 :
        case 87 :
        case 89 :
        case 90 :
        case 92 :
        case 93 :
        case 94 :
        case 96 :
        case 106 :
        case 107 :
        case 109 :
        case 112 :
        case 113 :
        case 118 :
        case 119 :
        case 121 :
        case 122 :
            exit$1 = 6;
            break;
        case 123 :
            var sub_end$1 = search_subformat_end(str_ind, end_ind, /* '}' */125);
            var sub_fmt$1 = parse_literal(str_ind, str_ind, sub_end$1);
            var beg_ind$1 = sub_end$1 + 2 | 0;
            var fmt_rest$19 = parse_literal(beg_ind$1, beg_ind$1, end_ind);
            var fmt_rest$20 = fmt_rest$19._0;
            var sub_fmtty$1 = fmtty_of_fmt(sub_fmt$1._0);
            if (ign_used.contents = true, ign) {
              var ignored_0$2 = opt_of_pad(/* '_' */95, (pad_used.contents = true, pad));
              var ignored$5 = {
                TAG: /* Ignored_format_arg */8,
                _0: ignored_0$2,
                _1: sub_fmtty$1
              };
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* Ignored_param */23,
                  _0: ignored$5,
                  _1: fmt_rest$20
                }
              };
            } else {
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* Format_arg */13,
                  _0: opt_of_pad(/* '{' */123, (pad_used.contents = true, pad)),
                  _1: sub_fmtty$1,
                  _2: fmt_rest$20
                }
              };
            }
            break;
        
      }
    }
    switch (exit$2) {
      case 7 :
          plus_used = true;
          hash_used = true;
          space_used = true;
          var iconv = compute_int_conv(pct_ind, str_ind, plus, hash, space, symb);
          var fmt_rest$21 = parse_literal(str_ind, str_ind, end_ind);
          var fmt_rest$22 = fmt_rest$21._0;
          if (ign_used.contents = true, ign) {
            var ignored_1 = opt_of_pad(/* '_' */95, (pad_used.contents = true, pad));
            var ignored$6 = {
              TAG: /* Ignored_int */2,
              _0: iconv,
              _1: ignored_1
            };
            fmt_result = /* Fmt_EBB */{
              _0: {
                TAG: /* Ignored_param */23,
                _0: ignored$6,
                _1: fmt_rest$22
              }
            };
          } else {
            var match$3 = make_padprec_fmt_ebb(get_int_pad(undefined), (prec_used.contents = true, prec), fmt_rest$22);
            fmt_result = /* Fmt_EBB */{
              _0: {
                TAG: /* Int */4,
                _0: iconv,
                _1: match$3._0,
                _2: match$3._1,
                _3: match$3._2
              }
            };
          }
          break;
      case 8 :
          if (str_ind === end_ind || !is_int_base(Caml_string.get(str, str_ind))) {
            var fmt_rest$23 = parse_literal(str_ind, str_ind, end_ind);
            var fmt_rest$24 = fmt_rest$23._0;
            var counter = counter_of_char(symb);
            if (ign_used.contents = true, ign) {
              var ignored$7 = {
                TAG: /* Ignored_scan_get_counter */11,
                _0: counter
              };
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* Ignored_param */23,
                  _0: ignored$7,
                  _1: fmt_rest$24
                }
              };
            } else {
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* Scan_get_counter */21,
                  _0: counter,
                  _1: fmt_rest$24
                }
              };
            }
          } else {
            exit$1 = 6;
          }
          break;
      
    }
    switch (exit$1) {
      case 2 :
          plus_used = true;
          space_used = true;
          var fconv = compute_float_conv(pct_ind, str_ind, plus, space, symb);
          var fmt_rest$25 = parse_literal(str_ind, str_ind, end_ind);
          var fmt_rest$26 = fmt_rest$25._0;
          if (ign_used.contents = true, ign) {
            var ignored_0$3 = opt_of_pad(/* '_' */95, (pad_used.contents = true, pad));
            var ignored_1$1 = get_prec_opt(undefined);
            var ignored$8 = {
              TAG: /* Ignored_float */6,
              _0: ignored_0$3,
              _1: ignored_1$1
            };
            fmt_result = /* Fmt_EBB */{
              _0: {
                TAG: /* Ignored_param */23,
                _0: ignored$8,
                _1: fmt_rest$26
              }
            };
          } else {
            var match$4 = make_padprec_fmt_ebb((pad_used.contents = true, pad), (prec_used.contents = true, prec), fmt_rest$26);
            fmt_result = /* Fmt_EBB */{
              _0: {
                TAG: /* Float */8,
                _0: fconv,
                _1: match$4._0,
                _2: match$4._1,
                _3: match$4._2
              }
            };
          }
          break;
      case 3 :
          var pad$3 = check_no_0(symb, (pad_used.contents = true, padprec));
          var fmt_rest$27 = parse_literal(str_ind, str_ind, end_ind);
          var fmt_rest$28 = fmt_rest$27._0;
          if (ign_used.contents = true, ign) {
            var ignored$9 = {
              TAG: /* Ignored_bool */7,
              _0: opt_of_pad(/* '_' */95, (pad_used.contents = true, padprec))
            };
            fmt_result = /* Fmt_EBB */{
              _0: {
                TAG: /* Ignored_param */23,
                _0: ignored$9,
                _1: fmt_rest$28
              }
            };
          } else {
            var match$5 = make_padding_fmt_ebb(pad$3, fmt_rest$28);
            fmt_result = /* Fmt_EBB */{
              _0: {
                TAG: /* Bool */9,
                _0: match$5._0,
                _1: match$5._1
              }
            };
          }
          break;
      case 4 :
          var fmt_rest$29 = parse_literal(str_ind, str_ind, end_ind);
          fmt_result = /* Fmt_EBB */{
            _0: {
              TAG: /* Char_literal */12,
              _0: symb,
              _1: fmt_rest$29._0
            }
          };
          break;
      case 5 :
          fmt_result = Curry._3(failwith_message(/* Format */{
                    _0: {
                      TAG: /* String_literal */11,
                      _0: "invalid format ",
                      _1: {
                        TAG: /* Caml_string */3,
                        _0: /* No_padding */0,
                        _1: {
                          TAG: /* String_literal */11,
                          _0: ": at character number ",
                          _1: {
                            TAG: /* Int */4,
                            _0: /* Int_d */0,
                            _1: /* No_padding */0,
                            _2: /* No_precision */0,
                            _3: {
                              TAG: /* String_literal */11,
                              _0: ", flag ",
                              _1: {
                                TAG: /* Caml_char */1,
                                _0: {
                                  TAG: /* String_literal */11,
                                  _0: " is only allowed after the '",
                                  _1: {
                                    TAG: /* Char_literal */12,
                                    _0: /* '%' */37,
                                    _1: {
                                      TAG: /* String_literal */11,
                                      _0: "', before padding and precision",
                                      _1: /* End_of_format */0
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    _1: "invalid format %S: at character number %d, flag %C is only allowed after the '%%', before padding and precision"
                  }), str, pct_ind, symb);
          break;
      case 6 :
          if (symb >= 108) {
            if (symb >= 111) {
              exit = 1;
            } else {
              switch (symb) {
                case 108 :
                    plus_used = true;
                    hash_used = true;
                    space_used = true;
                    var iconv$1 = compute_int_conv(pct_ind, str_ind + 1 | 0, plus, hash, space, Caml_string.get(str, str_ind));
                    var beg_ind$2 = str_ind + 1 | 0;
                    var fmt_rest$30 = parse_literal(beg_ind$2, beg_ind$2, end_ind);
                    var fmt_rest$31 = fmt_rest$30._0;
                    if (ign_used.contents = true, ign) {
                      var ignored_1$2 = opt_of_pad(/* '_' */95, (pad_used.contents = true, pad));
                      var ignored$10 = {
                        TAG: /* Ignored_int32 */3,
                        _0: iconv$1,
                        _1: ignored_1$2
                      };
                      fmt_result = /* Fmt_EBB */{
                        _0: {
                          TAG: /* Ignored_param */23,
                          _0: ignored$10,
                          _1: fmt_rest$31
                        }
                      };
                    } else {
                      var match$6 = make_padprec_fmt_ebb(get_int_pad(undefined), (prec_used.contents = true, prec), fmt_rest$31);
                      fmt_result = /* Fmt_EBB */{
                        _0: {
                          TAG: /* Int32 */5,
                          _0: iconv$1,
                          _1: match$6._0,
                          _2: match$6._1,
                          _3: match$6._2
                        }
                      };
                    }
                    break;
                case 109 :
                    exit = 1;
                    break;
                case 110 :
                    plus_used = true;
                    hash_used = true;
                    space_used = true;
                    var iconv$2 = compute_int_conv(pct_ind, str_ind + 1 | 0, plus, hash, space, Caml_string.get(str, str_ind));
                    var beg_ind$3 = str_ind + 1 | 0;
                    var fmt_rest$32 = parse_literal(beg_ind$3, beg_ind$3, end_ind);
                    var fmt_rest$33 = fmt_rest$32._0;
                    if (ign_used.contents = true, ign) {
                      var ignored_1$3 = opt_of_pad(/* '_' */95, (pad_used.contents = true, pad));
                      var ignored$11 = {
                        TAG: /* Ignored_nativeint */4,
                        _0: iconv$2,
                        _1: ignored_1$3
                      };
                      fmt_result = /* Fmt_EBB */{
                        _0: {
                          TAG: /* Ignored_param */23,
                          _0: ignored$11,
                          _1: fmt_rest$33
                        }
                      };
                    } else {
                      var match$7 = make_padprec_fmt_ebb(get_int_pad(undefined), (prec_used.contents = true, prec), fmt_rest$33);
                      fmt_result = /* Fmt_EBB */{
                        _0: {
                          TAG: /* Nativeint */6,
                          _0: iconv$2,
                          _1: match$7._0,
                          _2: match$7._1,
                          _3: match$7._2
                        }
                      };
                    }
                    break;
                
              }
            }
          } else if (symb !== 76) {
            exit = 1;
          } else {
            plus_used = true;
            hash_used = true;
            space_used = true;
            var iconv$3 = compute_int_conv(pct_ind, str_ind + 1 | 0, plus, hash, space, Caml_string.get(str, str_ind));
            var beg_ind$4 = str_ind + 1 | 0;
            var fmt_rest$34 = parse_literal(beg_ind$4, beg_ind$4, end_ind);
            var fmt_rest$35 = fmt_rest$34._0;
            if (ign_used.contents = true, ign) {
              var ignored_1$4 = opt_of_pad(/* '_' */95, (pad_used.contents = true, pad));
              var ignored$12 = {
                TAG: /* Ignored_int64 */5,
                _0: iconv$3,
                _1: ignored_1$4
              };
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* Ignored_param */23,
                  _0: ignored$12,
                  _1: fmt_rest$35
                }
              };
            } else {
              var match$8 = make_padprec_fmt_ebb(get_int_pad(undefined), (prec_used.contents = true, prec), fmt_rest$35);
              fmt_result = /* Fmt_EBB */{
                _0: {
                  TAG: /* Int64 */7,
                  _0: iconv$3,
                  _1: match$8._0,
                  _2: match$8._1,
                  _3: match$8._2
                }
              };
            }
          }
          break;
      
    }
    if (exit === 1) {
      fmt_result = Curry._3(failwith_message(/* Format */{
                _0: {
                  TAG: /* String_literal */11,
                  _0: "invalid format ",
                  _1: {
                    TAG: /* Caml_string */3,
                    _0: /* No_padding */0,
                    _1: {
                      TAG: /* String_literal */11,
                      _0: ": at character number ",
                      _1: {
                        TAG: /* Int */4,
                        _0: /* Int_d */0,
                        _1: /* No_padding */0,
                        _2: /* No_precision */0,
                        _3: {
                          TAG: /* String_literal */11,
                          _0: ", invalid conversion \"",
                          _1: {
                            TAG: /* Char_literal */12,
                            _0: /* '%' */37,
                            _1: {
                              TAG: /* Char */0,
                              _0: {
                                TAG: /* Char_literal */12,
                                _0: /* '"' */34,
                                _1: /* End_of_format */0
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                _1: "invalid format %S: at character number %d, invalid conversion \"%%%c\""
              }), str, str_ind - 1 | 0, symb);
    }
    if (!legacy_behavior$1) {
      if (!plus_used && plus) {
        incompatible_flag(pct_ind, str_ind, symb, "'+'");
      }
      if (!hash_used && hash) {
        incompatible_flag(pct_ind, str_ind, symb, "'#'");
      }
      if (!space_used && space) {
        incompatible_flag(pct_ind, str_ind, symb, "' '");
      }
      if (!pad_used.contents && Caml_obj.caml_notequal(/* Padding_EBB */{
              _0: pad
            }, /* Padding_EBB */{
              _0: /* No_padding */0
            })) {
        incompatible_flag(pct_ind, str_ind, symb, "`padding'");
      }
      if (!prec_used.contents && Caml_obj.caml_notequal(/* Precision_EBB */{
              _0: prec
            }, /* Precision_EBB */{
              _0: /* No_precision */0
            })) {
        incompatible_flag(pct_ind, str_ind, ign ? /* '_' */95 : symb, "`precision'");
      }
      if (ign && plus) {
        incompatible_flag(pct_ind, str_ind, /* '_' */95, "'+'");
      }
      
    }
    if (!ign_used.contents && ign) {
      var exit$3 = 0;
      if (symb >= 38) {
        if (symb !== 44) {
          if (symb !== 64 || !legacy_behavior$1) {
            exit$3 = 1;
          }
          
        } else if (!legacy_behavior$1) {
          exit$3 = 1;
        }
        
      } else if (symb !== 33) {
        if (!(symb >= 37 && legacy_behavior$1)) {
          exit$3 = 1;
        }
        
      } else if (!legacy_behavior$1) {
        exit$3 = 1;
      }
      if (exit$3 === 1) {
        incompatible_flag(pct_ind, str_ind, symb, "'_'");
      }
      
    }
    return fmt_result;
  };
  var parse_tag = function (is_open_tag, str_ind, end_ind) {
    try {
      if (str_ind === end_ind) {
        throw {
              RE_EXN_ID: "Not_found",
              Error: new Error()
            };
      }
      var match = Caml_string.get(str, str_ind);
      if (match !== 60) {
        throw {
              RE_EXN_ID: "Not_found",
              Error: new Error()
            };
      }
      var ind = $$String.index_from(str, str_ind + 1 | 0, /* '>' */62);
      if (ind >= end_ind) {
        throw {
              RE_EXN_ID: "Not_found",
              Error: new Error()
            };
      }
      var sub_str = $$String.sub(str, str_ind, (ind - str_ind | 0) + 1 | 0);
      var beg_ind = ind + 1 | 0;
      var fmt_rest = parse_literal(beg_ind, beg_ind, end_ind);
      var sub_fmt = parse_literal(str_ind, str_ind, ind + 1 | 0);
      var sub_fmt$1 = sub_fmt._0;
      var sub_format = /* Format */{
        _0: sub_fmt$1,
        _1: sub_str
      };
      var formatting = is_open_tag ? ({
            TAG: /* Open_tag */0,
            _0: sub_format
          }) : (check_open_box(sub_fmt$1), {
            TAG: /* Open_box */1,
            _0: sub_format
          });
      return /* Fmt_EBB */{
              _0: {
                TAG: /* Formatting_gen */18,
                _0: formatting,
                _1: fmt_rest._0
              }
            };
    }
    catch (raw_exn){
      var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
      if (exn.RE_EXN_ID === "Not_found") {
        var fmt_rest$1 = parse_literal(str_ind, str_ind, end_ind);
        var sub_format$1 = /* Format */{
          _0: /* End_of_format */0,
          _1: ""
        };
        var formatting$1 = is_open_tag ? ({
              TAG: /* Open_tag */0,
              _0: sub_format$1
            }) : ({
              TAG: /* Open_box */1,
              _0: sub_format$1
            });
        return /* Fmt_EBB */{
                _0: {
                  TAG: /* Formatting_gen */18,
                  _0: formatting$1,
                  _1: fmt_rest$1._0
                }
              };
      }
      throw exn;
    }
  };
  var compute_float_conv = function (pct_ind, str_ind, _plus, _space, symb) {
    while(true) {
      var space = _space;
      var plus = _plus;
      if (plus) {
        if (space) {
          if (!legacy_behavior$1) {
            return incompatible_flag(pct_ind, str_ind, /* ' ' */32, "'+'");
          }
          _space = false;
          continue ;
        }
        if (symb >= 73) {
          switch (symb) {
            case 101 :
                return /* Float_pe */4;
            case 102 :
                return /* Float_pf */1;
            case 103 :
                return /* Float_pg */10;
            case 104 :
                return /* Float_ph */17;
            default:
              
          }
        } else if (symb >= 69) {
          switch (symb) {
            case 69 :
                return /* Float_pE */7;
            case 70 :
                break;
            case 71 :
                return /* Float_pG */13;
            case 72 :
                return /* Float_pH */20;
            
          }
        }
        if (!legacy_behavior$1) {
          return incompatible_flag(pct_ind, str_ind, symb, "'+'");
        }
        _plus = false;
        continue ;
      }
      if (space) {
        if (symb >= 73) {
          switch (symb) {
            case 101 :
                return /* Float_se */5;
            case 102 :
                return /* Float_sf */2;
            case 103 :
                return /* Float_sg */11;
            case 104 :
                return /* Float_sh */18;
            default:
              
          }
        } else if (symb >= 69) {
          switch (symb) {
            case 69 :
                return /* Float_sE */8;
            case 70 :
                break;
            case 71 :
                return /* Float_sG */14;
            case 72 :
                return /* Float_sH */21;
            
          }
        }
        if (!legacy_behavior$1) {
          return incompatible_flag(pct_ind, str_ind, symb, "' '");
        }
        _space = false;
        continue ;
      }
      if (symb >= 73) {
        switch (symb) {
          case 101 :
              return /* Float_e */3;
          case 102 :
              return /* Float_f */0;
          case 103 :
              return /* Float_g */9;
          case 104 :
              return /* Float_h */16;
          default:
            throw {
                  RE_EXN_ID: "Assert_failure",
                  _1: [
                    "camlinternalFormat.ml",
                    2943,
                    25
                  ],
                  Error: new Error()
                };
        }
      } else if (symb >= 69) {
        switch (symb) {
          case 69 :
              return /* Float_E */6;
          case 70 :
              return /* Float_F */15;
          case 71 :
              return /* Float_G */12;
          case 72 :
              return /* Float_H */19;
          
        }
      } else {
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "camlinternalFormat.ml",
                2943,
                25
              ],
              Error: new Error()
            };
      }
    };
  };
  var parse_format = function (pct_ind, end_ind) {
    var str_ind = pct_ind + 1 | 0;
    if (str_ind === end_ind) {
      invalid_format_message(end_ind, "unexpected end of format");
    }
    var match = Caml_string.get(str, str_ind);
    if (match !== 95) {
      return parse_flags(pct_ind, str_ind, end_ind, false);
    } else {
      return parse_flags(pct_ind, str_ind + 1 | 0, end_ind, true);
    }
  };
  var parse_after_at = function (str_ind, end_ind) {
    if (str_ind === end_ind) {
      return /* Fmt_EBB */{
              _0: {
                TAG: /* Char_literal */12,
                _0: /* '@' */64,
                _1: /* End_of_format */0
              }
            };
    }
    var c = Caml_string.get(str, str_ind);
    if (c >= 65) {
      if (c >= 94) {
        switch (c) {
          case 123 :
              return parse_tag(true, str_ind + 1 | 0, end_ind);
          case 124 :
              break;
          case 125 :
              var beg_ind = str_ind + 1 | 0;
              var fmt_rest = parse_literal(beg_ind, beg_ind, end_ind);
              return /* Fmt_EBB */{
                      _0: {
                        TAG: /* Formatting_lit */17,
                        _0: /* Close_tag */1,
                        _1: fmt_rest._0
                      }
                    };
          default:
            
        }
      } else if (c >= 91) {
        switch (c) {
          case 91 :
              return parse_tag(false, str_ind + 1 | 0, end_ind);
          case 92 :
              break;
          case 93 :
              var beg_ind$1 = str_ind + 1 | 0;
              var fmt_rest$1 = parse_literal(beg_ind$1, beg_ind$1, end_ind);
              return /* Fmt_EBB */{
                      _0: {
                        TAG: /* Formatting_lit */17,
                        _0: /* Close_box */0,
                        _1: fmt_rest$1._0
                      }
                    };
          
        }
      }
      
    } else if (c !== 10) {
      if (c >= 32) {
        switch (c) {
          case 32 :
              var beg_ind$2 = str_ind + 1 | 0;
              var fmt_rest$2 = parse_literal(beg_ind$2, beg_ind$2, end_ind);
              return /* Fmt_EBB */{
                      _0: {
                        TAG: /* Formatting_lit */17,
                        _0: {
                          TAG: /* Break */0,
                          _0: "@ ",
                          _1: 1,
                          _2: 0
                        },
                        _1: fmt_rest$2._0
                      }
                    };
          case 37 :
              if ((str_ind + 1 | 0) < end_ind && Caml_string.get(str, str_ind + 1 | 0) === /* '%' */37) {
                var beg_ind$3 = str_ind + 2 | 0;
                var fmt_rest$3 = parse_literal(beg_ind$3, beg_ind$3, end_ind);
                return /* Fmt_EBB */{
                        _0: {
                          TAG: /* Formatting_lit */17,
                          _0: /* Escaped_percent */6,
                          _1: fmt_rest$3._0
                        }
                      };
              }
              var fmt_rest$4 = parse_literal(str_ind, str_ind, end_ind);
              return /* Fmt_EBB */{
                      _0: {
                        TAG: /* Char_literal */12,
                        _0: /* '@' */64,
                        _1: fmt_rest$4._0
                      }
                    };
          case 44 :
              var beg_ind$4 = str_ind + 1 | 0;
              var fmt_rest$5 = parse_literal(beg_ind$4, beg_ind$4, end_ind);
              return /* Fmt_EBB */{
                      _0: {
                        TAG: /* Formatting_lit */17,
                        _0: {
                          TAG: /* Break */0,
                          _0: "@,",
                          _1: 0,
                          _2: 0
                        },
                        _1: fmt_rest$5._0
                      }
                    };
          case 46 :
              var beg_ind$5 = str_ind + 1 | 0;
              var fmt_rest$6 = parse_literal(beg_ind$5, beg_ind$5, end_ind);
              return /* Fmt_EBB */{
                      _0: {
                        TAG: /* Formatting_lit */17,
                        _0: /* Flush_newline */4,
                        _1: fmt_rest$6._0
                      }
                    };
          case 59 :
              var str_ind$1 = str_ind + 1 | 0;
              var match;
              try {
                if (str_ind$1 === end_ind || Caml_string.get(str, str_ind$1) !== /* '<' */60) {
                  throw {
                        RE_EXN_ID: "Not_found",
                        Error: new Error()
                      };
                }
                var str_ind_1 = parse_spaces(str_ind$1 + 1 | 0, end_ind);
                var match$1 = Caml_string.get(str, str_ind_1);
                var exit = 0;
                if (match$1 >= 48) {
                  if (match$1 >= 58) {
                    throw {
                          RE_EXN_ID: "Not_found",
                          Error: new Error()
                        };
                  }
                  exit = 1;
                } else {
                  if (match$1 !== 45) {
                    throw {
                          RE_EXN_ID: "Not_found",
                          Error: new Error()
                        };
                  }
                  exit = 1;
                }
                if (exit === 1) {
                  var match$2 = parse_integer(str_ind_1, end_ind);
                  var width = match$2[1];
                  var str_ind_3 = parse_spaces(match$2[0], end_ind);
                  var match$3 = Caml_string.get(str, str_ind_3);
                  if (match$3 > 57 || match$3 < 45) {
                    if (match$3 !== 62) {
                      throw {
                            RE_EXN_ID: "Not_found",
                            Error: new Error()
                          };
                    }
                    var s = $$String.sub(str, str_ind$1 - 2 | 0, (str_ind_3 - str_ind$1 | 0) + 3 | 0);
                    match = [
                      str_ind_3 + 1 | 0,
                      {
                        TAG: /* Break */0,
                        _0: s,
                        _1: width,
                        _2: 0
                      }
                    ];
                  } else {
                    if (match$3 === 47 || match$3 === 46) {
                      throw {
                            RE_EXN_ID: "Not_found",
                            Error: new Error()
                          };
                    }
                    var match$4 = parse_integer(str_ind_3, end_ind);
                    var str_ind_5 = parse_spaces(match$4[0], end_ind);
                    if (Caml_string.get(str, str_ind_5) !== /* '>' */62) {
                      throw {
                            RE_EXN_ID: "Not_found",
                            Error: new Error()
                          };
                    }
                    var s$1 = $$String.sub(str, str_ind$1 - 2 | 0, (str_ind_5 - str_ind$1 | 0) + 3 | 0);
                    match = [
                      str_ind_5 + 1 | 0,
                      {
                        TAG: /* Break */0,
                        _0: s$1,
                        _1: width,
                        _2: match$4[1]
                      }
                    ];
                  }
                }
                
              }
              catch (raw_exn){
                var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
                if (exn.RE_EXN_ID === "Not_found" || exn.RE_EXN_ID === "Failure") {
                  match = [
                    str_ind$1,
                    {
                      TAG: /* Break */0,
                      _0: "@;",
                      _1: 1,
                      _2: 0
                    }
                  ];
                } else {
                  throw exn;
                }
              }
              var next_ind = match[0];
              var fmt_rest$7 = parse_literal(next_ind, next_ind, end_ind);
              return /* Fmt_EBB */{
                      _0: {
                        TAG: /* Formatting_lit */17,
                        _0: match[1],
                        _1: fmt_rest$7._0
                      }
                    };
          case 60 :
              var str_ind$2 = str_ind + 1 | 0;
              var match$5;
              try {
                var str_ind_1$1 = parse_spaces(str_ind$2, end_ind);
                var match$6 = Caml_string.get(str, str_ind_1$1);
                var exit$1 = 0;
                if (match$6 >= 48) {
                  if (match$6 >= 58) {
                    match$5 = undefined;
                  } else {
                    exit$1 = 1;
                  }
                } else if (match$6 !== 45) {
                  match$5 = undefined;
                } else {
                  exit$1 = 1;
                }
                if (exit$1 === 1) {
                  var match$7 = parse_integer(str_ind_1$1, end_ind);
                  var str_ind_3$1 = parse_spaces(match$7[0], end_ind);
                  if (Caml_string.get(str, str_ind_3$1) !== /* '>' */62) {
                    throw {
                          RE_EXN_ID: "Not_found",
                          Error: new Error()
                        };
                  }
                  var s$2 = $$String.sub(str, str_ind$2 - 2 | 0, (str_ind_3$1 - str_ind$2 | 0) + 3 | 0);
                  match$5 = [
                    str_ind_3$1 + 1 | 0,
                    {
                      TAG: /* Magic_size */1,
                      _0: s$2,
                      _1: match$7[1]
                    }
                  ];
                }
                
              }
              catch (raw_exn$1){
                var exn$1 = Caml_js_exceptions.internalToOCamlException(raw_exn$1);
                if (exn$1.RE_EXN_ID === "Not_found" || exn$1.RE_EXN_ID === "Failure") {
                  match$5 = undefined;
                } else {
                  throw exn$1;
                }
              }
              if (match$5 !== undefined) {
                var next_ind$1 = match$5[0];
                var fmt_rest$8 = parse_literal(next_ind$1, next_ind$1, end_ind);
                return /* Fmt_EBB */{
                        _0: {
                          TAG: /* Formatting_lit */17,
                          _0: match$5[1],
                          _1: fmt_rest$8._0
                        }
                      };
              }
              var fmt_rest$9 = parse_literal(str_ind$2, str_ind$2, end_ind);
              return /* Fmt_EBB */{
                      _0: {
                        TAG: /* Formatting_lit */17,
                        _0: {
                          TAG: /* Scan_indic */2,
                          _0: /* '<' */60
                        },
                        _1: fmt_rest$9._0
                      }
                    };
          case 33 :
          case 34 :
          case 35 :
          case 36 :
          case 38 :
          case 39 :
          case 40 :
          case 41 :
          case 42 :
          case 43 :
          case 45 :
          case 47 :
          case 48 :
          case 49 :
          case 50 :
          case 51 :
          case 52 :
          case 53 :
          case 54 :
          case 55 :
          case 56 :
          case 57 :
          case 58 :
          case 61 :
          case 62 :
              break;
          case 63 :
              var beg_ind$6 = str_ind + 1 | 0;
              var fmt_rest$10 = parse_literal(beg_ind$6, beg_ind$6, end_ind);
              return /* Fmt_EBB */{
                      _0: {
                        TAG: /* Formatting_lit */17,
                        _0: /* FFlush */2,
                        _1: fmt_rest$10._0
                      }
                    };
          case 64 :
              var beg_ind$7 = str_ind + 1 | 0;
              var fmt_rest$11 = parse_literal(beg_ind$7, beg_ind$7, end_ind);
              return /* Fmt_EBB */{
                      _0: {
                        TAG: /* Formatting_lit */17,
                        _0: /* Escaped_at */5,
                        _1: fmt_rest$11._0
                      }
                    };
          
        }
      }
      
    } else {
      var beg_ind$8 = str_ind + 1 | 0;
      var fmt_rest$12 = parse_literal(beg_ind$8, beg_ind$8, end_ind);
      return /* Fmt_EBB */{
              _0: {
                TAG: /* Formatting_lit */17,
                _0: /* Force_newline */3,
                _1: fmt_rest$12._0
              }
            };
    }
    var beg_ind$9 = str_ind + 1 | 0;
    var fmt_rest$13 = parse_literal(beg_ind$9, beg_ind$9, end_ind);
    return /* Fmt_EBB */{
            _0: {
              TAG: /* Formatting_lit */17,
              _0: {
                TAG: /* Scan_indic */2,
                _0: c
              },
              _1: fmt_rest$13._0
            }
          };
  };
  var add_literal = function (lit_start, str_ind, fmt) {
    var size = str_ind - lit_start | 0;
    if (size !== 0) {
      if (size !== 1) {
        return /* Fmt_EBB */{
                _0: {
                  TAG: /* String_literal */11,
                  _0: $$String.sub(str, lit_start, size),
                  _1: fmt
                }
              };
      } else {
        return /* Fmt_EBB */{
                _0: {
                  TAG: /* Char_literal */12,
                  _0: Caml_string.get(str, lit_start),
                  _1: fmt
                }
              };
      }
    } else {
      return /* Fmt_EBB */{
              _0: fmt
            };
    }
  };
  var check_open_box = function (fmt) {
    if (typeof fmt === "number") {
      return ;
    }
    if (fmt.TAG !== /* String_literal */11) {
      return ;
    }
    if (typeof fmt._1 !== "number") {
      return ;
    }
    try {
      open_box_of_string(fmt._0);
      return ;
    }
    catch (raw_exn){
      var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
      if (exn.RE_EXN_ID === "Failure") {
        return ;
      }
      throw exn;
    }
  };
  var parse_char_set = function (str_ind, end_ind) {
    if (str_ind === end_ind) {
      invalid_format_message(end_ind, "unexpected end of format");
    }
    var char_set = Bytes.make(32, /* '\000' */0);
    var add_range = function (c, c$prime) {
      for(var i = c; i <= c$prime; ++i){
        add_in_char_set(char_set, Pervasives.char_of_int(i));
      }
      
    };
    var fail_single_percent = function (str_ind) {
      return Curry._2(failwith_message(/* Format */{
                      _0: {
                        TAG: /* String_literal */11,
                        _0: "invalid format ",
                        _1: {
                          TAG: /* Caml_string */3,
                          _0: /* No_padding */0,
                          _1: {
                            TAG: /* String_literal */11,
                            _0: ": '",
                            _1: {
                              TAG: /* Char_literal */12,
                              _0: /* '%' */37,
                              _1: {
                                TAG: /* String_literal */11,
                                _0: "' alone is not accepted in character sets, use ",
                                _1: {
                                  TAG: /* Char_literal */12,
                                  _0: /* '%' */37,
                                  _1: {
                                    TAG: /* Char_literal */12,
                                    _0: /* '%' */37,
                                    _1: {
                                      TAG: /* String_literal */11,
                                      _0: " instead at position ",
                                      _1: {
                                        TAG: /* Int */4,
                                        _0: /* Int_d */0,
                                        _1: /* No_padding */0,
                                        _2: /* No_precision */0,
                                        _3: {
                                          TAG: /* Char_literal */12,
                                          _0: /* '.' */46,
                                          _1: /* End_of_format */0
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      _1: "invalid format %S: '%%' alone is not accepted in character sets, use %%%% instead at position %d."
                    }), str, str_ind);
    };
    var parse_char_set_content = function (_str_ind, end_ind) {
      while(true) {
        var str_ind = _str_ind;
        if (str_ind === end_ind) {
          invalid_format_message(end_ind, "unexpected end of format");
        }
        var c = Caml_string.get(str, str_ind);
        if (c !== 45) {
          if (c !== 93) {
            return parse_char_set_after_char(str_ind + 1 | 0, end_ind, c);
          } else {
            return str_ind + 1 | 0;
          }
        }
        add_in_char_set(char_set, /* '-' */45);
        _str_ind = str_ind + 1 | 0;
        continue ;
      };
    };
    var parse_char_set_after_char = function (_str_ind, end_ind, _c) {
      while(true) {
        var c = _c;
        var str_ind = _str_ind;
        if (str_ind === end_ind) {
          invalid_format_message(end_ind, "unexpected end of format");
        }
        var c$prime = Caml_string.get(str, str_ind);
        var exit = 0;
        if (c$prime >= 46) {
          if (c$prime !== 64) {
            if (c$prime === 93) {
              add_in_char_set(char_set, c);
              return str_ind + 1 | 0;
            }
            
          } else {
            exit = 2;
          }
        } else if (c$prime !== 37) {
          if (c$prime >= 45) {
            var str_ind$1 = str_ind + 1 | 0;
            if (str_ind$1 === end_ind) {
              invalid_format_message(end_ind, "unexpected end of format");
            }
            var c$prime$1 = Caml_string.get(str, str_ind$1);
            if (c$prime$1 !== 37) {
              if (c$prime$1 !== 93) {
                add_range(c, c$prime$1);
                return parse_char_set_content(str_ind$1 + 1 | 0, end_ind);
              } else {
                add_in_char_set(char_set, c);
                add_in_char_set(char_set, /* '-' */45);
                return str_ind$1 + 1 | 0;
              }
            }
            if ((str_ind$1 + 1 | 0) === end_ind) {
              invalid_format_message(end_ind, "unexpected end of format");
            }
            var c$prime$2 = Caml_string.get(str, str_ind$1 + 1 | 0);
            if (c$prime$2 !== 37 && c$prime$2 !== 64) {
              return fail_single_percent(str_ind$1);
            }
            add_range(c, c$prime$2);
            return parse_char_set_content(str_ind$1 + 2 | 0, end_ind);
          }
          
        } else {
          exit = 2;
        }
        if (exit === 2 && c === /* '%' */37) {
          add_in_char_set(char_set, c$prime);
          return parse_char_set_content(str_ind + 1 | 0, end_ind);
        }
        if (c === /* '%' */37) {
          fail_single_percent(str_ind);
        }
        add_in_char_set(char_set, c);
        _c = c$prime;
        _str_ind = str_ind + 1 | 0;
        continue ;
      };
    };
    var parse_char_set_start = function (str_ind, end_ind) {
      if (str_ind === end_ind) {
        invalid_format_message(end_ind, "unexpected end of format");
      }
      var c = Caml_string.get(str, str_ind);
      return parse_char_set_after_char(str_ind + 1 | 0, end_ind, c);
    };
    if (str_ind === end_ind) {
      invalid_format_message(end_ind, "unexpected end of format");
    }
    var match = Caml_string.get(str, str_ind);
    var match$1 = match !== 94 ? [
        str_ind,
        false
      ] : [
        str_ind + 1 | 0,
        true
      ];
    var next_ind = parse_char_set_start(match$1[0], end_ind);
    var char_set$1 = Bytes.to_string(char_set);
    return [
            next_ind,
            match$1[1] ? rev_char_set(char_set$1) : char_set$1
          ];
  };
  var counter_of_char = function (symb) {
    if (symb >= 108) {
      if (symb < 111) {
        switch (symb) {
          case 108 :
              return /* Line_counter */0;
          case 109 :
              break;
          case 110 :
              return /* Char_counter */1;
          
        }
      }
      
    } else if (symb === 76) {
      return /* Token_counter */2;
    }
    throw {
          RE_EXN_ID: "Assert_failure",
          _1: [
            "camlinternalFormat.ml",
            2876,
            34
          ],
          Error: new Error()
        };
  };
  var is_int_base = function (symb) {
    switch (symb) {
      case 89 :
      case 90 :
      case 91 :
      case 92 :
      case 93 :
      case 94 :
      case 95 :
      case 96 :
      case 97 :
      case 98 :
      case 99 :
      case 101 :
      case 102 :
      case 103 :
      case 104 :
      case 106 :
      case 107 :
      case 108 :
      case 109 :
      case 110 :
      case 112 :
      case 113 :
      case 114 :
      case 115 :
      case 116 :
      case 118 :
      case 119 :
          return false;
      case 88 :
      case 100 :
      case 105 :
      case 111 :
      case 117 :
      case 120 :
          return true;
      default:
        return false;
    }
  };
  return parse_literal(0, 0, str.length);
}

function format_of_string_fmtty(str, fmtty) {
  var fmt = fmt_ebb_of_string(undefined, str);
  try {
    return /* Format */{
            _0: type_format(fmt._0, fmtty),
            _1: str
          };
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === Type_mismatch) {
      return Curry._2(failwith_message(/* Format */{
                      _0: {
                        TAG: /* String_literal */11,
                        _0: "bad input: format type mismatch between ",
                        _1: {
                          TAG: /* Caml_string */3,
                          _0: /* No_padding */0,
                          _1: {
                            TAG: /* String_literal */11,
                            _0: " and ",
                            _1: {
                              TAG: /* Caml_string */3,
                              _0: /* No_padding */0,
                              _1: /* End_of_format */0
                            }
                          }
                        }
                      },
                      _1: "bad input: format type mismatch between %S and %S"
                    }), str, string_of_fmtty(fmtty));
    }
    throw exn;
  }
}

function format_of_string_format(str, param) {
  var fmt = fmt_ebb_of_string(undefined, str);
  try {
    return /* Format */{
            _0: type_format(fmt._0, fmtty_of_fmt(param._0)),
            _1: str
          };
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === Type_mismatch) {
      return Curry._2(failwith_message(/* Format */{
                      _0: {
                        TAG: /* String_literal */11,
                        _0: "bad input: format type mismatch between ",
                        _1: {
                          TAG: /* Caml_string */3,
                          _0: /* No_padding */0,
                          _1: {
                            TAG: /* String_literal */11,
                            _0: " and ",
                            _1: {
                              TAG: /* Caml_string */3,
                              _0: /* No_padding */0,
                              _1: /* End_of_format */0
                            }
                          }
                        }
                      },
                      _1: "bad input: format type mismatch between %S and %S"
                    }), str, param._1);
    }
    throw exn;
  }
}

exports.is_in_char_set = is_in_char_set;
exports.rev_char_set = rev_char_set;
exports.create_char_set = create_char_set;
exports.add_in_char_set = add_in_char_set;
exports.freeze_char_set = freeze_char_set;
exports.param_format_of_ignored_format = param_format_of_ignored_format;
exports.make_printf = make_printf;
exports.make_iprintf = make_iprintf;
exports.output_acc = output_acc;
exports.bufput_acc = bufput_acc;
exports.strput_acc = strput_acc;
exports.type_format = type_format;
exports.fmt_ebb_of_string = fmt_ebb_of_string;
exports.format_of_string_fmtty = format_of_string_fmtty;
exports.format_of_string_format = format_of_string_format;
exports.char_of_iconv = char_of_iconv;
exports.string_of_formatting_lit = string_of_formatting_lit;
exports.string_of_formatting_gen = string_of_formatting_gen;
exports.string_of_fmtty = string_of_fmtty;
exports.string_of_fmt = string_of_fmt;
exports.open_box_of_string = open_box_of_string;
exports.symm = symm;
exports.trans = trans;
exports.recast = recast;
/* No side effect */

},{"./buffer.js":1,"./bytes.js":2,"./caml_bytes.js":4,"./caml_exceptions.js":5,"./caml_format.js":7,"./caml_io.js":9,"./caml_js_exceptions.js":10,"./caml_obj.js":11,"./caml_primitive.js":13,"./caml_string.js":14,"./camlinternalFormatBasics.js":17,"./char.js":18,"./curry.js":19,"./pervasives.js":20,"./string.js":22}],17:[function(require,module,exports){
'use strict';


function erase_rel(rest) {
  if (typeof rest === "number") {
    return /* End_of_fmtty */0;
  }
  switch (rest.TAG | 0) {
    case /* Char_ty */0 :
        return {
                TAG: /* Char_ty */0,
                _0: erase_rel(rest._0)
              };
    case /* String_ty */1 :
        return {
                TAG: /* String_ty */1,
                _0: erase_rel(rest._0)
              };
    case /* Int_ty */2 :
        return {
                TAG: /* Int_ty */2,
                _0: erase_rel(rest._0)
              };
    case /* Int32_ty */3 :
        return {
                TAG: /* Int32_ty */3,
                _0: erase_rel(rest._0)
              };
    case /* Nativeint_ty */4 :
        return {
                TAG: /* Nativeint_ty */4,
                _0: erase_rel(rest._0)
              };
    case /* Int64_ty */5 :
        return {
                TAG: /* Int64_ty */5,
                _0: erase_rel(rest._0)
              };
    case /* Float_ty */6 :
        return {
                TAG: /* Float_ty */6,
                _0: erase_rel(rest._0)
              };
    case /* Bool_ty */7 :
        return {
                TAG: /* Bool_ty */7,
                _0: erase_rel(rest._0)
              };
    case /* Format_arg_ty */8 :
        return {
                TAG: /* Format_arg_ty */8,
                _0: rest._0,
                _1: erase_rel(rest._1)
              };
    case /* Format_subst_ty */9 :
        var ty1 = rest._0;
        return {
                TAG: /* Format_subst_ty */9,
                _0: ty1,
                _1: ty1,
                _2: erase_rel(rest._2)
              };
    case /* Alpha_ty */10 :
        return {
                TAG: /* Alpha_ty */10,
                _0: erase_rel(rest._0)
              };
    case /* Theta_ty */11 :
        return {
                TAG: /* Theta_ty */11,
                _0: erase_rel(rest._0)
              };
    case /* Any_ty */12 :
        return {
                TAG: /* Any_ty */12,
                _0: erase_rel(rest._0)
              };
    case /* Reader_ty */13 :
        return {
                TAG: /* Reader_ty */13,
                _0: erase_rel(rest._0)
              };
    case /* Ignored_reader_ty */14 :
        return {
                TAG: /* Ignored_reader_ty */14,
                _0: erase_rel(rest._0)
              };
    
  }
}

function concat_fmtty(fmtty1, fmtty2) {
  if (typeof fmtty1 === "number") {
    return fmtty2;
  }
  switch (fmtty1.TAG | 0) {
    case /* Char_ty */0 :
        return {
                TAG: /* Char_ty */0,
                _0: concat_fmtty(fmtty1._0, fmtty2)
              };
    case /* String_ty */1 :
        return {
                TAG: /* String_ty */1,
                _0: concat_fmtty(fmtty1._0, fmtty2)
              };
    case /* Int_ty */2 :
        return {
                TAG: /* Int_ty */2,
                _0: concat_fmtty(fmtty1._0, fmtty2)
              };
    case /* Int32_ty */3 :
        return {
                TAG: /* Int32_ty */3,
                _0: concat_fmtty(fmtty1._0, fmtty2)
              };
    case /* Nativeint_ty */4 :
        return {
                TAG: /* Nativeint_ty */4,
                _0: concat_fmtty(fmtty1._0, fmtty2)
              };
    case /* Int64_ty */5 :
        return {
                TAG: /* Int64_ty */5,
                _0: concat_fmtty(fmtty1._0, fmtty2)
              };
    case /* Float_ty */6 :
        return {
                TAG: /* Float_ty */6,
                _0: concat_fmtty(fmtty1._0, fmtty2)
              };
    case /* Bool_ty */7 :
        return {
                TAG: /* Bool_ty */7,
                _0: concat_fmtty(fmtty1._0, fmtty2)
              };
    case /* Format_arg_ty */8 :
        return {
                TAG: /* Format_arg_ty */8,
                _0: fmtty1._0,
                _1: concat_fmtty(fmtty1._1, fmtty2)
              };
    case /* Format_subst_ty */9 :
        return {
                TAG: /* Format_subst_ty */9,
                _0: fmtty1._0,
                _1: fmtty1._1,
                _2: concat_fmtty(fmtty1._2, fmtty2)
              };
    case /* Alpha_ty */10 :
        return {
                TAG: /* Alpha_ty */10,
                _0: concat_fmtty(fmtty1._0, fmtty2)
              };
    case /* Theta_ty */11 :
        return {
                TAG: /* Theta_ty */11,
                _0: concat_fmtty(fmtty1._0, fmtty2)
              };
    case /* Any_ty */12 :
        return {
                TAG: /* Any_ty */12,
                _0: concat_fmtty(fmtty1._0, fmtty2)
              };
    case /* Reader_ty */13 :
        return {
                TAG: /* Reader_ty */13,
                _0: concat_fmtty(fmtty1._0, fmtty2)
              };
    case /* Ignored_reader_ty */14 :
        return {
                TAG: /* Ignored_reader_ty */14,
                _0: concat_fmtty(fmtty1._0, fmtty2)
              };
    
  }
}

function concat_fmt(fmt1, fmt2) {
  if (typeof fmt1 === "number") {
    return fmt2;
  }
  switch (fmt1.TAG | 0) {
    case /* Char */0 :
        return {
                TAG: /* Char */0,
                _0: concat_fmt(fmt1._0, fmt2)
              };
    case /* Caml_char */1 :
        return {
                TAG: /* Caml_char */1,
                _0: concat_fmt(fmt1._0, fmt2)
              };
    case /* String */2 :
        return {
                TAG: /* String */2,
                _0: fmt1._0,
                _1: concat_fmt(fmt1._1, fmt2)
              };
    case /* Caml_string */3 :
        return {
                TAG: /* Caml_string */3,
                _0: fmt1._0,
                _1: concat_fmt(fmt1._1, fmt2)
              };
    case /* Int */4 :
        return {
                TAG: /* Int */4,
                _0: fmt1._0,
                _1: fmt1._1,
                _2: fmt1._2,
                _3: concat_fmt(fmt1._3, fmt2)
              };
    case /* Int32 */5 :
        return {
                TAG: /* Int32 */5,
                _0: fmt1._0,
                _1: fmt1._1,
                _2: fmt1._2,
                _3: concat_fmt(fmt1._3, fmt2)
              };
    case /* Nativeint */6 :
        return {
                TAG: /* Nativeint */6,
                _0: fmt1._0,
                _1: fmt1._1,
                _2: fmt1._2,
                _3: concat_fmt(fmt1._3, fmt2)
              };
    case /* Int64 */7 :
        return {
                TAG: /* Int64 */7,
                _0: fmt1._0,
                _1: fmt1._1,
                _2: fmt1._2,
                _3: concat_fmt(fmt1._3, fmt2)
              };
    case /* Float */8 :
        return {
                TAG: /* Float */8,
                _0: fmt1._0,
                _1: fmt1._1,
                _2: fmt1._2,
                _3: concat_fmt(fmt1._3, fmt2)
              };
    case /* Bool */9 :
        return {
                TAG: /* Bool */9,
                _0: fmt1._0,
                _1: concat_fmt(fmt1._1, fmt2)
              };
    case /* Flush */10 :
        return {
                TAG: /* Flush */10,
                _0: concat_fmt(fmt1._0, fmt2)
              };
    case /* String_literal */11 :
        return {
                TAG: /* String_literal */11,
                _0: fmt1._0,
                _1: concat_fmt(fmt1._1, fmt2)
              };
    case /* Char_literal */12 :
        return {
                TAG: /* Char_literal */12,
                _0: fmt1._0,
                _1: concat_fmt(fmt1._1, fmt2)
              };
    case /* Format_arg */13 :
        return {
                TAG: /* Format_arg */13,
                _0: fmt1._0,
                _1: fmt1._1,
                _2: concat_fmt(fmt1._2, fmt2)
              };
    case /* Format_subst */14 :
        return {
                TAG: /* Format_subst */14,
                _0: fmt1._0,
                _1: fmt1._1,
                _2: concat_fmt(fmt1._2, fmt2)
              };
    case /* Alpha */15 :
        return {
                TAG: /* Alpha */15,
                _0: concat_fmt(fmt1._0, fmt2)
              };
    case /* Theta */16 :
        return {
                TAG: /* Theta */16,
                _0: concat_fmt(fmt1._0, fmt2)
              };
    case /* Formatting_lit */17 :
        return {
                TAG: /* Formatting_lit */17,
                _0: fmt1._0,
                _1: concat_fmt(fmt1._1, fmt2)
              };
    case /* Formatting_gen */18 :
        return {
                TAG: /* Formatting_gen */18,
                _0: fmt1._0,
                _1: concat_fmt(fmt1._1, fmt2)
              };
    case /* Reader */19 :
        return {
                TAG: /* Reader */19,
                _0: concat_fmt(fmt1._0, fmt2)
              };
    case /* Scan_char_set */20 :
        return {
                TAG: /* Scan_char_set */20,
                _0: fmt1._0,
                _1: fmt1._1,
                _2: concat_fmt(fmt1._2, fmt2)
              };
    case /* Scan_get_counter */21 :
        return {
                TAG: /* Scan_get_counter */21,
                _0: fmt1._0,
                _1: concat_fmt(fmt1._1, fmt2)
              };
    case /* Scan_next_char */22 :
        return {
                TAG: /* Scan_next_char */22,
                _0: concat_fmt(fmt1._0, fmt2)
              };
    case /* Ignored_param */23 :
        return {
                TAG: /* Ignored_param */23,
                _0: fmt1._0,
                _1: concat_fmt(fmt1._1, fmt2)
              };
    case /* Custom */24 :
        return {
                TAG: /* Custom */24,
                _0: fmt1._0,
                _1: fmt1._1,
                _2: concat_fmt(fmt1._2, fmt2)
              };
    
  }
}

exports.concat_fmtty = concat_fmtty;
exports.erase_rel = erase_rel;
exports.concat_fmt = concat_fmt;
/* No side effect */

},{}],18:[function(require,module,exports){
'use strict';

var Caml_bytes = require("./caml_bytes.js");

function chr(n) {
  if (n < 0 || n > 255) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Char.chr",
          Error: new Error()
        };
  }
  return n;
}

function escaped(c) {
  var exit = 0;
  if (c >= 40) {
    if (c === 92) {
      return "\\\\";
    }
    exit = c >= 127 ? 1 : 2;
  } else if (c >= 32) {
    if (c >= 39) {
      return "\\'";
    }
    exit = 2;
  } else if (c >= 14) {
    exit = 1;
  } else {
    switch (c) {
      case 8 :
          return "\\b";
      case 9 :
          return "\\t";
      case 10 :
          return "\\n";
      case 0 :
      case 1 :
      case 2 :
      case 3 :
      case 4 :
      case 5 :
      case 6 :
      case 7 :
      case 11 :
      case 12 :
          exit = 1;
          break;
      case 13 :
          return "\\r";
      
    }
  }
  switch (exit) {
    case 1 :
        var s = [
          0,
          0,
          0,
          0
        ];
        s[0] = /* '\\' */92;
        s[1] = 48 + (c / 100 | 0) | 0;
        s[2] = 48 + (c / 10 | 0) % 10 | 0;
        s[3] = 48 + c % 10 | 0;
        return Caml_bytes.bytes_to_string(s);
    case 2 :
        var s$1 = [0];
        s$1[0] = c;
        return Caml_bytes.bytes_to_string(s$1);
    
  }
}

function lowercase(c) {
  if (c >= /* 'A' */65 && c <= /* 'Z' */90 || c >= /* '\192' */192 && c <= /* '\214' */214 || c >= /* '\216' */216 && c <= /* '\222' */222) {
    return c + 32 | 0;
  } else {
    return c;
  }
}

function uppercase(c) {
  if (c >= /* 'a' */97 && c <= /* 'z' */122 || c >= /* '\224' */224 && c <= /* '\246' */246 || c >= /* '\248' */248 && c <= /* '\254' */254) {
    return c - 32 | 0;
  } else {
    return c;
  }
}

function lowercase_ascii(c) {
  if (c >= /* 'A' */65 && c <= /* 'Z' */90) {
    return c + 32 | 0;
  } else {
    return c;
  }
}

function uppercase_ascii(c) {
  if (c >= /* 'a' */97 && c <= /* 'z' */122) {
    return c - 32 | 0;
  } else {
    return c;
  }
}

function compare(c1, c2) {
  return c1 - c2 | 0;
}

function equal(c1, c2) {
  return (c1 - c2 | 0) === 0;
}

exports.chr = chr;
exports.escaped = escaped;
exports.lowercase = lowercase;
exports.uppercase = uppercase;
exports.lowercase_ascii = lowercase_ascii;
exports.uppercase_ascii = uppercase_ascii;
exports.compare = compare;
exports.equal = equal;
/* No side effect */

},{"./caml_bytes.js":4}],19:[function(require,module,exports){
'use strict';

var Caml_array = require("./caml_array.js");

function app(_f, _args) {
  while(true) {
    var args = _args;
    var f = _f;
    var init_arity = f.length;
    var arity = init_arity === 0 ? 1 : init_arity;
    var len = args.length;
    var d = arity - len | 0;
    if (d === 0) {
      return f.apply(null, args);
    }
    if (d >= 0) {
      return (function(f,args){
      return function (x) {
        return app(f, args.concat([x]));
      }
      }(f,args));
    }
    _args = Caml_array.caml_array_sub(args, arity, -d | 0);
    _f = f.apply(null, Caml_array.caml_array_sub(args, 0, arity));
    continue ;
  };
}

function _1(o, a0) {
  var arity = o.length;
  if (arity === 1) {
    return o(a0);
  } else {
    switch (arity) {
      case 1 :
          return o(a0);
      case 2 :
          return function (param) {
            return o(a0, param);
          };
      case 3 :
          return function (param, param$1) {
            return o(a0, param, param$1);
          };
      case 4 :
          return function (param, param$1, param$2) {
            return o(a0, param, param$1, param$2);
          };
      case 5 :
          return function (param, param$1, param$2, param$3) {
            return o(a0, param, param$1, param$2, param$3);
          };
      case 6 :
          return function (param, param$1, param$2, param$3, param$4) {
            return o(a0, param, param$1, param$2, param$3, param$4);
          };
      case 7 :
          return function (param, param$1, param$2, param$3, param$4, param$5) {
            return o(a0, param, param$1, param$2, param$3, param$4, param$5);
          };
      default:
        return app(o, [a0]);
    }
  }
}

function __1(o) {
  var arity = o.length;
  if (arity === 1) {
    return o;
  } else {
    return function (a0) {
      return _1(o, a0);
    };
  }
}

function _2(o, a0, a1) {
  var arity = o.length;
  if (arity === 2) {
    return o(a0, a1);
  } else {
    switch (arity) {
      case 1 :
          return app(o(a0), [a1]);
      case 2 :
          return o(a0, a1);
      case 3 :
          return function (param) {
            return o(a0, a1, param);
          };
      case 4 :
          return function (param, param$1) {
            return o(a0, a1, param, param$1);
          };
      case 5 :
          return function (param, param$1, param$2) {
            return o(a0, a1, param, param$1, param$2);
          };
      case 6 :
          return function (param, param$1, param$2, param$3) {
            return o(a0, a1, param, param$1, param$2, param$3);
          };
      case 7 :
          return function (param, param$1, param$2, param$3, param$4) {
            return o(a0, a1, param, param$1, param$2, param$3, param$4);
          };
      default:
        return app(o, [
                    a0,
                    a1
                  ]);
    }
  }
}

function __2(o) {
  var arity = o.length;
  if (arity === 2) {
    return o;
  } else {
    return function (a0, a1) {
      return _2(o, a0, a1);
    };
  }
}

function _3(o, a0, a1, a2) {
  var arity = o.length;
  if (arity === 3) {
    return o(a0, a1, a2);
  } else {
    switch (arity) {
      case 1 :
          return app(o(a0), [
                      a1,
                      a2
                    ]);
      case 2 :
          return app(o(a0, a1), [a2]);
      case 3 :
          return o(a0, a1, a2);
      case 4 :
          return function (param) {
            return o(a0, a1, a2, param);
          };
      case 5 :
          return function (param, param$1) {
            return o(a0, a1, a2, param, param$1);
          };
      case 6 :
          return function (param, param$1, param$2) {
            return o(a0, a1, a2, param, param$1, param$2);
          };
      case 7 :
          return function (param, param$1, param$2, param$3) {
            return o(a0, a1, a2, param, param$1, param$2, param$3);
          };
      default:
        return app(o, [
                    a0,
                    a1,
                    a2
                  ]);
    }
  }
}

function __3(o) {
  var arity = o.length;
  if (arity === 3) {
    return o;
  } else {
    return function (a0, a1, a2) {
      return _3(o, a0, a1, a2);
    };
  }
}

function _4(o, a0, a1, a2, a3) {
  var arity = o.length;
  if (arity === 4) {
    return o(a0, a1, a2, a3);
  } else {
    switch (arity) {
      case 1 :
          return app(o(a0), [
                      a1,
                      a2,
                      a3
                    ]);
      case 2 :
          return app(o(a0, a1), [
                      a2,
                      a3
                    ]);
      case 3 :
          return app(o(a0, a1, a2), [a3]);
      case 4 :
          return o(a0, a1, a2, a3);
      case 5 :
          return function (param) {
            return o(a0, a1, a2, a3, param);
          };
      case 6 :
          return function (param, param$1) {
            return o(a0, a1, a2, a3, param, param$1);
          };
      case 7 :
          return function (param, param$1, param$2) {
            return o(a0, a1, a2, a3, param, param$1, param$2);
          };
      default:
        return app(o, [
                    a0,
                    a1,
                    a2,
                    a3
                  ]);
    }
  }
}

function __4(o) {
  var arity = o.length;
  if (arity === 4) {
    return o;
  } else {
    return function (a0, a1, a2, a3) {
      return _4(o, a0, a1, a2, a3);
    };
  }
}

function _5(o, a0, a1, a2, a3, a4) {
  var arity = o.length;
  if (arity === 5) {
    return o(a0, a1, a2, a3, a4);
  } else {
    switch (arity) {
      case 1 :
          return app(o(a0), [
                      a1,
                      a2,
                      a3,
                      a4
                    ]);
      case 2 :
          return app(o(a0, a1), [
                      a2,
                      a3,
                      a4
                    ]);
      case 3 :
          return app(o(a0, a1, a2), [
                      a3,
                      a4
                    ]);
      case 4 :
          return app(o(a0, a1, a2, a3), [a4]);
      case 5 :
          return o(a0, a1, a2, a3, a4);
      case 6 :
          return function (param) {
            return o(a0, a1, a2, a3, a4, param);
          };
      case 7 :
          return function (param, param$1) {
            return o(a0, a1, a2, a3, a4, param, param$1);
          };
      default:
        return app(o, [
                    a0,
                    a1,
                    a2,
                    a3,
                    a4
                  ]);
    }
  }
}

function __5(o) {
  var arity = o.length;
  if (arity === 5) {
    return o;
  } else {
    return function (a0, a1, a2, a3, a4) {
      return _5(o, a0, a1, a2, a3, a4);
    };
  }
}

function _6(o, a0, a1, a2, a3, a4, a5) {
  var arity = o.length;
  if (arity === 6) {
    return o(a0, a1, a2, a3, a4, a5);
  } else {
    switch (arity) {
      case 1 :
          return app(o(a0), [
                      a1,
                      a2,
                      a3,
                      a4,
                      a5
                    ]);
      case 2 :
          return app(o(a0, a1), [
                      a2,
                      a3,
                      a4,
                      a5
                    ]);
      case 3 :
          return app(o(a0, a1, a2), [
                      a3,
                      a4,
                      a5
                    ]);
      case 4 :
          return app(o(a0, a1, a2, a3), [
                      a4,
                      a5
                    ]);
      case 5 :
          return app(o(a0, a1, a2, a3, a4), [a5]);
      case 6 :
          return o(a0, a1, a2, a3, a4, a5);
      case 7 :
          return function (param) {
            return o(a0, a1, a2, a3, a4, a5, param);
          };
      default:
        return app(o, [
                    a0,
                    a1,
                    a2,
                    a3,
                    a4,
                    a5
                  ]);
    }
  }
}

function __6(o) {
  var arity = o.length;
  if (arity === 6) {
    return o;
  } else {
    return function (a0, a1, a2, a3, a4, a5) {
      return _6(o, a0, a1, a2, a3, a4, a5);
    };
  }
}

function _7(o, a0, a1, a2, a3, a4, a5, a6) {
  var arity = o.length;
  if (arity === 7) {
    return o(a0, a1, a2, a3, a4, a5, a6);
  } else {
    switch (arity) {
      case 1 :
          return app(o(a0), [
                      a1,
                      a2,
                      a3,
                      a4,
                      a5,
                      a6
                    ]);
      case 2 :
          return app(o(a0, a1), [
                      a2,
                      a3,
                      a4,
                      a5,
                      a6
                    ]);
      case 3 :
          return app(o(a0, a1, a2), [
                      a3,
                      a4,
                      a5,
                      a6
                    ]);
      case 4 :
          return app(o(a0, a1, a2, a3), [
                      a4,
                      a5,
                      a6
                    ]);
      case 5 :
          return app(o(a0, a1, a2, a3, a4), [
                      a5,
                      a6
                    ]);
      case 6 :
          return app(o(a0, a1, a2, a3, a4, a5), [a6]);
      case 7 :
          return o(a0, a1, a2, a3, a4, a5, a6);
      default:
        return app(o, [
                    a0,
                    a1,
                    a2,
                    a3,
                    a4,
                    a5,
                    a6
                  ]);
    }
  }
}

function __7(o) {
  var arity = o.length;
  if (arity === 7) {
    return o;
  } else {
    return function (a0, a1, a2, a3, a4, a5, a6) {
      return _7(o, a0, a1, a2, a3, a4, a5, a6);
    };
  }
}

function _8(o, a0, a1, a2, a3, a4, a5, a6, a7) {
  var arity = o.length;
  if (arity === 8) {
    return o(a0, a1, a2, a3, a4, a5, a6, a7);
  } else {
    switch (arity) {
      case 1 :
          return app(o(a0), [
                      a1,
                      a2,
                      a3,
                      a4,
                      a5,
                      a6,
                      a7
                    ]);
      case 2 :
          return app(o(a0, a1), [
                      a2,
                      a3,
                      a4,
                      a5,
                      a6,
                      a7
                    ]);
      case 3 :
          return app(o(a0, a1, a2), [
                      a3,
                      a4,
                      a5,
                      a6,
                      a7
                    ]);
      case 4 :
          return app(o(a0, a1, a2, a3), [
                      a4,
                      a5,
                      a6,
                      a7
                    ]);
      case 5 :
          return app(o(a0, a1, a2, a3, a4), [
                      a5,
                      a6,
                      a7
                    ]);
      case 6 :
          return app(o(a0, a1, a2, a3, a4, a5), [
                      a6,
                      a7
                    ]);
      case 7 :
          return app(o(a0, a1, a2, a3, a4, a5, a6), [a7]);
      default:
        return app(o, [
                    a0,
                    a1,
                    a2,
                    a3,
                    a4,
                    a5,
                    a6,
                    a7
                  ]);
    }
  }
}

function __8(o) {
  var arity = o.length;
  if (arity === 8) {
    return o;
  } else {
    return function (a0, a1, a2, a3, a4, a5, a6, a7) {
      return _8(o, a0, a1, a2, a3, a4, a5, a6, a7);
    };
  }
}

exports.app = app;
exports._1 = _1;
exports.__1 = __1;
exports._2 = _2;
exports.__2 = __2;
exports._3 = _3;
exports.__3 = __3;
exports._4 = _4;
exports.__4 = __4;
exports._5 = _5;
exports.__5 = __5;
exports._6 = _6;
exports.__6 = __6;
exports._7 = _7;
exports.__7 = __7;
exports._8 = _8;
exports.__8 = __8;
/* No side effect */

},{"./caml_array.js":3}],20:[function(require,module,exports){
'use strict';

var Curry = require("./curry.js");
var Caml_io = require("./caml_io.js");
var Caml_sys = require("./caml_sys.js");
var Caml_bytes = require("./caml_bytes.js");
var Caml_format = require("./caml_format.js");
var Caml_string = require("./caml_string.js");
var Caml_exceptions = require("./caml_exceptions.js");
var Caml_js_exceptions = require("./caml_js_exceptions.js");
var Caml_external_polyfill = require("./caml_external_polyfill.js");

function failwith(s) {
  throw {
        RE_EXN_ID: "Failure",
        _1: s,
        Error: new Error()
      };
}

function invalid_arg(s) {
  throw {
        RE_EXN_ID: "Invalid_argument",
        _1: s,
        Error: new Error()
      };
}

var Exit = /* @__PURE__ */Caml_exceptions.create("Pervasives.Exit");

function abs(x) {
  if (x >= 0) {
    return x;
  } else {
    return -x | 0;
  }
}

function lnot(x) {
  return x ^ -1;
}

var min_int = -2147483648;

function classify_float(x) {
  if (isFinite(x)) {
    if (Math.abs(x) >= 2.22507385850720138e-308) {
      return /* FP_normal */0;
    } else if (x !== 0) {
      return /* FP_subnormal */1;
    } else {
      return /* FP_zero */2;
    }
  } else if (isNaN(x)) {
    return /* FP_nan */4;
  } else {
    return /* FP_infinite */3;
  }
}

function char_of_int(n) {
  if (n < 0 || n > 255) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "char_of_int",
          Error: new Error()
        };
  }
  return n;
}

function string_of_bool(b) {
  if (b) {
    return "true";
  } else {
    return "false";
  }
}

function bool_of_string(param) {
  switch (param) {
    case "false" :
        return false;
    case "true" :
        return true;
    default:
      throw {
            RE_EXN_ID: "Invalid_argument",
            _1: "bool_of_string",
            Error: new Error()
          };
  }
}

function bool_of_string_opt(param) {
  switch (param) {
    case "false" :
        return false;
    case "true" :
        return true;
    default:
      return ;
  }
}

function int_of_string_opt(s) {
  try {
    return Caml_format.caml_int_of_string(s);
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === "Failure") {
      return ;
    }
    throw exn;
  }
}

function valid_float_lexem(s) {
  var l = s.length;
  var _i = 0;
  while(true) {
    var i = _i;
    if (i >= l) {
      return s + ".";
    }
    var match = Caml_string.get(s, i);
    if (match >= 48) {
      if (match >= 58) {
        return s;
      }
      _i = i + 1 | 0;
      continue ;
    }
    if (match !== 45) {
      return s;
    }
    _i = i + 1 | 0;
    continue ;
  };
}

function string_of_float(f) {
  return valid_float_lexem(Caml_format.caml_format_float("%.12g", f));
}

function float_of_string_opt(s) {
  try {
    return Caml_format.caml_float_of_string(s);
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === "Failure") {
      return ;
    }
    throw exn;
  }
}

function $at(l1, l2) {
  if (l1) {
    return {
            hd: l1.hd,
            tl: $at(l1.tl, l2)
          };
  } else {
    return l2;
  }
}

var stdin = Caml_io.stdin;

var stdout = Caml_io.stdout;

var stderr = Caml_io.stderr;

function open_out_gen(mode, perm, name) {
  var c = Caml_external_polyfill.resolve("caml_ml_open_descriptor_out")(Caml_external_polyfill.resolve("caml_sys_open")(name, mode, perm));
  Caml_external_polyfill.resolve("caml_ml_set_channel_name")(c, name);
  return c;
}

function open_out(name) {
  return open_out_gen({
              hd: /* Open_wronly */1,
              tl: {
                hd: /* Open_creat */3,
                tl: {
                  hd: /* Open_trunc */4,
                  tl: {
                    hd: /* Open_text */7,
                    tl: /* [] */0
                  }
                }
              }
            }, 438, name);
}

function open_out_bin(name) {
  return open_out_gen({
              hd: /* Open_wronly */1,
              tl: {
                hd: /* Open_creat */3,
                tl: {
                  hd: /* Open_trunc */4,
                  tl: {
                    hd: /* Open_binary */6,
                    tl: /* [] */0
                  }
                }
              }
            }, 438, name);
}

function flush_all(param) {
  var _param = Caml_io.caml_ml_out_channels_list(undefined);
  while(true) {
    var param$1 = _param;
    if (!param$1) {
      return ;
    }
    try {
      Caml_io.caml_ml_flush(param$1.hd);
    }
    catch (raw_exn){
      var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
      if (exn.RE_EXN_ID !== "Sys_error") {
        throw exn;
      }
      
    }
    _param = param$1.tl;
    continue ;
  };
}

function output_bytes(oc, s) {
  return Caml_external_polyfill.resolve("caml_ml_output_bytes")(oc, s, 0, s.length);
}

function output_string(oc, s) {
  return Caml_io.caml_ml_output(oc, s, 0, s.length);
}

function output(oc, s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "output",
          Error: new Error()
        };
  }
  return Caml_external_polyfill.resolve("caml_ml_output_bytes")(oc, s, ofs, len);
}

function output_substring(oc, s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "output_substring",
          Error: new Error()
        };
  }
  return Caml_io.caml_ml_output(oc, s, ofs, len);
}

function output_value(chan, v) {
  return Caml_external_polyfill.resolve("caml_output_value")(chan, v, /* [] */0);
}

function close_out(oc) {
  Caml_io.caml_ml_flush(oc);
  return Caml_external_polyfill.resolve("caml_ml_close_channel")(oc);
}

function close_out_noerr(oc) {
  try {
    Caml_io.caml_ml_flush(oc);
  }
  catch (exn){
    
  }
  try {
    return Caml_external_polyfill.resolve("caml_ml_close_channel")(oc);
  }
  catch (exn$1){
    return ;
  }
}

function open_in_gen(mode, perm, name) {
  var c = Caml_external_polyfill.resolve("caml_ml_open_descriptor_in")(Caml_external_polyfill.resolve("caml_sys_open")(name, mode, perm));
  Caml_external_polyfill.resolve("caml_ml_set_channel_name")(c, name);
  return c;
}

function open_in(name) {
  return open_in_gen({
              hd: /* Open_rdonly */0,
              tl: {
                hd: /* Open_text */7,
                tl: /* [] */0
              }
            }, 0, name);
}

function open_in_bin(name) {
  return open_in_gen({
              hd: /* Open_rdonly */0,
              tl: {
                hd: /* Open_binary */6,
                tl: /* [] */0
              }
            }, 0, name);
}

function input(ic, s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "input",
          Error: new Error()
        };
  }
  return Caml_external_polyfill.resolve("caml_ml_input")(ic, s, ofs, len);
}

function unsafe_really_input(ic, s, _ofs, _len) {
  while(true) {
    var len = _len;
    var ofs = _ofs;
    if (len <= 0) {
      return ;
    }
    var r = Caml_external_polyfill.resolve("caml_ml_input")(ic, s, ofs, len);
    if (r === 0) {
      throw {
            RE_EXN_ID: "End_of_file",
            Error: new Error()
          };
    }
    _len = len - r | 0;
    _ofs = ofs + r | 0;
    continue ;
  };
}

function really_input(ic, s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "really_input",
          Error: new Error()
        };
  }
  return unsafe_really_input(ic, s, ofs, len);
}

function really_input_string(ic, len) {
  var s = Caml_bytes.caml_create_bytes(len);
  really_input(ic, s, 0, len);
  return Caml_bytes.bytes_to_string(s);
}

function input_line(chan) {
  var build_result = function (buf, _pos, _param) {
    while(true) {
      var param = _param;
      var pos = _pos;
      if (!param) {
        return buf;
      }
      var hd = param.hd;
      var len = hd.length;
      Caml_bytes.caml_blit_bytes(hd, 0, buf, pos - len | 0, len);
      _param = param.tl;
      _pos = pos - len | 0;
      continue ;
    };
  };
  var scan = function (_accu, _len) {
    while(true) {
      var len = _len;
      var accu = _accu;
      var n = Caml_external_polyfill.resolve("caml_ml_input_scan_line")(chan);
      if (n === 0) {
        if (accu) {
          return build_result(Caml_bytes.caml_create_bytes(len), len, accu);
        }
        throw {
              RE_EXN_ID: "End_of_file",
              Error: new Error()
            };
      }
      if (n > 0) {
        var res = Caml_bytes.caml_create_bytes(n - 1 | 0);
        Caml_external_polyfill.resolve("caml_ml_input")(chan, res, 0, n - 1 | 0);
        Caml_external_polyfill.resolve("caml_ml_input_char")(chan);
        if (!accu) {
          return res;
        }
        var len$1 = (len + n | 0) - 1 | 0;
        return build_result(Caml_bytes.caml_create_bytes(len$1), len$1, {
                    hd: res,
                    tl: accu
                  });
      }
      var beg = Caml_bytes.caml_create_bytes(-n | 0);
      Caml_external_polyfill.resolve("caml_ml_input")(chan, beg, 0, -n | 0);
      _len = len - n | 0;
      _accu = {
        hd: beg,
        tl: accu
      };
      continue ;
    };
  };
  return Caml_bytes.bytes_to_string(scan(/* [] */0, 0));
}

function close_in_noerr(ic) {
  try {
    return Caml_external_polyfill.resolve("caml_ml_close_channel")(ic);
  }
  catch (exn){
    return ;
  }
}

function print_char(c) {
  return Caml_io.caml_ml_output_char(stdout, c);
}

function print_string(s) {
  return output_string(stdout, s);
}

function print_bytes(s) {
  return output_bytes(stdout, s);
}

function print_int(i) {
  return output_string(stdout, String(i));
}

function print_float(f) {
  return output_string(stdout, valid_float_lexem(Caml_format.caml_format_float("%.12g", f)));
}

function print_newline(param) {
  Caml_io.caml_ml_output_char(stdout, /* '\n' */10);
  return Caml_io.caml_ml_flush(stdout);
}

function prerr_char(c) {
  return Caml_io.caml_ml_output_char(stderr, c);
}

function prerr_string(s) {
  return output_string(stderr, s);
}

function prerr_bytes(s) {
  return output_bytes(stderr, s);
}

function prerr_int(i) {
  return output_string(stderr, String(i));
}

function prerr_float(f) {
  return output_string(stderr, valid_float_lexem(Caml_format.caml_format_float("%.12g", f)));
}

function prerr_newline(param) {
  Caml_io.caml_ml_output_char(stderr, /* '\n' */10);
  return Caml_io.caml_ml_flush(stderr);
}

function read_line(param) {
  Caml_io.caml_ml_flush(stdout);
  return input_line(stdin);
}

function read_int(param) {
  return Caml_format.caml_int_of_string((Caml_io.caml_ml_flush(stdout), input_line(stdin)));
}

function read_int_opt(param) {
  return int_of_string_opt((Caml_io.caml_ml_flush(stdout), input_line(stdin)));
}

function read_float(param) {
  return Caml_format.caml_float_of_string((Caml_io.caml_ml_flush(stdout), input_line(stdin)));
}

function read_float_opt(param) {
  return float_of_string_opt((Caml_io.caml_ml_flush(stdout), input_line(stdin)));
}

function string_of_format(param) {
  return param._1;
}

var exit_function = {
  contents: flush_all
};

function at_exit(f) {
  var g = exit_function.contents;
  exit_function.contents = (function (param) {
      Curry._1(f, undefined);
      return Curry._1(g, undefined);
    });
  
}

function do_at_exit(param) {
  return Curry._1(exit_function.contents, undefined);
}

function exit(retcode) {
  do_at_exit(undefined);
  return Caml_sys.caml_sys_exit(retcode);
}

var max_int = 2147483647;

var infinity = Infinity;

var neg_infinity = -Infinity;

var max_float = 1.79769313486231571e+308;

var min_float = 2.22507385850720138e-308;

var epsilon_float = 2.22044604925031308e-16;

var flush = Caml_io.caml_ml_flush;

var output_char = Caml_io.caml_ml_output_char;

var output_byte = Caml_io.caml_ml_output_char;

function output_binary_int(prim, prim$1) {
  return Caml_external_polyfill.resolve("caml_ml_output_int")(prim, prim$1);
}

function seek_out(prim, prim$1) {
  return Caml_external_polyfill.resolve("caml_ml_seek_out")(prim, prim$1);
}

function pos_out(prim) {
  return Caml_external_polyfill.resolve("caml_ml_pos_out")(prim);
}

function out_channel_length(prim) {
  return Caml_external_polyfill.resolve("caml_ml_channel_size")(prim);
}

function set_binary_mode_out(prim, prim$1) {
  return Caml_external_polyfill.resolve("caml_ml_set_binary_mode")(prim, prim$1);
}

function input_char(prim) {
  return Caml_external_polyfill.resolve("caml_ml_input_char")(prim);
}

function input_byte(prim) {
  return Caml_external_polyfill.resolve("caml_ml_input_char")(prim);
}

function input_binary_int(prim) {
  return Caml_external_polyfill.resolve("caml_ml_input_int")(prim);
}

function input_value(prim) {
  return Caml_external_polyfill.resolve("caml_input_value")(prim);
}

function seek_in(prim, prim$1) {
  return Caml_external_polyfill.resolve("caml_ml_seek_in")(prim, prim$1);
}

function pos_in(prim) {
  return Caml_external_polyfill.resolve("caml_ml_pos_in")(prim);
}

function in_channel_length(prim) {
  return Caml_external_polyfill.resolve("caml_ml_channel_size")(prim);
}

function close_in(prim) {
  return Caml_external_polyfill.resolve("caml_ml_close_channel")(prim);
}

function set_binary_mode_in(prim, prim$1) {
  return Caml_external_polyfill.resolve("caml_ml_set_binary_mode")(prim, prim$1);
}

function LargeFile_seek_out(prim, prim$1) {
  return Caml_external_polyfill.resolve("caml_ml_seek_out_64")(prim, prim$1);
}

function LargeFile_pos_out(prim) {
  return Caml_external_polyfill.resolve("caml_ml_pos_out_64")(prim);
}

function LargeFile_out_channel_length(prim) {
  return Caml_external_polyfill.resolve("caml_ml_channel_size_64")(prim);
}

function LargeFile_seek_in(prim, prim$1) {
  return Caml_external_polyfill.resolve("caml_ml_seek_in_64")(prim, prim$1);
}

function LargeFile_pos_in(prim) {
  return Caml_external_polyfill.resolve("caml_ml_pos_in_64")(prim);
}

function LargeFile_in_channel_length(prim) {
  return Caml_external_polyfill.resolve("caml_ml_channel_size_64")(prim);
}

var LargeFile = {
  seek_out: LargeFile_seek_out,
  pos_out: LargeFile_pos_out,
  out_channel_length: LargeFile_out_channel_length,
  seek_in: LargeFile_seek_in,
  pos_in: LargeFile_pos_in,
  in_channel_length: LargeFile_in_channel_length
};

exports.invalid_arg = invalid_arg;
exports.failwith = failwith;
exports.Exit = Exit;
exports.abs = abs;
exports.max_int = max_int;
exports.min_int = min_int;
exports.lnot = lnot;
exports.infinity = infinity;
exports.neg_infinity = neg_infinity;
exports.max_float = max_float;
exports.min_float = min_float;
exports.epsilon_float = epsilon_float;
exports.classify_float = classify_float;
exports.char_of_int = char_of_int;
exports.string_of_bool = string_of_bool;
exports.bool_of_string = bool_of_string;
exports.bool_of_string_opt = bool_of_string_opt;
exports.int_of_string_opt = int_of_string_opt;
exports.string_of_float = string_of_float;
exports.float_of_string_opt = float_of_string_opt;
exports.$at = $at;
exports.stdin = stdin;
exports.stdout = stdout;
exports.stderr = stderr;
exports.print_char = print_char;
exports.print_string = print_string;
exports.print_bytes = print_bytes;
exports.print_int = print_int;
exports.print_float = print_float;
exports.print_newline = print_newline;
exports.prerr_char = prerr_char;
exports.prerr_string = prerr_string;
exports.prerr_bytes = prerr_bytes;
exports.prerr_int = prerr_int;
exports.prerr_float = prerr_float;
exports.prerr_newline = prerr_newline;
exports.read_line = read_line;
exports.read_int = read_int;
exports.read_int_opt = read_int_opt;
exports.read_float = read_float;
exports.read_float_opt = read_float_opt;
exports.open_out = open_out;
exports.open_out_bin = open_out_bin;
exports.open_out_gen = open_out_gen;
exports.flush = flush;
exports.flush_all = flush_all;
exports.output_char = output_char;
exports.output_string = output_string;
exports.output_bytes = output_bytes;
exports.output = output;
exports.output_substring = output_substring;
exports.output_byte = output_byte;
exports.output_binary_int = output_binary_int;
exports.output_value = output_value;
exports.seek_out = seek_out;
exports.pos_out = pos_out;
exports.out_channel_length = out_channel_length;
exports.close_out = close_out;
exports.close_out_noerr = close_out_noerr;
exports.set_binary_mode_out = set_binary_mode_out;
exports.open_in = open_in;
exports.open_in_bin = open_in_bin;
exports.open_in_gen = open_in_gen;
exports.input_char = input_char;
exports.input_line = input_line;
exports.input = input;
exports.really_input = really_input;
exports.really_input_string = really_input_string;
exports.input_byte = input_byte;
exports.input_binary_int = input_binary_int;
exports.input_value = input_value;
exports.seek_in = seek_in;
exports.pos_in = pos_in;
exports.in_channel_length = in_channel_length;
exports.close_in = close_in;
exports.close_in_noerr = close_in_noerr;
exports.set_binary_mode_in = set_binary_mode_in;
exports.LargeFile = LargeFile;
exports.string_of_format = string_of_format;
exports.exit = exit;
exports.at_exit = at_exit;
exports.valid_float_lexem = valid_float_lexem;
exports.unsafe_really_input = unsafe_really_input;
exports.do_at_exit = do_at_exit;
/* No side effect */

},{"./caml_bytes.js":4,"./caml_exceptions.js":5,"./caml_external_polyfill.js":6,"./caml_format.js":7,"./caml_io.js":9,"./caml_js_exceptions.js":10,"./caml_string.js":14,"./caml_sys.js":15,"./curry.js":19}],21:[function(require,module,exports){
'use strict';

var Curry = require("./curry.js");
var $$Buffer = require("./buffer.js");
var Pervasives = require("./pervasives.js");
var CamlinternalFormat = require("./camlinternalFormat.js");

function kfprintf(k, o, param) {
  return CamlinternalFormat.make_printf((function (o, acc) {
                CamlinternalFormat.output_acc(o, acc);
                return Curry._1(k, o);
              }), o, /* End_of_acc */0, param._0);
}

function kbprintf(k, b, param) {
  return CamlinternalFormat.make_printf((function (b, acc) {
                CamlinternalFormat.bufput_acc(b, acc);
                return Curry._1(k, b);
              }), b, /* End_of_acc */0, param._0);
}

function ikfprintf(k, oc, param) {
  return CamlinternalFormat.make_iprintf(k, oc, param._0);
}

function fprintf(oc, fmt) {
  return kfprintf((function (prim) {
                
              }), oc, fmt);
}

function bprintf(b, fmt) {
  return kbprintf((function (prim) {
                
              }), b, fmt);
}

function ifprintf(oc, fmt) {
  return ikfprintf((function (prim) {
                
              }), oc, fmt);
}

function printf(fmt) {
  return fprintf(Pervasives.stdout, fmt);
}

function eprintf(fmt) {
  return fprintf(Pervasives.stderr, fmt);
}

function ksprintf(k, param) {
  var k$prime = function (param, acc) {
    var buf = $$Buffer.create(64);
    CamlinternalFormat.strput_acc(buf, acc);
    return Curry._1(k, $$Buffer.contents(buf));
  };
  return CamlinternalFormat.make_printf(k$prime, undefined, /* End_of_acc */0, param._0);
}

function sprintf(fmt) {
  return ksprintf((function (s) {
                return s;
              }), fmt);
}

var kprintf = ksprintf;

exports.fprintf = fprintf;
exports.printf = printf;
exports.eprintf = eprintf;
exports.sprintf = sprintf;
exports.bprintf = bprintf;
exports.ifprintf = ifprintf;
exports.kfprintf = kfprintf;
exports.ikfprintf = ikfprintf;
exports.ksprintf = ksprintf;
exports.kbprintf = kbprintf;
exports.kprintf = kprintf;
/* No side effect */

},{"./buffer.js":1,"./camlinternalFormat.js":16,"./curry.js":19,"./pervasives.js":20}],22:[function(require,module,exports){
'use strict';

var Bytes = require("./bytes.js");
var Curry = require("./curry.js");
var Caml_bytes = require("./caml_bytes.js");
var Caml_string = require("./caml_string.js");
var Caml_primitive = require("./caml_primitive.js");
var Caml_js_exceptions = require("./caml_js_exceptions.js");

function init(n, f) {
  return Caml_bytes.bytes_to_string(Bytes.init(n, f));
}

function copy(s) {
  return Caml_bytes.bytes_to_string(Bytes.copy(Caml_bytes.bytes_of_string(s)));
}

function sub(s, ofs, len) {
  return Caml_bytes.bytes_to_string(Bytes.sub(Caml_bytes.bytes_of_string(s), ofs, len));
}

function ensure_ge(x, y) {
  if (x >= y) {
    return x;
  }
  throw {
        RE_EXN_ID: "Invalid_argument",
        _1: "String.concat",
        Error: new Error()
      };
}

function sum_lengths(_acc, seplen, _param) {
  while(true) {
    var param = _param;
    var acc = _acc;
    if (!param) {
      return acc;
    }
    var tl = param.tl;
    var hd = param.hd;
    if (!tl) {
      return hd.length + acc | 0;
    }
    _param = tl;
    _acc = ensure_ge((hd.length + seplen | 0) + acc | 0, acc);
    continue ;
  };
}

function unsafe_blits(dst, _pos, sep, seplen, _param) {
  while(true) {
    var param = _param;
    var pos = _pos;
    if (!param) {
      return dst;
    }
    var tl = param.tl;
    var hd = param.hd;
    if (tl) {
      Caml_bytes.caml_blit_string(hd, 0, dst, pos, hd.length);
      Caml_bytes.caml_blit_string(sep, 0, dst, pos + hd.length | 0, seplen);
      _param = tl;
      _pos = (pos + hd.length | 0) + seplen | 0;
      continue ;
    }
    Caml_bytes.caml_blit_string(hd, 0, dst, pos, hd.length);
    return dst;
  };
}

function concat(sep, l) {
  if (!l) {
    return "";
  }
  var seplen = sep.length;
  return Caml_bytes.bytes_to_string(unsafe_blits(Caml_bytes.caml_create_bytes(sum_lengths(0, seplen, l)), 0, sep, seplen, l));
}

function iter(f, s) {
  for(var i = 0 ,i_finish = s.length; i < i_finish; ++i){
    Curry._1(f, s.charCodeAt(i));
  }
  
}

function iteri(f, s) {
  for(var i = 0 ,i_finish = s.length; i < i_finish; ++i){
    Curry._2(f, i, s.charCodeAt(i));
  }
  
}

function map(f, s) {
  return Caml_bytes.bytes_to_string(Bytes.map(f, Caml_bytes.bytes_of_string(s)));
}

function mapi(f, s) {
  return Caml_bytes.bytes_to_string(Bytes.mapi(f, Caml_bytes.bytes_of_string(s)));
}

function is_space(param) {
  if (param > 13 || param < 9) {
    return param === 32;
  } else {
    return param !== 11;
  }
}

function trim(s) {
  if (s === "" || !(is_space(s.charCodeAt(0)) || is_space(s.charCodeAt(s.length - 1 | 0)))) {
    return s;
  } else {
    return Caml_bytes.bytes_to_string(Bytes.trim(Caml_bytes.bytes_of_string(s)));
  }
}

function escaped(s) {
  var needs_escape = function (_i) {
    while(true) {
      var i = _i;
      if (i >= s.length) {
        return false;
      }
      var match = s.charCodeAt(i);
      if (match < 32) {
        return true;
      }
      if (match > 92 || match < 34) {
        if (match >= 127) {
          return true;
        }
        _i = i + 1 | 0;
        continue ;
      }
      if (match > 91 || match < 35) {
        return true;
      }
      _i = i + 1 | 0;
      continue ;
    };
  };
  if (needs_escape(0)) {
    return Caml_bytes.bytes_to_string(Bytes.escaped(Caml_bytes.bytes_of_string(s)));
  } else {
    return s;
  }
}

function index_rec(s, lim, _i, c) {
  while(true) {
    var i = _i;
    if (i >= lim) {
      throw {
            RE_EXN_ID: "Not_found",
            Error: new Error()
          };
    }
    if (s.charCodeAt(i) === c) {
      return i;
    }
    _i = i + 1 | 0;
    continue ;
  };
}

function index(s, c) {
  return index_rec(s, s.length, 0, c);
}

function index_rec_opt(s, lim, _i, c) {
  while(true) {
    var i = _i;
    if (i >= lim) {
      return ;
    }
    if (s.charCodeAt(i) === c) {
      return i;
    }
    _i = i + 1 | 0;
    continue ;
  };
}

function index_opt(s, c) {
  return index_rec_opt(s, s.length, 0, c);
}

function index_from(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.index_from / Bytes.index_from",
          Error: new Error()
        };
  }
  return index_rec(s, l, i, c);
}

function index_from_opt(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.index_from_opt / Bytes.index_from_opt",
          Error: new Error()
        };
  }
  return index_rec_opt(s, l, i, c);
}

function rindex_rec(s, _i, c) {
  while(true) {
    var i = _i;
    if (i < 0) {
      throw {
            RE_EXN_ID: "Not_found",
            Error: new Error()
          };
    }
    if (s.charCodeAt(i) === c) {
      return i;
    }
    _i = i - 1 | 0;
    continue ;
  };
}

function rindex(s, c) {
  return rindex_rec(s, s.length - 1 | 0, c);
}

function rindex_from(s, i, c) {
  if (i < -1 || i >= s.length) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.rindex_from / Bytes.rindex_from",
          Error: new Error()
        };
  }
  return rindex_rec(s, i, c);
}

function rindex_rec_opt(s, _i, c) {
  while(true) {
    var i = _i;
    if (i < 0) {
      return ;
    }
    if (s.charCodeAt(i) === c) {
      return i;
    }
    _i = i - 1 | 0;
    continue ;
  };
}

function rindex_opt(s, c) {
  return rindex_rec_opt(s, s.length - 1 | 0, c);
}

function rindex_from_opt(s, i, c) {
  if (i < -1 || i >= s.length) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.rindex_from_opt / Bytes.rindex_from_opt",
          Error: new Error()
        };
  }
  return rindex_rec_opt(s, i, c);
}

function contains_from(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.contains_from / Bytes.contains_from",
          Error: new Error()
        };
  }
  try {
    index_rec(s, l, i, c);
    return true;
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === "Not_found") {
      return false;
    }
    throw exn;
  }
}

function contains(s, c) {
  return contains_from(s, 0, c);
}

function rcontains_from(s, i, c) {
  if (i < 0 || i >= s.length) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.rcontains_from / Bytes.rcontains_from",
          Error: new Error()
        };
  }
  try {
    rindex_rec(s, i, c);
    return true;
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === "Not_found") {
      return false;
    }
    throw exn;
  }
}

function uppercase_ascii(s) {
  return Caml_bytes.bytes_to_string(Bytes.uppercase_ascii(Caml_bytes.bytes_of_string(s)));
}

function lowercase_ascii(s) {
  return Caml_bytes.bytes_to_string(Bytes.lowercase_ascii(Caml_bytes.bytes_of_string(s)));
}

function capitalize_ascii(s) {
  return Caml_bytes.bytes_to_string(Bytes.capitalize_ascii(Caml_bytes.bytes_of_string(s)));
}

function uncapitalize_ascii(s) {
  return Caml_bytes.bytes_to_string(Bytes.uncapitalize_ascii(Caml_bytes.bytes_of_string(s)));
}

var compare = Caml_primitive.caml_string_compare;

function split_on_char(sep, s) {
  var r = /* [] */0;
  var j = s.length;
  for(var i = s.length - 1 | 0; i >= 0; --i){
    if (s.charCodeAt(i) === sep) {
      r = {
        hd: sub(s, i + 1 | 0, (j - i | 0) - 1 | 0),
        tl: r
      };
      j = i;
    }
    
  }
  return {
          hd: sub(s, 0, j),
          tl: r
        };
}

function uppercase(s) {
  return Caml_bytes.bytes_to_string(Bytes.uppercase(Caml_bytes.bytes_of_string(s)));
}

function lowercase(s) {
  return Caml_bytes.bytes_to_string(Bytes.lowercase(Caml_bytes.bytes_of_string(s)));
}

function capitalize(s) {
  return Caml_bytes.bytes_to_string(Bytes.capitalize(Caml_bytes.bytes_of_string(s)));
}

function uncapitalize(s) {
  return Caml_bytes.bytes_to_string(Bytes.uncapitalize(Caml_bytes.bytes_of_string(s)));
}

var make = Caml_string.make;

var fill = Bytes.fill;

var blit = Bytes.blit_string;

function equal(prim, prim$1) {
  return prim === prim$1;
}

exports.make = make;
exports.init = init;
exports.copy = copy;
exports.sub = sub;
exports.fill = fill;
exports.blit = blit;
exports.concat = concat;
exports.iter = iter;
exports.iteri = iteri;
exports.map = map;
exports.mapi = mapi;
exports.trim = trim;
exports.escaped = escaped;
exports.index = index;
exports.index_opt = index_opt;
exports.rindex = rindex;
exports.rindex_opt = rindex_opt;
exports.index_from = index_from;
exports.index_from_opt = index_from_opt;
exports.rindex_from = rindex_from;
exports.rindex_from_opt = rindex_from_opt;
exports.contains = contains;
exports.contains_from = contains_from;
exports.rcontains_from = rcontains_from;
exports.uppercase = uppercase;
exports.lowercase = lowercase;
exports.capitalize = capitalize;
exports.uncapitalize = uncapitalize;
exports.uppercase_ascii = uppercase_ascii;
exports.lowercase_ascii = lowercase_ascii;
exports.capitalize_ascii = capitalize_ascii;
exports.uncapitalize_ascii = uncapitalize_ascii;
exports.compare = compare;
exports.equal = equal;
exports.split_on_char = split_on_char;
/* No side effect */

},{"./bytes.js":2,"./caml_bytes.js":4,"./caml_js_exceptions.js":10,"./caml_primitive.js":13,"./caml_string.js":14,"./curry.js":19}],23:[function(require,module,exports){
'use strict';

var Pervasives = require("bs-platform/lib/js/pervasives.js");

var Composite = {
  sourceOver: "source-over",
  sourceIn: "source-in",
  sourceOut: "source-out",
  sourceAtop: "source-atop",
  destinationOver: "destination-over",
  destinationIn: "destination-in",
  destinationOut: "destination-out",
  destinationAtop: "destination-atop",
  lighter: "lighter",
  copy: "copy",
  xor: "xor"
};

var LineCap = {
  butt: "butt",
  round: "round",
  square: "square"
};

var LineJoin = {
  round: "round",
  bevel: "bevel",
  miter: "miter"
};

function setStrokeStyle(ctx, param, v) {
  ctx.strokeStyle = v;
  
}

function setFillStyle(ctx, param, v) {
  ctx.fillStyle = v;
  
}

function reifyStyle(x) {
  var isCanvasGradient = (function(x) { return x instanceof CanvasGradient; });
  var isCanvasPattern = (function(x) { return x instanceof CanvasPattern; });
  return [
          typeof x === "string" ? /* String */0 : (
              isCanvasGradient(x) ? /* Gradient */1 : (
                  isCanvasPattern(x) ? /* Pattern */2 : Pervasives.invalid_arg("Unknown canvas style kind. Known values are: String, CanvasGradient, CanvasPattern")
                )
            ),
          x
        ];
}

function fillStyle(ctx) {
  return reifyStyle(ctx.fillStyle);
}

function strokeStyle(ctx) {
  return reifyStyle(ctx.strokeStyle);
}

exports.Composite = Composite;
exports.LineCap = LineCap;
exports.LineJoin = LineJoin;
exports.setStrokeStyle = setStrokeStyle;
exports.setFillStyle = setFillStyle;
exports.reifyStyle = reifyStyle;
exports.fillStyle = fillStyle;
exports.strokeStyle = strokeStyle;
/* No side effect */

},{"bs-platform/lib/js/pervasives.js":20}],24:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],25:[function(require,module,exports){
// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var Printf = require("bs-platform/lib/js/printf.js");
var Caml_exceptions = require("bs-platform/lib/js/caml_exceptions.js");
var Webapi__Canvas__Canvas2d = require("bs-webapi/src/Webapi/Canvas/Webapi__Canvas__Canvas2d.bs.js");

var CanvasGraphicsException = /* @__PURE__ */Caml_exceptions.create("Dance.CanvasGraphics.CanvasGraphicsException");

var black = "#000000";

var blue = "#0000FF";

var red = "#FF0000";

var green = "#00FF00";

var purple = "#800080";

var maroon = "#800000";

var navy = "#8B0000";

var dark_red = "8B0000";

var orange = "#FFA500";

function open_graph(canvas_id) {
    var e = document.getElementById(canvas_id);
    if (!(e == null)) {
        return e.getContext("2d");
    }
    throw {
        RE_EXN_ID: "Not_found",
        Error: new Error()
    };
}

function set_color(context, color) {
    Webapi__Canvas__Canvas2d.setFillStyle(context, /* String */0, color);
    return Webapi__Canvas__Canvas2d.setStrokeStyle(context, /* String */0, color);
}

function draw_string(context, x, y, str) {
    context.font = "12pt Osaka";
    context.fillText(str, x, y, 50);
}

function draw_line(context, from_x, from_y, x, y) {
    context.lineWidth = 0.5;
    context.beginPath();
    context.moveTo(from_x, from_y);
    context.lineTo(x, y);
    context.stroke();
}

var CanvasGraphics = {
    CanvasGraphicsException: CanvasGraphicsException,
    black: black,
    blue: blue,
    red: red,
    green: green,
    purple: purple,
    maroon: maroon,
    navy: navy,
    dark_red: dark_red,
    orange: orange,
    open_graph: open_graph,
    set_color: set_color,
    draw_string: draw_string,
    draw_line: draw_line
};

function year(param) {
    switch (param) {
        case /* Mercury */0:
            return 87.969;
        case /* Venus */1:
            return 224.701;
        case /* Earth */2:
            return 365.256;
        case /* Mars */3:
            return 686.980;
        case /* Jupiter */4:
            return 4332.6;
        case /* Saturn */5:
            return 10759.2;
        case /* Uranus */6:
            return 30685;
        case /* Neptune */7:
            return 60190;
        case /* Pluto */8:
            return 90465;

    }
}

function orbit(param) {
    switch (param) {
        case /* Mercury */0:
            return 57.91;
        case /* Venus */1:
            return 108.21;
        case /* Earth */2:
            return 149.60;
        case /* Mars */3:
            return 227.92;
        case /* Jupiter */4:
            return 778.57;
        case /* Saturn */5:
            return 1433.5;
        case /* Uranus */6:
            return 2872.46;
        case /* Neptune */7:
            return 4495.1;
        case /* Pluto */8:
            return 5869.7;

    }
}

function name(param) {
    switch (param) {
        case /* Mercury */0:
            return "Mercury";
        case /* Venus */1:
            return "Venus";
        case /* Earth */2:
            return "Earth";
        case /* Mars */3:
            return "Mars";
        case /* Jupiter */4:
            return "Jupiter";
        case /* Saturn */5:
            return "Saturn";
        case /* Uranus */6:
            return "Uranus";
        case /* Neptune */7:
            return "Neptune";
        case /* Pluto */8:
            return "Pluto";

    }
}

function dance(context, outer_planet, inner_planet, orbits) {
    var pi = 4.0 * Math.atan(1.0);
    var outer_planet_year = year(outer_planet);
    var inner_planet_year = year(inner_planet);
    var outer_planet_radius = orbit(outer_planet);
    var inner_planet_radius = orbit(inner_planet);
    var interval_days = outer_planet_year / 75;
    var ycenter = 200;
    var xcenter = 200;
    var r2 = ycenter * inner_planet_radius / outer_planet_radius;
    var r = 0;
    var rstop = outer_planet_year * orbits;
    var a1 = 0;
    var a1_interval = 2 * pi * interval_days / outer_planet_year;
    var a2 = 0;
    var a2_interval = 2 * pi * interval_days / inner_planet_year;
    var outer_planet_name = name(outer_planet);
    var inner_planet_name = name(inner_planet);
    var orbit_text = Curry._1(Printf.sprintf( /* Format */{
        _0: {
            TAG: /* Float */8,
            _0: /* Float_f */0,
            _1: /* No_padding */0,
            _2: /* Lit_precision */{
                _0: 0
            },
            _3: {
                TAG: /* String_literal */11,
                _0: " orbits",
                _1: /* End_of_format */0
            }
        },
        _1: "%.0f orbits"
    }), orbits);
    set_color(context, blue);
    draw_string(context, 10, 25, outer_planet_name);
    draw_string(context, 10, 45, inner_planet_name);
    draw_string(context, 10, 380, orbit_text);
    while (r < rstop) {
        var i = Math.floor(r / interval_days / 75) | 0;
        var c = i === 0 ? black : i === 1 ? blue : i === 2 ? red : i === 3 ? green : i === 4 ? purple : i === 5 ? maroon : i === 6 ? navy : i === 7 ? dark_red : orange;
        a1 = a1 - a1_interval;
        a2 = a2 - a2_interval;
        var x1 = ycenter * Math.cos(a1);
        var y1 = ycenter * Math.sin(a1);
        var x2 = r2 * Math.cos(a2);
        var y2 = r2 * Math.sin(a2);
        set_color(context, c);
        draw_line(context, x1 + xcenter | 0, y1 + ycenter | 0, x2 + xcenter | 0, y2 + ycenter | 0);
        r = r + interval_days;
    };
}

var context = open_graph("canvas1");

dance(context, /* Earth */2, /* Venus */1, 8);

var context$1 = open_graph("canvas2");

dance(context$1, /* Mars */3, /* Venus */1, 7);

var context$2 = open_graph("canvas3");

dance(context$2, /* Saturn */5, /* Jupiter */4, 7);

var context$3 = open_graph("canvas4");

dance(context$3, /* Uranus */6, /* Saturn */5, 7);

var context$4 = open_graph("canvas5");

dance(context$4, /* Jupiter */4, /* Earth */2, 7);

var context$5 = open_graph("canvas6");

dance(context$5, /* Mars */3, /* Earth */2, 7);

var context$6 = open_graph("canvas7");

dance(context$6, /* Earth */2, /* Mercury */0, 6);

exports.CanvasGraphics = CanvasGraphics;
exports.year = year;
exports.orbit = orbit;
exports.name = name;
exports.dance = dance;
/* context Not a pure module */

},{"bs-platform/lib/js/caml_exceptions.js":5,"bs-platform/lib/js/curry.js":19,"bs-platform/lib/js/printf.js":21,"bs-webapi/src/Webapi/Canvas/Webapi__Canvas__Canvas2d.bs.js":23}]},{},[25]);
