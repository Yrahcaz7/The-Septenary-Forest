const story = [`
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
`].map(value => value.replace(/\n\t/g, '<br>...<br>').trim());

story[0] = story[0].slice(4);
