다양한 동시성 문제를 해결하기 위하여, lock과 조건 변수 모두를 사용해야한다. 
이를 처음으로 인식한 사람들 중 하나는 다익스트라다. 그는 이윽고 세마포어라는 것을 만들었다. 

세마포어로, lock과 조건 변수 모두로 사용할 수 있다. 

그렇다면 세마포어란 무엇이고, 어떻게 그를 사용하는가? 

## 세마포어 정의
정수값을 가진 개체다. 
- wait, post라는 루틴으로 작동 가능하다. 
- 세마포어의 초기 값이 그의 행동을 결정하므로, 초기화를 시켜야한다. 
- 만약 1로 정의되면 lock, 0으로 정의되면 조건 변수로서 사용된다. 
- wait은 consumer, post는 producer같은 것이라 생각하면 된다.
- 세마포어 값이 음수라면, 그는 기다리고 있는 스레드 수를 가리킨다.

## binary semaphores(Locks)
락은 1아니면 0의 값을 가진다. 그래서 binary다. 

## semaphores for ordering
이벤트 순서를 따질 때 세마포어가 중요하게 작동한다. 
이는 마치 조건변수의 작동방법과 같다.

## The producer/consumer problem
두개의 세마포어: empty와 full로 문제를 해결하고자 하는데, 다양한 producer와 consumer들이 있을 때 race condition에 빠질 수 있다. 
ex. 두개의 producer가 거의 동시에 put을 실행하고자 한다면? 

인터럽트가 실행 중간에 일어나게 되고, overwritten 되게 된다.
상호 배제 코드를 producer, consumer 코드에 넣어주어도 락 소유 타이밍에 의하여 deadlock이 발생할 수 있다.
