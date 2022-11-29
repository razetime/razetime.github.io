---
title: "TruffleRuby GSoC 2022: A retrospective"
layout: post
type: code
---

I had the pleasure of participating in the 2022 Google Summer of Code program, and I have a lot of things to say. If you plan on
applying for a TruffleRuby project, I hope this helps you.

##### Proposals
You can submit upto three project proposals for GSoC, so I decided to put all my chips into language projects. There are a lot
of basic tutorials on how to write a proposal, so here I'll just explain why these got accepted/rejected.
- [Julia proposal](https://docs.google.com/document/d/1KfKR3_7iQP39LwEYq7lijxT5y1dEzpYOY2UFrPnyWWQ/edit?usp=sharing)
*rejected*
  - I did not proofread this correctly. Always have a second person proofread your stuff.
  - My Julia was lacking at the time, but I did make a few contributions to Javis.jl. To have a chance at most Julia projects,
  you need prior experience.
  - I didn't fully understand what I had to do for the project. I hadn't worked with Javis internals while making my
  contributions.
- [Haskell proposal](https://docs.google.com/document/d/1_SQAYmN5axWZwstj7ThE48ulPEgCvLAgt0MHbX6HOPk/edit?usp=sharing)
*rejected*
  - My Haskell knowledge is average, but I do not have any work pointing in that direction.
  - This proposal shows an understanding of what the project is but not what needs to be done. I was not used to working on
  bigger projects in Haskell.
- [Ruby proposal](https://docs.google.com/document/d/18TbvIIMCtPjz46HWYUmxh2hyKDq6QA8HHwunUFfZ3cU/edit?usp=sharing)
*accepted*
  - This one has a lot of relevant, well understood references. The working process is documented much better as well.
  - The main difference here is that I sat down with my mentor [Benoit Daloze](https://github.com/eregon/) and figured out the exact details to put here. He provided a lot of the data on this end.

Get to know your org mentors early, and decide on a project as early as possible. It'll make your proposal (and project) much
better. Mentors are very, very cool people, and showing genuine interest in their work goes a long way.

##### The Project
The base project was adding pattern matching features to TruffleRuby, as per Ruby 3.0. You can see the relevant info in the proposal.

The community bonding period is very useful. I did not get much time to
spend during this, so I was lagging a bit. My environment was setup, but
more time could be spent mangling the code you are supposed to be working
with later.

I learned about the workings of the IntelliJ debugger very
late in the project and I wish I'd done that and several other experiments
beforehand. People in the GraalVM Slack are very friendly and approachable (if you see Chris Seaton or Kevin Menard, tell them 
I sent you). Ask questions as soon as you get them, because the stupidity of the question is not a problem at all. 

Getting used to your working environment is really great. In TruffleRuby
it's almost necessary, cause IntelliJ even despite its weirdness makes a lot of the dull
parts of Java more bearable.

I also switched from using `rvm` to `ruby-install`, `ruby-build` and `chruby`, and
[reputable sources](https://eregon.me/blog/2021/06/04/review-of-ruby-installers-and-switchers.html) recommend that you do so as well.

###### The Parser
The first step of the project was modifying the parser, which is a port of the JRuby
parser, which is a port of the MRI parser, all warts included.
The main problems here are:
- It is written in an obscure Java dialect of yacc called `jay`.
- It is an LR parser. I do not know anyone that likes debugging LR parsers.
- The TruffleRuby parser is 3000+ lines long.

Luckily, we had an easy reference for the parser: JRuby already had Ruby 3.0 pattern
matching, and I ported each production by hand.

- [RubyParser.y](https://github.com/oracle/truffleruby/blob/master/src/main/java/org/truffleruby/parser/parser/RubyParser.y)
is the main file. You have to compile it before every build with `jt build parser`
- [tool/parse_ast](https://github.com/oracle/truffleruby/blob/master/doc/contributor/parser.md)
is an excellent tool for checking your work, which Benoit made early in the project.
- Check for shift reduce conflicts before you move off the parser. Ignoring this gave me a heart attack after the first review.
- [ParserSupport.java](https://github.com/oracle/truffleruby/blob/master/src/main/java/org/truffleruby/parser/parser/ParserSupport.java)
contains the java code that does the dirty work for our yacc parser.
- Debugging tips:
  - Run `jt test fast`, but more importantly use `jt test <file>` on the relevant spec
  file. `grep` for `SyntaxError`s to simplify.
  - TruffleRuby inherits a bad thing from JRuby where it uses Java's `null` for both
  `nil` and empty blocks.
  You will probably run into this mistake somewhere and you will hate it as much as I 
  and @eregon do.
  - There are some useful debug tools in
  [generate_parser](https://github.com/oracle/truffleruby/blob/master/tool/generate_parser):
    - Line 13, where there's a debug flag
    - Line 45, where `$JAY -v $DEBUG_FLAG $PARSER_BASE.y < skeleton.parser | grep -v $DEBUG_STRIP >$PARSER_BASE.out` should give more verbose output.

The only way out in the parser is trial and error, so practice your patience. You'll
also want to check the lint errors for RubyParser.java for typos. Some things from JRuby
ended up being unnecessary in TruffleRuby.

Even with all these things, some problems with my parser port did not go away. These
may be resolved in the new upcoming Ruby parser, or I will have to spend hours finding 
out why it hates me.

###### The Translator
Once Ruby code goes through the parser, it gets turned into `ParseNode`s. Once parsing is done, we go into the actual GraalVM bits of the project. 

Truffle is the language implementation framework that makes TruffleRuby possible. To fit
into Truffle, we need to now convert these parse nodes into `RubyNodes`. These RubyNodes
are then used by the GraalVM runtime to do any optimizations, and finally, run your 
program.

This part of the project is where I realized I had to keep up with the main repo.
TruffleRuby is a very active project, so I recommend rebasing every time there's a big
change, or you're more than 50 commits behind. I completely missed the migration to `TruffleString` during this project, and
I had to spend a lot fo time figuring it out.

With Benoit's help, I created two new translator classes, one as a base translator,
and one specifically for pattern matching. Meeetings became more frequent as the project progressed, since the Translators have
several functions to trip you up. `Find All Usages` in IntelliJ is a lifesaver here because you *need* examples to work with
Translator code.

The idea behind pattern matching translation is reading it as syntactic sugar for a complex nest of if statements.
The Translator Code effectively comes down to extracting the relevant info from a ParseNode, and then putting that in the
RubyNodes that represent the correct structure.

The first pattern type is the array pattern:
```ruby
case [1,2,3,4]
in [a,*b,c]
p [a,b,c]
end
```
In ruby code without pattern matching, this would look something like:
```ruby
matchdata=[1,2,3,4].deconstruct
if matchdata.length>=2
  a=matchdata[0]
  b=matchdata[1..-2]
  c=matchdata[-1]
else
  throw NoMatchingPatternError
end
```

In the translator, we have to consider each element recursively, and carefully step around the translator. This involves
juggling and arranging nodes around, and this was the most fun part of the project. You get immediate feedback because you can
check for which specs pass and fail once you're done with your work. Just remember to `jt untag` yours specs when you finish
something big.

TruffleRuby is very dense when it comes to the backend, and I had to create some new nodes in order to implement the errors and
optimize away some of the repetitive things in the patterns. A small lowdown on creating a new RubyNode:
- Your node has to be a subclass of RubyNode somewhere along the line. I had to use `RubyContextSourceNode`.
- You have to mark executable nodes inside your new node as `@Child` nodes, because those also have special calculations for 
optimization.
- Execution code cannot contain some specific functions which create new nodes, and it will fail on the test builds if you do it
wrong. You need a mentor to advise on this.

###### Final Thoughts
- Make smaller, descriptive commits. It is easier to fix mistakes this way.
- Go easy on yourself. I took the weekends off for GSoC and it was still very doable.
- If you're stuck, change your focus to something easier. TruffleRuby gives you a lot of leeway for this, especially outside
the parser.
