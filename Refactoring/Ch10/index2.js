function rating(voyage, history){
    return new Rating(voyage, history).value;
}

class Rating {
    constructor(voyage, history){
        this.voyage = voyage;
        this.history = history;
    }

    get value(){
        const vpf = this.voyageProfitFactor(voyage, history);
        const vr = this.voyageRisk(voyage);
        const chr = this.captainHistoryRisk(voyage, history);

        if(vpf * 3 > (vr+chr*2)) return "A";
        else return "B";
    }

    get voyageRisk(){
        let result = 1;
        if(this.voyage.length > 4) result += 2;
        if(this.voyage.length > 8) result += voyage.length - 8;
        if(["중국", "동인도"].includes(this.voyage.zone)) result+=4;
        return Math.max(result, 0);
    }

    get captainHistoryRisk(){
        let result = 1;
        if(this.history.length < 5) result+=4;
        result+= this.history.filter(v => v.profit < 0).length;
        return Math.max(result, 0);
    }
    get voyageProfitFactor(){
        let result = 2;
        if(this.voyage.zone === "중국") result += 1;
        if(this.voyage.zone === "동인도") result += 1;
        result+= this.voyageLengthFactor;
        result += this.historyLengthFactor;
        return result;
    }
    get voyageLengthFactor(){
        return this.voyage.length > 14? -1:0;
    }

    get historyLengthFactor(){
        return this.this.history.length > 8? 1:0;
    }
}

class ExperiencedChinaRating extends Rating {
    get captainHistoryRisk(){
        const result = super.captainHistoryRisk - 2;
        return Math.max(result, 0);    
    }
    get voyageProfitFactor(){
        return super.voyageProfitFactor+=3;
    }
    get voyageLengthFactor(){
        let result = 0; 
        
        if(this.this.voyage.length > 12) result+=1;
        if(this.this.voyage.length > 18) result-=1;
        
        return result;
    }
    get historyLengthFactor(){
        return this.this.history.length > 10? 1:0;
    }
}