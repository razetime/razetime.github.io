---
title: Exploring Z-order in BQN
layout: post
type: code
---

_The code for this article can be found on
[Github](https://github.com/razetime/bqnforklift)._

In my coursework for spatial databases, we came upon the z-order curve, a
space-filling curve that attempts to put multidimesional points into a
single-dimension space with minimal change to the distance between every
point. This does come with its pitfalls but it's a very interesting
and cheap maneuver for manipulating points.

In BQN, generating the sequence of points is quite simple:

```bqn
d←⟨0‿1,1‿1,0‿0,1‿0⟩
ZStep←{⥊𝕩+⌜˜d×⊑1+¯1⊑𝕩}
SZCurve←{ZStep⍟𝕩d}
```

`d` is the sequence of points representing a single Z. If we arrange four
copies of the current iteration into a Z,
we get the next iteration. The size increases exponentially, so we have
to be wary on larger inputs. It makes for a easy to understand output,
however, good for plotting and understanding how the curve works:

```bqn
•Plot´<˘⍉>SZCurve 2
```

<svg viewBox="-10 -10 404 404">
  <g font-family="BQN,monospace" font-size="18px">
    <rect class="code" stroke-width="1" rx="5" x="-5" y="-5" width="394" height="394"></rect>
    <path class="Paren" stroke="currentColor" stroke-width="1" d="M0 0V384"></path>
    <path class="Paren" stroke="currentColor" stroke-width="1" d="M0 384H384"></path>
    <path class="red" style="fill:none" stroke-width="1" d="M0 0L54.857 0L0 54.857L54.857 54.857L109.714 0L164.571 0L109.714 54.857L164.571 54.857L0 109.714L54.857 109.714L0 164.571L54.857 164.571L109.714 109.714L164.571 109.714L109.714 164.571L164.571 164.571L219.429 0L274.286 0L219.429 54.857L274.286 54.857L329.143 0L384 0L329.143 54.857L384 54.857L219.429 109.714L274.286 109.714L219.429 164.571L274.286 164.571L329.143 109.714L384 109.714L329.143 164.571L384 164.571L0 219.429L54.857 219.429L0 274.286L54.857 274.286L109.714 219.429L164.571 219.429L109.714 274.286L164.571 274.286L0 329.143L54.857 329.143L0 384L54.857 384L109.714 329.143L164.571 329.143L109.714 384L164.571 384L219.429 219.429L274.286 219.429L219.429 274.286L274.286 274.286L329.143 219.429L384 219.429L329.143 274.286L384 274.286L219.429 329.143L274.286 329.143L219.429 384L274.286 384L329.143 329.143L384 329.143L329.143 384L384 384"></path>
  </g>
</svg>

You can fiddle with the plot [here](https://mlochbaum.github.io/BQN/try.html#code=ZOKGkOKfqDDigL8xLDHigL8xLDDigL8wLDHigL8w4p+pClpTdGVw4oaQe+KlivCdlakr4oycy5xkw5fiipExK8KvMeKKkfCdlal9ClNaQ3VydmXihpB7WlN0ZXDijZ/wnZWpZH0K4oCiUGxvdMK0PMuY4o2JPlNaQ3VydmUgMgo=).

Z-order curves however may be required on much smaller areas which so not
fit exactly within the space of a square. Bit-weaving solves this problem
by letting us compute the z-ordering for a specific point, allowing us to
get an index without needing to generate a full grid.

For example, assuming that the maximum size of the grid is 7 (3 bits), we
can calculate the z-index of (1,2) like so:

1. Get the bits: `1 -> 001`, `2 -> 010`
2. Interleave the bits, last dimension going first:
   ```
   0 1 0
    0 0 1
   ------
   001001
   ```
3. Convert that back to an integer: `9` is the z-index.

A direct bit-based operation makes the usage of z-index very easy to order
points. These are called morton numbers, are they are also very useful for
simply getting unique hashes of points.

The easiest way to interleave bits given bit width is like so:
```
_iv1←{2|(⌊÷⟜2)⍟(⌽↕𝕗)𝕩}
```

Bitwise tricks are much faster, however. I will be following
[Sean Anderson's bit hacks]
(https://graphics.stanford.edu/~seander/bithacks.html#InterleaveTableObvious)
. He shows four different ways to do them, of which you can decide which
is most expressive for you.

First, let's create a set of functions for us with the
required width. We require bitwise and, or, left shift and right shift.
Shifting operations are not provided by BQN, so we can multiply by two for a
left shift, and divide by two for a right shift.

```
Ba‿Bo←(<8‿8){𝕨𝕊r:𝕨 _r}¨⟨•bit._and,•bit._or⟩
Bl←×⟜(2⊸⋆)                                                                      
Br←÷⟜(2⊸⋆)                                                                      
```

Now, to interleave, we just go through the number bit by bit adding them to an
accumulator. The starting bit width is 3, and the ending width is 6, both fit
inside an 8-bit integer width.
```
_iv2←{x 𝕗 _𝕣 y:⟨0⟩{𝕩 Bo((x Ba 1 Bl𝕨) Bl𝕨)Bo((y Ba 1 Bl𝕨)Bl𝕨+1)}´↕𝕗}          
```

and voila! we have out first result:
```
   1 (3 _iv2)○⥊ 2
⟨ 9 ⟩
```

The rest of the methods are lookup tables or use magic numbers, so I will skip
them for brevity's sake.

Finally, we can do some computations with the transformed data. Since we know
that alterate bits contain alternate integers, we can add coordinates with the
following (for an 8-bit width):

```
x[i+j] = ((x[i] | 0b10101010) + x[j]) & 0b01010101
x[i−j] = ((x[i] & 0b01010101) − x[j]) & 0b01010101  if i ≥ j
```
(Source: Wikipedia.)

Converting this to BQN is not very hard. `0b10101010` is 170 and `0b01010101`
is 85.
```
Zp←{85 Ba 𝕩+𝕨 Bo 170}
Zm←{170 Ba 𝕩-˜𝕨 Ba 85}
```

Using these we can now calculate points relative to a given point without
getting rid of its z-order data. This type of calculation is helpful in
constructing quadtrees, for example, since z-ordering properly segments the
points into four exact segments. A binary search tree is usually constructed
for this purpose, but we can simply use `⍋` and `⍒` to perform searches upon
a list of points, converting back and forth between z-order and cartesian
co-ordinates when necessary.

I never completely understood why BQN's bitwise operations only worked on full
arrays until trying to write this. Even though the bit width is fixed, it helps
that the same conforming rules work correctly in bqn to make rank polymorphism
work.
