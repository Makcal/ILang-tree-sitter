; Keywords
[
 "var"
 "type"
 "is"
 "array"
 "record"
 "end"
] @keyword

(primitive_type) @type

(while_loop
  [
    "while"
    "loop"
    "end"
  ] @keyword.repeat)

(if_statement
  [
    "if"
    "then"
    "else"
    "end"
  ] @keyword.conditional)

(for_loop
  [
    "for"
    "in"
    "reverse"
    "loop"
    "end"
  ] @keyword.repeat)

(routine_declaration
  [
    (routine_header
      [
        "routine"
        "end"
      ]) 
    (routine_body
      [
        "is"
      ])
  ] @keyword.function)

; Operators
[
  "not"
  "and"
  "or"
  "xor"
] @keyword.operator

[
  "+"
  "-"
  "*"
  "/"
  "%"
  "="
  "/="
  "<="
  ">="
  "<"
  ">"
] @operator

; Punctuations
[
  ":"
  "=>"
  "."
  ".."
] @punctuation.delimiter

; Brackets
[
  "("
  ")"
  "["
  "]"
] @punctuation.bracket

; Variables
(identifier) @variable

; Constants
[
  (integer_literal)
  (real_literal)
] @constant

[
  "false"
  "true"
] @boolean

; Functions
(parameters
  (parameter_declaration
    (identifier)) @variable.parameter)

(routine_header
  name: [
    (identifier) @function
  ])

(routine_call
  name: [
    (identifier) @function.call
  ])

; Others
(comment) @comment @spell
