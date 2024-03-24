md ← •Import "BQN/md.bqn"

{𝕊⟨⟩:•Out "Usage: bqn md2html.bqn [filenames]";{(".html"∾˜¯3↓𝕩)•FChars 0 Md •FLines𝕩}¨𝕩}•args
