// https://golang.org/ref/mod#go-mod-file-grammar

export default grammar({
  name: "gomod_orchard",

  extras: ($) => [$.comment, /\s/],

  rules: {
    source_file: ($) => repeat($._directive),

    _directive: ($) =>
      choice(
        $.module_directive,
        $.go_directive,
        $.tool_directive_single,
        $.tool_directive_multi,
        $.toolchain_directive,
        $.require_directive_single,
        $.require_directive_multi,
        $.exclude_directive_single,
        $.exclude_directive_multi,
        $.replace_directive_single,
        $.replace_directive_multi,
        $.retract_directive_single,
        $.retract_directive_multi,
        $.ignore_directive_single,
        $.ignore_directive_multi,
        $.godebug_directive_single,
        $.godebug_directive_multi,
      ),

    _string_literal: ($) =>
      choice($.raw_string_literal, $.interpreted_string_literal),

    raw_string_literal: ($) => token(seq("`", repeat(/[^`]/), "`")),

    interpreted_string_literal: ($) =>
      seq(
        '"',
        repeat(
          choice(token.immediate(prec(1, /[^"\n\\]+/)), $.escape_sequence),
        ),
        '"',
      ),

    escape_sequence: ($) =>
      token.immediate(
        seq(
          "\\",
          choice(
            /[^xuU]/,
            /\d{2,3}/,
            /x[0-9a-fA-F]{2,}/,
            /u[0-9a-fA-F]{4}/,
            /U[0-9a-fA-F]{8}/,
          ),
        ),
      ),

    _identifier: ($) => token(/[^\s,\[\]/][^\s,\[\]]+/),

    _string_or_ident: ($) => choice($._string_literal, $._identifier),

    module_path: ($) => $._string_or_ident,
    go_version: ($) => $._string_or_ident,
    version: ($) => $._string_or_ident,
    tool: ($) => $._string_or_ident,

    module_directive: ($) =>
      seq(
        "module",
        choice($.module_path, seq("(", "\n", $.module_path, "\n", ")")),
      ),

    go_directive: ($) => seq("go", field("version", $.go_version), "\n"),

    toolchain_directive: ($) =>
      seq("toolchain", field("name", $.toolchain_name)),

    toolchain_name: ($) => $._string_or_ident,

    // 'require' directives

    require_directive_single: ($) =>
      seq(
        "require",
        $.require_spec,
      ),

    require_directive_multi: ($) =>
      seq(
        "require",
        "(",
        "\n",
        repeat($.require_spec),
        ")",
        "\n",
      ),

    require_spec: ($) => seq(
      field("path", $.module_path),
      field("version", $.version),
      "\n"
    ),

    // 'ignore' directives

    ignore_directive_single: ($) =>
      seq(
        "ignore",
        $.ignore_spec,
      ),

    ignore_directive_multi: ($) =>
      seq(
        "ignore",
        "(",
        "\n",
        repeat($.ignore_spec),
        ")",
        "\n",
      ),

    ignore_spec: ($) => seq(field("path", $.file_path), "\n"),

    // 'exclude' directives

    exclude_directive_single: ($) =>
      seq(
        "exclude",
        $.exclude_spec,
      ),

    exclude_directive_multi: ($) =>
      seq(
        "exclude",
        "(",
        "\n",
        repeat($.exclude_spec),
        ")",
        "\n",
      ),

    exclude_spec: ($) => seq(field("path", $.module_path), field("version", $.version), "\n"),

    // 'replace' directives

    replace_directive_single: ($) =>
      seq(
        "replace",
        $.replace_spec,
      ),

    replace_directive_multi: ($) =>
      seq(
        "replace",
        "(",
        "\n",
        repeat($.replace_spec),
        ")",
        "\n",
      ),

    replace_spec: ($) =>
      choice(
        seq(
          field("from_path", $.module_path),
          field("from_version", optional($.version)),
          "=>",
          field("to_path", $.file_path), "\n"
        ),
        seq(
          field("from_path", $.module_path),
          field("from_version", optional($.version)),
          "=>",
          field("to_path", $.module_path),
          field("to_version", $.version),
          "\n",
        ),
      ),

    // 'tool' directives

    tool_directive_single: ($) =>
      seq("tool", $.tool),

    tool_directive_multi: ($) =>
      seq("tool", "(", "\n", repeat($.tool), ")", "\n"),

    file_path: ($) => $._identifier,

    // 'retract' directives

    retract_directive_single: ($) =>
      seq(
        "retract",
        $.retract_spec,
      ),

    retract_directive_multi: ($) =>
      seq(
        "retract",
        "(",
        "\n",
        repeat($.retract_spec),
        ")",
        "\n"
      ),

    retract_spec: ($) =>
      seq(
        choice(seq("[", $.version, prec(1, ","), $.version, "]"), $.version),
        "\n",
      ),

    // 'godebug' directives

    godebug_directive_single: ($) =>
      seq(
        "godebug",
        $.godebug_spec,
      ),

    godebug_directive_multi: ($) =>
      seq(
        "godebug",
        "(",
        "\n",
        repeat($.godebug_spec),
        ")",
        "\n",
      ),

    godebug_spec: ($) => seq(
      field("key", $.godebug_str),
      "=",
      field("value", $.godebug_str),
      "\n"
    ),

    godebug_str: ($) => token(/[^\s,"`'=]+/),

    comment: ($) => seq("//", /.*/),
  },
});
