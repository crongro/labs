###
## 1. u flag
u flag 로 unicode를 비교할 수 있다.

```javascript
/\u{1f40e}/u.test('🐎')
```


## 2. stick flag
lastIndex에 딱 매칭되는 것이 없으면 더이상 찾지 않는다.
```javascript
var str = '##foo#';

var regex = /foo/g;
var regex_sticky = /foo/u;

regex.lastIndex = 1;
regex.test(str); // true

regex_sticky.lastIndex = 1;
regex_sticky.test(str); // false
```

## 3. Named capture groups

그룹으로 매칭된 결과를 key, value객체로 만들 수 있다.
(spread operator와 객체를 쉽게 작성하는 방법으로 가능함)

```javascript
var regex = /(\w+)\s+(\w+)/;
var [fullMatch,key,value] = regex.exec('ilove you');
console.log({key,value});
VM3479:3 Object {key: "ilove", value: "you"}
```

그럼데 Named capture groups 라는 스펙이 진행중이다.
(TC39의 stage3)
아직 브라우저 지원은 없는 듯.
```javascript
var regex = /(?<key>\w+)\s+(?<value>\w+)/;
var { groups } = regex.exec('ilove you');
console.log(groups);  //{key:ilove, value:you}
```

name:password가 같은 경우같은 것을 검사할때 유용한 기능.
그룹으로 잡힌 부분과 중복인 부분을 이어서 \1로 표현한 사례.
```javascript
function hasSameUserAndPassword(input) {
  const rduplicate = /([^:]+):\1/
  return rduplicate.exec(input) !== null
}
hasSameUserAndPassword('root:root') // <- true
hasSameUserAndPassword('root:pF6GGlyPhoy1!9i') // <- false

//그런데 Named capture groups에서는 이렇게 가능.
function hasSameUserAndPassword(input) {
  const rduplicate = /(?<user>[^:]+):\k<user>/
  return rduplicate.exec(input) !== null
}
hasSameUserAndPassword('root:root') // <- true
hasSameUserAndPassword('root:pF6GGlyPhoy1!9i') // <- false
```

참고 : https://github.com/tc39/proposal-regexp-named-groups

## 4. Unicode Property Escapes
한글인지, Greek인지 등을 알수 있는 있는 방법.
```javascript
function isGreekSymbol(input) {
  const rgreek = /^\p{Script=Greek}$/u
  return rgreek.test(input)
}
isGreekSymbol('π')
// <- true
```


##5. lookahead, lookbehind
먼저 이해. 
참고 : http://unlimitedpower.tistory.com/entry/%EC%A0%95%EA%B7%9C%ED%91%9C%ED%98%84%EC%8B%9D-%EC%9D%B4%EA%B2%83%EC%9D%B4-%EA%B3%A0%EA%B8%89%EC%9D%B4%EB%8B%A4-Positive-Negative-Lookahead-Lookbehind

```javascript
function getJavaScriptFilename(input) {
  const rfile = /^(?<filename>[a-z]+)(?=\.js)\.[a-z]+$/
  const match = rfile.exec(input)
  if (match === null) {
    return null
  }
  return match.groups.filename
}
getJavaScriptFilename('index.js') // <- 'index'
getJavaScriptFilename('index.php') // <- null
```

look behind
```javascript
function getDollarAmount(input) {
  const rdollars = /^(?<=\$)(?<amount>\d+(?:\.\d+)?)$/
  const match = rdollars.exec(input)
  if (match === null) {
    return null
  }
  return match.groups.amount
}
getDollarAmount('$12.34') // <- '12.34'
getDollarAmount('€12.34') // <- null
```

### 6. dotAll flag
```javascript
const rcharacter = /^.$/
rcharacter.test('a') // <- true
rcharacter.test('\t') // <- true
rcharacter.test('\n') // <- false
```

dotAll을 사용하면,
```javascript
const rcharacter = /^.$/s
rcharacter.test('a') // <- true
rcharacter.test('\t') // <- true
rcharacter.test('\n') // <- true
```

