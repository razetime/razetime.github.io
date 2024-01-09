# Maude

A rewriting system.

Consider an expression as a starting state. A Maude program tells maude that
certain replacements of parts of that state will reach the goal you want.

The language rewrites portions over and over, depending on the strategy you
tell it to take while rewriting or reducing the given expression, to reach a
final state. hopefully that state is correct, based on your specification.

The first portion of maude programming is the specification. Then you use the
specifications with rewrite/reduction commands to create a full program.


## Debugging
- `rew [n] expr` where `[n]` is a number will do `n` substitutions.
- `set trace on` traces for each rewrite.
  - `trace select <op>` traces a uses of a specific equation, incredibly useful
- `show (module|sorts|components)` shows you what maude saw in your code.

## Libraries and powerful functionality
- `LIST*` covers arbitrarily nested lists of a single type.
- `search` command can search subspaces for you given rules

## Errors
- unexpected `)` or `,`:
  - too few args
  - arg of a wrong type.
  - type declaration is wrong
- 
- 
