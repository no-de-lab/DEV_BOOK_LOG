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
  // let totalAmount = 0; //totalAmount() 로 분리
  // let volumeCredits = 0; // totalVolumeCredits()로 분리
  let result = `청구 내역: (고객명: ${invoice.customer}) \n`;
//   const format = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     minumumFractionDigits: 2,
//   }).format;

  for (let perf of invoice.performances) {
    // const play = playFor(perf);
    // let thisAmount = amountFor(perf);

    // volumeCredits += volumeCreditsFor(perf);

    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    } 석) \n`;
    // totalAmount += amountFor(perf);
  }

  result += `총액: ${usd(totalAmount())} \n`;
  result += `적립 포인트: ${totalVolumeCredits()}점 \n`;
  console.log(result);
  return result;
}
function totalAmount(){
  let result = 0;
  for (let perf of invoice.performances) {
    result += amountFor(perf);
  }
  return result;
}
function totalVolumeCredits(){
  let result = 0;
  for (let perf of invoice.performances) {
    result += volumeCreditsFor(perf);
  }
  return result;
}
function usd(aNumber){ // 포맷 변환 함수
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minumumFractionDigits: 2,
      }).format(aNumber/100);
}
function volumeCreditsFor(aPerformance){
    let volumeCredits = 0;
    volumeCredits += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type)
        volumeCredits += Math.floor(aPerformance.audience / 5);

    return volumeCredits;
}
function playFor(aPerformance) {
  return plays[aPerformance.playId];
}
function amountFor(aPerformance) {
  let result = 0;
  switch (playFor(perf).type) {
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
      throw new Error(`알 수 없는 장르: ${playFor(perf).type}`);
  }
  return result;
}
