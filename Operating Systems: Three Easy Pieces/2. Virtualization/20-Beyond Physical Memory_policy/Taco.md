남아있는 메모리가 많다면 조금 상황은 쉬워지겠지만, 현실은 그렇지않다. 
그렇기 때문에 어떻게 OS가 메모리로부터 페이지를 탈락시키는지 알 필요가 있다. 

## Cache Management
사실, 메인 메모리가 페이지를 가지고 있다면 이는 사실상 캐시의 역할을 한다고 할 수 있다. 
만약 캐시가 있다면 cache hit, 없다면 cache miss가 될 것이고, 이를 모두 안다고 가정할 때 AMAT(average memory access time)을 계산해볼 수 있겠다.
> AMAT = cost of accessing memory + (cost of accessing disk * probability of not finding the data in the cache)

- 이 계산을 하다보면, 디스크 접근하는 것이 몹시 비용이 많이든다는 것을 알 수 있다. 
- 따라서, 최대한 miss를 피하는 방향으로 OS 페이지 탈락 정책을 설계해야한다. 

## The Optimal Replacement Policy
이는 메모리에 올려야할 프로세스 리스트가 주어졌을 때, 최적으로 hit 난다면 어느정도일지 계산해볼 수 있는 정책이다.
이는 현실적이지는 않지만 가이드라인으로 활용이 가능하다.

최적 policy는, 프로세스를 메모리에 올릴 때 가장 나중에 다시 올릴 메모리 순으로 페이지를 잘라낸다. 
하지만 이를 알 수는 없기 때문에, 현실에서 적용하기는 어렵겠다. 

## The Simple Policy: FIFO
제일 먼저 올라왔던 페이지부터 탈락시키는 것이다. 
해당 페이지의 접근이 계속 될 것이라는 것과는 관계가 없다. 

## Another Simple Policy: Random
랜덤하게 페이지를 탈락시키는 것인데, 이 또한 운에 그저 맡기는 것이라서 miss rate를 증가시킬 위험이 있다. 

## Using History: LRU
흐름에 의미있는 요인을 기준으로 페이지를 교체하는 것이다 : 그리고 그 요인을 빈도로 파악했다. 
- 지역성 이용 
- Least Frequently Used, Least Recently Used 
- LRU의 경우에는 가장 최근에 사용되지 않았던 페이지를 탈락시킨다.
- 이 반대로 MFU, MRU도 있다 (가장 많이 사용된, 가장 최근에 사용된)

## Workload Examples
각각의 다른 특징이 있는 workload를 가지고 위의 FIFO, Random, LRU의 성능을 비교해본다. 
- 지역성이 없는 workload
  - 세가지 정책의 성능이 모두 같다.
- 80-20 workload (80%는 방문한 20% 페이지들로 이루어져있음)
  - LRU가 아무래도 더 많은 캐시 페이지를 가지고 있기 때문에, 성능이 더 좋게 나온다.
- looping sequential workload (0부터 49까지 순차적으로, 다시 50번째부터는 0부터 시작)
  - 오히려 Random이 더 좋다. 
  - 캐시 사이즈가 50% 이상이 되어야 LRU, FIFO에서 성능이 난다 

## Implementing Historical Algorithms
LRU가 전반적으로 좋은 성능을 보이는 알고리즘이라는 것은 알겠는데, 이를 어떻게 실행할 것인가. 
모든 페이지 접근마다 자료구조를 업데이트 해야한다. 신경쓰지않는다면, 페이지 계산 성능은 좋지 않을 것이다.

이를 빠르게 할 방법 하나는 hardware support를 조금 받는 것이다. 메모리의 time field를 설정하는 것이다. 그래서 페이지를 교체할 때 OS가 모든 타임 필드를 확인한다. 

그러나, 이는 페이지 수가 많아질수록 어렵다. 
그냥 절대값을 체크하지 말고, 추정값을 이용하는 것이 좋을 것 같다.

## Approximating LRU
실제로 추정값을 이용할 수 있다. 그는 하드웨어가 use bit(reference bit)이라는 것을 페이지가 참조될 때 1로 등록해주는 것에서부터 시작한다.

이렇게 하드웨어가 등록하면 그는 절대 그를 0으로 재등록할 수는 없다. 0으로 바꿔주는 것은 OS의 몫이다. 어떻게?
- clock 알고리듬 사용
- clock hand가 특정 페이지를 가리킬 때 use bit이 1이었다면, 그를 0으로 바꿔주고
- 0이었다면 그것은 교체할 페이지다. 
- 실제로 비교해봤을 때 이상적인 LRU의 성능은 아닐지라도, 거의 유사하다

## Considering dirty Pages
페이지가 만약 수정이 되었다면? 그 수정된 페이지를 다시 디스크에 적용해야한다. 그는 비용이 들기 때문에, 해당 dirty page보다는 clean page를 evict하고싶아헌다. 
이를 위해 하드웨어는 dirty bit라는 것을 두어서, 페이지 교체 알고리듬에 적용하였다. 
clock 알고리듬을 사용하며 dirty bit까지 확인하는 것이다.

## Other VM Policies
단지 page replacement 전략만 VM 하위 시스템이 들여온 게 아니고, 언제 페이지를 들여올지에 대한 정책도 있다. 이는 page selection policy라 한다. 
대부분의 페이지에서 OS는 요구 페이징을 사용한다. 실제로 요구사항이 있을 대 가져오는 것이다. 

미리 예측하기도 한다. 

또 다른 정책은 페이지를 디스크로 뺄 때, Os가 변화를 어떻게 적용하는지이다. 이런 변화 있는 페이지를 한번에 보아서 적용하여, 보다 효율적인 작업이 되게 한다.

## Thrashing
만약 메모리가 메모리 이상으로 사용하에 할 때 어떻게 OS는 대처하는가? 이 현상을 스래싱이라 한다. 

몇몇 초기 OS의 방법은: 프로세스 몇몇을 돌리지 않는 것이다. 이를 admission control이라 한다. 

최신 시스템은 아예 프로세스를 kill한다.