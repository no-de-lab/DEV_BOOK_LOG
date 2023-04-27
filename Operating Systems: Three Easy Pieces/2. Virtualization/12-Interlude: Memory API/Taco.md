## 메모리 타입
1. stack -> automatic
   - 그저 선언만 하면, 컴파일러가 메모리 할당과 메모리 비할당 모두를 처리해준다.
2. heap -> explicit
   - malloc을 통해서 개발자가 명시적으로 메모리를 할당하고, 메모리를 빼앗는 것도 개발자의 책임이다. 

## malloc이란? 
> malloc(size_t size);
- heap에 올려둘 자리를 요청하는 것이다 (파라미터에 넣을 size만큼)
  - 성공하면 해당 공간에 대한 포인터가 리턴, 
  - 실패하면 NULL이 리턴된다. 
- 굳이 stdlib.h가 필요는 없다. 
  - 컴파일러랑 더블 체크 하는 개념이라 보면 된다. 
- malloc parameter로 넣을 사이즈 타입은 
  - sizeof()를 사용하기도 한다. 이는 컴파일 타임에 결정된다. 
  - 변수를 넣을수도 있지만, sizeof내에 변수를 넣게되면 원하지않는 결과가 나올수도 있다. 
    - > sizeof(int) * 10의 사이즈를 그냥 int 사이즈로 뱉어버릴 수가 있다. 
  - string을 넣을 때에도 주의해야한다. 
  - 그냥 strlen(s) + 1을 할 때와, sizeof()을 할 때는 다르다. 
  - malloc은 void 타입을 반환, 유저로 하여금 타입을 지정하게 한다. 

## free()
heap 메모리를 더이상 사용하지 않을 때, 
parameter에 포인터를 넣어 free해준다.

## 흔한 실수들
현대의 많은 언어들은 garbage collector로 자동으로 힙 메모리를 회수하지만, c는 아니다. 
1. 메모리 할당 까먹음
2. 충분한 메모리 할당하지 않음 : 이 경우 버퍼 오버플로우 발생한다. 
3. 할당 메모리 초기화 까먹기
4. 메모리 누수: free하는 것 까먹기 -> 메모리 run out 
5. 다 쓰기 전에 메모리 free: dangling pointer, crash 유발
6. 지속적인 memory free: double free라고도 하며, crash 유발
7. 잘못 free

## Underlying OS Support
malloc과 free는 system call은 아니고 라이브러리 콜이다. 가상주소 공간에 있는 공간을 관리하지만, 그 자체로는 시스템 콜 위에 만들어진 것이다. 

brk, sbrk가 바로 그러한 시스템 콜이고, 이를 직접 호출할 수는 없다. 

또한, mmap을 통하여 OS로부터 메모리를 얻을 수 있다. 이는 swap space와 연관되어있는, 익명의 메모리 공간을 요청하는 것이다. 
