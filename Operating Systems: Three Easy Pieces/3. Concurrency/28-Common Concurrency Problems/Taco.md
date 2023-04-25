어떤 동시성 버그들이 있을까. 그리고 그 버그를 어떻게 핸들링할 수 있을까.

예전에는 데드락 버그에 신경썼지만, 현재는 데드락이 아닌 버그를 연구한다. 
연구에 따르면, 대부분은 데드락이 아닌 버그다. 

## Non-Deadlock Bugs

### 1. Atomicity-Violation Bugs
- 한 스레드와 다른 스레드의 내용이 대치되어 인터럽트가 일어나면 문제가 생기는 것
- 이를 해결하기 위하여, lock과 unlock을 해당 코드 앞뒤로 넣어준다. 

### 2. Order-Violation Bugs
- 상호 의존 코드로 인하여 널포인터 크래시가 일어날 수 있는 현상. 
- 이를 해결하려면 순서를 강제해주어야한다. 
- 조건 변수가 이를 도와줄 수 있다. 

## Deadlock Bugs
데드락은 한 스레드가 락이 된 상태인데 다른 스레드를 기다리고, 그 스레드는 또 이 스레드를 기다리는 상황이다. 
- 데드락이 일어나는 이유: 
  - 큰 범위의 시스템에서 잘 발생한다. 컴포넌트 사이에서 복잡한 의존성이 생겨나기 때문이다.
  - 캡슐화 때문에 발생하기도 한다. 
    - 디테일을 숨기는 실행방식은 모듈화를 하게 되는데, 이 모듈이라는 건 락과 잘 얽혀들지가 않는다. 

- 데드락 조건
  - 상호 배제
  - hold and wait
  - no preemption
  - circular wait
이 네가지가 다 만들어지는 것이 아니면 데드락이 발생하지 않는다. 따라서 우선 이 조건들이 일어나지 않게끔 생각해보는 것이 중요하다.

### 예방
- circular wait
  - 가장 실용적인 예방법. 순서를 지정해줌으로서 예방이 가능하다. (통째로 지정)
  - 만약 그게 어렵다면 부분적으로 순서를 지어주는 것도 유용하다. 
- Hold-and-wait
  - 어떤 스레드가 락을 획득할 시, 모든 락을 한번에 얻어내어서 피할 수 있다. 
  - prevention이라는 락을 붙잡고, 타이밍에 맞지 않는 스레드 스위치가 일어나지 않게한다. 
  - 그러나 이는 어떤 락이 획득되어야하는지 알아야만하고, 한번에 모든 락을 얻어내므로 동시성을 저하할 수 있다. 
- No Preemption
  - unlock 을 호출할 때까지 lock이 획득되었다고 바라보기 때문에, 다양한 락을 획득하는 것은 우리가 이미 가지고 있는 락을 기다릴 때 문제가 생길 수 있다. 
  - trylock과 같이 유연한 방식으로 이 문제를 피해볼 수는 있다.
    - 다른 락을 원할 때, 그 락이 release 되었는지 아닌지 한번 체크해보고 release 되었다면 자신의 lock을 해제하고 그를 획득하게 하는 것이다. 
    - 그러나 이는 livelock 문제를 일으킬 수 있다. 
      - 서로 다른 스레드가 서로의 락을 원하는 것이다. 계속해서 시스템이 운영은 되지만 진행은 되지 않아서 livelock이다. 
      - 이를 해결하기위해 랜덤한 지연 시간을 줄 수는 있다. 
    - 이는 완전하게 선점하는 방식으로 가지는 않지만,(trylock을 대신 사용한다.) 그리고 완벽하지도 않지만 실용적이기는 하다. 
- Mutual Exclusion
  - 상호 배제 가능성을 지워버린다. 
  - CompareAndSwap을 통하여, 락을 얻는 대신 (이 경우 데드락 발생 가능성조차 없다.. but livelock은 가능) 값을 계속 업데이트하게 한다.

### 스케줄링을 통한 deadlock 회피
정적인 스케줄링을 통해서 보수적 접근을 한다. 
그러나 이는 성능과 동시성을 저하한다. 
- 그래서 잘 안쓴다

### 탐지와 회복
주기적으로 탐색하여 그를 하나씩 없앤다. 그냥 부팅을 다시하는 게 더 나은 방법일 때가 있다. 