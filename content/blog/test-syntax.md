---
title: "Blog Syntax Test"
date: "2026-09-03"
tags: ["testing", "markdown", "syntax"]
---

This post exercises **bold text**, *italic text*, and ***bold italic text***.

It also includes an [example link](https://example.com) and an inline `const value = 42` code sample.

# Heading One

## Heading Two

### Heading Three

![A cathedral sky](../../../assets/cathedral/sky.jpg)

---

> This is a blockquote showing an important note.

- First unordered item
- Second unordered item
- Third unordered item

- [x] Completed task
- [ ] Incomplete task

| Feature | Supported |
| --- | --- |
| Headings | Yes |
| Tables | Yes |
| Code | Yes |

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('reader'));
```

## Copyable Syntax Reference

The following reference shows the Markdown syntax supported by this blog generator. Replace `[three backticks]` with three backticks when creating a fenced code block.

```text
# Heading One
## Heading Two
### Heading Three

**bold**
*italic*
***bold italic***

[link text](https://example.com)
![image alt text](../../../assets/cathedral/sky.jpg)

---

> Blockquote text

- Unordered list item
- Another list item

- [x] Completed task
- [ ] Incomplete task

| Column One | Column Two |
| --- | --- |
| Value | Value |

Inline `code`

[three backticks]javascript
console.log('fenced code');
[three backticks]
```
