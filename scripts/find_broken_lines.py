import re
import urllib.request

with open("frontend/src/data/seedArticles.ts", "r", encoding="utf-8") as f:
    text = f.read()

broken_ids = [
    'photo-1509391365360-2e959784a276',
    'photo-1558441719-74313f8c8541',
    'photo-1556742049-0a67e5572244',
    'photo-1531415074868-036b1c57e359',
    'photo-1517976487507-5b3a4a0c559c'
]

lines = text.split("\n")
for i, line in enumerate(lines):
    for b in broken_ids:
        if b in line:
            print(f"Line {i+1}: {line.strip()[:100]}")

