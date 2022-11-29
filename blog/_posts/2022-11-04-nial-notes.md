---
layout: post
type: code
title: Nial Notes
---

This is a page of personal notes on Nial that's published here to help other people lessen their confusion when they are 
writing Nial code.

##### Tips
- Always have `set "decor` on. `set "diagram` is useful in certain cases, but is it better to use the `diagram` function when you need it.
- for the `-` symbol, whitespace matters. `0-9`, `0 -9` are arrays and `0 - 9` is a number.
- Transformers are operators which take a function on the right with if they are single arg.
- `see` is useful for checking previously defined operations in the repl.
- functions and dynamic vars use `is`, ordinary vars use `gets`.
- keyword type words are usually capitalized, but you can also just capitalize the first letter because it is simpler.
- `[x first]` to add a constant `x` to an atlas.
- `setformat` is super useful for printf style things, uses the same format specifiers.
- most arithmetic and boolean ops autoreduce.
- `append`, `hitch`, `pair`, and `link` are all different concatenation ops and there is usually exactly one correct thing of these you should use.
- `sublist` extends its right arg, allowing you to specify a periodic pattern.
- `pack` works like `,⍥⊂¨` but with any number of equal length(`?conform` will complain otherwise) arrays.
- `Pi` is a predefined constant. you may want higher precision, however.
- `=` does not vectorize and `match` does (counter intuitive). 
- grid is `⍳≢`
- Nial has a "quote" syntax (`!`) that lets you convert functions to values. See `cast` and `apply` in the dictionary.
  - Not exactly first class functions, since they expose an internal numeric-array representation.

##### Style Guide
- Comments
  - `%...;` comments are recommended for inline comments because they do not require an extra newline.
  - `#` comments are good for shebangs and longer documentation comments.
  - Both of them act very weird. The nial parser is strange.
- Nial ignores capitalization on all identifiers and primitive names. You can camelcase keywords like `For` and 
  `While` since they don't behave like ordinary nial constructs.

**Few equivalences between APL and Nial:**

| Function       | Monad | Dyad
| --------       | ----  | ----
| `⍳`            | `count`, `tell`(`⎕IO←0`) | `find`, `findall`
| `⍪`            | `post` | 
| `⍴`            | `reshape` | `shape`
| `+/`           | `sum`, `+` | -
| `⌈`            | `ceiling` | `max` 
| `⌽`            | `reverse` | `rotate`
| `*∘.5`         | `sqrt` | -
| `⍕`            | `string` 
| `∘.(,⍥⊂)`      | `cart` | -
| `/`            | - | `sublist` (bool only)
| `∪`            | `cull` | `cull link`
| `⊂`,`⊆`        | `single`, `solitary`   | `cutall`, `cut`

**Some notes on functions from iconoclast**

If you look at Nial operators as taking 1 argument with no
preconceptions of monadic or dyadic and x, y etc are single expressions
or strands of expressions then

```nial
  x fn y -is- f [x;y]                  by convention
  fn x y z ... -is- fn [x,y,z,...]     strand is single arg
  [fn1,fn2,...] x  -is- [fn1 x, fn2 x, ...]   atlas
```
atlases are functions so can be composed and nested with
other functions (including atlases) e.g. average is
```nial
  /[+,tally]
```
This is just function composition in a tacit form.

Nial doesn't have conventions on verb trains such as the 'hook', its
functional and doesn't need them. Just write f[g,h], a composition
of two functions for the hook.

If you want to formalise this Nial has a form of HOF called a transformer so
in a tacit style you can write
```nial
  hook is tr f g h (f[g,h])
```
then you can write
```nial
     average is hook[/,+,tally]
```
If you prefer a non-tacit style then you can write
```nial
   hook is tr f g h op x { (g x) f (h x) }
```
OP is Nial's lambda.

Nial has multiple assignment
```nial
   x y z := tell 3
```
So in a sense you can write an operator with multiple arguments as
```nial
   op x y z { .... }
```
or as
```nial
  op args { x y z := args; ... }
```
The interpreter will handle the first form more efficiently.

-------

IS is not the same as := (gets). One is a definition, the other
an assignment. For example

```nial
  x := 10

  a := 1 + x

  b is (1+x)
```

a is now 21 and will stay that way until reassigned however b
is 1+x whatever x is and if x changes then evaluating b will too.
