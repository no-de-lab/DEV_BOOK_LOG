# SOLID
- 좋은 아키텍쳐를 만들기위한 원칙
- 중간 수준의 소프트웨어(모듈 수준의 작업)가 변경하기 쉽고ㅡ 이해하기 쉽고, 어디든 pluggable할 수 있게끔 하는데 목적이있다.

## SRP 단일 책임 원칙
- 단일 모듈의 변화이유는 단 하나여야한다. -> 하나의 사용자 및 이해관계자를 위하여 사용돼야한다. <비즈니스적인 의미가 강하다>
- 프론트엔드에 적용할만한 지점: 데이터를 보여주는 모듈/데이터 Fetching/데이터 상태 처리 모두 분리

## OCP 개방 폐쇄 원칙
- 소프트웨어의 구성요소는 확장에는 열려있고, 변경에는 닫혀있어야한다.
- 비용을 최소화하고 생산성을 최대화하는 아키텍쳐의 목표를 달성하기 위해, 변경을 최소화 하는 (비용) 데 도움을 준다.
- 프론트엔드에 적용할만한 지점: 프로퍼티를 추가함으로서 확장을 돕고, 컴포넌트 합성을 통해 변경을 최소화한다.

## LSP 리스코프 치환 원칙
- Consume하는 애플리케이션이 상위 객체를 호출하든, 하위 객체를 호출하든 타입에 의존하지 않는 것.
- 프론트엔드에 적용할만한 지점: TS Interface 사용시, 개념만 이용할 수 있을 것으로 보임

## ISP 인터페이스 분리 원칙
- 필요 이상을 포함하는 모듈에 의존을 피해야함.
- 프론트엔드에 적용할만한 지점: Interface 내 필요한 요소만 전달받는 게 아니라 전체를 전달받을 때, 확장성이 사라지므로, 필요한 Props만 전달하는 것이 좋음.

## DIP 의존성 역전 원칙
- 고수준 모듈이 저수준 모듈의 구현에 의존해서는 안된다.
- 구체적인 함수나 클래스가 아니라, 인터페이스 등의 추상화에 의존해야한다.
- 프론트엔드에 적용할만한 지점: 단순한 onSubmit같은 함수도, 상위 모듈에서 Props로 전달받는 식으로 변화시켜 컴포넌트에서 직접 함수를 관리하지 않게끔한다.

개인적으로 굉장히 도움 많이 받은 글: 
[SOLID Principle in React](https://medium.com/dailyjs/applying-solid-principles-in-react-14905d9c5377)
