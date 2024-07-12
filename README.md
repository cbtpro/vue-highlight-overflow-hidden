# Vite Vue Starter

This is a project template using [Vite](https://vitejs.dev/). It requires [Node.js](https://nodejs.org) version 18+ or 20+.

To start:

```sh
npm install
npm run dev

# if using yarn:
yarn
yarn dev

# if using pnpm:
pnpm install
pnpm run dev
```

正则表达式：

\p{Script=Han}：匹配汉字。
\p{Script=Thai}：匹配泰文。
\p{Script=Cyrillic}：匹配西里尔字母。
\s：匹配空格字符。
[\u0028\u0029\uFF08\uFF09\u002C\u3001\u002E\u3002\u003B\uFF1B\u002D\u2013\u2014\uFF0D]：
\u0028：半角左括号 (
\u0029：半角右括号 )
\uFF08：全角左括号 （
\uFF09：全角右括号 ）
\u002C：英文逗号 ,
\u3001：中文顿号 、
\u002E：英文句号 .
\u3002：中文句号 。
\u003B：英文分号 ;
\uFF1B：中文分号 ；
\u002D：半角连字符 -
\u2013：En dash –
\u2014：Em dash —
\uFF0D：全角连字符 －
正则表达式分组：

(?=...)：正向前瞻，匹配但不消费字符。
(?<=...)：正向后瞻，匹配但不消费字符。