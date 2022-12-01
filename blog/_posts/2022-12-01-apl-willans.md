---
title: Willans' Formula in APL
layout: post
type: code
---

I saw this video from Eric Rowland a few days back, about an exact mathematical formula to derive the nth prime.

<iframe width="560" height="315" src="https://yewtu.be/embed/j5s0h42GfvM" title="yewtube player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> 13:21: It shows that you can use basic arithmetic functions in a programming language
<br />
> 13:25: and that that programming language is expressive enough to describe the nth prime number.

This quote instantly reminded me of APL, so I obviously had to try implementing it.

```apl
Willans←{1++/⌊(÷⍵)*⍨⍵÷{+/{⌊×⍨2○○⍵÷⍨1+!⍵-1}⍳⍵}¨⍳2*⍵}
```

The obvious takeaway from this video is that this is effectively a toy formula that uses several tricks to achieve a "closed
form".
I was still very curious about it since it did resemble an APLesque function:
- no conditionals
- a good amount of vectorized math
- a little bit of overcomputation, as a treat

Actually, there's too much overcomputation.
```apl
      a←⍳6
      cmpx 'Willans¨a' 'pco¨a'
  Willans¨a → 3.1E¯4 |   0% ⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕
  pco¨a     → 1.1E¯4 | -65% ⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕⎕
```

It fails above `⍵=6` due to hitting the integer limit (factorials, yay!), but it's a nice thing to learn APL's basic ideas from.
One can use bignum support like the Python and Mathematica shown in the video, but I don't recommend it.
