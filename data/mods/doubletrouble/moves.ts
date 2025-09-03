import { inherits } from "util";

export const Moves: { [moveid: string]: ModdedMoveData } = {

	confoundingcrystal: {
		num: -1000,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Confounding Crystal",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Subzero Slammer', target);
		},
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
			},
		},
		target: "normal",
		type: "Ice",
		contestType: "Tough",
		shortDesc: "User traps the target on hit.",
	},
	mineraldrain: {
		num: -1005,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Mineral Drain",
		shortDesc: "User recovers 50% of the damage dealt.",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
		onPrepareHit(target, source) {
			this.add('-anim', target, 'Power Gem', source);
		},
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Clever",
	},
	enzymaticbite: {
		num: -1005,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Enzymatic Bite",
		shortDesc: "User recovers 50% of the damage dealt.",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1, bite: 1},
		onPrepareHit(target, source) {
			this.add('-anim', target, 'Poison Fang', source);
		},
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Poison",
		contestType: "Clever",
	},
	nullaurora: {
		// TODO
		num: -1002,
		accuracy: 100,
		basePower: 65,
		basePowerCallback(pokemon, target, move) {
			if (!this.field.isWeather('raindance', 'snow', 'sandstorm', 'sunnyday', 'snow', 'primordialsea', 'desolateland')) {
				this.debug('Null Aurora damage boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Special",
		name: "Null Aurora",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Moongeist Beam', target);
		},
		weather: 'snow',
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
		shortDesc: "If no snow/hail, x2 BP. Sets snow/hail.",
	},
	graverobbing: {
		// TODO
		num: -1003,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Grave Robbing",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, contact: 1},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Spectral Thief', target);
		},
		onAfterHit(target, source) {
			if (source.item || !source.lastItem) return false;
			const item = source.lastItem;
			source.lastItem = '';
			this.add('-item', source, this.dex.items.get(item), '[from] move: Grave Robbing');
			source.setItem(item);
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Tough",
		shortDesc: "User recycles their item, if applicable.",
	},
	unityveil: {
		// TODO
		num: -1004,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Unity Veil",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTry(source, target, move) {
			if (source.status) {
				this.attrLastMove('[still]');
				this.add('-fail', source, 'move: Unity Veil');
				return null 
			}
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Lunar Dance', source);
		},
		slotCondition: 'unityveil',
		condition: {
			onSwap(target) {
				target.addVolatile('aquaring', target);
				target.side.removeSlotCondition(target, 'unityveil');
			},
		},
		secondary: {
			chance: 100,
			status: 'psn',
		},
		selfSwitch: true,
		target: "self",
		type: "Normal",
		contestType: "Tough",
		shortDesc: "Placeholder",
	},
	conduct: {
		// TODO
		num: -1005,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Conduct",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Charge', target);
		},
		onHit(target) {
			if (this.activePerHalf === 1) return false; // fails in singles
			const action = this.queue.willMove(target);
			target.addVolatile('charge');
			if (action) {
				this.queue.prioritizeAction(action);
				this.add('-activate', target, 'move: Conduct');
			} else {
				return false;
			}
		},
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Tough",
		shortDesc: "User charges the target, who has its turn after this move.",
	},
	canalsurge: {
		// TODO
		num: -1006,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Canal Surge",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Surf', target);
		},
		secondary: {
			chance: 39, //rough chance for at least one to occur
			onHit(target, source) {
				const result = this.random(3);
				if (result === 0) {
					this.boost({spd: -1}, target);
				} else if (result === 1) {
					this.boost({spa: -1}, target);
				} else {
					this.boost({atk: -1}, target);
				}
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Tough",
		shortDesc: "15% chance to drop Atk, SpAtk, or SpDef.",
	},
	stickyfingers: {
		// TODO
		num: -1007,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Sticky Fingers",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, contact: 1},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Horn Leech', target);
		},
		onAfterHit(target, source, move) {
			if (source.hp && item.isBerry && target.takeItem(source)) {
				this.add('-enditem', target, item.name, '[from] stealeat', '[move] Sticky Fingers', '[of] ' + source);
				if (this.singleEvent('Eat', item, null, source, null, null)) {
					this.runEvent('EatItem', source, null, null, item);
					if (item.id === 'leppaberry') target.staleness = 'external';
				}
				if (item.onEat) source.ateBerry = true;
			}
			if (source.item || source.volatiles['gem']) {
				return;
			}
			const yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (!this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem) ||
				!source.setItem(yourItem)) {
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-enditem', target, yourItem, '[silent]', '[from] move: Sticky Fingers', '[of] ' + source);
			this.add('-item', source, yourItem, '[from] move: Sticky Fingers', '[of] ' + target);
		},
		secondary: null,
		target: "normal",
		type: "Bug",
		contestType: "Tough",
		shortDesc: "User steals item. If item is a berry, consume.",
	},
	somnawave: {
		// TODO
		num: -1008,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Somnawave",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Psychic Noise', target);
		},
		onHit(target) {
			if (target.status || !target.runStatusImmunity('slp')) return;
			if (this.random(2) === 0) return;
			target.addVolatile('yawn');
		},
		onAfterSubDamage(damage, target) {
			if (target.status || !target.runStatusImmunity('slp')) return;
			if (this.random(2) === 0) return;
			target.addVolatile('yawn');
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Tough",
		shortDesc: "User inflicts Yawn on target.",
	},
	earthshatteringelegy: {
		// TODO
		num: -1009,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Earth-Shattering Elegy",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, sound: 1 },
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Boomburst', target);
			this.add('-anim', source, 'Earthquake', target);
		},
		secondary: {
			chance: 100,
			boosts: {
				spd: -1,
			},
		},
		target: "allAdjacent",
		type: "Ground",
		contestType: "Tough",
		shortDesc: "Placeholder",
	},
	acidrain: {
		// TODO
		num: -1010,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Acid Rain",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bypasssub: 1},
		breaksProtect: true,
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Acid Downpour', target);
		},
		status: 'psn',
		weather: 'rain',
		secondary: null,
		target: "allAdjacent",
		type: "Water",
		contestType: "Tough",
		shortDesc: "Placeholder",
	},
	
}
