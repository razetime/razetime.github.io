# Raku notes

`{@_}` in an infinite list gives the entire list so far

construction `{f $_}...*` will take `$_` from the outer scope for the first iteration

for a shorter chars value you can always use `…` in place of `...` (same byte count however)

`|`is flatten

`xx` repeats a thing n times and puts em in an array

If you pass a function to `.tail` `.head` or `postfix[]`, it will call it with the array size as argument and use the return value for indexing:

**subtract overlapping pairs:**

`@a Z- @a.tail: *-1`

`@a[^(* - 1)] Z- @a[1 .. *]`
where @a is your array seems to work. First 
one is all elements but last one and the second one is all elements but 
first one i.e, two shifted versions of the array. Then Z- zips them together and applies subtraction.

`Z` the zip metaoperator uses a dyadic function and applies between the elements of two lists.

it uses `,` by default, creating a `()` type list.

# Ruby tings

shortest method to print numbers 1..n which match predicate

```
1.upto(n){pred(_1)&&p(_1)}
eval'p$.if pred($.+=1);'*n
```

`~/$/` gives length of last line read

`.split` rakes a block but doesn't map

`.sum` owkrs on strings

# V golfing:

## Repeat macro n times

So the V method is to use `<n><M-q><macro><M-q>` to repeat a macro N times

```
<M-q> == ñ
```

A few other things: `a<char><esc> == <M-a><char>`

`Yp == <M-D>`

`úú` is a shortcut for sorting a line lexically

`<M-7>` in insert mode repeats the next character 7 times. works the same for any other number.

# Vim golfing:

So `@<reg>` executes reg like it had been typed. In insert mode, `<C-r><reg>` inserts reg

So `i<C-r>=5*5<cr>` will insert "25"

So you can do `0C<C-r>=<C-r>"<cr>` to insert the evaluation of the current line

`0C                 " Delete this line AND enter insert mode
 <C-r>=             " Insert the evaluation register...
                    "   (Evaluate this string:)
       <C-r>"       "   Insert the unnamed register into the command line
             <cr>   "   Finish evaluating`

but in vim you need something like `"aDqq<macro>q@a@q` to use input in normal mode

`gJ` is a shortcut for joining lines without a space.
