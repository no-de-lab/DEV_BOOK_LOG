cpu도 메모리도 추상화 과정을 통하여 우리는 더 쉽게 공간을 사용하였다. 

그 중 스레드는 또 다른 종류의 추상화다. 이 스레드는 프로세스 내에서 실행 지점을 여러개를 가져가게 되는데, 주소 공간과 데이터는 공유한다. 
context switch 개념도 프로세스와 비슷하기는 한데, thread control blocks가 필요하다. 그리고 주소 공간은 똑같이 유지되어서 페이지 테이블의 스위치 같은 것들이 필요하지 않다. 

그리고 스택도 여러개로 나누어진다. 

## Why use Treads?
- 병렬성. 더 빠르게 프로그램을 돌리게 한다. 
- 느린 i/o로 인한 블록되는 프로그램 프로세스를 피할 수 있다. 기다리는 대신에, 프로그램이 다른 스레드로 스위치가 가능하다. 

## An Example
먼저 생성된다고 먼저 실행되지는 않는다. OS 스케줄러에 의해 결정된다. 
더 상황이 복잡해진다고 할 수 있다. 

## Why It Gets Worse: Shared Data
- race condition으로 인하여, 여러 개의 스레드로 같은 코드를 돌렸는데 매번 같은 결과가 나오지가 않는다. 
## The Heart of the problem: Uncontrollef Scheduling
- 이는 race condition으로 인하여, indeterminate한 결과를 얻게 된다. 
- 이 스레드들은 critical section에서 동일한 변수에 함께 접근하게 된다 볼 수 있는데, mutual exclusion이 일어나지 않았기 대문에, 문제가 발생한 것으로 파악해볼 수 있다. 

## The Wish For Atomicity
이를 해결하지 위한 방법으로는 일단 atomically하게 명령어를 수행하도록 하드웨어가 보장하는 것이다. 

하드웨어와 OS의 합작으로, 동기화된 primitives를 만들어낸다. 

## One More Problem: Waiting For Another
하나의 스레드가 도는 동안 다른 스레드는 기다리거나 잠을 자게 되는데, 어떻게 이를 다시 깨우게될지에 대한 것도 생각해보아야한다.