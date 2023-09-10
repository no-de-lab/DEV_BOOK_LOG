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
function createPerformanceCalculator(aPerformance, aPlay) {
  switch (aPlay.type) {
    case "tragedy":
      return new TragedyCalculator(aPerformance, aPlay);
    case "comedy":
      return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`알 수 없는 장르 + ${aPlay.type} `);
  }
}
class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }

    return result;
  }
}
class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 30);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}
function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }
  get amount() {
    throw new Error("서브 클래스 처리");
  }
  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}
function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  statementData.totalAmount = totalAmount(statementData);
  return statementData;

  function enrichPerformance(aPerformance) {
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }
  function playFor(aPerformance) {
    return plays[aPerformance.playId];
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }
  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }
}

function renderHtml(data) {
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
    result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience} 석) \n`;
  }

  result += `총액: ${usd(data.totalAmount())} \n`;
  result += `적립 포인트: ${data.totalVolumeCredits()}점 \n`;
  console.log(result);
  return result;

  function usd(aNumber) {
    // 포맷 변환 함수
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minumumFractionDigits: 2,
    }).format(aNumber / 100);
  }
}
