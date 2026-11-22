

getDamageModifier() {

    const score =
        this[this.attackStat];

    return this.abilityModifier(score);
}

getDamageString() {

    const mod =
        this.getDamageModifier();

    if (mod === 0) {
        return this.damageDice;
    }

    return `${this.damageDice}${
        mod >= 0 ? "+" : ""
    }${mod}`;
}

getAverageDamage() {

    const parsed =
        this.parseDamageDice();

    const diceAverage =
        parsed.numberOfDice *
        ((parsed.dieSize + 1) / 2);

    return (
        diceAverage +
        this.getDamageModifier()
    );
}

getAttackBonus() {

    return (
        this.abilityModifier(
            this[this.attackStat]
        ) +
        this.getProficiencyBonus()
    );
}

renderAttack() {

    return `
        <p>
            <strong>${this.attackName}</strong><br>

            Attack Bonus:
            ${this.formatModifier(
                this.getAttackBonus()
            )}<br>

            Damage:
            ${this.getDamageString()}<br>

            Average Damage:
            ${this.getAverageDamage()}
        </p>
    `;
}

const ogreChampion =
    new Monster({

        name: "Ogre Champion",

        size: "Large",
        type: "Giant",
        alignment: "Chaotic Evil",

        cr: 5,

        str: 18,
        dex: 8,
        con: 16,
        int: 6,
        wis: 10,
        cha: 7,

        hitDice: 10,
        baseAC: 12,

        saveProficiencies: [
            "str",
            "con"
        ],

        attackName: "Greatclub",

        attackStat: "str",

        damageDice: "2d8"
    });

console.log(
    ogreChampion.getProficiencyBonus()
);
// +3

console.log(
    ogreChampion.getAttackBonus()
);
// +7

console.log(
    ogreChampion.getDamageString()
);
// 2d8+4

console.log(
    ogreChampion.getAverageDamage()
);
// 13