/**
 * @file Project I for Compilers Construction course
 * @author Maxim Fomin <m.fomin@innopolis.university>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// Precedence constants - defined FIRST
const PREC = {
  unary: 6,
  multiplicative: 5,
  additive: 4,
  relational: 3,
  logical: 2
};

module.exports = grammar({
  name: 'i_lang',

  extras: $ => [
    /\s/,
    $.comment
  ],

  conflicts: $ => [
    [$.routine_call, $.modifiable_primary],
  ],

  word: $ => $.identifier,

  rules: {
    // Program structure
    source_file: $ => repeat(choice(
      $.simple_declaration,
      $.routine_declaration
    )),

    // Declarations
    simple_declaration: $ => choice(
      $.variable_declaration,
      $.type_declaration
    ),

    variable_declaration: $ => choice(
      seq(
        'var',
        field('name', $.identifier),
        ':',
        field('type', $.type),
        optional(seq('is', field('value', $.expression)))
      ),
      seq(
        'var',
        field('name', $.identifier),
        'is',
        field('value', $.expression)
      )
    ),

    type_declaration: $ => seq(
      'type',
      field('name', $.identifier),
      'is',
      field('type', $.type)
    ),

    type: $ => choice(
      $.primitive_type,
      $.user_type,
      $.identifier
    ),

    primitive_type: $ => choice(
      'integer',
      'real',
      'boolean'
    ),

    user_type: $ => choice(
      $.array_type,
      $.record_type
    ),

    array_type: $ => seq(
      'array',
      '[',
      optional(field('size', $.expression)),
      ']',
      field('element_type', $.type)
    ),

    record_type: $ => seq(
      'record',
      repeat(field('member', $.variable_declaration)),
      'end'
    ),

    // Routine declarations
    routine_declaration: $ => seq(
      $.routine_header,
      optional($.routine_body)
    ),

    routine_header: $ => seq(
      'routine',
      field('name', $.identifier),
      '(',
      optional(field('parameters', $.parameters)),
      ')',
      optional(seq(':', field('return_type', $.type)))
    ),

    routine_body: $ => choice(
      seq('is', $.body, 'end'),
      seq('=>', field('return_expression', $.expression))
    ),

    parameters: $ => commaSep1($.parameter_declaration),

    parameter_declaration: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $.type)
    ),

    body: $ => repeat1(choice(
      $.simple_declaration,
      $.statement
    )),

    // Statements
    statement: $ => choice(
      $.assignment,
      $.routine_call,
      $.while_loop,
      $.for_loop,
      $.if_statement,
      $.print_statement
    ),

    assignment: $ => prec.left(seq(
      field('left', $.modifiable_primary),
      ':=',
      field('right', $.expression)
    )),

    routine_call: $ => seq(
      field('name', $.identifier),
      optional(seq(
        '(',
        optional(commaSep1(field('argument', $.expression))),
        ')'
      ))
    ),

    while_loop: $ => seq(
      'while',
      field('condition', $.expression),
      'loop',
      field('body', $.body),
      'end'
    ),

    for_loop: $ => seq(
      'for',
      field('variable', $.identifier),
      'in',
      field('range', $.range),
      optional('reverse'),
      'loop',
      field('body', $.body),
      'end'
    ),

    range: $ => seq(
      field('start', $.expression),
      '..',
      field('end', $.expression)
    ),

    if_statement: $ => seq(
      'if',
      field('condition', $.expression),
      'then',
      field('then_body', $.body),
      optional(seq('else', field('else_body', $.body))),
      'end'
    ),

    print_statement: $ => seq(
      'print',
      commaSep1(field('argument', $.expression))
    ),

    // Expressions
    expression: $ => choice(
      $.logical_expression,
      $.relational_expression,
      $.additive_expression,
      $.multiplicative_expression,
      $.unary_expression,
      $.primary_expression
    ),

    logical_expression: $ => {
      const operators = ['and', 'or', 'xor'];
      return prec.left(PREC.logical, choice(...operators.map(op =>
        seq(
          field('left', $.expression),
          field('operator', op),
          field('right', $.expression)
        )
      )));
    },

    relational_expression: $ => {
      const operators = ['<', '<=', '>', '>=', '=', '/='];
      return prec.left(PREC.relational, choice(...operators.map(op =>
        seq(
          field('left', $.additive_expression),
          field('operator', op),
          field('right', $.additive_expression)
        )
      )));
    },

    additive_expression: $ => {
      const operators = ['+', '-'];
      return prec.left(PREC.additive, choice(...operators.map(op =>
        seq(
          field('left', $.multiplicative_expression),
          field('operator', op),
          field('right', $.multiplicative_expression)
        )
      )));
    },

    multiplicative_expression: $ => {
      const operators = ['*', '/', '%'];
      return prec.left(PREC.multiplicative, choice(...operators.map(op =>
        seq(
          field('left', $.unary_expression),
          field('operator', op),
          field('right', $.unary_expression)
        )
      )));
    },

    unary_expression: $ => prec(PREC.unary, seq(
      field('operator', choice('+', '-', 'not')),
      field('argument', $.primary_expression)
    )),

    primary_expression: $ => choice(
      $.integer_literal,
      $.real_literal,
      'true',
      'false',
      $.modifiable_primary,
      $.routine_call,
      seq('(', $.expression, ')')
    ),

    modifiable_primary: $ => seq(
      field('base', $.identifier),
      repeat(choice(
        seq('.', field('member', $.identifier)),
        seq('[', field('index', $.expression), ']')
      ))
    ),

    // Literals and identifiers
    integer_literal: $ => token(seq(
      optional(choice('+', '-')),
      /[0-9]+/
    )),

    real_literal: $ => token(seq(
      optional(choice('+', '-')),
      /[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?/
    )),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    comment: $ => token(choice(
      seq('//', /.*/),
      seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')
    ))
  }
});

// Helper functions
function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}
