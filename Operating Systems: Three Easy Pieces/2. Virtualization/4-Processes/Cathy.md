# The Process
프로세스는 실행 중인 프로그램이다.


OS의 역할 중 물리적 리소스인 CPU를 가상화 한다. 
한 프로그램을 실행했다 멈추고, 다음 프로그램을 실행했다 멈추는 식으로 여러 프로그램이 동시에 실행되는 착각을 준다. 
이러한 기술을 _time-sharing_ 이라고 한다. 
이것에는 잠재적인 비용이 있는데, 성능이다. 
실행하는 프로그램이 늘어 날 수록, CPU 공간을 차지하기에 각 프로세스가 더 느리게 실행된다. 

CPU 가상화를 위해 OS는 low-level machinery(메커니즘) 와 high-level intelligence 둘 다 필요로 한다.
메커니즘은 필요한 기능을 구현하는 낮은 수준의 메서드 또는 프로토콜을 말하며, 이를 로우레벨 기계 메커니즘(low-level machinery mechanisms)이라고 부른다.

> 예를 들어 다른 브라우저를 보기위해서 키보드나 마우스 클릭으로 이동하는데 이렇게 기계에 인풋 하는것도 저수준 기계식 메커니즘이라고 생각하면 될까? 
  [기계 메커니즘](https://cadofrainbow.tistory.com/82)

- low-level machinery(메커니즘)
  - time-sharing mechanism
    context switch - OS가 cpu에서 실행하는 프로그램을 멈추고 다른 프로그램을 실행할 수 있도록 한다. 


이러한 메커니즘 외에도 OS에는 정책이라는 형태의 인텔리전스(high-level intelligence)가 있다. 
정책은 OS 내에서 어떤 종류의 결정을 내리기 위한 알고리즘입니다. 


## The Abstraction: A Process

프로세스를 구성하는 요소를 이해하려면 machine state, 머신 상태를 이해해야한다. 
머신 상태의 중요 요소
- memory
  프로그램을 실행하는데 필요한 명령어와 데이터는 메모리에 있다. 메모리(주소공간)는 프로세스의 일부이다.
- 레지스터(register)
  CPU가 프로그램의 실행 흐름을 제어하거나 상태를 저장하기 위해 사용된다.
  - 프로그램 카운터(PC, Program Counter) : 다음에 실행할 명령어의 주소 저장
  - instruction pointer: CPU가 처리해야하는 명령어의 '주소'를 나타내는 레지스터 
  - stack pointer: 스택 영역에 함수를 구분하기 위해 생성되는 공간으로서 Parameters, Return Address, Local variables를 포함하고 있으며, 함수 호출 시 생성되고 함수가 종료되면서 소멸

프로그램은 영구 저장 장치에도 접근한다. 이러한 입출력 정보에는 프로세스가 현재 열려 있는 파일 목록이 포함될 수 있다. 


[레지스터](https://plummmm.tistory.com/113)
[컴퓨터구조](https://dheldh77.tistory.com/entry/%EC%BB%B4%ED%93%A8%ED%84%B0%EA%B5%AC%EC%A1%B0-%EB%A0%88%EC%A7%80%EC%8A%A4%ED%84%B0Register)