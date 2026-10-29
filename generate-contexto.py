#!/usr/bin/env python3
"""Generate a static, reproducible German Contexto ranking from word embeddings."""
import json, re, unicodedata
from pathlib import Path
import numpy as np
from wordfreq import top_n_list, zipf_frequency
from sentence_transformers import SentenceTransformer

ROOT=Path(__file__).resolve().parent
TARGET="Schlagloch"
N=35000
def norm(s):
    return "".join(c for c in unicodedata.normalize("NFD",s.casefold().replace("ß","ss")) if unicodedata.category(c)!="Mn" and c.isalpha())
words=top_n_list("de",60000)
words=[w for w in words if re.fullmatch(r"[A-Za-zÄÖÜäöüß]+",w) and len(w)>=3 and zipf_frequency(w,"de")>=2.0]
words=list(dict.fromkeys(words))
for w in ["Schlagloch","Straßenschaden","Fahrbahnschaden","Asphaltschaden","Straße","Reifen","Fahrbahn","Asphalt","Schlaglöcher"]:
    if w not in words:words.append(w)
print("Vocabulary",len(words),flush=True)
model=SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
target=model.encode(["Schlagloch: beschädigte Straßenoberfläche mit einem Loch oder einer Vertiefung"],normalize_embeddings=True)[0]
vectors=model.encode(words,batch_size=128,normalize_embeddings=True,show_progress_bar=True)
similarities=np.asarray(vectors)@target
# The exact answer always wins; all other ranks are purely embedding-based.
ordered=sorted(range(len(words)),key=lambda i:float(similarities[i]),reverse=True)
ordered=[i for i in ordered if norm(words[i])!=norm(TARGET)]
ranking={"schlagloch":1}
for i in ordered:
    key=norm(words[i])
    if key and key not in ranking:ranking[key]=len(ranking)+1
    if len(ranking)>=N:break
(ROOT/"contexto-ranking.json").write_text(json.dumps(ranking,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
print("Generated",len(ranking),"ranked words",flush=True)
