
<h1 style="color: #A9DFDA">기본적인 리팩터링</h1>

- 함수와 변수 추출하기
- 함수와 변수 인라인하기
- 함수와 변수 선언(이름) 바꾸기
- 매개변수 객체 만들기
- 여러 함수 클래스로 묶기
- 단계 쪼개기 등이 있다.

## 1. 함수 추출하기

```javascript
function printOwning(invoice){
    printBanner();
    let outstanding = calculateOutStanding();

    console.log(`고객명: ${invoice.customer}`);
    console.log(`채무액: ${outstanding}`);
}
// 위에서 아래로 변경

function printOwning(invoice){
    printBanner();
    let outstanding = calculateOutStanding();
    printDetails(outstanding);

    function printDetails(outstanding){
        console.log(`고객명: ${invoice.customer}`);
        console.log(`채무액: ${outstanding}`);
    }
}
```
코드 조각을 찾아서 무엇을 하는지 파악한 다음에, 독립된 함수로 추출하고 목적에 맞는 이름을 붙인다. 

독립된 함수로 추출하는 시점은 다양한데, 코드가 하는 일이 뭔지 알리는 반면 짧게 구현 코드를 작성하면 좋을 때다. 함수를 짧게 만든다고 성능이 나빠지는 것이 아니라, 캐싱하기가 더 쉬워져 컴파일러 최적화도 가능하다. 이를 위해서는 중요한 것이 함수명을 잘 짓는 것이다. 

### 절차
1. 목적에 맞게 이름 잘 짓기
2. 추출할 코드를 분리해서 새 함수에 붙여넣기
3. 원본함수의 지역 변수를 참조하거나, 추출한 함수의 유효 범위를 벗어나는 변수는 없는지 검사

### 예: 유효 범위 벗어나는 변수가 없을 때 :함수를 추출한다.
```javascript
function printOwning(invoice){
    printBanner();
    let outstanding = 0;
    for(const o of invoice.orders){
        outstanding += o.amount;
    }
    function printBanner(outstanding){
        console.log("**************");
        console.log("banner");
        console.log("**************");
        
    }
    function printDetails(outstanding){
        console.log(`고객명: ${invoice.customer}`);
        console.log(`채무액: ${outstanding}`);
    }
}
```


### 예: 지역 변수 사용할 때 :이를 매개 변수로 사용한다.
```javascript
function printOwning(invoice){
    printBanner();
    let outstanding = 0;
    for(const o of invoice.orders){
        outstanding += o.amount;
    }
    printDetails(invoice, outstanding)
    
}
function printDetails(invoice, outstanding){
        console.log(`고객명: ${invoice.customer}`);
        console.log(`채무액: ${outstanding}`);
    }
```

### 예: 지역 변수 값을 변경할 때 :함수를 추출한다.
```javascript
function printOwning(invoice){
    printBanner();
    let outstanding = calculateOutStanding();
    printDetails(invoice, outstanding)
    
}
function printDetails(invoice, outstanding){
        console.log(`고객명: ${invoice.customer}`);
        console.log(`채무액: ${outstanding}`);
    }
function calculateOutstanding(invoice){
    let outstanding=0;
    for(const o of invoice.orders){
        outstanding += o.amount;
    }
}
```

---
## 2. 함수 인라인하기
명확하지 않게 추출되면 인라인 시킨다. 쓸데없는 간접호출을 줄인다.
```javascript
function getRating(driver){
    return moreThanFiveRateDelieveries(driver) ? 2: 1
}
function moreThanFiveRateDelieveries(driver){
    return (driver.numberOfLateDelieveries > 5);
}
// 위에서 아래로 변경
function getRating(driver){
    return (driver.numberOfLateDelieveries > 5) ? 2: 1
}

```