---
title: dyalogscript and Windows shell scripting
layout: post
tags: computer
---

`dyalogscript` was introduced in [Dyalog 18.2](https://www.dyalog.com/dyalog/dyalog-versions/182.htm) in March 2022 as a way to let people save their code in text files. Let's see how well it does for basic, general tasks on Windows.

The first problem is, `dyalogscript` is a quality of life thing that was definitely made with bash users in mind. The [demonstration video](https://youtu.be/YSmvDUmOyeg?si=BJ6js3JxoYZibNP8) even uses Cygwin on Windows as some sort of cruel joke.

The first problem is that it is unobvious to run on windows. Dyalog's installer doesn't modify PATH, but dyalogscript is there at `C:\Users\<username>\AppData\Local\Programs\Dyalog\Dyalog APL-64 18.2 Unicode\scriptbin`. `dyascript` in the root directory just seems to be.. a repl? and I'm unsure what to do with them.

I was intending to use `dyalogscript.exe`, but as it turns out, that needs `bash`. `dyalogscript.ps1` hence is your best bet for running home-grown Windows scripts.

Getting STDIN in APL is simple:
- Use `⎕` to get your input, evaluated as APL.
- Use `⍞` to get your input as a string.

These come with obvious problems: `⎕` has a default prompt you can't remove, that is printed to standard output. `⍞` confoundingly enough prints to standard error (they seem to have removed the prompt on Linux, what?)

What is worse is that the `.ps1` file seems to return the filename on stdout:

```powershell
> &"C:\Users\raghu\AppData\Local\Programs\Dyalog\Dyalog APL-64 18.2 Unicode\scriptbin\dyalogscript.ps1" thing.apl
⎕:
123

123
"thing.apl"

"thing.apl"
```
 
It seems this may have been made as an afterthought.