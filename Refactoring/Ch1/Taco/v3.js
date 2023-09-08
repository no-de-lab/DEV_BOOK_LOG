const plays = {
    hamlet: { name: "Hamlet", type: "tragedy" },
    "as-like": { name: "As You Like It", type: "comedy" },
    othello: { name: "Othello", type: "tragedy" },
  };
  const invoice = [
    {
      customer: "BigCo",
      performances: [
        {
          playId: "hamlet",
          audience: 55,
        },
        {
          playId: "as-like",
          audience: 35,
        },
        {
          playId: "othello",
          audience: 45,
        },
      ],
    },
  ];
  function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
  }
  function createStatementData(invoice, plays) {

    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    statementData.totalAmount = totalAmount(statementData);
    return statementData;
  
    function enrichPerformance(aPerformance){
      const result = Object.assign({}, aPerformance);
      result.play = playFor(result);
      result.amount = amountFor(result);
      result.volumeCredits = volumeCreditsFor(result);
      return result;
    }
    function playFor(aPerformance) {
      return plays[aPerformance.playId];
    }
    function amountFor(aPerformance) {
      let result = 0;
      switch (aPerformance.play.type) {
        case "tragedy":
          result = 40000;
          if (aPerformance.audience > 30) {
            result += 1000 * (aPerformance.audience - 30);
          }
          break;
        case "comedy":
          result = 30000;
          if (aPerformance.audience > 20) {
            result += 10000 + 500 * (aPerformance.audience - 30);
          }
          result += 300 * aPerformance.audience;
          break;
        default:
          throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
      }
      return result;
    }
    function volumeCreditsFor(aPerformance){
      let volumeCredits = 0;
      volumeCredits += Math.max(aPerformance.audience - 30, 0);
      if ("comedy" === aPerformance.play.type)
          volumeCredits += Math.floor(aPerformance.audience / 5);
  
      return volumeCredits;
  }
  function totalVolumeCredits(data){
    return data.performances
        .reduce((total, p) => total + p.volumeCredits, 0);
  }
  function totalAmount(data){
    return data.performances
        .reduce((total, p) => total + p.amount, 0);
  }
  }
  
  function renderHtml(data){
    let result = `<h1>청구 내역: (고객명: ${data.customer}) \n</h1>`;
    result += "<table>\n";
    result += "<tr><th>연극</th><th>좌석 수</th>금액</tr>";
    for (let perf of data.performances) {
        result += `<tr><td>${perf.play.name}</td><td>(${perf.audience} 석)</td>`;
        result += `<tr><td>${usd(perf.amount)}</td>\n`;
      }
      result += "</table>\n";
  }
  function renderPlainText(data, plays) {
    let result = `청구 내역: (고객명: ${data.customer}) \n`;
    for (let perf of data.performances) {
      result += `${perf.play.name}: ${usd(perf.amount)} (${
        perf.audience
      } 석) \n`;
    }
  
    result += `총액: ${usd(data.totalAmount())} \n`;
    result += `적립 포인트: ${data.totalVolumeCredits()}점 \n`;
    console.log(result);
    return result;

    
    function usd(aNumber){ // 포맷 변환 함수
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minumumFractionDigits: 2,
          }).format(aNumber/100);
    }
  }
  
  