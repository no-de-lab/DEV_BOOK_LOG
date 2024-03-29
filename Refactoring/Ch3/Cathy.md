## 챕터3 코드에서 나는 악취

클린코드에서 나오는 문제되는 코드 방식?들이 요약된 것 같다.
(클린코드랑 같이 겸해서 봐도 좋을 것 같다?)
그리고 리팩토링 책에 나오는 어떤 방법으로 어떻게 개선할 것이지를 가이드 하는 챕터 같음...


- 기이한 이름: 코드를 명료하게 표현하는 가장 중요한 요소 하나는 바로 '이름'
  - 아래의 리팩토링 방법으로 해결
  - 함수 선언 바꾸기
  - 변수 이름 바꾸기
  - 필드 이름 바꾸기
- 중복코드: 똑같은 구조가 여러번 반복되면 하나로 통합
  - 함수 추출하기
  - 문장 슬라이드하기
  - 메서드 호출하기
- 긴 함수: 함수가 길수록 이해하기 어렵다
  - 함수가 매개변수와 임시 변수를 많이 사용한 경우
    - 임시 변수를 질의 함수로 바꾸기
    - 매개변수 객체 만들기, 객체 통째로 넘기기
    - 함수를 명령으로 바꾸기
  - 추출할 코드 덩어리는 구분
    - 주석 참고 (주석 달만한 부분은 무조건 함수)
    - 조건문 분해, 함수 추출, 조건부 로직 다형성으로 변경
    - 반복문 쪼개기
- 긴 매개변수 목록: 매개변수 목록이 길어지면 이해하기 여러움
  - 매개변수를 질의 함수로 바꾸기
  - 객체 통째로 넘기기
  - 매개변수 객체 만들기

- 전역 데이터
  - 전역 데이터는 코드베이스 어디에서든 건드릴 수 있고, 값을 누가 바꿨는지 찾아낼 메커니즘이 없다는 것이 문제
  - 변수 캡슐화하기 -> 데이터 수정하는 부분을 쉽게 찾을 수 있고 접근을 통제할 수 있다.


- 뒤엉킨 변경: 단일 책임 원칙이 제대로 지켜지지 않을 경우에 나타남
  - 단계 쪼개기
  - 함수 옮기기
  - 함수 추출하기
  - 클래스 추출하기 등으로 개선
- 산탄총 수술: 자잘하게 수정해야 할 클래스가 많을 때, 변경할 부분이 코드 전반에 있다면 수정할 곳을 찾기 힘들다
  -  함수 옮기기, 필드 옮기기로 함께 변경되는 대상을 모듈에 모음

- 기능 편애: 다른 모듈의 함수나 데이터와 상호작용 비중이 높을 때
  - 다른 모듈과 상호작용 되는 부분을 추출하여 함수화, 제 기능에 맞도록 재배치