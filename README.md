Project Name: Ikorian Monster Manual
Descritption: An interactive Monster Manual for D&D 5E featuring monsters inpsirated by monsters from the Magic The Gathering set Ikoria Lair of Bethmons. 
Purpose: I like to use my laptop as a resouce when Dungeon Mastering my D&D games, the filter options make it easy to use that fliping through a book.
Features: Filter features, self loading filter list, also the base stats auto load which is an important feature when we get to future features e.i. (attack = str.modifer + cr)
Technologies: Javascript, HTML
AI Tools: Microsoft Copilot
Installation: Download Repo from github
Running the Application: OPen the HTML file in your prefered browser
How AI Was Used: Wrote 99% of the code, in particualr: It auto generated 10 monster stats blocks, handled the object orditned logic for the auto fill stats.
Screen Shots: See folders
Future Improvements: 
1 The monster object needs some minor tweeks (movement speed, enviroment, legenadary actions). The major one is a mutate option. This was my orginal reason I was working on this project years ago and had trouble getting this work. It's suppose to combine two monsters we work there hp, attack and actions based on which stats are higher from both monsters.
2 Css and art, I used a pretty base layer of css and didn't add any of the mtg art for the monsters. I would do both myself probably
3 Way more monster objects, add all on human creatrures from the set and it's commander set as well
Test Requirements: Downloaded git functions

Vibe Coding Reflection
What did AI do particularly well?
Object orinented logic was hugely helpful also it knew to make the css look like monster manual entries
What did AI do poorly?
The first time I ran the code it gave me an HTML with no code, also i had to ask for each feature for the object orended logic.
How did you verify AI-generated code?
Console.log commands, sight reading the code, runing the app
How did your prompts evolve?
Would you trust AI to build the entire application without human supervision?
Lots of adding logic for trhe monster object i.e:
Add AC and saving throws and show me the code
add CR-derived proficiency bonus automatically and derived damage rolls
Adding filler data to be filtered:
make 10 new monsters from the follows cards from magic the gathering: Essence Symbiote, Adaptive Shimmerer, Archipelagore, Auspicious Starrix, Avian Oddity, Boneyard Lurker, Boot Nipper, Brokkos, Apex of Forever, Cavern Whisperer and Chittering Harvester
LAst bit extra logic:
add a way to filter which monster to display based on cr, size, monstertype or display all
then I just gave a generic:
add some css
No, I need to fix some minior bits as part of my monster library