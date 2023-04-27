# Interlude: Process API

프로세스 생성 & 제어 방법
기능, 사용 편의성, 고성능 구현하려면 인터페이스를 어떻게 설계해야 할까? 

UNIX는 시스템 호출 한 쌍으로 새 프로세스를 생성하는 방법 중 하나는 
`fork()` 와 `exec()`이다. 
wait()는 자신이 생성한 프로세스가 완료될 때까지 기다리려는 프로세스에서 사용할 수 있습니다.

## The fork() System Call

fork()는 프로세스 생성에 사용되는 System Call이다. 

fork 함수를 호출하는 프로세스는 부모가 되고 새롭게 생성되는 프로세스는 자식이 된다.
(= 동일 프로그램에서 부모 프로세스로가 자식 프로세스를 생성)
생성된 자식 프로세스는 부모 프로세스의 메모리를 그대로 복사하여 가지게 된다.

```

int main(int argc, char *argv[]) {
  printf("hello world (pid:%d)\n", (int) getpid());
  int rc = fork(); // 자식이 호출되고, 부모 프로세스를 복사 호출한 시점 부터 실행한다.
  if (rc < 0) {
    // fork failed
    fprintf(stderr, "fork failed\n");
    exit(1);   
  } else if(rc == 0){
    // child (new process) 자식 프로세스 실행 부분
    // 자식 프로세스의 rc값은 0으로 초기화
    printf("hello, I am child (pid:%d)\n", (int) getpid());   
  } else {
    // parent goes down this path (main)
    printf("hello, I am parent of %d (pid:%d)\n",
        rc, (int) getpid());
  }
  return 0;
}

```

```
prompt> ./p1 // 처음 main 실행
hello world (pid:29146)
hello, I am child (pid:29147)
hello, I am parent of 29147 (pid:29146)
prompt>


prompt> ./p1 // 두번째 main 실행
hello world (pid:29146)
hello, I am parent of 29147 (pid:29146)
hello, I am child (pid:29147)
prompt>

```
위 코드를 실행하여 알 수 있는 점은

- fork() 는 부모를 똑같이 copy 하지 않는다. 
하나의 프로세스에서 fork()를 호출함으로써 2개의 프로세스를 실행하게 되었기에
자식 프로세스는 별개의 프로세스로서 독립적으로 작동해야 하기 때문에 주소 공간, 레지스터는 당연히 부모와 다른 값을 가진다.
자식 프로세스는 부른 시점에서 실행되기에 main() 첫 줄에 있는 로그를 실행하지 않는다. 

- 어떤 프로세스를 실행할지에 대해서 결정적이지 않다. (Nondeterminism)
CPU Scheduler의 구조가 상당히 복잡하고, 그 순간 적당하다고 판단한 프로세스를 실행하기 때문에 자식의 명령을 먼저 실행할지, 부모의 명령을 먼저 실행할지는 알 수 없다고 한다.
> Nondeterminism 는 멀티쓰레드에도 영향가는 문제

[프로세스 API](https://newdevlog.tistory.com/13)
[fork()](https://codetravel.tistory.com/23)

## The wait() System Call


```
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(int argc, char *argv[]) {
  printf("hello world (pid:%d)\n", (int) getpid());
  int rc = fork();
  if (rc < 0) {
    // fork failed
    fprintf(stderr, "fork failed\n");
    exit(1);   
  } else if(rc == 0){
    // child (new process)
    printf("hello, I am child (pid:%d)\n", (int) getpid());   
  } else {
    // parent goes down this path (main)
    int rc_wait = wait(NULL); 
    printf("hello, I am parent of %d (rc_wait:%d) (pid:%d)\n", rc, rc_wait, (int) getpid());
  }
  return 0;
}

```

`wait()` 은 이전 프로세스의 실행이 완료 될 때까지 현재 프로세스의 실행을 지연시키는 것이다. 
> async & await
위 코드에 wait() 호출을 추가하면서 비결정적(Nondeterminism)이던 출력이 결정적이 된다.


## The exec() System Call
`exec()`은 다른 프로그램을 실행하려는 경우 유용하다. 

```
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main(int argc, char *argv[]) {
  printf("hello world (pid:%d)\n", (int) getpid());
  int rc = fork();
  if (rc < 0) {
    // fork failed
    fprintf(stderr, "fork failed\n");
    exit(1);   
  } else if(rc == 0){ // child (new process)
    printf("hello, I am child (pid:%d)\n", (int) getpid());   
    char *myargs[3];
    myargs[0] = strdup("wc"); // program: "wc" (word count)
    myargs[1] = strdup("p3.c"); // argument: file to count
    myargs[2] = NULL; // marks end of array
    execvp(myargs[0], myargs);  // runs word count 
    printf("this shouldn’t print out");
  } else {
    // parent goes down this path (main)
    int rc_wait = wait(NULL);
    printf("hello, I am parent of %d (rc_wait:%d) (pid:%d)\n", rc, rc_wait, (int) getpid());
  }
  return 0;
}
```

fork() 호출에 특이점이 있다. exec()아래는 출력이 되지 않는다? 

`execvp(myargs[0], myargs);` 해당 실행 파일에서 코드(및 정적 데이터)를 로드하고 현재 _코드 세그먼트를 덮어_ 쓰고 힙과 스택 및 프로그램 메모리 공간의 다른 부분을 _다시 초기화_ 합니다. 
> 자식이 복사한 부모 프로세스가 실행 프로세스로 덮인것
> `exec()`는 fork() 처럼 새로운 프로세스를 위한 메모리를 할당하지 않고, exec()에 의해 호출된 프로세스를 메모리에 남게한다. 

때문에 자식 프로세스 안에서 exec() 호출하면 exec()아래 복사된 부모 프로세스는 실행되지 않는 것과 같다. 




## exec과정과 fork과정을 분리하는가?
I/O redirection 과 Pipe와 같이 많은 기능들을 구현할 수 있기 때문이다. 
[fork() & exec()](https://woochan-autobiography.tistory.com/207)