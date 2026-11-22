class Monster {

    constructor(data) {

        // Identity

        this.name = data.name;
        this.size = data.size;
        this.type = data.type;
        this.alignment = data.alignment;

        // Challenge Rating

        this.cr = data.cr;

        // Abilities

        this.str = data.str;
        this.dex = data.dex;
        this.con = data.con;
        this.int = data.int;
        this.wis = data.wis;
        this.cha = data.cha;

        // Defensive Stats

        this.hitDice = data.hitDice;
        this.hitDieSize = data.hitDieSize || 8;

        this.baseAC = data.baseAC;

        // Saving Throw Proficiencies

        this.saveProficiencies =
            data.saveProficiencies || [];

        // Skill Proficiencies

        this.perceptionProficient =
            data.perceptionProficient || false;

        // Attack

        this.attackName = data.attackName;
        this.attackStat = data.attackStat;
        this.damageDice = data.damageDice;

        // Spellcasting

        this.spellcastingAbility =
            data.spellcastingAbility;
    }

    //-------------------------------------------------
    // ABILITY MODIFIERS
    //-------------------------------------------------

    abilityModifier(score) {
        return Math.floor((score - 10) / 2);
    }

    formatModifier(mod) {
        return mod >= 0 ? `+${mod}` : `${mod}`;
    }

    //-------------------------------------------------
    // PROFICIENCY BONUS (5E CR TABLE)
    //-------------------------------------------------

    getProficiencyBonus() {

        const cr = this.cr;

        if (cr <= 4) return 2;
        if (cr <= 8) return 3;
        if (cr <= 12) return 4;
        if (cr <= 16) return 5;
        if (cr <= 20) return 6;
        if (cr <= 24) return 7;
        if (cr <= 28) return 8;

        return 9;
    }

    //-------------------------------------------------
    // HIT POINTS
    //-------------------------------------------------

    getHp() {

        const averageDie =
            (this.hitDieSize + 1) / 2;

        const conMod =
            this.abilityModifier(this.con);

        return Math.floor(
            this.hitDice * averageDie +
            this.hitDice * conMod
        );
    }

    //-------------------------------------------------
    // ARMOR CLASS
    //-------------------------------------------------

    getAC() {

        return (
            this.baseAC +
            this.abilityModifier(this.dex)
        );
    }

    //-------------------------------------------------
    // SAVING THROWS
    //-------------------------------------------------

    getSavingThrow(stat) {

        let total =
            this.abilityModifier(
                this[stat]
            );

        if (
            this.saveProficiencies.includes(
                stat
            )
        ) {
            total +=
                this.getProficiencyBonus();
        }

        return total;
    }

    getAllSavingThrows() {

        return {
            STR: this.getSavingThrow("str"),
            DEX: this.getSavingThrow("dex"),
            CON: this.getSavingThrow("con"),
            INT: this.getSavingThrow("int"),
            WIS: this.getSavingThrow("wis"),
            CHA: this.getSavingThrow("cha")
        };
    }

    //-------------------------------------------------
    // INITIATIVE
    //-------------------------------------------------

    getInitiative() {

        return this.abilityModifier(
            this.dex
        );
    }

    //-------------------------------------------------
    // PASSIVE PERCEPTION
    //-------------------------------------------------

    getPassivePerception() {

        let score =
            10 +
            this.abilityModifier(
                this.wis
            );

        if (
            this.perceptionProficient
        ) {
            score +=
                this.getProficiencyBonus();
        }

        return score;
    }

    //-------------------------------------------------
    // SPELL SAVE DC
    //-------------------------------------------------

    getSpellSaveDC() {

        if (
            !this.spellcastingAbility
        ) {
            return null;
        }

        return (
            8 +
            this.getProficiencyBonus() +
            this.abilityModifier(
                this[
                    this
                    .spellcastingAbility
                ]
            )
        );
    }

    //-------------------------------------------------
    // ATTACK BONUS
    //-------------------------------------------------

    getAttackBonus() {

        return (
            this.abilityModifier(
                this[
                    this.attackStat
                ]
            ) +
            this
            .getProficiencyBonus()
        );
    }

    //-------------------------------------------------
    // DAMAGE
    //-------------------------------------------------

    parseDamageDice() {

        const match =
            this.damageDice.match(
                /(\d+)d(\d+)/
            );

        if (!match) {

            throw new Error(
                "Invalid dice format."
            );
        }

        return {

            count:
                Number(match[1]),

            die:
                Number(match[2])
        };
    }

    getDamageModifier() {

        return this
            .abilityModifier(
                this[
                    this.attackStat
                ]
            );
    }

    getDamageString() {

        const mod =
            this.getDamageModifier();

        if (mod === 0) {
            return this.damageDice;
        }

        return `${this.damageDice}${
            mod > 0 ? "+" : ""
        }${mod}`;
    }

    getAverageDamage() {

        const parsed =
            this.parseDamageDice();

        const avgDice =
            parsed.count *
            ((parsed.die + 1) / 2);

        return (
            avgDice +
            this
            .getDamageModifier()
        );
    }

    //-------------------------------------------------
    // ROLL DAMAGE
    //-------------------------------------------------

    rollDamage() {

        const parsed =
            this.parseDamageDice();

        let total =
            this.getDamageModifier();

        for (
            let i = 0;
            i < parsed.count;
            i++
        ) {

            total += Math.floor(
                Math.random() *
                parsed.die
            ) + 1;
        }

        return total;
    }

    //-------------------------------------------------
    // HTML OUTPUT
    //-------------------------------------------------

    renderAbility(
        label,
        score
    ) {

        return `
            <div class="ability">
                <b>${label}</b><br>
                ${score}<br>
                ${
                    this
                    .formatModifier(
                        this
                        .abilityModifier(
                            score
                        )
                    )
                }
            </div>
        `;
    }

    render() {

        const saves =
            this
            .getAllSavingThrows();

        return `
        <div class="monster">

            <h1>${this.name}</h1>

            <p>
                <i>
                    ${this.size}
                    ${this.type},
                    ${this.alignment}
                </i>
            </p>

            <hr>

            <p>
        <span class="crBadge">
            CR ${this.cr}
        </span>
        </p>

            <p>
                <b>Proficiency Bonus</b>
                ${
                    this
                    .formatModifier(
                        this
                        .getProficiencyBonus()
                    )
                }
            </p>

            <p>
                <b>Armor Class</b>
                ${this.getAC()}
            </p>

            <p>
                <b>Hit Points</b>
                ${this.getHp()}
            </p>

            <p>
                <b>Initiative</b>
                ${
                    this
                    .formatModifier(
                        this
                        .getInitiative()
                    )
                }
            </p>

            <p>
                <b>Passive Perception</b>
                ${
                    this
                    .getPassivePerception()
                }
            </p>

            ${
                this.spellcastingAbility
                ? `
                <p>
                    <b>Spell Save DC</b>
                    ${
                        this
                        .getSpellSaveDC()
                    }
                </p>
                `
                : ""
            }

            <h3>Abilities</h3>

            <div class="abilityGrid">

                ${this.renderAbility("STR", this.str)}
                ${this.renderAbility("DEX", this.dex)}
                ${this.renderAbility("CON", this.con)}
                ${this.renderAbility("INT", this.int)}
                ${this.renderAbility("WIS", this.wis)}
                ${this.renderAbility("CHA", this.cha)}
            </div>

            <h3>Saving Throws</h3>

            <p>
                STR ${this.formatModifier(saves.STR)},
                DEX ${this.formatModifier(saves.DEX)},
                CON ${this.formatModifier(saves.CON)},
                INT ${this.formatModifier(saves.INT)},
                WIS ${this.formatModifier(saves.WIS)},
                CHA ${this.formatModifier(saves.CHA)}
            </p>

            <h3>Attack</h3>

          <div class="attackBlock">
            <b>${this.attackName}</b><br>
            Attack Bonus:
            ${this.formatModifier(this.getAttackBonus())}
            <br>
            Damage:
            ${this.getDamageString()}
            <br>
            Average Damage:
            ${this.getAverageDamage()}
        </div>

        </div>
        `;
    }
}

const youngRedDragon =
    new Monster({

        name: "Young Red Dragon",

        size: "Large",

        type: "Dragon",

        alignment:
            "Chaotic Evil",

        cr: 10,

        str: 23,
        dex: 10,
        con: 21,
        int: 14,
        wis: 11,
        cha: 19,

        hitDice: 19,
        hitDieSize: 10,

        baseAC: 18,

        saveProficiencies: [
            "dex",
            "con",
            "wis",
            "cha"
        ],

        perceptionProficient: true,

        spellcastingAbility: "cha",

        attackName: "Bite",

        attackStat: "str",

        damageDice: "2d10"
    });

    
const youngRedDragon2 =
    new Monster({

        name: "Young Red Dragon",

        size: "Large",

        type: "Dragon",

        alignment:
            "Chaotic Evil",

        cr: 5,

        str: 14,
        dex: 10,
        con: 21,
        int: 14,
        wis: 11,
        cha: 19,

        hitDice: 19,
        hitDieSize: 10,

        baseAC: 18,

        saveProficiencies: [
            "dex",
            "con",
            "wis",
            "cha"
        ],

        perceptionProficient: true,

        spellcastingAbility: "cha",

        attackName: "Bite",

        attackStat: "str",

        damageDice: "2d10"
    });



//new area
const essenceSymbiote = new Monster({
    name: "Essence Symbiote",
    cr: 3,
    size: "Medium",
    type: "Monstrosity",
    alignment: "Neutral",

    str: 12,
    dex: 16,
    con: 16,
    int: 8,
    wis: 14,
    cha: 10,

    hitDice: 6,
    hitDieSize: 8,
    baseAC: 13,

    saveProficiencies: ["dex","wis"],
    perceptionProficient: true,

    attackName: "Symbiotic Tendril",
    attackStat: "dex",
    damageDice: "2d6"
});
const adaptiveShimmerer = new Monster({
    name: "Adaptive Shimmerer",
    cr: 4,
    size: "Medium",
    type: "Aberration",
    alignment: "Unaligned",

    str: 14,
    dex: 18,
    con: 14,
    int: 10,
    wis: 12,
    cha: 8,

    hitDice: 7,
    hitDieSize: 10,
    baseAC: 15,

    saveProficiencies: ["dex"],
    perceptionProficient: true,

    attackName: "Prismatic Claws",
    attackStat: "dex",
    damageDice: "2d8"
});
const archipelagore = new Monster({
    name: "Archipelagore",
    cr: 11,
    size: "Huge",
    type: "Leviathan",
    alignment: "Neutral",

    str: 24,
    dex: 8,
    con: 23,
    int: 6,
    wis: 15,
    cha: 10,

    hitDice: 18,
    hitDieSize: 12,
    baseAC: 17,

    saveProficiencies: ["str","con"],
    perceptionProficient: true,

    attackName: "Tidal Slam",
    attackStat: "str",
    damageDice: "4d10"
});
const auspiciousStarrix = new Monster({
    name: "Auspicious Starrix",
    cr: 10,
    size: "Huge",
    type: "Celestial",
    alignment: "Neutral Good",

    str: 20,
    dex: 12,
    con: 18,
    int: 14,
    wis: 18,
    cha: 20,

    hitDice: 16,
    hitDieSize: 12,
    baseAC: 16,

    saveProficiencies: ["wis","cha"],
    perceptionProficient: true,
    spellcastingAbility: "cha",

    attackName: "Starlight Gore",
    attackStat: "str",
    damageDice: "3d10"
});
const avianOddity = new Monster({
    name: "Avian Oddity",
    cr: 2,
    size: "Small",
    type: "Aberration",
    alignment: "Chaotic Neutral",

    str: 8,
    dex: 18,
    con: 12,
    int: 12,
    wis: 10,
    cha: 14,

    hitDice: 5,
    hitDieSize: 6,
    baseAC: 14,

    saveProficiencies: ["dex"],
    perceptionProficient: true,

    attackName: "Warped Beak",
    attackStat: "dex",
    damageDice: "1d8"
});
const boneyardLurker = new Monster({
    name: "Boneyard Lurker",
    cr: 6,
    size: "Large",
    type: "Undead",
    alignment: "Neutral Evil",

    str: 18,
    dex: 12,
    con: 17,
    int: 8,
    wis: 13,
    cha: 8,

    hitDice: 10,
    hitDieSize: 10,
    baseAC: 15,

    saveProficiencies: ["con"],
    perceptionProficient: true,

    attackName: "Grave Claw",
    attackStat: "str",
    damageDice: "2d10"
});
const bootNipper = new Monster({
    name: "Boot Nipper",
    cr: 1,
    size: "Small",
    type: "Beast",
    alignment: "Unaligned",

    str: 10,
    dex: 15,
    con: 12,
    int: 3,
    wis: 12,
    cha: 6,

    hitDice: 3,
    hitDieSize: 8,
    baseAC: 13,

    saveProficiencies: ["dex"],
    perceptionProficient: true,

    attackName: "Venomous Bite",
    attackStat: "dex",
    damageDice: "1d6"
});
const brokkos = new Monster({
    name: "Brokkos, Apex of Forever",
    cr: 18,
    size: "Gargantuan",
    type: "Monstrosity",
    alignment: "Chaotic Neutral",

    str: 30,
    dex: 14,
    con: 27,
    int: 12,
    wis: 16,
    cha: 19,

    hitDice: 28,
    hitDieSize: 12,
    baseAC: 20,

    saveProficiencies: [
        "str",
        "con",
        "wis"
    ],

    perceptionProficient: true,

    attackName: "Apex Talons",
    attackStat: "str",
    damageDice: "6d10"
});
const cavernWhisperer = new Monster({
    name: "Cavern Whisperer",
    cr: 8,
    size: "Large",
    type: "Aberration",
    alignment: "Neutral Evil",

    str: 19,
    dex: 13,
    con: 18,
    int: 14,
    wis: 16,
    cha: 18,

    hitDice: 13,
    hitDieSize: 10,
    baseAC: 16,

    saveProficiencies: [
        "wis",
        "cha"
    ],

    perceptionProficient: true,
    spellcastingAbility: "cha",

    attackName: "Psychic Talons",
    attackStat: "str",
    damageDice: "3d8"
});
const chitteringHarvester = new Monster({
    name: "Chittering Harvester",
    cr: 9,
    size: "Huge",
    type: "Monstrosity",
    alignment: "Neutral Evil",

    str: 22,
    dex: 10,
    con: 20,
    int: 6,
    wis: 14,
    cha: 8,

    hitDice: 15,
    hitDieSize: 12,
    baseAC: 17,

    saveProficiencies: [
        "str",
        "con"
    ],

    perceptionProficient: true,

    attackName: "Harvesting Scythe",
    attackStat: "str",
    damageDice: "4d8"
});
function renderMonsters(monsterList) {

    const displayArea =
        document.querySelector(".displayArea");

    displayArea.innerHTML = "";

    monsterList.forEach(monster => {

        displayArea.insertAdjacentHTML(
            "beforeend",
            monster.render()
        );

    });

}

function filterMonsters() {

    const cr =
        document.getElementById("crFilter").value;

    const size =
        document.getElementById("sizeFilter").value;

    const type =
        document.getElementById("typeFilter").value;

    const filtered =
        monsters.filter(monster => {

            const crMatch =
                !cr ||
                monster.cr === Number(cr);

            const sizeMatch =
                !size ||
                monster.size === size;

            const typeMatch =
                !type ||
                monster.type === type;

            return (
                crMatch &&
                sizeMatch &&
                typeMatch
            );

        });

    renderMonsters(filtered);

}
document
    .getElementById("filterBtn")
    .addEventListener(
        "click",
        filterMonsters
    );

document
    .getElementById("showAllBtn")
    .addEventListener(
        "click",
        () => renderMonsters(monsters)
    );
function populateFilters() {

    const crs =
        [...new Set(
            monsters.map(m => m.cr)
        )].sort((a,b)=>a-b);

    const sizes =
        [...new Set(
            monsters.map(m => m.size)
        )];

    const types =
        [...new Set(
            monsters.map(m => m.type)
        )];

    const crSelect =
        document.getElementById("crFilter");

    const sizeSelect =
        document.getElementById("sizeFilter");

    const typeSelect =
        document.getElementById("typeFilter");

    crs.forEach(cr => {
        crSelect.innerHTML +=
            `<option value="${cr}">
                ${cr}
             </option>`;
    });

    sizes.forEach(size => {
        sizeSelect.innerHTML +=
            `<option value="${size}">
                ${size}
             </option>`;
    });

    types.forEach(type => {
        typeSelect.innerHTML +=
            `<option value="${type}">
                ${type}
             </option>`;
    });

}
const monsters = [
    essenceSymbiote,
    adaptiveShimmerer,
    archipelagore,
    auspiciousStarrix,
    avianOddity,
    boneyardLurker,
    bootNipper,
    brokkos,
    cavernWhisperer,
    chitteringHarvester
];
function clearDisplay() {

    const displayArea =
        document.querySelector(".displayArea");

    displayArea.innerHTML = "";

}
document
    .getElementById("clearBtn")
    .addEventListener(
        "click",
        clearDisplay
    );

populateFilters();
renderMonsters(monsters);