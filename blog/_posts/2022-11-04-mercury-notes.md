---
title: Mercury Notes
layout: post
type: code
---

There's a lot of specifics in the Mercury language distribution that pop up often and waste a lot of time. I try to document
them here. This page will be updated as I get better at Mercury.

##### Basic Scripting
- A great, descriptive crash course is at [mercury-in.space](https://mercury-in.space/crash.html) and you should read it before 
  anything.
- Always use `mmc --make` to build stuff. It clutters less and automatically builds modules.
- For pattern patching a fixed size list, use TUPLES `{}`
- Doing `Y=string(X),error(Y)` is good for inspecting a value without passing in !IO everywhere.
- Most predicates that are common use have a `det` version so you don't have to if-else and writhe in pain
- Use looser determinism for predicates you are unsure of. The compiler will suggest a better determinism and you can change it
  later.

##### Debugging
- use rlwrap with the debugger. You'll need it.
- `mmc --output-stdlib-grades` gets you the list of grades you can use to build, use one with `debug` in it.
- you will probably need `--rebuild` as well since a debug build needs different object files.
- outside the basic primitives outlined
  [here](https://mercurylang.org/information/doc-release/mercury_user_guide/Quick-overview.html#Quick-overview), you 
  *definitely* will need `browse` to inspect data properly.

##### File I/O
- `read_named_file_as_lines("file",I,!IO),`, reads lines to `I`. Similar predicates are very simple, provide `ok`/`error`

##### Lists
- `map_foldl` is a like scanl but more generalist in some ways. If you return rhe same output for both you get a scan.
- `foldl` gets confused with `string.foldl` and it gives an overloading error that is.. difficult to figure out
- All the folds have the predicate argument take args in a flipped manner (Next,Prev,Out)
  - this is for the sake of the !Var pattern

##### Strings
- `to_char_list` for getting chars
- is there a way to get a list of chars easily?

##### DCGs
- They are present as ordinary predicates.
- `phrase/2` and `phrase/3` do not exist.
- They work on arbitrary sequences of characters
- Given `prod(...) --> stuff`
  - Signature is `:- pred prod(...,Input,Output)`
    - `...` are the arguments to your production.
    - `Input` is the string that is being matched by the DCG
    - `Output` are the tokens remaining after a match. Set to `[] 
    - `Input::in, Output::out` if you are parsing with the DCG and not generating
- Avoid putting multiple conditions in a DCG, it's much better to factor them out into multiple different productions

