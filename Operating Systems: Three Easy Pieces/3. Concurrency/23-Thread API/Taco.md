OS는 어떻게 스레드를 생성하고 제어할 것인가? 

## Thread Creation
- 새로운 스레드를 만들어내는 작업이 필요하다. 
- > int pthread_create(pthread_t* thread, const pthread_attr_t* attr, void *(*start_routine)(void*), void* arg)
- thread 구조체 포인터: thread
- attr: 해당 스레드가 가지고 있어야하는 속성들 특정
- void *(*start_routine)(void*): 스레드가 실행되는 함수 특정. 
- arg: 스레드가 시작하는 함수에 전해질 arg

이렇게 스레드를 생성했으면, 시작할 준비가 되었다. 

## Thread Completion
만약 스레드를 complete 하고 싶어진다면, pthread_join을 호출해야한다. 
- int pthread_join(pthread_t thread, void *value_ptr);
- thread: 기다리고 있는 스레드, 스레드 생성할 때 보았던 그 스레드다. 
- value_ptr: 돌려받고자 하는 값, 포인터로 전달해야하는 이유는 pthread_join 과정에서 값을 바꾸게 되기 때문이다. 
- create join이 항상 함께올 필요는 없다: 프로시져 콜로 대신할 수 있다. 더 쉽다 심지어. 
- 병렬 프로그램에서는 join을 잘 사용한다. 

## Locks
critical section이 있을 때, 여러 스레드 중 하나가 lock 을 선언한다. 
- 적절히 초기화를 해주지 않거나 
- 에러를 제대로 체크해주어야한다. 

## Conditional Variables
- wait, signal 등으로 스레드 간에 시그널을 주어야할 때 유용하다. 
- 어떤 한 스레드가 lock이 걸려 있어야한다. 
- 계속해서 while문으로 체크한다. 
- 이렇게 말고 그저 flag로 표기하고싶어질수도 있지만, cpu 사이클을 그저 낭비한다거나 에러가 쉽게 발생할 수 있다. 

 