
const plays = {
    "hamlet": {"name": "Hamlet", "type": "tragedy"},
    "as-like": {"name": "As You Like It", "type": "comedy"},
    "othello": {"name": "Othello", "type": "tragedy"}
}
const invoice = [
    {
        "customer": "BigCo",
        "performances": [
        {
            "playId": "hamlet",
            "audience": 55
        },
        {
            "playId": "as-like",
            "audience": 35
        },
        {
            "playId": "othello",
            "audience": 45
        },
        ]
    }
]
function statement (invoice, plays){
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내역: (고객명: ${invoice.customer}) \n`;
    const format = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minumumFractionDigits:2}).format;

    for(let perf of invoice.performances){
        const play = plays[pefr.playId];
        let thisAmount = 0;

        switch(play.type){
            case "tragedy":
                thisAmount = 40000;
                if(perf.audience > 30){
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if(perf.audience > 20){
                    thisAmount += 10000 + 500 * (perf.audience - 30);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`알 수 없는 장르: ${play.type}`); 
        }
        volumeCredits += Math.max(perf.audience - 30, 0);
        if("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

        result += `${play.name}: ${format(thisAmount/100)} (${perf.audience} 석) \n`
        totalAmount += thisAmount;
    }

    result += `총액: ${format(totalAmount/100)} \n`;
    result += `적립 포인트: ${volumeCredits}점 \n`;
    return result;
}