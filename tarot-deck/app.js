/**
 * Interactive Rider–Waite–Smith Tarot Deck
 */
const CARDS = [
  {
    "id": "ar00",
    "name": "The Fool",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar00.jpg",
    "upright": "A soft yes from the universe to begin before you feel fully ready. Fresh eyes, open road, and a willingness to learn as you go. Trust the spark that says \"why not?\" — curiosity is your compass today.",
    "reversed": "Something in you is pausing at the edge — hesitation, second-guessing, or fear of looking foolish. You don't need a perfect plan; you need a kinder first step. Recklessness and freeze are both invitations to come back to center.",
    "sitWith": "Where would a little playful courage change the weather of your day?"
  },
  {
    "id": "ar01",
    "name": "The Magician",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar01.jpg",
    "upright": "You already hold the tools — focus, voice, craft, and will. Channel your energy into one clear intention and watch scattered potential become something real. This is a moment to act with presence, not to wait for more proof.",
    "reversed": "Talent without direction can feel like static. Are you over-controlling the outcome, or underusing gifts you already have? Soften the grip, pick one true aim, and let skill meet sincerity.",
    "sitWith": "What single intention deserves your full attention right now?"
  },
  {
    "id": "ar02",
    "name": "The High Priestess",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar02.jpg",
    "upright": "Quiet knowing is speaking beneath the noise. Listen inward; dreams, hunches, and subtle body cues carry guidance. You don't have to explain yourself yet — protect the mystery while it ripens.",
    "reversed": "Secrets, ignored intuition, or information overload may be clouding your inner signal. Something wants to surface. Create stillness long enough to hear what you've been talking over.",
    "sitWith": "What does your quieter self know that your busy mind keeps interrupting?"
  },
  {
    "id": "ar03",
    "name": "The Empress",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar03.jpg",
    "upright": "Abundance shows up as beauty, care, creativity, and nurturance — of people, projects, and yourself. Let life be sensual and generative. Growth thrives when you feed what you love.",
    "reversed": "Creative block, depletion, or overgiving may be draining the garden. Reclaim pleasure that doesn't require productivity. What needs watering — and what needs a gentle no?",
    "sitWith": "How can you nourish yourself as generously as you nourish others?"
  },
  {
    "id": "ar04",
    "name": "The Emperor",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar04.jpg",
    "upright": "Structure can be loving. Boundaries, leadership, and steady presence create safety for what matters. Build the container — habits, plans, clear roles — so your vision has somewhere to live.",
    "reversed": "Rigidity, control, or crumbling authority may be in play. Soften where you've become a fortress, or reclaim agency where you've handed it away. True strength flexes.",
    "sitWith": "Where would kinder structure support you better than force?"
  },
  {
    "id": "ar05",
    "name": "The Hierophant",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar05.jpg",
    "upright": "Tradition, mentorship, and shared values can root you. Seek wise counsel or honor a practice that steadies your spirit. Belonging doesn't mean abandoning yourself — it means finding a path walked with integrity.",
    "reversed": "Question inherited beliefs that no longer fit. Dogma, group pressure, or blind rebellion both miss the point. What teaching still resonates — and what are you ready to outgrow?",
    "sitWith": "Which belief are you ready to keep, and which are you ready to release?"
  },
  {
    "id": "ar06",
    "name": "The Lovers",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar06.jpg",
    "upright": "A meaningful choice of the heart is near — relationship, values alignment, or a path that feels like home. Love asks for honesty and mutual seeing. Choose what reflects who you are becoming.",
    "reversed": "Misalignment, indecision, or a values clash may be pulling you apart inside. Name what you truly want. Harmony returns when choice and conscience shake hands.",
    "sitWith": "What choice would make your inner life feel more whole?"
  },
  {
    "id": "ar07",
    "name": "The Chariot",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar07.jpg",
    "upright": "Will and direction are aligned — harness your drive and move. Victory comes through focus, discipline, and emotional steadiness, not brute force alone. You can steer this.",
    "reversed": "Scattered aims or an inner tug-of-war may be stalling progress. Reclaim the reins: clarify the destination, then drive with calm confidence. Aggression and drift both lose the road.",
    "sitWith": "If you held the reins with quiet confidence, where would you go first?"
  },
  {
    "id": "ar08",
    "name": "Strength",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar08.jpg",
    "upright": "Courage here is gentle and fierce at once. Meet intensity — yours or someone else's — with compassion rather than domination. Soft power tames what hard force cannot.",
    "reversed": "Self-doubt, harshness, or suppressed instinct may be wearing you down. You are stronger than the story of fragility. Practice patience with your own wildness.",
    "sitWith": "Where can tenderness become your bravest form of strength?"
  },
  {
    "id": "ar09",
    "name": "The Hermit",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar09.jpg",
    "upright": "Solitude is medicine. Step back to hear your own wisdom without the crowd's echo. Insight grows in quiet rooms and slow walks. You have a lantern — trust its small light.",
    "reversed": "Isolation has tipped into loneliness, or you're avoiding needed withdrawal. Balance retreat with honest connection. Wisdom wants company eventually — but first, befriend yourself.",
    "sitWith": "What truth becomes clearer when you give yourself honest alone time?"
  },
  {
    "id": "ar10",
    "name": "Wheel of Fortune",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar10.jpg",
    "upright": "Cycles turn. Luck, timing, and change are in motion — what felt stuck may shift. Stay awake to synchronicity and ride the wheel with humility. This too is part of a larger pattern.",
    "reversed": "Resistance to change, a run of friction, or clinging to old luck may be the lesson. You can't freeze the wheel — but you can choose how you meet the turn.",
    "sitWith": "What cycle is ending, and what new season might already be arriving?"
  },
  {
    "id": "ar11",
    "name": "Justice",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar11.jpg",
    "upright": "Truth, fairness, and accountability ask for your clear eye. Weigh options without self-betrayal. Cause and effect are visible now — act in a way you can stand beside later.",
    "reversed": "Injustice, bias, or avoidance of responsibility may be clouding judgment — yours or another's. Recalibrate. Fairness starts with telling yourself the truth.",
    "sitWith": "What would a fair and kind verdict look like in this situation?"
  },
  {
    "id": "ar12",
    "name": "The Hanged Man",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar12.jpg",
    "upright": "Surrender is not defeat — it's a different vantage. Pause, release control, and let a new perspective arrive. Sometimes the wisest move is to hang upside down and see.",
    "reversed": "Stalling, martyrdom, or useless sacrifice may be draining you. Distinguish sacred pause from stuckness. What are you ready to release so life can move again?",
    "sitWith": "What happens if you stop pushing and simply look from another angle?"
  },
  {
    "id": "ar13",
    "name": "Death",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar13.jpg",
    "upright": "An ending clears ground for what wants to grow. Transformation can feel sharp, yet it is natural. Honor what is complete so the next chapter has room to breathe.",
    "reversed": "Fear of change or clinging to a ghost of the past may prolong the ache. Something is already over — grieving it fully is how you walk forward.",
    "sitWith": "What are you being invited to release so something truer can begin?"
  },
  {
    "id": "ar14",
    "name": "Temperance",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar14.jpg",
    "upright": "Blend, balance, and patience. Mix opposing needs into something livable — work and rest, fire and water, self and other. Healing often looks like steady middle paths, not extremes.",
    "reversed": "Imbalance, excess, or forced compromise may be fraying you. Restore proportion. Temperance asks for honest alchemy, not people-pleasing dilution.",
    "sitWith": "Which two parts of your life are ready to cooperate instead of compete?"
  },
  {
    "id": "ar15",
    "name": "The Devil",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar15.jpg",
    "upright": "Name the chain — habit, desire, fear, or golden cage — that keeps you circling. Awareness is the first freedom. Shadow work here is honest, not shameful.",
    "reversed": "A release from bondage is possible: breaking a pattern, reclaiming power, or seeing through illusion. You can walk out of the cave carrying what you learned.",
    "sitWith": "What attachment still feels like comfort but costs you your freedom?"
  },
  {
    "id": "ar16",
    "name": "The Tower",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar16.jpg",
    "upright": "Sudden truth, upheaval, or a breakthrough that rattles the walls. What was unstable reveals itself. After the shock, rebuild on something real. Liberation often arrives loud.",
    "reversed": "Delayed collapse, fear of upheaval, or clinging to a cracked structure. Soften the landing by telling the truth before life does it for you.",
    "sitWith": "What false foundation is ready to fall so you can stand on solid ground?"
  },
  {
    "id": "ar17",
    "name": "The Star",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar17.jpg",
    "upright": "Hope returns like clean water after a long night. Healing, inspiration, and quiet faith are available. You are not alone under this sky — keep going, gently.",
    "reversed": "Discouragement or lost faith may dim your light. Reconnect to small beauty and honest rest. The stars are still there; clouds are temporary.",
    "sitWith": "What small light can you follow when the big answers aren't ready yet?"
  },
  {
    "id": "ar18",
    "name": "The Moon",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar18.jpg",
    "upright": "Dreams, intuition, and uncertainty walk together. Not everything is as it seems — move softly through fog and trust your deeper senses. Mystery is part of the path, not a mistake.",
    "reversed": "Confusion lifts; illusions thin. Anxiety may have been painting shadows larger than life. Name the fear and watch it shrink in daylight.",
    "sitWith": "What fear looks different when you bring it into gentle honesty?"
  },
  {
    "id": "ar19",
    "name": "The Sun",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar19.jpg",
    "upright": "Warmth, clarity, and simple joy. Success that feels like sunshine on your face — vitality, celebration, and being seen. Let yourself shine without apology.",
    "reversed": "Temporary clouds over confidence, delayed success, or difficulty receiving good news. The sun hasn't left; practice letting warmth in again.",
    "sitWith": "Where could you allow more uncomplicated joy into your day?"
  },
  {
    "id": "ar20",
    "name": "Judgement",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar20.jpg",
    "upright": "A wake-up call, reckoning, or deep yes to your next chapter. Hear the call to rise — forgiveness, purpose, and renewal are knocking. Answer with your whole self.",
    "reversed": "Self-doubt, harsh inner judgment, or ignoring a meaningful call. Soften the critic. You are allowed to begin again without a perfect verdict.",
    "sitWith": "What calling have you been half-hearing — and what would answering look like?"
  },
  {
    "id": "ar21",
    "name": "The World",
    "arcana": "major",
    "suit": null,
    "suitSymbol": "✦",
    "img": "img/ar21.jpg",
    "upright": "Completion, integration, belonging to a larger whole. A cycle closes with grace. Celebrate how far you've come — and feel the threshold of the next journey already humming.",
    "reversed": "Almost-there fatigue, loose ends, or resistance to closing a chapter. Finish what matters. Wholeness includes the messy last stitches.",
    "sitWith": "What completion would let you feel proudly, quietly whole?"
  },
  {
    "id": "waac",
    "name": "Ace of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "suitSymbol": "🜂",
    "img": "img/waac.jpg",
    "upright": "A spark of passion, creativity, or courage lands in your hands. Say yes to the living idea. Begin while the fire is warm — inspiration wants motion.",
    "reversed": "Delayed starts, blocked passion, or a false alarm of motivation. Rekindle what still matters, or admit what was only smoke. Fresh fire is available when you clear the ash.",
    "sitWith": "What desire is asking for a brave, imperfect beginning?"
  },
  {
    "id": "wa02",
    "name": "Two of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "suitSymbol": "🜂",
    "img": "img/wa02.jpg",
    "upright": "You stand at a threshold with options and vision. Plan with hope, then choose a direction. The world is wide — pick a horizon and lean toward it.",
    "reversed": "Fear of leaving the familiar, or plans stuck in daydream. Expand gently. You don't need certainty to take the next true step.",
    "sitWith": "Which horizon is quietly calling your name?"
  },
  {
    "id": "wa03",
    "name": "Three of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "suitSymbol": "🜂",
    "img": "img/wa03.jpg",
    "upright": "Your ships are coming in — collaboration, foresight, and progress you can almost taste. Keep watching the water with patient confidence.",
    "reversed": "Delays, scattered effort, or waiting without wisdom. Refine the plan. Growth still wants you; timing may ask for trust.",
    "sitWith": "Where is progress already underway that you haven't fully celebrated?"
  },
  {
    "id": "wa04",
    "name": "Four of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "suitSymbol": "🜂",
    "img": "img/wa04.jpg",
    "upright": "Celebration, homecoming, and shared joy. Pause to honor milestones — yours and theirs. Belonging can feel like a warm room after travel.",
    "reversed": "Restlessness, unstable foundations, or skipping the party. Let yourself receive. Stability grows when you acknowledge what's good.",
    "sitWith": "What small celebration would make this chapter feel real?"
  },
  {
    "id": "wa05",
    "name": "Five of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "suitSymbol": "🜂",
    "img": "img/wa05.jpg",
    "upright": "Creative conflict or competition stirs the pot. Friction isn't always failure — it can clarify what you care about. Stay in the arena with respect.",
    "reversed": "Avoiding necessary conflict, or chaos without purpose. Seek fair play. Channel rivalry into better craft, not sharper edges.",
    "sitWith": "How can you meet tension without abandoning your center?"
  },
  {
    "id": "wa06",
    "name": "Six of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "suitSymbol": "🜂",
    "img": "img/wa06.jpg",
    "upright": "Recognition, progress, and a moment in the sun. Own your wins with humility and pride. Momentum loves acknowledgment.",
    "reversed": "Private victories, delayed praise, or craving validation. Celebrate yourself first. Public applause is nice; self-respect is fuel.",
    "sitWith": "What success deserves a quiet bow from you today?"
  },
  {
    "id": "wa07",
    "name": "Seven of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "suitSymbol": "🜂",
    "img": "img/wa07.jpg",
    "upright": "Defend what you've built. Courage under pressure — stand your ground with conviction, not aggression. You can hold the hill.",
    "reversed": "Feeling overwhelmed or unsure if the fight is yours. Pick your battles. Retreat can be strategy when the cause isn't true.",
    "sitWith": "What is worth protecting — and what can you lay down?"
  },
  {
    "id": "wa08",
    "name": "Eight of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "suitSymbol": "🜂",
    "img": "img/wa08.jpg",
    "upright": "Swift movement, messages, and accelerating change. Say the thing, send the note, catch the wave. Life is picking up speed in your favor.",
    "reversed": "Frustration with delays, scattered haste, or miscommunication. Slow enough to aim. Speed without clarity burns fuel.",
    "sitWith": "What action is ready to move at the speed of now?"
  },
  {
    "id": "wa09",
    "name": "Nine of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "suitSymbol": "🜂",
    "img": "img/wa09.jpg",
    "upright": "Resilience after a long stretch. You're tired and still standing — honor that. Boundaries and stamina will carry you through the last push.",
    "reversed": "Exhaustion tipping into defensiveness or giving up too soon. Rest is part of courage. Ask for help before the wall.",
    "sitWith": "Where do you need rest so your resilience can refill?"
  },
  {
    "id": "wa10",
    "name": "Ten of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "suitSymbol": "🜂",
    "img": "img/wa10.jpg",
    "upright": "Heavy load — responsibility, ambition, or caretaking piled high. You can set some of it down. Strength includes knowing when to share the burden.",
    "reversed": "Release from overwhelm is near. Delegate, decline, or redefine success. Your back is not the only tool you have.",
    "sitWith": "Which weight were you never meant to carry alone?"
  },
  {
    "id": "wapa",
    "name": "Page of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "suitSymbol": "🜂",
    "img": "img/wapa.jpg",
    "upright": "A curious messenger of inspiration. Explore, learn, and play with new creative energy. Beginner's mind is a gift — follow the spark without overthinking.",
    "reversed": "Procrastination, scattered ideas, or fear of looking new. Stay curious anyway. Small experiments beat perfect plans.",
    "sitWith": "What new idea wants a playful first try?"
  },
  {
    "id": "wakn",
    "name": "Knight of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "suitSymbol": "🜂",
    "img": "img/wakn.jpg",
    "upright": "Bold action and adventurous drive. Charge toward what lights you up — with just enough wisdom to aim. Passion in motion is magnetic.",
    "reversed": "Impulsiveness, anger, or stops-and-starts. Temper the horse. Direction matters as much as speed.",
    "sitWith": "Where does courageous action want to replace endless planning?"
  },
  {
    "id": "waqu",
    "name": "Queen of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "suitSymbol": "🜂",
    "img": "img/waqu.jpg",
    "upright": "Warm confidence and creative sovereignty. Lead with passion that includes others. Your fire can comfort and inspire — own it with grace.",
    "reversed": "Insecurity, jealousy, or dampened spark. Reclaim your creative throne. You don't need permission to shine kindly.",
    "sitWith": "How can you lead with warmth without dimming your fire?"
  },
  {
    "id": "waki",
    "name": "King of Wands",
    "arcana": "minor",
    "suit": "Wands",
    "suitSymbol": "🜂",
    "img": "img/waki.jpg",
    "upright": "Visionary leadership and mature will. Direct your energy with purpose and integrity. You know how to turn inspiration into lasting impact.",
    "reversed": "Domineering energy, burnout, or unused authority. Soften the crown. True leadership listens as it guides.",
    "sitWith": "What vision are you ready to steward with mature fire?"
  },
  {
    "id": "cuac",
    "name": "Ace of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "suitSymbol": "🜄",
    "img": "img/cuac.jpg",
    "upright": "A new emotional beginning — love, compassion, or creative flow from the heart. Receive the offering. Soften and let feeling move through you.",
    "reversed": "Emotional block, emptiness, or a cup turned away. Healing starts with acknowledging thirst. Love can refill what went dry.",
    "sitWith": "What feeling is ready to be welcomed without fixing it?"
  },
  {
    "id": "cu02",
    "name": "Two of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "suitSymbol": "🜄",
    "img": "img/cu02.jpg",
    "upright": "Partnership, mutual care, and the sweet chemistry of being seen. Connection thrives on reciprocity. Offer your heart and notice who meets you.",
    "reversed": "Imbalance, breakups, or one-sided giving. Restore equality. You deserve a cup that is filled as it pours.",
    "sitWith": "Where do you feel most mutually met — and where do you long for that?"
  },
  {
    "id": "cu03",
    "name": "Three of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "suitSymbol": "🜄",
    "img": "img/cu03.jpg",
    "upright": "Friendship, celebration, and shared joy. Gather your people. Belonging multiplies when laughter is passed around the table.",
    "reversed": "Overindulgence, gossip, or loneliness in a crowd. Seek authentic company. Quality of connection over quantity of noise.",
    "sitWith": "Who would make your heart lighter if you reached out today?"
  },
  {
    "id": "cu04",
    "name": "Four of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "suitSymbol": "🜄",
    "img": "img/cu04.jpg",
    "upright": "Apathy or contemplation — the cup before you may not look like what you expected. Notice what you're refusing. Gratitude can reopen appetite for life.",
    "reversed": "A new invitation arrives after stagnation. Lift your eyes. Possibility has been waiting just outside the fog.",
    "sitWith": "What opportunity have you been too weary — or too proud — to notice?"
  },
  {
    "id": "cu05",
    "name": "Five of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "suitSymbol": "🜄",
    "img": "img/cu05.jpg",
    "upright": "Grief for what's spilled. Honor the loss without drowning in it. Two cups still stand — hope remains when you're ready to look.",
    "reversed": "Acceptance after disappointment; perspective returns. Forgiveness (of self or other) frees your hands for what remains.",
    "sitWith": "What grief needs witnessing so you can eventually turn toward what remains?"
  },
  {
    "id": "cu06",
    "name": "Six of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "suitSymbol": "🜄",
    "img": "img/cu06.jpg",
    "upright": "Nostalgia, innocence, and kindness from the past. Sweet memories can heal — just don't live only there. Offer simple care to someone (including you).",
    "reversed": "Clinging to then, or rose-colored stories. Bring the gifts of the past into now. Growing up can stay tender.",
    "sitWith": "What gentle gift from your past still wants to live in your present?"
  },
  {
    "id": "cu07",
    "name": "Seven of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "suitSymbol": "🜄",
    "img": "img/cu07.jpg",
    "upright": "Many options shimmer — dreams, fantasies, choices. Discern what is real nourishment versus mirage. Vision is powerful when grounded.",
    "reversed": "Clarity after confusion; illusions drop away. Choose the cup that feeds your actual life, not only your imagination.",
    "sitWith": "Which desire is fantasy — and which is a true hunger?"
  },
  {
    "id": "cu08",
    "name": "Eight of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "suitSymbol": "🜄",
    "img": "img/cu08.jpg",
    "upright": "Walking away from what no longer feeds the soul. Courageous leave-taking toward deeper meaning. The path may feel lonely; it is honest.",
    "reversed": "Fear of leaving, or drifting without purpose. Either stay with renewed commitment or go cleanly. Half-in hurts.",
    "sitWith": "What are you ready to leave so your heart can seek truer water?"
  },
  {
    "id": "cu09",
    "name": "Nine of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "suitSymbol": "🜄",
    "img": "img/cu09.jpg",
    "upright": "Wish fulfillment and emotional satisfaction. Enjoy the good — comfort, contentment, dreams coming true. Receive without guilt.",
    "reversed": "Complacency, greed for more, or wishes that don't satisfy. Check if the dream still fits. Gratitude deepens joy.",
    "sitWith": "What fulfilled wish can you savor without immediately needing the next?"
  },
  {
    "id": "cu10",
    "name": "Ten of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "suitSymbol": "🜄",
    "img": "img/cu10.jpg",
    "upright": "Emotional wholeness, family of choice, and lasting love. Harmony that feels like home. Share the joy — belonging is a living practice.",
    "reversed": "Fractured bonds, idealism about family, or delayed happiness. Heal what you can; redefine home as where you are loved truly.",
    "sitWith": "Where does \"home\" already live in your relationships?"
  },
  {
    "id": "cupa",
    "name": "Page of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "suitSymbol": "🜄",
    "img": "img/cupa.jpg",
    "upright": "A gentle messenger of feeling — curiosity about love, art, or intuition. Stay open and soft. Begin emotional conversations with sincerity.",
    "reversed": "Emotional immaturity, moodiness, or creative block. Be patient with tender beginnings. Feelings are information, not flaws.",
    "sitWith": "What message is your heart trying to deliver in a quiet voice?"
  },
  {
    "id": "cukn",
    "name": "Knight of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "suitSymbol": "🜄",
    "img": "img/cukn.jpg",
    "upright": "Romantic quest and heartfelt pursuit. Follow the feeling with integrity. Offer care, poetry, and presence — then see what returns.",
    "reversed": "Moodiness, unrealistic ideals, or fleeing when things get real. Stay for the ordinary magic. Love includes dishes and doubts.",
    "sitWith": "Where can you bring more sincere, grounded romance to your life?"
  },
  {
    "id": "cuqu",
    "name": "Queen of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "suitSymbol": "🜄",
    "img": "img/cuqu.jpg",
    "upright": "Emotional intelligence and compassionate presence. Hold space — for yourself and others — with intuitive grace. Your empathy is a gift when bounded.",
    "reversed": "Overwhelm from feeling everything, or emotional withdrawal. Soft boundaries protect the heart. Care includes you.",
    "sitWith": "How can you stay open-hearted without abandoning yourself?"
  },
  {
    "id": "cuki",
    "name": "King of Cups",
    "arcana": "minor",
    "suit": "Cups",
    "suitSymbol": "🜄",
    "img": "img/cuki.jpg",
    "upright": "Emotional maturity and calm stewardship of feeling. Lead with empathy and steady wisdom. You can hold deep waters without drowning.",
    "reversed": "Emotional repression, manipulation, or cold control. Let feeling move with dignity. Strength includes tears and warmth.",
    "sitWith": "Where could mature kindness replace either shutdown or storm?"
  },
  {
    "id": "swac",
    "name": "Ace of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "suitSymbol": "🜁",
    "img": "img/swac.jpg",
    "upright": "A clear idea, truth, or breakthrough cuts through fog. Speak and think with precision. Mental clarity is a gift — use it cleanly.",
    "reversed": "Confusion, harsh words, or a truth you're avoiding. Soften the blade. Clarity returns when honesty meets kindness.",
    "sitWith": "What truth is ready to be named without cruelty?"
  },
  {
    "id": "sw02",
    "name": "Two of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "suitSymbol": "🜁",
    "img": "img/sw02.jpg",
    "upright": "A stalemate or difficult choice. Blindfolded balance — you may need more information or inner peace before deciding. Hold both truths gently for now.",
    "reversed": "Indecision breaking open, or information finally arriving. Move when you can see. Avoidance is also a choice.",
    "sitWith": "What decision have you been holding in careful limbo — and why?"
  },
  {
    "id": "sw03",
    "name": "Three of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "suitSymbol": "🜁",
    "img": "img/sw03.jpg",
    "upright": "Heartache, sorrow, or a painful truth. Let yourself feel it; grief is love with nowhere to go for a moment. Healing begins when pain is witnessed.",
    "reversed": "Recovery after heartbreak; the worst edge softens. Forgiveness and perspective are growing. Be gentle with the scar.",
    "sitWith": "What pain needs a safe place to be felt so it can begin to mend?"
  },
  {
    "id": "sw04",
    "name": "Four of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "suitSymbol": "🜁",
    "img": "img/sw04.jpg",
    "upright": "Sacred rest for a busy mind. Retreat, recover, reset. Stillness is productive when you've been fighting too long.",
    "reversed": "Restlessness, burnout ignored, or forced isolation. Choose restorative quiet. Your mind needs a soft bed too.",
    "sitWith": "Where can you grant yourself genuine mental rest today?"
  },
  {
    "id": "sw05",
    "name": "Five of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "suitSymbol": "🜁",
    "img": "img/sw05.jpg",
    "upright": "Hollow victory, conflict, or ego bruises. Winning at what cost? Choose integrity over being right. Walk away from fights that steal your peace.",
    "reversed": "Desire to make amends, or lingering resentment after conflict. Repair is possible. Pride makes poor company.",
    "sitWith": "What would peace ask you to put down — even if you \"won\"?"
  },
  {
    "id": "sw06",
    "name": "Six of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "suitSymbol": "🜁",
    "img": "img/sw06.jpg",
    "upright": "Passage toward calmer waters. Leave troubled shores; healing travel — literal or emotional — is underway. Hope rows with you.",
    "reversed": "Stuck in transition, or resistance to leaving. The boat is ready when you are. Carry only what serves the crossing.",
    "sitWith": "What shore are you ready to leave for quieter waters?"
  },
  {
    "id": "sw07",
    "name": "Seven of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "suitSymbol": "🜁",
    "img": "img/sw07.jpg",
    "upright": "Strategy, stealth, or something not fully above board. Use cleverness ethically — or notice where trust is thin. Not every shortcut serves you.",
    "reversed": "Coming clean, getting caught, or reclaiming what was taken. Integrity rebuilds what cunning erodes. Choose the long game.",
    "sitWith": "Where does cleverness need to bow to honesty?"
  },
  {
    "id": "sw08",
    "name": "Eight of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "suitSymbol": "🜁",
    "img": "img/sw08.jpg",
    "upright": "Feeling trapped by thoughts, fear, or circumstance. Look again — some bindings are beliefs. Small movements free big cages.",
    "reversed": "A way out appears; empowerment returns. Untie one rope at a time. You are less stuck than the story says.",
    "sitWith": "Which thought-prison might open if you questioned its lock?"
  },
  {
    "id": "sw09",
    "name": "Nine of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "suitSymbol": "🜁",
    "img": "img/sw09.jpg",
    "upright": "Anxiety, sleepless worry, or night-mind spirals. You are not your worst midnight story. Reach for support; dawn reframes the dark.",
    "reversed": "Relief after anguish; nightmares lose power in daylight. Practice nervous-system care. Hope is a discipline.",
    "sitWith": "What worry softens when you speak it aloud to someone safe?"
  },
  {
    "id": "sw10",
    "name": "Ten of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "suitSymbol": "🜁",
    "img": "img/sw10.jpg",
    "upright": "An ending that hurts — rock bottom as a strange mercy. The worst has done its work; only up remains. Release what is finished.",
    "reversed": "Survival after collapse; the worst is passing. Ruin was not the whole story. Begin again, softly, with what still lives.",
    "sitWith": "What ending, however painful, might also be a clearing?"
  },
  {
    "id": "swpa",
    "name": "Page of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "suitSymbol": "🜁",
    "img": "img/swpa.jpg",
    "upright": "Curious mind, new ideas, and vigilant learning. Ask sharp questions with soft eyes. Messages and insights arrive — stay alert and kind.",
    "reversed": "Gossip, scattered thoughts, or hasty judgments. Slow the tongue. Curiosity without cruelty is the gift.",
    "sitWith": "What question would open a wiser conversation right now?"
  },
  {
    "id": "swkn",
    "name": "Knight of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "suitSymbol": "🜁",
    "img": "img/swkn.jpg",
    "upright": "Charging intellect and decisive action. Cut through delay with brave clarity — and watch for tunnel vision. Truth with momentum.",
    "reversed": "Harsh words, impulsiveness, or all fight no wisdom. Pull back the lance. Precision beats speed when hearts are involved.",
    "sitWith": "Where does bold honesty need a dose of care before it rides out?"
  },
  {
    "id": "swqu",
    "name": "Queen of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "suitSymbol": "🜁",
    "img": "img/swqu.jpg",
    "upright": "Clear-eyed perception and independent thought. Speak truth with composure. Your discernment protects what matters — stay fair.",
    "reversed": "Coldness, bitterness, or overly critical mind. Warm the blade. Wisdom includes mercy for human mess.",
    "sitWith": "How can you stay truthful without becoming hard?"
  },
  {
    "id": "swki",
    "name": "King of Swords",
    "arcana": "minor",
    "suit": "Swords",
    "suitSymbol": "🜁",
    "img": "img/swki.jpg",
    "upright": "Intellectual authority and ethical judgment. Decide with clarity and fairness. Your mind can serve justice when the heart stays consulted.",
    "reversed": "Tyranny of logic, abuse of power, or cruel \"rationality.\" Temper expertise with humility. Being right isn't the same as being wise.",
    "sitWith": "What decision needs both a clear mind and a humane heart?"
  },
  {
    "id": "peac",
    "name": "Ace of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "suitSymbol": "🜃",
    "img": "img/peac.jpg",
    "upright": "A seed of prosperity — opportunity, body wisdom, or tangible new beginning. Plant it. Practical magic starts with one real step.",
    "reversed": "Missed chance, scarcity mindset, or unstable start. Recheck the soil. Abundance often begins with believing you're allowed to receive.",
    "sitWith": "What practical seed is ready for your hands and attention?"
  },
  {
    "id": "pe02",
    "name": "Two of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "suitSymbol": "🜃",
    "img": "img/pe02.jpg",
    "upright": "Juggling priorities with adaptable grace. Keep dancing — balance is motion, not a freeze-frame. You can handle more than one ball when you stay present.",
    "reversed": "Dropped balls, overcommitment, or rigid plans. Simplify. Flexibility is a form of wealth.",
    "sitWith": "What can you put down so the dance stays joyful?"
  },
  {
    "id": "pe03",
    "name": "Three of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "suitSymbol": "🜃",
    "img": "img/pe03.jpg",
    "upright": "Skilled collaboration and craftsmanship. Teamwork and quality matter. Build something excellent with people who care about the work.",
    "reversed": "Mediocrity, misaligned teammates, or rushed craft. Raise the standard. Pride in process restores meaning.",
    "sitWith": "Where does careful craft want more of your devotion?"
  },
  {
    "id": "pe04",
    "name": "Four of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "suitSymbol": "🜃",
    "img": "img/pe04.jpg",
    "upright": "Holding resources close — security, savings, boundaries. Protect what you've earned; just notice if grasp becomes grip. Stability is sacred when it still allows flow.",
    "reversed": "Greed, fear-based clinging, or sudden openness after scarcity. Practice generous safety. Money and love both need circulation.",
    "sitWith": "What are you holding tightly — and is it still serving you?"
  },
  {
    "id": "pe05",
    "name": "Five of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "suitSymbol": "🜃",
    "img": "img/pe05.jpg",
    "upright": "Hardship, exclusion, or feeling left in the cold. Ask for help; community exists beyond the stained-glass window. Dignity includes receiving.",
    "reversed": "Recovery from struggle; aid arrives or hope returns. You are not alone in the weather. Reach and be reached.",
    "sitWith": "Where could asking for support become an act of courage?"
  },
  {
    "id": "pe06",
    "name": "Six of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "suitSymbol": "🜃",
    "img": "img/pe06.jpg",
    "upright": "Generosity and fair exchange. Give and receive with open hands. Shared resources create dignity on both sides of the gift.",
    "reversed": "Strings-attached giving, debt stress, or imbalance. Clean up the ledger. True generosity respects agency.",
    "sitWith": "How can giving or receiving feel more mutual and clean today?"
  },
  {
    "id": "pe07",
    "name": "Seven of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "suitSymbol": "🜃",
    "img": "img/pe07.jpg",
    "upright": "Patient tending of long-term work. Assess growth without rushing harvest. Your efforts are rooting — trust the timeline of real things.",
    "reversed": "Impatience, poor investment, or doubting the process. Recalibrate and keep showing up. Some fruits ripen slowly on purpose.",
    "sitWith": "What long project deserves your continued, patient care?"
  },
  {
    "id": "pe08",
    "name": "Eight of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "suitSymbol": "🜃",
    "img": "img/pe08.jpg",
    "upright": "Diligence, apprenticeship, and devotion to craft. Show up to the work. Mastery loves quiet, repeated attention.",
    "reversed": "Perfectionism, boredom, or uninspired grind. Rekindle why you began. Skill grows when love meets practice.",
    "sitWith": "What craft is calling for your steady, loving attention?"
  },
  {
    "id": "pe09",
    "name": "Nine of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "suitSymbol": "🜃",
    "img": "img/pe09.jpg",
    "upright": "Self-sufficiency and earned pleasure. Enjoy the fruits of your labor — beauty, comfort, independence. You built this garden.",
    "reversed": "Overwork, isolation in success, or status without satisfaction. Share the harvest. Luxury means little without ease in the body.",
    "sitWith": "How can you enjoy what you've earned without proving anything?"
  },
  {
    "id": "pe10",
    "name": "Ten of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "suitSymbol": "🜃",
    "img": "img/pe10.jpg",
    "upright": "Legacy, lasting wealth, and familial belonging. Stability that outlives a single season. Invest in what will still matter years from now.",
    "reversed": "Family money stress, unstable foundations, or burdened inheritance. Redefine wealth as well-being. Repair the roots.",
    "sitWith": "What kind of legacy — material or emotional — do you want to tend?"
  },
  {
    "id": "pepa",
    "name": "Page of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "suitSymbol": "🜃",
    "img": "img/pepa.jpg",
    "upright": "Student of the material world — new job, study, or body practice. Stay curious and practical. Small consistent steps grow real skill.",
    "reversed": "Procrastination, unfocused goals, or news about money/work delayed. Return to basics. Learning is allowed to be slow.",
    "sitWith": "What earthly skill wants your beginner's enthusiasm?"
  },
  {
    "id": "pekn",
    "name": "Knight of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "suitSymbol": "🜃",
    "img": "img/pekn.jpg",
    "upright": "Steady progress toward tangible goals. Reliable, methodical, trustworthy motion. Keep the pace — consistency beats intensity.",
    "reversed": "Stuck routine, stubbornness, or work without soul. Loosen the schedule enough to breathe. Progress can still be kind.",
    "sitWith": "Where would steady, unglamorous effort move the needle most?"
  },
  {
    "id": "pequ",
    "name": "Queen of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "suitSymbol": "🜃",
    "img": "img/pequ.jpg",
    "upright": "Nurturing abundance and practical care. Create comfort, feed people (including you), and steward resources with warmth. Home is a verb.",
    "reversed": "Smothering care, work-life imbalance, or insecurity about providing. Soften control. Worth isn't measured in output.",
    "sitWith": "How can you make life more beautifully livable this week?"
  },
  {
    "id": "peki",
    "name": "King of Pentacles",
    "arcana": "minor",
    "suit": "Pentacles",
    "suitSymbol": "🜃",
    "img": "img/peki.jpg",
    "upright": "Mastery of resources and grounded leadership. Build, invest, and provide with integrity. Your reliability is a form of love.",
    "reversed": "Materialism, rigid control, or workaholic crown. Remember why you build. Prosperity includes presence.",
    "sitWith": "What does prosperous, ethical leadership look like in your daily life?"
  }
];

const POSITIONS_THREE = [
  { key: "present", label: "Present", blurb: "What is alive for you now" },
  { key: "block", label: "Block", blurb: "What stands in the way" },
  { key: "invitation", label: "Invitation", blurb: "What life is offering next" },
];

const STORAGE_KEY = "tarot-deck-daily-v1";
const REVERSED_CHANCE = 0.35;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const state = {
  mode: "one", // one | three
  deck: [...CARDS],
  drawn: [], // { card, reversed, revealed }
  shuffling: false,
};

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickReversed() {
  return Math.random() < REVERSED_CHANCE;
}

function setStatus(msg) {
  $("#status").textContent = msg || "";
}

function saveDaily(payload) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (_) {}
}

function loadDaily() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.date !== todayKey() || data.mode !== "one") return null;
    return data;
  } catch (_) {
    return null;
  }
}

function clearDaily() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
}

function findCard(id) {
  return CARDS.find((c) => c.id === id);
}

function getActiveSpread() {
  return state.mode === "three" ? $("#spreadThree") : $("#spreadOne");
}

function getSlots() {
  return $$(".card-slot", getActiveSpread());
}

function resetUICards() {
  for (const spread of [$("#spreadOne"), $("#spreadThree")]) {
    spread.hidden = true;
    for (const slot of $$(".card-slot", spread)) {
      const cardEl = $(".card", slot);
      cardEl.classList.remove("flipped", "reversed", "entering");
      const front = $(".card-front", cardEl);
      if (front) {
        front.innerHTML = '<img alt="" /><div class="card-fallback" hidden></div>';
      }
    }
  }
  $("#readings").innerHTML = "";
  $("#deckPile").classList.remove("hidden-pile");
}

function showSpreadShell() {
  $("#deckPile").classList.add("hidden-pile");
  $("#spreadOne").hidden = state.mode !== "one";
  $("#spreadThree").hidden = state.mode !== "three";
}

function wireCardFace(cardEl, drawn) {
  const { card, reversed } = drawn;
  cardEl.classList.toggle("reversed", reversed);
  const front = $(".card-front", cardEl);
  const alt = `${card.name}${reversed ? " (reversed)" : ""}`;
  // Rebuild face contents to avoid stale handlers / empty-src error races
  front.innerHTML = "";
  const img = document.createElement("img");
  img.alt = alt;
  img.decoding = "async";
  img.src = card.img;
  const fb = document.createElement("div");
  fb.className = "card-fallback";
  fb.hidden = true;
  img.onerror = () => {
    img.remove();
    fb.hidden = false;
    fb.innerHTML = `<span class="suit-symbol">${card.suitSymbol || "✦"}</span><span class="fb-name">${card.name}</span>`;
  };
  front.appendChild(img);
  front.appendChild(fb);
}

function renderReading(drawn, index) {
  const { card, reversed } = drawn;
  const meaning = reversed ? card.reversed : card.upright;
  const badge = reversed
    ? `<span class="badge badge-reversed">Reversed</span>`
    : `<span class="badge badge-upright">Upright</span>`;
  let position = "";
  if (state.mode === "three") {
    const pos = POSITIONS_THREE[index];
    position = `<span class="reading-position">${pos.label} · ${pos.blurb}</span>`;
  }
  return `
    <article class="reading-card" style="animation-delay:${index * 0.08}s">
      <div class="reading-meta">
        ${position}
        <h2 class="reading-name">${card.name}</h2>
        ${badge}
      </div>
      <p class="reading-meaning">${meaning}</p>
      <p class="sit-with"><strong>Sit with this</strong>${card.sitWith}</p>
    </article>
  `;
}

function updateReadings() {
  const box = $("#readings");
  const revealed = state.drawn
    .map((d, i) => ({ d, i }))
    .filter(({ d }) => d.revealed);
  if (!revealed.length) {
    box.innerHTML = "";
    return;
  }
  box.innerHTML = revealed.map(({ d, i }) => renderReading(d, i)).join("");
}

function flipCard(index) {
  const drawn = state.drawn[index];
  if (!drawn || drawn.revealed) return;
  const slot = getSlots()[index];
  if (!slot) return;
  const cardEl = $(".card", slot);
  drawn.revealed = true;
  cardEl.classList.add("flipped");
  updateReadings();
  const allDone = state.drawn.every((d) => d.revealed);
  if (allDone) {
    if (state.mode === "one") {
      setStatus("Today's card is set. Come back tomorrow — or draw again.");
      $("#drawAgainBtn").classList.remove("hidden");
      $("#drawBtn").classList.add("hidden");
    } else {
      setStatus("Sit with Present · Block · Invitation.");
      $("#drawAgainBtn").classList.remove("hidden");
      $("#drawBtn").classList.add("hidden");
    }
  } else {
    setStatus("Tap each card to reveal.");
  }
}

function dealDrawn() {
  showSpreadShell();
  const slots = getSlots();
  state.drawn.forEach((drawn, i) => {
    const slot = slots[i];
    const cardEl = $(".card", slot);
    wireCardFace(cardEl, drawn);
    cardEl.classList.remove("flipped", "entering");
    void cardEl.offsetWidth;
    cardEl.classList.add("entering");
    cardEl.style.animationDelay = `${i * 0.12}s`;
    if (drawn.revealed) {
      cardEl.classList.add("flipped");
    }
  });
  updateReadings();
}

function drawCards(count) {
  state.deck = shuffleArray(state.deck);
  const picks = state.deck.slice(0, count).map((card) => ({
    card,
    reversed: pickReversed(),
    revealed: false,
  }));
  state.drawn = picks;
  return picks;
}

function doShuffle() {
  if (state.shuffling) return;
  state.shuffling = true;
  const pile = $("#deckPile");
  pile.classList.remove("hidden-pile");
  $("#spreadOne").hidden = true;
  $("#spreadThree").hidden = true;
  $("#readings").innerHTML = "";
  state.drawn = [];
  pile.classList.add("shuffling");
  state.deck = shuffleArray(CARDS);
  setStatus("Shuffling the deck…");
  $("#drawBtn").classList.remove("hidden");
  $("#drawAgainBtn").classList.add("hidden");
  setTimeout(() => {
    pile.classList.remove("shuffling");
    state.shuffling = false;
    setStatus("The deck is ready. Draw when you feel centered.");
  }, 600);
}

function doDraw() {
  if (state.shuffling) return;
  const count = state.mode === "three" ? 3 : 1;

  // Daily lock for single-card mode
  if (state.mode === "one") {
    const existing = loadDaily();
    if (existing && existing.cardId) {
      const card = findCard(existing.cardId);
      if (card) {
        state.drawn = [{
          card,
          reversed: !!existing.reversed,
          revealed: true,
        }];
        dealDrawn();
        setStatus("Today's card returns. Sit with it again — or draw again.");
        $("#drawAgainBtn").classList.remove("hidden");
        $("#drawBtn").classList.add("hidden");
        return;
      }
    }
  }

  resetUICards();
  drawCards(count);
  dealDrawn();
  setStatus("Tap a card to turn it over.");

  if (state.mode === "one" && state.drawn[0]) {
    saveDaily({
      date: todayKey(),
      mode: "one",
      cardId: state.drawn[0].card.id,
      reversed: state.drawn[0].reversed,
    });
  }
}

function drawAgain() {
  const msg = state.mode === "one"
    ? "Clear today's card and draw again?"
    : "Clear this spread and draw again?";
  if (!confirm(msg)) return;
  if (state.mode === "one") clearDaily();
  state.drawn = [];
  resetUICards();
  $("#drawBtn").classList.remove("hidden");
  $("#drawAgainBtn").classList.add("hidden");
  setStatus("Take a breath, then draw.");
  // auto-draw fresh
  doDraw();
}

function setMode(mode) {
  if (state.mode === mode) return;
  state.mode = mode;
  $$(".mode-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
  state.drawn = [];
  resetUICards();
  $("#drawBtn").classList.remove("hidden");
  $("#drawAgainBtn").classList.add("hidden");
  if (mode === "one") {
    setStatus("One-card practice. Today's draw is remembered until midnight.");
    // restore today's card if present
    const existing = loadDaily();
    if (existing && existing.cardId && findCard(existing.cardId)) {
      doDraw();
    }
  } else {
    setStatus("Present · Block · Invitation — three cards for a fuller reading.");
  }
}

function bindCardClicks() {
  for (const spread of [$("#spreadOne"), $("#spreadThree")]) {
    $$(".card-slot", spread).forEach((slot) => {
      const cardEl = $(".card", slot);
      const activate = () => {
        const index = Number(slot.dataset.slot);
        flipCard(index);
      };
      cardEl.addEventListener("click", activate);
      cardEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      });
    });
  }
}

function init() {
  $("#shuffleBtn").addEventListener("click", doShuffle);
  $("#drawBtn").addEventListener("click", doDraw);
  $("#drawAgainBtn").addEventListener("click", drawAgain);
  $("#modeOne").addEventListener("click", () => setMode("one"));
  $("#modeThree").addEventListener("click", () => setMode("three"));
  bindCardClicks();

  state.deck = shuffleArray(CARDS);
  setStatus("Shuffle when you're ready — or draw to meet today's card.");

  // Restore today's single card on load
  const existing = loadDaily();
  if (existing && existing.cardId && findCard(existing.cardId)) {
    doDraw();
  }
}

init();
