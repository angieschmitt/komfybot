const moves = [
	{
		'move': 'Pound',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Karate Chop',
		'damage': 50,
		'hit_chance': '100%',
	},
	{
		'move': 'Double Slap',
		'damage': 15,
		'hit_chance': '85%',
	},
	{
		'move': 'Comet Punch',
		'damage': 18,
		'hit_chance': '85%',
	},
	{
		'move': 'Mega Punch',
		'damage': 80,
		'hit_chance': '85%',
	},
	{
		'move': 'Pay Day',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Fire Punch',
		'damage': 75,
		'hit_chance': '100%',
	},
	{
		'move': 'Ice Punch',
		'damage': 75,
		'hit_chance': '100%',
	},
	{
		'move': 'Thunder Punch',
		'damage': 75,
		'hit_chance': '100%',
	},
	{
		'move': 'Scratch',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Vise Grip',
		'damage': 55,
		'hit_chance': '100%',
	},
	{
		'move': 'Guillotine',
		'damage': '—',
		'hit_chance': '30%',
	},
	{
		'move': 'Razor Wind',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Swords Dance',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Cut',
		'damage': 50,
		'hit_chance': '95%',
	},
	{
		'move': 'Gust',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Wing Attack',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Whirlwind',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Fly',
		'damage': 90,
		'hit_chance': '95%',
	},
	{
		'move': 'Bind',
		'damage': 15,
		'hit_chance': '85%',
	},
	{
		'move': 'Slam',
		'damage': 80,
		'hit_chance': '75%',
	},
	{
		'move': 'Vine Whip',
		'damage': 45,
		'hit_chance': '100%',
	},
	{
		'move': 'Stomp',
		'damage': 65,
		'hit_chance': '100%',
	},
	{
		'move': 'Double Kick',
		'damage': 30,
		'hit_chance': '100%',
	},
	{
		'move': 'Mega Kick',
		'damage': 120,
		'hit_chance': '75%',
	},
	{
		'move': 'Jump Kick',
		'damage': 100,
		'hit_chance': '95%',
	},
	{
		'move': 'Rolling Kick',
		'damage': 60,
		'hit_chance': '85%',
	},
	{
		'move': 'Sand Attack',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Headbutt',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Horn Attack',
		'damage': 65,
		'hit_chance': '100%',
	},
	{
		'move': 'Fury Attack',
		'damage': 15,
		'hit_chance': '85%',
	},
	{
		'move': 'Horn Drill',
		'damage': '—',
		'hit_chance': '30%',
	},
	{
		'move': 'Tackle',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Body Slam',
		'damage': 85,
		'hit_chance': '100%',
	},
	{
		'move': 'Wrap',
		'damage': 15,
		'hit_chance': '90%',
	},
	{
		'move': 'Take Down',
		'damage': 90,
		'hit_chance': '85%',
	},
	{
		'move': 'Thrash',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Double-Edge',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Tail Whip',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Poison Sting',
		'damage': 15,
		'hit_chance': '100%',
	},
	{
		'move': 'Twineedle',
		'damage': 25,
		'hit_chance': '100%',
	},
	{
		'move': 'Pin Missile',
		'damage': 25,
		'hit_chance': '95%',
	},
	{
		'move': 'Leer',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Bite',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Growl',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Roar',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Sing',
		'damage': '—',
		'hit_chance': '55%',
	},
	{
		'move': 'Supersonic',
		'damage': '—',
		'hit_chance': '55%',
	},
	{
		'move': 'Sonic Boom',
		'damage': '—',
		'hit_chance': '90%',
	},
	{
		'move': 'Disable',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Acid',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Ember',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Flamethrower',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Mist',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Water Gun',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Hydro Pump',
		'damage': 110,
		'hit_chance': '80%',
	},
	{
		'move': 'Surf',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Ice Beam',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Blizzard',
		'damage': 110,
		'hit_chance': '70%',
	},
	{
		'move': 'Psybeam',
		'damage': 65,
		'hit_chance': '100%',
	},
	{
		'move': 'Bubble Beam',
		'damage': 65,
		'hit_chance': '100%',
	},
	{
		'move': 'Aurora Beam',
		'damage': 65,
		'hit_chance': '100%',
	},
	{
		'move': 'Hyper Beam',
		'damage': 150,
		'hit_chance': '90%',
	},
	{
		'move': 'Peck',
		'damage': 35,
		'hit_chance': '100%',
	},
	{
		'move': 'Drill Peck',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Submission',
		'damage': 80,
		'hit_chance': '80%',
	},
	{
		'move': 'Low Kick',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Seismic Toss',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Strength',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Absorb',
		'damage': 20,
		'hit_chance': '100%',
	},
	{
		'move': 'Mega Drain',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Leech Seed',
		'damage': '—',
		'hit_chance': '90%',
	},
	{
		'move': 'Growth',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Razor Leaf',
		'damage': 55,
		'hit_chance': '95%',
	},
	{
		'move': 'Solar Beam',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Poison Powder',
		'damage': '—',
		'hit_chance': '75%',
	},
	{
		'move': 'Stun Spore',
		'damage': '—',
		'hit_chance': '75%',
	},
	{
		'move': 'Sleep Powder',
		'damage': '—',
		'hit_chance': '75%',
	},
	{
		'move': 'Petal Dance',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'String Shot',
		'damage': '—',
		'hit_chance': '95%',
	},
	{
		'move': 'Dragon Rage',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Fire Spin',
		'damage': 35,
		'hit_chance': '85%',
	},
	{
		'move': 'Thunder Shock',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Thunderbolt',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Thunder Wave',
		'damage': '—',
		'hit_chance': '90%',
	},
	{
		'move': 'Thunder',
		'damage': 110,
		'hit_chance': '70%',
	},
	{
		'move': 'Rock Throw',
		'damage': 50,
		'hit_chance': '90%',
	},
	{
		'move': 'Earthquake',
		'damage': 100,
		'hit_chance': '100%',
	},
	{
		'move': 'Fissure',
		'damage': '—',
		'hit_chance': '30%',
	},
	{
		'move': 'Dig',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Toxic',
		'damage': '—',
		'hit_chance': '90%',
	},
	{
		'move': 'Confusion',
		'damage': 50,
		'hit_chance': '100%',
	},
	{
		'move': 'Psychic',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Hypnosis',
		'damage': '—',
		'hit_chance': '60%',
	},
	{
		'move': 'Meditate',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Agility',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Quick Attack',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Rage',
		'damage': 20,
		'hit_chance': '100%',
	},
	{
		'move': 'Teleport',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Night Shade',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Screech',
		'damage': '—',
		'hit_chance': '85%',
	},
	{
		'move': 'Double Team',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Recover',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Harden',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Minimize',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Smokescreen',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Confuse Ray',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Withdraw',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Defense Curl',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Barrier',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Light Screen',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Haze',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Reflect',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Focus Energy',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Bide',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Metronome',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Self-Destruct',
		'damage': 200,
		'hit_chance': '100%',
	},
	{
		'move': 'Egg Bomb',
		'damage': 100,
		'hit_chance': '75%',
	},
	{
		'move': 'Lick',
		'damage': 30,
		'hit_chance': '100%',
	},
	{
		'move': 'Smog',
		'damage': 30,
		'hit_chance': '70%',
	},
	{
		'move': 'Sludge',
		'damage': 65,
		'hit_chance': '100%',
	},
	{
		'move': 'Bone Club',
		'damage': 65,
		'hit_chance': '85%',
	},
	{
		'move': 'Fire Blast',
		'damage': 110,
		'hit_chance': '85%',
	},
	{
		'move': 'Waterfall',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Clamp',
		'damage': 35,
		'hit_chance': '85%',
	},
	{
		'move': 'Swift',
		'damage': 60,
		'hit_chance': '—%',
	},
	{
		'move': 'Skull Bash',
		'damage': 130,
		'hit_chance': '100%',
	},
	{
		'move': 'Spike Cannon',
		'damage': 20,
		'hit_chance': '100%',
	},
	{
		'move': 'Constrict',
		'damage': 10,
		'hit_chance': '100%',
	},
	{
		'move': 'Amnesia',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Kinesis',
		'damage': '—',
		'hit_chance': '80%',
	},
	{
		'move': 'Soft-Boiled',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'High Jump Kick',
		'damage': 130,
		'hit_chance': '90%',
	},
	{
		'move': 'Glare',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Dream Eater',
		'damage': 100,
		'hit_chance': '100%',
	},
	{
		'move': 'Poison Gas',
		'damage': '—',
		'hit_chance': '90%',
	},
	{
		'move': 'Barrage',
		'damage': 15,
		'hit_chance': '85%',
	},
	{
		'move': 'Leech Life',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Lovely Kiss',
		'damage': '—',
		'hit_chance': '75%',
	},
	{
		'move': 'Sky Attack',
		'damage': 140,
		'hit_chance': '90%',
	},
	{
		'move': 'Bubble',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Dizzy Punch',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Spore',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Flash',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Psywave',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Splash',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Acid Armor',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Crabhammer',
		'damage': 100,
		'hit_chance': '90%',
	},
	{
		'move': 'Explosion',
		'damage': 250,
		'hit_chance': '100%',
	},
	{
		'move': 'Fury Swipes',
		'damage': 18,
		'hit_chance': '80%',
	},
	{
		'move': 'Bonemerang',
		'damage': 50,
		'hit_chance': '90%',
	},
	{
		'move': 'Rest',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Rock Slide',
		'damage': 75,
		'hit_chance': '90%',
	},
	{
		'move': 'Hyper Fang',
		'damage': 80,
		'hit_chance': '90%',
	},
	{
		'move': 'Sharpen',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Conversion',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Tri Attack',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Super Fang',
		'damage': '—',
		'hit_chance': '90%',
	},
	{
		'move': 'Slash',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Substitute',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Triple Kick',
		'damage': 10,
		'hit_chance': '90%',
	},
	{
		'move': 'Spider Web',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Mind Reader',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Nightmare',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Flame Wheel',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Curse',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Flail',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Conversion 2',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Aeroblast',
		'damage': 100,
		'hit_chance': '95%',
	},
	{
		'move': 'Cotton Spore',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Reversal',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Spite',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Powder Snow',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Mach Punch',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Scary Face',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Feint Attack',
		'damage': 60,
		'hit_chance': '—%',
	},
	{
		'move': 'Sweet Kiss',
		'damage': '—',
		'hit_chance': '75%',
	},
	{
		'move': 'Belly Drum',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Sludge Bomb',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Mud-Slap',
		'damage': 20,
		'hit_chance': '100%',
	},
	{
		'move': 'Octazooka',
		'damage': 65,
		'hit_chance': '85%',
	},
	{
		'move': 'Spikes',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Zap Cannon',
		'damage': 120,
		'hit_chance': '50%',
	},
	{
		'move': 'Foresight',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Perish Song',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Icy Wind',
		'damage': 55,
		'hit_chance': '95%',
	},
	{
		'move': 'Bone Rush',
		'damage': 25,
		'hit_chance': '90%',
	},
	{
		'move': 'Lock-On',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Outrage',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Sandstorm',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Giga Drain',
		'damage': 75,
		'hit_chance': '100%',
	},
	{
		'move': 'Charm',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Rollout',
		'damage': 30,
		'hit_chance': '90%',
	},
	{
		'move': 'False Swipe',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Swagger',
		'damage': '—',
		'hit_chance': '85%',
	},
	{
		'move': 'Milk Drink',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Spark',
		'damage': 65,
		'hit_chance': '100%',
	},
	{
		'move': 'Fury Cutter',
		'damage': 40,
		'hit_chance': '95%',
	},
	{
		'move': 'Steel Wing',
		'damage': 70,
		'hit_chance': '90%',
	},
	{
		'move': 'Mean Look',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Attract',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Heal Bell',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Return',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Present',
		'damage': '—',
		'hit_chance': '90%',
	},
	{
		'move': 'Frustration',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Safeguard',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Pain Split',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Sacred Fire',
		'damage': 100,
		'hit_chance': '95%',
	},
	{
		'move': 'Magnitude',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Dynamic Punch',
		'damage': 100,
		'hit_chance': '50%',
	},
	{
		'move': 'Megahorn',
		'damage': 120,
		'hit_chance': '85%',
	},
	{
		'move': 'Dragon Breath',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Baton Pass',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Encore',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Pursuit',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Rapid Spin',
		'damage': 50,
		'hit_chance': '100%',
	},
	{
		'move': 'Sweet Scent',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Iron Tail',
		'damage': 100,
		'hit_chance': '75%',
	},
	{
		'move': 'Metal Claw',
		'damage': 50,
		'hit_chance': '95%',
	},
	{
		'move': 'Vital Throw',
		'damage': 70,
		'hit_chance': '—%',
	},
	{
		'move': 'Morning Sun',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Synthesis',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Moonlight',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Hidden Power',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Cross Chop',
		'damage': 100,
		'hit_chance': '80%',
	},
	{
		'move': 'Twister',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Rain Dance',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Sunny Day',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Crunch',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Psych Up',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Extreme Speed',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Ancient Power',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Shadow Ball',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Future Sight',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Rock Smash',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Whirlpool',
		'damage': 35,
		'hit_chance': '85%',
	},
	{
		'move': 'Beat Up',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Fake Out',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Uproar',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Stockpile',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Spit Up',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Swallow',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Heat Wave',
		'damage': 95,
		'hit_chance': '90%',
	},
	{
		'move': 'Hail',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Torment',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Flatter',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Will-O-Wisp',
		'damage': '—',
		'hit_chance': '85%',
	},
	{
		'move': 'Memento',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Facade',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Smelling Salts',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Charge',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Taunt',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Role Play',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Wish',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Ingrain',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Superpower',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Magic Coat',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Recycle',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Revenge',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Brick Break',
		'damage': 75,
		'hit_chance': '100%',
	},
	{
		'move': 'Yawn',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Knock Off',
		'damage': 65,
		'hit_chance': '100%',
	},
	{
		'move': 'Endeavor',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Eruption',
		'damage': 150,
		'hit_chance': '100%',
	},
	{
		'move': 'Skill Swap',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Imprison',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Refresh',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Grudge',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Secret Power',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Dive',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Arm Thrust',
		'damage': 15,
		'hit_chance': '100%',
	},
	{
		'move': 'Camouflage',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Tail Glow',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Luster Purge',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Mist Ball',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Feather Dance',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Teeter Dance',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Blaze Kick',
		'damage': 85,
		'hit_chance': '90%',
	},
	{
		'move': 'Mud Sport',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Ice Ball',
		'damage': 30,
		'hit_chance': '90%',
	},
	{
		'move': 'Needle Arm',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Slack Off',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Hyper Voice',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Poison Fang',
		'damage': 50,
		'hit_chance': '100%',
	},
	{
		'move': 'Crush Claw',
		'damage': 75,
		'hit_chance': '95%',
	},
	{
		'move': 'Blast Burn',
		'damage': 150,
		'hit_chance': '90%',
	},
	{
		'move': 'Hydro Cannon',
		'damage': 150,
		'hit_chance': '90%',
	},
	{
		'move': 'Meteor Mash',
		'damage': 90,
		'hit_chance': '90%',
	},
	{
		'move': 'Astonish',
		'damage': 30,
		'hit_chance': '100%',
	},
	{
		'move': 'Weather Ball',
		'damage': 50,
		'hit_chance': '100%',
	},
	{
		'move': 'Aromatherapy',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Fake Tears',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Air Cutter',
		'damage': 60,
		'hit_chance': '95%',
	},
	{
		'move': 'Overheat',
		'damage': 130,
		'hit_chance': '90%',
	},
	{
		'move': 'Odor Sleuth',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Rock Tomb',
		'damage': 60,
		'hit_chance': '95%',
	},
	{
		'move': 'Silver Wind',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Metal Sound',
		'damage': '—',
		'hit_chance': '85%',
	},
	{
		'move': 'Grass Whistle',
		'damage': '—',
		'hit_chance': '55%',
	},
	{
		'move': 'Tickle',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Cosmic Power',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Water Spout',
		'damage': 150,
		'hit_chance': '100%',
	},
	{
		'move': 'Signal Beam',
		'damage': 75,
		'hit_chance': '100%',
	},
	{
		'move': 'Shadow Punch',
		'damage': 60,
		'hit_chance': '—%',
	},
	{
		'move': 'Extrasensory',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Sky Uppercut',
		'damage': 85,
		'hit_chance': '90%',
	},
	{
		'move': 'Sand Tomb',
		'damage': 35,
		'hit_chance': '85%',
	},
	{
		'move': 'Sheer Cold',
		'damage': '—',
		'hit_chance': '30%',
	},
	{
		'move': 'Muddy Water',
		'damage': 90,
		'hit_chance': '85%',
	},
	{
		'move': 'Bullet Seed',
		'damage': 25,
		'hit_chance': '100%',
	},
	{
		'move': 'Aerial Ace',
		'damage': 60,
		'hit_chance': '—',
	},
	{
		'move': 'Icicle Spear',
		'damage': 25,
		'hit_chance': '100%',
	},
	{
		'move': 'Iron Defense',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Block',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Howl',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Dragon Claw',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Frenzy Plant',
		'damage': 150,
		'hit_chance': '90%',
	},
	{
		'move': 'Bulk Up',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Bounce',
		'damage': 85,
		'hit_chance': '85%',
	},
	{
		'move': 'Mud Shot',
		'damage': 55,
		'hit_chance': '95%',
	},
	{
		'move': 'Poison Tail',
		'damage': 50,
		'hit_chance': '100%',
	},
	{
		'move': 'Volt Tackle',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Magical Leaf',
		'damage': 60,
		'hit_chance': '—%',
	},
	{
		'move': 'Water Sport',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Calm Mind',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Leaf Blade',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Dragon Dance',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Rock Blast',
		'damage': 25,
		'hit_chance': '90%',
	},
	{
		'move': 'Shock Wave',
		'damage': 60,
		'hit_chance': '—%',
	},
	{
		'move': 'Water Pulse',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Doom Desire',
		'damage': 140,
		'hit_chance': '100%',
	},
	{
		'move': 'Psycho Boost',
		'damage': 140,
		'hit_chance': '90%',
	},
	{
		'move': 'Roost',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Gravity',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Miracle Eye',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Wake-Up Slap',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Hammer Arm',
		'damage': 100,
		'hit_chance': '90%',
	},
	{
		'move': 'Gyro Ball',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Healing Wish',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Brine',
		'damage': 65,
		'hit_chance': '100%',
	},
	{
		'move': 'Natural Gift',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Pluck',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Tailwind',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Acupressure',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Metal Burst',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'U-turn',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Close Combat',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Payback',
		'damage': 50,
		'hit_chance': '100%',
	},
	{
		'move': 'Assurance',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Embargo',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Fling',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Psycho Shift',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Trump Card',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Heal Block',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Wring Out',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Power Trick',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Gastro Acid',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Lucky Chant',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Power Swap',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Guard Swap',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Punishment',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Last Resort',
		'damage': 140,
		'hit_chance': '100%',
	},
	{
		'move': 'Worry Seed',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Sucker Punch',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Toxic Spikes',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Heart Swap',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Aqua Ring',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Magnet Rise',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Flare Blitz',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Force Palm',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Aura Sphere',
		'damage': 80,
		'hit_chance': '—',
	},
	{
		'move': 'Rock Polish',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Poison Jab',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Dark Pulse',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Night Slash',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Aqua Tail',
		'damage': 90,
		'hit_chance': '90%',
	},
	{
		'move': 'Seed Bomb',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Air Slash',
		'damage': 75,
		'hit_chance': '95%',
	},
	{
		'move': 'X-Scissor',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Bug Buzz',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Dragon Pulse',
		'damage': 85,
		'hit_chance': '100%',
	},
	{
		'move': 'Dragon Rush',
		'damage': 100,
		'hit_chance': '75%',
	},
	{
		'move': 'Power Gem',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Drain Punch',
		'damage': 75,
		'hit_chance': '100%',
	},
	{
		'move': 'Vacuum Wave',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Focus Blast',
		'damage': 120,
		'hit_chance': '70%',
	},
	{
		'move': 'Energy Ball',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Brave Bird',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Earth Power',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Giga Impact',
		'damage': 150,
		'hit_chance': '90%',
	},
	{
		'move': 'Nasty Plot',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Bullet Punch',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Avalanche',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Ice Shard',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Shadow Claw',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Thunder Fang',
		'damage': 65,
		'hit_chance': '95%',
	},
	{
		'move': 'Ice Fang',
		'damage': 65,
		'hit_chance': '95%',
	},
	{
		'move': 'Fire Fang',
		'damage': 65,
		'hit_chance': '95%',
	},
	{
		'move': 'Shadow Sneak',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Mud Bomb',
		'damage': 65,
		'hit_chance': '85%',
	},
	{
		'move': 'Psycho Cut',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Zen Headbutt',
		'damage': 80,
		'hit_chance': '90%',
	},
	{
		'move': 'Mirror Shot',
		'damage': 65,
		'hit_chance': '85%',
	},
	{
		'move': 'Flash Cannon',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Rock Climb',
		'damage': 90,
		'hit_chance': '85%',
	},
	{
		'move': 'Defog',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Trick Room',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Draco Meteor',
		'damage': 130,
		'hit_chance': '90%',
	},
	{
		'move': 'Discharge',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Lava Plume',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Leaf Storm',
		'damage': 130,
		'hit_chance': '90%',
	},
	{
		'move': 'Power Whip',
		'damage': 120,
		'hit_chance': '85%',
	},
	{
		'move': 'Rock Wrecker',
		'damage': 150,
		'hit_chance': '90%',
	},
	{
		'move': 'Cross Poison',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Gunk Shot',
		'damage': 120,
		'hit_chance': '80%',
	},
	{
		'move': 'Iron Head',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Magnet Bomb',
		'damage': 60,
		'hit_chance': '—',
	},
	{
		'move': 'Stone Edge',
		'damage': 100,
		'hit_chance': '80%',
	},
	{
		'move': 'Captivate',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Stealth Rock',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Grass Knot',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Judgment',
		'damage': 100,
		'hit_chance': '100%',
	},
	{
		'move': 'Bug Bite',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Charge Beam',
		'damage': 50,
		'hit_chance': '90%',
	},
	{
		'move': 'Wood Hammer',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Aqua Jet',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Attack Order',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Defend Order',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Heal Order',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Head Smash',
		'damage': 150,
		'hit_chance': '80%',
	},
	{
		'move': 'Double Hit',
		'damage': 35,
		'hit_chance': '90%',
	},
	{
		'move': 'Roar of Time',
		'damage': 150,
		'hit_chance': '90%',
	},
	{
		'move': 'Spacial Rend',
		'damage': 100,
		'hit_chance': '95%',
	},
	{
		'move': 'Lunar Dance',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Crush Grip',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Magma Storm',
		'damage': 100,
		'hit_chance': '75%',
	},
	{
		'move': 'Dark Void',
		'damage': '—',
		'hit_chance': '50%',
	},
	{
		'move': 'Seed Flare',
		'damage': 120,
		'hit_chance': '85%',
	},
	{
		'move': 'Ominous Wind',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Shadow Force',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Hone Claws',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Guard Split',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Power Split',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Wonder Room',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Psyshock',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Venoshock',
		'damage': 65,
		'hit_chance': '100%',
	},
	{
		'move': 'Autotomize',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Telekinesis',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Magic Room',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Smack Down',
		'damage': 50,
		'hit_chance': '100%',
	},
	{
		'move': 'Storm Throw',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Flame Burst',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Sludge Wave',
		'damage': 95,
		'hit_chance': '100%',
	},
	{
		'move': 'Quiver Dance',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Heavy Slam',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Synchronoise',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Electro Ball',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Soak',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Flame Charge',
		'damage': 50,
		'hit_chance': '100%',
	},
	{
		'move': 'Coil',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Low Sweep',
		'damage': 65,
		'hit_chance': '100%',
	},
	{
		'move': 'Acid Spray',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Foul Play',
		'damage': 95,
		'hit_chance': '100%',
	},
	{
		'move': 'Simple Beam',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Entrainment',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Round',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Echoed Voice',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Chip Away',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Clear Smog',
		'damage': 50,
		'hit_chance': '—%',
	},
	{
		'move': 'Stored Power',
		'damage': 20,
		'hit_chance': '100%',
	},
	{
		'move': 'Ally Switch',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Scald',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Shell Smash',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Heal Pulse',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Hex',
		'damage': 65,
		'hit_chance': '100%',
	},
	{
		'move': 'Sky Drop',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Shift Gear',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Circle Throw',
		'damage': 60,
		'hit_chance': '90%',
	},
	{
		'move': 'Incinerate',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Acrobatics',
		'damage': 55,
		'hit_chance': '100%',
	},
	{
		'move': 'Reflect Type',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Retaliate',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Final Gambit',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Inferno',
		'damage': 100,
		'hit_chance': '50%',
	},
	{
		'move': 'Water Pledge',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Fire Pledge',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Grass Pledge',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Volt Switch',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Struggle Bug',
		'damage': 50,
		'hit_chance': '100%',
	},
	{
		'move': 'Bulldoze',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Frost Breath',
		'damage': 60,
		'hit_chance': '90%',
	},
	{
		'move': 'Dragon Tail',
		'damage': 60,
		'hit_chance': '90%',
	},
	{
		'move': 'Work Up',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Electroweb',
		'damage': 55,
		'hit_chance': '95%',
	},
	{
		'move': 'Wild Charge',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Drill Run',
		'damage': 80,
		'hit_chance': '95%',
	},
	{
		'move': 'Dual Chop',
		'damage': 40,
		'hit_chance': '90%',
	},
	{
		'move': 'Heart Stamp',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Horn Leech',
		'damage': 75,
		'hit_chance': '100%',
	},
	{
		'move': 'Sacred Sword',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Razor Shell',
		'damage': 75,
		'hit_chance': '95%',
	},
	{
		'move': 'Heat Crash',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Leaf Tornado',
		'damage': 65,
		'hit_chance': '90%',
	},
	{
		'move': 'Steamroller',
		'damage': 65,
		'hit_chance': '100%',
	},
	{
		'move': 'Cotton Guard',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Night Daze',
		'damage': 85,
		'hit_chance': '95%',
	},
	{
		'move': 'Psystrike',
		'damage': 100,
		'hit_chance': '100%',
	},
	{
		'move': 'Tail Slap',
		'damage': 25,
		'hit_chance': '85%',
	},
	{
		'move': 'Hurricane',
		'damage': 110,
		'hit_chance': '70%',
	},
	{
		'move': 'Head Charge',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Gear Grind',
		'damage': 50,
		'hit_chance': '85%',
	},
	{
		'move': 'Searing Shot',
		'damage': 100,
		'hit_chance': '100%',
	},
	{
		'move': 'Glaciate',
		'damage': 65,
		'hit_chance': '95%',
	},
	{
		'move': 'Bolt Strike',
		'damage': 130,
		'hit_chance': '85%',
	},
	{
		'move': 'Blue Flare',
		'damage': 130,
		'hit_chance': '85%',
	},
	{
		'move': 'Fiery Dance',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Icicle Crash',
		'damage': 85,
		'hit_chance': '90%',
	},
	{
		'move': 'Fusion Flare',
		'damage': 100,
		'hit_chance': '100%',
	},
	{
		'move': 'Fusion Bolt',
		'damage': 100,
		'hit_chance': '100%',
	},
	{
		'move': 'Flying Press',
		'damage': 100,
		'hit_chance': '95%',
	},
	{
		'move': 'Rototiller',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Sticky Web',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Fell Stinger',
		'damage': 50,
		'hit_chance': '100%',
	},
	{
		'move': 'Phantom Force',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Trick-or-Treat',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Noble Roar',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Ion Deluge',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Parabolic Charge',
		'damage': 65,
		'hit_chance': '100%',
	},
	{
		'move': 'Forest\'s Curse',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Petal Blizzard',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Freeze-Dry',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Disarming Voice',
		'damage': 40,
		'hit_chance': '—%',
	},
	{
		'move': 'Parting Shot',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Topsy-Turvy',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Draining Kiss',
		'damage': 50,
		'hit_chance': '100%',
	},
	{
		'move': 'Flower Shield',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Grassy Terrain',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Misty Terrain',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Electrify',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Play Rough',
		'damage': 90,
		'hit_chance': '90%',
	},
	{
		'move': 'Fairy Wind',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Moonblast',
		'damage': 95,
		'hit_chance': '100%',
	},
	{
		'move': 'Boomburst',
		'damage': 140,
		'hit_chance': '100%',
	},
	{
		'move': 'Fairy Lock',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Play Nice',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Confide',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Water Shuriken',
		'damage': 15,
		'hit_chance': '100%',
	},
	{
		'move': 'Mystical Fire',
		'damage': 75,
		'hit_chance': '100%',
	},
	{
		'move': 'Aromatic Mist',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Eerie Impulse',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Venom Drench',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Powder',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Geomancy',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Magnetic Flux',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Happy Hour',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Electric Terrain',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Dazzling Gleam',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Baby-Doll Eyes',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Nuzzle',
		'damage': 20,
		'hit_chance': '100%',
	},
	{
		'move': 'Hold Back',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Infestation',
		'damage': 20,
		'hit_chance': '100%',
	},
	{
		'move': 'Power-Up Punch',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Oblivion Wing',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Land\'s Wrath',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Catastropika',
		'damage': 210,
		'hit_chance': '—%',
	},
	{
		'move': 'Shore Up',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'First Impression',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Spirit Shackle',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Darkest Lariat',
		'damage': 85,
		'hit_chance': '100%',
	},
	{
		'move': 'Sparkling Aria',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Ice Hammer',
		'damage': 100,
		'hit_chance': '90%',
	},
	{
		'move': 'Floral Healing',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'High Horsepower',
		'damage': 95,
		'hit_chance': '95%',
	},
	{
		'move': 'Strength Sap',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Solar Blade',
		'damage': 125,
		'hit_chance': '100%',
	},
	{
		'move': 'Leafage',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Toxic Thread',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Laser Focus',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Gear Up',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Throat Chop',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Pollen Puff',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Anchor Shot',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Psychic Terrain',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Lunge',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Fire Lash',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Power Trip',
		'damage': 20,
		'hit_chance': '100%',
	},
	{
		'move': 'Burn Up',
		'damage': 130,
		'hit_chance': '100%',
	},
	{
		'move': 'Speed Swap',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Smart Strike',
		'damage': 70,
		'hit_chance': '—%',
	},
	{
		'move': 'Purify',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Revelation Dance',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Core Enforcer',
		'damage': 100,
		'hit_chance': '100%',
	},
	{
		'move': 'Trop Kick',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Clanging Scales',
		'damage': 110,
		'hit_chance': '100%',
	},
	{
		'move': 'Dragon Hammer',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Brutal Swing',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Aurora Veil',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Sinister Arrow Raid',
		'damage': 180,
		'hit_chance': '—%',
	},
	{
		'move': 'Malicious Moonsault',
		'damage': 180,
		'hit_chance': '—%',
	},
	{
		'move': 'Oceanic Operetta',
		'damage': 195,
		'hit_chance': '—%',
	},
	{
		'move': 'Guardian of Alola',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Soul-Stealing 7-Star Strike',
		'damage': 195,
		'hit_chance': '—%',
	},
	{
		'move': 'Stoked Sparksurfer',
		'damage': 175,
		'hit_chance': '—%',
	},
	{
		'move': 'Pulverizing Pancake',
		'damage': 210,
		'hit_chance': '—%',
	},
	{
		'move': 'Extreme Evoboost',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Genesis Supernova',
		'damage': 185,
		'hit_chance': '—%',
	},
	{
		'move': 'Psychic Fangs',
		'damage': 85,
		'hit_chance': '100%',
	},
	{
		'move': 'Stomping Tantrum',
		'damage': 75,
		'hit_chance': '100%',
	},
	{
		'move': 'Shadow Bone',
		'damage': 85,
		'hit_chance': '100%',
	},
	{
		'move': 'Accelerock',
		'damage': 40,
		'hit_chance': '100%',
	},
	{
		'move': 'Liquidation',
		'damage': 85,
		'hit_chance': '100%',
	},
	{
		'move': 'Prismatic Laser',
		'damage': 160,
		'hit_chance': '100%',
	},
	{
		'move': 'Tearful Look',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Zing Zap',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Multi-Attack',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Light That Burns the Sky',
		'damage': 200,
		'hit_chance': '—%',
	},
	{
		'move': 'Searing Sunraze Smash',
		'damage': 200,
		'hit_chance': '—%',
	},
	{
		'move': 'Menacing Moonraze Maelstrom',
		'damage': 200,
		'hit_chance': '—%',
	},
	{
		'move': 'Let\'s Snuggle Forever',
		'damage': 190,
		'hit_chance': '—%',
	},
	{
		'move': 'Splintered Stormshards',
		'damage': 190,
		'hit_chance': '—%',
	},
	{
		'move': 'Clangorous Soulblaze',
		'damage': 185,
		'hit_chance': '—%',
	},
	{
		'move': 'Zippy Zap',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Splishy Splash',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Floaty Fall',
		'damage': 90,
		'hit_chance': '95%',
	},
	{
		'move': 'Pika Papow',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Bouncy Bubble',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Buzzy Buzz',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Sizzly Slide',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Glitzy Glow',
		'damage': 80,
		'hit_chance': '95%',
	},
	{
		'move': 'Baddy Bad',
		'damage': 80,
		'hit_chance': '95%',
	},
	{
		'move': 'Sappy Seed',
		'damage': 100,
		'hit_chance': '90%',
	},
	{
		'move': 'Freezy Frost',
		'damage': 100,
		'hit_chance': '90%',
	},
	{
		'move': 'Sparkly Swirl',
		'damage': 120,
		'hit_chance': '85%',
	},
	{
		'move': 'Veevee Volley',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Guard',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Snipe Shot',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Jaw Lock',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Stuff Cheeks',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'No Retreat',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Tar Shot',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Magic Powder',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Dragon Darts',
		'damage': 50,
		'hit_chance': '100%',
	},
	{
		'move': 'Teatime',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Octolock',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Bolt Beak',
		'damage': 85,
		'hit_chance': '100%',
	},
	{
		'move': 'Fishious Rend',
		'damage': 85,
		'hit_chance': '100%',
	},
	{
		'move': 'Court Change',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Max Flare',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Flutterby',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Lightning',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Strike',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Knuckle',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Phantasm',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Hailstorm',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Ooze',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Geyser',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Airstream',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Starfall',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Wyrmwind',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Mindstorm',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Rockfall',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Quake',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Darkness',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Overgrowth',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Max Steelspike',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Expanding Force',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Steel Roller',
		'damage': 130,
		'hit_chance': '100%',
	},
	{
		'move': 'Scale Shot',
		'damage': 25,
		'hit_chance': '90%',
	},
	{
		'move': 'Meteor Beam',
		'damage': 120,
		'hit_chance': '90%',
	},
	{
		'move': 'Shell Side Arm',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Misty Explosion',
		'damage': 100,
		'hit_chance': '100%',
	},
	{
		'move': 'Grassy Glide',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Rising Voltage',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Terrain Pulse',
		'damage': 50,
		'hit_chance': '100%',
	},
	{
		'move': 'Skitter Smack',
		'damage': 70,
		'hit_chance': '90%',
	},
	{
		'move': 'Burning Jealousy',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Lash Out',
		'damage': 75,
		'hit_chance': '100%',
	},
	{
		'move': 'Poltergeist',
		'damage': 110,
		'hit_chance': '90%',
	},
	{
		'move': 'Corrosive Gas',
		'damage': '—',
		'hit_chance': '100%',
	},
	{
		'move': 'Coaching',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Flip Turn',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Triple Axel',
		'damage': 20,
		'hit_chance': '90%',
	},
	{
		'move': 'Dual Wingbeat',
		'damage': 40,
		'hit_chance': '90%',
	},
	{
		'move': 'Scorching Sands',
		'damage': 70,
		'hit_chance': '100%',
	},
	{
		'move': 'Eerie Spell',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Dire Claw',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Psyshield Bash',
		'damage': 70,
		'hit_chance': '90%',
	},
	{
		'move': 'Stone Axe',
		'damage': 65,
		'hit_chance': '90%',
	},
	{
		'move': 'Springtide Storm',
		'damage': 100,
		'hit_chance': '80%',
	},
	{
		'move': 'Mystical Power',
		'damage': 70,
		'hit_chance': '90%',
	},
	{
		'move': 'Wave Crash',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Chloroblast',
		'damage': 150,
		'hit_chance': '95%',
	},
	{
		'move': 'Mountain Gale',
		'damage': 100,
		'hit_chance': '85%',
	},
	{
		'move': 'Victory Dance',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Headlong Rush',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Barb Barrage',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Esper Wing',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Bitter Malice',
		'damage': 75,
		'hit_chance': '100%',
	},
	{
		'move': 'Shelter',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Triple Arrows',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Infernal Parade',
		'damage': 60,
		'hit_chance': '100%',
	},
	{
		'move': 'Ceaseless Edge',
		'damage': 65,
		'hit_chance': '90%',
	},
	{
		'move': 'Bleakwind Storm',
		'damage': 100,
		'hit_chance': '80%',
	},
	{
		'move': 'Wildbolt Storm',
		'damage': 100,
		'hit_chance': '80%',
	},
	{
		'move': 'Sandsear Storm',
		'damage': 100,
		'hit_chance': '80%',
	},
	{
		'move': 'Lunar Blessing',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Take Heart',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Tera Blast',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Silk Trap',
		'damage': '—',
		'hit_chance': '—%',
	},
	{
		'move': 'Axe Kick',
		'damage': 120,
		'hit_chance': '90%',
	},
	{
		'move': 'Last Respects',
		'damage': 50,
		'hit_chance': '100%',
	},
	{
		'move': 'Lumina Crash',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Spin Out',
		'damage': 100,
		'hit_chance': '100%',
	},
	{
		'move': 'Ice Spinner',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Glaive Rush',
		'damage': 120,
		'hit_chance': '100%',
	},
	{
		'move': 'Triple Dive',
		'damage': 30,
		'hit_chance': '95%',
	},
	{
		'move': 'Mortal Spin',
		'damage': 30,
		'hit_chance': '100%',
	},
	{
		'move': 'Kowtow Cleave',
		'damage': 85,
		'hit_chance': '—%',
	},
	{
		'move': 'Flower Trick',
		'damage': 70,
		'hit_chance': '—%',
	},
	{
		'move': 'Torch Song',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Aqua Step',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Psyblade',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Hydro Steam',
		'damage': 80,
		'hit_chance': '100%',
	},
	{
		'move': 'Collision Course',
		'damage': 100,
		'hit_chance': '100%',
	},
	{
		'move': 'Bitter Blade',
		'damage': 90,
		'hit_chance': '100%',
	},
	{
		'move': 'Gigaton Hammer',
		'damage': 160,
		'hit_chance': '100%',
	},
	{
		'move': 'Aqua Cutter',
		'damage': 70,
		'hit_chance': '100%',
	},
];

// mymodule.js
module.exports = {
	content: function() {
		return moves;
	},
};