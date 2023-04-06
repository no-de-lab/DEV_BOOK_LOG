어떻게 Lock을 자료구조에서 사용할 것인지:: 이는 자료구조의 정확성과 성능에 영향을 미친다.

## Concurrent Counters
가장 간단한 자료 구조: 카운터
흔히 쓰이고, 간단한 인터페이스를 가지고 있다. 

### 간단하지만, 확장성은 없다.
여러 스레드로 확장이 불가하다. 
- 정확하기는 하다. 
  - 싱글 락을 추가
  - 모니터와 비슷하다. 
  - 그러나, 확장하기는 어렵다. 확장하면 더 느려진다.

### 확장성있는 counting?
몇년간의 연구 끝에 확장성있는 카운터를 만들기는 했다.
그는 approximate counter다.
- single logical counter를 여러 local 물리 카운터를 통하여 표현한다. 
- 하나의 전역 카운터가 있고, 그에 딸린 여러 logical counter가 있다. 
- 전역 lock을 획득하고 로컬 카운터의 값을 더하며 주기적으로 로컬 카운터의 결과를 전역 카운터에게 전달한다. 
  - 그 다음, 로컬 카운터는 0으로 리셋된다.
- threshold S에 의해서 local-to global이 자주 발생할지 말지가 결정된다. 
  - S가 작을수록, 더 자주 카운터가 확장성없는 카운터처럼 굴게된다. 
- 결국 정확도를 더 높일지, 확장성을 더 높일지 결정해야한다. 

## Concurrent Linked Lists
조금 더 복잡한 구조인 연결리스트는, insert할 때 lock을 획득하고, exit할 때 내어준다. 
- 만약 malloc이 실패하면 insert가 실패하기 전에 lock을 내어주어야한다. 
- exit는 lookup에서만 하도록 만들며 버그를 줄인다. malloc이 스레드-안전하다는 가정으로, 동시적 버그를 일으키지 않는다 생각하고 공유되는 리스트에서의 업데이트만 락을 획득하게 한다.

### Scaling Linked Lists
연결 리스트 또한 확장성이 없다. 연구진들이 이를 위해 연구한 hand-over-hand locking이라는 방식이 있기는 하다. 
- 전체 리스트에서 single lock 을 가지는 것 대신에, list의 각 노드마다 lock을 추가한다. 
- list를 순회할 때, 다음 노드의 lock을 잡고, 원래 잡고있던 lock을 놓는 식으로 진행한다.
- 이는 높은 동시성을 가능하게 하지만, 빠르게 만들기는 어렵다. 

## Concurrent Queues
big lock을 추가하는 것이 동시 자료 구조의 기본 방법이었다. 

대신, 여기에는 두개의 lock이 있다. 
- 하나는 head, 다른 하나는 tail
- 이는 한 방향으로만 enqueue, dequeue가 일어나게끔 한다. 
- 멀티 스레드 애플리케이션에 많이 사용되지만, 이러한 타입의 큐는 완전히 그 요구사항에 맞지는 않는다. 

## Concurrent Hash Table
resize를 하지않는 해시 테이블만 다룬다. 
- 전체 구조에 single lock이 있는 것이 아니라, hash bucket마다 lock이 걸려있다.
  - 그래서 확장성이 좋다. 
