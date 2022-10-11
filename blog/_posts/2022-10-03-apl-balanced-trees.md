---
tags: [array]
layout: post
title: Some balanced binary trees in APL
type: code
---

A few articles have been written on basic tree wrangling in APL. Here I try to aggregate them and use them for balanced binary
trees. In general I do not recommend working with trees in APL, but if push comes to shove you can use this, or mess with
Dyalog's .NET integration for a reference-based version.

Let's take the following tree as example:

```
27 (1)
+ - 14 (2)
|   + - 10 (3)
|   |   + - 3 (4)
|   + - 19 (5)
+ - 35 (6)
    + - 31 (7)
    + - 42 (8)
```
#### BST (Binary Search Tree)

**[Aaron Hsu repr](https://www.youtube.com/watch?v=hzPd3umu78g):**

Let's call this AH.

Uses a parent vector, left sibling, data vectors.

We use position here rather than node to the left because position matters in a binary search tree.
```apl
ap←1  1  2  3 2  1  6  6 ⍝ parent nodes
al←1  1  1  1 2  1  1  1 ⍝ position (left=1/right=2)
ad←27 14 10 3 19 35 31 42 ⍝ data
```


**[John Earnest's pair-based repr](https://github.com/JohnEarnest/ok/blob/gh-pages/docs/Trees.md):**

Let's call this JE. The second version explored on the page is very similar to Aaron Hsu's idea.

```apl
jt←↑(2 6) (3 5) (4 0) (0 0) (0 0) (7 8) (0 0) (0 0) ⍝ child nodes
jd← 27    14    10    3     19    35    31    42    ⍝ data
```

##### Searching and Insertion

Effectively a binary search which is arguably better done by sorting the data array and using interval index. However, it is not
too complex to do a search on both tree representations:

For the JE repr, since the number of nodes is part of the structure, it is somewhat simple to modify the data:
```apl
FindJE ← {
  (t d)←⍺
  s←⍵
  1∘{x←⍺⊃d ⋄ n←(1+⍵>x)⊃⍺⌷t ⋄ (⍵=x)∨0=n:⍺ ⋄ n∇⍵}s
}
InsertJE ← {
  (t d)←⍺
  s←⍵
  v←⍺ FindJE ⍵
  t←{(1+≢d)@(⊂v(1+s>v⊃d))⊢⍵}⍣(0≠≢d)⊢t⍪1
  t (d,⍵)
}
```

For AH, I found it much simpler to use a recursive function to find a required node.
```apl
FindAH ← {
  (p l d)←⍺ ⍝ full tree
  s←⍵ ⍝ 
  1∘{x←⍺⊃d ⋄ (⍵=x)∨~(1+⍵>x)∊(⍺=p)/l:⍺ ⋄ ((1+⍵>x)⊃1~⍨⍸⍺=p)∇⍵}s
}
InsertAH ← {
  (p l d)←⍺
  ⎕←v←⍺ FindAH ⍵
  (p,v) (l,1+⍵>v⊃d) (d,⍵)
}
```

#### AVL trees

Here we will be using Aaron Hsu's repr only, for an AVL tree, we can track depths of each vertex:
```apl
d ←  27    14    10    19    35    31    42
dp ← 1     2     3     3     2     3     3
```

##### Rotation

The steps for left rotation about a given node are: 

<!--
T1, T2 and T3 are subtrees of the tree, rooted with y (on the left side) or x (on the right side)     
      
     y                               x
    / \     Right Rotation          /  \
   x   T3   - - - - - - - >        T1   y 
  / \       < - - - - - - -            / \
 T1  T2     Left Rotation            T2  T3
-->

so, going by this, we can define a right rotation for AH about a node given by index `y` as follows:
1. x and y swap parents
2. x gets y's position (left or right)
3. T2 becomes left node of y.
4. update heights of y and x.

Here, we don't need to change anything except for the parent and height of each node.

```apl
RRotAH ← {
  (p l d h)←⍺
  y←⍵
  x←⊃⍸(l=1)∧p=y
  p[x]←p[y]          ⍝ Step 1
  p[y]←x
  l[x]←l[y] ⋄ l[y]←2 ⍝ Step 2
  t2←⊃⍸(l=2)∧p=x
  p[t2]←y ⋄ l[t2]←1  ⍝ Step 3
  h[y]←1+⌈/h[⍸p=y]   ⍝ always update y first, it is the child node.
  h[x]←1+⌈/h[⍸p=x]   ⍝ Step 4
  p l d h 
}
```

A similar technique can be used for a left rotation:
```apl
LRotAH ← {
  (p l d h)←⍺
  x←⍵
  ⎕←'y: ',y←⊃⍸(l=2)∧p=x
  t2←⊃⍸(l=1)∧p=y
  p[y]←p[x]          ⍝ Step 1
  p[x]←y
  l[y]←l[x] ⋄ l[x]←1 ⍝ Step 2
  p[t2]←x ⋄ l[t2]←2  ⍝ Step 3
  h[x]←1+⌈/h[⍸p=x]   ⍝ always update y first, it is the child node.
  h[y]←1+⌈/h[⍸p=y]   ⍝ Step 4
  p l d h 
}
```

Finally, we can insert stuff in the tree with the existing BST insertion, and these rotations. There's four cases listed at
[geeksforgeeks](https://www.geeksforgeeks.org/avl-tree-set-1-insertion/), which are somewhat simple to handle with indexing.

Code for these is available in [this gist.](https://gist.github.com/razetime/b3c1a11fe5ecb030bacd6a0780575f91)
