## 컴포넌트란
- 배포할 수 있는 가장 작은 단위
- 컴파일형 -> 바이너리 파일의 결합체
- 인터프리터형 -> 소스파일의 결합체
- 잘 설계된 컴포넌트의 정의: 독립적으로 배포 가능한(개발 가능한) 환경을 갖춘 것.

## 컴포넌트의 역사
- 옛날 옛적에는 메모리에서 프로그램이 로드될 주소를 직접 제어했다. 
- 라이브러리 코드의 위치도 직접 제어했기에, 애플리케이션의 코드와 라이브러리 코드의 메모리를 서로 제어하는 것이 쉽지가 않았다.
- 메모리에서 관리하는 것이 아니라, 외부 링크로 연결하는 방식이 발전되었지만 이 또한 속도가 몹시 느렸다.
- 그러나 점차 기술이 발전(무어의 법칙)했고, 링크와 로드를 동시에 할 수 있게 되었으며, 결과적으로 컴포넌트 플러그인 아키텍쳐가 탄생했다.
- 런타임에 플러그인 형태로 연결 가능한 동적 링크 파일이 바로 컴포넌트라고 보면 된다.

## 컴포넌트 응집도
: 어떤 클래스를 어떤 컴포넌트에 포함시킬지에 대한 고민을 해결하는 세가지 판단 기준
- REP: 재사용 == 릴리즈 단위
- CCP: 동일한 이유와 시점에 변경되는 클래스를 같은 컴포넌트에 묶기
- CRP: 필요하지않은 컴포넌트 사용하지 않게하는 원칙
-> 이 원칙들은 서로 상충된다. REP-CCP: 포함원칙, CRP: 배제 원칙
- 서로 보완하며 견제할 방법을 찾아내야한다.

REP-CRP에만 중심을 두게되면, 사소한 변경이 생겼을 때 너무 많은 변화가 필요하다.
CCP-REP는 너무 릴리즈가 많아진다.
현재 개발 상황에 맞게 원칙을 다르게 선택해야한다.


## 컴포넌트 결합
컴포넌트 사이의 관계를 설명하는 세 원칙
- ADP: 의존성 비순환 원칙, 컴포넌트 의존성 그래프에 순환이 있어서는 안됨. 개발 환경을 릴리즈 가능한 컴포넌트 단위로 분리. 결국 변동성을 격리해야. 이러한 컴포넌트 구조는 하향식으로 설계될 수 없고, 점차적으로 발전돼 나가야함.
- SDP: 안정된 의존성 원칙. 더 안정적인 쪽에 의존해야하는 원칙
: 안정성이란? X에 의존하는 다른 컴포넌트들이 있어 변경되지말아야할 이유가 있을 때. 
- 모든 컴포넌트가 안정적일 수는 없다. 

-SAP: 안정된 추상화 원칙: 컴포넌트는 안정된 만큼만 추상화되어야한다. 
안정성과, 추상성 사이의 지표(주계열) 비율을 적당히 맞추어야한다.
