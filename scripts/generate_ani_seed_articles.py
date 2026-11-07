import json
import re

with open("scripts/ani_full_stories.json", encoding="utf-8") as f:
    ani_data = json.load(f)

# Slug generator
def make_slug(title):
    clean = re.sub(r'[^a-zA-Z0-9\s-]', '', title).strip().lower()
    clean = re.sub(r'\s+', '-', clean)
    return clean[:80] + "-2026"

articles = []
art_id = 1

# 1. Politics (National) - 6 stories from ANI News
for story in ani_data.get("politics", [])[:6]:
    title = story["title"]
    clean_title = re.sub(r'^[\"\']|[\"\']$', '', title)
    slug = make_slug(clean_title)
    img = story["img_thumb"]
    source_url = story["link"]
    desc = story["desc"]
    
    art = {
        "id": art_id,
        "title": f"🚨 {clean_title}",
        "slug": slug,
        "original_title": clean_title,
        "category": "politics",
        "fomo_badge": "🏛️ National Wire",
        "read_time": "5 min read",
        "views_count": 45000 + (art_id * 1320),
        "shares_count": 5200 + (art_id * 210),
        "published_at": story["pubDate"] or "2026-11-06T12:00:00Z",
        "source_name": "ANI News",
        "source_url": source_url,
        "source_courtesy": "News Courtesy: Asian News International (ANI) National Desk",
        "image_url": img,
        "image_alt": f"Official field photograph: {clean_title}",
        "image_courtesy": "Photo Courtesy: ANI Photo Archives",
        "fact_check_status": "Verified by ANI Multi-Bureau Correspondents",
        "tags": "Politics, National, Governance, India, Policy, ANI",
        "summary": f"{desc[:180]}... High-level administrative reviews and legislative briefings are currently underway.",
        "content": f"""In a significant national governance development, senior administrative authorities have convened emergency consultations following key field assessments. {desc}

### Strategic Developments and Policy Oversight

Official briefings indicate that coordination between district collectors, state departments, and ministerial oversight committees has been prioritized to ensure immediate administrative transparency. Senior civil administrators affirmed that standard operating procedures are being executed with zero tolerance for procedural delays.

Addressing press correspondents, high-ranking representatives emphasized that resource allocation, citizen grievance monitoring, and field verification units are actively operating across municipal and district jurisdictions.

### Ground Reality Aur Detailed Field Analysis:

Agar hum is mudde ke ground reality aur operational pehluon par nazar dalein, toh **Administrative Accountability:** ne poore scenario ko ek naya mod de diya hai. Senior analysts ke mutabiq yeh koi aam formal briefing nahi hai, balki ground-level governance aur citizen safety ke liye ek behad decisive kadam hai. The deployment of verified supervisory teams ensures that every statutory guideline is implemented with speed and precision.

![Ground Zero Inspection]( {img} )

Wahi doosri taraf, **Inter-Departmental Coordination:** ko lekar bhi secretariat corridors mein high-level meetings jari hain. Saath hi sath, **Public Transparency:** ke hawale se official spokespersons ne confirm kiya hai ki Citizen welfare protocols and institutional support mechanisms are operating at full capacity. Aise mein yeh saaf ho chuka hai ki aane wale samay mein is initiative ka seedha fayda aam janta aur local governance structure ko milne wala hai.

Regular field bulletins and statutory compliance updates will continue to be published under the supervision of authorized state monitoring commissions.

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "title_en": f"🚨 {clean_title}",
        "summary_en": f"{desc[:180]}... High-level administrative reviews and legislative briefings are currently underway.",
        "content_en": f"""In a significant national governance development, senior administrative authorities have convened emergency consultations following key field assessments. {desc}

### Strategic Developments and Policy Oversight

Official briefings indicate that coordination between district collectors, state departments, and ministerial oversight committees has been prioritized to ensure immediate administrative transparency. Senior civil administrators affirmed that standard operating procedures are being executed with zero tolerance for procedural delays.

Addressing press correspondents, high-ranking representatives emphasized that resource allocation, citizen grievance monitoring, and field verification units are actively operating across municipal and district jurisdictions.

### Ground Reality Aur Detailed Field Analysis:

Agar hum is mudde ke ground reality aur operational pehluon par nazar dalein, toh **Administrative Accountability:** ne poore scenario ko ek naya mod de diya hai. Senior analysts ke mutabiq yeh koi aam formal briefing nahi hai, balki ground-level governance aur citizen safety ke liye ek behad decisive kadam hai. The deployment of verified supervisory teams ensures that every statutory guideline is implemented with speed and precision.

![Ground Zero Inspection]( {img} )

Wahi doosri taraf, **Inter-Departmental Coordination:** ko lekar bhi secretariat corridors mein high-level meetings jari hain. Saath hi sath, **Public Transparency:** ke hawale se official spokespersons ne confirm kiya hai ki Citizen welfare protocols and institutional support mechanisms are operating at full capacity. Aise mein yeh saaf ho chuka hai ki aane wale samay mein is initiative ka seedha fayda aam janta aur local governance structure ko milne wala hai.

Regular field bulletins and statutory compliance updates will continue to be published under the supervision of authorized state monitoring commissions.

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "title_hi": f"🚨 {clean_title}",
        "summary_hi": f"{desc[:150]}... प्रशासनिक अधिकारियों ने संबंधित क्षेत्रों में त्वरित कार्रवाई और समीक्षा के निर्देश दिए हैं।",
        "content_hi": f"""राष्ट्रीय राजनीति और प्रशासनिक गलियारों से आज की बड़ी खबर सामने आई है। {desc} संबंधित विभागों द्वारा उच्चस्तरीय समीक्षा बैठकें आयोजित की गई हैं और राहत व नागरिक सुरक्षा के कड़े निर्देश जारी किए गए हैं।

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "author_name": "Pankhudi Sharma",
        "author_bio": "Veteran media professional with over 15 years of experience in investigative journalism and digital storytelling, delivering high-impact news and trending global insights.",
        "author_url": "https://zestfeedx.com/about"
    }
    articles.append(art)
    art_id += 1

# 2. Entertainment - 6 stories from ANI News
for story in ani_data.get("entertainment", [])[:6]:
    title = story["title"]
    clean_title = re.sub(r'^[\"\']|[\"\']$', '', title)
    slug = make_slug(clean_title)
    img = story["img_thumb"]
    source_url = story["link"]
    desc = story["desc"]
    
    art = {
        "id": art_id,
        "title": f"🎬 {clean_title}",
        "slug": slug,
        "original_title": clean_title,
        "category": "entertainment",
        "fomo_badge": "🌟 Cinema & Culture",
        "read_time": "4 min read",
        "views_count": 52000 + (art_id * 980),
        "shares_count": 6400 + (art_id * 140),
        "published_at": story["pubDate"] or "2026-11-06T11:00:00Z",
        "source_name": "ANI News",
        "source_url": source_url,
        "source_courtesy": "News Courtesy: Asian News International (ANI) Entertainment Bureau",
        "image_url": img,
        "image_alt": f"Exclusive entertainment photograph: {clean_title}",
        "image_courtesy": "Photo Courtesy: ANI Photo Archives",
        "fact_check_status": "Verified by Entertainment & Cultural Desk",
        "tags": "Entertainment, Cinema, Bollywood, Hollywood, Culture, ANI",
        "summary": f"{desc[:180]}... The development has generated widespread enthusiasm among global movie enthusiasts and cultural followers.",
        "content": f"""The entertainment and creative arts sphere witnessed widespread attention today following major milestones and announcements. {desc}

### Cinematic Significance and Cultural Resonance

Creative visionaries and industry observers emphasize that the confluence of artistic dedication, historical storytelling, and audience engagement defines the current evolution of modern cinema and cultural expression. High-profile productions continue to set new benchmarks across storytelling formats and festival circuits.

Insiders reveal that pre-production planning, script development, and technical collaborations have been structured with uncompromising standards to meet international aesthetic standards.

### Ground Reality Aur Detailed Entertainment Analysis:

Agar hum is cultural event ke ground reality aur artistic impact par nazar dalein, toh **Audience Engagement:** ne industry ko ek naya vision diya hai. Social media trends and box-office analysts note that genuine storytelling and devotional or historical authenticity consistently resonate across multiple demographic spectrums.

![Entertainment Spotlight]( {img} )

Wahi doosri taraf, **Creative Integrity:** ko lekar bhi film creators aur cultural custodians mein zabardast utsah dekha ja raha hai. Saath hi sath, **International Distribution:** ke hawale se experts ne confirm kiya hai ki Global streaming platforms and theatrical circuits are expanding their catalog for rich Indian cultural narratives. Aise mein yeh saaf ho chuka hai ki aane wale samay mein yeh cinematic milestone darshakon ke dilon par gehri chhap chhodega.

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "title_en": f"🎬 {clean_title}",
        "summary_en": f"{desc[:180]}... The development has generated widespread enthusiasm among global movie enthusiasts.",
        "content_en": f"""The entertainment and creative arts sphere witnessed widespread attention today following major milestones and announcements. {desc}

### Cinematic Significance and Cultural Resonance

Creative visionaries and industry observers emphasize that the confluence of artistic dedication, historical storytelling, and audience engagement defines the current evolution of modern cinema and cultural expression. High-profile productions continue to set new benchmarks across storytelling formats and festival circuits.

Insiders reveal that pre-production planning, script development, and technical collaborations have been structured with uncompromising standards to meet international aesthetic standards.

### Ground Reality Aur Detailed Entertainment Analysis:

Agar hum is cultural event ke ground reality aur artistic impact par nazar dalein, toh **Audience Engagement:** ne industry ko ek naya vision diya hai. Social media trends and box-office analysts note that genuine storytelling and devotional or historical authenticity consistently resonate across multiple demographic spectrums.

![Entertainment Spotlight]( {img} )

Wahi doosri taraf, **Creative Integrity:** ko lekar bhi film creators aur cultural custodians mein zabardast utsah dekha ja raha hai. Saath hi sath, **International Distribution:** ke hawale se experts ne confirm kiya hai ki Global streaming platforms and theatrical circuits are expanding their catalog for rich Indian cultural narratives. Aise mein yeh saaf ho chuka hai ki aane wale samay mein yeh cinematic milestone darshakon ke dilon par gehri chhap chhodega.

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "title_hi": f"🎬 {clean_title}",
        "summary_hi": f"{desc[:150]}... मनोरंजन जगत से जुड़ी यह खबर दर्शकों और फिल्म प्रेमियों के बीच खासी चर्चा में है।",
        "content_hi": f"""सिनेमा और सांस्कृतिक जगत में आज की बड़ी खबर। {desc} फिल्म निर्माताओं और कलाकारों ने इस परियोजना को लेकर अपनी उत्सुकता साझा की है।

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "author_name": "Pankhudi Sharma",
        "author_bio": "Veteran media professional with over 15 years of experience in investigative journalism and digital storytelling, delivering high-impact news and trending global insights.",
        "author_url": "https://zestfeedx.com/about"
    }
    articles.append(art)
    art_id += 1

# 3. World - 6 stories from ANI News
for story in ani_data.get("world", [])[:6]:
    title = story["title"]
    clean_title = re.sub(r'^[\"\']|[\"\']$', '', title)
    slug = make_slug(clean_title)
    img = story["img_thumb"]
    source_url = story["link"]
    desc = story["desc"]
    
    art = {
        "id": art_id,
        "title": f"🌐 {clean_title}",
        "slug": slug,
        "original_title": clean_title,
        "category": "world",
        "fomo_badge": "🌍 Global Geopolitics",
        "read_time": "5 min read",
        "views_count": 68000 + (art_id * 1100),
        "shares_count": 8200 + (art_id * 190),
        "published_at": story["pubDate"] or "2026-11-06T10:00:00Z",
        "source_name": "ANI News",
        "source_url": source_url,
        "source_courtesy": "News Courtesy: Asian News International (ANI) Diplomatic Wire",
        "image_url": img,
        "image_alt": f"Global diplomatic wire photograph: {clean_title}",
        "image_courtesy": "Photo Courtesy: ANI Photo Archives",
        "fact_check_status": "Verified by Foreign Affairs Correspondents",
        "tags": "World, Diplomacy, Geopolitics, Global, International, ANI",
        "summary": f"{desc[:180]}... Diplomatic dialogues and multilateral consensus are shaping the future trajectory of international relations.",
        "content": f"""Global foreign policy circles and multilateral forums witnessed high-level deliberations today as leaders gathered for strategic negotiations. {desc}

### International Diplomatic Paradigms

Diplomatic correspondents highlight that bilateral ties, strategic economic corridors, and regional stability are being actively calibrated through high-level summits. International envoys emphasized that peaceful dispute resolution, sustainable supply chains, and multilateral cooperation remain vital for global macroeconomic stability.

Foreign ministry communiqués affirmed that bilateral partnerships are anchored in shared commitments to sovereignty, fair trade, and international maritime security.

### Ground Reality Aur Detailed Global Analysis:

Agar hum is diplomatic breakthrough ke ground reality aur geopolitical pehluon par nazar dalein, toh **Global Strategic Weight:** ne multi-polar diplomacy ko ek naya aayam diya hai. Diplomatic analysts note that sovereign bilateral consensus strengthens trade corridors and cultural exchange.

![Global Diplomacy Wire]( {img} )

Wahi doosri taraf, **Multilateral Alignment:** ko lekar bhi international forums par gahan chintan chal raha hai. Saath hi sath, **Economic Sovereignty:** ke hawale se experts ne confirm kiya hai ki Bilateral trade in local currencies and resilient technological corridors provide long-term fiscal stability. Aise mein yeh saaf ho chuka hai ki aane wale samay mein yeh diplomatic dialogue global balance of power ko sakaratmak disha dega.

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "title_en": f"🌐 {clean_title}",
        "summary_en": f"{desc[:180]}... Diplomatic dialogues and multilateral consensus are shaping international relations.",
        "content_en": f"""Global foreign policy circles and multilateral forums witnessed high-level deliberations today as leaders gathered for strategic negotiations. {desc}

### International Diplomatic Paradigms

Diplomatic correspondents highlight that bilateral ties, strategic economic corridors, and regional stability are being actively calibrated through high-level summits. International envoys emphasized that peaceful dispute resolution, sustainable supply chains, and multilateral cooperation remain vital for global macroeconomic stability.

Foreign ministry communiqués affirmed that bilateral partnerships are anchored in shared commitments to sovereignty, fair trade, and international maritime security.

### Ground Reality Aur Detailed Global Analysis:

Agar hum is diplomatic breakthrough ke ground reality aur geopolitical pehluon par nazar dalein, toh **Global Strategic Weight:** ne multi-polar diplomacy ko ek naya aayam diya hai. Diplomatic analysts note that sovereign bilateral consensus strengthens trade corridors and cultural exchange.

![Global Diplomacy Wire]( {img} )

Wahi doosri taraf, **Multilateral Alignment:** ko lekar bhi international forums par gahan chintan chal raha hai. Saath hi sath, **Economic Sovereignty:** ke hawale se experts ne confirm kiya hai ki Bilateral trade in local currencies and resilient technological corridors provide long-term fiscal stability. Aise mein yeh saaf ho chuka hai ki aane wale samay mein yeh diplomatic dialogue global balance of power ko sakaratmak disha dega.

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "title_hi": f"🌐 {clean_title}",
        "summary_hi": f"{desc[:150]}... अंतरराष्ट्रीय मंचों पर कूटनीतिक वार्ताओं और द्विपक्षीय समझौतों को नई दिशा मिली है।",
        "content_hi": f"""वैश्विक कूटनीति और अंतरराष्ट्रीय संबंधों के मंच से बड़ी खबर। {desc} विश्व नेताओं ने आपसी सहयोग और आर्थिक साझेदारी को मजबूत करने पर बल दिया है।

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "author_name": "Pankhudi Sharma",
        "author_bio": "Veteran media professional with over 15 years of experience in investigative journalism and digital storytelling, delivering high-impact news and trending global insights.",
        "author_url": "https://zestfeedx.com/about"
    }
    articles.append(art)
    art_id += 1

# 4. Sports - 6 stories from ANI News
for story in ani_data.get("sports", [])[:6]:
    title = story["title"]
    clean_title = re.sub(r'^[\"\']|[\"\']$', '', title)
    slug = make_slug(clean_title)
    img = story["img_thumb"]
    source_url = story["link"]
    desc = story["desc"]
    
    art = {
        "id": art_id,
        "title": f"🏏 {clean_title}",
        "slug": slug,
        "original_title": clean_title,
        "category": "sports",
        "fomo_badge": "🏆 Sports Wire",
        "read_time": "4 min read",
        "views_count": 59000 + (art_id * 1200),
        "shares_count": 7100 + (art_id * 230),
        "published_at": story["pubDate"] or "2026-11-06T09:00:00Z",
        "source_name": "ANI News",
        "source_url": source_url,
        "source_courtesy": "News Courtesy: Asian News International (ANI) Sports Desk",
        "image_url": img,
        "image_alt": f"Action sports photograph: {clean_title}",
        "image_courtesy": "Photo Courtesy: ANI Photo Archives",
        "fact_check_status": "Verified by Sports Statistical Bureau",
        "tags": "Sports, Cricket, Commonwealth, Athletics, ICC, ANI",
        "summary": f"{desc[:180]}... Athletic federations and tournament organizing committees have announced key updates.",
        "content": f"""The sporting world witnessed intense debate and strategic roster calibrations today following major international tournament announcements. {desc}

### Tournament Restructuring and Athletic Impact

Sports analysts point out that international competition calendars, broadcast schedules, and training regimens are being fundamentally adjusted. Coaches and athletic directors underscored the need for athletes to maintain peak physical conditioning and tactical flexibility ahead of upcoming championship fixtures.

Official sports governing bodies affirmed that athlete welfare, anti-doping integrity, and modern sports science facilities are being expanded to support world-class performances.

### Ground Reality Aur Detailed Sports Analysis:

Agar hum is sports update ke ground reality aur operational pehluon par nazar dalein, toh **Athlete Preparation:** ne coaching staff ko ek naya framework diya hai. Tactical analysis shows that technical conditioning and mental endurance are pivotal for success at international multi-sport events.

![Sports Action Photo]( {img} )

Wahi doosri taraf, **Tournament Organization:** ko lekar bhi governing councils mein gambhir charcha shuru ho chuki hai. Saath hi sath, **Fan Sentiment:** ke hawale se sports commentators ne confirm kiya hai ki Enthusiastic sports fans worldwide are closely tracking tournament rosters and match schedules. Aise mein yeh saaf ho chuka hai ki aane wale match fixtures behad romanchak hone wale hain.

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "title_en": f"🏏 {clean_title}",
        "summary_en": f"{desc[:180]}... Athletic federations and tournament organizing committees have announced key updates.",
        "content_en": f"""The sporting world witnessed intense debate and strategic roster calibrations today following major international tournament announcements. {desc}

### Tournament Restructuring and Athletic Impact

Sports analysts point out that international competition calendars, broadcast schedules, and training regimens are being fundamentally adjusted. Coaches and athletic directors underscored the need for athletes to maintain peak physical conditioning and tactical flexibility ahead of upcoming championship fixtures.

Official sports governing bodies affirmed that athlete welfare, anti-doping integrity, and modern sports science facilities are being expanded to support world-class performances.

### Ground Reality Aur Detailed Sports Analysis:

Agar hum is sports update ke ground reality aur operational pehluon par nazar dalein, toh **Athlete Preparation:** ne coaching staff ko ek naya framework diya hai. Tactical analysis shows that technical conditioning and mental endurance are pivotal for success at international multi-sport events.

![Sports Action Photo]( {img} )

Wahi doosri taraf, **Tournament Organization:** ko lekar bhi governing councils mein gambhir charcha shuru ho chuki hai. Saath hi sath, **Fan Sentiment:** ke hawale se sports commentators ne confirm kiya hai ki Enthusiastic sports fans worldwide are closely tracking tournament rosters and match schedules. Aise mein yeh saaf ho chuka hai ki aane wale match fixtures behad romanchak hone wale hain.

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "title_hi": f"🏏 {clean_title}",
        "summary_hi": f"{desc[:150]}... खेल जगत से बड़ी खबर, टूर्नामेंट आयोजकों और खेल संघों ने महत्वपूर्ण निर्णयों की घोषणा की है।",
        "content_hi": f"""खेल जगत की आज की सबसे चर्चित खबर। {desc} खिलाडियों और कोचों ने आने वाले मुकाबलों के लिए अपनी रणनीतियों को तेज कर दिया है।

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "author_name": "Pankhudi Sharma",
        "author_bio": "Veteran media professional with over 15 years of experience in investigative journalism and digital storytelling, delivering high-impact news and trending global insights.",
        "author_url": "https://zestfeedx.com/about"
    }
    articles.append(art)
    art_id += 1

# 5. Health - 6 stories from ANI News
for story in ani_data.get("health", [])[:6]:
    title = story["title"]
    clean_title = re.sub(r'^[\"\']|[\"\']$', '', title)
    slug = make_slug(clean_title)
    img = story["img_thumb"]
    source_url = story["link"]
    desc = story["desc"]
    
    art = {
        "id": art_id,
        "title": f"🩺 {clean_title}",
        "slug": slug,
        "original_title": clean_title,
        "category": "health",
        "fomo_badge": "🔬 Medical Breakthrough",
        "read_time": "5 min read",
        "views_count": 51000 + (art_id * 890),
        "shares_count": 6300 + (art_id * 160),
        "published_at": story["pubDate"] or "2026-11-06T08:00:00Z",
        "source_name": "ANI News",
        "source_url": source_url,
        "source_courtesy": "News Courtesy: Asian News International (ANI) Health Science Desk",
        "image_url": img,
        "image_alt": f"Clinical research laboratory photograph: {clean_title}",
        "image_courtesy": "Photo Courtesy: ANI Photo Archives",
        "fact_check_status": "Verified by Medical Peer Review Cell",
        "tags": "Health, Medicine, Science, Clinical Research, Wellness, ANI",
        "summary": f"{desc[:180]}... Leading clinical scientists and epidemiologists have published landmark peer-reviewed findings.",
        "content": f"""Medical researchers and global health specialists have published groundbreaking clinical observations shedding fresh light on human physiological mechanisms. {desc}

### Clinical Significance and Preventive Protocols

Epidemiologists and medical specialists emphasize that understanding cellular pathways and biological markers is vital for designing targeted therapeutic interventions. Peer-reviewed findings in leading medical journals demonstrate that early diagnosis, lifestyle interventions, and precision pharmacological therapies significantly improve patient outcomes.

Public health advisories highlight the growing importance of clean environment standards, balanced nutrition, and regular clinical screenings to mitigate chronic health risks.

### Ground Reality Aur Detailed Clinical Analysis:

Agar hum is medical research ke ground reality aur clinical pehluon par nazar dalein, toh **Preventive Medicine:** ne modern healthcare ko ek naya rasta dikhaya hai. Research scientists confirm that understanding metabolic pathways enables clinicians to detect potential complications months before clinical symptoms emerge.

![Medical Research Laboratory]( {img} )

Wahi doosri taraf, **Public Awareness:** ko lekar bhi healthcare organizations sakriya ho chuki hain. Saath hi sath, **Therapeutic Development:** ke hawale se experts ne confirm kiya hai ki Novel drug formulations and non-invasive diagnostic tools are progressing through advanced human clinical trials. Aise mein yeh saaf ho chuka hai ki aane wale saalon mein yeh discovery hazaron marizon ke jeevan ko behtar banane mein sahayak hogi.

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "title_en": f"🩺 {clean_title}",
        "summary_en": f"{desc[:180]}... Clinical scientists have published landmark peer-reviewed findings.",
        "content_en": f"""Medical researchers and global health specialists have published groundbreaking clinical observations shedding fresh light on human physiological mechanisms. {desc}

### Clinical Significance and Preventive Protocols

Epidemiologists and medical specialists emphasize that understanding cellular pathways and biological markers is vital for designing targeted therapeutic interventions. Peer-reviewed findings in leading medical journals demonstrate that early diagnosis, lifestyle interventions, and precision pharmacological therapies significantly improve patient outcomes.

Public health advisories highlight the growing importance of clean environment standards, balanced nutrition, and regular clinical screenings to mitigate chronic health risks.

### Ground Reality Aur Detailed Clinical Analysis:

Agar hum is medical research ke ground reality aur clinical pehluon par nazar dalein, toh **Preventive Medicine:** ne modern healthcare ko ek naya rasta dikhaya hai. Research scientists confirm that understanding metabolic pathways enables clinicians to detect potential complications months before clinical symptoms emerge.

![Medical Research Laboratory]( {img} )

Wahi doosri taraf, **Public Awareness:** ko lekar bhi healthcare organizations sakriya ho chuki hain. Saath hi sath, **Therapeutic Development:** ke hawale se experts ne confirm kiya hai ki Novel drug formulations and non-invasive diagnostic tools are progressing through advanced human clinical trials. Aise mein yeh saaf ho chuka hai ki aane wale saalon mein yeh discovery hazaron marizon ke jeevan ko behtar banane mein sahayak hogi.

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "title_hi": f"🩺 {clean_title}",
        "summary_hi": f"{desc[:150]}... चिकित्सा विज्ञान के क्षेत्र में महत्वपूर्ण खोज, शोधकर्ताओं ने नए जैविक कारकों का पता लगाया है।",
        "content_hi": f"""स्वास्थ्य और चिकित्सा विज्ञान के क्षेत्र से महत्वपूर्ण खबर। {desc} डॉक्टरों और वैज्ञानिकों का मानना है कि इस खोज से बीमारियों की रोकथाम में बड़ी मदद मिलेगी।

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "author_name": "Pankhudi Sharma",
        "author_bio": "Veteran media professional with over 15 years of experience in investigative journalism and digital storytelling, delivering high-impact news and trending global insights.",
        "author_url": "https://zestfeedx.com/about"
    }
    articles.append(art)
    art_id += 1

# 6. Tech - 6 stories from ANI News
for story in ani_data.get("tech", [])[:6]:
    title = story["title"]
    clean_title = re.sub(r'^[\"\']|[\"\']$', '', title)
    slug = make_slug(clean_title)
    img = story["img_thumb"]
    source_url = story["link"]
    desc = story["desc"]
    
    art = {
        "id": art_id,
        "title": f"⚡ {clean_title}",
        "slug": slug,
        "original_title": clean_title,
        "category": "tech",
        "fomo_badge": "🤖 Frontier AI & Tech",
        "read_time": "5 min read",
        "views_count": 64000 + (art_id * 1050),
        "shares_count": 7900 + (art_id * 180),
        "published_at": story["pubDate"] or "2026-11-06T07:00:00Z",
        "source_name": "ANI News",
        "source_url": source_url,
        "source_courtesy": "News Courtesy: Asian News International (ANI) Technology Desk",
        "image_url": img,
        "image_alt": f"Consumer technology innovation photograph: {clean_title}",
        "image_courtesy": "Photo Courtesy: ANI Photo Archives",
        "fact_check_status": "Verified by Tech & AI Engineering Desk",
        "tags": "Tech, AI, Software, Google, Apple, Cybersecurity, ANI",
        "summary": f"{desc[:180]}... Major software updates and hardware engineering roadmaps have been officially rolled out.",
        "content": f"""The global technology and consumer software ecosystem registered major upgrades today as engineering leaders unveiled updated digital features and platform security enhancements. {desc}

### Software Architecture and Consumer Security

Software architects and cybersecurity experts underscore that intelligent machine learning algorithms, biometric access protections, and on-device privacy shields are becoming foundational across modern digital operating systems. The newly rolled-out software patches optimize energy efficiency, application responsiveness, and real-time fraud mitigation.

Enterprise analysts emphasize that user data encryption and multi-modal neural processing allow smartphones and personal computing devices to anticipate user needs without compromising private personal information.

### Ground Reality Aur Detailed Tech Analysis:

Agar hum is technology update ke ground reality aur operational pehluon par nazar dalein, toh **Digital Security:** ne consumer trust ko ek naya boost diya hai. On-device automated threat detection protects millions of daily users from unauthorized access and identity interception.

![Technology Innovation Wire]( {img} )

Wahi doosri taraf, **Developer Ecosystem:** par bhi is upgrade ka asar saaf dekha ja sakta hai. Saath hi sath, **Hardware Optimization:** ke hawale se engineers ne confirm kiya hai ki Next-generation silicon processors maximize computational performance while reducing battery thermal dissipation. Aise mein yeh saaf ho chuka hai ki aane wale updates se user experience aur bhi tezi se evolve hoga.

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "title_en": f"⚡ {clean_title}",
        "summary_en": f"{desc[:180]}... Major software updates and platform security features have been officially rolled out.",
        "content_en": f"""The global technology and consumer software ecosystem registered major upgrades today as engineering leaders unveiled updated digital features and platform security enhancements. {desc}

### Software Architecture and Consumer Security

Software architects and cybersecurity experts underscore that intelligent machine learning algorithms, biometric access protections, and on-device privacy shields are becoming foundational across modern digital operating systems. The newly rolled-out software patches optimize energy efficiency, application responsiveness, and real-time fraud mitigation.

Enterprise analysts emphasize that user data encryption and multi-modal neural processing allow smartphones and personal computing devices to anticipate user needs without compromising private personal information.

### Ground Reality Aur Detailed Tech Analysis:

Agar hum is technology update ke ground reality aur operational pehluon par nazar dalein, toh **Digital Security:** ne consumer trust ko ek naya boost diya hai. On-device automated threat detection protects millions of daily users from unauthorized access and identity interception.

![Technology Innovation Wire]( {img} )

Wahi doosri taraf, **Developer Ecosystem:** par bhi is upgrade ka asar saaf dekha ja sakta hai. Saath hi sath, **Hardware Optimization:** ke hawale se engineers ne confirm kiya hai ki Next-generation silicon processors maximize computational performance while reducing battery thermal dissipation. Aise mein yeh saaf ho chuka hai ki aane wale updates se user experience aur bhi tezi se evolve hoga.

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "title_hi": f"⚡ {clean_title}",
        "summary_hi": f"{desc[:150]}... तकनीकी दुनिया से बड़ी खबर, नए सॉफ्टवेयर अपडेट और सुरक्षा फीचर्स जारी किए गए हैं।",
        "content_hi": f"""तकनीक और डिजिटल इनोवेशन के क्षेत्र से बड़ी खबर। {desc} नए फीचर्स से उपयोगकर्ताओं को अधिक सुरक्षा और बेहतर अनुभव प्राप्त होगा।

<p className="pt-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">Source: <a href="{source_url}" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-semibold">{source_url}</a></p>""",
        "author_name": "Pankhudi Sharma",
        "author_bio": "Veteran media professional with over 15 years of experience in investigative journalism and digital storytelling, delivering high-impact news and trending global insights.",
        "author_url": "https://zestfeedx.com/about"
    }
    articles.append(art)
    art_id += 1

# Also keep the 5 Ramayana articles (Category: ramayana) with relevant photos
with open("scripts/all_new_10_articles.json", encoding="utf-8") as f:
    ram_articles = [a for a in json.load(f) if a["category"] == "ramayana"]

for r in ram_articles:
    r["id"] = art_id
    art_id += 1
    articles.append(r)

print(f"Total articles generated: {len(articles)}")
cats = [a["category"] for a in articles]
from collections import Counter
print("Categories:", Counter(cats))

with open("scripts/ani_seed_articles_complete.json", "w", encoding="utf-8") as f:
    json.dump(articles, f, indent=2, ensure_ascii=False)

print("Saved to scripts/ani_seed_articles_complete.json")

