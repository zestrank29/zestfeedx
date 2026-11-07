import os

terms = ['Pankhudi Sharma (ZestRank)', 'PANKHUDI SHARMA (ZESTRANK)', 'AUTOMATED LONG-FORM JOURNALISM']
for root, dirs, files in os.walk('.'):
    # prune large directories
    dirs[:] = [d for d in dirs if d not in ('node_modules', '.next', 'out', '.git')]
    for f in files:
        if f.endswith(('.tsx', '.ts', '.html', '.js', '.json', '.md')):
            p = os.path.join(root, f)
            try:
                content = open(p, encoding='utf-8', errors='ignore').read()
                for t in terms:
                    if t.lower() in content.lower():
                        print(f"Found '{t}' in {p}")
            except Exception:
                pass

