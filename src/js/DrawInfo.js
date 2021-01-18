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

    getPoints(xName, yName, yDataType) {
        let x = [];
        let y = [];
        switch (yDataType) {
            case "val": {
                this.lines.map((line) => {
                    x.push(line[xName]);
                    y.push(line[yName]);
                });
                break;
            }
            case "deltaVal": {
                this.lines.map((line, index) => {
                    if (index < 1) return;
                    x.push(line[xName]);
                    y.push(line[yName] - this.lines[index - 1][yName]);
                });
                break;
            }
            case "deltaPer": {
                this.lines.map((line, index) => {
                    if (index < 1) return;
                    x.push(line[xName]);
                    y.push((line[yName] - this.lines[index - 1][yName]) * 100 / this.lines[index - 1][yName] + "%");
                });
                break;
            }
        }
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

    getTrace(xName, yName, yDataType) {
        const points = this.userfull.getPoints(xName, yName, yDataType);
        return { "x": points.x, "y": points.y, name: this.name, showlegend: true, "type": "scatter" };
    }

    getLayout(xTitle, yTitle, yDataType) {
        let layout = {
            title: {
                text: xTitle + "-" + yTitle
            },
            xaxis: {
                title: {
                    text: xTitle
                },
                exponentformat: 'none',
                showgrid: true,
                gridwidth: 2
            },
            yaxis: {
                title: {
                    text: yTitle
                },
                exponentformat: 'none',
                showgrid: true,
                gridwidth: 2
            }
        };
        switch (xTitle) {
            case "rank": { layout.xaxis.autorange = 'reversed'; break; }
            case "ranked 总分":
            case "total 总分": { delete layout.xaxis.exponentformat; break; }
        };
        switch (yTitle) {
            case "rank": { layout.yaxis.autorange = 'reversed'; break; }
            case "ranked 总分":
            case "total 总分": { delete layout.yaxis.exponentformat; break; }
        };
        switch (yDataType) {
            case "deltaVal": {
                layout.yaxis.title.text += "增长值";
                break;
            }
            case "deltaPer": {
                layout.yaxis.title.text += "增长百分比(%)";
                break;
            }
        }
        return layout;
    }
}

