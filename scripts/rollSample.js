const DIE_SIZE = 6;

const signNum = (num) => (num >= 0 ? '+' + num : num);

const rollD6 = (max = DIE_SIZE, min = 1) => {
    return min + Math.floor(Math.random() * (max - min + 1));
};

const numSort = (a, b) => {
    return a - b;
};

const numMode = (arr) => {
    const m = arr.reduce((count = {}, e) => {
        if (!(e in count)) {
            count[e] = 0;
        }

        count[e] += 1;
        return count;
    }, {});

    // console.log(m)

    var max = [0, 0];
    Object.entries(m).forEach(
        (entry) => (max = max[1] <= entry[1] ? entry : max)
    );

    return Number(max[0]);
};

const sum = (arr) => arr.reduce((partialSum, a) => partialSum + a, 0);

const numMean = (arr) =>
    Array.isArray(arr)
        ? Math.floor(
              arr.reduce((partialSum, a) => partialSum + a, 0) / arr.length
          )
        : 0;

const exoRoll = (roll = rollD6()) => {
    const result = [roll];
    while (roll === DIE_SIZE) {
        roll = rollD6();
        result.push(roll);
    }

    return result;
};

const genRoll = (diceToRoll = 3, adv = 0) => {
    var rolls = Array(diceToRoll + Math.abs(adv))
        .fill(0)
        .map((_) => rollD6())
        .sort(numSort);

    if (adv > 0) {
        //keep highest rolls
        // console.log('saving highest roll', rolls);
        rolls = rolls.slice(-1 * diceToRoll);
        // console.log(rolls);
    }

    if (adv < 0) {
        // console.log('saving lowest roll', rolls);
        rolls = rolls.slice(0, diceToRoll);
        // console.log(rolls);
    }

    // Remove imploded rolls
    // const ones = rolls.filter((d) => d === 1).length;
    // rolls = rolls.filter((d) => d !== 1);
    // for (var i = 0; i < ones; i++) {
    //     rolls.pop();
    // }

    // rolls.push(0);

    // Explode
    rolls = rolls.flatMap(exoRoll);

    return {
        total: sum(rolls),
        rolls,
        f1: rolls.length === diceToRoll && rolls.every((e) => e === 1),
        f2: rolls.length === diceToRoll && rolls.every((e) => e === 2),
        f3: rolls.length === diceToRoll && rolls.every((e) => e === 3),
    };
};

const statRoll = (diceToRoll = 3, n = 1e5) => {
    const stats = {};
    for (var adv = -2; adv <= 2; adv++) {
        var rolls = [];
        var fumbles = [0, 0, 0];
        for (var i = 0; i < n; i++) {
            const { total, f1, f2, f3 } = genRoll(diceToRoll, adv);
            rolls.push(total);
            if (f1) fumbles[0]++;
            if (f2) fumbles[1]++;
            if (f3) fumbles[2]++;
        }
        rolls = rolls.sort(numSort);
        const mean = numMean(rolls);
        const median = rolls[Math.floor(rolls.length / 2)];
        const mode = numMode(rolls);
        const max = rolls[n - 1];
        const min = rolls[0];

        const f1Chance = Math.round((fumbles[0] * 1000.0) / n) / 10;
        const f2Chance = Math.round((fumbles[1] * 1000.0) / n) / 10;
        const f3Chance = Math.round((fumbles[2] * 1000.0) / n) / 10;

        console.log(
            [
                diceToRoll + 'd' + DIE_SIZE,
                signNum(adv),
                mean,
                median,
                mode,
                max,
                min,
                f1Chance + '%',
                f2Chance + '%',
                f3Chance + '%',
            ].join('\t')
        );
        stats[adv + ''] = {
            mean,
            median,
            mode,
            max,
            min,
            f1Chance,
            f2Chance,
            f3Chance,
        };
    }

    console.log('-------------------------------------------------');
    // console.log(diceToRoll, stats);
};

console.log(['dice', 'adv', 'mean', 'median', 'mode', 'max', 'min'].join('\t'));

statRoll(2);
statRoll(3);
statRoll(4);
statRoll(5);

// statRoll(3, 1);
