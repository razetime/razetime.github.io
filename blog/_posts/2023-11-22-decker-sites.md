---
title: Making a simple Decker-based static site
layout: post
tags: computer
---

[Decker](https://beyondloom.com/decker/) is an array programming adjacent,
hypercard-like multimedia tool that can run on the web. Creating a branching
static website is hence possible in Decker, and the process is much less tackier
than I imagined.

You can see the end result of this 
[here](https://razetime.github.io/decks/).

Lilt, the command line scripting language for Decker, is beautifully
integrated with the Decker file format. You can load decks into Lil, modify
them, and then save them in both `.deck` and `.html` format. This make every
deck usable as a template file, so you can make any custom drawings and 
embellishments inside the decker UI, and perform impure, system specific things
outside the UI, in your script. 

For my decks repository, I wanted a single root deck that linked to all the
other decks I had made. First, the index file is loaded, and we get the files
that should be linked via linux's `ls`. If you are on a different platform, 
substitute as necessary.
```
i:readdeck["index.deck"]
l:"index" drop -1 drop ".deck\n" split shell["ls *.deck"].out
```

I have only one card in my index deck, and it contains one text widget. To
display links, it needs to be locked. I added scrolling capability to it, to
make sure that all my deck links will fit correctly.

```
root:"https://razetime.github.io/decks/%s.html"
i.card.widgets.list.value:table each x in l
  ("text","font","arg") dict (("%s\n\n" format readdeck["%s.deck" format x].name),"menu",(root format x))
end
```

A `root` format string is required since Decker doesn't recognize relative file
paths as URLs, which is completely fine.

A text widget takes a table of `text`, `font` and `arg`. Sadly we can't
construct this structure from a query, so we have to go through each item and
assign the URL to `arg` for every deck.

I use `readdeck["%s.deck" format x].name` even though it is likely to be slower,
since generating the structure is easier when the title is taken from the child
deck itself. 

Finally, we define a helper that writes a deck to file and tells us whether it
was successfully converted. `writedeck` returns a `0` on failure, making this
very easy.
```
on wchk x y do
  print["%s  %s" format (x,("failure", "success")[writedeck[("docs/%s.html" format x) y]])]
end
```

It is then easy with the helper function to write all the finalized decks to
a folder where you can serve files from. For Github Pages, this is usually
`docs`.
```
wchk["index" i]
each x in l wchk[x readdeck["%s.deck" format x]] end
```

There's many things one can do with this sort of functionality, this is just
simply a small glimpse of what you can do with deck modification in Lil. There's
certainly many ways to improve its speed (removing redundant `readdeck` calls),
and many ways to make it much more modular. Some basic
quality-of-life things one can do is use the
[Deck Interface](https://beyondloom.com/decker/decker.html#deckinterface) to
lock the index deck, automatically add author details, generate sitemaps and
breadcrumbs, and a lot more.

I'd like to encourage this sort of structure
for people that want to make and showcase their things with Decker, because it
is so simple, doesn't require you to modify Decker in any way, and works well
even with handmade decks. I hope you find Decker as enjoyable as I do!

*You can find the code for this article at 
[GitHub](https://github.com/razetime/decks/tree/main). The main relevant files
are `gen.lil` and `index.deck`.*