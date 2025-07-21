import asyncio
import aiohttp
import random
from datetime import datetime, timedelta

API_URL = "https://via-forum-api.fly.dev/api"

# Use existing users
users = [
    {"username": "sofie_a", "password": "Demo123!"},
    {"username": "mikkel_h", "password": "Demo123!"}, 
    {"username": "emma_n", "password": "Demo123!"},
    {"username": "jonas_p", "password": "Demo123!"},
    {"username": "katrine_j", "password": "Demo123!"},
    {"username": "frederik_l", "password": "Demo123!"},
    {"username": "maria_s", "password": "Demo123!"},
    {"username": "kasper_m", "password": "Demo123!"}
]

# Autentiske VIA-specifikke posts
authentic_posts = [
    {
        "author": "emma_n",
        "title": "Nogen der har tips til PUF eksamen? (Pædagogisk Udviklingsforløb)",
        "content": """hej allesammen!! 

er der nogen herinde fra campus Aarhus der har været til PUF eksamen?? jeg går på 4. semester og er SÅ nervøs 😅

mit projekt handler om motorisk udvikling hos 2-3 årige, og jeg har arbejdet med bevægelseslege i min praktik i Risskov... 

men jeg ved ikke om min problemformulering er skarp nok:
'Hvordan kan pædagogen gennem målrettede bevægelseslege understøtte 2-3-årige børns grovmotoriske udvikling i en daginstitution?'

er det for bredt?? min vejleder på VIA siger det er fint men jeg er i tvivl...

også - hvor lang tid skal man regne med til fremlæggelse? 20 min?

hjælp en stresset medstuderende 🙏""",
        "comments": [
            {
                "author": "jonas_p",
                "content": "hey emma! havde puf sidste semester. 20 min fremlæggelse er spot on, så er der 25 min eksamination. din problemformulering er fin synes jeg! husk at koble teori på - brug evt Moser om kropslig læring?"
            },
            {
                "author": "katrine_j",
                "content": "Åh gud PUF 😱 jeg skal også op næste måned... tip: lav en tydelig rød tråd mellem problemformulering, teori og praksis. Censor ELSKER når man kan se sammenhængen tydeligt!"
            },
            {
                "author": "sofie_a",
                "content": "har du husket at booke lokale til øve-fremlæggelse?? der er vild kamp om grupperummene på campus lige nu 😬"
            }
        ]
    },
    {
        "author": "mikkel_h",
        "title": "Frustreret over praktik i Viborg kommune - nogen der kan relatere?",
        "content": """okay jeg må bare ud med det...

er i 3. semesters praktik i en børnehave i Viborg og hold kæft hvor er det hårdt at være mand her

min vejleder (kvinde, 55) har direkte sagt at jeg ikke må:
- skifte ble på pigerne (kun drengene)
- være alene på stuen med børnene
- tage børn på skødet
- hjælpe børn på toilettet

what the actual fuck?? hvordan skal jeg lære at være pædagog når jeg bliver behandlet som potentiel pædofil??

har snakket med min praktikvejleder fra VIA men hun siger bare jeg skal 'respektere institutionens kultur' 

er det bare mig eller er det her IKKE okay? overvejer seriøst at droppe ud

nogen andre fyre fra VIA der har oplevet det samme?""",
        "comments": [
            {
                "author": "kasper_m",
                "content": "bro jeg føler med dig!! havde EXACT samme oplevelse i Silkeborg. endte med at skifte praktiksted gennem VIA. du har ret til ordentlig vejledning uanset køn!"
            },
            {
                "author": "frederik_l",
                "content": "tag det op på næste vejledning på VIA! vi er 3 fyre på mit hold der har oplevet lignende. vi overvejer at gå til studieledelsen"
            },
            {
                "author": "maria_s",
                "content": "det er SÅ fucked up! som kvinde bliver jeg harm på jeres vegne. i skal have samme muligheder som os. støtter jer 100% hvis i går til ledelsen!"
            }
        ]
    },
    {
        "author": "katrine_j",
        "title": "SOS: Aula-mareridt med forældre i Århus Vest - hjælp!!",
        "content": """jeg kan ikke mere 😭😭

er i praktik i vuggestue i Brabrand og de forældre her er NEXT LEVEL

eksempler fra DENNE UGE:
- mor der skrev 47 (!!!) beskeder fordi hendes søn havde en lille rids på kinden
- far der kræver jeg sender billeder HVER TIME af hans datter
- forældre der klager over at deres 2-årige 'ikke lærer nok engelsk'
- besked kl 22:43 om at jeg skal huske Malthes sovedyr i morgen

min vejleder siger bare 'velkommen til virkeligheden' men det her kan da ikke være normalt??

ps. vi bruger også famly ikke aula, ved ikke om det gør en forskel

nogen der har tips til at sætte grænser uden at blive uprofessionel? skal til midtvejsevaluering på VIA næste uge og ved ikke om jeg skal tage det op...""",
        "comments": [
            {
                "author": "sofie_a",
                "content": "åh gud jeg døde over de 47 beskeder 😂😭 men seriøst, tag det med til midtvejs! det er faktisk et godt eksempel på udfordringer i forældresamarbejde"
            },
            {
                "author": "emma_n",
                "content": "pro tip: lav en fast svartid, fx 'jeg tjekker beskeder kl 7, 12 og 16' og hold dig til det! lærte det på kommunikationsfaget sidste semester"
            },
            {
                "author": "jonas_p",
                "content": "brabrand repræsenterer 😅 men ja forældrene der er intense... husk at dokumentere de vilde beskeder, kan bruges i din portfolio!"
            }
        ]
    },
    {
        "author": "frederik_l",
        "title": "Rygter om lukning af Campus Viborg?? 😱 Nogen der ved noget?",
        "content": """har hørt fra nogle på 6. semester at der er snak om at VIA overvejer at lukke pædagoguddannelsen i Viborg og flytte det hele til Aarhus??

kan det virkelig passe?? jeg valgte specifikt Viborg fordi jeg ikke gider bo i Aarhus (no offense)

min SU rækker ikke til at flytte og jeg har arbejde her...

please sig det bare er rygter 😭😭

mvh bekymret 2. semester studerende""",
        "comments": [
            {
                "author": "maria_s",
                "content": "hørt det samme!! men tror det er BS, de har lige renoveret bygningerne i Viborg? ville være mega weird at lukke nu"
            },
            {
                "author": "mikkel_h",
                "content": "der er studierådsmøde på torsdag kl 15 i N106! kom og stil spørgsmål! vi skal ikke finde os i det her"
            },
            {
                "author": "katrine_j",
                "content": "VIA: 'vi vil være tæt på de studerende' også VIA: *lukker alle små campusser* 🤡"
            }
        ]
    },
    {
        "author": "jonas_p",
        "title": "Karakterer på itslearning - WTF er der sket??",
        "content": """er jeg den eneste der ikke kan se mine karakterer fra sidste semester på itslearning?? 

skulle bruge min karakter fra 'pædagogens praksis' til min SU ansøgning men der står bare 'afventer' selvom jeg fik 7 tilbage i januar

har skrevet til studieservice men you know... de svarer jo aldrig 🙄

også random men hvorfor bruger vi stadig itslearning når alle andre uddannelser er skiftet til brightspace eller canvas??

nogen der har et trick til at finde gamle karakterer?""",
        "comments": [
            {
                "author": "emma_n",
                "content": "gå ind på selvbetjening.via.dk i stedet! der ligger alle karakterer. itslearning er lort til det"
            },
            {
                "author": "sofie_a",
                "content": "lol velkommen til VIA IT... sidste år var HELE itslearning nede i 3 dage midt i eksamensperioden 🤠"
            },
            {
                "author": "frederik_l",
                "content": "pro tip: screenshot ALTID dine karakterer når du får dem. trust me, learned the hard way"
            }
        ]
    },
    {
        "author": "maria_s",
        "title": "Eksamensangst gruppe på Campus Aarhus? 🫂",
        "content": """hey... 

er der andre der kæmper med vild eksamensangst? 

jeg skal op i 'børn i udsatte positioner' om 2 uger og jeg kan nærmest ikke sove. har altid haft det sådan men det er blevet værre efter online undervisning under corona

tænkte om vi kunne lave en lille støttegruppe? måske mødes i kantinen eller et grupperum og øve sammen?

jeg ved godt VIA har studievejledning men der er 3 ugers ventetid 😞

er der andre der kunne være interesserede? måske vi kunne mødes tirsdag eller torsdag efter undervisning?

kh maria (som burde læse i stedet for at skrive på reddit lol)""",
        "comments": [
            {
                "author": "katrine_j",
                "content": "JA TAK!! 🙋‍♀️ jeg er SÅ med! skal også op i BiU. lad os booke grupperum 3.24, det er det hyggeligt"
            },
            {
                "author": "sofie_a",
                "content": "kan anbefale via's mindfulness sessions! de kører hver onsdag kl 12 i bygning c. det har virkelig hjulpet mig ❤️"
            },
            {
                "author": "emma_n",
                "content": "i er ikke alene! 3 fra mit hold dumpede BiU sidste år fordi de gik i panik... lad os støtte hinanden! jeg er med tirsdag"
            }
        ]
    },
    {
        "author": "kasper_m",
        "title": "Fredagsbar drama - skal vi droppe pædagog-klubben? 🍺",
        "content": """okay te er spildt...

i fredags til fredagsbar i pædagog-klubben skete der noget ret fucked up. nogle fra 6. semester var mega fulde og begyndte at joke om 'de nye på 1. semester der tror de skal redde alle børn'

en pige fra 1. semester begyndte at græde og gik hjem

synes virkelig stemningen i pædagog-klubben er blevet toxic. det handler mere om at drikke sig i hegnet end om at skabe fællesskab

burde vi ikke lave noget andet? game night? filmklub? noget hvor man faktisk kan snakke sammen?

eller er det bare mig der er blevet gammel og kedelig? (er 26 lol)

ps. shoutout til jer der hjalp med at rydde op, i er de ægte MVP'er""",
        "comments": [
            {
                "author": "mikkel_h",
                "content": "var der og det var CRINGE AF. støtter 100% alternative arrangementer! what about brætspilscafe?"
            },
            {
                "author": "frederik_l",
                "content": "filmklub lyder nice! kunne se pædagogiske film og diskutere dem? (eller bare se marvel og chille haha)"
            },
            {
                "author": "jonas_p",
                "content": "ej kom nu, fredagsbar er tradition! men enig i at 6. semester var over grænsen. måske lave regler om opførsel?"
            },
            {
                "author": "maria_s",
                "content": "SÅ med på game night! mario kart turnering anyone?? 🎮"
            }
        ]
    },
    {
        "author": "sofie_a",
        "title": "Boligtip til nye studerende - undgå dette!! 🏠",
        "content": """til alle jer der starter næste semester:

UNDGÅ FOR ALT I VERDEN:
- kollektiv på randersvej (vores varmtvand har været væk i 3 uger)
- 'billige' værelser i gellerup (min cykel blev stjålet 3 gange)
- facebook grupper uden kontrakt (blev snydt for 2 måneders depositum)

GOOD SHIT:
- ungdomsboligaarhus.dk (lange ventelister men worth it)
- VIA's egen boligportal
- holstebro hvis du ikke har noget imod at pendle (meget billigere)

også hot tip: søg bolig i god tid!! august er KAOS

har i andre boligtips? lad os hjælpe hinanden 💪

xoxo sofie der endelig har fundet et sted uden mug i badeværelset""",
        "comments": [
            {
                "author": "emma_n",
                "content": "kan varmt anbefale brabrand!! ja der er lidt ghetto vibes men lejlighederne er billige og store. og der er direkte bus til VIA!"
            },
            {
                "author": "katrine_j",
                "content": "pro tip: tjek om i kan få boligsikring! jeg får 1200 kr om måneden, game changer på SU 💸"
            },
            {
                "author": "jonas_p",
                "content": "undgå også stenaldervej!!! virker billigt men der er råd i ALLE lejligheder. rip min lunger"
            }
        ]
    }
]

async def create_authentic_content():
    async with aiohttp.ClientSession() as session:
        # Login all users
        print("🔐 Logger ind...")
        user_tokens = {}
        
        for user in users:
            form_data = aiohttp.FormData()
            form_data.add_field('username', user['username'])
            form_data.add_field('password', user['password'])
            
            try:
                async with session.post(f"{API_URL}/auth/login", data=form_data) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        user_tokens[user["username"]] = data["access_token"]
                        print(f"✅ {user['username']} online")
            except Exception as e:
                print(f"❌ {user['username']}: {e}")
        
        print(f"\n📱 {len(user_tokens)} studerende online")
        
        # Create authentic posts
        print("\n💬 Poster på forummet...")
        post_ids = {}
        
        for i, post in enumerate(authentic_posts):
            if post["author"] in user_tokens:
                headers = {"Authorization": f"Bearer {user_tokens[post['author']]}"}
                post_data = {
                    "title": post["title"],
                    "content": post["content"],
                    "type": "text"
                }
                
                try:
                    async with session.post(f"{API_URL}/posts/", json=post_data, headers=headers) as resp:
                        if resp.status == 200:
                            data = await resp.json()
                            post_ids[i] = data["id"]
                            print(f"📝 {post['author']}: {post['title'][:50]}...")
                            
                            # Natural voting patterns
                            all_users = list(user_tokens.keys())
                            all_users.remove(post["author"])
                            
                            # Some posts are more popular
                            if "hjælp" in post["title"].lower() or "tips" in post["title"].lower():
                                num_votes = random.randint(5, 7)
                            else:
                                num_votes = random.randint(2, 5)
                            
                            voters = random.sample(all_users, min(len(all_users), num_votes))
                            
                            for voter in voters:
                                vote_headers = {"Authorization": f"Bearer {user_tokens[voter]}"}
                                # Most votes are positive on help posts
                                vote_value = 1 if random.random() > 0.1 else -1
                                await session.post(
                                    f"{API_URL}/posts/{data['id']}/vote?vote_value={vote_value}", 
                                    headers=vote_headers
                                )
                        else:
                            print(f"❌ Fejl: {await resp.text()}")
                except Exception as e:
                    print(f"❌ Exception: {e}")
                
                await asyncio.sleep(0.7)
        
        # Create authentic comments
        print("\n💭 Kommenterer...")
        for i, post in enumerate(authentic_posts):
            if i in post_ids and "comments" in post:
                for j, comment in enumerate(post["comments"]):
                    if comment["author"] in user_tokens:
                        headers = {"Authorization": f"Bearer {user_tokens[comment['author']]}"}
                        comment_data = {"body": comment["content"]}
                        
                        try:
                            async with session.post(
                                f"{API_URL}/comments/post/{post_ids[i]}", 
                                json=comment_data, 
                                headers=headers
                            ) as resp:
                                if resp.status == 200:
                                    data = await resp.json()
                                    print(f"  ↳ {comment['author']} svarer")
                                    
                                    # Comments usually get fewer votes
                                    voters = random.sample(
                                        [u for u in user_tokens.keys() if u != comment["author"]], 
                                        min(len(user_tokens)-1, random.randint(1, 3))
                                    )
                                    for voter in voters:
                                        vote_headers = {"Authorization": f"Bearer {user_tokens[voter]}"}
                                        await session.post(
                                            f"{API_URL}/comments/{data['id']}/vote?vote_value=1", 
                                            headers=vote_headers
                                        )
                        except Exception as e:
                            print(f"❌ Kommentar fejl: {e}")
                        
                        await asyncio.sleep(0.5)
        
        print("\n✨ VIA Pædagog forum er nu opdateret!")
        print("📊 Nye tråde om:")
        print("   • PUF eksamen stress")
        print("   • Mandlige pædagogstuderendes udfordringer")
        print("   • Aula/Famly forældre-kommunikation")
        print("   • Campus rygter og bekymringer")
        print("   • IT-problemer og karakterer")
        print("   • Eksamensangst støttegruppe")
        print("   • Fredagsbar debat")
        print("   • Boligtips til nye studerende")
        print("\n🎓 Autentisk VIA-studieliv på: https://via-paedagoger.vercel.app")

if __name__ == "__main__":
    asyncio.run(create_authentic_content())