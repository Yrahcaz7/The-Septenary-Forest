const story = [
	[`
	"Where am I?"
	"What am I?"
	The Being became aware of its existence.
	"Where is everything?"
	The Being knew that something was missing.
	But it didn't know what that something was.
`, `
	The Being only saw nothingness.
	Only an empty void.
	The Being tried to remember.
	The Being tried and tried.
	And a glowing green spark appeared.
`, `
	The Being was facinated by this spark.
	The only thing in the void of nothingness.
	The Being thought and thought what to name it.
	And another spark appeared.
	"I shall call you... Essence."
`, `
	The Being discovered that thought was very important.
	More thoughts meant more Essence, when it was done thinking.
	It used this new Essence to broaden the horizon of its thought.
	The cycle continued, as the void filled with green.
	But something was missing.
`, `
	The Being decided that it needed something to measure thought.
	Perhaps this would help create more Essence.
	"Well, since thought is never pointless..."
	The Being thought some more.
	"I might be able to measure thought in its points."
	But that was not it. Something was still missing.
`, `
	The cycle slowed, and the Being became disheartened.
	But then, an idea occured to the Being.
	There is only Essence; but what is that Essence of?
	The Being delved deep into its thoughts.
	Down to the very core of its Being.
	"This... is what the Essence is coming from. The Core."
`, `
	When the Being came back to, all the Essence was gone.
	The Being started the cycle again.
	Essence from the new Core was higher in quantity.
	The Being's thoughts were also clearer.
	The Being decided to reach for the Core again.
	And the new cycle began.
`, `
	As the Cores accumulated, the void filled with yellow.
	Two bright colors now shined in the everlasting void.
	However, the Being began to hit a wall.
	There was only so much the Being could do without knowledge.
	But then... the Being got an uneasy feeling...
	And started to REMEMBER...
`], [`
	"I... I've found it! Haha! I was right!"
	The scientist reveled in pleasure at finally proving his theory.
	"The thing smaller than a quark... the essence of the universe!"
	The scientist couldn't contain his exitement and started running around his lab. The lab was very messy, but he knew exactly where was safe and where was a death-by-slipping zone.
`, `
	"All I need to do now is submit my findings to the Committee!"
	The scientist started hurriedly packing up one of his samples.
	"Hehe... I can't wait to see all of their shocked expressions!"
	The scientist rushed out of the door in a flurry, and headed for the spacecraft at the dock.
	"Alright... booting up... come on... there we go!"
	The spacecraft launched off of the dock, carrying the scientist up into the atmosphere.
`, `
	Spacecraft: "Where is your destination?"
	Scientist: "The Committee in sector fifty nine."
	Spacecraft: "Do you mean Coast City in sector fifty?"
	The scientist frantically flailed his arms.
	Scientist: "No, no! The Committee! Nine sectors over!"
	Spacecraft: "Command received; now exiting atmosphere."
	Scientist: "When I get rich, I'll replace this damn broken thing."
`, `
	As the spacecraft hurtled through space, the scientist began organizing his luggage, sprawled all over the floor.
	"Oh, so <b>that's</b> where I put the arthropod!"
	The scientist picked up what looked like a mass of goo and teeth, and began staring at it.
	"What was it called again? A septendoras?"
	By the time the scientist had put everything in the spacecraft in neat piles, it had arrived at the Comittee.
`, `
	"Well, here goes nothing!"
	The scientist opened the door, and jumped out of the spacecraft.
	"It's been a long time since i've been here..."
	The scientist started walking across the floating metal platform, towards the towering structure in the center, having no idea what would come next...
	Building: "Do you have an appointment?"
	Scientist: "No. LS14H is here to report his findings."
	Building: "Verifying identity... verified. Please enter."
`, `
	The scientist entered the building, and then the floor started moving up very quickly.
	"I remember the first time I came here... throwing up my lunch was not very pleasant. Got fined for it too."
	As the elevator stopped, part of the wall slid upwards, revealing the chamber of the Comittee.
	Meanwhile, at the scientist's lab, an unfriendly visitor opened the door. The visitor looked completely robotic, even though there existed sufficently advanced technology to hide the fact. The visitor began searching through the scientist's samples...
`, `
	The visitor found what they were looking for; a sample of the essence. The visitor then placed it inside their robotic skull, and swiftly exited the lab.
	The visitor didn't know, however, that some types of essence are highly reactive with each other...
	<br><br>And suddenly everything was bathed in a pitch-black light.
`, `
	<br><br>Meanwhile, the scientist was presenting his findings to the Comittee, and was getting a lot of skeptical looks.
	Comittee member: "And how, exactly, do you know that everthing is made up of this?"
	Scientist: "I have already found evidence of seven flavors of quarks being made up of essence. Right here, I have a sample of a bottom quark."
	Comittee member: "I know that, but what about the other four?"
	Scientist: "I don't see any point in arguing about this."
	Comittee member: "Oh really? The files say that you, LS14H, have faked a discovery before!"
	Then suddenly, the scientist's sample broke its container, as something similar to an explosion seemed to occur.
`, `
	The scientist dissapeared in an instant upon contact, and then the strange explosion shrank back down again.
	The comittee barely had any time to wonder what just happened, as black light broke through the side of the building...
	<br><br>And then everything was gone.
`], [`
	More story coming soon!
`]];

for (let index = 0; index < story.length; index++) {
	story[index][0] = story[index][0].slice(2);
};

story[0][0] = "...<br>" + story[0][0];

story[0] = story[0].map(value => value.replace(/\n\t/g, '<br>...<br>').trim());

story[1] = story[1].map(value => value.replace(/\n\t/g, '<br><br>').trim());
