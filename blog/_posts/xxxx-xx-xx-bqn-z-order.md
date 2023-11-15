
---
title: Z orderings in BQN
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
Iv1←{2|(⌊÷⟜2)⍟(⌽↕𝕨)𝕩}
```

Bitwise tricks are much faster, however. I will be following
[Sean Anderson's bit hacks]
(https://graphics.stanford.edu/~seander/bithacks.html#InterleaveTableObvious)
. He shows four different ways to do them, of which you can decide which
is most expressive for you.

First, let's create a helper that creates a set of functions for us with the
required width:

```
Bits




