# 식별
서버와 통신하는 대상을 어떻게 식별하나

### 헤더 
- from : 사용자의 이메일주소 포함
  - 한번도 사용해본적이ㅇ벗음 
- user-agent : 브라우저 이름과 버전 정보
  - 회사에서 플레이어 코덱 지원 또는 mobile, tablet 화면 비율 조정 등으로 브라우저, OS 구분하기 위해서 사용했었음
- referer : 사용자가 이전에 어떤 페이지 방문했는지 알려줌
  - 마케팅, 광고용으로 많이 사용하는가? 광고 측정용? 

### 클라이언트 IP
사용자의 ip 주소를 알아서 식별하려는 방법, 하지만 제약사항이 있음 

- IP주소는 사용자가 아니라, 컴퓨터를 가르킨다. -> 공용컴퓨터일 경우 사용자를 구분할 수 없음
- ISP 는 동적IP를 할당한다. -> IP가 매번 변하기 때문에 동일 사용자를 식별 할 수 없음
- NAT(네트워크 주소 변환)방화벽 -> 실제 IP주소는 뒤로 숨기고 방화벽 IP 주소로 변환
  -> P2P에서는 public ip 를 알아야하는데 NAT 방화벽으로 문제가 발생 
  -> 때문에 STUN 서버에 public ip를 확인하는 요청을 통해 다른 peer와 시그널링 시도
- 웹서버는 클라이언트 ip 대신 프락시 서버의 ip 주소를 본다. 

### 로그인 
Authorization 헤더로 사용자 식별 
-> 그냥 일반적인 로그인 시스템을 말하는 듯 

### 뚱뚱한 URL
서버는 url에 있는 상태 정보를 유지하는 하이퍼링크를 동적으로 생성, 식별번호를 각 URL에 붙여서 사용자 추적
-> 쿠팡 추천 URL에서 이런 식별 코드를 본 것 같다.
하지만 이것으로 사용자를 식별하기에는 아래와 같은 문제점이 있다. 

못생긴 URL -> 사용자에게 혼란
공유하지 못하는 URL -> URL이 사용자의 세션에 대한 정보가 있으므로 공유 불가
캐시 사용 불가 -> URL이 달라지므로 기존 캐시에 접근 불가
서버 부하 가중 -> 뚱뚱한 URL에 해당하는 페이지를 다시 그려야 한다.
이탈 -> 사용자가 다른 페이지로 이탈하기 쉬운데, 그럼 다시 뚱뚱한 URL로 돌아오기가 힘들다.
세션간 지속성의 부재 -> 로그아웃하면 모든 정보를 잃는다.

### 쿠키
식별하는 방법들 중 가장 널리 사용하는 방식
지속 쿠키는 브라우저 종료, 하드웨어 재시작에도 남아있음.
세션 쿠키는 브라우저 종료시 만료  
-> 현재는 쿠키보다 웹스토리지를 사용자 식별로 사용하고 있음.

클라이언트 측 상태  
- creation_utc: 쿠키가 생성된 시점
- host_key: 쿠키의 도메인
- name: 쿠키의 이름
- value: 쿠키의 값
- path: 도메인에 있는 경로
- expire_utc: 쿠키의 파기 시점, 초 단위
- secure: SSL 커넥션일 경우에만 보낼 지에 대한 정보

쿠키버전   
- RFC 6265가 나오면서 RFC 2109, RFC 2965(Version1 쿠키)는 폐기
- RFC 6265는 Name, Value, Expires, Domain, Max-Age, Path, Secure, HttpOnly
- Max-Age를 설정하면 자동으로 Expires가 정해진다.
- HttpOnly: 비 HTTP 요청을 막는다.


# 기본인증
허가된 사람만이 데이터에 접근할 수 있도록 서버는 사용자를 식별

- HTTP의 인증요구/응답 프레임워크
  - HTTP는 사용자 인증을 하는 데 사용하는 자체 인증요구/응답 프레임워크를 제공
- 인증 프로토콜과 헤더
  - 클라에서 데이터 요청을 하는데 인중이 필요한데 token 같은 것이 없을경우 서버에서 401(Unauthorized) 에러 던짐

- Base-64(Basic (RFC 7617)) 사용자 이름/비밀번호 인코딩
  - http 기본 인증은 사용자 이름과 비밀번호를 : 로 이어 붙여 base-64 인코딩
  - base-64 인코딩은 8비트 바이트로 이루어진 시퀀스를 6비트 덩어리의 시퀀스로 변환
  - 지금은 이 방식을 사용안하고 OAuth 2.0을 주로 사용하는 듯 ?!!

- JWT OAuth 2.0(RFC 6750)
  - Bearer (bearer tokens to access OAuth 2.0-protected resources) 
  - Basic 방식과는 달리 토큰에 ID, PW 값을 넣지 않는다.
  - 로그인 시 토큰을 부여받고, 이후 요청할 때 요청 헤더에 토큰을 실어서 보낸다.
  - 세션 저장소가 필요가 없고, 토큰 자체에 내장이 되어있다.
  - STATELESS, 무결성, 보안성이 장점



---- 
## 참고
- [HTTP쿠키와 톰캣 쿠키 프로세서 이야기](https://meetup.toast.com/posts/209)
- [JWT를 이해하기 전 Basic, Bearer 방식](https://iseunghan.tistory.com/364)
- [쿠키, 세션, 웹스토리지](https://doqtqu.tistory.com/306)

