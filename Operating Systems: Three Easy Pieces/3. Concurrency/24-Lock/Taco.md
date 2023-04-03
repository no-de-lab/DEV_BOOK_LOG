문제 상황: 인터럽트 상황에서, 일련의 명령어를 원자적으로 실행하고싶지만 쉽지않다. 그래서, lock이라는 것으로 이를 해결하고자 한다. 

## Basic Idea
> lock() : lock을 얻는 시도

- 다른 스레드가 lock을 잡고있지 않으면, 스레드가 락을 얻고 critical section 안으로 들어간다.
- 이 경우 다른 스레드가 lock을 호출했을 때, 아무것도 return 되지 않는다. 

> unlock(): lock을 가진 스레드가 unlock을 하게되면, 이제 lock은 사용 가능하게된다.

- 기다리고 있는 스레드가 있었다면, lock을 가지게된다. 

## Pthread Locks
POSIX 라이브러리가 사용하는 lock 이름은 mutex이다. 그것이 mutual exclusion을 제공하는 데 사용되기 때문이다. 

## Building a Lock
어떻게 lock을 만들어낼 것인가:: 하드웨어와 Os 모두의 도움이 필요하다. 

## Evaluating Locks
lock을 어떻게 build 할지에 대한 고민 이전에, 어떤 기준으로 lock을 평가할지를 생각해보아야한다. 
1. mutual exclusion
2. fairness
3. performance
   - single thread, multiple threads 일 때의 성능

## Controlling Interrupts
mutual exclusion 을 제공하기위한 가장 초기의 방법은, 인터럽트를 불가하게 만든 것이다. 
이는 간단하다는 장점이 있지만, 
1. 한 스레드에 특권을 주어서, 잘못하면 greedy program이 프로세서를 독점할 문제가 있고, 
2. 멀티 프로세서에서는 작동하지않으며, 
3. 발생해야할 인터럽트가 갈 길을 잃고
4. 비효율적이라는 문제가 있다.

## Failed Attempt: Just Using Loads/Stores
인터럽트 기반 기술에서 벗어나, lock을 build하기 위하여 cpu 하드웨어와 명령어에 의존해야한다. 
- flag variable을 이용하는 방법
  - flag가 1이면 lock
  - 아니면 spin-wait
  - 정확도가 떨어지고(만약 동시에 스레드가 flag를 1로 설정한다면? ) spin wait는 성능이 좋지않다. 

## Building Working Spin Locks with Test-And-Set
하드웨어지원:: old value를 테스트하고, 새로운 value로 동시에 set한다. 
- spin lock이라 불린다. 가장 간단하게 만들 수 있는 lock
- cpu cycle을 이용
- 선점 스케줄러를 필요로 한다. 

## Evaluating Spin Locks
- 정확도가 제일 중요하다 : mutual exclusion 
- 공정함도 중요하다. 
  - spin lock은 공정하지는 않다.
- 성능
  - single cpu:: 