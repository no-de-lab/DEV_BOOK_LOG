HDD의 지배 내 몇 십년 후, 새로운 형태의 영구 메모리가 세상에 나왔는데, 그는 solid-state storage라고 불린다. 

메모리나 프로세서들처럼 트랜지스터로 구성이 되었지만, 영구 메모리다. 

그 중에서도 플래시에 집중할 것이다. 
- 플래시는 주어진 청크를 쓰려면 더 큰 청크를 지워야하고 (비싸다)
- 너무 자주 쓰면 wear out된다. 

해당 문제를 해결해야한다.

## 1. Storing a Single Bit
플래시 칩은 1개 혹은 그 이상의 비트를 single transistor에 저장하도록 설계되었다. 
- single-level cell flash에는 하나의 비트만이 트랜지스터 안에 저장되어있고
- MLC (Multi) 는 2개의 비트
- triple-level도 있다.

SLC 칩이 제일 성능도 좋고 비싸다.

## 2. From Bits to Banks/Planes
flash chips는 Bank or Planes로 구성된다. 
뱅크는 두개 사이즈 단위로 접근된다 : 블록과 페이지 
- 각 뱅크에는 많은 블록이 있고, 블록 안에는 많은 페이지가 있다. 

이런 블록과 페이지의 구분은 기본 operation에도 중요하고, 전반적인 성능에도 영향을 미친다. 

## 3. 기본 flash Operations
- read
  - fast
  - random access
- erase
  - 무언가를 쓰려면 모든 블록을 지워야 한다. 
  - 그래서 이는 좀 비싸다.
- program
  - 모든 블록이 지워지고 나서야 쓸 수 있는 상태
  - erase보다는 빠르지만 read 보단 느리다.
  - 1-> 0로 바꿀 수 있다.
- 상태들
  - 시작할 땐 INVALID
  - 지워질 땐 ERASED
  - 몇몇이 바뀌면 VALID

### 몇몇 페이지만 바꾸고 싶어도 블록을 지워야하므로, 원래 잘 쓰던 페이지 내용은 잘 옮겨두어야한다. 
이러한 반복적인 상황은 flash chip들로 하여금 낡게 만든다. 

## 4. Flash Performance
- read latency는 SLC, MLC, TLC 모두 좋다. 
- 확실히 erase는 오래 걸린다. 
- 신뢰성과 관련해서는 디스크와는 다르게 실리콘이라서 소재로서 걱정할 것은 적다. 
  - 걱정할 것은 낡는 것이다. 시간이 지날수록 0과 1을 구분하지 못하게된다. 지우고 쓰는 걸 반복하기 때문이다. 
  - 두번째는 방해다. 어떤 페이지를 접근할 때 몇몇 비트가 이웃 페이지들에서 뒤바뀔 수가 있다. 이는 read disturbs , program disturbs라고 불린다. 

## 5. From Raw Flash to Flash based SSDs
어떻게 기본적 플래시 칩들을 전형적인 스토리지로 바꿀까? 
- 스탠다드 스토리지는 512바이트의 블록이다. 
- flash based SSD의 임무는, 이 스탠다드 블록 인터페이스가 플래시칩 위에 얹어지는 것이다. 

내부적으로는 SSD가 몇몇 플래시칩들을 포함하고 있다. 또 휘발성의 SRAM같은 메모리도 있다. 그리고 제어 로직도 갖추고 있다. 
- 이 제어로직은 read, write같은 것을 내부적으로 플래시 오퍼레이션으로 바꾸는 것이다. 해당일을 하는 레이어는 Flash translation layer, fTL이라 불린다. 
  - FTL은 읽기 쓰기를 논리 블록에서 물리 블록의 read, erase, program 작업을 하게끔한다. 
  - 훌륭한 성능과 신뢰도를 위함이다. 
    - 훌륭한 성능은 우선 병렬로 플래시 칩들을 사용하는, mfc를 사용하는 것이다. 또 다른 하나는 write amplification을 줄이는 것이다. 
    - 신뢰도는 program disturbance를 줄여야한다. 그를 위해 차례대로 erased block 내에서 page를 program 한다. 

## 6. FTL Organization: A Bad Approach
가장 간단하게는 direct mapped가 있다. 
- 이는 논리 페이지를 바로 물리 페이지에 매핑하는 것이다. 
- 논리페이지 쓰기는 조금 더 복잡하다; FTL은 먼저 전체 블록을 읽고, 지우고, program하게된다. 
- 이는 성능과 신뢰 모두에 문제가 있다. 
  - 성능 문제는 매 쓰기마다 있다. 읽고 지우고 쓰기를 반복해야하기 때문이다. 심지어 디스크보다 느리다.
  - 신뢰는 더 악화된다. 메타데이터나 유저 파일이 반복적으로 덮어써져서, 같은 블록이 지워지고 쓰여진다. 

## 7. A Log-Structured FTL
위의 문제들로, 대부분의 FTL들은 log structured 되었다. 
- 논리 블락에 쓰기를 하면, 디바이스는 현재 쓰고 있는 블록 다음의 free spot에다가 쓰기를 붙인다. 이를 로깅이라 한다. 
- 더불어 매핑 테이블을 두어서 논리 주소를 물리 주소로 바꿀 수 있게 한다. 
- 이를 통해 성능도 올리고 신뢰도도 확보한다.
- 다만 garbage가 생기는데, 주기적으로 GC가 필요하게 된다. 
- 또한 메모리 매핑 테이블의 비용이 디바이스가 커질수록 증가하는 문제도 있다. 