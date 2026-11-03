#!/usr/bin/env bash
# Instala as skills de motion graphics por código + clonagem de voz grátis (lista do Jota, 03/11/2026).
# Uso: bash instalar.sh   (copia para ~/.claude/skills)
set -e
TMP=$(mktemp -d); cd "$TMP"
REPOS="heygen-com/hyperframes Vincentwei1021/video-shotcraft Vincentwei1021/anything2explainer nateherkai/herk-edit-kit Vincentwei1021/video-talkcraft Barty-Bart/motion-graphics bangtutorial/bang-motion haidrrrry/claude-remotion-skill howseen-ai/claude-motion-design charlie947/motion-graphics-skills win4r/video-director za3ter123/claude-code-local-voice loneconspirator/claude-tts-skill treylom/qwen3-tts-claude-skill beatra-ai/ai-voice-cloning-skill"
for p in ad-video b-roll data-animation ecommerce-video explainer-video freelance-motion generative-illustration javascript-animation kinetic-typography lower-thirds manim map-animation motion-design talking-head text-message-video tiktok-video web-animation webgl-animation youtube-video; do REPOS="$REPOS iart-ai/$p-skills"; done
for r in $REPOS; do git clone -q --depth 1 "https://github.com/$r" "$(echo $r | tr / _)" || echo "falhou $r"; done
python3 - <<'PY'
import os, shutil, glob
root=os.getcwd(); dst=os.path.expanduser('~/.claude/skills'); os.makedirs(dst,exist_ok=True); n=0
ign=shutil.ignore_patterns('node_modules','.git','*.mp4','*.mov','*.gif','*.webm','*.wav','*.mp3','workbench','public')
for f in glob.glob(root+'/**/SKILL.md', recursive=True):
    if any(x in f for x in ('/node_modules/','/test','/fixtures/','/examples/')): continue
    d=os.path.dirname(f); repo=os.path.relpath(f,root).split('/')[0]
    name=os.path.basename(d) if d!=os.path.join(root,repo) else repo
    if name in ('skill','skills'): name=repo
    t=os.path.join(dst,name)
    if os.path.exists(t) and not os.path.exists(os.path.join(t,'.jota_import')): t=os.path.join(dst,repo.split('_')[0]+'-'+name)
    shutil.copytree(d,t,ignore=ign,dirs_exist_ok=True,symlinks=True); open(os.path.join(t,'.jota_import'),'w').write(repo); n+=1
q=os.path.join(root,'treylom_qwen3-tts-claude-skill','qwen3-tts.md')
if os.path.exists(q): os.makedirs(dst+'/qwen3-tts',exist_ok=True); shutil.copy(q,dst+'/qwen3-tts/SKILL.md'); n+=1
print('skills instaladas:',n)
PY
rm -rf "$TMP"
