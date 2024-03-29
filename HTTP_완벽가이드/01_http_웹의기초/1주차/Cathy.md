### 1장 HTTP 개관
HTTP의 전반적인 것을 매우 간결하게 설명한 장
___ 


#### 웹 클라이언트와 서버
http는 웹 서버로부터 대량의 정보를 빠르고, 간편하게 전달. 웹콘텐츠는 웹서버에 저장한다.
웹서버는 http 프로토콜로 의사소통하기에 보통 http 서버라고 불린다. 

http 클라이언트는 웹콘텐츠를 이용하기 위해 http 서버에 요청을 보내고, http 서버는 그에 맞는 응답으로 클라이언트에 콘텐츠를 전달한다. 

>World Wide Web의 기본요소  
>http 클라이언트 <--> http 서버

#### 리소스
웹 리소스는 웹 콘텐츠의 원천
정적 콘텐츠 - 텍스트, 이미지, 워드, 동영상 파일 등등
동적 콘텐츠 - 사용자, 어떤 정보 요청에 따라 다른 컨텐츠를 생성함 ( 라이브, 주식거래, 추천영상 )

MIME타입 - 모든 객체 데이터에 타입을 붙임
_~~(크롬 개발자모드 네트워크 탭에서 주구장창 볼 수 있음)~~_
>ex: Content-type: image/jpeg (주 타입/ 부 타입)

#### 트랜잭션
요청 <-> 응답
메서드 - 서버에 어떤 동작이 이루어져야 하는가 (GET,POST,PUT.DEL,HEAD)
상태코드 - 요청에 대한 응답 상태 (3자리 숫자&사유 - 200,404)

#### 메세지
http 트랜잭션을 담은 줄 단위 문자열  
시작줄 - 요청, 응답  
헤더 - 요청, 응답에 추가된 헤더값  
본문 - 클라이언트 요청에 대한 데이터 반환  


#### TCP 커넥션
TBD

#### 웹 구성요소 
- Proxy
  - 주로 보안을 위해 사용 
- 캐시 
  - 클라이언트 자주 찾는 데이터의 사본을 저장하는 특별한 종류의 http proxy 서버
- 게이터웨이
  - http 트래픽을 다른 프로토콜로 변환하기 위해 사용
  - 스스로가 리소스를 갖고 있는 진짜 서버인 것처럼 요청을 다룬다.
  - HTTP/FTP -> HTTP 요청 받아들인 뒤, FTP 프로토콜을 이용해 문서를 가져옴 (카페 24...?)
- 터널
  - raw 데이터를 그대로 전달해주는 HTTP 어플리케이션
  - 암호화된 SSL 트래픽을 HTTP 커넥션으로 전송할때 활용함
- 에이전트 - http 요청을 만들어주는 클라이언트 프로그램 (봇)

### 2장 URL과 리소스
인터넷의 리소스를 가리키는 표준이름
URI = URL , URN  
URL: 리소스의 위치로 리소스 식별  
URN: 위차상관없이 이름만으로 리소스 식별  
___
#### URL 문법&구조 
- schem
  - 사용할 프로토콜
- host
  - 호스트 명이나 IP(도메인)
- Port
  - 스킴에 따라 기본 포트 적용, 생략가능
  - http: 80
  - https: 443
- Path
  - 정보가 저장된 route
- 파라미터
  - 쿼리만 날려보았지 아직 제대로 사용해본 적이 없어서 예시를 좀더 찾아봐야겠음
- query
  - 해당 페이지에서 필요로 하는 정보를 api에 요청하거나 분기를 타야할 때 주로 사용했음
- fragment
  - 서버로 전달하지 않고, 클라이언트에 렌더링 된 정보의 위치를 찾을 때

#### 안전하지 않은 문자

- 문자제한
  - 선점,제한된 문자를 제외하고 가능
  - 선점
    - 인코딩 : ```%```
    - 경로 : ```/``` ```.``` ```..```
    - 구획문자: ```#``` ```?``` ```;``` ```:```
    - 그 외: ```$``` ```+``` ```@``` ```&``` ```=```
  - 제한
    - 불안전
      - ```{}``` ```|``` ```\``` ```~``` ```[]``` ```<>``` ``` ` ``` ```"```
    - 0x00-0x1F, 0x7f, 0x7f 이상 (ASCII 코드표를 참고)
  - 숫자 또는 영어로만 가능하다고 생각하면 된다.



#### 참고자료  
[참조01 - ASCII 코드표](https://dojang.io/mod/page/view.php?id=740)   
[참조02 - URL 인코딩&디코딩](https://it-eldorado.tistory.com/143)  
[URL이란?](https://www.betterweb.or.kr/blog/url%EC%9D%B4%EB%9E%80/)
