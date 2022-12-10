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
`]];

for (let index = 0; index < story.length; index++) {
	story[index][0] = story[index][0].slice(2);
};

story[0][0] = "...<br>" + story[0][0];

story[0] = story[0].map(value => value.replace(/\n\t/g, '<br>...<br>').trim());

story[1] = story[1].map(value => value.replace(/\n\t/g, '<br><br>').trim());
