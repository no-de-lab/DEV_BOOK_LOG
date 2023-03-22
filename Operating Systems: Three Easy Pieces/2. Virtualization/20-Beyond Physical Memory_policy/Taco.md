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
