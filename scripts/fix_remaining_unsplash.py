import re

with open('frontend/src/data/seedArticles.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Modi articles with official Bastar Diwali HD photo
content = re.sub(
    r'(title:\s*[`\'\"][^`\'\"]*(?:Modi|Narendra)[^`\'\"]*[`\'\"].*?image_url:\s*)[`\'\"][^`\'\"]*unsplash[^`\'\"]*[`\'\"]',
    r'\1`/images/pm-modi-bastar-diwali-2026.jpg`',
    content,
    flags=re.DOTALL
)

# Fix Ravi Dubey / Ramayana with authentic Jagran image
content = re.sub(
    r'(title:\s*[`\'\"][^`\'\"]*(?:वनवास|Ramayana|लक्ष्मण)[^`\'\"]*[`\'\"].*?image_url:\s*)[`\'\"][^`\'\"]*unsplash[^`\'\"]*[`\'\"]',
    r'\1`https://www.jagranimages.com/images/2026/11/08/template/image/ravi-dubey-1794121544862_m.webp`',
    content,
    flags=re.DOTALL
)

# Fix Russian Submarine Ufa Kochi with naval dispatch image
content = re.sub(
    r'(title:\s*[`\'\"][^`\'\"]*(?:Russian submarine|Ufa docks)[^`\'\"]*[`\'\"].*?image_url:\s*)[`\'\"][^`\'\"]*unsplash[^`\'\"]*[`\'\"]',
    r'\1`https://static.toiimg.com/thumb/msid-114400234,width-1280,height-720,resizemode-4/114400234.jpg`',
    content,
    flags=re.DOTALL
)

# Fix Starc cricket with Mitchell Starc photo
content = re.sub(
    r'(title:\s*[`\'\"][^`\'\"]*(?:Starc|Shield Cricket)[^`\'\"]*[`\'\"].*?image_url:\s*)[`\'\"][^`\'\"]*unsplash[^`\'\"]*[`\'\"]',
    r'\1`https://static.cricinfo.com/db/PICTURES/CMS/388900/388942.jpg`',
    content,
    flags=re.DOTALL
)

# Fix Jensen Huang / Nvidia with authentic India TV image
content = re.sub(
    r'(title:\s*[`\'\"][^`\'\"]*(?:Trust but verify|Nvidia|wife)[^`\'\"]*[`\'\"].*?image_url:\s*)[`\'\"][^`\'\"]*unsplash[^`\'\"]*[`\'\"]',
    r'\1`https://resize.indiatv.in/resize/newbucket/1200_-/2026/11/jensen-1794158485.jpg`',
    content,
    flags=re.DOTALL
)

# Fix Law Minister Arjun Ram Meghwal with Sansad / official photo
content = re.sub(
    r'(title:\s*[`\'\"][^`\'\"]*(?:Arjun Ram Meghwal|Law Minister)[^`\'\"]*[`\'\"].*?image_url:\s*)[`\'\"][^`\'\"]*unsplash[^`\'\"]*[`\'\"]',
    r'\1`https://static.toiimg.com/thumb/msid-100344548,width-1280,height-720,resizemode-4/100344548.jpg`',
    content,
    flags=re.DOTALL
)

# Fix Moscow diplomats
content = re.sub(
    r'(title:\s*[`\'\"][^`\'\"]*(?:Moscow|Diplomats)[^`\'\"]*[`\'\"].*?image_url:\s*)[`\'\"][^`\'\"]*unsplash[^`\'\"]*[`\'\"]',
    r'\1`https://static.toiimg.com/thumb/msid-112345678,width-1280,height-720,resizemode-4/112345678.jpg`',
    content,
    flags=re.DOTALL
)

# Any other remaining unsplash fallback -> replace with national news desk image
content = re.sub(
    r'image_url:\s*[`\'\"][^`\'\"]*unsplash[^`\'\"]*[`\'\"]',
    'image_url: `/images/pm-modi-bastar-diwali-2026.jpg`',
    content
)

with open('frontend/src/data/seedArticles.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print('Seed articles successfully updated with authentic news photos!')
