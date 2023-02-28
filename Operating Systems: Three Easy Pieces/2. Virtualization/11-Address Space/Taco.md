## 초반 시스템
메모리가 추상화되지 않았고, OS는 그저 라이브러리일 뿐이었다. 

## 멀티프로그래밍과 시분할 
멀티프로그래밍의 시대가 되면서, os는 프로그램들 사이를 잘 스위칭해주어야했다. 
그래야 효과적으로 cpu 사용을 할 수가 있었다. 

사람들은 시분할을 요구하기 시작했다. 많은 이들이 대화형 작업을 중시하였다.

이 시분할을 구현하기위한 방법 중 하나는, 
- 하나를 짧게 쓰고 모든 메모리 접근을 하게 하는 것이다. 

그 이후 그를 디스크같은 곳에 상태를 저장하고 다른 프로세스의 상태를 로드한다. 불행하게도 이는 메모리 크기가 커질수록 너무 느려졌다. 그래서, 그냥 메모리에 프로세스를 남겨두고 OS가 사이사이에 시분할을 효율적으로 하는 방식으로 발전했다. 
이는 프로세스 사이 보안에 신경쓰게 되는 계기가 되었다. 

## 주소 공간
OS가 물리적 매모리를 추상화해서 사용하기 쉽게 하기를 요구하는 유저들이 있었다. 

이 추상화를 주소 공간이라하며,이는 시스템에서 돌고있는 프로그램의 메모리 뷰다. 
이 추상화된 메모리를 이해하는 것은 메모리가 어떻게 가상화되는지 이해하는 단서가 된다. 

프로세스의 주소 공간은 모든 메모리 상태를 포함한다. 
- code: 메모리 어딘가에 있어야 한다.따라서 주소 공간 안에 있다. 
- stack: 프로그램이 도는 동안 지역 변수와 함수를 트래킹하기위해 사용. 
- heap: 동적할당, malloc, new와 같은 ! 

코드는 정적이다. 1Kb 정도의 공간을 차지한다. 따라서 주소공간 제일 위에 올려놓을 수 있다. 
힙과 스택은 그 아래 양 끝단에 위치한다. 이는 그러나 그저 convention이고, 원한다면 다른 방식으로도 구성할 수 있다. 
그러나 이렇게 주소 공간을 묘사하는 것은 추상적이지는 않다. 사실은 임의의 물리적 주소에 프로그램을 올려두었을 것이다.

그래서, 어떻게 이 추상화를 이루어내는지는 고민거리이다. 
이것을 OS가 해낼 때, 우리는 os가 메모리를 가상화한다고 한다.

## 목표
가상 메모리의 목표는 투명성이다. 돌아가는 프로그램은 이를 알면 안된다. 그것이 사적인 물리적 메모리에 위치한다고 느끼게 하여야한다. 

다른 목표는 효율성이다. 
시간과 공간에 관련하여, 효율적이어야한다. (ex. TLB 사용)

마지막으로 보호가 중요하다. 다른 프로세스로부터 Os를 보호하고 프로세스들끼리 isolation이 있어야한다. 