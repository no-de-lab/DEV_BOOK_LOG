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
  - single cpu:: 성능 오버헤드. 만약 선점형이라면 매번 cpu를 돌려주어야한다. 
  - multiple:: 성능이 나쁘지않다. 

## Compare-And-Swap
SPARC라고도 불리우는 compare-and-swap
- test-and-set과 비슷한 lock을 만들 수 있다. 그러나 더 효과적이다. 

## Load-Linked and Store-Conditional
- load-linked는 그냥 메모리에서 값을 fetch해서 레지스터에 올리는 것이지만
- store-conditional은 성공하면 1을 반환하지만 아니라면 값이 변하지않는다. 

## Fetch-and-add
마지막 하드웨어 primitive. 
- 원자적으로 값을 증가시킨다.
- 티켓이라는 것을 주어서 lock을 build할 때 함께 사용된다. 
- 이 티켓은 자신의 차례를 보장하게된다. 

## Too much spinning: What Now?
- 때로는 비효율적이다. 계속 spin 하며 lock을 기다리는 스레드의 입장은.
- 그래서 어떻게 필요없이 spin하는 것을 막아볼 수 있을까? OS의 도움이 필요하다. 

## A Simple Approach: Just Yield
spin 할 것 같으면 그냥 cpu를 다른 스레드에 넘겨준다. 
- yield는 running-> ready로 바꾸고, 다른 스레드가 run하게 한다. 
- 그러나, 이는 context switch가 상당할 거라는 것을 예측하지 못했다. 
- 더불어, 기아 문제도 있다. 

## Using Queues: Sleeping Instead Of Spinning
- Solaris
  - park()로 스레드를 sleep하게 하고, unpark로 깨운다. spin 대신에. 

## different Os, Different Support
- Linus는 futex를 제공
  - park처럼 futex_wait를 제공한다. 

## Two-Phase locks
spinning 도 lock이 플릴 때쯤에 쓸모가 있다. 그래서 first phase에서는 lock이 한동안 spin하게 된다. 
그러나 이 때동안 lock을 얻지 못하면, sleep하게 된다. 
- hybrid approach