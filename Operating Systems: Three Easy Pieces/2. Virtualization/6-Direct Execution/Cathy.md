Time Sharing 기법으로 CPU 가상화를 구현하는데 고려사항이 있다.
- 성능: 시스템에 과도한 오버헤드를 추가하지 않고 가상화를 구현할 수 있을까
- 제어: CPU에 대한 제어권을 유지하면서 프로세스를 효율적으로 실행할 수 있을까
제어를 유지하면서 고성능을 확보하는 것은 운영 체제 구축의 핵심이다.

> 이 챕터에서는 제어를 통해 CPU를 효율적으로 가상화하는 방법을 알아볼 듯 함

## Basic Technique: Limited Direct Execution

Direct Execution 
- 프로세스 목록에 프로세스 항목을 생성
- 일부 메모리를 할당
- 프로그램 코드를 디스크에서 메모리로 로드
- entry point로 이동
- 코드 실행

프로그램 실행에는 `Direct Execution` 기술이 있다. 
이 방법은 간단하지만 제어할 수 없다는 점에서 몇 가지 문제를 야기한다.
  - OS가 프로그램을 효율적으로 원하는 작업을 _제대로_ 실행하는 것을 확인 할 수 있는가?
  - 프로세스를 실행 중일 때 OS가 어떻게 time-sharing을 구현할 수 있을까?

OS가 프로세스를 제어 할 수 없다면 단지 라이브러리에 불과할 뿐이며, CPU 가상화를 구현 할 수 없다. 
CPU의 가상화를 위해 프로세스를 제어할 수 있도록 시스템을 구축해야한다.

## Problem #1: Restricted Operations
프로세스는 I/O 및 기타 제한된 작업을 수행할 수 있어야 하지만 프로세스에 시스템에 대한 완전한 제어권을 부여하면 안된다.
이를 위해 OS와 하드웨어가 어떻게 함께 작동할 수 있을까요?

다양한 실행 모드
- 사용자 모드
실행되는 코드는 수행할 수 있는 작업이 제한, I/O 요청을 발행할 수 없으며, 예외 상황시 OS가 프로세스를 종료할 수 있음

- 커널 모드
실행되는 코드는 I/O 요청을 발행하고 모든 유형의 제한된 명령을 실행하는 등 권한있는 작업을 수행한다.

> 하지만 사용자 모드에서 어느 정도의 파일 접근을 허용하고 싶다면? 
사용자 모드에서 제한적으로 System call을 사용 할 수 있도록 해준다.
사용자 모드에서 System call을 실행하기 위해서는 `trap` 이라는 특수한 명령어가 실행 되어야한다. 

- `trap` 실행
- 커널로 이동하여 권한 수준을 사용자 모드 -> 커널 모드로 전환
- 필요 작업 수행
- `return-from-trap` 호출
- 커널 모드 -> 사용자 모드로 전환

주의 할 점은 OS가 `return-from-trap` 을 올바르게 호출 할 수 있도록 호출자의 레지스터를 충분히 저장해야한다. 
이를 위해 프로세서는 프로그램 카운터, 플래그 및 기타 몇 가지 레지스터를 프로세스별 `kernel stack`으로 푸시한다.
`return-from-trap` 은 커널 스택에서 값을 꺼내 사용자 모드 프로그램으로 재실행한다. 


트랩이 OS 내부에서 어떤 코드를 실행할지 어떻게 알 수 있을까요? 
OS는 부팅하는 시점에서 `트랩 테이블`을 세팅한다. 그 안에는 `system-call number`이라는 번호가 정의된 함수들이 있다. 
`트랩 핸들러`가 저장된 