class Line {
    constructor(lineData) {
        this.accuracy = parseFloat(lineData.accuracy); // 99.96505
        this.count50 = parseInt(lineData.count50);
        this.count100 = parseInt(lineData.count100);
        this.count300 = parseInt(lineData.count300);
        this.tth = this.count50 + this.count100 + this.count300;
        this.A = parseInt(lineData.countRankA);
        this.S = parseInt(lineData.countRankS + lineData.countRankSh);
        this.SS = parseInt(lineData.countRankSs + lineData.countRankSsh);
        this.level = parseFloat(lineData.level);
        this.playcount = parseInt(lineData.playcount);
        this.rankworld = parseInt(lineData.ppRank);
        this.pp = parseInt(lineData.ppRaw);
        this.rankedscore = parseInt(lineData.rankedScore);
        this.totalscore = parseInt(lineData.totalScore);
        this.dateString = lineData.queryDate.year + "-" + lineData.queryDate.month + "-" + lineData.queryDate.day;
        this.date = new Date(this.dateString);

        this.tth_pc = this.tth / this.playcount;
        this.tth_pp = this.tth / this.pp;
        this.pc_pp = this.playcount / this.pp;
    }
}

class UserFull {
    /**
     * @param {*} data
     * @param {Date} startDate
     * @param {Date} endDate
     */
    constructor(data, startDate, endDate) {
        this.lines = data.filter((d) => d).map((lineData) => new Line(lineData)).filter((line) => {
            return (startDate <= line.date && line.date <= endDate);
        }).sort((a, b) => a.date - b.date);
    }

    getPoints(xName, yName) {
        let x = [];
        let y = [];
        this.lines.map((line) => {
            x.push(line[xName]);
            y.push(line[yName]);
        });
        return { x, y };
    }
}

class DrawInfo {
    /**
     * @param {String} uid
     * @param {UserFull} userfull
     * @param {String} dataType
     * @param {String} name
    */
    constructor(uid, userfull, dataType, name) {
        this.uid = uid;
        this.userfull = userfull;
        this.dataType = dataType;
        this.name = name || uid;
    }

    setName(name) {
        this.name = name;
    }

    getTrace(xName, yName) {
        const points = this.userfull.getPoints(xName, yName);
        return { "x": points.x, "y": points.y, name: this.name, showlegend: true, "type": "scatter" };
    }
}

