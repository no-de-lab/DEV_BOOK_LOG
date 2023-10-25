## 1. 변수 쪼개기
변수에 값을 여러 번 대입하는 것을 피해야한다.

## 2. 필드 이름 바꾸기
이름이 중요하다. 

## 3. 파생 변수를 질의 함수로 바꾸기
가변 데이터는 소프트웨어에 문제를 쉽게 일으킨다. 서로 다른 두 코드를 이상한 방식으로 결합하여 한쪽 코드에서 수정한 값이 연쇄 효과를 일으켜 다른 쪽 코드에 원인 불명의 문제를 야기하기도 한다. 이를 해결하려면 값을 쉽게 계산해낼 수 있는 변수들을 모두 제거할 수 있다. 


```java
get discountedTotal(){return this._discountedTotal;}
set discount(aNumber)
{
    const old = this._discount;
    this._discount = aNumber;
    this._discountedTotal += old - aNumber;
}

get discountedTotal(){return this._baseTotal - this._discount;}
set discount(aNumber){this._discount = aNumber;}

```

## 4. 참조를 값으로 바꾸기
객체를 다른 객체에 중첩하면 내부 객체를 참조하거나 값으로 취급할 수 있다. 
새로운 속성을 담은 객체로 기존 내부 객체를 통째로 대체하는 것이다. 

이를 위해서는 setter를 제거할 필요가 있다.